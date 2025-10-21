const service = require('../services/inventoryService');

class InventoryController {
  async create(req, res) {
    try {
      const item = await service.createItem(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async list(req, res) {
    try {
      const items = await service.listItems({
        category: req.query.category,
        sku: req.query.sku,
        search: req.query.search,
        limit: parseInt(req.query.limit) || 100
      });
      res.json({ success: true, data: items, count: items.length });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Failed to fetch items' });
    }
  }

  async get(req, res) {
    try {
      const item = await service.getItem(req.params.id);
      res.json({ success: true, data: item });
    } catch (e) {
      res.status(404).json({ success: false, message: e.message });
    }
  }

  async update(req, res) {
    try {
      const item = await service.updateItem(req.params.id, req.body);
      res.json({ success: true, data: item });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async remove(req, res) {
    try {
      const item = await service.deleteItem(req.params.id);
      res.json({ success: true, data: item });
    } catch (e) {
      res.status(404).json({ success: false, message: e.message });
    }
  }

  async adjust(req, res) {
    try {
      const item = await service.adjustStock(req.params.id, req.body);
      res.json({ success: true, data: item });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async lowStock(req, res) {
    try {
      const threshold = parseInt(req.query.threshold) || 5;
      const items = await service.lowStock({ threshold });
      res.json({ success: true, data: items, count: items.length });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Failed to fetch low stock' });
    }
  }

  async health(req, res) {
    res.json({ status: 'healthy', service: 'inventory-service', time: new Date().toISOString() });
  }
}

module.exports = new InventoryController();
