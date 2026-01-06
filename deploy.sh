#!/bin/bash

# Shambil Pride Academy - Deployment Script
echo "🚀 Starting deployment for Shambil Pride Academy Management System..."

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version check passed: $(node -v)"

# Install dependencies
print_status "Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install server dependencies"
    exit 1
fi

print_status "Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install client dependencies"
    exit 1
fi

# Build applications
print_status "Building client application..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build client application"
    exit 1
fi

print_status "Building server application..."
cd ../server
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build server application"
    exit 1
fi

# Copy database to dist folder
print_status "Copying database to production folder..."
if [ -d "database" ]; then
    cp -r database dist/ 2>/dev/null || xcopy database dist\\database /E /I 2>/dev/null
    print_success "Database copied successfully"
else
    print_warning "Database folder not found. Make sure to initialize the database."
fi

# Create production environment file if it doesn't exist
if [ ! -f ".env.production" ]; then
    print_status "Creating production environment file..."
    cp .env .env.production
    print_warning "Please update .env.production with production values before deploying"
fi

print_success "Build completed successfully!"
print_status "Deployment files are ready in:"
print_status "  - Client: client/build/"
print_status "  - Server: server/dist/"

echo ""
print_status "🌐 Deployment Options:"
echo "1. Vercel: Run 'vercel' in the project root"
echo "2. Heroku: Run 'git push heroku main'"
echo "3. Railway: Run 'railway up'"
echo "4. Manual: Copy files to your server"

echo ""
print_success "✅ Shambil Pride Academy Management System is ready for deployment!"
print_status "📚 Features included:"
echo "   - 30 Classes (KG to SS3 Science & Arts)"
echo "   - 37 Subjects (Complete Nigerian curriculum)"
echo "   - Enhanced messaging system"
echo "   - Class position calculation"
echo "   - Multi-role authentication"
echo "   - Results management"

cd ..