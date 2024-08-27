const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WorkPlaceSchema = new Schema({
        name: {
            type: String,
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

module.exports = mongoose.model('WorkPlace', WorkPlaceSchema);