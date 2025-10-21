#!/bin/bash

# Kubernetes Deployment Script for Cafe Management System
# This script deploys the microservices in the correct order

set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MICROSERVICES_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check if kubectl is available
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        print_error "No Kubernetes cluster found. Please connect to a cluster first."
        exit 1
    fi
    
    print_status "Kubernetes cluster is accessible"
    kubectl cluster-info
}

# Deploy base configuration
deploy_base() {
    print_header "Deploying Base Configuration"
    
    print_status "Creating namespace and RBAC..."
    kubectl apply -f "$SCRIPT_DIR/base/namespace.yaml"
    
    print_status "Creating ConfigMaps and Secrets..."
    kubectl apply -f "$SCRIPT_DIR/base/configmap.yaml"
    
    # Wait for namespace to be ready
    kubectl wait --for=condition=Ready namespace/cafe-management --timeout=60s || true
}

# Deploy infrastructure services
deploy_infrastructure() {
    print_header "Deploying Infrastructure Services"
    
    print_status "Deploying MongoDB..."
    kubectl apply -f "$SCRIPT_DIR/infrastructure/mongodb.yaml"
    
    print_status "Deploying Redis..."
    kubectl apply -f "$SCRIPT_DIR/infrastructure/redis.yaml"
    
    print_status "Waiting for infrastructure services to be ready..."
    kubectl wait --for=condition=Available deployment/redis -n cafe-management --timeout=300s || print_warning "Redis not ready yet"
    kubectl wait --for=condition=Ready statefulset/mongodb -n cafe-management --timeout=300s || print_warning "MongoDB not ready yet"
    
    print_status "Infrastructure services deployment complete!"
}

# Build Docker images
build_images() {
    print_header "Building Docker Images"
    
    services=(
        "api-gateway"
        "user-service"
        "customer-service"
        "menu-service"
        "order-service"
        "payment-service"
        "inventory-service"
        "reservation-service"
        "notification-service"
        "report-service"
    )
    
    for service in "${services[@]}"; do
        print_status "Building $service..."
        
        cd "$MICROSERVICES_DIR/$service"
        
        # Create Dockerfile if it doesn't exist
        if [ ! -f "Dockerfile" ]; then
            cat > Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:\${PORT:-3000}/health || exit 1

# Start the service
CMD ["npm", "start"]
EOF
        fi
        
        # Build the image
        docker build -t "cafe-management/$service:latest" . || {
            print_error "Failed to build $service"
            exit 1
        }
        
        cd ..
    done
    
    print_status "All Docker images built successfully!"
}

# Deploy application services
deploy_services() {
    print_header "Deploying Application Services"
    
    # Services to deploy in order
    services=(
        "api-gateway"
        "user-service"
        "customer-service"
        "menu-service"
        "order-service"
        "payment-service"
        "inventory-service"
        "reservation-service"
        "notification-service"
        "report-service"
    )
    
    for service in "${services[@]}"; do
        if [ -f "$SCRIPT_DIR/services/$service.yaml" ]; then
            print_status "Deploying $service..."
            kubectl apply -f "$SCRIPT_DIR/services/$service.yaml"
            
            # Wait for deployment to be ready
            kubectl wait --for=condition=Available deployment/$service -n cafe-management --timeout=300s || {
                print_warning "$service deployment timeout, continuing..."
            }
        else
            print_warning "Manifest for $service not found, skipping..."
        fi
    done
}

# Check deployment status
check_status() {
    print_header "Checking Deployment Status"
    
    print_status "Pods status:"
    kubectl get pods -n cafe-management
    
    echo ""
    print_status "Services status:"
    kubectl get services -n cafe-management
    
    echo ""
    print_status "Ingress status:"
    kubectl get ingress -n cafe-management 2>/dev/null || echo "No ingress configured"
    
    echo ""
    print_status "HPA status:"
    kubectl get hpa -n cafe-management
}

# Run health checks
health_check() {
    print_header "Running Health Checks"
    
    # Get API Gateway service details
    GATEWAY_IP=$(kubectl get service api-gateway-service -n cafe-management -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    GATEWAY_PORT=$(kubectl get service api-gateway-service -n cafe-management -o jsonpath='{.spec.ports[0].port}')
    
    if [ -z "$GATEWAY_IP" ]; then
        print_warning "LoadBalancer IP not assigned yet. Using port-forward for testing..."
        kubectl port-forward service/api-gateway-service 8080:80 -n cafe-management &
        PORT_FORWARD_PID=$!
        sleep 5
        
        if curl -f -s "http://localhost:8080/health" > /dev/null; then
            print_status "API Gateway health check: ✅"
        else
            print_error "API Gateway health check: ❌"
        fi
        
        kill $PORT_FORWARD_PID 2>/dev/null || true
    else
        if curl -f -s "http://$GATEWAY_IP:$GATEWAY_PORT/health" > /dev/null; then
            print_status "API Gateway health check: ✅"
            print_status "API Gateway accessible at: http://$GATEWAY_IP:$GATEWAY_PORT"
        else
            print_error "API Gateway health check: ❌"
        fi
    fi
}

# Show logs for a service
show_logs() {
    local service=$1
    if [ -z "$service" ]; then
        print_error "Please specify a service name"
        echo "Available services: api-gateway, user-service, customer-service, menu-service, order-service, payment-service, inventory-service, reservation-service, notification-service, report-service"
        return 1
    fi
    
    print_header "Showing logs for $service"
    kubectl logs -f deployment/$service -n cafe-management
}

# Cleanup deployment
cleanup() {
    print_header "Cleaning Up Deployment"
    
    print_status "Deleting services..."
    kubectl delete -f "$SCRIPT_DIR/services/" --ignore-not-found=true
    
    print_status "Deleting infrastructure..."
    kubectl delete -f "$SCRIPT_DIR/infrastructure/" --ignore-not-found=true
    
    print_status "Deleting base configuration..."
    kubectl delete -f "$SCRIPT_DIR/base/" --ignore-not-found=true
    
    print_status "Cleanup completed!"
}

# Scale services
scale() {
    local service=$1
    local replicas=$2
    
    if [ -z "$service" ] || [ -z "$replicas" ]; then
        print_error "Usage: $0 scale <service-name> <replica-count>"
        return 1
    fi
    
    print_status "Scaling $service to $replicas replicas..."
    kubectl scale deployment/$service --replicas=$replicas -n cafe-management
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        check_prerequisites
        deploy_base
        deploy_infrastructure
        build_images
        deploy_services
        check_status
        health_check
        print_status "Deployment completed successfully!"
        ;;
    "status")
        check_status
        ;;
    "health")
        health_check
        ;;
    "logs")
        show_logs "$2"
        ;;
    "cleanup")
        cleanup
        ;;
    "scale")
        scale "$2" "$3"
        ;;
    "build")
        build_images
        ;;
    *)
        echo "Usage: $0 {deploy|status|health|logs <service>|cleanup|scale <service> <replicas>|build}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full deployment of all services"
        echo "  status   - Show deployment status"
        echo "  health   - Run health checks"
        echo "  logs     - Show logs for a specific service"
        echo "  cleanup  - Remove all deployed resources"
        echo "  scale    - Scale a service to specified replicas"
        echo "  build    - Build Docker images only"
        exit 1
        ;;
esac