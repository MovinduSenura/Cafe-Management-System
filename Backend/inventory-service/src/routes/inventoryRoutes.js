const express = require('express');
const ctrl = require('../controllers/inventoryController');
const router = express.Router();

router.get('/health', ctrl.health);

router.post('/items', ctrl.create);
router.get('/items', ctrl.list);
router.get('/items/low-stock', ctrl.lowStock);
router.get('/items/:id', ctrl.get);
router.patch('/items/:id', ctrl.update);
router.delete('/items/:id', ctrl.remove);
router.post('/items/:id/adjust', ctrl.adjust);

module.exports = router;
