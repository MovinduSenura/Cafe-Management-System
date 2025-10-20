#!/bin/bash

# Cafe Management System - Microservices Startup Script
# This script helps you manage the microservices deployment

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.microservices.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

function print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  Cafe Management Microservices${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

function print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

function print_error() {
    echo -e "${RED}✗ $1${NC}"
}

function print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

function start_services() {
    print_header
    print_info "Starting all microservices..."
    
    docker-compose -f "$COMPOSE_FILE" up -d
    
    if [ $? -eq 0 ]; then
        print_success "All services started successfully!"
        echo ""
        print_info "Services are available at:"
        echo "  • API Gateway:          http://localhost:3000"
        echo "  • User Service:         http://localhost:3001"
        echo "  • Customer Service:     http://localhost:3002"
        echo "  • Menu Service:         http://localhost:3003"
        echo "  • Order Service:        http://localhost:3004"
        echo "  • Payment Service:      http://localhost:3005"
        echo "  • Inventory Service:    http://localhost:3006"
        echo "  • Reservation Service:  http://localhost:3007"
        echo "  • Notification Service: http://localhost:3008"
        echo "  • Report Service:       http://localhost:3009"
        echo "  • MongoDB:              localhost:27017"
        echo "  • Redis:                localhost:6379"
        echo ""
        print_info "Use './start.sh logs' to view logs"
        print_info "Use './start.sh status' to check service health"
    else
        print_error "Failed to start services"
        exit 1
    fi
}

function stop_services() {
    print_header
    print_info "Stopping all microservices..."
    
    docker-compose -f "$COMPOSE_FILE" down
    
    if [ $? -eq 0 ]; then
        print_success "All services stopped successfully!"
    else
        print_error "Failed to stop services"
        exit 1
    fi
}

function restart_services() {
    print_header
    print_info "Restarting all microservices..."
    
    docker-compose -f "$COMPOSE_FILE" restart
    
    if [ $? -eq 0 ]; then
        print_success "All services restarted successfully!"
    else
        print_error "Failed to restart services"
        exit 1
    fi
}

function view_logs() {
    if [ -z "$2" ]; then
        print_info "Viewing logs for all services (Ctrl+C to exit)..."
        docker-compose -f "$COMPOSE_FILE" logs -f
    else
        print_info "Viewing logs for $2 (Ctrl+C to exit)..."
        docker-compose -f "$COMPOSE_FILE" logs -f "$2"
    fi
}

function check_status() {
    print_header
    print_info "Checking service status..."
    echo ""
    
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo ""
    print_info "Health check status:"
    
    services=("api-gateway" "user-service" "customer-service" "menu-service" "order-service" 
              "payment-service" "inventory-service" "reservation-service" "notification-service" "report-service")
    
    for service in "${services[@]}"; do
        health=$(docker inspect --format='{{.State.Health.Status}}' "cafe-${service}" 2>/dev/null || echo "unknown")
        if [ "$health" = "healthy" ]; then
            print_success "$service: healthy"
        elif [ "$health" = "unhealthy" ]; then
            print_error "$service: unhealthy"
        elif [ "$health" = "starting" ]; then
            print_info "$service: starting..."
        else
            print_info "$service: no health check configured"
        fi
    done
}

function build_services() {
    print_header
    print_info "Building all Docker images..."
    
    docker-compose -f "$COMPOSE_FILE" build --parallel
    
    if [ $? -eq 0 ]; then
        print_success "All images built successfully!"
    else
        print_error "Failed to build images"
        exit 1
    fi
}

function clean_services() {
    print_header
    print_info "Cleaning up containers, volumes, and images..."
    
    read -p "This will remove all containers, volumes, and images. Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f "$COMPOSE_FILE" down -v --rmi all
        print_success "Cleanup complete!"
    else
        print_info "Cleanup cancelled"
    fi
}

function show_help() {
    print_header
    echo "Usage: ./start.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start       Start all microservices (default)"
    echo "  stop        Stop all microservices"
    echo "  restart     Restart all microservices"
    echo "  status      Check service health and status"
    echo "  logs [svc]  View logs (optionally for specific service)"
    echo "  build       Build all Docker images"
    echo "  clean       Remove containers, volumes, and images"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./start.sh                    # Start all services"
    echo "  ./start.sh logs               # View all logs"
    echo "  ./start.sh logs api-gateway   # View API Gateway logs"
    echo "  ./start.sh status             # Check service health"
    echo ""
}

# Main script logic
case "${1:-start}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        check_status
        ;;
    logs)
        view_logs "$@"
        ;;
    build)
        build_services
        ;;
    clean)
        clean_services
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
