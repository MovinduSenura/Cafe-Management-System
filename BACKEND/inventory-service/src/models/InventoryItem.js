const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  type: { type: String, enum: ['in', 'out', 'adjustment'], required: true },
  quantity: { type: Number, required: true, min: 0 },
  reason: { type: String, trim: true },
  referenceId: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const inventoryItemSchema = new mongoose.Schema({
  sku: { type: String, unique: true, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, trim: true },
  unit: { type: String, enum: ['pcs', 'kg', 'g', 'l', 'ml', 'pack'], default: 'pcs' },
  costPrice: { type: Number, default: 0, min: 0 },
  sellingPrice: { type: Number, default: 0, min: 0 },
  quantity: { type: Number, default: 0, min: 0 },
  reorderLevel: { type: Number, default: 0, min: 0 },
  supplier: { type: String, trim: true },
  expiryDate: { type: Date },
  isPerishable: { type: Boolean, default: false },
  locations: [{ name: String, quantity: { type: Number, default: 0, min: 0 } }],
  movements: [stockMovementSchema],
  tags: [{ type: String }],
  notes: { type: String, trim: true }
}, { timestamps: true });

inventoryItemSchema.index({ sku: 1 });
inventoryItemSchema.index({ name: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
