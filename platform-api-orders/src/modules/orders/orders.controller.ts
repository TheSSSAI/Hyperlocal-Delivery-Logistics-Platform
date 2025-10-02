import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderDto } from './dtos/order.dto';
// Assuming a JWT Guard and a User decorator are available from a shared auth module
// For this context, we will assume they exist and are named as follows.
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { User } from '../../shared/decorators/user.decorator';
import { IAuthenticatedUser } from '../../shared/interfaces/authenticated-user.interface';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Initiate a new order creation',
    description:
      'Starts the order creation Saga. It validates the cart, creates an order in a pending state, and triggers the payment process.',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'Order creation process has been initiated. The response contains details needed for the client to proceed with payment.',
    // In a real scenario, this would return a DTO with payment intent details.
    // For now, we'll indicate it returns an object.
    type: Object,
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
    status: HttpStatus.CONFLICT,
    description: 'An item in the cart is out of stock.',
  })
  async initiateOrderCreation(
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
    @User() user: IAuthenticatedUser,
  ) {
    // In a real implementation, this would involve calling a catalog service for inventory check
    // and a payment service to create a payment intent as part of the Saga.
    // Here we delegate the start of that process to the OrdersService.
    return this.ordersService.initiateOrder(createOrderDto, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order details retrieved successfully.',
    type: OrderDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is not authorized to view this order.',
  })
  async getOrderById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User() user: IAuthenticatedUser,
  ): Promise<OrderDto> {
    const order = await this.ordersService.getOrderByIdForCustomer(id, user.id);
    return OrderDto.fromEntity(order);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order has been successfully cancelled.',
    type: OrderDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Order cannot be cancelled in its current state.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order not found.',
  })
  async cancelOrder(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User() user: IAuthenticatedUser,
  ): Promise<OrderDto> {
    const cancelledOrder = await this.ordersService.cancelOrder(
      id,
      user.id,
      'Customer',
      'Customer initiated cancellation',
    );
    return OrderDto.fromEntity(cancelledOrder);
  }
}