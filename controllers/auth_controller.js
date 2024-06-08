const User = require('../models/user');
const AppError = require('../models/app_error');

const register = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if (user) {
            return next(new AppError('User already exists', 402));
        }
        user = new User({email, password});
        await user.save();
        const token = user.generateToken();
        res.status(201).json({user, token});
    } catch (e) {
        next(e);
    }
}

const getUsers = async (req, res) => {

    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
}

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Email or password incorrect', 401));
        }
        const token = user.generateToken();
        res.status(201).json({user, token});
    } catch (e) {
        next(e);
    }
}

module.exports = {register, login, getUsers}