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
        const page = parseInt(req.query.page, 10) || 1;

        const perPage = parseInt(req.query.perPage, 10) || 10;

        const paginate = req.query.paginate === 'true';

        const {name, personnelCode} = req.query;

        if (isNaN(page) || isNaN(perPage) || page <= 0 || perPage <= 0) {
            return next(new AppError('Invalid query parameters', 403));
        }

        const userId = req.user._id;

        let employees;

        if (paginate) {
            employees = await User.getPaginatedEmployees(userId, page, perPage, name, personnelCode);
        } else {
            employees = await User.find()
                .employeesOf(userId, name, personnelCode)
                .format()
                .exec();
        }

        res.success('success', employees);
    } catch (e) {
        next(e);
    }
};

const createEmployee = async (req, res, next) => {
    try {
        const {
            username,
            name,
            password,
            passwordConfirm,
            nationalCode,
            personnelCode,
            workStartDate,
            workEndDate,
        } = req.body;

        const [
            usernameExists,
            nationalCodeExists,
            personnelCodeExists
        ] = await Promise.all([
            User.exists({username}),
            User.exists({nationalCode}),
            User.exists({personnelCode}),
        ]);

        const errors = [];
        if (usernameExists) errors.push('An user with this username already exists.');
        if (nationalCodeExists) errors.push('An user with this national code already exists.');
        if (personnelCodeExists) errors.push('An user with this personnel code already exists.');
        if (password !== passwordConfirm) errors.push('Password and Password confirmation do not match.');

        if (errors.length > 0) {
            return next(new AppError(errors.join(' '), 431));
        }

        const user = new User({
            username,
            name,
            nationalCode,
            personnelCode,
            role: 'employee',
            managerId: req.user._id,
            password,
            workStartDate,
            workEndDate
        });

        await user.save();

        res.success(user, 'Employee created successfully');
    } catch (err) {
        next(err);
    }
}

const updateEmployee = async (req, res, next) => {
    try {
        const {
            username,
            name,
            password,
            passwordConfirm,
            nationalCode,
            personnelCode,
            workStartDate,
            workEndDate,
        } = req.body;

        const employeeId = req.params.id;

        const employee = await User.findById(employeeId);

        if (!employee || employee.role !== 'employee') {
            return next(new AppError('Invalid employee id', 404));
        }

        const updatePromises = [];

        if (username && username !== employee.username) {
            updatePromises.push(
                User.exists({username, _id: {$ne: employeeId}})
                    .then(usernameExists => {
                        if (usernameExists) {
                            return next(new AppError('An user with this username already exists.', 403));
                        }
                        employee.username = username;
                    })
            );
        }

        if (nationalCode && nationalCode !== employee.nationalCode) {
            updatePromises.push(
                User.exists({nationalCode, _id: {$ne: employeeId}})
                    .then(nationalCodeExists => {
                        if (nationalCodeExists) {
                            return next(new AppError('An user with this national code already exists.', 403));
                        }
                        employee.nationalCode = nationalCode;
                    })
            );
        }

        if (personnelCode && personnelCode !== employee.personnelCode) {
            updatePromises.push(
                User.exists({personnelCode, _id: {$ne: employeeId}})
                    .then(personnelCodeExists => {
                        if (personnelCodeExists) {
                            return next(new AppError('An user with this personnel code already exists.', 403));
                        }
                        employee.personnelCode = personnelCode;
                    })
            );
        }

        if (password && passwordConfirm) {
            if (password !== passwordConfirm) {
                return next(new AppError('Password and Password confirmation do not match', 403));
            }
            employee.password = password;
        }

        if (workStartDate) employee.workStartDate = workStartDate;
        if (workEndDate) employee.workEndDate = workEndDate;
        if (name) employee.name = name;

        await Promise.all(updatePromises);

        await employee.save();

        res.success('success', employee);
    } catch (err) {
        next(err);
    }
}

const deleteEmployee = async (req, res, next) => {
    try {
        const employee = await User.findByIdAndDelete(req.params.id);

        if (!employee) {
            return next(new AppError('Employee not found', 404));
        }

        res.success({message: 'Employee deleted'});
    } catch (err) {
        next(err);
    }
};


module.exports = {getUsers, createEmployee, getEmployees, updateEmployee, deleteEmployee};