const Product = require('../models/productModel');

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
    const { name, price, description, image, category, countInStock } = req.body;
    const product = new Product({ name, price, description, image, category, countInStock });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else res.status(404).json({ message: 'Product not found' });
};

const updateProduct = async (req, res) => {
    const { name, price, description, image, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.category = category || product.category;
        product.countInStock = countInStock || product.countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else res.status(404).json({ message: 'Product not found' });
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct, updateProduct };