const Notification = require('../models/Notification');
const logger = require('../utils/logger');

class NotificationService {
  async send({ channel, to, subject, message, metadata }) {
    const notif = new Notification({ channel, to, subject, message, metadata, status: 'queued' });
    await notif.save();
    try {
      // Simulate sending
      await new Promise(r => setTimeout(r, 300));
      notif.status = 'sent';
      await notif.save();
    } catch (e) {
      notif.status = 'failed';
      notif.error = e.message;
      await notif.save();
      logger.error('Notification send failed', e);
      throw e;
    }
    return notif;
  }

  async history({ userID, channel, status, limit = 100 }) {
    const q = {};
    if (userID) q.userID = userID;
    if (channel) q.channel = channel;
    if (status) q.status = status;
    return Notification.find(q).sort({ createdAt: -1 }).limit(limit);
  }

  async get(idOrCode) {
    const n = await Notification.findOne({ $or: [{ _id: idOrCode }, { notificationID: idOrCode }] });
    if (!n) throw new Error('Notification not found');
    return n;
  }
}

module.exports = new NotificationService();
