import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MapboxService } from './mapbox.service';
import { IMapboxService } from './interfaces/mapbox.service.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IMapboxService,
      useClass: MapboxService,
    },
  ],
  exports: [IMapboxService],
})
export class MapboxModule {}