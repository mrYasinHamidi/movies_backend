const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PasswordValidator = require("password-validator");
const bcrypt = require("bcryptjs");

const passwordSchema = new PasswordValidator();


passwordSchema
    .is().min(8)
    .is().max(100)
    .has().lowercase()
    .has().not().spaces();

const employeeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    username: {
        type: String, required: true, trim: true
    },
    name: {
        type: String, required: true, trim: true
    },
    family: {
        type: String, required: true, trim: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return passwordSchema.validate(value);
            },
            message: props => 'Password validation failed: ' + passwordSchema.validate(props.value, {list: true}).join(', ')
        },
    },
});

employeeSchema.pre('save', async function (next) {
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

employeeSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);
