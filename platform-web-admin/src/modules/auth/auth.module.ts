import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '../../shared/infrastructure/redis/redis.module';
import { CognitoModule } from '../../shared/infrastructure/cognito/cognito.module';
import { SnsModule } from '../../shared/infrastructure/sns/sns.module';
import { MessagingModule } from '../../shared/infrastructure/messaging/messaging.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRY'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    RedisModule,
    CognitoModule,
    SnsModule,
    MessagingModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}