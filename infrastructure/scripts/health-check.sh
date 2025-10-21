#!/bin/bash

echo "Checking system health and status..."
echo "======================================"

# Function to check Docker Compose environment
check_docker_compose() {
    echo ""
    echo "Docker Compose Environment:"
    echo "------------------------------"
    
    cd "$(dirname "$0")/../docker-compose"
    
    if docker-compose -f docker-compose.microservices.yml ps | grep -q "Up"; then
        echo "Docker Compose services are running"
        
        # Check service health
        echo ""
        echo "Service Health Check:"
        services=(3000 3001 3002 3003 3004 3005 3006 3007 3008 3009)
        healthy=0
        
        for port in "${services[@]}"; do
            if curl -s --max-time 3 "http://localhost:$port/health" > /dev/null 2>&1; then
                echo "Port $port: Healthy"
                ((healthy++))
            else
                echo "Port $port: Not responding"
            fi
        done
        
        echo "Health Summary: $healthy/10 services healthy"
        
        # Check resource usage
        echo ""
        echo "Resource Usage:"
        docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -11
        
    else
        echo "No Docker Compose services are running"
        echo "   To start: ./setup-dev.sh"
    fi
}

# Function to check Kubernetes environment
check_kubernetes() {
    echo ""
    echo "Kubernetes Environment:"
    echo "--------------------------"
    
    if command -v kubectl &> /dev/null && kubectl cluster-info > /dev/null 2>&1; then
        echo "Connected to Kubernetes cluster"
        
        # Check deployments
        echo ""
        echo "Deployment Status:"
        kubectl get deployments --no-headers 2>/dev/null | while read line; do
            name=$(echo $line | awk '{print $1}')
            ready=$(echo $line | awk '{print $2}')
            if [[ "$ready" == *"/"* ]]; then
                current=$(echo $ready | cut -d'/' -f1)
                desired=$(echo $ready | cut -d'/' -f2)
                if [ "$current" = "$desired" ] && [ "$current" != "0" ]; then
                    echo "$name: $ready"
                else
                    echo "$name: $ready"
                fi
            fi
        done
        
        # Check pods
        echo ""
        echo "Pod Status:"
        kubectl get pods --no-headers 2>/dev/null | while read line; do
            name=$(echo $line | awk '{print $1}')
            status=$(echo $line | awk '{print $3}')
            if [ "$status" = "Running" ]; then
                echo "$name: $status"
            else
                echo "$name: $status"
            fi
        done
        
        # Check resource usage
        echo ""
        echo "Resource Usage:"
        kubectl top pods 2>/dev/null || echo "Metrics server not available"
        
    else
        echo "Kubernetes not available or not configured"
        echo "   kubectl not found or cluster not reachable"
    fi
}

# Main execution
echo "System Information:"
echo "OS: $(uname -s)"
echo "Date: $(date)"
echo "User: $(whoami)"

check_docker_compose
check_kubernetes

echo ""
echo "Infrastructure Tools Status:"
echo "--------------------------------"
command -v docker >/dev/null 2>&1 && echo "Docker: $(docker --version)" || echo "Docker: Not installed"
command -v kubectl >/dev/null 2>&1 && echo "kubectl: $(kubectl version --client --short 2>/dev/null)" || echo "kubectl: Not installed"
command -v helm >/dev/null 2>&1 && echo "Helm: $(helm version --short 2>/dev/null)" || echo "Helm: Not installed"

echo ""
echo "Quick Actions:"
echo "----------------"
echo "Start development:  ./setup-dev.sh"
echo "Start production:   ./setup-prod.sh" 
echo "Check logs:         ./check-logs.sh"
echo "Monitor services:   ./monitor.sh"