/**
 * @file Defines the contract for the platform's standardized logger service.
 * @description This interface ensures that any logger implementation used across
 * the platform adheres to a consistent set of methods for structured logging.
 * It is designed to be injected via DI, decoupling application code from the
 * concrete logger implementation (e.g., Pino.js).
 */

/**
 * A type alias for a structured context object that can be passed to log methods.
 * This allows for adding arbitrary, structured data to log messages.
 */
export type LogContext = Record<string, any>;

/**
 * ILogger defines the standard interface for logging services across the platform.
 * It extends the basic console methods with signatures that support structured
 * context objects, ensuring all logs can be enriched with relevant data.
 */
export interface ILogger {
  /**
   * Logs a message at the 'log' level.
   * @param message The primary log message.
   * @param context Optional structured data to include in the log entry.
   */
  log(message: string, context?: LogContext): void;

  /**
   * Logs a message at the 'error' level. Typically used for unhandled exceptions
   * or significant operational failures.
   * @param message The primary error message.
   * @param error Optional Error object. Its stack trace will be serialized.
   * @param context Optional structured data to include in the log entry.
   */
  error(message: string, error?: Error, context?: LogContext): void;

  /**
   * Logs a message at the 'warn' level. Used for potential issues that do not
   * prevent the current operation from completing but may require attention.
   * @param message The primary warning message.
   * @param context Optional structured data to include in the log entry.
   */
  warn(message: string, context?: LogContext): void;

  /**
   * Logs a message at the 'debug' level. Used for detailed diagnostic information,
   * typically disabled in production environments.
   * @param message The primary debug message.
   * @param context Optional structured data to include in the log entry.
   */
  debug(message: string, context?: LogContext): void;

  /**
   * Logs a message at the 'verbose' (or 'trace') level. Used for highly detailed,
   * fine-grained diagnostic information.
   * @param message The primary verbose message.
   * @param context Optional structured data to include in the log entry.
   */
  verbose(message: string, context?: LogContext): void;

  /**
   * Sets the context for this logger instance (e.g., the class name).
   * This is useful for providing a default context for all logs from a specific class.
   * @param context The context string (e.g., 'UsersService').
   */
  setContext?(context: string): void;
}