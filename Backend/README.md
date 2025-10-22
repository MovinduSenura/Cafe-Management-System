# Cafe Management System - Microservices Backend

This backend is fully implemented using a microservices architecture.

## Architecture Overview

The system consists of 10 independent microservices:

1. **API Gateway** (Port 3000) - Central entry point and routing
2. **User Service** (Port 3001) - User authentication and management
3. **Customer Service** (Port 3002) - Customer data and feedback
4. **Menu Service** (Port 3003) - Menu items and categories
5. **Order Service** (Port 3004) - Order processing and tracking
6. **Payment Service** (Port 3005) - Payment processing
7. **Inventory Service** (Port 3006) - Stock and inventory management
8. **Reservation Service** (Port 3007) - Table reservations
9. **Notification Service** (Port 3008) - Notifications and messaging
10. **Report Service** (Port 3009) - Analytics and reporting

## Directory Structure

```
BACKEND/
├── microservices/                # All microservices code
│   ├── api-gateway/              # API Gateway service
│   ├── user-service/             # User authentication service
│   ├── customer-service/         # Customer management service
│   ├── menu-service/             # Menu items service
│   ├── order-service/            # Order processing service
│   ├── payment-service/          # Payment processing service
│   ├── inventory-service/        # Inventory management service
│   ├── reservation-service/      # Reservation service
│   ├── notification-service/     # Notification service
│   ├── report-service/           # Reporting and analytics
│   └── scripts/                  # Microservices-specific scripts
├── config/                       # Shared configuration
├── scripts/                      # Utility scripts
├── logs/                         # Log files
├── uploads/                      # Uploaded files
├── docker-compose.yml            # Main Docker Compose file
└── start.sh                     # Helper script to manage services
```

## Quick Start

To run the complete system:

```bash
# Start all services
./start.sh

# Check status
./start.sh status

# View logs
./start.sh logs

# Stop all services
./start.sh stop
```

## Service Access Points

- **API Gateway**: http://localhost:3000
- **User Service**: http://localhost:3001
- **Customer Service**: http://localhost:3002
- **Menu Service**: http://localhost:3003
- **Order Service**: http://localhost:3004
- **Payment Service**: http://localhost:3005
- **Inventory Service**: http://localhost:3006
- **Reservation Service**: http://localhost:3007
- **Notification Service**: http://localhost:3008
- **Report Service**: http://localhost:3009

## Infrastructure

The infrastructure configuration is maintained in a separate directory:

```
infrastructure/
├── k8s/                   # Kubernetes manifests
│   ├── base/              # Base configurations
│   ├── services/          # Service deployments
│   └── environments/      # Environment-specific configs
└── docker-compose/        # Docker Compose configurations
```

## Health Check Endpoints

Each service includes health check endpoints accessible at:

```
http://localhost:{port}/health
```

## API Documentation

API documentation is available through Swagger at:

```
http://localhost:{port}/api-docs
```
