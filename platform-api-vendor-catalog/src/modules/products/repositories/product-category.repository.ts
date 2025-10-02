import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../entities/product-category.entity';

/**
 * Repository for managing ProductCategory data.
 */
@Injectable()
export class ProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly repository: Repository<ProductCategory>,
  ) {}

  /**
   * Finds all categories for a specific vendor.
   * @param vendorId The UUID of the vendor profile.
   * @returns A promise that resolves to an array of ProductCategories.
   */
  async findByVendorId(vendorId: string): Promise<ProductCategory[]> {
    return this.repository.find({
      where: { vendorProfileId: vendorId },
      order: { name: 'ASC' },
    });
  }
  
  /**
   * Finds a single category by its ID, ensuring it belongs to the specified vendor.
   * @param categoryId The ID of the category.
   * @param vendorId The ID of the vendor.
   * @returns A promise resolving to the ProductCategory or null.
   */
  async findByIdAndVendorId(categoryId: string, vendorId: string): Promise<ProductCategory | null> {
    return this.repository.findOne({
        where: { productCategoryId: categoryId, vendorProfileId: vendorId },
    });
  }

  /**
   * Creates and saves a new product category for a vendor.
   * @param vendorId The ID of the vendor owning the category.
   * @param name The name of the new category.
   * @returns The newly created ProductCategory entity.
   */
  async create(vendorId: string, name: string): Promise<ProductCategory> {
    const category = this.repository.create({ name, vendorProfileId: vendorId });
    return this.repository.save(category);
  }

  /**
   * Updates the name of an existing product category.
   * @param categoryId The ID of the category to update.
   * @param vendorId The ID of the vendor (for authorization).
   * @param name The new name for the category.
   * @returns The updated ProductCategory entity.
   */
  async update(
    categoryId: string,
    vendorId: string,
    name: string,
  ): Promise<ProductCategory> {
    const category = await this.findByIdAndVendorId(categoryId, vendorId);
    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found.`);
    }
    category.name = name;
    return this.repository.save(category);
  }
  
  /**
   * Deletes a product category, ensuring it belongs to the vendor.
   * @param categoryId The ID of the category to delete.
   * @param vendorId The ID of the vendor (for authorization).
   */
  async delete(categoryId: string, vendorId: string): Promise<void> {
    const result = await this.repository.delete({
      productCategoryId: categoryId,
      vendorProfileId: vendorId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found.`);
    }
  }

    /**
   * Checks if a category with a given name already exists for a vendor (case-insensitive).
   * @param name The name of the category.
   * @param vendorId The ID of the vendor.
   * @returns A promise resolving to the existing category or null.
   */
  async findByNameAndVendorId(name: string, vendorId: string): Promise<ProductCategory | null> {
    return this.repository.createQueryBuilder('category')
        .where('category.vendorProfileId = :vendorId', { vendorId })
        .andWhere('LOWER(category.name) = LOWER(:name)', { name })
        .getOne();
  }
}