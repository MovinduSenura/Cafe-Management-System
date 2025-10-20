const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    DayVisited: {
        type: String,
        required: true,
        trim: true
    },
    TimeVisited: {
        type: String,
        required: true,
        trim: true   
    },
    Comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reply: {
        type: String,
        default: "pending",
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const customerSchema = new mongoose.Schema({
    customerFullName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },

    customerEmail: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },

    customerContactNo: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true,
        match: [/^\d{10}$/, 'Contact number must be 10 digits']
    },

    customerNIC: {
        type: String,
        required: [true, 'NIC is required'],
        trim: true,
        unique: true,
        minlength: [10, 'NIC must be at least 10 characters'],
        maxlength: [12, 'NIC cannot exceed 12 characters']
    },

    customerGender: {
        type: String,
        required: [true, 'Gender is required'],
        trim: true,
        enum: ['Male', 'Female', 'Other']
    },

    customerAddress: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minlength: [5, 'Address must be at least 5 characters']
    },

    customerLoyaltyPoints: {
        type: Number,
        default: 0,
        min: [0, 'Loyalty points cannot be negative']
    },

    feedbacks: [feedbackSchema],
    
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
customerSchema.index({ customerContactNo: 1 });

// Virtual for feedback count
customerSchema.virtual('feedbackCount').get(function() {
    return this.feedbacks.length;
});

const customerModel = mongoose.model('Customer', customerSchema);
module.exports = customerModel;