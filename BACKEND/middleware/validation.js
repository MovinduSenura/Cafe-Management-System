const Joi = require('joi');
const { ApiError } = require('../utils/apiResponse');

// Customer validation schemas
const customerCreateSchema = Joi.object({
  customerFullName: Joi.string().required().trim().min(2).max(100),
  customerEmail: Joi.string().email().required().trim(),
  customerContactNo: Joi.string().pattern(/^\d{10}$/).required(),
  customerNIC: Joi.string().required().trim().min(10).max(12),
  customerGender: Joi.string().valid('Male', 'Female', 'Other').required(),
  customerAddress: Joi.string().required().trim().min(5),
  customerLoyaltyPoints: Joi.number().min(0).default(0)
});

const customerUpdateSchema = Joi.object({
  customerFullName: Joi.string().trim().min(2).max(100),
  customerEmail: Joi.string().email().trim(),
  customerContactNo: Joi.string().pattern(/^\d{10}$/),
  customerNIC: Joi.string().trim().min(10).max(12),
  customerGender: Joi.string().valid('Male', 'Female', 'Other'),
  customerAddress: Joi.string().trim().min(5),
  customerLoyaltyPoints: Joi.number().min(0)
});

// Menu Item validation schemas
const menuItemCreateSchema = Joi.object({
  menuItemName: Joi.string().required().trim().min(2).max(100),
  menuItemDescription: Joi.string().required().trim().min(10).max(500),
  menuItemCategory: Joi.string().required().valid('appetizers', 'main-course', 'desserts', 'beverages', 'snacks', 'breakfast', 'lunch', 'dinner'),
  menuItemPrice: Joi.number().required().min(0),
  menuItemAvailability: Joi.boolean().default(true),
  preparationTime: Joi.number().min(1).max(180).default(15),
  isVegetarian: Joi.boolean().default(false),
  isVegan: Joi.boolean().default(false),
  allergens: Joi.array().items(Joi.string().valid('gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish', 'fish'))
});

const menuItemUpdateSchema = Joi.object({
  menuItemName: Joi.string().trim().min(2).max(100),
  menuItemDescription: Joi.string().trim().min(10).max(500),
  menuItemCategory: Joi.string().valid('appetizers', 'main-course', 'desserts', 'beverages', 'snacks', 'breakfast', 'lunch', 'dinner'),
  menuItemPrice: Joi.number().min(0),
  menuItemAvailability: Joi.boolean(),
  preparationTime: Joi.number().min(1).max(180),
  isVegetarian: Joi.boolean(),
  isVegan: Joi.boolean(),
  allergens: Joi.array().items(Joi.string().valid('gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish', 'fish'))
});

// Order validation schemas
const orderCreateSchema = Joi.object({
  customerInfo: Joi.object({
    name: Joi.string().required().trim(),
    contact: Joi.string().required().trim()
  }).required(),
  items: Joi.array().items(Joi.object({
    menuItem: Joi.string().required(),
    quantity: Joi.number().required().min(1),
    unitPrice: Joi.number().required().min(0),
    subtotal: Joi.number().required().min(0),
    specialInstructions: Joi.string().max(200)
  })).min(1).required(),
  orderType: Joi.string().valid('dine-in', 'takeaway', 'delivery').required(),
  tableNumber: Joi.string().when('orderType', { is: 'dine-in', then: Joi.string().required() }),
  deliveryAddress: Joi.string().when('orderType', { is: 'delivery', then: Joi.string().required().max(200) }),
  subtotal: Joi.number().required().min(0),
  tax: Joi.number().min(0).default(0),
  discount: Joi.number().min(0).default(0),
  totalAmount: Joi.number().required().min(0)
});

const orderUpdateSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'),
  paymentStatus: Joi.string().valid('pending', 'paid', 'refunded'),
  paymentMethod: Joi.string().valid('cash', 'card', 'digital', 'loyalty-points'),
  actualTime: Joi.number().min(0),
  notes: Joi.string().max(500)
});

