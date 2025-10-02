import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonesController } from './controllers/zones.controller';
import { OperationalZone } from './domain/zone.entity';
import { ZoneRepository } from './repositories/zone.repository';
import { ZonesService } from './services/zones.service';
import { DatabaseModule } from '../../shared/database/database.module';
import { IZoneRepository } from './interfaces/zone.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([OperationalZone]), DatabaseModule],
  controllers: [ZonesController],
  providers: [
    ZonesService,
    {
      provide: IZoneRepository,
      useClass: ZoneRepository,
    },
  ],
  exports: [ZonesService],
})
export class ZonesModule {}