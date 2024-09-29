import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SearchComponent } from '../../../shared/components/search-bar/search-bar.component';
import { ProductComponent } from '../product/product.component';

/**
 * @fileoverview ProductListComponent is responsible for displaying a list of products
 * with pagination and search functionality.
 * 
 * @component
 * @selector app-product-list
 * @standalone true
 * @imports [CommonModule, PaginationComponent, SearchComponent]
 * @templateUrl ./product-list.component.html
 * 
 * @class ProductListComponent
 * @implements OnInit
 * 
 * @description
 * The ProductListComponent fetches a list of products from the ProductService,
 * filters them based on a search term, and paginates the results. It provides
 * methods to handle page changes, page size changes, and search term updates.
 * 
 * @property {Product[]} products - The complete list of products.
 * @property {Product[]} filteredProducts - The filtered and paginated list of products.
 * @property {number} currentPage - The current page number.
 * @property {number} pageSize - The number of products per page.
 * @property {string} filterCategory - The category to filter products by (not currently used).
 * @property {string} searchTerm - The term to filter products by name or category.
 * @property {number} totalItems - The total number of filtered products.
 * @property {number[]} pageSizeOptions - The available options for the number of products per page.
 * 
 * @constructor
 * @param {ProductService} productService - The service used to fetch products.
 * 
 * @method ngOnInit - Initializes the component by fetching products and setting up initial pagination.
 * @method filterAndPaginate - Filters the products and then paginates the results.
 * @method filterProducts - Filters the products based on the search term.
 * @method paginateProducts - Paginates the filtered products based on the current page and page size.
 * @method onPageChange - Handles changes to the current page.
 * @method onPageSizeChange - Handles changes to the page size.
 * @method onSearch - Handles updates to the search term.
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent, SearchComponent, ProductComponent],
  templateUrl: './product-list.component.html',
})
class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  currentPage = 1;
  pageSize = 10;
  filterCategory = '';
  searchTerm = '';
  totalItems = 0;
  pageSizeOptions = [5, 10, 20, 50];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.totalItems = this.products.length;
      this.filterAndPaginate();
    });
  }

  filterAndPaginate() {
    this.filterProducts();
    this.paginateProducts();
  }

  /**
   * Filters the list of products based on the search term.
   * The search term is matched against the product name or category, both in a case-insensitive manner.
   * Updates the `filteredProducts` array with the products that match the search term.
   * Also updates the `totalItems` property with the count of the filtered products.
   */
  filterProducts() {
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
   * It calculates the starting index for the current page and slices the 
   * filtered products array to include only the products for that page.
   *
   * @remarks
   * This method assumes that `this.currentPage` and `this.pageSize` are 
   * already defined and valid.
   */
  paginateProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredProducts = this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  /**
   * Handles the event when the page is changed.
   * Updates the current page and triggers filtering and pagination.
   *
   * @param newPage - The new page number to set as the current page.
   */
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.filterAndPaginate();
  }

  /**
   * Handles the change in page size for the product list.
   * Updates the page size, resets the current page to the first page,
   * and triggers the filtering and pagination of the product list.
   *
   * @param newSize - The new page size to be set.
   */
  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.filterAndPaginate();
  }

  /**
   * Handles the search functionality by updating the search term,
   * resetting the current page to the first page, and triggering
   * the filter and pagination process.
   *
   * @param term - The search term entered by the user.
   */
  onSearch(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.filterAndPaginate();
  }


}

export { ProductListComponent };