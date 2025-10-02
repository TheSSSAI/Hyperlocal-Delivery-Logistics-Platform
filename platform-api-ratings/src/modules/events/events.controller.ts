import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Inject,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeController } from '@nestjs/swagger';
import { OrderDeliveredEventDto } from './dto/order-delivered.event.dto';
import { IRatingsService } from '../ratings/interfaces/ratings.service.interface';

@ApiTags('Internal Events')
@ApiExcludeController() // This controller is for internal, programmatic use (e.g., from an SQS poller) and not for public exposure.
@Controller('events')
export class EventsController {
  constructor(
    @Inject(IRatingsService)
    private readonly ratingsService: IRatingsService,
  ) {}

  @Post('order-delivered')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Handle Order Delivered Event',
    description:
      'Internal endpoint to process an "OrderDelivered" event from the message bus. This makes an order eligible for rating.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Event processed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid event payload.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An internal error occurred while processing the event.',
  })
  async handleOrderDelivered(
    @Body() eventDto: OrderDeliveredEventDto,
  ): Promise<void> {
    // This controller acts as the entry point for an event consumed from SQS/SNS.
    // It validates the incoming payload and passes it to the service layer for business logic execution.
    // If the service throws an error, NestJS's global exception filter will catch it.
    // For an SQS consumer, this would cause the message to not be deleted, allowing for retries
    // or routing to a Dead-Letter Queue (DLQ).
    await this.ratingsService.addRateableOrder(eventDto);
  }
}