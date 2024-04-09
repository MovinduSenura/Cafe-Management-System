const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    menuItemImage: {
        type: String,
        // required: true,
    },
    menuItemName: {
        type: String,
        required: true,
        trim: true,
    },
    menuItemDescription: {
        type: String,
        required: true,
        trim: true,
    },
    menuItemCategory: {
        type: String,
        required: true,
        trim: true,
    },
    menuItemPrice: {
        type: Number,
        required: true,
        trim: true,
    },
    menuItemAvailability: {
        type: String,
        required: true,
        trim: true,
    },
})

const menuItemModel = mongoose.model('menuItems', menuItemSchema);
module.exports = menuItemModel;