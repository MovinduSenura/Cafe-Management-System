const express = require("express");
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

//routes
const menuItemRouter = require('./routes/menuItems.routes');
//API Middleware
app.use('/menu/', menuItemRouter);

const PORT = process.env.PORT || 8070;

app.listen(PORT, () => {
    console.log(`🚀 :: Server is up and running on PORT: ${PORT}`);
    ConnectDB();
})