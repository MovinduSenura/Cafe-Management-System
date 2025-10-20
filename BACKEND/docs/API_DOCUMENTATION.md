# Cafe Management System API Documentation

## Base URL
```
Development: http://localhost:8000
API Version: /api/v1
```

## Authentication
Most endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Common Response Format
All API responses follow this structure:
```json
{
  "success": true|false,
  "statusCode": 200,
  "message": "Description of the result",
  "data": {...},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Response Format
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": ["Detailed error messages"],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Endpoints

### Health Check
- **GET** `/health`
  - Returns server status and uptime
  - No authentication required

### Customers

#### Create Customer
- **POST** `/api/v1/customers/create`
- **Body:**
  ```json
  {
    "customerFullName": "John Doe",
    "customerEmail": "john@example.com",
    "customerContactNo": "1234567890",
    "customerNIC": "123456789V",
    "customerGender": "Male",
    "customerAddress": "123 Main St",
    "customerLoyaltyPoints": 0
  }
  ```

#### Get All Customers
- **GET** `/api/v1/customers?page=1&limit=10`
- Returns paginated list of customers

#### Get Customer by ID
- **GET** `/api/v1/customers/:id`

#### Update Customer
- **PATCH** `/api/v1/customers/:id`
- **Body:** Partial customer object

#### Delete Customer
- **DELETE** `/api/v1/customers/:id`
- Soft delete (sets isActive to false)

#### Search Customers
- **GET** `/api/v1/customers/search?customerNIC=123&customerName=John&customerEmail=john`

#### Customer Reports
- **GET** `/api/v1/customers/reports/invoice`
- Generates PDF report of all customers

#### Customer Utility
- **GET** `/api/v1/customers/find/:identifier`
  - Find customer by contact number or name
- **PATCH** `/api/v1/customers/loyalty-points/:id`
  - Update loyalty points

### Customer Feedback

#### Add Feedback
- **POST** `/api/v1/customers/:userid/feedback`
- **Body:**
  ```json
  {
    "DayVisited": "2024-01-01",
    "TimeVisited": "14:30",
    "Comment": "Great service!",
    "rating": 5
  }
  ```

#### Get Customer Feedbacks
- **GET** `/api/v1/customers/:userid/feedback`

#### Get All Feedbacks
- **GET** `/api/v1/customers/feedback/all`

#### Search Feedbacks
- **GET** `/api/v1/customers/feedback/search?DayVisited=2024-01-01`

#### Get Feedback by ID
- **GET** `/api/v1/customers/feedback/:feedbackId`

#### Update Feedback
- **PATCH** `/api/v1/customers/:customerNIC/feedback/:feedbackId`

#### Delete Feedback
- **DELETE** `/api/v1/customers/:userId/feedback/:feedbackId`

#### Reply to Feedback
- **POST** `/api/v1/customers/feedback/:feedbackId/reply`
- **Body:**
  ```json
  {
    "reply": "Thank you for your feedback!"
  }
  ```

### Menu Items

#### Create Menu Item
- **POST** `/api/v1/menu/create`
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `menuItemImage`: Image file (optional)
  - `menuItemName`: String (required)
  - `menuItemDescription`: String (required)
  - `menuItemCategory`: String (required)
  - `menuItemPrice`: Number (required)
  - `menuItemAvailability`: Boolean (default: true)

#### Get All Menu Items
- **GET** `/api/v1/menu?page=1&limit=10`

#### Get Menu Item by ID
- **GET** `/api/v1/menu/:id`

#### Update Menu Item
- **PATCH** `/api/v1/menu/:id`
- **Content-Type:** `multipart/form-data`

#### Delete Menu Item
- **DELETE** `/api/v1/menu/:id`

#### Search Menu Items
- **GET** `/api/v1/menu/search?name=coffee&category=beverages`

#### Menu Reports
- **GET** `/api/v1/menu/reports/invoice`

### Orders

#### Create Order
- **POST** `/api/v1/orders/create`
- **Body:**
  ```json
  {
    "customerInfo": {
      "name": "John Doe",
      "contact": "1234567890"
    },
    "items": [
      {
        "menuItem": "menuItemId",
        "quantity": 2,
        "unitPrice": 10.99,
        "subtotal": 21.98
      }
    ],
    "orderType": "dine-in",
    "tableNumber": "T01",
    "subtotal": 21.98,
    "tax": 2.20,
    "totalAmount": 24.18
  }
  ```

#### Get All Orders
- **GET** `/api/v1/orders?page=1&limit=10&status=pending`

#### Get Order by ID
- **GET** `/api/v1/orders/:id`

#### Update Order Status
- **PATCH** `/api/v1/orders/:id/status`
- **Body:**
  ```json
  {
    "status": "preparing"
  }
  ```

#### Cancel Order
- **DELETE** `/api/v1/orders/:id`

### Staff

#### Create Staff
- **POST** `/api/v1/staff/create`
- **Body:**
  ```json
  {
    "staffName": "Jane Smith",
    "staffEmail": "jane@cafe.com",
    "staffContactNo": "1234567890",
    "staffAddress": "456 Oak St",
    "staffAge": 25,
    "staffGender": "Female",
    "staffSalaryPerHours": 15.50,
    "staffRole": "cashier",
    "staffPassword": "securePassword123",
    "department": "service",
    "shift": "morning"
  }
  ```

#### Staff Login
- **POST** `/api/v1/staff/login`
- **Body:**
  ```json
  {
    "staffEmail": "jane@cafe.com",
    "staffPassword": "securePassword123"
  }
  ```

#### Get All Staff
- **GET** `/api/v1/staff?page=1&limit=10&role=cashier`

#### Get Staff by ID
- **GET** `/api/v1/staff/:id`

#### Update Staff
- **PATCH** `/api/v1/staff/:id`

#### Delete Staff
- **DELETE** `/api/v1/staff/:id`

### Inventory/Stock

#### Add Stock Item
- **POST** `/api/v1/stock/create`
- **Body:**
  ```json
  {
    "itemName": "Coffee Beans",
    "quantity": 100,
    "currentstocklevel": 50,
    "minstocklevel": 10,
    "unit": "kg",
    "category": "ingredients"
  }
  ```

#### Get All Stock
- **GET** `/api/v1/stock?page=1&limit=10&category=ingredients`

#### Get Low Stock Items
- **GET** `/api/v1/stock/low-stock`

#### Update Stock
- **PATCH** `/api/v1/stock/:id`

### Tables

#### Get All Tables
- **GET** `/api/v1/tables`

#### Update Table Status
- **PATCH** `/api/v1/tables/:id/status`

### Reservations

#### Create Reservation
- **POST** `/api/v1/reservations/create`

#### Get All Reservations
- **GET** `/api/v1/reservations`

#### Update Reservation
- **PATCH** `/api/v1/reservations/:id`

### Payments

#### Process Payment
- **POST** `/api/v1/payments/process`

#### Get Payment History
- **GET** `/api/v1/payments/history`

## Data Models

### Customer
```typescript
{
  _id: ObjectId,
  customerFullName: string,
  customerEmail: string,
  customerContactNo: string,
  customerNIC: string,
  customerGender: "Male" | "Female" | "Other",
  customerAddress: string,
  customerLoyaltyPoints: number,
  feedbacks: Feedback[],
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### MenuItem
```typescript
{
  _id: ObjectId,
  menuItemImage: string,
  menuItemName: string,
  menuItemDescription: string,
  menuItemCategory: string,
  menuItemPrice: number,
  menuItemAvailability: boolean,
  preparationTime: number,
  ingredients: Array<{ingredient: string, quantity: string}>,
  allergens: string[],
  isVegetarian: boolean,
  isVegan: boolean,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```typescript
{
  _id: ObjectId,
  orderNumber: string,
  customer: ObjectId,
  customerInfo: {name: string, contact: string},
  items: OrderItem[],
  orderType: "dine-in" | "takeaway" | "delivery",
  tableNumber: string,
  subtotal: number,
  tax: number,
  discount: number,
  totalAmount: number,
  status: "pending" | "confirmed" | "preparing" | "ready" | "served" | "completed" | "cancelled",
  paymentStatus: "pending" | "paid" | "refunded",
  estimatedTime: number,
  actualTime: number,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Staff
```typescript
{
  _id: ObjectId,
  staffName: string,
  staffEmail: string,
  staffContactNo: string,
  staffAddress: string,
  staffAge: number,
  staffGender: "Male" | "Female" | "Other",
  staffSalaryPerHours: number,
  staffWorkedHours: number,
  staffRole: "admin" | "manager" | "chef" | "cashier" | "waiter" | "cleaner",
  department: "kitchen" | "service" | "management" | "cleaning",
  employeeId: string,
  dateOfJoining: Date,
  shift: "morning" | "afternoon" | "evening" | "night",
  isActive: boolean,
  lastLogin: Date,
  permissions: string[],
  createdAt: Date,
  updatedAt: Date
}
```

## Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (Validation Error)
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## Rate Limiting

- **Development**: 1000 requests per 15 minutes per IP
- **Production**: 100 requests per 15 minutes per IP

## File Upload

- **Max file size**: 5MB
- **Allowed formats**: jpg, jpeg, png, gif, webp
- **Upload path**: `/uploads/`

## Environment Variables

```env
PORT=8000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/cafeDB
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
LOG_LEVEL=info
```