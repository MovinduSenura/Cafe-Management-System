const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  menuItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'menuItems'
  }],

  // OrderQuantity: {
  //   type: Number,
  //   required: true,
  //   trim: true,
  // },

  OrderPrice: {
    type: Number,
    required: true,
  },
});

const OrderModel = mongoose.model("orders", OrderSchema);
module.exports = OrderModel;
 