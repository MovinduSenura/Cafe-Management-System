const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    menuItemImage: {
        type: String,
        validate: {
            validator: function(v) {
                return !v || /\.(jpg|jpeg|png|gif|webp)$/i.test(v);
            },
            message: 'Image must be a valid image file format'
        }
    },
    menuItemName: {
        type: String,
        required: [true, 'Menu item name is required'],
        trim: true,
        minlength: [2, 'Menu item name must be at least 2 characters'],
        maxlength: [100, 'Menu item name cannot exceed 100 characters'],
        unique: true
    },
    menuItemDescription: {
        type: String,
        required: [true, 'Menu item description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    menuItemCategory: {
        type: String,
        required: [true, 'Menu item category is required'],
        trim: true,
        enum: {
            values: ['appetizers', 'main-course', 'desserts', 'beverages', 'snacks', 'breakfast', 'lunch', 'dinner'],
            message: 'Category must be one of: appetizers, main-course, desserts, beverages, snacks, breakfast, lunch, dinner'
        }
    },
    menuItemPrice: {
        type: Number,
        required: [true, 'Menu item price is required'],
        min: [0, 'Price cannot be negative'],
        validate: {
            validator: function(v) {
                return Number.isFinite(v) && v >= 0;
            },
            message: 'Price must be a valid positive number'
        }
    },
    menuItemAvailability: {
        type: Boolean,
        default: true,
    },
    preparationTime: {
        type: Number,
        min: [1, 'Preparation time must be at least 1 minute'],
        max: [180, 'Preparation time cannot exceed 180 minutes'],
        default: 15
    },
    ingredients: [{
        ingredient: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: String,
            required: true,
            trim: true
        }
    }],
    nutritionalInfo: {
        calories: {
            type: Number,
            min: 0
        },
        protein: {
            type: Number,
            min: 0
        },
        carbs: {
            type: Number,
            min: 0
        },
        fat: {
            type: Number,
            min: 0
        }
    },
    allergens: [{
        type: String,
        enum: ['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish', 'fish']
    }],
    isVegetarian: {
        type: Boolean,
        default: false
    },
    isVegan: {
        type: Boolean,
        default: false
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

// Indexes for better performance
menuItemSchema.index({ menuItemCategory: 1 });
menuItemSchema.index({ menuItemAvailability: 1 });
menuItemSchema.index({ isActive: 1 });
menuItemSchema.index({ menuItemPrice: 1 });

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function() {
    return `$${this.menuItemPrice.toFixed(2)}`;
});

const menuItemModel = mongoose.model('MenuItem', menuItemSchema);
module.exports = menuItemModel;