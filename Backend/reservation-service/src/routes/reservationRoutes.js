const express = require('express');
const ctrl = require('../controllers/reservationController');
const router = express.Router();

router.get('/health', ctrl.health);

router.post('/reservations', ctrl.create);
router.get('/reservations', ctrl.list);
router.get('/reservations/availability', ctrl.availability);
router.get('/reservations/:id', ctrl.get);
router.patch('/reservations/:id', ctrl.update);
router.patch('/reservations/:id/cancel', ctrl.cancel);

module.exports = router;
