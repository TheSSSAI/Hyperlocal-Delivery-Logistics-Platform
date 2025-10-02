import { Module } from '@nestjs/common';
import { AllocationService } from './services/allocation.service';
import { IAllocationService } from './interfaces/allocation.service.interface';
import { CacheModule } from '../../shared/cache/cache.module';
import { MapboxModule } from '../../shared/mapbox/mapbox.module';
import { MessagingModule } from '../../shared/messaging/messaging.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { ZonesModule } from '../zones/zones.module';
import { DatabaseModule } from '../../shared/database/database.module';

@Module({
  imports: [
    // Shared modules required by AllocationService
    CacheModule,
    MapboxModule,
    MessagingModule,
    DatabaseModule, // RiderRepository might be needed, assuming it's provided here

    // Feature modules providing necessary services/repositories
    DeliveriesModule, // Provides IDeliveryTaskRepository
    ZonesModule, // Provides ZonesService
  ],
  providers: [
    {
      provide: IAllocationService,
      useClass: AllocationService,
    },
    // In a full implementation, a RiderRepository would be provided here.
    // For now, dependencies are satisfied by module imports.
  ],
  exports: [IAllocationService],
})
export class AllocationModule {}