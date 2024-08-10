const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

router.get('/', userController.getUsers)

router.post('/create_employee', userController.createEmployee)

module.exports = router;