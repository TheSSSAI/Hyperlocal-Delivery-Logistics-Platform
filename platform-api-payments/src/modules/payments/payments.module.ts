import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../database/entities/payment.entity';
import { PaymentRepository } from '../../database/repositories/payment.repository';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { RazorpayWebhookGuard } from './guards/razorpay-webhook.guard';
import { LedgerModule } from '../ledger/ledger.module';
import { RazorpayModule } from '../../shared/razorpay/razorpay.module';
import { MessagingModule } from '../../shared/messaging/messaging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    LedgerModule,
    RazorpayModule.forRootAsync(),
    forwardRef(() => MessagingModule), // Use forwardRef to break circular dependency
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentRepository, RazorpayWebhookGuard],
  exports: [PaymentsService],
})
export class PaymentsModule {}