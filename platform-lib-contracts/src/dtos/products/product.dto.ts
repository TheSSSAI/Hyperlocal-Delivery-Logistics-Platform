import { IMoneyContract } from '../../common/money.contract';

/**
 * Represents the public data contract for a product.
 * This DTO is used when returning product information via APIs, for example,
 * in product listings, search results, or as part of an order's item list.
 * It provides a standardized, client-facing representation of a product.
 */
export class ProductDto {
  /**
   * The unique identifier for the product (UUID).
   * @example 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
   */
  id: string;

  /**
   * The name of the product.
   * @example 'Spicy Chicken Ramen'
   */
  name: string;

  /**
   * The description of the product.
   * @example 'A rich and spicy broth with tender chicken and fresh noodles.'
   */
  description: string;

  /**
   * The price of the product, represented as a MoneyContract object
   * to ensure currency and amount are handled consistently.
   */
  price: IMoneyContract;

  /**
   * The URL of the product's primary image.
   * @example 'https://cdn.example.com/images/spicy-ramen.jpg'
   */
  imageUrl: string;

  /**
   * The calculated stock status of the product, derived from its quantity.
   * This provides a user-friendly status for display on the client-side.
   */
  stockStatus: 'Available' | 'Limited Stock' | 'Out of Stock';

  /**
   * The unique identifier of the vendor who sells this product.
   * @example 'v1a2b3c4-d5e6-f789-0123-456789abcdef'
   */
  vendorId: string;

  /**
   * The name of the store that sells this product.
   * Useful for displaying context in search results.
   * @example 'Global Bites Kitchen'
   */
  vendorName: string;

  /**
   * The unique identifier of the category this product belongs to.
   * @example 'cat-a1b2-c3d4-e5f6'
   */
  categoryId: string;

  /**
   * The name of the category this product belongs to.
   * @example 'Main Courses'
   */
  categoryName: string;

  /**
   * The average rating of the product, calculated from customer reviews.
   * @example 4.5
   */
  averageRating: number;

  /**
   * The total number of ratings the product has received.
   * @example 150
   */
  ratingsCount: number;
}