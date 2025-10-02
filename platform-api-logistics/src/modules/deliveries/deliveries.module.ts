import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveriesController } from './controllers/deliveries.controller';
import { DeliveryTask } from './domain/delivery-task.entity';
import { DeliveryTaskRepository } from './repositories/delivery-task.repository';
import { PodService } from './services/pod.service';
import { DatabaseModule } from '../../shared/database/database.module';
import { MessagingModule } from '../../shared/messaging/messaging.module';
import { IDeliveryTaskRepository } from './interfaces/delivery-task.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryTask]),
    DatabaseModule,
    MessagingModule,
  ],
  controllers: [DeliveriesController],
  providers: [
    PodService,
    {
      provide: IDeliveryTaskRepository,
      useClass: DeliveryTaskRepository,
    },
  ],
  exports: [IDeliveryTaskRepository],
})
export class DeliveriesModule {}