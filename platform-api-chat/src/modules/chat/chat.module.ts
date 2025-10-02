import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { PassportModule } from '@nestjs/passport';
import * as redisStore from 'cache-manager-redis-store';

import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { JwtStrategy } from '../../shared/auth/strategies/jwt.strategy';
import chatConfig from '../../config/chat.config';
import jwtConfig from '../../config/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(chatConfig),
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([ChatMessage, ChatRoom]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get<number>('http.timeout', 5000),
        maxRedirects: configService.get<number>('http.maxRedirects', 5),
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('redis.host'),
        port: configService.get<number>('redis.port'),
        ttl: configService.get<number>('redis.ttl'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    ChatGateway,
    ChatService,
    ChatRepository,
    WsJwtGuard,
    JwtStrategy,
    Logger,
  ],
  exports: [ChatService],
})
export class ChatModule {}