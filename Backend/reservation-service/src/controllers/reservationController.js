const service = require('../services/reservationService');

class ReservationController {
  async create(req, res) {
    try {
      const r = await service.create(req.body);
      res.status(201).json({ success: true, data: r });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }
  async list(req, res) {
    try {
      const r = await service.list({
        date: req.query.date,
        customerID: req.query.customerID,
        status: req.query.status,
        limit: parseInt(req.query.limit) || 100
      });
      res.json({ success: true, data: r, count: r.length });
    } catch (e) {
      res.status(500).json({ success: false, message: 'Failed to fetch reservations' });
    }
  }
  async get(req, res) {
    try {
      const r = await service.get(req.params.id);
      res.json({ success: true, data: r });
    } catch (e) {
      res.status(404).json({ success: false, message: e.message });
    }
  }
  async update(req, res) {
    try {
      const r = await service.update(req.params.id, req.body);
      res.json({ success: true, data: r });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }
  async cancel(req, res) {
    try {
      const r = await service.cancel(req.params.id);
      res.json({ success: true, data: r });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }
  async availability(req, res) {
    try {
      const result = await service.availability({ date: req.query.date, partySize: parseInt(req.query.partySize) || 1 });
      res.json({ success: true, data: result });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }
  async health(req, res) { res.json({ status: 'healthy', service: 'reservation-service', time: new Date().toISOString() }); }
}

module.exports = new ReservationController();
