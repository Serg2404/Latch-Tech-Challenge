const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

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
*         count: 10
*         description: The total count of products.
*         content:
*           application/json:
*             schema:
*               type: number
*               example: 10
*       500:
*         description: Failed to fetch products count.
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

module.exports = router;
