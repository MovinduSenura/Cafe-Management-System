const express = require('express');
const notificationRoutes = require('./notificationRoutes');
const router = express.Router();

router.use('/', notificationRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'notification-service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
