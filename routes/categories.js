const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../controllers/category');

router.get('/', async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.send({ data: categories });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
