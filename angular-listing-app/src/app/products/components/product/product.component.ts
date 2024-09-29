import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product } from '../../../core/models/product.model';

/**
 * Component representing a product.
 * 
 * @selector product
 * @standalone true
 * @templateUrl ./product.component.html
 * @styleUrls ./product.component.scss
 * @imports CommonModule
 */
@Component({
    selector: 'product',
    standalone: true,
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    imports: [CommonModule],
})
export class ProductComponent {
    @Input()product!: Product;
}