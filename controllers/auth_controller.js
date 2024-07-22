const User = require('../models/user');
const AppError = require('../models/app_error');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const register = async (req, res, next) => {
    const {email, password, role} = req.body;
    try {
        let user = await User.findOne({email});
        if (user) {
            return next(new AppError('User already exists', 402));
        }
        user = new User({email, password, role});
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        res.status(201).json({accessToken, refreshToken});
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const {email, password, role} = req.body;
        const user = await User.findOne({email});

        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Email or password incorrect', 401));
        }

        if (user.role !== role) {
            return next(new AppError('Wrong role', 400));
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

const sendEmail = async (req, res, next) => {
    try {
        const {email} = req.body;
        const transporter = nodemailer.createTransport({
                service: 'gmail', auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                }
            }
        );
        const mailOptions = {
            to: email,
            from: 'yasinhamidi945@gmail.com',
            subject: 'Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                next(error);
            } else {
                res.status(200).json({message: 'An e-mail has been sent to ' + email + ' with further instructions.'});
            }
        });

    } catch (e) {
        next(e);

    }
}
module.exports = {register, login, refreshToken, sendEmail}