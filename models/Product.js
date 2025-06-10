const mongoose = require('mongoose');
const validator = require('validator');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
    product_description: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    }
}, {timestamps: true});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;