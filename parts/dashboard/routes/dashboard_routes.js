const express = require('express');

const router = express.Router();

const controller = require('../controllers/dashboard_controller');

router.get('/manager', controller.getManagerDashboard);

router.get('/personnel', controller.getPersonnelDashboard);

module.exports = router;