// Import necessary modules and models
const OrderModel = require("../models/Order.model");
const MenuItemModel = require("../models/menuItem.model");
const pdfCreator = require('pdf-creator-node'); // Library for creating PDFs
const fs = require('fs'); // Node.js filesystem module for file operations
const path = require('path'); // Node.js path module for handling file paths
const moment = require("moment"); // Library for date and time manipulation

// Function to generate and serve the PDF invoice
const OrdergenerateInvoice = async (req, res) => {
  try {
    // Read HTML template for the invoice
    const htmlTemplate = fs.readFileSync(path.join(__dirname, '../template/invoice-template.html'), 'utf-8');
    // Get current timestamp for unique filename
    const timestamp = moment().format('YYYY_MMMM_DD_HH_mm_ss');
    // Construct filename for the PDF
    const filename = 'Item_Management_' + timestamp + '_doc' + '.pdf';

    // Fetch all orders and populate the 'menuItems' field
    const orders = await OrderModel.find({}).populate('menuItems');

    // Map orders data to fit into the PDF template
    const OrderArray = orders.map(order => ({
      orderID: order._id,
      menuItemName: order.menuItems.map(item => item.menuItemName).join(', '), // Concatenate menuItemNames
      menuItemPrice: order.OrderPrice
    }));

    // Read the logo file and convert it to base64
    const logoPath = path.join(__dirname, '../template/images/logo.png');
    const logoBuffer = await fs.promises.readFile(logoPath);
    const logoBase64 = logoBuffer.toString('base64');

    // PDF creation options
    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: '10mm',
      header: {
        height: '0mm',
      },
      footer: {
        height: '0mm',
      },
      zoomFactor: '1.0',
      type: 'buffer',
    };

    // Data for PDF creation
    const document = {
      html: htmlTemplate, // HTML template for the PDF
      data: {
        OrderArray, // Orders data
        logoBuffer: logoBase64, // Logo image as base64
      },
      path: './docs/' + filename, // Path to save the PDF file
    };

    // Create the PDF
    const pdfBuffer = await pdfCreator.create(document, options);

    // Filepath for the PDF
    const filepath = 'http://localhost:8000/docs/' + filename;

    // Send the filepath as response
    res.status(200).json({ filepath });
  } catch (error) {
    // Handle any errors that occur during PDF generation
    console.error('Error generating PDF invoice:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Function to add an order
const addOrder = async (req, res) => {
  try {
    // Extract MenuitemIds from request body
    const { MenuitemIds } = req.body;

    let totalPrice = 0;

    // Find menu items based on MenuitemIds
    const menuItems = await MenuItemModel.find({_id:{$in: MenuitemIds}});

    // If no menu items found, return error
    if(!menuItems) {
      return res.status(404).json({
        success:false,
        error: 'Menu items not found'
      })
    }

    // Calculate total price of the order
    menuItems.forEach(Item => {
      totalPrice += Item.menuItemPrice;
    });

    // Create a new order
    const Order = new OrderModel({
      menuItems:menuItems,
      OrderPrice : totalPrice,
    });

    // Save the order to the database
    await Order.save();

    // Send success response with the order
    res.status(200).json({
      success : true,
      Order
    });
  } catch (err) {
    // Handle any errors that occur during order addition
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

// Function to get all orders
const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders and populate 'menuItems' field
    const allOrders = await OrderModel.find().populate('menuItems');

    // Send success response with all orders
    return res.status(200).send({
      status: true,
      message: "✨ :: All orders are fetched!",
      AllOrders: allOrders,
    });
  } catch (error) {
    // Handle any errors that occur during fetching orders
    return res.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

// Function to get one specific order
const getOneOrder = async (req, res) => {
  try {
    // Extract orderID from request parameters
    const orderID = req.params.id;

    // Find order by ID and populate 'menuItems' field
    const Order = await OrderModel.findById(orderID).populate('menuItems');

    // Send success response with the order
    return res.status(200).send({
      status: true,
      message: "✨ :: Order fetched!",
      order: Order,
    });
  } catch (err) {
    // Handle any errors that occur during fetching order
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

// Function to search for an order
const searchOrder = async (req, res) => {
  try {
    // Extract OrderPrice from request body
    const OrderPrice = req.body;
    // Using a regular expression to match partial order prices
    const Price = await OrderModel.find({ OrderPrice: { $regex: OrderPrice} });

    // Send success response with search results
    return res.status(200).send({
      status: true,
      message: "✨ :: Orders searched and fetched!",
      searchPayment: Price
    });
  } catch(err) {
    // Handle any errors that occur during searching orders
    return res.status(500).send({
      status: false,
      message: err.message
    });
  }
};

// Function to update an order
const updateOrder = async (req, res) => {
  try {
    // Extract orderID, menuItems, and OrderPrice from request body
    const orderID = req.params.id;
    const { menuItems, OrderPrice } = req.body;

    // Update the order
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderID,
      { menuItems: menuItems, OrderPrice: OrderPrice },
      { new: true }
    );

    // If no order found, return error
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Send success response with updated order
    return res.status(200).send({
      status: true,
      message: "✨ :: Order updated!",
      updatedOrder: updatedOrder
    });
  } catch (err) {
    // Handle any errors that occur during order update
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

// Function to delete an order
const deleteOrder = async (req, res) => {
  try {
    // Extract orderID from request parameters
    const orderID = req.params.id;

    // Delete the order
    const delOrder = await OrderModel.findByIdAndDelete(orderID);

    // Send success response with deleted order
    return res.status(200).send({
      status: true,
      message: "✨ :: Order deleted!",
      deleteOrder: delOrder,
    });
  } catch (err) {
    // Handle any errors that occur during order deletion
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

// Export all functions
module.exports = {
  addOrder,
  getAllOrders,
  getOneOrder,
  updateOrder,
  deleteOrder,
  searchOrder,
  OrdergenerateInvoice,
};
