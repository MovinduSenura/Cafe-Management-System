const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['kpi', 'sales', 'inventory', 'custom'], default: 'kpi' },
  params: { type: Object },
  generatedAt: { type: Date, default: Date.now },
  data: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
