import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { InventoryService } from './inventory.service';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/product-category.entity';
import { ProductRepository } from './repositories/product.repository';
import { ProductCategoryRepository } from './repositories/product-category.repository';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'src/shared/redis/redis.module';

/**
 * @module ProductsModule
 * @description Manages the "Product" and "Inventory" sub-domains. It provides
 * services for catalog management (products, categories) and transactional
 * inventory control. This module is a cornerstone of the application,
 * serving both vendor management and customer-facing discovery needs.
 */
@Module({
  imports: [
    ConfigModule,
    RedisModule,
    TypeOrmModule.forFeature([Product, ProductCategory]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    InventoryService,
    ProductRepository,
    ProductCategoryRepository,
  ],
  exports: [ProductsService, InventoryService], // Exporting services for use in other modules (BulkImport, Messaging)
})
export class ProductsModule {}