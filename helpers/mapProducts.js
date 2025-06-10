module.exports = function (product){
    return {
        id: product._id,
        name: product.name,
        imageUrl: product.image_url,
        productDescription: product.product_description,
        count: product.count,
        price: product.price,
        category: product.category
    }
}