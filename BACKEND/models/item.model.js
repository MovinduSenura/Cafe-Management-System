const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        trim: true, 
    },
    currentstocklevel: {
        type: Number,
        required: true,
        trim: true,
    },
    minstocklevel: {
        type: Number,
        required: true,
        trim: true,
    },
})

const itemModel = mongoose.model('items', itemSchema);
module.exports = itemModel;