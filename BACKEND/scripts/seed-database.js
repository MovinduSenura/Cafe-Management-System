const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// Import models
const staffModel = require('../models/staff.model');
const customerModel = require('../models/customer.model');
const menuItemModel = require('../models/menuItem.model');
const tableModel = require('../models/table.model');

// Sample data
const sampleStaff = [
  {
    staffName: 'Admin User',
    staffEmail: 'admin@cafemanagement.com',
    staffPassword: 'admin123',
    staffRole: 'admin',
    staffPhone: '1234567890',
    staffAddress: '123 Admin Street',
    department: 'management',
    isActive: true
  },
  {
    staffName: 'Manager User',
    staffEmail: 'manager@cafemanagement.com',
    staffPassword: 'manager123',
    staffRole: 'manager',
    staffPhone: '1234567891',
    staffAddress: '123 Manager Street',
    department: 'management',
    isActive: true
  },
  {
    staffName: 'Cashier User',
    staffEmail: 'cashier@cafemanagement.com',
    staffPassword: 'cashier123',
    staffRole: 'cashier',
    staffPhone: '1234567892',
    staffAddress: '123 Cashier Street',
    department: 'service',
    isActive: true
  }
];

const sampleCustomers = [
  {
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '9876543210',
    customerAddress: '456 Customer Street',
    loyaltyPoints: 100
  },
  {
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '9876543211',
    customerAddress: '457 Customer Avenue',
    loyaltyPoints: 150
  }
];

const sampleMenuItems = [
  {
    menuItemName: 'Espresso',
    menuItemPrice: 3.50,
    menuItemDescription: 'Rich and bold espresso shot',
    menuItemCategory: 'beverages',
    isAvailable: true,
    allergens: [],
    nutritionalInfo: {
      calories: 5,
      protein: 0,
      carbs: 1,
      fat: 0
    }
  },
  {
    menuItemName: 'Caesar Salad',
    menuItemPrice: 12.99,
    menuItemDescription: 'Fresh romaine lettuce with Caesar dressing',
    menuItemCategory: 'appetizers',
    isAvailable: true,
    allergens: ['dairy', 'eggs'],
    nutritionalInfo: {
      calories: 350,
      protein: 8,
      carbs: 15,
      fat: 28
    }
  },
  {
    menuItemName: 'Grilled Chicken Breast',
    menuItemPrice: 18.99,
    menuItemDescription: 'Tender grilled chicken with herbs',
    menuItemCategory: 'main-course',
    isAvailable: true,
    allergens: [],
    nutritionalInfo: {
      calories: 450,
      protein: 35,
      carbs: 5,
      fat: 18
    }
  }
];

const sampleTables = [
  {
    tableNumber: 'T001',
    seats: 2,
    status: 'available',
    location: 'Window side'
  },
  {
    tableNumber: 'T002',
    seats: 4,
    status: 'available',
    location: 'Center'
  },
  {
    tableNumber: 'T003',
    seats: 6,
    status: 'available',
    location: 'Corner'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cafe_management');
    logger.info('Connected to database for seeding');

    // Clear existing data
    await Promise.all([
      staffModel.deleteMany({}),
      customerModel.deleteMany({}),
      menuItemModel.deleteMany({}),
      tableModel.deleteMany({})
    ]);
    logger.info('Cleared existing data');

    // Hash passwords for staff
    for (const staff of sampleStaff) {
      staff.staffPassword = await bcrypt.hash(staff.staffPassword, 10);
    }

    // Insert sample data
    const [staff, customers, menuItems, tables] = await Promise.all([
      staffModel.insertMany(sampleStaff),
      customerModel.insertMany(sampleCustomers),
      menuItemModel.insertMany(sampleMenuItems),
      tableModel.insertMany(sampleTables)
    ]);

    logger.info(`Seeded database with:
      - ${staff.length} staff members
      - ${customers.length} customers
      - ${menuItems.length} menu items
      - ${tables.length} tables
    `);

    console.log('Sample login credentials:');
    console.log('Admin: admin@cafemanagement.com / admin123');
    console.log('Manager: manager@cafemanagement.com / manager123');
    console.log('Cashier: cashier@cafemanagement.com / cashier123');

  } catch (error) {
    logger.error('Database seeding failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  }
};

// Run seeding if called directly
if (require.main === module) {
  require('dotenv').config();
  seedDatabase()
    .then(() => {
      console.log('Database seeded successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;