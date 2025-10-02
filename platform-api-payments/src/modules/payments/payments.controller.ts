import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
  UseGuards,
  Logger,
  Inject,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dtos/create-payment-intent.dto';
import { PaymentIntentResponseDto } from './dtos/payment-intent-response.dto';
import { RazorpayWebhookGuard } from './guards/razorpay-webhook.guard';
import { JwtAuthGuard } from '@app/shared/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '@app/shared/interfaces/authenticated-request.interface';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post('intent')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a payment intent',
    description:
      'Initiates a payment with the payment gateway and returns a client secret for the frontend to use.',
  })
  @ApiBody({ type: CreatePaymentIntentDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment intent created successfully.',
    type: PaymentIntentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authenticated.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An internal error occurred while creating the payment intent.',
  })
  async createPaymentIntent(
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<PaymentIntentResponseDto> {
    this.logger.info(
      `[PaymentsController] Received request to create payment intent for order ${createPaymentIntentDto.orderId} from user ${req.user.id}`,
      { context: this.constructor.name, userId: req.user.id, orderId: createPaymentIntentDto.orderId },
    );

    // The service is responsible for all business logic, including inventory checks (via events/API calls) and gateway interaction.
    return this.paymentsService.createPaymentIntent(
      createPaymentIntentDto,
      req.user,
    );
  }

  @Post('webhooks/razorpay')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RazorpayWebhookGuard)
  @ApiOperation({
    summary: 'Handle Razorpay webhooks',
    description:
      'Receives and processes payment status updates from Razorpay. This endpoint is protected by a signature verification guard.',
  })
  @ApiHeader({
    name: 'x-razorpay-signature',
    description: 'The signature provided by Razorpay to verify the webhook authenticity.',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Webhook received and acknowledged.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid signature or payload.',
  })
  async handleRazorpayWebhook(@Body() payload: any): Promise<void> {
    const eventType = payload.event;
    this.logger.info(
      `[PaymentsController] Received Razorpay webhook for event: ${eventType}`,
      { context: this.constructor.name, eventType },
    );

    // The service handles the event asynchronously to ensure the webhook call can return quickly.
    // We don't await this call. The service should queue this for processing.
    this.paymentsService.handleWebhook(payload).catch(error => {
      this.logger.error(
        `[PaymentsController] Error processing webhook event ${eventType}: ${error.message}`,
        { context: this.constructor.name, stack: error.stack, payload },
      );
    });

    // Acknowledge receipt to Razorpay immediately.
    return;
  }
}