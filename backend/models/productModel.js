const mongoose = require('mongoose');

const CATEGORIES = [
    'Books (Academic Focus)',
    'Stationery',
    'Electronics',
    'Student Essentials'
];

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: {
        type: String,
        required: true
    },
    description: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: CATEGORIES,
        trim: true
    },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);