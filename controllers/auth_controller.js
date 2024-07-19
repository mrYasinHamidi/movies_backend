const User = require('../models/user');
const AppError = require('../models/app_error');
const jwt = require('jsonwebtoken');
const register = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if (user) {
            return next(new AppError('User already exists', 402));
        }
        user = new User({email, password});
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();
        res.status(201).json({accessToken, refreshToken});
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Email or password incorrect', 401));
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        res.status(201).json({accessToken, refreshToken});
    } catch (e) {
        next(e);
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req.body;

        if (!refreshToken) {
            return res.status(400).json({message: 'No refresh token provided'});
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            console.log(user);
            return next(new AppError('Invalid refresh token', 401));
        }
        const newAccess = user.generateAccessToken();
        const newRefresh = user.generateRefreshToken();
        user.refreshToken = newRefresh;
        await user.save();
        res.status(200).json({newAccess, newRefresh});
    } catch (e) {
        next(e);
    }
}
module.exports = {register, login, refreshToken}