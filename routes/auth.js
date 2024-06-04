// routes/auth.js
const express = require('express');
const { register, login, getAllUsers } = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', auth, getAllUsers);

module.exports = router;
