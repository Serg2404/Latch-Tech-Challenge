// product.service.ts
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Filter } from '../../core/models/filter.model';
import { Product } from '../../core/models/product.model';
import { environment } from '../../../environment/environment';
import { FilteringStrategy } from '../interfaces/filtering-strategy';
import { ClientSideFilteringService } from './strategies/client-side-filtering.service';
import { ServerSideFilteringService } from './strategies/server-side-filtering.service';
import { FilterType } from '../../core/models/filter-type.model';


/**
 * Service for managing product filtering with a strategy pattern to switch between
 * client-side and server-side implementations based on product count.
 * 
 * @remarks
 * This service defaults to using the client-side strategy initially. It can
 * switch to a server-side strategy if the product count exceeds a specified threshold.
 * 
 * @example
 * ```typescript
 * constructor(private productService: ProductService) {
 *   this.productService.switchStrategy();
 * }
 * ```
 * 
 * @public
 */
@Injectable({
  providedIn: 'root'
})
class FilteringService {
  private strategy: FilteringStrategy;
  private treshold = environment.clientSidePaginationTreshold;

  constructor(
    private clientSideService: ClientSideFilteringService,
    private serverSideService: ServerSideFilteringService
  ) {
    // Default to client-side initially
    this.strategy = this.clientSideService;
  }

/**
 * Switches the product fetching strategy based on the total product count.
 * If the product count exceeds a specified threshold, it switches to a server-side strategy.
 * Otherwise, it uses a client-side strategy.
 *
 * @remarks
 * The threshold for switching strategies is currently set to 100 products.
 *
 * @returns void
 */
  switchStrategy(): Observable<number> {
    return this.getProductsCount().pipe(
      tap(count => {
        if (count > this.treshold) { 
          this.strategy = this.serverSideService;
        } else {
          this.strategy = this.clientSideService;
        }
      })
    );
  }

  applyFiltersAndSearch(searchTerm: string, filters: any, pageNumber: number, pageSize: number): Observable<{products: Product[], totalItems: number}> {
    return this.strategy.applyFiltersAndSearch(searchTerm, filters, pageNumber, pageSize);
  }

/**
 * Retrieves a list of products.
 *
 * @returns {Observable<Product[]>} An observable that emits an array of products.
 */
  getProducts(): Observable<Product[]> {
    return this.strategy.getProducts();
  }

/**
 * Retrieves the total count of products.
 *
 * @returns An Observable that emits the number of products.
 */
  getProductsCount(): Observable<number> {
    return this.strategy.getProductsCount();
  }

/**
 * Applies the provided filters using the current strategy.
 *
 * @param filters - The filters to be applied.
 */
  applyFilters(filters: {key: FilterType, value: Filter}[]): void {
    this.strategy.applyFilters(filters);
  }

/**
 * Searches for products based on the provided term.
 * Utilizes the search strategy defined in the service.
 *
 * @param term - The search term to look for.
 */
  search(term: string): void {
    this.strategy.search(term);
  }

/**
 * Paginates the list of products based on the provided page number and page size.
 *
 * @param page - The current page number.
 * @param pageSize - The number of products per page.
 * @returns An Observable that emits an array of products for the specified page.
 */
paginate(page: number, pageSize: number): Observable<Product[]> {
  return this.strategy.paginate(page, pageSize);
}
}

export { FilteringService };
