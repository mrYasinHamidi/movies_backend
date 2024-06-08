const User = require('../models/user');

const getUsers = async (req, res, next) => {

    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (e) {
        next(e);
    }
}

module.exports = getUsers