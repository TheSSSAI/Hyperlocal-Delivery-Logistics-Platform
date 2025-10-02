/**
 * @file Defines a generic, standardized contract for API responses that return a paginated list of items.
 * @version 1.0.0
 * @since 1.0.0
 * @author Principal Software Engineer
 */

/**
 * Generic structure for paginated API responses.
 * @template T The type of the items in the paginated list.
 */
export class PagedResponse<T> {
  /**
   * The array of items for the current page.
   */
  items: T[];

  /**
   * The total number of items available across all pages.
   * @example 127
   */
  totalItems: number;

  /**
   * The current page number (1-indexed).
   * @example 2
   */
  currentPage: number;

  /**
   * The number of items per page.
   * @example 10
   */
  pageSize: number;

  /**
   * The total number of pages available.
   * @example 13
   */
  totalPages: number;

  constructor(
    items: T[],
    totalItems: number,
    currentPage: number,
    pageSize: number,
  ) {
    this.items = items;
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(totalItems / pageSize);
  }
}