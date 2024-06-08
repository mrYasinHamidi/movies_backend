const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../models/app_error");
require('dotenv').config();

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        if (!token) {
            return next(new AppError('No token provided', 401));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return next(new AppError('Invalid Token', 401));
        }
        next();
    } catch (e) {
        next(new AppError('Unauthorized', 401));
    }
}

module.exports = authenticate;