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
const upload = require('../utils/fileUpload');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.route('/')
    .get(getProducts)
    .post(protect, admin, upload.single('image'), createProduct);

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, upload.single('image'), updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;