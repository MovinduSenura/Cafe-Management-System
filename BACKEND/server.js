const express = require("express");
const multer = require('multer');
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config();
const app = express();

//MongoDB Connection
const { ConnectDB } = require("./utils/connection");

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//Multer disk Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../frontend/src/uploads/') // Destination directory for uploaded files
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() //creating unique file name in here with adding date and time now
      cb(null, uniqueSuffix + file.originalname)  // Filename in the destination directory
    }
})
  
const upload = multer({ storage: storage })

//routes
const menuAllRoutes = require('./routes/menuItems.routes');
const promotionRouter = require("./routes/promotion.routes");
const OrderRouter = require('./routes/Order.routes');
const paymentRouter = require('./routes/payment.routes');
const CustomerRouter = require('./routes/customer.routes');

//API Middleware
app.use('/menu/', menuAllRoutes(upload));
app.use("/order/", OrderRouter);
app.use('/customer/', CustomerRouter);
app.use('/promotion/',promotionRouter);
app.use('/payment/',paymentRouter);


const PORT = process.env.PORT || 8070;

app.listen(PORT, () => {
    console.log(`🚀 :: Server is up and running on PORT: ${PORT}`);
    ConnectDB();
})