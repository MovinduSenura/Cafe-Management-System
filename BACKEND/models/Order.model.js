const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  OrderName: {
    type: String,
    required: true,
    trim: true,
  },

  OrderQuantity: {
    type: Number,
    required: true,
    trim: true,
  },

  OrderPrice: {
    type: Number,
    required: true,
    trim: true,
  },
});

const OrderModel = mongoose.model("orders", OrderSchema);
module.exports = OrderModel;
