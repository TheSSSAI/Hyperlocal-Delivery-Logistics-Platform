import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from '../chat/chat.module';
import { OrderEventsListener } from './order-events.listener';

@Module({
  imports: [ConfigModule, ChatModule],
  controllers: [OrderEventsListener],
  providers: [Logger],
})
export class IntegrationsModule {}