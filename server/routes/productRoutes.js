const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const productController = require('../controllers/productController');

// Create a product
router.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     description: Retrieve a list of products from the database.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The product name.
 *                     example: iPhone
 *                   price:
 *                     type: number
 *                     description: The product price.
 *                     example: 999
 *                   category:
 *                     type: string
 *                     description: The product category.
 *                     example: Electronics
 *                   imgUrl:
 *                     type: string
 *                     description: The product image URL.
 *                     example: http://example.com/image.jpg
 *       500:
 *         description: Failed to fetch products.
 */
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

/** 
 * @swagger
 * /api/products/count:
 *   get:
 *     summary: Retrieve the total count of products
 *     description: Retrieve the total count of products from the database.
 *     responses:
 *       200:
 *         description: The total count of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                   example: 10
 *       500:
 *         description: Failed to fetch products
*/
router.get('/products/count', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.json(count);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products count' });
    }
});

// Update a product
router.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

/**
 * @swagger
 * /api/products/filter:
 *   post:
 *     summary: Filter and search products based on various criteria.
 *     description: Retrieves a list of products that match the search term, filters, and pagination settings provided in the request payload.
 *     tags: 
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               searchTerm:
 *                 type: string
 *                 description: The search term to filter products by name, description, or category.
 *                 example: "phone"
 *               currentPage:
 *                 type: integer
 *                 description: The current page number for pagination.
 *                 example: 1
 *               pageSize:
 *                 type: integer
 *                 description: The number of products to display per page.
 *                 example: 10
 *               filters:
 *                 type: array
 *                 description: A list of filters to apply.
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       description: The field on which to apply the filter (e.g., "price", "category").
 *                       example: "price"
 *                     values:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["500", "1000"]
 *                     type:
 *                       type: string
 *                       description: The type of filter (e.g., "range" for price, "multiselect" for categories).
 *                       example: "range"
 *                     logic:
 *                       type: string
 *                       description: Whether the filter applies with "and" or "or" logic.
 *                       example: "and"
 *     responses:
 *       200:
 *         description: A list of filtered products and the total number of products that match the criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   description: The filtered products.
 *                 totalItems:
 *                   type: integer
 *                   description: The total number of products that match the filtering criteria.
 *                   example: 50
 *       400:
 *         description: Bad request if the payload is malformed.
 *       500:
 *         description: Internal server error if filtering fails.
 */
router.post('/products/filter', productController.filterProducts);

module.exports = router;
