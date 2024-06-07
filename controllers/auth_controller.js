const User = require('../models/user');

const register = async (req, res) => {
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({msg: "User already exists"});
        }
        user = new User({email, password});
        await user.save();
        res.send('register successful');

    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
}

const getUsers = async (req, res) => {

    try {
     const users = await User.find();
     return res.status(200).json(users);
    } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
}

function login(req, res) {
    res.send('login');
}

module.exports = {register, login,getUsers}