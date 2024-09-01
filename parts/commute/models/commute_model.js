const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommuteSchema = new Schema({
        personnelId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        type: {
            type: String,
            enum: ['exit', 'enter'],
            required: true,
        },
        time: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
                },
                message: props => `${props.value} is not a valid time! Use the format HH:mm.`
            }
        },
    },
    {
        timestamps: true
    });
const paginationPlugin = require('../../../databse/plugins/pagination');

const filteringPlugin = require('../../../databse/plugins/filtering');

const sortingPlugin = require('../../../databse/plugins/sorting');

CommuteSchema.plugin(filteringPlugin);

CommuteSchema.plugin(paginationPlugin);

module.exports = mongoose.model('Commute', CommuteSchema);
