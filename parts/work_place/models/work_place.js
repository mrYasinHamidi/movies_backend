const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paginatePlugin = require('../../../databse/plugins/pagination');
const filteringPlugin = require('../../../databse/plugins/filtering');

const WorkPlaceSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        managerId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        city: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        radius: {
            type: Number,
            required: true,
            default: 50
        },
    },
    {
        timestamp: true
    },
);
WorkPlaceSchema.plugin(paginatePlugin);
WorkPlaceSchema.plugin(filteringPlugin);

module.exports = mongoose.model('WorkPlace', WorkPlaceSchema);