const express = require('express');
const router = express.Router();
const controller = require('../controllers/commute_controller');
router
    .post('/', controller.createCommutes)
    .get('/:id', controller.getCommuteById)
    .get('/', controller.createCommutes);