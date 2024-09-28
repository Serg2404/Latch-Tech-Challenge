import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
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

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.totalItems = this.products.length;
      this.filterAndPaginate();
    });
  }

  filterAndPaginate() {
    const filtered = this.products
      .filter(p => p.category.includes(this.filterCategory) && p.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.totalItems = filtered.length;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.filteredProducts = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.filterAndPaginate();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.filterAndPaginate();
  }
}

export { ProductListComponent };