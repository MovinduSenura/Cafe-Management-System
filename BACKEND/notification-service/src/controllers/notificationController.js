const service = require('../services/notificationService');

class NotificationController {
  async send(req, res) {
    try {
      const n = await service.send(req.body);
      res.status(201).json({ success: true, data: n });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }
  async history(req, res) {
    try {
      const list = await service.history({
        userID: req.query.userID,
        channel: req.query.channel,
        status: req.query.status,
        limit: parseInt(req.query.limit) || 100
      });
      res.json({ success: true, data: list, count: list.length });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Failed to fetch history' });
    }
  }
  async get(req, res) {
    try {
      const n = await service.get(req.params.id);
      res.json({ success: true, data: n });
    } catch (e) {
      res.status(404).json({ success: false, message: e.message });
    }
  }
  async health(req, res) { res.json({ status: 'healthy', service: 'notification-service', time: new Date().toISOString() }); }
}

module.exports = new NotificationController();
