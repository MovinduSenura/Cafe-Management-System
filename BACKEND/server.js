const express = require ("express");
const mongoose = require ("mongoose");
const bodyParser = require ("body-parser");
const cors = require ("cors");
const dotenv = require ("dotenv");

const app = express();
require("dotenv").config();

//MOngoDB connection file
const {ConnectDB} = require("./utils/connection");


app.use(cors());
app.use(bodyParser.json());

//routes
const CustomerRouter = require('./routes/customer.routes');
//api middleware
app.use('/customer/', CustomerRouter);

const PORT = process.env.PORT || 8070;

app.listen(PORT, () => {
    console.log(`Server is up and running on port number : ${PORT}`)
    ConnectDB()
})




