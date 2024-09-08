const {User, Manager, Personnel} = require('../../user/models/user_model');

const Token = require('../models/token');

const AppError = require('../../../models/app_error');

const tokenHelper = require('../../../helpers/token_helper');

const nodemailer = require('nodemailer');

const register = async (req, res, next) => {
    const {email, password, password_confirm, name, phone} = req.body;
    try {

        let user = await Manager.findOne({
            $or: [
                {email: email},
                {phone: phone}
            ]
        });

        if (user) {
            return next(new AppError('User with this email or phone number already exists', 402));
        }
        if (password !== password_confirm) {
            return next(new AppError('Password and password confirmation is not equal', 402));
        }

        user = new Manager({email: email, name: name, phone: phone, password: password});

        await user.save();
        return res.success();

    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        let user = await Manager.findOne({email});

        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Email or password incorrect', 401));
        }

        const userId = user._id;

        const accessToken = tokenHelper.generateToken(userId, true);

        const refreshToken = tokenHelper.generateToken(userId, false);

        const token = new Token({userId: userId, token: refreshToken});

        await token.save();

        await user.save();

        return res.success({accessToken, refreshToken});

    } catch (e) {
        next(e);
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req.body;

        if (!refreshToken) {
            return next(new AppError('No refresh token provided', 401));
        }

        let token = await Token.findOne({token: refreshToken});

        if (!token) {
            return next(new AppError('Invalid refresh token provided', 401));
        }

        const isTokenValid = tokenHelper.isValid(refreshToken);

        if (!isTokenValid) {
            return next(new AppError('Invalid refresh token provided', 401));
        }

        const userId = tokenHelper.getUserId(refreshToken);

        const newAccessToken = tokenHelper.generateToken(userId, true);

        const newRefreshToken = tokenHelper.generateToken(userId, false);

        token.token = newRefreshToken;

        await token.save();

        res.success({accessToken: newAccessToken, refreshToken: newRefreshToken});

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