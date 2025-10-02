import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventPublisherService } from './event-publisher.service';
import { IEventPublisher } from './interfaces/event-publisher.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IEventPublisher,
      useClass: EventPublisherService,
    },
  ],
  exports: [IEventPublisher],
})
export class MessagingModule {}