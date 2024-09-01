const {User} = require("../parts/user/models/user_model");

const AppError = require("../models/app_error");

const tokenHelper = require("../helpers/token_helper");

const authenticate = async (req, res, next) => {
    try {

        const token = req.headers.authorization.replace('Bearer ', '');

        if (!token) {
            return next(new AppError('No token provided', 401));
        }

        if (!tokenHelper.isValid(token)) {
            return next(new AppError('Invalid token', 401));
        }

        const userId = tokenHelper.getUserId(token);

        const user = await User.findById(userId);

        if (!user) {
            return next(new AppError('Invalid token', 401));
        }

        req.user = user;

        next();

    } catch (e) {

        console.log(e);

        next(new AppError('Unauthorized', 401));

    }
}

module.exports = authenticate;