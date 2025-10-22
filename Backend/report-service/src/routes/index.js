const express = require('express');
const reportRoutes = require('./reportRoutes');
const router = express.Router();

router.use('/', reportRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'report-service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
