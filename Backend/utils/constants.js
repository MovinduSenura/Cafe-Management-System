// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

// User Roles
const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  CHEF: 'chef',
  CASHIER: 'cashier',
  WAITER: 'waiter',
  CLEANER: 'cleaner'
};

// Order Status
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  SERVED: 'served',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Payment Status
const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded'
};

// Payment Methods
const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  DIGITAL: 'digital',
  LOYALTY_POINTS: 'loyalty-points'
};

// Order Types
const ORDER_TYPES = {
  DINE_IN: 'dine-in',
  TAKEAWAY: 'takeaway',
  DELIVERY: 'delivery'
};

// Menu Categories
const MENU_CATEGORIES = {
  APPETIZERS: 'appetizers',
  MAIN_COURSE: 'main-course',
  DESSERTS: 'desserts',
  BEVERAGES: 'beverages',
  SNACKS: 'snacks',
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner'
};

// Table Status
const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  CLEANING: 'cleaning',
  OUT_OF_ORDER: 'out-of-order'
};

// Reservation Status
const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SEATED: 'seated',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show'
};

// Staff Departments
const DEPARTMENTS = {
  KITCHEN: 'kitchen',
  SERVICE: 'service',
  MANAGEMENT: 'management',
  CLEANING: 'cleaning'
};

// Work Shifts
const SHIFTS = {
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening',
  NIGHT: 'night'
};

// Allergens
const ALLERGENS = {
  GLUTEN: 'gluten',
  DAIRY: 'dairy',
  NUTS: 'nuts',
  EGGS: 'eggs',
  SOY: 'soy',
  SHELLFISH: 'shellfish',
  FISH: 'fish'
};

// File Upload Constants
const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  UPLOAD_PATH: './uploads/',
  IMAGE_QUALITY: 80
};

// Pagination Constants
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// Validation Constants
const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PHONE_PATTERN: /^\d{10}$/,
  EMAIL_PATTERN: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
};

// Error Messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  VALIDATION_FAILED: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_TOKEN: 'Invalid or expired token',
  DUPLICATE_ENTRY: 'Resource already exists',
  INVALID_CREDENTIALS: 'Invalid email or password'
};

// Success Messages
const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  FETCHED: 'Resource fetched successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful'
};

// Database Collection Names
const COLLECTIONS = {
  CUSTOMERS: 'customers',
  MENU_ITEMS: 'menuitems',
  ORDERS: 'orders',
  PAYMENTS: 'payments',
  RESERVATIONS: 'reservations',
  TABLES: 'tables',
  STAFF: 'staff',
  STOCK: 'stock',
  PROMOTIONS: 'promotions',
  FEEDBACK: 'feedback'
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  ORDER_TYPES,
  MENU_CATEGORIES,
  TABLE_STATUS,
  RESERVATION_STATUS,
  DEPARTMENTS,
  SHIFTS,
  ALLERGENS,
  FILE_UPLOAD,
  PAGINATION,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  COLLECTIONS
};