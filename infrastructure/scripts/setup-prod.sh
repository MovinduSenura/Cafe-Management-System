#!/bin/bash

echo "Setting up production environment with Kubernetes..."
echo "====================================================="

cd "$(dirname "$0")/../k8s"

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed or not in PATH"
    exit 1
fi

# Check if we can connect to a Kubernetes cluster
if ! kubectl cluster-info > /dev/null 2>&1; then
    echo "Cannot connect to Kubernetes cluster. Please ensure kubectl is configured."
    exit 1
fi

echo "Connected to Kubernetes cluster"

# Create namespace and base configurations
echo "Applying base configurations..."
kubectl apply -f base/

# Deploy infrastructure components (MongoDB, Redis)
echo "Deploying infrastructure components..."
kubectl apply -f infrastructure/

# Wait for infrastructure to be ready
echo "Waiting for infrastructure to be ready..."
kubectl wait --for=condition=ready pod -l app=mongodb --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis --timeout=300s

# Deploy microservices
echo "Deploying microservices..."
kubectl apply -f services/

# Apply autoscaling policies
echo "Applying autoscaling policies..."
kubectl apply -f autoscaling-policies.yaml

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available deployment --all --timeout=600s

# Get service status
echo ""
echo "Deployment Status:"
kubectl get deployments
echo ""
kubectl get services
echo ""
kubectl get pods

echo ""
echo "Production environment deployed successfully!"
echo ""
echo "Access Points:"
echo "   To get external IPs: kubectl get services"
echo "   Port forward API Gateway: kubectl port-forward service/api-gateway 3000:3000"
echo ""
echo "Useful Commands:"
echo "   View pods:       kubectl get pods"
echo "   View logs:       kubectl logs -f deployment/<service-name>"
echo "   Scale service:   kubectl scale deployment <service-name> --replicas=<count>"
echo "   Delete all:      kubectl delete -f ."