const mongoose = require('mongoose');

const profitSchema = new mongoose.Schema({

    income:{
        type: Number,
        required: true,
        trim: true,
    },
    salary:{
        type: Number,
        required: true,
        trim: true,
    },
    other:{
        type:Number,
        required: true,
        trim:true,
    },
    
    profit:{
        type:Number,
        required: true,
        trim:true,
    },
},{timestamps:true})

const profitModel = mongoose.model('profits',profitSchema);
module.exports = profitModel;