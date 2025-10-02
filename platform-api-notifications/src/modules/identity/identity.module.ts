import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IdentityService } from './identity.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('identityService.baseUrl'),
        timeout: configService.get<number>('identityService.timeout', 5000),
        headers: {
          'Content-Type': 'application/json',
          // In a real scenario, you might have an internal auth token
          // 'Authorization': `Bearer ${configService.get('INTERNAL_AUTH_TOKEN')}`
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}