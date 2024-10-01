// server-side-product.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter } from '../../../core/models/filter.model';
import { Product } from '../../../core/models/product.model';
import { FilteringStrategy } from '../../interfaces/filtering-strategy';
import { environment } from '../../../../environment/environment';
import { ProductService } from '../../../core/services/product.service';
import { FilterType } from '../../../core/models/filter-type.model';

@Injectable({
  providedIn: 'root'
})
class ServerSideFilteringService implements FilteringStrategy {
  private products: Product[] = [];
  private filteredProducts: Product[] = [];

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

  applyFiltersAndSearch(searchTerm: string, filters: {key: FilterType, value: Filter}[], pageNumber: number, pageSize: number): Product[] {
    // Server-side filtering can be passed as query parameters
    // No direct logic required here
    return [];
  }

  
  applyFilters(filters: {key: FilterType, value: Filter}[]): void {
    // Server-side filtering can be passed as query parameters
    // No direct logic required here
  }

  search(term: string): void {
    // Send the search term to the API as a query parameter
    // No direct logic required here
  }

  paginate(page: number, pageSize: number): Product[] {
    // Server-side pagination is handled via query parameters
    return []; // No logic here, this is managed by the API
  }
}

export { ServerSideFilteringService };
