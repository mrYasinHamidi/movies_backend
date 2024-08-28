const express = require('express');

const router = express.Router();

const controller = require('../controller/shift_controller');

router
    .get('/', controller.getShifts)
    .get('/:id', controller.getShiftById)
    .post('/', controller.createShift)
    .put('/:id', controller.updateShift)
    .delete('/:id', controller.deleteShift);

module.exports = router;