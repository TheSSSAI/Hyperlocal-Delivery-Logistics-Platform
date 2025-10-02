import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      {
        // Disable default NestJS logger if using a custom one, but for this
        // service we will use the default logger with context.
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
      },
    );

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);
    const environment = configService.get<string>('NODE_ENV', 'development');
    const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');

    app.setGlobalPrefix('api/v1');

    app.enableCors({
      origin: corsOrigin.split(','),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strips away properties that do not have any decorators
        transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
        forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
        transformOptions: {
          enableImplicitConversion: true, // Automatically convert primitive types
        },
      }),
    );

    const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

    // Enable graceful shutdown
    app.enableShutdownHooks();

    await app.listen(port, '0.0.0.0');

    logger.log(`🚀 Application is running in ${environment} mode`);
    logger.log(`✅ Listening on port ${port}`);
    logger.log(`🌐 API available at http://localhost:${port}/api/v1`);
  } catch (error) {
    logger.error('❌ Error during application bootstrap', error);
    process.exit(1);
  }
}

bootstrap();