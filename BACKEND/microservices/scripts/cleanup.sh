#!/bin/bash

# Cleanup script for Cafe Management System Microservices
# This script removes all deployed resources from Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

NAMESPACE="cafe-management"

echo -e "${BLUE}🧹 Cleaning up Cafe Management System Microservices${NC}"
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

# Check if namespace exists
if ! kubectl get namespace $NAMESPACE &> /dev/null; then
    print_warning "Namespace $NAMESPACE does not exist"
    exit 0
fi

echo -e "${YELLOW}This will delete all resources in namespace: ${NAMESPACE}${NC}"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Operation cancelled${NC}"
    exit 0
fi

# Delete autoscaling policies
if kubectl get -f k8s/autoscaling-policies.yaml &> /dev/null; then
    echo -e "${YELLOW}Deleting autoscaling policies...${NC}"
    kubectl delete -f k8s/autoscaling-policies.yaml || true
    print_status "Autoscaling policies deleted"
fi

# Delete base services
if kubectl get -f k8s/base-services.yaml &> /dev/null; then
    echo -e "${YELLOW}Deleting base services...${NC}"
    kubectl delete -f k8s/base-services.yaml || true
    print_status "Base services deleted"
fi

# Delete the entire namespace
echo -e "${YELLOW}Deleting namespace ${NAMESPACE}...${NC}"
kubectl delete namespace $NAMESPACE || true
print_status "Namespace deleted"

# Clean up Docker images (optional)
read -p "Do you want to remove local Docker images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Removing Docker images...${NC}"
    docker rmi cafe-management/api-gateway:latest || true
    docker rmi cafe-management/user-service:latest || true
    docker rmi cafe-management/customer-service:latest || true
    docker rmi cafe-management/menu-service:latest || true
    print_status "Docker images removed"
fi

echo -e "${GREEN}🎉 Cleanup completed successfully!${NC}"