#!/bin/bash

# Monitoring Stack Installation Script
# This script deploys Prometheus, Grafana, AlertManager, Jaeger, and Node Exporter

set -e

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

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed"
        exit 1
    fi
    
    if ! kubectl cluster-info &> /dev/null; then
        print_error "No Kubernetes cluster found"
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

# Deploy monitoring namespace and RBAC
deploy_base() {
    print_header "Deploying Base Configuration"
    
    print_status "Creating monitoring namespace and RBAC..."
    kubectl apply -f 00-namespace-rbac.yaml
    
    # Wait for namespace to be ready
    kubectl wait --for=condition=Ready namespace/monitoring --timeout=60s || true
}

# Deploy Prometheus stack
deploy_prometheus() {
    print_header "Deploying Prometheus Stack"
    
    print_status "Deploying Prometheus configuration..."
    kubectl apply -f prometheus-config.yaml
    kubectl apply -f prometheus-rules.yaml
    
    print_status "Deploying Prometheus server..."
    kubectl apply -f prometheus.yaml
    
    print_status "Waiting for Prometheus to be ready..."
    kubectl wait --for=condition=Available deployment/prometheus -n monitoring --timeout=300s
    
    print_status "Prometheus deployment completed!"
}

# Deploy Grafana
deploy_grafana() {
    print_header "Deploying Grafana"
    
    print_status "Deploying Grafana dashboards..."
    kubectl apply -f grafana-dashboards.yaml
    
    print_status "Deploying Grafana server..."
    kubectl apply -f grafana.yaml
    
    print_status "Waiting for Grafana to be ready..."
    kubectl wait --for=condition=Available deployment/grafana -n monitoring --timeout=300s
    
    print_status "Grafana deployment completed!"
}

# Deploy AlertManager
deploy_alertmanager() {
    print_header "Deploying AlertManager"
    
    print_status "Deploying AlertManager..."
    kubectl apply -f alertmanager.yaml
    
    print_status "Waiting for AlertManager to be ready..."
    kubectl wait --for=condition=Available deployment/alertmanager -n monitoring --timeout=300s
    
    print_status "AlertManager deployment completed!"
}

# Deploy Jaeger
deploy_jaeger() {
    print_header "Deploying Jaeger"
    
    print_status "Deploying Jaeger tracing..."
    kubectl apply -f jaeger.yaml
    
    print_status "Waiting for Jaeger to be ready..."
    kubectl wait --for=condition=Available deployment/jaeger -n monitoring --timeout=300s
    
    print_status "Jaeger deployment completed!"
}

# Deploy Node Exporter
deploy_node_exporter() {
    print_header "Deploying Node Exporter"
    
    print_status "Deploying Node Exporter DaemonSet..."
    kubectl apply -f node-exporter.yaml
    
    print_status "Waiting for Node Exporter to be ready..."
    kubectl rollout status daemonset/node-exporter -n monitoring --timeout=300s
    
    print_status "Node Exporter deployment completed!"
}

# Update service annotations for Prometheus scraping
update_service_annotations() {
    print_header "Updating Service Annotations"
    
    print_status "Adding Prometheus scraping annotations to cafe services..."
    
    # Add annotations to existing services
    services=(
        "api-gateway-service"
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
        if kubectl get service "$service" -n cafe-management &> /dev/null; then
            kubectl annotate service "$service" -n cafe-management \
                prometheus.io/scrape=true \
                prometheus.io/port=3000 \
                prometheus.io/path=/metrics \
                --overwrite || print_warning "Failed to annotate $service"
        else
            print_warning "Service $service not found, skipping annotation"
        fi
    done
}

# Show status and access information
show_status() {
    print_header "Monitoring Stack Status"
    
    print_status "Monitoring namespace pods:"
    kubectl get pods -n monitoring
    
    echo ""
    print_status "Services:"
    kubectl get services -n monitoring
    
    echo ""
    print_header "Access Information"
    
    # Get service endpoints
    PROMETHEUS_IP=$(kubectl get service prometheus -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    GRAFANA_IP=$(kubectl get service grafana -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    ALERTMANAGER_IP=$(kubectl get service alertmanager -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    JAEGER_IP=$(kubectl get service jaeger-query -n monitoring -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    
    if [ -n "$PROMETHEUS_IP" ]; then
        print_status "Prometheus UI: http://$PROMETHEUS_IP:9090"
    else
        print_warning "Prometheus LoadBalancer IP pending. Use port-forward:"
        echo "  kubectl port-forward svc/prometheus -n monitoring 9090:9090"
    fi
    
    if [ -n "$GRAFANA_IP" ]; then
        print_status "Grafana UI: http://$GRAFANA_IP:3000 (admin/admin123)"
    else
        print_warning "Grafana LoadBalancer IP pending. Use port-forward:"
        echo "  kubectl port-forward svc/grafana -n monitoring 3000:3000"
    fi
    
    if [ -n "$ALERTMANAGER_IP" ]; then
        print_status "AlertManager UI: http://$ALERTMANAGER_IP:9093"
    else
        print_warning "AlertManager LoadBalancer IP pending. Use port-forward:"
        echo "  kubectl port-forward svc/alertmanager -n monitoring 9093:9093"
    fi
    
    if [ -n "$JAEGER_IP" ]; then
        print_status "Jaeger UI: http://$JAEGER_IP:16686"
    else
        print_warning "Jaeger LoadBalancer IP pending. Use port-forward:"
        echo "  kubectl port-forward svc/jaeger-query -n monitoring 16686:16686"
    fi
}

# Port forward all services for local access
port_forward_all() {
    print_header "Setting up Port Forwards"
    
    print_status "Starting port forwards (run in background)..."
    
    # Kill existing port forwards
    pkill -f "kubectl port-forward.*monitoring" || true
    
    # Start new port forwards
    kubectl port-forward svc/prometheus -n monitoring 9090:9090 &
    kubectl port-forward svc/grafana -n monitoring 3000:3000 &
    kubectl port-forward svc/alertmanager -n monitoring 9093:9093 &
    kubectl port-forward svc/jaeger-query -n monitoring 16686:16686 &
    
    sleep 5
    
    print_status "Services available at:"
    echo "  Prometheus: http://localhost:9090"
    echo "  Grafana: http://localhost:3000 (admin/admin123)"
    echo "  AlertManager: http://localhost:9093"
    echo "  Jaeger: http://localhost:16686"
    echo ""
    print_warning "Port forwards are running in background. Use 'pkill -f kubectl' to stop them."
}

# Cleanup function
cleanup() {
    print_header "Cleaning up Monitoring Stack"
    
    print_status "Deleting monitoring resources..."
    kubectl delete -f . --ignore-not-found=true
    
    print_status "Deleting monitoring namespace..."
    kubectl delete namespace monitoring --ignore-not-found=true
    
    print_status "Cleanup completed"
}

# Main execution
case "${1:-install}" in
    "install")
        check_prerequisites
        deploy_base
        deploy_prometheus
        deploy_grafana
        deploy_alertmanager
        deploy_jaeger
        deploy_node_exporter
        update_service_annotations
        show_status
        print_status "Monitoring stack deployment completed successfully!"
        ;;
    "status")
        show_status
        ;;
    "port-forward")
        port_forward_all
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo "Usage: $0 {install|status|port-forward|cleanup}"
        echo ""
        echo "Commands:"
        echo "  install      - Install complete monitoring stack"
        echo "  status       - Show deployment status and access info"
        echo "  port-forward - Setup port forwards for local access"
        echo "  cleanup      - Remove all monitoring components"
        exit 1
        ;;
esac