const User = require('../models/user');
const AppError = require('../models/app_error');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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
            console.log(email, password);
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
        const {refreshToken} = req.formData;

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

const stringSchema = new mongoose.Schema({
    value: {type: String, required: true}
});

const StringModel = mongoose.model('String', stringSchema);

const uploadMedia = async (req, res, next) => {
    const stringsList = req.body.strings;

    // Validate the input
    if (!Array.isArray(stringsList)) {
        return res.status(400).json({error: 'Invalid input. Expected an array of strings.'});
    }

    try {
        // Convert the strings into documents
        const stringDocuments = stringsList.map(str => ({value: str}));

        // Insert the documents into the database
        const result = await StringModel.insertMany(stringDocuments);

        // Respond with the number of inserted documents
        res.status(201).json({message: `Inserted ${result.length} documents.`});
    } catch (err) {
        next(err);
    }
}

const getMedia = async (req, res, next) => {
    // Extract query parameters for pagination
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided

    try {
        // Calculate total number of documents and total pages
        const totalDocuments = await StringModel.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);

        // Fetch the documents with pagination
        const strings = await StringModel.find()
            .skip((page - 1) * limit)
            .limit(limit);

        // Respond with the data and pagination info
        res.status(200).json({
            page,
            limit,
            totalPages,
            totalDocuments,
            data: strings
        });
    } catch (err) {
        next(err);
    }
}
module.exports = {register, login, refreshToken, uploadMedia,getMedia};

