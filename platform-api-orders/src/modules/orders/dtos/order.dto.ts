import { Expose, Type, plainToInstance } from 'class-transformer';
import { IsUUID, IsString, IsNumber, IsDate, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';
import { Order } from '../entities/order.entity';
import { OrderEventLog } from '../entities/order-event-log.entity';

export class OrderItemDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsUUID()
  productId: string;

  @Expose()
  @IsString()
  productName: string;

  @Expose()
  @IsNumber()
  quantity: number;

  @Expose()
  @IsNumber()
  priceAtTimeOfOrder: number;
}

export class OrderEventLogDto {
    @Expose()
    @IsUUID()
    id: string;

    @Expose()
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @Expose()
    @IsString()
    actor: string;

    @Expose()
    @IsOptional()
    @IsString()
    notes: string | null;

    @Expose()
    @IsDate()
    createdAt: Date;

    public static fromEntity(log: OrderEventLog): OrderEventLogDto {
        return plainToInstance(OrderEventLogDto, log, {
            excludeExtraneousValues: true,
        });
    }
}

export class OrderDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsUUID()
  customerId: string;

  @Expose()
  @IsUUID()
  vendorId: string;

  @Expose()
  @IsUUID()
  deliveryAddressId: string;
  
  @Expose()
  @IsOptional()
  @IsUUID()
  riderId: string | null;

  @Expose()
  @IsNumber()
  subtotal: number;

  @Expose()
  @IsNumber()
  taxes: number;

  @Expose()
  @IsNumber()
  deliveryFee: number;

  @Expose()
  @IsNumber()
  totalAmount: number;

  @Expose()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Expose()
  @IsString()
  paymentMethod: string;

  @Expose()
  @IsOptional()
  @IsString()
  vendorInstructions: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  riderInstructions: string | null;

  @Expose()
  @IsDate()
  placedAt: Date;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => OrderEventLogDto)
  eventHistory: OrderEventLogDto[];


  public static fromEntity(order: Order): OrderDto {
    return plainToInstance(OrderDto, order, {
      excludeExtraneousValues: true,
    });
  }

  public static fromEntityWithHistory(order: Order, history: OrderEventLog[]): OrderDto {
    const dto = plainToInstance(OrderDto, order, {
        excludeExtraneousValues: true,
    });
    dto.eventHistory = history.map(log => OrderEventLogDto.fromEntity(log));
    return dto;
  }
}