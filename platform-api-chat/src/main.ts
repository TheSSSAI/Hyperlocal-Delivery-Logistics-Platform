import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  INestApplicationContext,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

/**
 * A custom WebSocket adapter that uses Redis for broadcasting events across multiple instances.
 * This is essential for horizontal scalability in a containerized environment like Kubernetes.
 * It ensures that a message sent from a client connected to one pod can be received by a
 * client connected to a different pod, as long as they are in the same Socket.IO room.
 *
 * This implementation directly addresses the critical architectural requirement REQ-1-100 for scalability
 * and the finding from the SDS to use a Redis adapter.
 */
export class RedisIoAdapter extends IoAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name);
  private adapterConstructor: ReturnType<typeof createAdapter>;

  constructor(private readonly app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const configService = this.app.get(ConfigService);
    const redisUrl = configService.get<string>('REDIS_URL');

    if (!redisUrl) {
      this.logger.error('REDIS_URL is not defined. WebSocket scaling will not work.');
      throw new Error('REDIS_URL is not configured.');
    }

    this.logger.log(`Connecting WebSocket adapter to Redis at ${redisUrl}`);

    const pubClient = new Redis(redisUrl);
    const subClient = pubClient.duplicate();

    // Handling connection errors for robustness
    pubClient.on('error', (err) => this.logger.error('Redis PubClient Error', err));
    subClient.on('error', (err) => this.logger.error('Redis SubClient Error', err));
    
    await Promise.all([
        new Promise<void>(resolve => pubClient.on('connect', resolve)),
        new Promise<void>(resolve => subClient.on('connect', resolve)),
    ]);
    
    this.adapterConstructor = createAdapter(pubClient, subClient);
    this.logger.log('Redis adapter for WebSockets connected successfully.');
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server: Server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Enable graceful shutdown for containerized environments (e.g., Kubernetes)
    app.enableShutdownHooks();

    // Configure CORS to allow frontend clients to connect.
    // In production, this should be restricted to the actual frontend domain.
    const clientUrl = configService.get<string>('CLIENT_URL', 'http://localhost:3000');
    app.enableCors({
      origin: clientUrl.split(','),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    
    logger.log(`CORS enabled for origins: ${clientUrl}`);

    // Apply a global validation pipe to enforce DTO contracts.
    // This ensures all incoming data is validated against class-validator decorators.
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

    // Apply a global interceptor to serialize response data (e.g., removing properties marked with @Exclude).
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    // --- Critical Scalability Implementation: Redis WebSocket Adapter ---
    // This connects the WebSocket gateway to Redis, enabling horizontal scaling.
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);
    // --- End of Critical Scalability Implementation ---

    const port = configService.get<number>('PORT', 8003);
    
    // Note: The SDS mentions an SQS listener. In a modern NestJS setup, this is often handled
    // by connecting it as a microservice and starting it alongside the HTTP server.
    // This bootstrap focuses on the HTTP and WebSocket server as per the core files,
    // assuming the SQS listener is self-contained within the `IntegrationsModule`.
    // If a hybrid app is needed, `app.connectMicroservice` and `app.startAllMicroservices` would be used here.

    await app.listen(port);
    logger.log(`🚀 Chat Service is running on: http://localhost:${port}`);
    logger.log(`🔌 WebSocket server is listening on port ${port}`);

  } catch (error) {
    logger.error('❌ Failed to bootstrap the application', error.stack);
    process.exit(1);
  }
}

bootstrap();