const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const setupSwagger = require('./swagger');


// Load environment variables
dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB:', err));


// Use Swagger
setupSwagger(app);

// Basic route
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const productRoutes = require('./routes/productRoutes');
app.use('/api', productRoutes);

app.use(cors());