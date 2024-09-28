import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './products/components/product-list/product-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  template: `
    <h1>Product Listing App</h1>
    <app-product-list></app-product-list>
  `,
})
export class AppComponent {}