const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

const addOrderItems = async (req, res) => {
    const { 
        orderItems, 
        totalPrice, 
        shippingAddress,
        paymentMethod = 'Cash on Delivery'
    } = req.body;
    
    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }
    
    // Validate shipping address
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.postalCode || !shippingAddress.country || !shippingAddress.phone) {
        return res.status(400).json({ message: 'Please provide complete shipping address' });
    }
    
    // Validate phone number format (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(shippingAddress.phone)) {
        return res.status(400).json({ message: 'Phone number must be 10 digits' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check all items are in stock and update stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product).session(session);
            
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: `Product ${item.name} not found` });
            }
            
            if (product.countInStock < item.qty) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ 
                    message: `Not enough stock for ${product.name}. Only ${product.countInStock} available` 
                });
            }

            // Update stock
            product.countInStock -= item.qty;
            await product.save({ session });
        }

        // Create order
        const order = new Order({
            orderItems: orderItems.map(x => ({
                name: x.name,
                qty: x.qty,
                image: x.image,
                price: x.price,
                product: x.product,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress: {
                address: shippingAddress.address,
                city: shippingAddress.city,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
                phone: shippingAddress.phone
            },
            paymentMethod,
            paymentResult: {
                id: null,
                status: 'pending',
                update_time: null,
                email_address: null
            },
            totalPrice,
            isPaid: false,
            paidAt: null,
            isDelivered: false,
            deliveredAt: null
        });

        const createdOrder = await order.save({ session });
        
        await session.commitTransaction();
        session.endSession();
        
        res.status(201).json(createdOrder);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};

const trackOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .select('-__v -updatedAt')
            .populate('user', 'name email');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        // Format the response
        const response = {
            ...order._doc,
            status: order.isDelivered ? 'delivered' : 
                   order.isShipped ? 'shipped' :
                   order.isPaid ? 'processing' : 'pending'
        };
        res.json(response);
    } catch (error) {
        console.error('Error tracking order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addOrderItems, getMyOrders, getAllOrders,  trackOrder };