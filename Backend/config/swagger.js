const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cafe Management System API',
      version: '1.0.0',
      description: 'A comprehensive API for managing cafe operations',
      contact: {
        name: 'Development Team',
        email: 'dev@cafemanagement.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:8000',
        description: 'Development server'
      },
      {
        url: 'https://api.cafemanagement.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful'
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp'
            }
          }
        },
        ApiError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code'
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Detailed error messages'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Customer: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Customer ID'
            },
            customerID: {
              type: 'string',
              description: 'Unique customer identifier'
            },
            customerName: {
              type: 'string',
              description: 'Customer full name'
            },
            customerEmail: {
              type: 'string',
              format: 'email',
              description: 'Customer email address'
            },
            customerPhone: {
              type: 'string',
              description: 'Customer phone number'
            },
            customerAddress: {
              type: 'string',
              description: 'Customer address'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether customer is active'
            },
            loyaltyPoints: {
              type: 'number',
              description: 'Customer loyalty points'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        MenuItem: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            menuItemName: {
              type: 'string',
              description: 'Menu item name'
            },
            menuItemPrice: {
              type: 'number',
              description: 'Item price'
            },
            menuItemDescription: {
              type: 'string',
              description: 'Item description'
            },
            menuItemCategory: {
              type: 'string',
              enum: ['appetizers', 'main-course', 'desserts', 'beverages', 'snacks'],
              description: 'Item category'
            },
            menuItemImage: {
              type: 'string',
              description: 'Image filename'
            },
            isAvailable: {
              type: 'boolean',
              description: 'Whether item is available'
            },
            allergens: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'List of allergens'
            },
            nutritionalInfo: {
              type: 'object',
              properties: {
                calories: { type: 'number' },
                protein: { type: 'number' },
                carbs: { type: 'number' },
                fat: { type: 'number' }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ]
};

const specs = swaggerJsdoc(options);

const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Cafe Management API Documentation'
  }));
  
  // Serve swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

module.exports = swaggerSetup;