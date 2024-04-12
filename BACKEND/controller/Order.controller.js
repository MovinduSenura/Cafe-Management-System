const OrderModel = require("../models/Order.model");

//add order for router controller
const addOrder = async (req, res) => {
  try {
    const { OrderName, OrderQuantity, OrderPrice } = req.body;

    const newOrderData = {
      //create a object
      OrderName: OrderName,
      OrderQuantity: OrderQuantity,
      OrderPrice: OrderPrice,
    };

    const newOrderObj = new OrderModel(newOrderData);
    await newOrderObj.save();
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }

  try {
    return res.status(200).send({
      status: true,
      message: "✨ :: Order created successfully!",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

//get all orders router control
const getAllOrders = async (req, res) => {
  try {
    const allOrders = await OrderModel.find();

    return res.status(200).send({
      status: true,
      message: "✨ :: All orders are fetched!",
      AllOrders: allOrders,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// get one specific order router control
const getOneOrder = async (req, res) => {
  try {
    const orderID = req.params.id;
    const Order = await OrderModel.findById(orderID);

    return res.status(200).send({
      status: true,
      message: "✨ :: Order fetched!",
      order: Order,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

//update order details router control

const updateOrder = async (req, res) => {
  try {
    const orderID = req.params.id;
    const { OrderName, OrderQuantity, OrderPrice } = req.body;

    const orderData = {
      OrderName: OrderName,
      OrderQuantity: OrderQuantity,
      OrderPrice: OrderPrice,
    };

    const updateOrderObj = await OrderModel.findByIdAndUpdate(
      orderID,
      orderData
    );

    return res.status(200).send({
      status: true,
      message: "✨ :: Order updated!",
      // updateOrder: updateOrderObj,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

//delete order details route control
const deleteOrder = async (req, res) => {
  try {
    const orderID = req.params.id;
    const delOrder = await OrderModel.findByIdAndDelete(orderID);

    return res.status(200).send({
      status: true,
      message: "✨ :: Orders deleted!",
      deleteOrder: delOrder,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

module.exports = {
  addOrder,
  getAllOrders,
  getOneOrder,
  updateOrder,
  deleteOrder,
};
