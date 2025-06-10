const Product = require("../models/Product");

function addProduct(product){
    return Product.create(product)
}

async function editProduct(id, product){
    const newProduct = await Product.findByIdAndUpdate(id, product, {returnDocument: 'after'})
    return newProduct
}

function deleteProduct(id){
    console.log('Deleting product with id:', id);
    return Product.deleteOne({_id: id})
}

function getProduct(id) {
    return Product.findById(id)
}

async function getAllProducts(search = '', limit = 10, page = 1){
    const [products, count] = await Promise.all([
        Product.find({name: {$regex: search, $options: 'i'}})
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({createdAt: -1}),
        Product.countDocuments({name: {$regex: search, $options: 'i'}})
    ])
    return {
        products,
        lastPage: Math.ceil(count / limit)
    }
}


module.exports = {
    addProduct,
    getProduct,
    editProduct,
    deleteProduct,
    getAllProducts
}