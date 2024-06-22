const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');


router.post('/refresh_token',authController.refreshToken)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/uploadMedia', authController.uploadMedia);
router.get('/getMedia', authController.getMedia);

module.exports = router;