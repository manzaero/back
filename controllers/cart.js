const Cart = require('../models/Cart');

async function getCart(userId) {
    try {
        const cart = await Cart.findOne({ userId });
        console.log('Fetched cart:', cart);
        if (!cart) {
            throw new Error("Cart not found");
        }
        return cart;
    } catch (error) {
        console.error('Error in getCart:', error);
        throw error;
    }
}

async function saveCart(userId, cartData) {
    const sum = cartData.items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
    return Cart.findOneAndUpdate(
        { userId },
        { $set: { items: cartData.items, sum } },
        { upsert: true, new: true }
    );
}

module.exports = {
    getCart,
    saveCart
}