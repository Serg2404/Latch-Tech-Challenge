import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { PRODUCTS } from '../../mocks/products.mock';

/**
 * @fileoverview ProductService is responsible for fetching product data.
 * It can either return mock data or make real API calls to fetch products.
 * 
 * @example
 * // Using ProductService to get products
 * constructor(private productService: ProductService) {}
 * 
 * this.productService.getProducts().subscribe(products => {
 *   console.log(products);
 * });
 * 
 * @class
 * @description This service provides methods to fetch product data.
 * 
 * @injectable
 * @providedIn 'root'
 */
@Injectable({
    providedIn: 'root'
})
class ProductService {
    constructor(private http: HttpClient) { }

    // For mock data
    /**
     * Retrieves a list of products.
     *
     * @returns {Observable<Product[]>} An observable that emits an array of products.
     */
    public getProducts(): Observable<Product[]> {
        return of(PRODUCTS);
    }

    // For real API calls (optional)
    // getProducts(): Observable<Product[]> {
    //   return this.http.get<Product[]>('https://api.example.com/products');
    // }
}

export { ProductService };
