#!/bin/bash

# Email Sender API - Docker Deployment Script
# Usage: ./deploy.sh

set -e

echo "Starting deployment..."
# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if we're in the right directory
check_directory() {
    if [ ! -f "package.json" ] || [ ! -f "server.js" ]; then
        print_error "This doesn't appear to be the email-sender project directory."
        print_error "Please run this script from the project root."
        exit 1
    fi
}

# Setup environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_warning "Created .env from template."
            print_warning "Please edit .env with your production Resend API key and email settings before continuing."
            read -p "Press Enter after you've configured .env..."
        else
            print_error ".env.example not found!"
            exit 1
        fi
    else
        print_status ".env already exists"
    fi
}

# Validate environment file
validate_environment() {
    print_status "Validating environment configuration..."
    
    required_vars=("RESEND_API_KEY" "FROM_EMAIL")
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env || grep -q "^${var}=$" .env || grep -q "^${var}=your-" .env || grep -q "^${var}=re_xxxxx" .env; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        print_error "Missing or incomplete required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_warning "Please edit .env and set these variables."
        exit 1
    fi
    
    print_success "Environment validation passed!"
}

# Deploy with Docker
deploy_docker() {
    print_status "Deploying with Docker..."
    
    # Check if Docker is installed
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Create logs directory
    mkdir -p logs
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose down 2>/dev/null || true
    
    # Build and start
    print_status "Building and starting containers..."
    docker-compose up -d --build
    
    # Wait for health check
    print_status "Waiting for application to be healthy..."
    sleep 10
    
    max_attempts=12
    attempt=1
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s http://localhost:3000/health >/dev/null 2>&1; then
            print_success "Application is healthy!"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Health check failed after $max_attempts attempts"
            print_status "Checking logs..."
            docker-compose logs --tail=20
            exit 1
        fi
        
        print_status "Attempt $attempt/$max_attempts - waiting..."
        sleep 5
        ((attempt++))
    done
    
    print_success "Docker deployment completed!"
    docker-compose ps
}

# Show deployment info
show_info() {
    print_success "Deployment completed successfully!"
    echo
    echo "📋 Application Information:"
    echo "  🌐 Local URL: http://localhost:3000"
    echo "  ❤️  Health Check: http://localhost:3000/health"
    echo "  📧 Send Email: POST http://localhost:3000/api/send-email"
    echo
    
    # Get server IP
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "YOUR_SERVER_IP")
    echo "🌍 External URLs:"
    echo "  🌐 API: http://$SERVER_IP:3000"
    echo "  ❤️  Health: http://$SERVER_IP:3000/health"
    echo
    
    echo "🔧 Docker Management Commands:"
    echo "  📊 Status: docker-compose ps"
    echo "  📋 Logs: docker-compose logs -f"
    echo "  🔄 Restart: docker-compose restart"
    echo "  ⏹️  Stop: docker-compose down"
    echo "  � Rebuild: docker-compose up -d --build"
    
    echo
    print_success "Email Sender API is ready for production use!"
}

sudo chown -R 1001:1001 logs

# Main function
main() {
    echo "🚀 Email Sender API - Docker Deployment"
    echo "======================================="
    echo
    
    check_directory
    setup_environment
    validate_environment
    deploy_docker
    show_info
}

# Run main function
main "$@"
