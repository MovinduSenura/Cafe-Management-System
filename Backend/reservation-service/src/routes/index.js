const express = require('express');
const reservationRoutes = require('./reservationRoutes');
const router = express.Router();

router.use('/', reservationRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'reservation-service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
