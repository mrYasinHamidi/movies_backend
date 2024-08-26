const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

router.get('/', userController.getUsers)

router.get('/:id');

router.put('/:id');

router.post('/employees', userController.createEmployee)

router.get('/employees', userController.getEmployees)

router.put('/employees/:id', userController.updateEmployee)

router.delete('/employees/:id', userController.deleteEmployee)

module.exports = router;