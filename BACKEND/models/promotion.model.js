const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    promotionName: {
        type: String,
        required: true,
        trim: true,
    },
    promotionValues:{
        type: Number,
        required: true,
        trim: true,
    },
    promotionDescription:{
        type: String,
        required: true,
        trim: true,
    },
    promotionItempic:{
        type: String,
        // required: true,
        
    },
})

const promotionModel = mongoose.model('promotions',promotionSchema);
module.exports = promotionModel;