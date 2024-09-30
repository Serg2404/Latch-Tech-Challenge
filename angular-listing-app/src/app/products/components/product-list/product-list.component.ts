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

  constructor(private productService: ProductService) { }

  public ngOnInit() {
    this.initSubscriptions();
  }

  private initSubscriptions() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.categories = [...new Set(this.products.map(p => p.category))];
      this.totalItems = this.products.length;
      this.applyFiltersAndSearch();  // Apply filters and search initially
    });
  }

  /**
   * This method refreshes the product list by applying filtering, searching, and pagination.
   */
  public applyFiltersAndSearch() {
    this.filteredProducts = this.products;  // Start with the full list
    this.filterCategories();                // Apply category filter
    this.filterPriceRange();                // Apply price range filter
    this.searchProducts();                  // Apply search term filter
    this.paginateProducts();                // Paginate the final result
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
  private filterCategories() {
    if (this.categoriesSelected && Object.values(this.categoriesSelected).some(isSelected => isSelected)) {
      this.filteredProducts = this.filteredProducts.filter(p => {
        return this.categoriesSelected && Object.entries(this.categoriesSelected)
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
  private filterPriceRange() {
    if (this.priceRangeSelected) {
      const { min, max } = this.priceRangeSelected;
      if (min !== null && max !== null) {
        this.filteredProducts = this.filteredProducts.filter(p => p.price >= min && p.price <= max);
      }
    }
  }
  
  /**
   * Filters the list of products based on the search term.
   * If a search term is provided, it filters the products by checking if the product's
   * name, category, or description includes the search term (case-insensitive).
   * Updates the total number of filtered products.
   *
   * @private
   */
  private searchProducts() {
    if (this.searchTerm) {
      this.filteredProducts = this.filteredProducts.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.totalItems = this.filteredProducts.length;
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
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.currentPageProducts = this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
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