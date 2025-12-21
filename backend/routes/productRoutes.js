const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProductById,
    createProduct, 
    deleteProduct,
    updateProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;