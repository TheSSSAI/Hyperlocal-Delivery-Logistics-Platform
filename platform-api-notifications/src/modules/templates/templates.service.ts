import {
  Injectable,
  Inject,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ITemplatesRepository } from './interfaces/templates-repository.interface';
import { Template } from './entities/template.entity';

@Injectable()
export class TemplatesService implements OnModuleInit {
  private readonly cachePrefix = 'template:';
  private readonly cacheTtl = 3600 * 1000; // 1 hour in milliseconds

  constructor(
    @Inject('ITemplatesRepository')
    private readonly templatesRepository: ITemplatesRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.logger = this.logger.child({ context: TemplatesService.name });
  }

  /**
   * NestJS lifecycle hook that runs once the module has been initialized.
   * Pre-warms the cache by loading all templates from the database.
   */
  async onModuleInit() {
    this.logger.info('Preloading notification templates into cache...');
    await this.preloadTemplates();
  }

  /**
   * Renders a notification template with the provided data.
   * It fetches the template using a cache-aside strategy and then performs
   * placeholder replacement.
   * @param key - The unique key of the template (e.g., 'order.confirmed.sms').
   * @param data - An object containing key-value pairs for placeholder replacement.
   * @returns The rendered template content as a string.
   * @throws NotFoundException if the template key does not exist.
   * @throws InternalServerErrorException for other unexpected errors.
   */
  async renderTemplate(
    key: string,
    data: Record<string, any>,
  ): Promise<string> {
    this.logger.debug(`Rendering template with key: ${key}`);
    try {
      const template = await this.getTemplateByKey(key);
      let content = template.content;

      for (const placeholder in data) {
        if (Object.prototype.hasOwnProperty.call(data, placeholder)) {
          const regex = new RegExp(`{{${placeholder}}}`, 'g');
          if (content.match(regex)) {
            content = content.replace(regex, data[placeholder]);
          }
        }
      }

      // Check for any un-replaced placeholders
      const remainingPlaceholders = content.match(/{{(.*?)}}/g);
      if (remainingPlaceholders) {
        this.logger.warn(
          `Template "${key}" was rendered with un-replaced placeholders: ${remainingPlaceholders.join(', ')}`,
        );
      }

      return content;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.error(`Template with key "${key}" not found.`);
        throw error;
      }
      this.logger.error(
        `Failed to render template for key "${key}"`,
        error.stack,
      );
      throw new InternalServerErrorException('Error rendering notification template.');
    }
  }

  /**
   * Retrieves a single template by its key, utilizing a cache-aside strategy.
   * @param key - The unique key of the template.
   * @returns The Template entity.
   * @throws NotFoundException if the template key is not found in cache or database.
   */
  private async getTemplateByKey(key: string): Promise<Template> {
    const cacheKey = `${this.cachePrefix}${key}`;

    try {
      const cachedTemplate: Template | undefined =
        await this.cacheManager.get(cacheKey);

      if (cachedTemplate) {
        this.logger.debug(`Cache hit for template key: ${key}`);
        // Re-hydrate the entity from plain object if necessary for methods, etc.
        const template = new Template();
        Object.assign(template, cachedTemplate);
        return template;
      }

      this.logger.debug(`Cache miss for template key: ${key}. Fetching from repository.`);
      const template = await this.templatesRepository.findByKey(key);

      if (!template) {
        throw new NotFoundException(`Template with key "${key}" not found.`);
      }

      await this.cacheManager.set(cacheKey, template, this.cacheTtl);
      this.logger.debug(`Template key "${key}" has been cached.`);
      return template;
    } catch (error) {
      this.logger.error(`Error retrieving template for key "${key}"`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Could not retrieve template.');
    }
  }

  /**
   * Fetches all templates from the repository and populates the cache.
   * This is used to pre-warm the cache on application startup.
   */
  async preloadTemplates(): Promise<void> {
    try {
      const templates = await this.templatesRepository.findAll();
      const cachePromises = templates.map(template => {
        const cacheKey = `${this.cachePrefix}${template.key}`;
        return this.cacheManager.set(cacheKey, template, this.cacheTtl);
      });

      await Promise.all(cachePromises);
      this.logger.info(
        `Successfully preloaded and cached ${templates.length} templates.`,
      );
    } catch (error) {
      this.logger.error('Failed to preload templates into cache.', error.stack);
      // We don't throw here to allow the application to start, it will fallback to on-demand caching.
    }
  }

  /**
   * Manually clears the entire template cache.
   * Useful for administrative purposes when templates are updated directly
   * in the database and need to be re-fetched.
   */
  async clearCache(): Promise<void> {
    this.logger.info('Clearing all notification template caches...');
    const keys: string[] = await this.cacheManager.store.keys(
      `${this.cachePrefix}*`,
    );

    if (keys.length > 0) {
      const deletePromises = keys.map(key => this.cacheManager.del(key));
      await Promise.all(deletePromises);
    }
    
    this.logger.info(`Cleared ${keys.length} template cache entries.`);
    // Optionally, we can re-trigger preloading
    await this.preloadTemplates();
  }
}