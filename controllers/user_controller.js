const User = require('../models/user');

const AppError = require("../models/app_error");

const getUsers = async (req, res, next) => {
    try {


        const users = await User.find();

        return res.success('success', users);
    } catch (e) {

        next(e);

    }
}

const getEmployees = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10);

        const perPage = parseInt(req.query.perPage, 10);

        const paginate = req.query.paginate === 'true';

        if (isNaN(page) || isNaN(perPage)) {
            return next(new AppError('Invalid query parameters', 403));
        }

        const user = req.user;

        if (paginate) {
            const response = await User.getPaginatedEmployees(user._id, page, perPage);
            return res.success('success', response);
        }

        const employees = await User.find().employeesOf(user._id).format().exec();

        return res.success('success', employees);

    } catch (e) {
        next(e);
    }
}

const createEmployee = async (req, res, next) => {
    try {

        const {email, name, phone, password} = req.body;

        let user = await User.findOne({
            $or: [
                {email: email},
                {phone: phone}
            ]
        });

        if (user) {
            return next(new AppError('An user with this email or phone number already exists.', 401));
        }

        user = new User({
            email: email,
            name: name,
            phone: phone,
            role: 'employee',
            managerId: req.user._id,
            password: password
        });

        await user.save();

        res.status(200).json({'message': 'Employee created successfully.'});

    } catch (err) {
        next(err);
    }
}

const updateEmployee = async (req, res, next) => {
    try {
        const {email, name, phone} = req.body;

        const user = req.user;

        const emailExists = User.findOne({email: email, _id: {$ne: user._id}});

        const phoneExists = User.findOne({phone: phone, _id: {$ne: user._id}});

        if (emailExists) {
            return next(new AppError('Email already exists', 403));
        }

        if (phoneExists) {
            return next(new AppError('Phone already exists', 403));
        }

        user.email = email;
        user.phone = phone;
        user.name = name;

        await user.save();

        res.success('success', user);
    } catch (err) {
        next(err);
    }
}

const removeEmployee = async (req, res, next) => {
}

const deleteEmployee = async (req, res, next) => {
}


module.exports = {getUsers, createEmployee, getEmployees};