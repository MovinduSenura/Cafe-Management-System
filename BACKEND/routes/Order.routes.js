const express = require("express");
const OrderRouter = express.Router();

const {
  addOrder,
  getAllOrders,
  getOneOrder,
  updateOrder,
  deleteOrder,
  
} = require("../controller/Order.controller");

OrderRouter.post("/create", addOrder);
OrderRouter.get("/allOrders", getAllOrders);
OrderRouter.get("/oneOrder/:id" , getOneOrder);
OrderRouter.patch("/Update/:id", updateOrder);
OrderRouter.delete("/delete/:id", deleteOrder);

module.exports = OrderRouter;
