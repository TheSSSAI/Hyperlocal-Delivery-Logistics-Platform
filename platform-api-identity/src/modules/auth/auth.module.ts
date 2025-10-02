import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisModule } from '../../shared/infrastructure/redis/redis.module';
import { CognitoModule } from '../../shared/infrastructure/cognito/cognito.module';
import { SnsModule } from '../../shared/infrastructure/sns/sns.module';
import { MessagingModule } from '../../shared/infrastructure/messaging/messaging.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ConsentModule } from '../consent/consent.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt_secret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.jwt_access_token_expiry'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    RedisModule,
    CognitoModule,
    SnsModule,
    MessagingModule,
    ConsentModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard, PassportModule],
})
export class AuthModule {}