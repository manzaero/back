const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/user');
const mapUser = require('../helpers/mapUser');

router.post('/register', async (req, res) => {
    try {
        const { user, token } = await register(req.body.name, req.body.email, req.body.password);
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }).send({ error: null, user: mapUser(user) });
    } catch (e) {
        res.send({ error: e.message || 'Unknown error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { user, token } = await login(req.body.email, req.body.password);
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }).send({ error: null, user: mapUser(user) });
    } catch (e) {
        res.send({ error: e.message || 'Unknown error' });
    }
});

router.post('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true }).send({ error: null, user: null, message: 'Logged out' });
});

module.exports = router;
