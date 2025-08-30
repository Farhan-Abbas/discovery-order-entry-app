#!/bin/bash

# Order Entry App - Docker Management Script

set -e

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

# Check if docker-compose is available
check_docker() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose is not installed or not in PATH"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running"
        exit 1
    fi
}

# Show usage
show_usage() {
    echo "Order Entry App - Docker Management"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Start all services (build if needed)"
    echo "  stop      - Stop all services"
    echo "  restart   - Restart all services"
    echo "  build     - Build all services"
    echo "  logs      - Show logs from all services"
    echo "  status    - Show status of all services"
    echo "  reset     - Reset all data and rebuild"
    echo "  clean     - Clean up containers and volumes"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs backend"
    echo "  $0 status"
}

# Start services
start_services() {
    print_status "Starting Order Entry App..."
    
    # Copy environment file if it doesn't exist
    if [ ! -f .env ]; then
        print_warning ".env file not found, copying from .env.example"
        cp .env.example .env
    fi
    
    # Start services
    print_status "Building and starting containers..."
    docker-compose up --build -d
    
    print_success "Services started successfully!"
    print_status "Frontend: http://localhost"
    print_status "Backend API: http://localhost:8000"
    print_status "Database: localhost:5432"
    
    # Show status
    echo ""
    docker-compose ps
}

# Stop services
stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    print_success "All services stopped"
}

# Restart services
restart_services() {
    print_status "Restarting services..."
    docker-compose restart
    print_success "Services restarted"
}

# Build services
build_services() {
    print_status "Building all services..."
    docker-compose build --no-cache
    print_success "Build completed"
}

# Show logs
show_logs() {
    if [ -z "$2" ]; then
        print_status "Showing logs from all services..."
        docker-compose logs -f
    else
        print_status "Showing logs from $2..."
        docker-compose logs -f "$2"
    fi
}

# Show status
show_status() {
    print_status "Service status:"
    docker-compose ps
    
    echo ""
    print_status "Health checks:"
    docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
}

# Reset everything
reset_services() {
    print_warning "This will remove all containers, volumes, and data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting all services..."
        docker-compose down -v --remove-orphans
        docker-compose build --no-cache
        docker-compose up -d
        print_success "Services reset and restarted"
    else
        print_status "Reset cancelled"
    fi
}

# Clean up
clean_services() {
    print_warning "This will remove all containers and unused images!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_success "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Main script
main() {
    check_docker
    
    case "${1:-}" in
        "start")
            start_services
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "build")
            build_services
            ;;
        "logs")
            show_logs "$@"
            ;;
        "status")
            show_status
            ;;
        "reset")
            reset_services
            ;;
        "clean")
            clean_services
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        "")
            show_usage
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
