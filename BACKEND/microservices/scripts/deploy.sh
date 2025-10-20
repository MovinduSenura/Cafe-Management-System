#!/bin/bash

# Microservices Deployment Script for Kubernetes
# This script builds Docker images and deploys the cafe management microservices to Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="cafe-management"
DOCKER_REGISTRY="your-docker-registry"
VERSION=${1:-latest}

echo -e "${BLUE}🚀 Starting Cafe Management System Microservices Deployment${NC}"
echo -e "${YELLOW}📋 Version: ${VERSION}${NC}"
echo -e "${YELLOW}📋 Namespace: ${NAMESPACE}${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed or not in PATH"
    exit 1
fi

# Check if docker is available
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed or not in PATH"
    exit 1
fi

# Build Docker images
echo -e "${BLUE}🔨 Building Docker Images${NC}"

services=("api-gateway" "user-service" "customer-service" "menu-service")

for service in "${services[@]}"; do
    echo -e "${YELLOW}Building ${service}...${NC}"
    
    if [ -d "$service" ]; then
        cd "$service"
        
        # Build the image
        docker build -t "cafe-management/${service}:${VERSION}" .
        
        # Tag for registry (if using external registry)
        if [ "$DOCKER_REGISTRY" != "your-docker-registry" ]; then
            docker tag "cafe-management/${service}:${VERSION}" "${DOCKER_REGISTRY}/cafe-management/${service}:${VERSION}"
            
            # Push to registry
            echo -e "${YELLOW}Pushing ${service} to registry...${NC}"
            docker push "${DOCKER_REGISTRY}/cafe-management/${service}:${VERSION}"
        fi
        
        cd ..
        print_status "Built ${service}"
    else
        print_warning "Directory ${service} not found, skipping..."
    fi
done

# Create namespace if it doesn't exist
echo -e "${BLUE}🏗️  Setting up Kubernetes Namespace${NC}"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
print_status "Namespace ${NAMESPACE} ready"

# Apply Kubernetes manifests
echo -e "${BLUE}🚀 Deploying to Kubernetes${NC}"

# Deploy base services (ConfigMap, Secrets, Services, Deployments)
if [ -f "k8s/base-services.yaml" ]; then
    echo -e "${YELLOW}Applying base services...${NC}"
    kubectl apply -f k8s/base-services.yaml
    print_status "Base services deployed"
else
    print_error "k8s/base-services.yaml not found"
    exit 1
fi

# Deploy autoscaling and policies
if [ -f "k8s/autoscaling-policies.yaml" ]; then
    echo -e "${YELLOW}Applying autoscaling policies...${NC}"
    kubectl apply -f k8s/autoscaling-policies.yaml
    print_status "Autoscaling policies deployed"
else
    print_warning "k8s/autoscaling-policies.yaml not found, skipping autoscaling setup"
fi

# Wait for deployments to be ready
echo -e "${BLUE}⏳ Waiting for deployments to be ready${NC}"

deployments=("api-gateway-deployment" "user-service-deployment" "customer-service-deployment" "menu-service-deployment")

for deployment in "${deployments[@]}"; do
    echo -e "${YELLOW}Waiting for ${deployment}...${NC}"
    kubectl wait --for=condition=available --timeout=300s deployment/$deployment -n $NAMESPACE
    print_status "${deployment} is ready"
done

# Display service information
echo -e "${BLUE}📊 Deployment Summary${NC}"
echo -e "${GREEN}Services Status:${NC}"
kubectl get services -n $NAMESPACE

echo -e "${GREEN}Pods Status:${NC}"
kubectl get pods -n $NAMESPACE

echo -e "${GREEN}Deployments Status:${NC}"
kubectl get deployments -n $NAMESPACE

# Get API Gateway external IP (if using LoadBalancer)
echo -e "${BLUE}🌐 Getting API Gateway Access Information${NC}"
EXTERNAL_IP=$(kubectl get service api-gateway-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")

if [ "$EXTERNAL_IP" = "pending" ] || [ -z "$EXTERNAL_IP" ]; then
    print_warning "External IP is still pending. You can check later with:"
    echo "kubectl get service api-gateway-service -n $NAMESPACE"
    echo ""
    print_warning "For local testing, you can use port-forward:"
    echo "kubectl port-forward service/api-gateway-service 3000:80 -n $NAMESPACE"
else
    print_status "API Gateway is accessible at: http://${EXTERNAL_IP}"
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📝 To monitor your services:${NC}"
echo "kubectl logs -f deployment/api-gateway-deployment -n $NAMESPACE"
echo "kubectl logs -f deployment/user-service-deployment -n $NAMESPACE"
echo ""
echo -e "${BLUE}📝 To scale services:${NC}"
echo "kubectl scale deployment api-gateway-deployment --replicas=3 -n $NAMESPACE"
echo ""
echo -e "${BLUE}📝 To delete everything:${NC}"
echo "./scripts/cleanup.sh"