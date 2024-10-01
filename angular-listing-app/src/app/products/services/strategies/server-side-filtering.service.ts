// server-side-product.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter } from '../../../core/models/filter.model';
import { Product } from '../../../core/models/product.model';
import { FilteringStrategy } from '../../interfaces/filtering-strategy';
import { environment } from '../../../../environment/environment';
import { ProductService } from '../../../core/services/product.service';
import { FilterType } from '../../../core/models/filter-type.model';
import { FilterRequestPayload } from '../../interfaces/filter-payload';

@Injectable({
  providedIn: 'root'
})
class ServerSideFilteringService implements FilteringStrategy {
  private products: Product[] = [];
  private filteredProducts: Product[] = [];

  private currentSearchTerm = '';
  private currentFilters: {key: FilterType, value: Filter}[] = [];
  private currentPage = 1;
  private pageSize = 10;

  constructor(private productService: ProductService) { }

  getProducts(): Observable<Product[]> {
    return new Observable(observer => {
      this.productService.getProducts().subscribe(products => {
        this.products = products;
        this.filteredProducts = products;
        observer.next(products);
        observer.complete();
      });
    });
  }

  getProductsCount(): Observable<number> {
    return new Observable(observer => {
      this.productService.getProductsCount().subscribe(count => {
        observer.next(count);
        observer.complete();
      });
    });
  }

  applyFiltersAndSearch(searchTerm: string, filters: {key: FilterType, value: Filter}[], pageNumber: number, pageSize: number): Observable<{products: Product[], totalItems: number}> {
    this.currentSearchTerm = searchTerm;
    this.currentFilters = filters;
    this.currentPage = pageNumber;
    this.pageSize = pageSize;

    const payload: FilterRequestPayload = {
      searchTerm,
      filters: {
        logic: 'and',
        filters: filters.map(filter => ({
        key: filter.key,
        values: filter.value.value ? filter.value.value : [],
        type: filter.value.type,
        logic: 'or'
      }))},
      currentPage: pageNumber,
      pageSize
    };

    return new Observable(observer => {
      this.productService.getFilteredProducts(payload).subscribe(response => {
        this.filteredProducts = response.products;
        observer.next({ products: response.products, totalItems: response.totalItems });
        observer.complete();
      });
    });
  }

  
  applyFilters(filters: {key: FilterType, value: Filter}[]): void {
    // Server-side filtering can be passed as query parameters
    // No direct logic required here
  }

  search(term: string): void {
    // Send the search term to the API as a query parameter
    // No direct logic required here
  }

  paginate(page: number, pageSize: number): Observable<Product[]> {
    return new Observable(observer => {
      this.applyFiltersAndSearch(this.currentSearchTerm, this.currentFilters, page, pageSize).subscribe(response => {
        observer.next(response.products);
        observer.complete();
      });
    });
  }
}

export { ServerSideFilteringService };
