# Product Filtering Application

This project is a full-stack application that features a product listing page with filtering, searching, and pagination capabilities. The frontend is built with **Angular** while the backend is powered by **Node.js** and **MongoDB**.

## Table of Contents

1. [Backend - Node.js & MongoDB](#backend---nodejs--mongodb)
    - [Setup](#setup)
    - [API Endpoints](#api-endpoints)
    - [Filtering Logic](#filtering-logic)
2. [Frontend - Angular](#frontend---angular)
    - [Setup](#setup-1)
    - [Filter Strategies](#filter-strategies)
    - [Proxy Service](#proxy-service)
3. [Conclusion](#conclusion)

---

## Backend - Node.js & MongoDB

### Setup

1. **Install Dependencies**:
    ```bash
    cd server
    npm install
    ```

2. **Setup Environment Variables**:
    Create a `.env` file in the root of the `server` folder with the following variables:
    ```bash
    MONGO_URI=mongodb://localhost:27017/your-database
    PORT=5000
    ```

3. **Run the Server**:
    Start the backend server:
    ```bash
    npm run dev
    ```

    The server should now be running on `http://localhost:5000`.

### API Endpoints

- **`GET /products`**: Fetch all products.
- **`POST /products/filter`**: Retrieve filtered products based on criteria such as category, price range, and search term.

#### Sample API Call for Filtering Products
```json
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
```

### Filtering Logic

The backend filtering is done based on a payload object that includes search terms, filters, and pagination details. The filtering supports multiple fields such as categories, price ranges, and free-text search. The API filters the data and paginates the results before returning them to the frontend.

---

## Frontend - Angular

### Setup

1. **Install Dependencies**:
    ```bash
    cd angular-app
    npm install
    ```

2. **Setup Environment Variables**:
    Modify the `environment.ts` file to set the base API URL:
    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:5000/api'
    };
    ```

3. **Run the Application**:
    Start the frontend development server:
    ```bash
    ng serve
    ```

    The application should now be running on `http://localhost:4200`.

### Filter Strategies

The Angular application employs a **Strategy Pattern** for filtering, searching, and pagination. There are two filtering strategies implemented, which dynamically switch based on the number of products fetched from the API.

1. **Client-Side Filtering**:
    - This strategy performs filtering, searching, and pagination in the browser.
    - It is used when the number of products is **small** enough to efficiently manage in the UI.

    Pros:
    - Faster UI response as operations are done in-memory.
    - Reduces server load for small datasets.

2. **Server-Side Filtering**:
    - This strategy sends filter, search, and pagination requests to the API. The backend handles all operations and returns the result.
    - It is used when the number of products is **large** and client-side operations would become inefficient.

    Pros:
    - Efficient for large datasets as the server performs optimized database queries.
    - Reduces client-side memory usage and processing.

### Proxy Service

A **Proxy Service** is used to determine which filtering strategy to apply. It abstracts the logic of determining whether to use client-side or server-side filtering based on the number of products retrieved.

- **Switch Logic**: 
  - If the product count retrieved from the API is below a certain threshold (e.g., 100 products), the **Client-Side Filtering** strategy is used.
  - If the product count is above the threshold, the **Server-Side Filtering** strategy is used.

The service makes use of two different implementations (strategies) of filtering logic but presents a unified API to the component, making it easier to maintain and extend.

---

## Conclusion

This project showcases the use of a **Strategy Pattern** in Angular for efficient product filtering, searching, and pagination. By switching between client-side and server-side strategies dynamically, the application maintains performance for both small and large datasets. The backend, powered by **Node.js** and **MongoDB**, handles data storage and complex filtering operations, while the frontend ensures a responsive and interactive user experience.



