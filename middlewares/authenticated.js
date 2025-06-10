const {verify} = require("../helpers/token");
const User = require("../models/User");
module.exports = async function (req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.send({error: 'no token'})
    }

    try {
        const tokenData = verify(token)
        const user = await User.findById(tokenData.id);
        if (!user) {
            res.send({error: 'Authenticated user not found'});

            return
        }
        req.user = user
        next()
    } catch (e) {
        res.send({error: e.message})
    }
}