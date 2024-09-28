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

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      this.filterAndPaginate();
    });
  }

  filterAndPaginate() {
    this.filteredProducts = this.products
      .filter(p => p.category.includes(this.filterCategory) && p.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.filterAndPaginate();
  }
}

export { ProductListComponent };