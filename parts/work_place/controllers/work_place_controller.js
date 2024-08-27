const WorkPlace = require('../models/work_place');

const createWorkPlace = async (req, res, next) => {
    try {
        const workPlace = new WorkPlace({managerId: req.user.id, ...req.body});

        const savedWorkPlace = await workPlace.save();

        res.success(savedWorkPlace);

    } catch (err) {
        next(err);
    }
}

const getWorkPlaces = async (req, res, next) => {
    try {
        const name = req.query.name;

        const city = req.query.city;

        const paginate = req.query.paginate;

        const filter = WorkPlace.filter({managerId: req.user.id, name, city});

        if (paginate && paginate === 'true') {
            const places = await WorkPlace.paginate(filter, req.query.page, req.query.limit);
            return res.success(places);
        } else {
            const places = await WorkPlace.find(filter);
            return res.success(places);
        }

    } catch (err) {
        next(err);
    }
}

const getWorkPlaceById = async (req, res, next) => {
    try {
        const place = await WorkPlace.findById(req.params.id);
        res.success(place);
    } catch (err) {
        next(err);
    }
}

const updateWorkPlace = async (req, res, next) => {
    try {
        const updatedPlace = WorkPlace.findByIdAndUpdate(req.params.id, req.body, {runValidators: true});
        res.success(updatedPlace);
    } catch (err) {
        next(err);
    }
}

const deleteWorkPlace = async (req, res, next) => {
    try {
        const deletedPlace = WorkPlace.findByIdAndDelete(req.params.id);
        res.success(deletedPlace);
    } catch (err) {
        next(err);
    }
}

module.exports = {createWorkPlace, getWorkPlaceById, getWorkPlaces, updateWorkPlace, deleteWorkPlace}