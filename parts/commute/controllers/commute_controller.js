const Commute = require('../models/commute_model');

const AppError = require("../../../models/app_error");

const createCommutes = async (req, res, next) => {
    try {
        const personnelId = req.user._id;
        const lastCommute = Commute.findOne({personnelId: personnelId}).sorting('-createdAt').exec();
        if (lastCommute && lastCommute.type === req.body.type) {
            return new AppError('Repeated commute');
        }
        const commute = Commute({personnelId: personnelId, ...req.body});
        await commute.save();
        res.success(commute);
    } catch (err) {
        next(err);
    }
}

const getCommutes = async (req, res, next) => {
    try {
        const personnelId = req.user._id;
        const filter = {personnelId: personnelId};
        if (req.params.paginate === 'true') {
            const commutes = await Commute.paginate(filter, req.query.page, req.query.limit);
            return res.success(commutes);
        } else {
            const commutes = await Commute.find(filter);
            return res.success(commutes);
        }
    } catch (err) {
        next(err);
    }
}

const getCommuteById = async (req, res, next) => {
    try {
        const commuteId = req.params.id;
        const commute = await Commute.findById(commuteId);
        res.success(commute);
    } catch (err) {
        next(err);
    }
}

module.exports = {createCommutes, getCommuteById, getCommutes}