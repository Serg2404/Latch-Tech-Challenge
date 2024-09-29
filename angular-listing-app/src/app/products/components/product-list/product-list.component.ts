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

/**
 * @fileoverview ProductListComponent is responsible for displaying and managing a list of products.
 * It includes functionalities such as searching, filtering by category and price range, and pagination.
 * 
 * @component
 * @selector app-product-list
 * @standalone true
 * @imports [CommonModule, PaginationComponent, SearchComponent, ProductComponent, FilterComponent]
 * @templateUrl ./product-list.component.html
 * 
 * @class ProductListComponent
 * @implements OnInit
 * 
 * @property {Product[]} private products - The complete list of products.
 * @property {Product[]} private filteredProducts - The list of products filtered based on search criteria.
 * @property {Product[]} public currentPageProducts - The list of products to be displayed on the current page.
 * @property {number} public currentPage - The current page number.
 * @property {number} public pageSize - The number of products to display per page.
 * @property {string} public searchTerm - The term used for searching products.
 * @property {number} public totalItems - The total number of items after filtering.
 * @property {number[]} public pageSizeOptions - The options for the number of products to display per page.
 * @property {string[]} public categories - The list of product categories.
 * @property {Map<string, boolean> | null} public categoriesSelected - The selected categories for filtering.
 * @property {PriceRange | null} public priceRangeSelected - The selected price range for filtering.
 * 
 * @constructor
 * @param {ProductService} private productService - The service used to fetch products.
 * 
 * @method ngOnInit - Initializes the component by setting up subscriptions.
 * @method private initSubscriptions - Subscribes to the product service to fetch the list of products and initializes categories.
 * @method public refreshProducts - Refreshes the list of products by performing a search and then paginating the results.
 * @method private searchProducts - Filters the list of products based on the search term.
 * @method private paginateProducts - Paginates the filtered products based on the current page and page size.
 * @method public onPageChange - Handles the event when the page is changed.
 * @method public onPageSizeChange - Handles the change in page size for the product list.
 * @method public onSearch - Handles the search functionality by updating the search term and refreshing the product list.
 * @method private filterCategories - Filters the products based on the selected categories.
 * @method private filterPriceRange - Filters the products based on the selected price range.
 * @method public onCategoriesSelectedChange - Handles the change event when categories are selected.
 * @method public onPriceRangeChange - Handles the change event for the selected price range filter.
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent, SearchComponent, ProductComponent, FilterComponent],
  templateUrl: './product-list.component.html',
})
class ProductListComponent implements OnInit {
  private products: Product[] = [];
  private filteredProducts: Product[] = [];
  public currentPageProducts: Product[] = [];
  public currentPage = 1;
  public pageSize = 10;
  public searchTerm = '';
  public totalItems = 0;
  public pageSizeOptions = [5, 10, 20, 50];
  public categories: Array<string> = [];
  public categoriesSelected: Map<string, boolean> | null = new Map<string, boolean>();
  public priceRangeSelected: PriceRange | null = { min: null, max: null };

  constructor(private productService: ProductService) { }

  public ngOnInit() {
    this.initSubscriptions();
  }

  /**
   * Initializes the subscriptions for the component.
   * 
   * This method subscribes to the product service to fetch the list of products.
   * Once the data is received, it updates the component's products and totalItems properties,
   * and then refreshes the product list.
   * 
   * @private
   */
  private initSubscriptions() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.categories = [...new Set(this.products.map(p => p.category))];
      this.totalItems = this.products.length;
      this.refreshProducts();
    });
  }
    

  /**
   * Refreshes the list of products by performing a search and then paginating the results.
   * This method first calls `searchProducts` to update the product list based on the current search criteria,
   * and then calls `paginateProducts` to organize the products into pages.
   */
  public refreshProducts() {
    this.searchProducts();
    this.paginateProducts();
  }
  
  /**
   * Filters the list of products based on the search term.
   * The search is performed on the product's name, category, and description.
   * The filtered products are stored in `filteredProducts` and the total number
   * of filtered items is updated in `totalItems`.
   *
   * @private
   */
  private searchProducts() {
    this.filteredProducts = this.products
      .filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    this.totalItems = this.filteredProducts.length;
  }

  /**
   * Paginates the filtered products based on the current page and page size.
   * 
   * This method calculates the starting index for the current page and slices the 
   * `filteredProducts` array to include only the products for that page.
   * 
   * @private
   */
  private paginateProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.currentPageProducts = this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  /**
   * Handles the event when the page is changed.
   * Updates the current page and refreshes the product list.
   * 
   * @param newPage - The new page number to navigate to.
   */
  public onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.paginateProducts();
  }

  /**
   * Handles the change in page size for the product list.
   * 
   * @param newSize - The new page size to be set.
   */
  public onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.refreshProducts();
  }

  /**
   * Handles the search functionality by updating the search term,
   * resetting the current page to the first page, and refreshing the product list.
   *
   * @param term - The search term entered by the user.
   */
  public onSearch(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.refreshProducts();
  }
  /**
   * Filters the products based on the selected categories.
   * 
   * If there are selected categories, it filters the products to include only those
   * whose category is in the selected categories. Otherwise, it includes all products.
   * 
   * After filtering, it updates the total number of items and refreshes the product list.
   * 
   * @private
   */
  private filterCategories() {
    if (this.categoriesSelected && Array.from(this.categoriesSelected.values()).some(isSelected => isSelected)) {
      this.filteredProducts = this.products.filter(p => {
      return Array.from(this.categoriesSelected!.entries())
        .filter(([_, isSelected]) => isSelected)
        .map(([category, _]) => category)
        .includes(p.category);
      });
    } else {
      this.filteredProducts = this.products;
    }
    this.totalItems = this.filteredProducts.length;
    this.currentPage = 1; 
    this.paginateProducts();
  }

  /**
   * Filters the products based on the selected price range.
   * 
   * This method checks if a price range is selected and if both the minimum and maximum values are not null.
   * If the conditions are met, it filters the `filteredProducts` array to include only those products whose
   * prices fall within the specified range. If both min and max values are empty, it shows all products.
   * It then updates the `totalItems` property with the length of the filtered products array and calls 
   * `refreshProducts()` to update the displayed products.
   * 
   * @private
   */
  private filterPriceRange() {
    console.log(this.priceRangeSelected);
    if (this.priceRangeSelected) {
      const { min, max } = this.priceRangeSelected;
      if (min !== null && max !== null) {
        this.filteredProducts = this.products.filter(p => p.price >= min && p.price <= max);
      } else {
        this.filteredProducts = this.products;
      }
    } else {
      this.filteredProducts = this.products;
    }
    console.log(this.filteredProducts);
    this.totalItems = this.filteredProducts.length;
    this.currentPage = 1;
    this.paginateProducts();
  }

  /**
   * Handles the change event when categories are selected.
   * Updates the selected categories and applies the category filter.
   *
   * @param filterChange - The filter object containing the selected categories.
   */
  public onCategoriesSelectedChange(filterChange: Filter) {
    this.categoriesSelected = filterChange.multiselect;
    console.log(this.categoriesSelected);
    this.filterCategories();
  }

  /**
   * Handles the change event for the selected price range filter.
   * Updates the `priceRangeSelected` property with the new range from the filter change event
   * and triggers the filtering of products based on the selected price range.
   *
   * @param filterChange - The filter change event containing the new price range.
   */
  public onPriceRangeChange(filterChange: Filter) {
    this.priceRangeSelected = filterChange.range;
    this.filterPriceRange();
  }
}

export { ProductListComponent };