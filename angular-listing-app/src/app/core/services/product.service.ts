import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { PRODUCTS } from '../../mocks/products.mock';

@Injectable({
    providedIn: 'root'
})
class ProductService {
  constructor(private http: HttpClient) {}

  // For mock data
  getProducts(): Observable<Product[]> {
    return of(PRODUCTS);
  }

  // For real API calls (optional)
  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>('https://api.example.com/products');
  // }
}

export { ProductService };
