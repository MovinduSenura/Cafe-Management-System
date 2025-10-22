const express = require('express');
const paymentRoutes = require('./paymentRoutes');
const router = express.Router();

router.use('/', paymentRoutes);

module.exports = router;
