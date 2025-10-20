#!/bin/bash

# Comprehensive Microservices Deployment and Testing Script
# This script deploys all 9 microservices and runs health checks

set -e

echo "🚀 Starting Cafe Management System Microservices Deployment"
echo "=========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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
    echo -e "${BLUE}$1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "📋 Checking Prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if kubectl is installed
    if ! command -v kubectl &> /dev/null; then
        print_warning "kubectl is not installed. Kubernetes deployment will be skipped."
        SKIP_K8S=true
    fi
    
    print_status "Prerequisites check completed!"
}

# Function to create Docker network
create_network() {
    print_header "🌐 Setting up Docker Network..."
    
    if ! docker network ls | grep -q "cafe-network"; then
        docker network create cafe-network
        print_status "Created Docker network: cafe-network"
    else
        print_status "Docker network 'cafe-network' already exists"
    fi
}

# Function to start MongoDB
start_mongodb() {
    print_header "🗄️ Starting MongoDB..."
    
    docker run -d \
        --name mongo-cafe \
        --network cafe-network \
        -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=password \
        -v mongo-data:/data/db \
        mongo:latest \
        || print_status "MongoDB container already running"
        
    print_status "MongoDB started on port 27017"
}

# Function to start Redis
start_redis() {
    print_header "🔴 Starting Redis..."
    
    docker run -d \
        --name redis-cafe \
        --network cafe-network \
        -p 6379:6379 \
        redis:alpine \
        || print_status "Redis container already running"
        
    print_status "Redis started on port 6379"
}

# Function to build and start a microservice
start_service() {
    local service_name=$1
    local port=$2
    local path=$3
    
    print_header "🔨 Building and starting $service_name..."
    
    cd "$path"
    
    # Create Dockerfile if it doesn't exist
    if [ ! -f "Dockerfile" ]; then
        cat > Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE $port

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:$port/health || exit 1

CMD ["npm", "start"]
EOF
    fi
    
    # Build Docker image
    docker build -t "$service_name" . || {
        print_error "Failed to build $service_name"
        return 1
    }
    
    # Stop existing container if running
    docker stop "$service_name" 2>/dev/null || true
    docker rm "$service_name" 2>/dev/null || true
    
    # Start new container
    docker run -d \
        --name "$service_name" \
        --network cafe-network \
        -p "$port:$port" \
        -e MONGODB_URI="mongodb://admin:password@mongo-cafe:27017/cafe-management?authSource=admin" \
        -e REDIS_HOST="redis-cafe" \
        -e JWT_SECRET="your-super-secret-jwt-key-change-in-production" \
        -e NODE_ENV="development" \
        "$service_name" || {
        print_error "Failed to start $service_name"
        return 1
    }
    
    print_status "$service_name started on port $port"
    cd - > /dev/null
}

# Function to check service health
check_health() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    print_header "🏥 Checking health of $service_name..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "http://localhost:$port/health" > /dev/null 2>&1; then
            print_status "$service_name is healthy!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    print_error "$service_name health check failed after $max_attempts attempts"
    return 1
}

# Function to run service tests
test_service() {
    local service_name=$1
    local port=$2
    
    print_header "🧪 Testing $service_name endpoints..."
    
    # Test health endpoint
    health_response=$(curl -s "http://localhost:$port/health" || echo "failed")
    if [[ $health_response == *"healthy"* ]] || [[ $health_response == *"OK"* ]]; then
        print_status "$service_name health endpoint: ✅"
    else
        print_error "$service_name health endpoint: ❌"
    fi
    
    # Add more specific tests for each service
    case $service_name in
        "api-gateway")
            # Test gateway routes
            if curl -s "http://localhost:$port/api/v1/menu/public" > /dev/null; then
                print_status "$service_name public routes: ✅"
            else
                print_warning "$service_name public routes: ⚠️"
            fi
            ;;
        "user-service")
            # Test user registration endpoint structure
            response=$(curl -s -X POST "http://localhost:$port/api/v1/register" \
                -H "Content-Type: application/json" \
                -d '{}' || echo "failed")
            if [[ $response == *"error"* ]]; then
                print_status "$service_name registration endpoint: ✅"
            else
                print_warning "$service_name registration endpoint: ⚠️"
            fi
            ;;
    esac
}

