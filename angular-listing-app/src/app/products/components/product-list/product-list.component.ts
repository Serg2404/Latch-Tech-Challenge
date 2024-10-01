import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SearchComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ProductComponent } from '../product/product.component';
import { PriceRange } from '../../../core/models/price-range.model';
import { FilterComponent } from '../../../shared/components/filters/filter.component';
import { Filter } from '../../../core/models/filter.model';
import { FilteringService } from '../../services/filtering.service';
import { firstValueFrom } from 'rxjs';
import { response } from 'express';
import { FilterType } from '../../../core/models/filter-type.model';

/**
 * @component ProductListComponent
 * @description
 * The ProductListComponent is responsible for displaying a list of products with functionalities 
 * such as filtering by categories, price range, searching, and pagination. It interacts with the 
 * ProductService to fetch the products and applies various filters and pagination to display the 
 * products accordingly.
 * 
 * @selector app-product-list
 * @standalone true
 * @imports [CommonModule, PaginationComponent, SearchComponent, ProductComponent, FilterComponent]
 * @templateUrl ./product-list.component.html
 * 
 * @class ProductListComponent
 * @implements OnInit
 * 
 * @property {Product[]} private products - The complete list of products fetched from the service.
 * @property {Product[]} public filteredProducts - The list of products after applying filters and search.
 * @property {Product[]} public currentPageProducts - The list of products to be displayed on the current page.
 * @property {number} public currentPage - The current page number for pagination.
 * @property {number} public pageSize - The number of products to display per page.
 * @property {string} public searchTerm - The search term used to filter products.
 * @property {number} public totalItems - The total number of items after filtering and searching.
 * @property {number[]} public pageSizeOptions - The available options for the number of products per page.
 * @property {string[]} public categories - The list of unique product categories.
 * @property {Map<string, boolean> | null} public categoriesSelected - The map of selected categories for filtering.
 * @property {PriceRange | null} public priceRangeSelected - The selected price range for filtering.
 * 
 * @constructor
 * @param {ProductService} private productService - The service used to fetch products.
 * 
 * @method ngOnInit - Initializes the component and sets up subscriptions.
 * @method applyFiltersAndSearch - Refreshes the product list by applying filtering, searching, and pagination.
 * @method filterCategories - Filters the products based on selected categories.
 * @method filterPriceRange - Filters the products based on the selected price range.
 * @method searchProducts - Filters the list of products based on the search term.
 * @method paginateProducts - Paginates the filtered and searched products based on the current page and page size.
 * @method onPageChange - Handles the event when the page is changed.
 * @method onPageSizeChange - Handles the change in page size for the product list.
 * @method onSearch - Handles the search functionality.
 * @method onCategoriesSelectedChange - Handles the change event when categories are selected.
 * @method onPriceRangeChange - Handles the change event for the selected price range filter.
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent, SearchComponent, ProductComponent, FilterComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
class ProductListComponent implements OnInit {
  private products: Product[] = [];
  public filteredProducts: Product[] = [];
  public currentPageProducts: Product[] = [];
  public currentPage = 1;
  public pageSize = 10;
  public searchTerm = '';
  public totalItems = 0;
  public pageSizeOptions = [5, 10, 20, 50];
  public categories: Array<string> = [];
  public categoriesSelected: { [key: string]: boolean } | null = {};
  public priceRangeSelected: PriceRange | null = { min: null, max: null };

  constructor(private filteringService: FilteringService) { }

  public ngOnInit() {
    this.initSubscriptions();
  }

  private async initSubscriptions() {
    this.getProducts();
  }

  /**
   * Fetches the products from the ProductService and initializes the component state.
   * This method is called during the component initialization to load the products.
   */
  private async getProducts() {
    await firstValueFrom(this.filteringService.switchStrategy());
    this.filteringService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.categories = [...new Set(this.products.map(p => p.category))];
      this.totalItems = this.products.length;
      this.applyFiltersAndSearch();  
    });
  }

  /**
   * This method refreshes the product list by applying filtering, searching, and pagination.
   */
  public applyFiltersAndSearch() {
    const filters = [];
    if (this.categoriesSelected && Object.values(this.categoriesSelected).some(selected => selected)) {
      const categories = Object.keys(this.categoriesSelected).flatMap(category => this.categoriesSelected![category] ? category : []);
      filters.push({ 
      key: 'category', 
      value: {
        multiselect: this.categoriesSelected,
        type: 'multiselect' as FilterType,
        value: categories,
        range: null,
        greater: null,
        smaller: null
      } 
      });
    }
    if (this.priceRangeSelected && (this.priceRangeSelected.min !== null || this.priceRangeSelected.max !== null)) {
      filters.push({ 
      key: 'price', 
      value: {
        range: this.priceRangeSelected,
        type: 'range' as FilterType,
        value: null,
        greater: null,
        smaller: null,
        multiselect: null
      } 
      });
    }

    this.filteringService.applyFiltersAndSearch(this.searchTerm, filters, this.currentPage, this.pageSize)
      .subscribe(response => {
      this.currentPageProducts = response.products;
      this.totalItems = response.totalItems;
      });
  }
  /**
   * Paginates the filtered products based on the current page and page size.
   * 
   * This method calculates the starting index for the current page and slices
   * the filtered products array to get the products for the current page.
   * 
   * @private
   */
  private paginateProducts() {
    this.filteringService.paginate(this.currentPage, this.pageSize).subscribe(paginatedProducts => {
      this.currentPageProducts = paginatedProducts;
    });
  }

  /**
   * Handles the event when the page changes.
   * Updates the current page number and triggers the pagination of products.
   * 
   * @param {number} newPage - The new page number to navigate to.
   */
  public onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.paginateProducts();
  }


  /**
   * Handles the change in page size for the product list.
   * Updates the page size and resets the current page to the first page.
   * Reapplies all filters and pagination to reflect the new page size.
   *
   * @param {number} newSize - The new page size selected by the user.
   */
  public onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.applyFiltersAndSearch();  // Reapply all filters and pagination
  }

  /**
   * Handles the search functionality by updating the search term,
   * resetting the current page to the first page, and reapplying
   * all filters and pagination.
   *
   * @param {string} term - The search term entered by the user.
   */
  public onSearch(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.applyFiltersAndSearch();  // Reapply all filters and pagination
  }


  /**
   * Handles the change event when categories are selected.
   * Updates the selected categories and reapplies all filters and pagination.
   *
   * @param {Filter} filterChange - The filter change event containing the updated multiselect categories.
   */
  public onCategoriesSelectedChange(filterChange: Filter) {
    this.categoriesSelected = filterChange.multiselect;
    this.applyFiltersAndSearch();  // Reapply all filters and pagination
  }

  /**
   * Handles the change in the price range filter.
   * Updates the selected price range and reapplies all filters and pagination.
   * 
   * @param {Filter} filterChange - The filter change event containing the updated multiselect categories.
   */
  public onPriceRangeChange(filterChange: Filter) {
    this.priceRangeSelected = filterChange.range;
    this.applyFiltersAndSearch();  // Reapply all filters and pagination
  }
}

export { ProductListComponent };