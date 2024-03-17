const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config();
const app = express();

//MONGODB connection
const{ ConnectDB } = require("./utils/connection");


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const FeedbackRouter = require('./routes/feedback.routes');
app.use('/api/',FeedbackRouter);
const PORT = process.env.PORT || 8070;

app.listen(PORT, () =>{
    console.log(`🚀:: Server is up and running on PORT:${PORT}`);
    ConnectDB();
})
