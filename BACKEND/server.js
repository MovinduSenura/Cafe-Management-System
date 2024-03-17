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
const promotionRouter = require("./routes/promotion.routes");
//API middleware
app.use('/api/',promotionRouter);

const PORT = process.env.port || 8070;

app.listen(PORT, () =>{
    console.log(`🚀::Server id up and running on PORT : ${PORT}`);
    ConnectDB();
})



