const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// MongoDB Product Schema (Adjust based on your product model)
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  imgUrl: String,
});

const Product = mongoose.model('Product', productSchema);

// Load mock products from the JSON file
const mockProducts = JSON.parse(fs.readFileSync('./scripts/product-data.json', 'utf-8'));

async function uploadMockProducts() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if products already exist in the database
    const existingProducts = await Product.find();
    if (existingProducts.length > 0) {
      console.log('Products already exist in the database, skipping migration.');
      return;
    }

    // Insert mock products into the database
    await Product.insertMany(mockProducts);
    console.log('Mock products uploaded successfully!');
  } catch (error) {
    console.error('Error uploading mock products:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
  }
}

uploadMockProducts();
