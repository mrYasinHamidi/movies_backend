const express = require('express');

const router = express.Router();

const controller = require('../controllers/work_place_controller');

router
    .get('/', controller.getWorkPlaces)
    .get('/:id', controller.getWorkPlaceById)
    .post('/', controller.createWorkPlace)
    .put('/:id', controller.updateWorkPlace)
    .delete('/:id', controller.deleteWorkPlace);

module.exports = router;