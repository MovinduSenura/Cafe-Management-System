const InventoryItem = require('../models/InventoryItem');
const logger = require('../utils/logger');

class InventoryService {
  async createItem(data) {
    try {
      const item = new InventoryItem(data);
      await item.save();
      return item;
    } catch (err) {
      logger.error('createItem error', err);
      throw err;
    }
  }

  async listItems(filters = {}) {
    const q = {};
    if (filters.category) q.category = filters.category;
    if (filters.sku) q.sku = filters.sku;
    if (filters.search) q.$text = { $search: filters.search };

    return InventoryItem.find(q).sort({ createdAt: -1 }).limit(filters.limit || 100);
  }

  async getItem(idOrSku) {
    const item = await InventoryItem.findOne({ $or: [{ _id: idOrSku }, { sku: idOrSku }] });
    if (!item) throw new Error('Item not found');
    return item;
  }

  async updateItem(idOrSku, data) {
    const item = await InventoryItem.findOneAndUpdate(
      { $or: [{ _id: idOrSku }, { sku: idOrSku }] },
      data,
      { new: true, runValidators: true }
    );
    if (!item) throw new Error('Item not found');
    return item;
  }

  async deleteItem(idOrSku) {
    const item = await InventoryItem.findOneAndDelete({ $or: [{ _id: idOrSku }, { sku: idOrSku }] });
    if (!item) throw new Error('Item not found');
    return item;
  }

  async adjustStock(idOrSku, { type, quantity, reason, referenceId }) {
    const item = await this.getItem(idOrSku);
    let delta = 0;
    if (type === 'in') delta = quantity;
    else if (type === 'out') delta = -quantity;
    else if (type === 'adjustment') delta = quantity; // positive or negative
    else throw new Error('Invalid movement type');

    const newQty = (item.quantity || 0) + delta;
    if (newQty < 0) throw new Error('Insufficient stock');

    item.quantity = newQty;
    item.movements.push({ type, quantity: Math.abs(quantity), reason, referenceId });
    await item.save();
    return item;
  }

  async lowStock({ threshold = 5 }) {
    return InventoryItem.find({ $expr: { $lte: ['$quantity', { $ifNull: ['$reorderLevel', threshold] }] } })
      .sort({ quantity: 1 })
      .limit(100);
  }
}

module.exports = new InventoryService();
