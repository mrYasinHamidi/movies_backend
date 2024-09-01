const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordValidator = require('password-validator');
const bcrypt = require("bcryptjs");

const paginatePlugin = require("../../../databse/plugins/pagination");
const filteringPlugin = require("../../../databse/plugins/filtering");

const pwdSchema = new PasswordValidator();

pwdSchema
    .is().min(8)
    .is().max(100)
    .has().lowercase()
    .has().digits(1)
    .has().not().spaces();

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
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
}, {
    timestamps: true
});

userSchema.plugin(paginatePlugin);

userSchema.plugin(filteringPlugin);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

const managerSchema = new Schema({
    phone: {
        type: String,
        unique: true,
        validate: {
            validator: function (value) {
                return this.role !== 'manager' || /^09\d{9}$/.test(value);
            },
            message: 'Invalid phone number'
        }
    },
    email: {
        type: String,
        lowercase: true,
        unicode: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] // Regular expression for email validation
    },
    employees: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
})
const Manager = User.discriminator('Manager', managerSchema);

const personnelSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    managerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    nationalCode: {
        type: String,
        unique: true,
        required: true,
    },
    personnelCode: {
        type: Number,
        required: true,
        unique: true,
    },
    workStartDate: {
        type: Date,
        default: Date.now,
    },
    workEndDate: {
        type: Date,
    },
    isPresence: {
        type: Boolean,
        default: false
    },
});
const Personnel = User.discriminator('Personnel', personnelSchema);


module.exports = {User, Manager, Personnel}