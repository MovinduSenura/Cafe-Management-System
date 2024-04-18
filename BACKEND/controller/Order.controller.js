const OrderModel = require("../models/Order.model");
const MenuItemModel = require("../models/menuItem.model");

//add order for router controller
const addOrder = async (req, res) => {
  try {
   const { MenuitemIds } = req.body;

   let totalPrice = 0;

   const menuItems = await MenuItemModel.find({_id:{$in: MenuitemIds}});

   if(!menuItems) {
    return res.status(404).json({
      success:false,
      error: 'Menu items not found'
    })
   }

   menuItems.forEach(Item => {
    totalPrice += Item.menuItemPrice;
   })

   const Order = new OrderModel({
      menuItems:menuItems,
      OrderPrice : totalPrice,
   })

   await Order.save();

   res.status(200).json({
    success : true,
    Order
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
    const allOrders = await OrderModel.find().populate('menuItems');

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
    const Order = await OrderModel.findById(orderID).populate('menuItems');

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

//get one order from the search function
//get - search particular payment
const searchOrder = async (req, res) => {

  try{

      const OrderPrice = req.body;
      // Using a regular expression to match partial game names
      const Price = await OrderModel.find({ OrderPrice: { $regex: OrderPrice} }); //the $regex operator in MongoDB is used to perform a regular expression search for partial matches of the game name. The i option is used to perform a case-insensitive search.

      return res.status(200).send({
          status: true,
          message: "✨ :: Project Searched and fetched!",
          searchPayment: Price
      })

  }catch(err){

      return res.status(500).send({
          status: false,
          message: err.message
      });

  }

}
//update order details router control

const updateOrder = async (req, res) => {
  try {
    const orderID = req.params.id;
    const { MenuitemIds } = req.body;
    
    const menuItems = await MenuItemModel.find({_id:{$in: MenuitemIds}});

    if(!menuItems) {
      return res.status(404).json({
        success:false,
        error: 'Menu items not found'
      })
     }

     menuItems.forEach(Item => {
      totalPrice += Item.menuItemPrice;
     })


   const Order = new OrderModel({
    menuItems:menuItems,
    totalPrice : totalPrice,
 })


    const updateOrderObj = await OrderModel.findByIdAndUpdate(
      orderID,
      Order,
    );

    return res.status(200).send({
      status: true,
      message: "✨ :: Order updated!",
      // updateOrder: Order,
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
  searchOrder,

};
