const mongoose = require('mongoose');
const db_url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/movies';

function connect_db() {
    mongoose.connect(db_url).then(() => {
        console.log('database connected');
    });
}

module.exports.connect_db = connect_db;