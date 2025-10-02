import { Template } from '../entities/template.entity';

/**
 * Defines the contract for the templates repository.
 * This interface acts as a port in the Clean Architecture, allowing the application layer
 * to depend on an abstraction for data persistence rather than a concrete implementation.
 */
export interface ITemplatesRepository {
  /**
   * Finds a single notification template by its unique key.
   * Templates are often fetched by a key that corresponds to a business event
   * (e.g., 'order.confirmed.sms').
   * @param key The unique key of the template.
   * @returns A Promise that resolves to the Template entity if found, otherwise null.
   */
  findByKey(key: string): Promise<Template | null>;

  /**
   * Retrieves all notification templates from the repository.
   * This method might be used for administrative purposes or to pre-load/cache all templates on application startup.
   * @returns A Promise that resolves to an array of all Template entities.
   */
  findAll(): Promise<Template[]>;

  /**
   * Saves a new or updated template to the repository.
   * This method would be used by an administrative feature to manage notification templates.
   * @param template The Template entity to save.
   * @returns A Promise that resolves to the saved Template entity.
   */
  save(template: Template): Promise<Template>;
}

/**
 * Dependency Injection token for the Templates Repository.
 * This token is used to inject the concrete repository implementation where the
 * ITemplatesRepository interface is required.
 */
export const TEMPLATES_REPOSITORY = 'TEMPLATES_REPOSITORY';