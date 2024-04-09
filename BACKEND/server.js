const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config();
const { connectDB } = require("./utils/connection");
const app = express();


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//routes
const OrderRouter = require('./routes/Order.routes');

//api middleware 
app.use("/order/", OrderRouter);

const PORT = process.env.PORT || 8070;
app.listen(PORT, () =>{
    console.log(`🚀 :: Server is up and running on port : ${PORT}`);
    connectDB();
})