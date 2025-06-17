#!/bin/bash

echo "🚀 Setting up AI Character Creator Demo Environment"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Copy demo environment file
if [ ! -f .env ]; then
    cp .env.demo .env
    echo "✅ Demo environment file created (.env)"
else
    echo "⚠️  Environment file already exists. Using existing .env file."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Build the frontend
echo "🏗️  Building frontend..."
npm run build --silent

if [ $? -ne 0 ]; then
    echo "❌ Failed to build frontend"
    exit 1
fi

echo "✅ Frontend built successfully"

# Create demo data directory
mkdir -p demo-data
echo "✅ Demo data directory created"

# Set up demo database (if MongoDB is available)
if command -v mongod &> /dev/null; then
    echo "🗄️  Setting up demo database..."
    node scripts/setup-demo-data.js
    echo "✅ Demo database configured"
else
    echo "⚠️  MongoDB not found. Using in-memory database for demo."
fi

# Create demo user guide
cat > DEMO_GUIDE.md << 'EOF'
# 🎮 AI Character Creator Demo Guide

Welcome to the AI Character Creator demo! This is a fully functional version you can experiment with.

## 🚀 Getting Started

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Access the demo:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - AI Orchestrator: http://localhost:3001

## 🎯 Demo Features

### ✅ Available in Demo:
- Character creation (up to 5 per user)
- AI model selection and testing
- Image generation (mock/placeholder images)
- Basic dashboard and analytics
- Workflow automation
- Agent management

### 🔒 Limited in Demo:
- No real API keys needed (uses mock responses)
- Email features log to console instead of sending
- Payment processing is disabled
- Usage limits are enforced (50 API calls/hour)

## 🎲 Demo Accounts

The demo comes with pre-configured test accounts:

- **Regular User:** demo@example.com / demopass123
- **Admin User:** admin@example.com / adminpass123

## 💡 Experiment Ideas

1. **Create Characters:** Try different character types and personalities
2. **Test AI Models:** Switch between different AI providers (all mocked)
3. **Generate Images:** Experiment with different styles and prompts
4. **Explore Workflows:** Set up automated character generation pipelines
5. **View Analytics:** Check usage statistics and performance metrics

## 🔄 Reset Demo Data

To reset the demo to its initial state:
```bash
npm run demo:reset
```

## 🛠️ Development Mode

To modify and experiment with the code:
```bash
npm run dev
```

The application will auto-reload when you make changes.

## 📖 Documentation

- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture Overview](README.md)

## 🆘 Need Help?

Check the [GitHub Issues](https://github.com/your-username/ai-character-creator/issues) or create a new issue if you encounter problems.

Happy experimenting! 🎉
EOF

echo "✅ Demo guide created"

# Create demo reset script
cat > scripts/demo-reset.js << 'EOF'
#!/usr/bin/env node

import mongoose from 'mongoose';
import User from '../server/models/User.js';
import Character from '../server/models/Character.js';
import Usage from '../server/models/Usage.js';
import bcrypt from 'bcryptjs';

async function resetDemo() {
  try {
    console.log('🔄 Resetting demo database...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-character-creator-demo');
    
    // Clear existing data
    await User.deleteMany({});
    await Character.deleteMany({});
    await Usage.deleteMany({});
    
    // Create demo users
    const demoUsers = [
      {
        name: 'Demo User',
        email: 'demo@example.com',
        password: await bcrypt.hash('demopass123', 10),
        role: 'user',
        emailVerified: true,
        subscription: {
          plan: 'free',
          status: 'active'
        }
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('adminpass123', 10),
        role: 'admin',
        emailVerified: true,
        subscription: {
          plan: 'premium',
          status: 'active'
        }
      }
    ];
    
    await User.insertMany(demoUsers);
    
    console.log('✅ Demo data reset complete!');
    console.log('👤 Demo accounts:');
    console.log('   Regular: demo@example.com / demopass123');
    console.log('   Admin: admin@example.com / adminpass123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Demo reset failed:', error);
    process.exit(1);
  }
}

resetDemo();
EOF

chmod +x scripts/demo-reset.js
echo "✅ Demo reset script created"

# Update package.json with demo scripts
echo "📝 Adding demo scripts to package.json..."

# Create the demo scripts
npm pkg set scripts.demo="npm run dev"
npm pkg set scripts.demo:reset="node scripts/demo-reset.js"
npm pkg set scripts.demo:setup="./setup-demo.sh"

echo ""
echo "🎉 Demo setup complete!"
echo ""
echo "🚀 To start the demo:"
echo "   npm run demo"
echo ""
echo "🌐 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📖 Read DEMO_GUIDE.md for detailed instructions"
echo ""
echo "Happy experimenting! 🎮"
