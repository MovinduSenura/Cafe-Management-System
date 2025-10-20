const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
        minlength: [2, 'Item name must be at least 2 characters'],
        maxlength: [100, 'Item name cannot exceed 100 characters']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be a whole number'
        }
    },
    currentstocklevel: {
        type: Number,
        required: [true, 'Current stock level is required'],
        min: [0, 'Stock level cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: 'Stock level must be a whole number'
        }
    },
    minstocklevel: {
        type: Number,
        required: [true, 'Minimum stock level is required'],
        min: [0, 'Minimum stock level cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: 'Minimum stock level must be a whole number'
        }
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        enum: ['kg', 'g', 'l', 'ml', 'pieces', 'packets', 'bottles'],
        default: 'pieces'
    },
    supplier: {
        type: String,
        trim: true,
        maxlength: [100, 'Supplier name cannot exceed 100 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['ingredients', 'beverages', 'dairy', 'meat', 'vegetables', 'spices', 'other'],
        default: 'other'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual to check if item is low stock
itemSchema.virtual('isLowStock').get(function() {
    return this.currentstocklevel <= this.minstocklevel;
});

// Index for better performance
itemSchema.index({ itemName: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ isActive: 1 });

const itemModel = mongoose.model('Item', itemSchema);
module.exports = itemModel;