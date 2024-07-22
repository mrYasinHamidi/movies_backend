const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

router.get('/refresh_token',authController.refreshToken)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send_email', authController.sendEmail);

module.exports = router;