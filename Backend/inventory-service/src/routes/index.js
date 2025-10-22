const express = require('express');
const inventoryRoutes = require('./inventoryRoutes');
const router = express.Router();

// Mount feature routes
router.use('/', inventoryRoutes);

// Health under API prefix as well
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'inventory-service',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
