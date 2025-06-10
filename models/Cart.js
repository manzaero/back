const mongoose = require('mongoose');

const CartItemSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
})

const CartSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    items: [CartItemSchema],
    sum: {
        type: Number,
        required: true,
    }
})

const Cart = mongoose.model('Cart', CartSchema, 'cart');

module.exports = Cart;