const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { register, login } = require('./controllers/user');
const mapUser = require('./helpers/mapUser');
const mapProducts = require('./helpers/mapProducts');
const mapCart = require('./helpers/mapCart');
const { getAllProducts, getProduct, addProduct, editProduct, deleteProduct } = require('./controllers/product');
const hasRole = require('./middlewares/hasRole');
const authenticated = require('./middlewares/authenticated');
const ROLES = require('./constants/roles');
const { getAllCategories } = require('./controllers/category');
const { getCart, saveCart } = require('./controllers/cart');
const cors = require('cors');

const port = 3001;
const app = express();
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());

app.post('/api/register', async (req, res) => {
    try {
        const { user, token } = await register(req.body.name, req.body.email, req.body.password);
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000, }).send({ error: null, user: mapUser(user) });
    } catch (e) {
        res.send({ error: e.message || 'Unknown error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { user, token } = await login(req.body.email, req.body.password);
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000, }).send({ error: null, user: mapUser(user) });
    } catch (e) {
        res.send({ error: e.message || 'Unknown error' });
    }
});

app.post('/api/logout', async (req, res) => {
    res.cookie('token', '', { httpOnly: true }).send({ error: null, user: null, message: 'Logged out' });
});

app.get('/api/products', async (req, res) => {
    const { products, lastPage } = await getAllProducts(req.query.search, req.query.limit, req.query.page);
    res.send({ data: lastPage, products: products.map(mapProducts) });
});

app.get('/api/products/:id', async (req, res) => {
    const product = await getProduct(req.params.id);
    res.send({ data: mapProducts(product) });
});

app.get('/api/categories', async (req, res) => {
    const categories = await getAllCategories();
    res.send({ data: categories });
});

app.use(authenticated);

app.get('/api/cart', authenticated, async (req, res) => {
    try {
        console.log('Fetching cart for user:', req.user.id);
        const cart = await getCart(req.user.id);
        console.log(cart)
        console.log('Raw cart data:', cart);
        if (!cart) {
            console.log('Cart not found for user:', req.user.id);
            return res.status(200).send({ items: [], sum: 0 });
        }
        const mappedCart = mapCart(cart);
        console.log(mappedCart)
        console.log('Mapped cart data:', mappedCart);
        res.send(mappedCart);
    } catch (e) {
        console.error('Error in GET /api/cart:', e);
        res.status(500).send({ error: e.message });
    }
});

app.put('/api/cart/:userId', authenticated, async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).send({ error: 'Forbidden' });
        }
        const updatedCart = await saveCart(req.params.userId, req.body);
        res.send(updatedCart);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.post('/api/products', hasRole([ROLES.ADMIN]), async (req, res) => {
    console.log('product data:', req.body);
    try {
        const newProduct = await addProduct({
            name: req.body.name,
            image_url: req.body.image_url,
            product_description: req.body.product_description,
            count: req.body.count,
            price: req.body.price,
            category: req.body.category,
        });
        console.log('Created product:', newProduct);
        res.send({ data: mapProducts(newProduct) });
    } catch (e) {
        console.error('Error creating product:', e);
        res.status(500).send({ error: e.message || 'Unknown error' });
    }
});

app.patch('/api/products/:id', hasRole([ROLES.ADMIN]), async (req, res) => {
    const updateProduct = await editProduct(req.params.id, {
        name: req.body.name,
        image_url: req.body.image_url,
        product_description: req.body.productDescription,
        count: req.body.count,
        price: req.body.price,
        category: req.body.category,
    });
    res.send({ data: mapProducts(updateProduct) });
});

app.delete('/api/products/:id', hasRole([ROLES.ADMIN]), async (req, res) => {
    console.log('Delete request for product id:', req.params.id);
    await deleteProduct(req.params.id);
    res.send({ error: null, message: 'Product deleted successfully.' });
});

mongoose
    .connect('mongodb+srv://overseer:o5393687@notes.cj1p78t.mongodb.net/shop?retryWrites=true&w=majority')
    .then(() => {
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    });