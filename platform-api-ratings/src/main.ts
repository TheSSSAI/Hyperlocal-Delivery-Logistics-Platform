import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

/**
 * The bootstrap function is the entry point of the NestJS application.
 * It creates the application instance, configures global middleware,
 * pipes, filters, and starts the server.
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create a winston logger instance for structured logging
  const winstonLogger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          process.env.NODE_ENV === 'production'
            ? winston.format.json() // Use JSON format in production for structured logging
            : winston.format.printf(
                ({ level, message, context, timestamp, ms }) => {
                  return `${timestamp} [${context}] ${level}: ${message} ${ms}`;
                },
              ), // Use a more readable format in development
        ),
      }),
    ],
  });

  // Create the NestJS application instance with the custom logger
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  // Retrieve ConfigService to access environment variables
  const configService = app.get(ConfigService);

  // Enable CORS (Cross-Origin Resource Sharing)
  // This is essential for allowing frontend applications from different origins
  // to interact with the API.
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',') : '*', // Allow specific origins or all
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  logger.log(`CORS enabled for origin(s): ${corsOrigin || '*'}`);

  // Set a global prefix for all API routes to 'api/v1'
  // This helps in versioning the API. (REQ-1-092)
  app.setGlobalPrefix('api/v1');
  logger.log('Global API prefix set to /api/v1');

  // Apply a global ValidationPipe to enforce DTO validation rules.
  // This ensures all incoming request bodies are validated against their DTO classes.
  // 'whitelist' strips any properties that do not have decorators.
  // 'forbidNonWhitelisted' throws an error if non-whitelisted properties are present.
  // This is a crucial security measure against mass assignment vulnerabilities. (REQ-1-098)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allows for automatic type conversion
      },
    }),
  );
  logger.log('Global ValidationPipe configured with whitelist and forbidNonWhitelisted');

  // Apply a global exception filter to standardize error responses.
  // This ensures a consistent error response structure across the entire API.
  app.useGlobalFilters(new HttpExceptionFilter());
  logger.log('Global HttpExceptionFilter configured');

  // Enable graceful shutdown hooks. This allows NestJS to handle system signals
  // (like SIGTERM from Kubernetes) to gracefully close connections and shut down.
  // (REQ-1-018)
  app.enableShutdownHooks();
  logger.log('Shutdown hooks enabled');

  // Configure OpenAPI (Swagger) for API documentation.
  // This is only enabled in non-production environments for security and performance.
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Platform Ratings Service API')
      .setDescription(
        'API for managing user-generated ratings and reviews for vendors and riders.',
      )
      .setVersion('1.0')
      .addBearerAuth() // Assumes JWT Bearer token authentication
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/v1/docs', app, document);
    logger.log('Swagger UI configured and available at /api/v1/docs');
  }

  // Get the port from configuration and start the application
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  logger.log(`🚀 Ratings Service is running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 API documentation available at: http://localhost:${port}/api/v1/docs`);
}

// Start the application
bootstrap();