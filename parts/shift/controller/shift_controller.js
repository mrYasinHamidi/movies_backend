const Shift = require('../models/shift');

const createShift = async (req, res, next) => {
    try {
        const shift = new Shift({managerId: req.user.id, ...req.body});

        const savedShift = await shift.save();

        res.success(savedShift);

    } catch (err) {
        next(err);
    }
}

const getShifts = async (req, res, next) => {
    try {
        const name = req.query.name;

        const paginate = req.query.paginate;

        const filter = Shift.filter({managerId: req.user.id, name});

        if (paginate && paginate === 'true') {
            const shifts = await Shift.paginate(filter, req.query.page, req.query.limit);
            return res.success(shifts);
        } else {
            const shifts = await Shift.find(filter);
            return res.success(shifts);
        }

    } catch (err) {
        next(err);
    }
}

const getShiftById = async (req, res, next) => {
    try {
        const place = await Shift.findById(req.params.id);
        res.success(place);
    } catch (err) {
        next(err);
    }
}

const updateShift = async (req, res, next) => {
    try {
        const updatedShift = Shift.findByIdAndUpdate(req.params.id, req.body, {runValidators: true});
        res.success(updatedShift);
    } catch (err) {
        next(err);
    }
}

const deleteShift = async (req, res, next) => {
    try {
        const deletedShift = Shift.findByIdAndDelete(req.params.id);
        res.success(deletedShift);
    } catch (err) {
        next(err);
    }
}

module.exports = {createShift, getShifts, getShiftById, updateShift, deleteShift};