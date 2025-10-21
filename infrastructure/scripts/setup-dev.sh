#!/bin/bash

echo "Setting up development environment with Docker Compose..."
echo "=========================================================="

cd "$(dirname "$0")/../docker-compose"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop any existing containers
echo "Stopping any existing containers..."
docker-compose -f docker-compose.microservices.yml down 2>/dev/null || true

# Start all services
echo "Starting all microservices..."
docker-compose -f docker-compose.microservices.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check service health
echo "Checking service health..."
services=(3000 3001 3002 3003 3004 3005 3006 3007 3008 3009)
healthy_services=0

for port in "${services[@]}"; do
    if curl -s --max-time 5 "http://localhost:$port/health" > /dev/null 2>&1; then
        echo "Service on port $port is healthy"
        ((healthy_services++))
    else
        echo "Service on port $port is not responding"
    fi
done

echo ""
echo "Health Check Summary:"
echo "   Healthy services: $healthy_services/10"

if [ $healthy_services -eq 10 ]; then
    echo "All services are running successfully!"
else
    echo "Some services are not healthy. Check logs with:"
    echo "   docker-compose -f docker-compose.microservices.yml logs"
fi

echo ""
echo "Access Points:"
echo "   API Gateway:     http://localhost:3000"
echo "   Admin Dashboard: http://localhost:3000/admin/dashboard" 
echo "   Health Check:    http://localhost:3000/health"
echo ""
echo "Useful Commands:"
echo "   View logs:       docker-compose -f docker-compose.microservices.yml logs -f"
echo "   Stop services:   docker-compose -f docker-compose.microservices.yml down"
echo "   Restart service: docker-compose -f docker-compose.microservices.yml restart <service-name>"