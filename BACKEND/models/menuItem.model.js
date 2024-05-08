const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    menuItemImage: {
        type: String,
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
        type: Boolean,
        default: false,
    },
})

const menuItemModel = mongoose.model('menuItems', menuItemSchema);
module.exports = menuItemModel;