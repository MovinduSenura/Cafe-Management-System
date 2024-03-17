const express = require("express");
const OrderRouter = express.Router();

const {
  addOrder,
  getAllOrders,
  getOneOrder,
  updateOrder,
  deleteOrder,
} = require("../controller/Order.controller");

OrderRouter.post("/order/create", addOrder);
OrderRouter.get("/order/orders", getAllOrders);
OrderRouter.get("/order/:id" , getOneOrder);
OrderRouter.patch("/order/:id", updateOrder);
OrderRouter.delete("/order/:id", deleteOrder);

module.exports = OrderRouter;
