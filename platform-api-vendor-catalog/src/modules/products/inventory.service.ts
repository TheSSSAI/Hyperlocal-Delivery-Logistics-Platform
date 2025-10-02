import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InsufficientStockException } from '../../common/exceptions/insufficient-stock.exception';
import { ProductNotFoundException } from '../../common/exceptions/product-not-found.exception';
import { InventoryUpdateDto } from './dto/inventory-update.dto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Checks stock availability and reserves items within a single database transaction.
   * This method is designed for high concurrency and uses pessimistic locking to prevent race conditions.
   * @param items - An array of product IDs and quantities to reserve.
   * @throws InsufficientStockException if any item does not have enough stock.
   * @throws ProductNotFoundException if any product ID is not found.
   * @throws ConflictException on version mismatch for optimistic locking.
   */
  public async checkAndReserveStock(
    items: { productId: string; quantity: number }[],
  ): Promise<void> {
    this.logger.log(`Initiating stock reservation for ${items.length} items.`);

    if (!items || items.length === 0) {
      return;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const productIds = items.map(item => item.productId);
      const products = await queryRunner.manager.find(Product, {
        where: { id: In(productIds) },
        lock: { mode: 'pessimistic_write' },
      });

      const productMap = new Map(products.map(p => [p.id, p]));

      for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new ProductNotFoundException(item.productId);
        }

        if (product.stockQuantity < item.quantity) {
          this.logger.warn(
            `Insufficient stock for product ${item.productId}. Required: ${item.quantity}, Available: ${product.stockQuantity}`,
          );
          throw new InsufficientStockException(
            item.productId,
            item.quantity,
            product.stockQuantity,
          );
        }

        product.stockQuantity -= item.quantity;
      }
      
      await queryRunner.manager.save(Product, Array.from(productMap.values()));

      await queryRunner.commitTransaction();
      this.logger.log(`Stock reservation successful for ${items.length} items.`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Stock reservation failed. Rolling back transaction.', error.stack);
      // Re-throw the original specific exception
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Reverts stock for items from a cancelled or failed order.
   * This is a compensating transaction and runs atomically.
   * @param items - An array of product IDs and quantities to revert.
   */
  public async revertStock(
    items: { productId: string; quantity: number }[],
  ): Promise<void> {
    this.logger.log(`Initiating stock reversion for ${items.length} items.`);
    if (!items || items.length === 0) {
      return;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of items) {
        if(item.quantity <= 0) continue;

        const result = await queryRunner.manager.increment(
          Product,
          { id: item.productId },
          'stockQuantity',
          item.quantity,
        );

        if (result.affected === 0) {
            // This indicates a severe data inconsistency issue if a product from an order doesn't exist
            this.logger.error(`Failed to revert stock. Product with ID ${item.productId} not found. This may require manual intervention.`);
        }
      }
      await queryRunner.commitTransaction();
      this.logger.log(`Stock reversion successful for ${items.length} items.`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Stock reversion failed. Rolling back transaction.', error.stack);
      // Depending on the business rule, you might want to throw or just log for a monitoring system to pick up.
      // Throwing might block a consumer retry loop, so logging is often safer for compensating transactions.
    } finally {
      await queryRunner.release();
    }
  }

   /**
   * Atomically updates a product's stock quantity using optimistic locking.
   * This is suitable for admin or vendor dashboard operations where concurrency is lower than checkout.
   * @param inventoryUpdate - DTO containing productId, new quantity, and the current product version.
   * @throws ConflictException if the product version does not match, indicating a concurrent update.
   * @throws ProductNotFoundException if the product ID is not found.
   */
  async updateStockWithOptimisticLock(updateDto: InventoryUpdateDto): Promise<Product> {
    const { productId, quantityChange, productVersion } = updateDto;
    
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new ProductNotFoundException(productId);
    }
    
    // Check version before attempting update. This is a pre-check.
    if (product.version !== productVersion) {
      this.logger.warn(`Optimistic lock failed for Product ${productId}. Expected version ${productVersion}, but found ${product.version}.`);
      throw new ConflictException(`Product has been updated by another user. Please refresh and try again.`);
    }

    const newStockQuantity = product.stockQuantity + quantityChange;
    if (newStockQuantity < 0) {
        throw new InsufficientStockException(productId, Math.abs(quantityChange), product.stockQuantity);
    }

    try {
        product.stockQuantity = newStockQuantity;
        // The save method with a versioned entity will automatically check the version.
        const updatedProduct = await this.productRepository.save(product);
        this.logger.log(`Stock for product ${productId} updated to ${newStockQuantity} using optimistic lock.`);
        return updatedProduct;
    } catch (error) {
        // TypeORM throws an OptimisticLockVersionMismatchError on save if the version has changed.
        // We catch it and re-throw a more user-friendly NestJS exception.
        if (error.name === 'OptimisticLockVersionMismatchError') {
            this.logger.warn(`Optimistic lock conflict during save for Product ${productId}.`);
            throw new ConflictException(`Product has been updated by another user. Please refresh and try again.`);
        }
        this.logger.error(`Failed to update stock for product ${productId}`, error.stack);
        throw error; // Re-throw other errors
    }
  }
}