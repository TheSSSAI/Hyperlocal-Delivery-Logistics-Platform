import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisIoAdapter } from './shared/adapters/redis-io.adapter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until Pino logger is attached
  });

  // --- Configuration ---
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);
  const environment = configService.get<string>('node_env', 'development');

  // --- Logging ---
  app.useLogger(app.get(Logger));

  // --- Security: CORS ---
  app.enableCors({
    origin: configService.get<string>('cors.origin', '*').split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // --- WebSocket Adapter for Scaling ---
  const redisIoAdapter = new RedisIoAdapter(app, configService);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // --- API Versioning ---
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });

  // --- Global Pipes for Validation ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert primitive types
      },
    }),
  );

  // --- OpenAPI (Swagger) Documentation ---
  if (environment !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Platform Logistics Service API')
      .setDescription(
        'API documentation for the microservice handling delivery logistics, rider allocation, and real-time tracking.',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  // --- Graceful Shutdown ---
  app.enableShutdownHooks();

  // --- Start Application ---
  await app.listen(port);
  const logger = app.get(Logger);
  logger.log(
    `🚀 Logistics Service is running on: http://localhost:${port} in ${environment} mode.`,
  );
  logger.log(`📚 Swagger docs available at http://localhost:${port}/docs`);
}

bootstrap().catch((error) => {
  // Use a plain console.error here because the logger might not be initialized
  console.error('Failed to bootstrap the application', error);
  process.exit(1);
});