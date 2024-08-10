const User = require('../models/user');
const Employee = require('../models/Employee');
const AppError = require("../models/app_error");

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (e) {
        next(e);
    }
}
const createEmployee = async (req, res, next) => {
    try {

        const {username, name, family, password} = req.body;

        let employee = await Employee.findOne({username});

        if (employee) {
            return next(new AppError('An employee with this username already exists', 401));
        }

        employee = new Employee({
            userId: req.userId,
            username: username,
            name: name,
            family: family,
            password: password
        });

        await employee.save();

        res.status(200).json({'message':'Employee created successfully.'});

    } catch (err) {
        next(err);
    }
}

module.exports = {getUsers, createEmployee};