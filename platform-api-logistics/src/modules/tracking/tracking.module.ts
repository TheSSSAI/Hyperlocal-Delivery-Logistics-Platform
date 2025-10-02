import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '../../shared/cache/cache.module';
import { TrackingGateway } from './gateways/tracking.gateway';
import { RiderLocationService } from './services/rider-location.service';
import { IRiderLocationService } from './interfaces/rider-location.service.interface';

@Module({
  imports: [
    CacheModule,
    // Assuming a shared AuthModule isn't created yet, we configure JWT here
    // for the gateway's authentication needs. In a real scenario, this would
    // likely be part of a shared AuthModule.
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('auth.jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    TrackingGateway,
    {
      provide: IRiderLocationService,
      useClass: RiderLocationService,
    },
  ],
})
export class TrackingModule {}