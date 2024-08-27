const WorkPlace = require('../models/work_place');

const createWorkPlace = async (req, res, next) => {
    try {
        const workPlace = new WorkPlace(req.body);

        const savedWorkPlace = await workPlace.save();

        res.success(savedWorkPlace);

    } catch (err) {
        next(err);
    }
}
const getWorkPlaces = async (req, res, next) => {
    try {
        const places = await WorkPlace.find();
        res.success(places);

    } catch (err) {
        next(err);
    }
}
const getWorkPlaceById = async (req, res) => {

}
const updateWorkPlace = async (req, res) => {
}
const deleteWorkPlace = async (req, res) => {
}
module.exports = {createWorkPlace, getWorkPlaceById, getWorkPlaces, updateWorkPlace, deleteWorkPlace}