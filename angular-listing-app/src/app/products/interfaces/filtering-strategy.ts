import { Observable } from 'rxjs';
import { Filter } from '../../core/models/filter.model';
import { Product } from '../../core/models/product.model';
import { FilterType } from '../../core/models/filter-type.model';

/**
 * Interface representing a strategy for handling products.
 */
/**
 * Interface representing a strategy for filtering products.
 */
export interface FilteringStrategy {
    /**
     * Retrieves a list of products.
     * @returns An observable emitting an array of products.
     */
    getProducts(): Observable<Product[]>;

    /**
     * Retrieves the total count of products.
     * @returns An observable emitting the total number of products.
     */
    getProductsCount(): Observable<number>;

    /**
     * This method refreshes the product list by applying filtering, searching, and pagination.
     * @param searchTerm - The search term to filter by.
     * @param filters - The filters to apply.
     * @param pageNumber - The page number to retrieve.
     * @param pageSize - The number of products per page.
     * @returns An array of products for the specified page.
     * @example
     * applyFiltersAndSearch('apple', [{ type: 'category', value: 'fruit' }], 1, 10);
     */
    applyFiltersAndSearch(searchTerm: string, filters: {key: FilterType, value: Filter}[], pageNumber: number, pageSize: number): Product[];

    /**
     * Applies the given filters to the product list.
     * @param filters - The filters to apply.
     */
    applyFilters(filters: {key: FilterType, value: Filter}[]): void;

    /**
     * Searches for products matching the given term.
     * @param term - The search term.
     */
    search(term: string): void;

    /**
     * Paginates the product list.
     * @param page - The page number to retrieve.
     * @param pageSize - The number of products per page.
     * @returns An array of products for the specified page.
     */
    paginate(page: number, pageSize: number): Product[];
}