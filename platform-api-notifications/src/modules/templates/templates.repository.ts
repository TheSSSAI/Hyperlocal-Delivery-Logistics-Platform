import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from './entities/template.entity';
import { ITemplatesRepository } from './interfaces/templates-repository.interface';

@Injectable()
export class TemplatesRepository implements ITemplatesRepository {
  private readonly logger = new Logger(TemplatesRepository.name);

  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
  ) {}

  /**
   * Finds a single notification template by its unique key.
   * @param key The unique key of the template (e.g., 'order.confirmed.sms').
   * @returns A promise that resolves to the Template entity or null if not found.
   */
  async findByKey(key: string): Promise<Template | null> {
    this.logger.debug(`Finding template by key: ${key}`);
    try {
      const template = await this.templateRepository.findOne({
        where: { key },
        cache: true, // Enable caching for this query for performance
      });
      if (!template) {
        this.logger.warn(`Template with key '${key}' not found.`);
        return null;
      }
      return template;
    } catch (error) {
      this.logger.error(`Error finding template with key '${key}': ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Finds all notification templates.
   * @returns A promise that resolves to an array of all Template entities.
   */
  async findAll(): Promise<Template[]> {
    this.logger.debug('Finding all templates.');
    try {
      return await this.templateRepository.find();
    } catch (error) {
      this.logger.error(`Error finding all templates: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Creates a new notification template.
   * @param createTemplateDto The data transfer object containing the new template's data.
   * @returns A promise that resolves to the newly created Template entity.
   */
  async create(createTemplateDto: Partial<Template>): Promise<Template> {
    this.logger.log(`Creating new template with key: ${createTemplateDto.key}`);
    try {
      const newTemplate = this.templateRepository.create(createTemplateDto);
      return await this.templateRepository.save(newTemplate);
    } catch (error) {
      this.logger.error(`Error creating template with key '${createTemplateDto.key}': ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates an existing notification template.
   * @param id The ID of the template to update.
   * @param updateTemplateDto The data to update.
   * @returns A promise that resolves to the updated Template entity.
   */
  async update(id: number, updateTemplateDto: Partial<Template>): Promise<Template> {
    this.logger.log(`Updating template with ID: ${id}`);
    try {
      const template = await this.templateRepository.preload({
        id,
        ...updateTemplateDto,
      });
      if (!template) {
        throw new Error(`Template with ID '${id}' not found.`);
      }
      return await this.templateRepository.save(template);
    } catch (error) {
      this.logger.error(`Error updating template with ID '${id}': ${error.message}`, error.stack);
      throw error;
    }
  }
}