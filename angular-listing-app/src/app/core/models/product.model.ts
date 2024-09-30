/**
 * Represents a product in the application.
 * 
 * @interface Product
 * @property {number} id - The unique identifier for the product.
 * @property {string} name - The name of the product.
 * @property {string} category - The category to which the product belongs.
 * @property {number} price - The price of the product.
 * @property {string} description - A brief description of the product.
 */
export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string;
    imgUrl?: string;
  }
  