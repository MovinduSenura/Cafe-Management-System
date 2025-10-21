const Reservation = require('../models/Reservation');
const logger = require('../utils/logger');

class ReservationService {
  async create(data) {
    try {
      const reservation = new Reservation(data);
      await reservation.save();
      return reservation;
    } catch (e) {
      logger.error('Reservation create error', e);
      throw e;
    }
  }

  async list({ date, customerID, status, limit = 100 }) {
    const q = {};
    if (customerID) q.customerID = customerID;
    if (status) q.status = status;
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      q.date = { $gte: d, $lt: next };
    }
    return Reservation.find(q).sort({ date: 1 }).limit(limit);
  }

  async get(idOrCode) {
    const r = await Reservation.findOne({ $or: [{ _id: idOrCode }, { reservationID: idOrCode }] });
    if (!r) throw new Error('Reservation not found');
    return r;
  }

  async update(idOrCode, data) {
    const r = await Reservation.findOneAndUpdate(
      { $or: [{ _id: idOrCode }, { reservationID: idOrCode }] },
      data,
      { new: true, runValidators: true }
    );
    if (!r) throw new Error('Reservation not found');
    return r;
  }

  async cancel(idOrCode) {
    const r = await Reservation.findOneAndUpdate(
      { $or: [{ _id: idOrCode }, { reservationID: idOrCode }] },
      { status: 'cancelled' },
      { new: true }
    );
    if (!r) throw new Error('Reservation not found');
    return r;
  }

  async availability({ date, partySize }) {
    // Simple heuristic: max 20 tables, each table seats up to 4
    const capacity = 20 * 4;
    const d = new Date(date);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const sameDay = await Reservation.aggregate([
      { $match: { date: { $gte: d, $lt: next }, status: { $in: ['pending', 'confirmed'] } } },
      { $group: { _id: null, total: { $sum: '$partySize' } } }
    ]);
    const reserved = sameDay[0]?.total || 0;
    const available = Math.max(capacity - reserved, 0);
    return { capacity, reserved, available, canAccommodate: partySize <= available };
  }
}

module.exports = new ReservationService();
