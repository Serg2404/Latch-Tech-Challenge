import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { PRODUCTS } from '../../mocks/products.mock';
import { environment } from '../../../environment/environment';

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
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }

    // For mock data
    /**
     * Retrieves a list of products.
     *
     * @returns {Observable<Product[]>} An observable that emits an array of products.
     */
    // public getProducts(): Observable<Product[]> {
    //     return of(PRODUCTS);
    // }

    /**
     * Retrieves a list of products.
     *
     * @returns {Observable<Product[]>} An observable that emits an array of products.
     */
    getProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(this.apiUrl +  '/products');
    }

    /**
     * Retrieves the count of products.
     *
     * @returns {Observable<number>} An observable that emits the count of products.
     */
    getProductsCount(): Observable<number> {
        return this.http.get<number>(this.apiUrl + '/products/count');
    }
}

export { ProductService };
