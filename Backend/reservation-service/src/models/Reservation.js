const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  reservationID: { type: String, unique: true, trim: true },
  customerID: { type: String, required: true, trim: true },
  customerName: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  email: { type: String, trim: true },
  date: { type: Date, required: true },
  partySize: { type: Number, required: true, min: 1 },
  tableNumber: { type: String, trim: true },
  status: { type: String, enum: ['pending', 'confirmed', 'seated', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String, trim: true },
  specialRequests: { type: String, trim: true }
}, { timestamps: true });

reservationSchema.index({ date: 1 });
reservationSchema.index({ customerID: 1 });

reservationSchema.pre('save', function(next) {
  if (!this.reservationID) {
    this.reservationID = 'RES' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
