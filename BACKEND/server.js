const express = require("express");
const bodyPraser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config();
const app = express();

//MongoDB Connection
const{ ConnectDB } = require("./utils/connection")

app.use(express.json());
app.use(bodyPraser.json());
app.use(cors());

//routes
const paymentRouter = require('./routes/payment.routes');
app.use('/payment/',paymentRouter);

const PORT = process.env.PORT || 8070;

app.listen(PORT,()=>{
    console.log(`🚀Server is up and running on PORT:${PORT}`);
    ConnectDB();
})
