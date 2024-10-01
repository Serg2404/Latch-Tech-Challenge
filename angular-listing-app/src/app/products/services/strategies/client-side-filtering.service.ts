// client-side-product.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Filter } from '../../../core/models/filter.model';
import { Product } from '../../../core/models/product.model';
import { FilteringStrategy } from '../../interfaces/filtering-strategy';
import { ProductService } from '../../../core/services/product.service';
import { FilterType } from '../../../core/models/filter-type.model';
import { PriceRange } from '../../../core/models/price-range.model';

@Injectable({
  providedIn: 'root'
})
class ClientSideFilteringService implements FilteringStrategy {

  constructor(private productService: ProductService) {
  }
  private products: Product[] = [];
  private filteredProducts: Product[] = [];
  
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

    /**
   * This method refreshes the product list by applying filtering, searching, and pagination.
   */
    public applyFiltersAndSearch(searchTerm: string, filters: {key: FilterType, value: Filter}[], pageNumber: number, pageSize: number): Observable<{products: Product[], totalItems: number}> {
      return new Observable(observer => {
        this.filteredProducts = this.products;  // Start with the full list
        this.applyFilters(filters);             // Apply filters
        this.search(searchTerm);                // Apply search term filter
        const filteredProductsCount = this.filteredProducts.length;
        const paginate = this.paginate(pageNumber, pageSize);  // Paginate
        paginate.subscribe(products => {
          observer.next({products, totalItems: filteredProductsCount});
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


  // TODO: MAKE MORE GENERIC
  applyFilters(filters: {key: FilterType, value: Filter}[]): void {
    for (const filter of filters) {
      switch (filter.key) {
        case 'multiselect':
          if (filter.value.multiselect) {
            this.applyCategoryFilter(filter.value.multiselect);
          }
          break;
        case 'range':
          if (filter.value.range) {
            this.applyPriceRangeFilter(filter.value.range);
          }
          break;
      }
    }
  }

    /**
   * Filters the products based on the selected categories.
   * 
   * This method updates the `filteredProducts` array to include only those products
   * whose category is selected in the `categoriesSelected` object. It first checks if 
   * there are any selected categories. If there are, it filters the `filteredProducts`
   * array to include only products that belong to one of the selected categories.
   * 
   * @private
   */
    private applyCategoryFilter(categoriesSelected: { [key: string]: boolean }) {
      if (categoriesSelected && Object.values(categoriesSelected).some(isSelected => isSelected)) {
        this.filteredProducts = this.filteredProducts.filter(p => {
          return categoriesSelected && Object.entries(categoriesSelected)
            .filter(([_, isSelected]) => isSelected)
            .map(([category, _]) => category)
            .includes(p.category);
        });
      }
    }
  
    /**
     * Filters the products based on the selected price range.
     * 
     * If a price range is selected, this method will filter the `filteredProducts` array
     * to include only those products whose price falls within the specified minimum and 
     * maximum values.
     * 
     * @private
     */
    private applyPriceRangeFilter(priceRangeSelected: PriceRange) {
      if (priceRangeSelected) {
        const { min, max } = priceRangeSelected;
        if (min !== null && max !== null) {
          this.filteredProducts = this.filteredProducts.filter(p => p.price >= min && p.price <= max);
        }
      }
    }

  search(term: string): void {
    // Perform client-side search
    this.filteredProducts = this.filteredProducts.filter(p =>
      p.name.toLowerCase().includes(term.toLowerCase()) ||
      p.category.toLowerCase().includes(term.toLowerCase()) ||
      p.description.toLowerCase().includes(term.toLowerCase())
    );
  }

  paginate(page: number, pageSize: number): Observable<Product[]> {
    return new Observable(observer => {
      const startIndex = (page - 1) * pageSize;
      const paginatedProducts = this.filteredProducts.slice(startIndex, startIndex + pageSize);
      observer.next(paginatedProducts);
      observer.complete();
    });
  }
}

export { ClientSideFilteringService };