# Main deployment function
deploy_services() {
    print_header "🚀 Deploying All Microservices..."
    
    # Base path for microservices
    BASE_PATH="/Users/ravinbandara/Desktop/Cafe-Management-System-1/BACKEND/microservices"
    
    # Array of services with their details
    declare -A services=(
        ["api-gateway"]="3000:$BASE_PATH/api-gateway"
        ["user-service"]="3001:$BASE_PATH/user-service"
        ["customer-service"]="3002:$BASE_PATH/customer-service"
        ["menu-service"]="3003:$BASE_PATH/menu-service"
        ["order-service"]="3004:$BASE_PATH/order-service"
        ["payment-service"]="3005:$BASE_PATH/payment-service"
        ["inventory-service"]="3006:$BASE_PATH/inventory-service"
        ["reservation-service"]="3007:$BASE_PATH/reservation-service"
        ["notification-service"]="3008:$BASE_PATH/notification-service"
        ["report-service"]="3009:$BASE_PATH/report-service"
    )
    
    # Start infrastructure services first
    create_network
    start_mongodb
    start_redis
    
    # Wait for infrastructure to be ready
    print_status "Waiting for infrastructure services to be ready..."
    sleep 10
    
    # Deploy each microservice
    for service in "${!services[@]}"; do
        IFS=':' read -r port path <<< "${services[$service]}"
        start_service "$service" "$port" "$path"
        
        # Wait a bit between services
        sleep 5
        
        # Check health
        check_health "$service" "$port"
        
        # Run tests
        test_service "$service" "$port"
        
        echo ""
    done
}

# Function to show service status
show_status() {
    print_header "📊 Service Status Dashboard"
    echo ""
    
    printf "%-20s %-10s %-15s %-10s\n" "SERVICE" "PORT" "STATUS" "HEALTH"
    echo "--------------------------------------------------------"
    
    services=(
        "api-gateway:3000"
        "user-service:3001"
        "customer-service:3002"
        "menu-service:3003"
        "order-service:3004"
        "payment-service:3005"
        "inventory-service:3006"
        "reservation-service:3007"
        "notification-service:3008"
        "report-service:3009"
        "mongo-cafe:27017"
        "redis-cafe:6379"
    )
    
    for service_port in "${services[@]}"; do
        IFS=':' read -r service port <<< "$service_port"
        
        if docker ps | grep -q "$service"; then
            status="Running"
            
            # Check health if it's an application service
            if [[ $service != "mongo-cafe" && $service != "redis-cafe" ]]; then
                if curl -f -s "http://localhost:$port/health" > /dev/null 2>&1; then
                    health="Healthy"
                else
                    health="Unhealthy"
                fi
            else
                health="N/A"
            fi
        else
            status="Stopped"
            health="N/A"
        fi
        
        printf "%-20s %-10s %-15s %-10s\n" "$service" "$port" "$status" "$health"
    done
    
    echo ""
    print_status "Access the API Gateway at: http://localhost:3000"
    print_status "MongoDB: localhost:27017 (admin/password)"
    print_status "Redis: localhost:6379"
}

# Function to stop all services
stop_services() {
    print_header "🛑 Stopping All Services..."
    
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
        "mongo-cafe"
        "redis-cafe"
    )
    
    for service in "${services[@]}"; do
        if docker ps | grep -q "$service"; then
            docker stop "$service"
            docker rm "$service"
            print_status "Stopped $service"
        fi
    done
    
    # Remove network
    if docker network ls | grep -q "cafe-network"; then
        docker network rm cafe-network
        print_status "Removed Docker network"
    fi
}

# Function to show logs
show_logs() {
    local service=$1
    if [ -z "$service" ]; then
        print_error "Please specify a service name"
        print_status "Available services: api-gateway, user-service, customer-service, menu-service, order-service, payment-service, inventory-service, reservation-service, notification-service, report-service"
        return 1
    fi
    
    print_header "📝 Showing logs for $service..."
    docker logs -f "$service"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        check_prerequisites
        deploy_services
        show_status
        ;;
    "status")
        show_status
        ;;
    "stop")
        stop_services
        ;;
    "logs")
        show_logs "$2"
        ;;
    "health")
        print_header "🏥 Health Check All Services..."
        ports=(3000 3001 3002 3003 3004 3005 3006 3007 3008 3009)
        for port in "${ports[@]}"; do
            if curl -f -s "http://localhost:$port/health" > /dev/null; then
                print_status "Port $port: ✅ Healthy"
            else
                print_error "Port $port: ❌ Unhealthy"
            fi
        done
        ;;
    "test")
        print_header "🧪 Running Integration Tests..."
        
        # Test API Gateway routing
        print_status "Testing API Gateway routing..."
        
        # Test public endpoints
        curl -s "http://localhost:3000/health" | jq '.' || echo "API Gateway health check failed"
        
        print_status "Integration tests completed!"
        ;;
    *)
        echo "Usage: $0 {deploy|status|stop|logs <service>|health|test}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Deploy all microservices"
        echo "  status  - Show status of all services"
        echo "  stop    - Stop all services"
        echo "  logs    - Show logs for a specific service"
        echo "  health  - Check health of all services"
        echo "  test    - Run integration tests"
        exit 1
        ;;
esac

print_status "Script execution completed!"