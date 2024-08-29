const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const filterPlugin = require('../../../databse/plugins/filtering');

const paginationPlugin = require('../../../databse/plugins/pagination');

const shiftSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: props => `${props.value} is not a valid time! Use the format HH:mm.`
        }
    },
    endTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: props => `${props.value} is not a valid time! Use the format HH:mm.`
        }
    },
    managerId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    floatTime: Number,
}, {timestamps: true});

shiftSchema.plugin(filterPlugin);

shiftSchema.plugin(paginationPlugin);

module.exports = mongoose.model('Shift', shiftSchema);