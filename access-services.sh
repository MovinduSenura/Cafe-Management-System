#!/bin/bash

# Port Forward Management Script for Cafe Management System
# This script helps you easily manage port forwards for all services

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

# Function to start all port forwards
start_port_forwards() {
    print_header "Starting Port Forwards"
    
    # Kill any existing port forwards
    pkill -f "kubectl port-forward" || true
    sleep 2
    
    # Start port forwards in background
    print_status "Starting ArgoCD on port 8080..."
    kubectl port-forward svc/argocd-server -n argocd 8080:443 > /tmp/argocd-port-forward.log 2>&1 &
    
    print_status "Starting Prometheus on port 9090..."
    kubectl port-forward svc/prometheus -n monitoring 9090:9090 > /tmp/prometheus-port-forward.log 2>&1 &
    
    print_status "Starting Grafana on port 3000..."
    kubectl port-forward svc/grafana -n monitoring 3000:3000 > /tmp/grafana-port-forward.log 2>&1 &
    
    print_status "Starting Jaeger on port 16686..."
    kubectl port-forward svc/jaeger-query -n monitoring 16686:16686 > /tmp/jaeger-port-forward.log 2>&1 &
    
    # Wait for services to be ready
    sleep 5
    
    print_header "Testing Service Accessibility"
    
    # Test each service
    if curl -s -o /dev/null -w "%{http_code}" -k https://localhost:8080 | grep -q "200"; then
        print_status "✅ ArgoCD: https://localhost:8080"
    else
        print_warning "❌ ArgoCD: Not accessible"
    fi
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:9090 | grep -q "302\|200"; then
        print_status "✅ Prometheus: http://localhost:9090"
    else
        print_warning "❌ Prometheus: Not accessible"
    fi
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "302\|200"; then
        print_status "✅ Grafana: http://localhost:3000"
    else
        print_warning "❌ Grafana: Not accessible"
    fi
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:16686 | grep -q "200"; then
        print_status "✅ Jaeger: http://localhost:16686"
    else
        print_warning "❌ Jaeger: Not accessible"
    fi
    
    print_header "Access Information"
    echo "📋 Service URLs:"
    echo "   🚀 ArgoCD:     https://localhost:8080"
    echo "   📊 Prometheus: http://localhost:9090"
    echo "   📈 Grafana:    http://localhost:3000"
    echo "   🔍 Jaeger:     http://localhost:16686"
    echo ""
    echo "🔐 Credentials:"
    echo "   ArgoCD:   admin / $(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" 2>/dev/null | base64 -d || echo "PASSWORD_NOT_FOUND")"
    echo "   Grafana:  admin / admin123"
    echo ""
    echo "📝 Note: Port forwards are running in background. Use '$0 stop' to stop them."
}

# Function to stop all port forwards
stop_port_forwards() {
    print_header "Stopping Port Forwards"
    
    print_status "Killing all kubectl port-forward processes..."
    pkill -f "kubectl port-forward" || true
    
    print_status "Port forwards stopped."
}

# Function to check status
check_status() {
    print_header "Service Status Check"
    
    print_status "Kubernetes Pods:"
    echo "ArgoCD:"
    kubectl get pods -n argocd -o wide 2>/dev/null || echo "  No ArgoCD pods found"
    echo ""
    echo "Monitoring:"
    kubectl get pods -n monitoring -o wide 2>/dev/null || echo "  No monitoring pods found"
    echo ""
    
    print_status "Port Forward Processes:"
    if pgrep -f "kubectl port-forward" > /dev/null; then
        pgrep -f "kubectl port-forward" | while read pid; do
            ps -p $pid -o pid,command | tail -n +2
        done
    else
        echo "  No active port forwards found"
    fi
}

# Function to show logs
show_logs() {
    local service=$1
    if [ -z "$service" ]; then
        print_error "Please specify a service: argocd, prometheus, grafana, jaeger"
        return 1
    fi
    
    case $service in
        "argocd")
            kubectl logs deployment/argocd-server -n argocd -f
            ;;
        "prometheus")
            kubectl logs deployment/prometheus -n monitoring -f
            ;;
        "grafana")
            kubectl logs deployment/grafana -n monitoring -f
            ;;
        "jaeger")
            kubectl logs deployment/jaeger -n monitoring -f
            ;;
        *)
            print_error "Unknown service: $service"
            echo "Available services: argocd, prometheus, grafana, jaeger"
            return 1
            ;;
    esac
}

# Function to restart a service
restart_service() {
    local service=$1
    if [ -z "$service" ]; then
        print_error "Please specify a service: argocd, prometheus, grafana, jaeger"
        return 1
    fi
    
    case $service in
        "argocd")
            kubectl rollout restart deployment/argocd-server -n argocd
            ;;
        "prometheus")
            kubectl rollout restart deployment/prometheus -n monitoring
            ;;
        "grafana")
            kubectl rollout restart deployment/grafana -n monitoring
            ;;
        "jaeger")
            kubectl rollout restart deployment/jaeger -n monitoring
            ;;
        *)
            print_error "Unknown service: $service"
            echo "Available services: argocd, prometheus, grafana, jaeger"
            return 1
            ;;
    esac
}

# Main execution
case "${1:-start}" in
    "start")
        start_port_forwards
        ;;
    "stop")
        stop_port_forwards
        ;;
    "status")
        check_status
        ;;
    "logs")
        show_logs "$2"
        ;;
    "restart")
        restart_service "$2"
        ;;
    *)
        echo "Usage: $0 {start|stop|status|logs <service>|restart <service>}"
        echo ""
        echo "Commands:"
        echo "  start           - Start all port forwards and show access info"
        echo "  stop            - Stop all port forwards"
        echo "  status          - Show service and port forward status"
        echo "  logs <service>  - Show logs for a specific service"
        echo "  restart <service> - Restart a specific service"
        echo ""
        echo "Services: argocd, prometheus, grafana, jaeger"
        exit 1
        ;;
esac