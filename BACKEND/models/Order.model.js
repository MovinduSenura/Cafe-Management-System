const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: [true, 'Menu item is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: [200, 'Special instructions cannot exceed 200 characters']
  }
});

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    contact: {
      type: String,
      required: [true, 'Customer contact is required'],
      trim: true
    }
  },
  items: [OrderItemSchema],
  orderType: {
    type: String,
    enum: ['dine-in', 'takeaway', 'delivery'],
    required: [true, 'Order type is required'],
    default: 'dine-in'
  },
  tableNumber: {
    type: String,
    required: function() { return this.orderType === 'dine-in'; },
    trim: true
  },
  deliveryAddress: {
    type: String,
    required: function() { return this.orderType === 'delivery'; },
    trim: true,
    maxlength: [200, 'Delivery address cannot exceed 200 characters']
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'digital', 'loyalty-points'],
    required: function() { return this.paymentStatus === 'paid'; }
  },
  estimatedTime: {
    type: Number,
    min: [1, 'Estimated time must be at least 1 minute'],
    default: 30
  },
  actualTime: {
    type: Number,
    min: [0, 'Actual time cannot be negative']
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
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

// Pre-save middleware to generate order number
OrderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order of the day
    const lastOrder = await this.constructor.findOne({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      }
    }).sort({ createdAt: -1 });
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-3));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `ORD${year}${month}${day}${sequence.toString().padStart(3, '0')}`;
  }
  next();
});

// Virtual for order duration
OrderSchema.virtual('duration').get(function() {
  if (this.actualTime) {
    return this.actualTime;
  }
  if (this.status === 'completed' && this.createdAt) {
    return Math.round((Date.now() - this.createdAt.getTime()) / (1000 * 60));
  }
  return null;
});

// Indexes for better performance
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderType: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ customer: 1 });

const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
 