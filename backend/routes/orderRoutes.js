const express = require('express');
const router = express.Router();
const { 
    addOrderItems, 
    getMyOrders, 
    getAllOrders 
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const { trackOrder } = require('../controllers/orderController');

router.route('/')
    .post(protect, addOrderItems);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/all')
    .get(protect, admin, getAllOrders);

router.get('/track/:id', protect, trackOrder);    


module.exports = router;