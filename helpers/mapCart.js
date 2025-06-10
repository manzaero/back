module.exports = function (cart) {
    if (!cart || !Array.isArray(cart.items)) {
        return { items: [], sum: 0 };
    }
    return {
        items: cart.items.map(item => ({
            id: item._id?.toString() || '',
            name: item.name || '',
            imageUrl: item.image_url || '',
            price: item.price || 0,
            quantity: item.quantity || 0
        })),
        sum: cart.sum || 0
    };
};