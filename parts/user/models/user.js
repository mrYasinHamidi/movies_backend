const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const PasswordValidator = require('password-validator');

const pwdSchema = new PasswordValidator();

const paginatePlugin = require('../../../databse/plugins/pagination');
const filteringPlugin = require('../../../databse/plugins/filtering');


pwdSchema
    .is().min(8)
    .is().max(100)
    .has().lowercase()
    .has().digits(1)
    .has().not().spaces();

const userSchema = new Schema({
    email: {
        type: String,
        required: function () {
            return this.role === 'manager';
        },
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] // Regular expression for email validation
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
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
    nationalCode: {
        type: String,
        unique: true
    },
    personnelCode: {
        type: Number,
        required: () => this.role === 'employee',
    },
    workStartDate: {
        type: Date,
        required: function () {
            return this.role === 'employee';
        },
        default: Date.now
    },
    isPresence: {
        type: Boolean,
        default: false
    },
    workEndDate: {
        type: Date,
    },
    username: {
        type: String,
        unique: true,
        required: () => this.role === 'employee',
    },
    role: {
        type: String,
        required: true,
        enum: ['manager', 'employee'],
        default: 'manager',
    },
    managerId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: () => this.role === 'employee'
    },
    employees: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
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
    timestamps: true // Automatically add createdAt and updatedAt fields
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

userSchema.statics.exists = async function (filter) {
    const count = await this.countDocuments(filter);
    return count > 0;
}

module.exports = mongoose.model('User', userSchema);
