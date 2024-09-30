import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './products/components/product-list/product-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  template: `
    <app-product-list></app-product-list>
  `,
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
}