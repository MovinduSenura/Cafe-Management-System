# Cafe Management System - Microservices Architecture

## Overview

This document outlines the complete migration from a monolithic architecture to a microservices-based system for the Cafe Management System, optimized for Kubernetes deployment with industry best practices.

## Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Load Balancer │    │   API Gateway    │    │   Service Discovery │
│   (Kubernetes)  │───▶│   (Port 3000)    │───▶│      (Redis)        │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼─────┐ ┌───────▼─────┐ ┌─────▼─────┐
        │ User Service│ │Customer Svc │ │ Menu Svc  │
        │ (Port 3001) │ │(Port 3002)  │ │(Port 3003)│
        └─────────────┘ └─────────────┘ └───────────┘
                │               │               │
        ┌───────▼─────┐ ┌───────▼─────┐ ┌─────▼─────┐
        │  MongoDB    │ │  MongoDB    │ │ MongoDB   │
        │  (Users)    │ │ (Customers) │ │ (Menu)    │
        └─────────────┘ └─────────────┘ └───────────┘
```

## Microservices Architecture

### Services Overview

1. **API Gateway** (Port 3000)
   - Central entry point for all client requests
   - Authentication and authorization
   - Request routing and load balancing
   - Rate limiting and caching
   - Circuit breaker pattern implementation

2. **User Service** (Port 3001)
   - Staff authentication and authorization
   - JWT token management
   - Role-based access control (RBAC)
   - User profile management
   - Password security and account lockout

3. **Customer Service** (Port 3002)
   - Customer profile management
   - Loyalty points system
   - Customer analytics and segmentation
   - Communication preferences
   - Customer tier management

4. **Menu Service** (Port 3003)
   - Menu item management
   - Category and cuisine management
   - Pricing and discount management
   - Nutritional information
   - Availability and inventory status

### 🔄 Future Services (To be implemented)

5. **Order Service** (Port 3004)
   - Order processing and management
   - Order status tracking
   - Kitchen workflow integration

6. **Payment Service** (Port 3005)
   - Payment processing
   - Multiple payment methods
   - Transaction management

7. **Inventory Service** (Port 3006)
   - Stock management
   - Supplier management
   - Inventory alerts

8. **Reservation Service** (Port 3007)
   - Table reservation management
   - Availability checking
   - Reservation notifications

9. **Notification Service** (Port 3008)
   - Email and SMS notifications
   - Push notifications
   - Communication templates

10. **Report Service** (Port 3009)
    - Business analytics
    - Financial reporting
    - Performance metrics

## Deployment Guide

### Prerequisites

- Docker 20.10+
- Kubernetes 1.21+
- kubectl configured
- Node.js 18+ (for local development)

### Local Development Setup

1. **Clone and Navigate**
   ```bash
   cd BACKEND/microservices
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URIs and JWT secrets
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Verify Services**
   ```bash
   curl http://localhost:3000/health  # API Gateway
   curl http://localhost:3001/health  # User Service
   curl http://localhost:3002/health  # Customer Service
   curl http://localhost:3003/health  # Menu Service
   ```

### Kubernetes Deployment

1. **Deploy to Kubernetes**
   ```bash
   ./scripts/deploy.sh
   ```

2. **Monitor Deployment**
   ```bash
   kubectl get pods -n cafe-management
   kubectl logs -f deployment/api-gateway-deployment -n cafe-management
   ```

3. **Access API Gateway**
   ```bash
   kubectl port-forward service/api-gateway-service 3000:80 -n cafe-management
   ```

4. **Cleanup (when needed)**
   ```bash
   ./scripts/cleanup.sh
   ```

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Account lockout after failed login attempts
- Password hashing with bcrypt (salt rounds: 12)

### Network Security
- Kubernetes Network Policies for micro-segmentation
- TLS encryption for inter-service communication
- API rate limiting and DDoS protection
- Request validation and sanitization

### Container Security
- Non-root user execution
- Minimal Alpine Linux base images
- Health checks for all services
- Resource limits and quotas

## 📈 Scalability & Performance

### Horizontal Pod Autoscaling (HPA)
- CPU-based scaling (70% threshold)
- Memory-based scaling (80% threshold)
- Min replicas: 2, Max replicas: 8-10

### Performance Optimizations
- Redis caching for frequently accessed data
- Database connection pooling
- Efficient MongoDB queries with indexes
- Request/response compression

### Monitoring & Observability
- Health check endpoints for all services
- Structured logging with Winston
- Service discovery and circuit breaker patterns
- Pod disruption budgets for high availability

## 🗄️ Database Strategy

### Database per Service Pattern
- **User Database**: Staff and authentication data
- **Customer Database**: Customer profiles and loyalty data
- **Menu Database**: Menu items and categories
- **Order Database**: Order processing and history
- **Payment Database**: Transaction records
- **Inventory Database**: Stock and supplier data

### Data Consistency
- Eventual consistency between services
- Event-driven architecture for data synchronization
- Saga pattern for distributed transactions

## 🔌 API Endpoints

