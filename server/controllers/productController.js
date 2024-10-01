// controllers/productController.js

const Product = require('../models/Product');

// Filters products based on the incoming filter payload
exports.filterProducts = async (req, res) => {
    try {
        const { searchTerm, currentPage, pageSize, filters } = req.body;

        // Base query to start with
        let query = {};

        // Search term filter (applies to name, description, category, etc.)
        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        // Apply each filter in the filters object
        if (filters && filters.filters.length > 0) {
            filters.filters.forEach(filter => {
                let filterKey = filter.key;
                let filterValues = filter.values;
                let filterType = filter.type;
                let logic = filter.logic === "or" ? "$in" : "$all";

                if (filterType === 'range') {
                    // If the filter is a range, apply a range query
                    query[filterKey] = {
                        $gte: parseFloat(filterValues[0]),  // Minimum value
                        $lte: parseFloat(filterValues[1])   // Maximum value
                    };
                } else {
                    // For other types of filters, use logic (AND/OR)
                    query[filterKey] = { [logic]: filterValues };
                }
            });
        }

        // Pagination
        const skip = (currentPage - 1) * pageSize;
        const totalItems = await Product.countDocuments(query);
        const products = await Product.find(query).skip(skip).limit(pageSize);

        res.status(200).json({ products, totalItems });
    } catch (error) {
        console.error('Error filtering products:', error);
        res.status(500).json({ message: 'Failed to filter products' });
    }
};
