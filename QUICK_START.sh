#!/bin/bash

echo "========================================="
echo "Girumdom Quick Start Script"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}Error: MySQL is not installed${NC}"
    echo "Please install MySQL from https://www.mysql.com/downloads/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node --version)${NC}"
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"
echo -e "${GREEN}✓ MySQL found${NC}"
echo ""

# Check if .env exists in Backend
if [ ! -f "Backend/.env" ]; then
    echo -e "${YELLOW}Warning: Backend/.env not found${NC}"
    echo "Creating .env from .env.example..."
    if [ -f "Backend/.env.example" ]; then
        cp Backend/.env.example Backend/.env
        echo -e "${GREEN}✓ Created Backend/.env${NC}"
        echo -e "${RED}IMPORTANT: Please edit Backend/.env with your database credentials!${NC}"
        read -p "Press Enter to continue after editing Backend/.env..."
    else
        echo -e "${RED}Error: Backend/.env.example not found${NC}"
        exit 1
    fi
fi

# Backend setup
echo ""
echo "========================================="
echo "Setting up Backend..."
echo "========================================="
cd Backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    else
        echo -e "${RED}Error: Failed to install backend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

# Database setup
echo ""
echo "Setting up database..."
read -p "Have you created the 'girumdom' database and imported the schema? (y/n): " db_ready

if [ "$db_ready" != "y" ]; then
    echo ""
    echo "Please run these commands in MySQL:"
    echo "  CREATE DATABASE girumdom;"
    echo "  USE girumdom;"
    echo "  source $(pwd)/girumdom_db.sql;"
    echo ""
    read -p "Press Enter after completing database setup..."
fi

# Start backend
echo ""
echo -e "${GREEN}Starting Backend server...${NC}"
node server.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
sleep 3

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Backend server started on http://localhost:3000${NC}"
else
    echo -e "${RED}Error: Backend failed to start${NC}"
    echo "Check the error messages above and verify your .env configuration"
    exit 1
fi

# Frontend setup
cd ../frontend
echo ""
echo "========================================="
echo "Setting up Frontend..."
echo "========================================="

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    else
        echo -e "${RED}Error: Failed to install frontend dependencies${NC}"
        kill $BACKEND_PID
        exit 1
    fi
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

# Start frontend
echo ""
echo -e "${GREEN}Starting Frontend development server...${NC}"
npm start &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "========================================="
echo "Girumdom is starting up!"
echo "========================================="
echo ""
echo -e "${GREEN}Backend:${NC}  http://localhost:3000"
echo -e "${GREEN}Frontend:${NC} http://localhost:3001 (or next available port)"
echo ""
echo "Your browser should open automatically."
echo ""
echo -e "${YELLOW}To stop the servers:${NC}"
echo "  Press Ctrl+C in this terminal"
echo ""
echo -e "${YELLOW}Manual stop:${NC}"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "========================================="
echo "Happy memory making!"
echo "========================================="

# Wait for user to stop
wait
