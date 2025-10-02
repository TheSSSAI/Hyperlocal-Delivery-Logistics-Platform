import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConsumersService } from './modules/consumers/consumers.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const serviceName = 'NotificationsService';

  try {
    const app = await NestFactory.create(AppModule, {
      // The shared observability library should configure the logger.
      // If not, we would configure Pino or another structured logger here.
    });

    // --- Global Configuration ---

    // Enable CORS - Good practice, though this service has no controllers.
    app.enableCors({
      origin: '*', // Or more restrictive in production
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Enable graceful shutdown hooks. This is CRITICAL for a service
    // with long-running processes like an SQS poller. It ensures
    // OnModuleDestroy hooks are called on SIGTERM/SIGINT.
    app.enableShutdownHooks();

    // Apply global validation pipe. This ensures all incoming DTOs
    // (e.g., from deserialized SQS messages) are automatically validated
    // against their class-validator decorators.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strip properties that do not have any decorators
        forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
        transform: true, // Automatically transform payloads to be objects typed by their DTO classes
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3004);

    // --- Start Listening ---

    await app.listen(port);
    logger.log(`🚀 ${serviceName} is running on: http://localhost:${port}`);
    logger.log(`✅ Application bootstrap complete.`);

    // --- Start Long-Running Processes ---
    // The ConsumersService is designed to start polling on application bootstrap
    // using the OnApplicationBootstrap lifecycle hook. The act of creating the app
    // and listening is sufficient to start it. This ensures that the application is
    // fully initialized and listening for health checks before it starts consuming
    // messages from the queue. We can explicitly get the service to log its start.
    const consumersService = app.get(ConsumersService);
    if (consumersService) {
      logger.log('SQS Consumer service has been initialized and will start polling.');
    } else {
      logger.error('FATAL: SQS Consumer service could not be retrieved from the application context.');
      await app.close();
      process.exit(1);
    }

  } catch (error) {
    logger.error(`❌ Failed to bootstrap the ${serviceName}. Error: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap();