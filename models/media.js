const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const stringSchema = new Schema({
    path: {
        type: String,
        default: null,
    }

}, {
    timestamps: true
});


module.exports = mongoose.model('Media', stringSchema);
