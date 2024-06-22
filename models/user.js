const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
const pwdSchema = new passwordValidator();
require('dotenv').config();

pwdSchema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] // Regular expression for email validation
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return pwdSchema.validate(value);
            },
            message: props => 'Password validation failed: ' + pwdSchema.validate(props.value, {list: true}).join(', ')
        },
    },
    refreshToken: {
        type: String,
        default: null,
    }

}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
    const payload = {id: this._id, email: this.email};
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

userSchema.methods.generateRefreshToken = function () {
    const payload = {id: this._id, email: this.email};
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    });
};

module.exports = mongoose.model('User', userSchema);
