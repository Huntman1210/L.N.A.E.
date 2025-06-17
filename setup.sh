#!/bin/bash

echo "🚀 Setting up AI Character Creator SaaS Application"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "Run: sudo systemctl start mongod"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your actual configuration values"
fi

# Create uploads directory
mkdir -p uploads/characters
mkdir -p uploads/images

# Set up MongoDB collections
echo "🗄️  Setting up database..."
node -e "
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-character-creator')
  .then(() => {
    console.log('✅ Database connected');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });
"

# Build the frontend
echo "🏗️  Building frontend..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   1. Update your .env file with proper configuration"
echo "   2. Run 'npm run setup-stripe' to create subscription plans"
echo "   3. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "📚 Available scripts:"
echo "   npm run dev          - Start development servers"
echo "   npm run setup-stripe - Set up Stripe subscription plans"
echo "   npm start           - Start frontend only"
echo "   npm run server      - Start backend only"
