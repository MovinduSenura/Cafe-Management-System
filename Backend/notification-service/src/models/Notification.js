const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationID: { type: String, unique: true, trim: true },
  userID: { type: String, trim: true },
  channel: { type: String, enum: ['email', 'sms', 'push'], required: true },
  to: { type: String, required: true },
  subject: { type: String, trim: true },
  message: { type: String, required: true },
  metadata: { type: Object },
  status: { type: String, enum: ['queued', 'sent', 'failed'], default: 'queued' },
  error: { type: String, trim: true }
}, { timestamps: true });

notificationSchema.pre('save', function(next) {
  if (!this.notificationID) {
    this.notificationID = 'NTF' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
