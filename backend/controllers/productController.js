const Product = require('../models/productModel');
const path = require('path');
const fs = require('fs');

// @desc    Fetch all products or filter by category
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};

        // If a category is provided in the URL (?category=books), filter the DB results
        if (category) {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') }; 
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
};

const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, countInStock } = req.body;
        
        // Handle file upload
        let image = '';
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        const product = new Product({ 
            name, 
            price, 
            description, 
            image, 
            category, 
            countInStock 
        });
        
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        // If there's an error, remove the uploaded file
        if (req.file) {
            const filePath = path.join(__dirname, '..', req.file.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        res.status(400).json({ message: error.message || 'Error creating product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete the associated image file if it exists
        if (product.image) {
            const imagePath = path.join(__dirname, '..', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, price, description, category, countInStock } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Handle file upload if a new image is provided
        if (req.file) {
            // Delete old image if it exists
            if (product.image) {
                const oldImagePath = path.join(__dirname, '..', product.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            product.image = `/uploads/${req.file.filename}`;
        }

        // Update other fields
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.category = category || product.category;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        // If there's an error, remove the uploaded file
        if (req.file) {
            const filePath = path.join(__dirname, '..', req.file.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        res.status(400).json({ message: error.message || 'Error updating product' });
    }
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct, updateProduct };