// Staff validation schemas
const staffCreateSchema = Joi.object({
  staffName: Joi.string().required().trim().min(2).max(100),
  staffEmail: Joi.string().email().required().trim(),
  staffContactNo: Joi.string().pattern(/^\d{10}$/).required(),
  staffAddress: Joi.string().required().trim().min(5).max(200),
  staffAge: Joi.number().required().min(16).max(70),
  staffGender: Joi.string().valid('Male', 'Female', 'Other').required(),
  staffSalaryPerHours: Joi.number().required().min(0),
  staffRole: Joi.string().valid('admin', 'manager', 'chef', 'cashier', 'waiter', 'cleaner').required(),
  staffPassword: Joi.string().required().min(6),
  department: Joi.string().valid('kitchen', 'service', 'management', 'cleaning'),
  shift: Joi.string().valid('morning', 'afternoon', 'evening', 'night').default('morning')
});

const staffUpdateSchema = Joi.object({
  staffName: Joi.string().trim().min(2).max(100),
  staffEmail: Joi.string().email().trim(),
  staffContactNo: Joi.string().pattern(/^\d{10}$/),
  staffAddress: Joi.string().trim().min(5).max(200),
  staffAge: Joi.number().min(16).max(70),
  staffGender: Joi.string().valid('Male', 'Female', 'Other'),
  staffSalaryPerHours: Joi.number().min(0),
  staffRole: Joi.string().valid('admin', 'manager', 'chef', 'cashier', 'waiter', 'cleaner'),
  department: Joi.string().valid('kitchen', 'service', 'management', 'cleaning'),
  shift: Joi.string().valid('morning', 'afternoon', 'evening', 'night'),
  staffWorkedHours: Joi.number().min(0).max(168)
});

// Login validation schema
const loginSchema = Joi.object({
  staffEmail: Joi.string().email().required(),
  staffPassword: Joi.string().required()
});

// Feedback validation schema
const feedbackSchema = Joi.object({
  DayVisited: Joi.string().required(),
  TimeVisited: Joi.string().required(),
  Comment: Joi.string().required().min(5).max(1000),
  rating: Joi.number().min(1).max(5).required()
});

// Payment validation schema
const paymentSchema = Joi.object({
  orderId: Joi.string().required(),
  amount: Joi.number().required().min(0),
  paymentMethod: Joi.string().valid('cash', 'card', 'digital', 'loyalty-points').required(),
  loyaltyPointsUsed: Joi.number().min(0).default(0)
});

// Generic validation middleware factory
const createValidationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      throw new ApiError(400, "Validation failed", [errorMessage]);
    }
    
    next();
  };
};

// Export validation middleware
module.exports = {
  // Customer validations
  validateCustomerCreate: createValidationMiddleware(customerCreateSchema),
  validateCustomerUpdate: createValidationMiddleware(customerUpdateSchema),
  
  // Menu item validations
  validateMenuItem: createValidationMiddleware(menuItemCreateSchema),
  validateMenuItemUpdate: createValidationMiddleware(menuItemUpdateSchema),
  
  // Order validations
  validateOrder: createValidationMiddleware(orderCreateSchema),
  validateOrderUpdate: createValidationMiddleware(orderUpdateSchema),
  
  // Staff validations
  validateStaff: createValidationMiddleware(staffCreateSchema),
  validateStaffUpdate: createValidationMiddleware(staffUpdateSchema),
  validateLogin: createValidationMiddleware(loginSchema),
  
  // Other validations
  validateFeedback: createValidationMiddleware(feedbackSchema),
  validatePayment: createValidationMiddleware(paymentSchema),
  
  // Schema exports for custom validation
  schemas: {
    customerCreateSchema,
    customerUpdateSchema,
    menuItemCreateSchema,
    menuItemUpdateSchema,
    orderCreateSchema,
    orderUpdateSchema,
    staffCreateSchema,
    staffUpdateSchema,
    loginSchema,
    feedbackSchema,
    paymentSchema
  }
};