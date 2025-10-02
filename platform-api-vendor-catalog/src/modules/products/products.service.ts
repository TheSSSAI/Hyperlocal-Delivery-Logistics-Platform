import { Injectable, Logger, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/product-category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductNotFoundException } from '../../common/exceptions/product-not-found.exception';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Pagination, IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(vendorId: string, createProductDto: CreateProductDto): Promise<Product> {
    this.logger.log(`Creating new product for vendor ${vendorId}`);
    
    const category = await this.productCategoryRepository.findOne({
        where: { id: createProductDto.categoryId, vendorId }
    });
    if (!category) {
        throw new NotFoundException(`Product category with ID ${createProductDto.categoryId} not found or does not belong to this vendor.`);
    }

    const product = this.productRepository.create({
      ...createProductDto,
      vendorId,
    });
    
    const savedProduct = await this.productRepository.save(product);
    await this.invalidateVendorCache(vendorId);

    this.logger.log(`Successfully created product ${savedProduct.id} for vendor ${vendorId}`);
    return savedProduct;
  }

  async findAllByVendor(vendorId: string, options: IPaginationOptions): Promise<Pagination<Product>> {
    const cacheKey = `vendor_${vendorId}_products_page_${options.page}_limit_${options.limit}`;
    const cachedData = await this.cacheManager.get<Pagination<Product>>(cacheKey);

    if (cachedData) {
      this.logger.log(`Cache hit for products of vendor ${vendorId}`);
      return cachedData;
    }

    this.logger.log(`Cache miss for products of vendor ${vendorId}. Fetching from DB.`);
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .where('product.vendorId = :vendorId', { vendorId })
      .andWhere('product.isDeleted = false')
      .orderBy('product.createdAt', 'DESC');

    const paginatedResult = await paginate<Product>(queryBuilder, options);
    
    await this.cacheManager.set(cacheKey, paginatedResult, 60 * 1000); // Cache for 60 seconds
    
    return paginatedResult;
  }

  async findOne(id: string, vendorId: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id, vendorId, isDeleted: false } });
    if (!product) {
      throw new ProductNotFoundException(id);
    }
    return product;
  }

  async update(id: string, vendorId: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id, vendorId); // findOne ensures ownership

    if(updateProductDto.categoryId) {
        const category = await this.productCategoryRepository.findOne({
            where: { id: updateProductDto.categoryId, vendorId }
        });
        if (!category) {
            throw new NotFoundException(`Product category with ID ${updateProductDto.categoryId} not found or does not belong to this vendor.`);
        }
    }

    Object.assign(product, updateProductDto);

    const updatedProduct = await this.productRepository.save(product);
    await this.invalidateVendorCache(vendorId);
    
    this.logger.log(`Updated product ${id} for vendor ${vendorId}`);
    return updatedProduct;
  }

  async remove(id: string, vendorId: string): Promise<void> {
    const product = await this.findOne(id, vendorId);

    // Placeholder for checking against active orders.
    // In a real microservice architecture, this would be an RPC/API call to the Order service.
    // const isProductInActiveOrder = await this.orderServiceClient.isProductInActiveOrders(id);
    // if(isProductInActiveOrder) {
    //   throw new ForbiddenException('Cannot delete a product that is part of an active order.');
    // }

    product.isDeleted = true;
    await this.productRepository.save(product);
    await this.invalidateVendorCache(vendorId);
    
    this.logger.log(`Soft-deleted product ${id} for vendor ${vendorId}`);
  }

  // --- Category Management ---

  async createCategory(vendorId: string, name: string): Promise<ProductCategory> {
    const existingCategory = await this.productCategoryRepository.findOne({ where: { vendorId, name }});
    if (existingCategory) {
        throw new ForbiddenException(`A category with the name "${name}" already exists.`);
    }

    const category = this.productCategoryRepository.create({ name, vendorId });
    await this.invalidateVendorCache(vendorId);
    return this.productCategoryRepository.save(category);
  }

  async findAllCategoriesByVendor(vendorId: string): Promise<ProductCategory[]> {
    return this.productCategoryRepository.find({ where: { vendorId } });
  }

  async updateCategory(id: string, vendorId: string, name: string): Promise<ProductCategory> {
    const category = await this.productCategoryRepository.findOne({ where: { id, vendorId }});
    if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found or does not belong to this vendor.`);
    }
    
    category.name = name;
    await this.invalidateVendorCache(vendorId);
    return this.productCategoryRepository.save(category);
  }

  async removeCategory(id: string, vendorId: string): Promise<void> {
    const category = await this.productCategoryRepository.findOne({ where: { id, vendorId }});
    if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found or does not belong to this vendor.`);
    }

    const productsInCategory = await this.productRepository.count({ where: { categoryId: id, isDeleted: false }});
    if (productsInCategory > 0) {
        throw new ForbiddenException(`Cannot delete category as it contains ${productsInCategory} products. Please move or delete the products first.`);
    }

    await this.productCategoryRepository.remove(category);
    await this.invalidateVendorCache(vendorId);
  }

  /**
   * Helper method for VendorOwnershipGuard to check if a product belongs to a vendor.
   * @param productId The ID of the product.
   * @returns The vendor ID associated with the product.
   * @throws ProductNotFoundException if the product is not found.
   */
  async getVendorIdForProduct(productId: string): Promise<string> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      select: ['vendorId'],
    });

    if (!product) {
      throw new ProductNotFoundException(productId);
    }
    return product.vendorId;
  }

  private async invalidateVendorCache(vendorId: string): Promise<void> {
    this.logger.log(`Invalidating cache for vendor ${vendorId}`);
    const keys = await this.cacheManager.store.keys(`vendor_${vendorId}_*`);
    if(keys.length > 0) {
      await this.cacheManager.store.del(keys);
    }
  }
}