const express = require('express');
const router = express.Router();
const authenticated = require('../middlewares/authenticated');
const { getCart, saveCart } = require('../controllers/cart');
const mapCart = require('../helpers/mapCart');

router.use(authenticated);

router.get('/', async (req, res) => {
    try {
        const cart = await getCart(req.user.id);
        if (!cart) return res.status(200).send({ items: [], sum: 0 });
        res.send(mapCart(cart));
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.put('/:userId', async (req, res) => {
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

module.exports = router;
