const mongoose = require('mongoose');
const db_url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/movies';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    username: String,
    password: String,
});

const UserModel = mongoose.model('UserModel', userSchema);

function connect_db() {
    mongoose.connect(db_url).then(() => {
        console.log('database connected');
    });
}

module.exports.connect_db = connect_db;