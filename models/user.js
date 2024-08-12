const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const PasswordValidator = require('password-validator');

const pwdSchema = new PasswordValidator();

pwdSchema
    .is().min(8)
    .is().max(100)
    .has().lowercase()
    .has().digits(1)
    .has().not().spaces();

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
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
        required: true,
        unique: true,
        match: [/^09\d{9}$/, 'Invalid phone number']
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

userSchema.query.employeesOf = function (userId) {
    return this.where({managerId: userId})
}

userSchema.query.paginate = function (page, perPage) {
    const skip = (page - 1) * perPage;
    return this.skip(skip).limit(perPage);
}

userSchema.query.format = function () {
    return this.select(
        {
            password: 0,
            employees: 0,
            role: 0,
            __v: 0
        }
    );
}

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

userSchema.static.getPaginatedEmployees = async function (userId, page, perPage) {
    try {
        const totalDocuments = await this.countDocuments();

        const users = await this.find()
            .employeesOf(userId)
            .paginate(page, perPage)
            .exec();

        const totalPages = Math.ceil(totalDocuments / perPage);

        return {
            users,
            totalPages,
            currentPage: page,
        };

    } catch (err) {
        throw err;
    }
}
module.exports = mongoose.model('User', userSchema);
