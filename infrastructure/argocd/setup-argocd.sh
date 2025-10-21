#!/bin/bash

# ArgoCD Installation and Setup Script
# This script installs ArgoCD and configures the Cafe Management System project

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

# Install ArgoCD
install_argocd() {
    print_header "Installing ArgoCD"
    
    # Create namespace
    print_status "Creating argocd namespace..."
    kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
    
    # Install ArgoCD
    print_status "Installing ArgoCD components..."
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
    
    # Wait for ArgoCD to be ready
    print_status "Waiting for ArgoCD to be ready..."
    kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s
    kubectl wait --for=condition=available deployment/argocd-repo-server -n argocd --timeout=300s
    kubectl wait --for=condition=available deployment/argocd-dex-server -n argocd --timeout=300s
    
    print_status "ArgoCD installation completed"
}

# Configure ArgoCD access
configure_access() {
    print_header "Configuring ArgoCD Access"
    
    # Patch ArgoCD server for LoadBalancer (or NodePort for local testing)
    print_status "Configuring ArgoCD server service..."
    
    # For cloud environments, use LoadBalancer
    # For local development, use NodePort
    read -p "Are you running on a cloud environment with LoadBalancer support? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
        print_status "ArgoCD server configured with LoadBalancer"
        
        print_status "Waiting for LoadBalancer IP..."
        kubectl get svc argocd-server -n argocd -w --timeout=120s || true
    else
        kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
        print_status "ArgoCD server configured with NodePort"
        
        NODE_PORT=$(kubectl get svc argocd-server -n argocd -o jsonpath='{.spec.ports[0].nodePort}')
        print_status "ArgoCD UI available at: http://localhost:$NODE_PORT"
        print_warning "You may need to port-forward: kubectl port-forward svc/argocd-server -n argocd 8080:443"
    fi
}

# Get ArgoCD admin password
get_admin_password() {
    print_header "Getting ArgoCD Admin Credentials"
    
    print_status "Username: admin"
    
    # Get the initial admin password
    ADMIN_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
    
    if [ -n "$ADMIN_PASSWORD" ]; then
        print_status "Initial admin password: $ADMIN_PASSWORD"
        echo "$ADMIN_PASSWORD" > argocd-admin-password.txt
        print_warning "Password saved to argocd-admin-password.txt (delete this file after changing password)"
    else
        print_error "Failed to retrieve admin password"
    fi
}

# Setup project and applications
setup_project() {
    print_header "Setting up Cafe Management Project"
    
    print_status "Creating ArgoCD project..."
    kubectl apply -f project.yaml
    
    print_status "Creating ArgoCD applications..."
    kubectl apply -f applications.yaml
    
    print_status "Project and applications configured"
}

# Install ArgoCD CLI (optional)
install_argocd_cli() {
    print_header "Installing ArgoCD CLI"
    
    read -p "Do you want to install ArgoCD CLI? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Detect OS
        OS=$(uname -s | tr '[:upper:]' '[:lower:]')
        ARCH=$(uname -m)
        
        case $ARCH in
            x86_64) ARCH="amd64" ;;
            aarch64) ARCH="arm64" ;;
            armv7l) ARCH="arm" ;;
        esac
        
        print_status "Downloading ArgoCD CLI for $OS-$ARCH..."
        
        # Download and install ArgoCD CLI
        curl -sSL -o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-$OS-$ARCH
        chmod +x argocd
        
        # Move to PATH (requires sudo)
        if command -v sudo &> /dev/null; then
            sudo mv argocd /usr/local/bin/
            print_status "ArgoCD CLI installed to /usr/local/bin/argocd"
        else
            print_warning "Please move './argocd' to a directory in your PATH manually"
        fi
    else
        print_status "Skipping ArgoCD CLI installation"
    fi
}

# Show status and next steps
show_status() {
    print_header "Installation Summary"
    
    print_status "ArgoCD Status:"
    kubectl get pods -n argocd
    
    echo ""
    print_status "ArgoCD Service:"
    kubectl get svc argocd-server -n argocd
    
    echo ""
    print_status "Applications:"
    kubectl get applications -n argocd
    
    echo ""
    print_header "Next Steps"
    echo "1. Access ArgoCD UI using the service endpoint"
    echo "2. Login with admin credentials (check argocd-admin-password.txt)"
    echo "3. Change the default admin password"
    echo "4. Configure your Git repository credentials if using private repos"
    echo "5. Sync the applications to deploy your services"
    echo ""
    echo "Useful commands:"
    echo "  kubectl port-forward svc/argocd-server -n argocd 8080:443"
    echo "  argocd login localhost:8080"
    echo "  argocd app sync cafe-management-infrastructure"
    echo "  argocd app sync cafe-management-services"
}

# Cleanup function
cleanup() {
    print_header "Cleaning up ArgoCD"
    
    print_status "Deleting applications..."
    kubectl delete -f applications.yaml --ignore-not-found=true
    
    print_status "Deleting project..."
    kubectl delete -f project.yaml --ignore-not-found=true
    
    print_status "Deleting ArgoCD..."
    kubectl delete namespace argocd --ignore-not-found=true
    
    print_status "Cleanup completed"
}

# Main execution
case "${1:-install}" in
    "install")
        check_prerequisites
        install_argocd
        configure_access
        get_admin_password
        setup_project
        install_argocd_cli
        show_status
        ;;
    "status")
        show_status
        ;;
    "password")
        get_admin_password
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        echo "Usage: $0 {install|status|password|cleanup}"
        echo ""
        echo "Commands:"
        echo "  install  - Install and configure ArgoCD with Cafe Management project"
        echo "  status   - Show current status of ArgoCD and applications"
        echo "  password - Get ArgoCD admin password"
        echo "  cleanup  - Remove ArgoCD and all configurations"
        exit 1
        ;;
esac