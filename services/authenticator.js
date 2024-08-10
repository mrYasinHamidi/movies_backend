const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const AppError = require("../models/app_error");
require('dotenv').config();

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        if (!token) {
            return next(new AppError('No token provided', 401));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const t = await Token.findOne({token: token, type: 'access'});
        if (!t) {
            return next(new AppError('Invalid Token', 401));
        }
        req.user = t.userId;
        next();
    } catch (e) {
        console.log(e);
        next(new AppError('Unauthorized', 401));
    }
}

module.exports = authenticate;