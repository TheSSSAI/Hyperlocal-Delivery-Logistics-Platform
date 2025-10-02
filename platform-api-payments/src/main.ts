import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Enable structured logging for production environments like CloudWatch
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['log', 'debug', 'error', 'warn', 'verbose'],
  });

  const configService = app.get(ConfigService);

  const appName = configService.get<string>('app.name');
  const port = configService.get<number>('app.port');
  const globalPrefix = configService.get<string>('app.globalPrefix');
  const nodeEnv = configService.get<string>('NODE_ENV');

  // --- Global Middleware & Configuration ---

  // Set a global prefix for all routes (e.g., /api/v1)
  app.setGlobalPrefix(globalPrefix);

  // Enable CORS
  app.enableCors({
    origin: configService.get<string[]>('app.corsOrigins'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Apply a global validation pipe to automatically validate incoming DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted values are provided
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable graceful shutdown hooks for container orchestration (e.g., Kubernetes)
  app.enableShutdownHooks();

  // --- Swagger (OpenAPI) Documentation ---
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(`${appName} API`)
      .setDescription(
        'API documentation for the Payments & Settlements Microservice.',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
    Logger.log(
      `Swagger documentation available at http://localhost:${port}/${globalPrefix}/docs`,
      'Bootstrap',
    );
  }

  // --- Start Application ---
  await app.listen(port);

  Logger.log(
    `🚀 ${appName} is running on: http://localhost:${port}/${globalPrefix}`,
    'Bootstrap',
  );
  Logger.log(`🌱 Environment: ${nodeEnv}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  Logger.error(`❌ Failed to bootstrap application: ${error}`, 'Bootstrap');
  process.exit(1);
});