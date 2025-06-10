const Category = require("../models/Category");

async function getAllCategories(){
    const categories = await Category.find();
    return categories
}

module.exports = {
    getAllCategories
}