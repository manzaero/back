const express = require('express');
const router = express.Router();
const { getAllProducts, getProduct, addProduct, editProduct, deleteProduct } = require('../controllers/product');
const mapProducts = require('../helpers/mapProducts');
const hasRole = require('../middlewares/hasRole');
const ROLES = require('../constants/roles');

router.get('/', async (req, res) => {
    const { products, lastPage } = await getAllProducts(req.query.search, req.query.limit, req.query.page);
    res.send({ data: lastPage, products: products.map(mapProducts) });
});

router.get('/:id', async (req, res) => {
    const product = await getProduct(req.params.id);
    res.send({ data: mapProducts(product) });
});

router.post('/', hasRole([ROLES.ADMIN]), async (req, res) => {
    try {
        const newProduct = await addProduct(req.body);
        res.send({ data: mapProducts(newProduct) });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.patch('/:id', hasRole([ROLES.ADMIN]), async (req, res) => {
    const updated = await editProduct(req.params.id, req.body);
    res.send({ data: mapProducts(updated) });
});

router.delete('/:id', hasRole([ROLES.ADMIN]), async (req, res) => {
    await deleteProduct(req.params.id);
    res.send({ error: null, message: 'Product deleted successfully.' });
});

module.exports = router;
