import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './repositories/cart.repository';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem])],
  controllers: [CartController],
  providers: [
    CartService,
    {
      provide: 'ICartRepository',
      useClass: CartRepository,
    },
  ],
  exports: [CartService, 'ICartRepository'],
})
export class CartModule {}