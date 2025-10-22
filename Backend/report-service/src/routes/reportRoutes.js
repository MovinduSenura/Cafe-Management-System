const express = require('express');
const ctrl = require('../controllers/reportController');
const router = express.Router();

router.get('/health', ctrl.health);

router.get('/reports/kpis', ctrl.kpis);
router.get('/reports/kpis.csv', ctrl.kpisCsv);
router.post('/reports', ctrl.save);
router.get('/reports', ctrl.list);
router.get('/reports/:id', ctrl.get);

module.exports = router;
