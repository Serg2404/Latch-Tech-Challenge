Product Filtering Application
This project is a full-stack application that features a product listing page with filtering, searching, and pagination capabilities. The frontend is built with Angular while the backend is powered by Node.js and MongoDB.

Table of Contents
Backend - Node.js & MongoDB
Setup
API Endpoints
Filtering Logic
Frontend - Angular
Setup
Filter Strategies
Proxy Service
Conclusion
Backend - Node.js & MongoDB
Setup
Install Dependencies:

bash
Copiar código
cd server
npm install
Setup Environment Variables: Create a .env file in the root of the server folder with the following variables:

bash
Copiar código
MONGO_URI=mongodb://localhost:27017/your-database
PORT=3000
Run the Server: Start the backend server:

bash
Copiar código
npm run dev
The server should now be running on http://localhost:3000.

API Endpoints
GET /products: Fetch all products.
POST /products/filter: Retrieve filtered products based on criteria such as category, price range, and search term.
Sample API Call for Filtering Products
json
Copiar código
{
    "searchTerm": "laptop",
    "currentPage": 1,
    "pageSize": 10,
    "filters": [
        {
            "key": "category",
            "values": ["electronics"],
            "type": "string",
            "logic": "and"
        },
        {
            "key": "price",
            "values": ["100", "500"],
            "type": "range",
            "logic": "or"
        }
    ]
}
Filtering Logic
The backend filtering is done based on a payload object that includes search terms, filters, and pagination details. The filtering supports multiple fields such as categories, price ranges, and free-text search.

Frontend - Angular
Setup
Install Dependencies:

bash
Copiar código
cd angular-app
npm install
Setup Environment Variables: Modify the environment.ts file to set the base API URL:

typescript
Copiar código
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
Run the Application: Start the frontend development server:

bash
Copiar código
ng serve
The application should now be running on http://localhost:4200.

Filter Strategies
The Angular application employs a Strategy Pattern for filtering, searching, and pagination. There are two filtering strategies implemented, which dynamically switch based on the number of products fetched from the API.

Client-Side Filtering:

This strategy performs filtering, searching, and pagination in the browser.
It is used when the number of products is small enough to efficiently manage in the client.
Advantages:
Reduces server load by handling filtering on the client side.
Faster for small datasets.
Server-Side Filtering:

This strategy sends the filtering, searching, and pagination parameters to the backend for processing.
It is used when the product count is large, making it inefficient to load and filter all products in the client.
Advantages:
Scales better for large datasets.
Optimizes network usage by only fetching relevant data.
Proxy Service
The Proxy Service is responsible for determining which strategy to use based on the number of products. It fetches the product count and dynamically switches between Client-Side and Server-Side filtering strategies.

Example:
typescript
Copiar código
import { Injectable } from '@angular/core';
import { ProductFilterStrategy } from './product-filter-strategy.interface';
import { ClientSideFilterStrategy } from './client-side-filter.strategy';
import { ServerSideFilterStrategy } from './server-side-filter.strategy';

@Injectable({
  providedIn: 'root'
})
export class ProductFilterProxyService {
  private clientSideStrategy: ProductFilterStrategy = new ClientSideFilterStrategy();
  private serverSideStrategy: ProductFilterStrategy = new ServerSideFilterStrategy();

  constructor(private productService: ProductService) {}

  public getStrategy(productCount: number): ProductFilterStrategy {
    return productCount > 100 ? this.serverSideStrategy : this.clientSideStrategy;
  }
}
Conclusion
This project demonstrates the use of both client-side and server-side filtering strategies based on the product count, ensuring efficient handling of both small and large datasets. The Proxy Service facilitates dynamic strategy selection, improving the scalability of the application.

For questions or contributions, feel free to raise issues or submit pull requests.
