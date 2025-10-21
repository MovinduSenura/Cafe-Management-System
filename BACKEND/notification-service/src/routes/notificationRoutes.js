const express = require('express');
const ctrl = require('../controllers/notificationController');
const router = express.Router();

router.get('/health', ctrl.health);

router.post('/notifications/send', ctrl.send);
router.get('/notifications', ctrl.history);
router.get('/notifications/:id', ctrl.get);

module.exports = router;
