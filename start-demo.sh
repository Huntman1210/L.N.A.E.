#!/bin/bash

echo "🎮 Starting AI Character Creator Demo"
echo "===================================="

# Check if build exists
if [ ! -d "build" ]; then
    echo "📦 Building frontend first..."
    npm run build
fi

echo "🗄️  Starting demo database setup..."
if command -v mongod &> /dev/null; then
    # Start MongoDB in background if not running
    if ! pgrep -x "mongod" > /dev/null; then
        echo "🚀 Starting MongoDB..."
        mongod --fork --logpath /tmp/mongodb.log --dbpath /tmp/mongodb-data || echo "⚠️  Using existing MongoDB instance"
    fi
    
    # Set up demo data
    node scripts/setup-demo-data.js || echo "⚠️  Demo data setup skipped (database might be running)"
else
    echo "⚠️  MongoDB not found. Using mock mode."
    export MOCK_MODE=true
fi

echo ""
echo "🌐 Demo will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "👤 Demo accounts:"
echo "   Free:  demo@example.com / demopass123"
echo "   Pro:   pro@example.com / propass123"
echo "   Admin: admin@example.com / adminpass123"
echo ""
echo "🚀 Starting servers..."

# Start both frontend and backend
npm run dev
