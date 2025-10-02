import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import helmet from '@fastify/helmet';
// Assume bootstrapTracer is provided by the observability library
// import { bootstrapTracer } from '@platform/observability';

/**
 * The main entry point for the Identity & Access microservice.
 * This function initializes, configures, and bootstraps the NestJS application.
 */
async function bootstrap() {
  // Step 1: Initialize distributed tracing. This must be the first step.
  // bootstrapTracer('platform-api-identity');

  const logger = new Logger('Bootstrap');

  try {
    // Step 2: Create the NestJS application instance with the Fastify adapter for performance.
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        // The logger can be customized here if needed, but we will rely on NestJS's default logger for bootstrap
        // and inject a custom structured logger in services.
      }),
      {
        // Replace the default NestJS logger with our custom logger for bootstrap messages.
        // This should be replaced with a structured logger from the observability library.
        logger: new Logger(),
      },
    );

    // Step 3: Retrieve the ConfigService to access environment variables.
    const configService = app.get(ConfigService);
    const port = configService.get<number>('app.port', 3000);
    const corsOrigins = configService.get<string[]>('app.corsOrigins', []);

    // Step 4: Apply security middleware.
    // Helmet helps secure the app by setting various HTTP headers.
    await app.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    });

    // Step 5: Enable Cross-Origin Resource Sharing (CORS).
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || corsOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    });

    // Step 6: Set a global prefix for all API routes (e.g., /api).
    app.setGlobalPrefix('api');

    // Step 7: Enable API versioning.
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
      prefix: 'v',
    });

    // Step 8: Apply global pipes for request validation.
    // This ensures all incoming DTOs are validated against their definitions.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strips properties that do not have any decorators
        forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are provided
        transform: true, // Automatically transforms payloads to be objects typed according to their DTO classes
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Step 9: Apply global exception filters for standardized error responses.
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

    // Step 10: Enable graceful shutdown hooks.
    // This allows the application to gracefully handle termination signals (e.g., from Kubernetes).
    app.enableShutdownHooks();

    // Step 11: Start the application listener.
    await app.listen(port, '0.0.0.0');
    logger.log(
      `🚀 Identity & Access service is running on: http://localhost:${port}/api`,
    );
    logger.log(`🌍 Accepting requests from origins: ${corsOrigins.join(', ')}`);
  } catch (error) {
    logger.error('❌ Failed to bootstrap the application.', error);
    process.exit(1);
  }
}

// Start the bootstrap process.
bootstrap();