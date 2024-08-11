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

const getEmployees = async (req, res, next) => {
    try {

        const user = req.user;

        const employees = await User
            .find({managerId: user._id})
            .select(
                {
                    password: 0,
                    employees: 0,
                    role: 0,
                    __v: 0
                });

        return res.success(employees);

    } catch (e) {
        next(e);
    }
}

module.exports = {getUsers, createEmployee, getEmployees};