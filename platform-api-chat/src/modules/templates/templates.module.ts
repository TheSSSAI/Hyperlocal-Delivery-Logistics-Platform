import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { JwtStrategy } from '../../shared/auth/strategies/jwt.strategy';
import jwtConfig from '../../config/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
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
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService, JwtStrategy, Logger],
})
export class TemplatesModule {}