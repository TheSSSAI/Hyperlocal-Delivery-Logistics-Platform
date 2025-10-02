import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

/**
 * The main entry point for the Order Management Service.
 * This function bootstraps the NestJS application, configures global middleware,
 * pipes, filters, and starts the HTTP server.
 */
async function bootstrap() {
  // Create the NestJS application instance, replacing the default logger with Pino
  // for structured, production-ready logging as per REQ-1-108.
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until the Pino logger is ready
  });

  // Use the Pino logger as the main application logger.
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Retrieve ConfigService for accessing environment variables.
  const configService = app.get(ConfigService);
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const port = configService.get<number>('PORT') || 3000;

  // Apply Helmet middleware for basic security headers, fulfilling OWASP recommendations (REQ-1-098).
  app.use(helmet());

  // Configure Cross-Origin Resource Sharing (CORS) for security.
  // In a production environment, this should be locked down to specific origins.
  app.enableCors({
    origin: isProduction
      ? configService.get<string>('CORS_ORIGIN')
      : '*', // More permissive in non-production environments
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Set a global prefix for all routes to 'api', enabling versioning.
  // This fulfills the API versioning requirement from REQ-1-092.
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Apply a global ValidationPipe to enforce DTO contracts and enhance security.
  // - whitelist: strips properties that are not in the DTO.
  // - forbidNonWhitelisted: throws an error if non-whitelisted properties are present.
  // - transform: automatically transforms incoming payloads to DTO class instances.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Apply the global exception filter to ensure all unhandled exceptions
  // are caught and formatted into a consistent, structured error response.
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Enable graceful shutdown hooks. This is crucial for containerized environments
  // like Kubernetes (EKS as per REQ-1-018), allowing the app to properly
  // close connections and finish ongoing requests before exiting on SIGTERM.
  app.enableShutdownHooks();

  // Start the application and listen on the configured port.
  await app.listen(port);

  logger.log(
    `🚀 Order Management Service is running on: http://localhost:${port}/api/v1`,
  );
  logger.log(`🌱 Environment: ${configService.get<string>('NODE_ENV')}`);
}

// Bootstrap the application. A top-level try-catch block handles any fatal
// errors during the startup process, ensuring they are logged before the process exits.
bootstrap().catch((error) => {
  // Use a simple console.error for bootstrap-level failures, as the logger might not be initialized.
  console.error('❌ Fatal error during application bootstrap:', error);
  process.exit(1);
});