### API Gateway Routes
```
GET  /health                    # Gateway health check
POST /api/v1/auth/*            # Authentication routes
GET  /api/v1/customers/*       # Customer management
GET  /api/v1/menu-items/*      # Menu management
POST /api/v1/orders/*          # Order processing
POST /api/v1/payments/*        # Payment processing
```

### Service-specific Endpoints

#### User Service
```
POST /api/v1/register          # Staff registration
POST /api/v1/login             # Staff login
POST /api/v1/refresh           # Token refresh
POST /api/v1/logout            # Logout
GET  /api/v1/profile           # Get user profile
```

#### Customer Service
```
GET    /api/v1/customers       # List customers
POST   /api/v1/customers       # Create customer
GET    /api/v1/customers/:id   # Get customer
PUT    /api/v1/customers/:id   # Update customer
DELETE /api/v1/customers/:id   # Delete customer
POST   /api/v1/customers/:id/loyalty  # Update loyalty points
```

#### Menu Service
```
GET    /api/v1/menu-items      # List menu items
POST   /api/v1/menu-items      # Create menu item
GET    /api/v1/menu-items/:id  # Get menu item
PUT    /api/v1/menu-items/:id  # Update menu item
DELETE /api/v1/menu-items/:id  # Delete menu item
PATCH  /api/v1/menu-items/:id/availability  # Toggle availability
GET    /api/v1/categories      # Get categories
GET    /api/v1/menu-items/popular  # Get popular items
```

## 🔧 Configuration Management

### Environment Variables
```env
# Database Configuration
MONGODB_URI=mongodb+srv://...
CUSTOMER_DB_URI=mongodb+srv://...
MENU_DB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Service Configuration
NODE_ENV=production
LOG_LEVEL=info
REDIS_HOST=redis-service
REDIS_PORT=6379
```

### Kubernetes Configuration
- ConfigMaps for non-sensitive configuration
- Secrets for sensitive data (database URIs, JWT secrets)
- Resource quotas and limits
- Network policies for security

## 🚦 Testing Strategy

### Unit Testing
```bash
npm test                    # Run unit tests
npm run test:coverage      # Generate coverage report
```

### Integration Testing
```bash
npm run test:integration   # Run integration tests
```

### Load Testing
```bash
# Test API Gateway
curl -X GET http://localhost:3000/health

# Test authentication
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"staffEmail":"admin@cafe.com","staffPassword":"password"}'
```

## Monitoring & Logging

### Health Checks
All services implement health check endpoints:
```bash
curl http://service:port/health
```

### Logging Strategy
- Structured JSON logging with Winston
- Log levels: error, warn, info, debug
- Centralized log aggregation (recommended: ELK stack)

### Metrics Collection
- CPU and memory usage monitoring
- Request/response time tracking
- Error rate monitoring
- Custom business metrics

## 🔄 Migration Benefits

### From Monolith to Microservices

1. **Scalability**
   - Independent scaling of services
   - Resource optimization
   - Better performance under load

2. **Maintainability**
   - Service isolation
   - Technology stack flexibility
   - Easier debugging and testing

3. **Reliability**
   - Fault isolation
   - Circuit breaker patterns
   - Graceful degradation

4. **Development Velocity**
   - Team autonomy
   - Independent deployments
   - Continuous integration/deployment

## 🛠️ Troubleshooting

### Common Issues

1. **Service Discovery Issues**
   ```bash
   kubectl get services -n cafe-management
   kubectl describe service api-gateway-service -n cafe-management
   ```

2. **Database Connection Issues**
   ```bash
   kubectl logs deployment/user-service-deployment -n cafe-management
   ```

3. **Authentication Problems**
   ```bash
   # Check JWT secret configuration
   kubectl get secret cafe-secrets -n cafe-management -o yaml
   ```

4. **Resource Issues**
   ```bash
   kubectl top pods -n cafe-management
   kubectl describe hpa -n cafe-management
   ```

## Next Steps

1. **Complete Remaining Services**
   - Order Service implementation
   - Payment Service integration
   - Inventory Service development
   - Reservation Service creation
   - Notification Service setup
   - Report Service analytics

2. **Advanced Features**
   - Event sourcing implementation
   - CQRS pattern adoption
   - Message queue integration (RabbitMQ/Kafka)
   - API versioning strategy

3. **Production Readiness**
   - SSL/TLS configuration
   - Production secrets management
   - Backup and disaster recovery
   - Performance optimization

4. **DevOps Enhancement**
   - CI/CD pipeline setup
   - Infrastructure as Code (Terraform)
   - Monitoring and alerting (Prometheus/Grafana)
   - Log aggregation (ELK stack)

## Conclusion

The microservices architecture provides a robust, scalable, and maintainable foundation for the Cafe Management System. With Kubernetes orchestration, the system is ready for production deployment with enterprise-grade features including auto-scaling, high availability, and comprehensive monitoring.

The migration from monolith to microservices enables:
- Better resource utilization
- Independent service scaling
- Improved fault tolerance
- Enhanced development productivity
- Future-proof architecture for growth