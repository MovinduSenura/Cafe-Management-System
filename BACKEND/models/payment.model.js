const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderID:{
        type: String,
        required: true,
        trim: true,
    },
    promotionID:{
        type: String,
        trim: true,
    },
    amount:{
        type:Number,
        required: true,
        trim:true,
    },
    
},{timestamps:true})

const paymentModel = mongoose.model('payments',paymentSchema);
module.exports = paymentModel;