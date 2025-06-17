# 🎭 AI Character Creator - SaaS Platform

## Overview

The AI Character Creator is a comprehensive SaaS platform that enables users to create, manage, and monetize AI-generated characters. Built with React, Node.js, and MongoDB, it features subscription management, user authentication, usage analytics, and a modern dashboard interface.

## ✨ Features

### 🚀 SaaS Platform Features
- **User Authentication** - Secure JWT-based auth with email verification
- **Subscription Management** - Stripe integration with multiple pricing tiers
- **Usage Analytics** - Comprehensive tracking and reporting
- **User Dashboard** - Modern, responsive interface
- **Profile Management** - User settings and preferences
- **Email Notifications** - Automated communications via SendGrid

### 🎯 Character Creation
- **AI-Powered Generation** - Create detailed character profiles
- **Multiple Output Formats** - Export in various formats
- **Image Generation** - AI-generated character artwork
- **Template System** - Customizable character templates
- **Batch Processing** - Create multiple characters at once

### 🤖 Multi-Model AI Support
- **OpenAI GPT-4** - Advanced reasoning and creativity
- **Anthropic Claude 3** - Nuanced analysis and writing
- **Google Gemini Pro** - Multimodal capabilities
- **Mistral AI** - Fast and efficient processing
- **Ollama Models** - Local model support (Llama 2, Code Llama, Mistral)
- **Social Media Manager** - Generates viral content

### 🧠 Development Modes System
- **Tiered Architecture** - Four tiers of development modes for different expertise levels
- **Specialized Skills** - Modes for core development, frontend, backend, and AI/ML tasks
- **Intelligent Assistance** - Custom AI agents with specialized knowledge domains
- **Mode Switching** - Seamlessly switch between different development contexts
- **Analytics Integration** - Track mode usage and performance metrics
- **Project Manager** - Coordinates complex workflows
- **QA Specialist** - Ensures quality and testing

### ⚡ Automated Workflows
- **Character Creation** - Generate detailed characters with backstories
- **Website Generation** - Create complete React websites
- **App Development** - Build full-stack applications
- **Game Creation** - Design and implement games with 3D graphics
- **Social Media Automation** - Generate content for multiple platforms
- **Multi-Agent Collaboration** - Orchestrate teams of AI agents

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API keys for desired AI services

### Installation

1. **Clone and Setup**
   ```bash
   cd /home/jaymes/ai-character-creator
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Initialize the System**
   ```bash
   npm run setup-ai
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

The application will start on `http://localhost:3000` with the AI orchestrator on `http://localhost:3001`.

## 🔧 Configuration

### Required API Keys
Add these to your `.env` file:

```env
# Core AI Models
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
GOOGLE_API_KEY=your_google_gemini_key_here
MISTRAL_API_KEY=your_mistral_key_here

# Optional: Azure OpenAI
AZURE_OPENAI_API_KEY=your_azure_key_here
AZURE_OPENAI_ENDPOINT=your_azure_endpoint_here

# Optional: Social Media APIs
TWITTER_API_KEY=your_twitter_key_here
INSTAGRAM_ACCESS_TOKEN=your_instagram_token_here
```

### Local Models (Ollama)
Install Ollama for local model support:
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull models
ollama pull llama2
ollama pull codellama
ollama pull mistral
```

## 📱 VS Code Extensions Setup

This project works optimally with these VS Code AI assistants:

### ✅ Recommended (Keep Active)
- **GitHub Copilot** - Code completion and suggestions
- **Roo Code Agent** - AI-powered development assistance  
- **Kilo Code Agent** - Advanced code generation

### ❌ Remove These Extensions
The setup script will help remove conflicting extensions:
- Tabnine
- Codeium
- Continue
- Other AI assistant extensions

Run: `npm run setup-ai` to automatically manage extensions.

## 🎯 Usage

### Character Creation
```bash
# Via UI
Open http://localhost:3000 → Character Creator tab

# Via CLI
npm run generate-character
```

### Website Generation
```bash
# Via CLI
npm run generate-website

# Via API
curl -X POST http://localhost:3001/api/workflows/website \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a portfolio website for a photographer"}'
```

### App Development
```bash
npm run generate-app
```

### Game Creation
```bash
npm run generate-game
```

### Social Media Content
```bash
npm run social-automation
```

## 🔌 API Endpoints

### Models
- `GET /api/models` - Get model status
- `POST /api/models/generate` - Generate with specific model
- `POST /api/models/switch` - Switch active model

### Agents  
- `GET /api/agents` - Get agent status
- `POST /api/agents/invoke` - Invoke specific agent

### Workflows
- `POST /api/workflows/character` - Generate character
- `POST /api/workflows/website` - Generate website
- `POST /api/workflows/app` - Generate application
- `POST /api/workflows/game` - Generate game
- `POST /api/workflows/social` - Generate social content

## 🏗️ Architecture

```
ai-character-creator/
├── src/                          # React frontend
│   ├── components/               # UI components
│   ├── App.js                   # Main application
│   └── index.js                 # Entry point
├── automation/                   # AI automation system
│   ├── models/                  # Multi-model orchestration
│   ├── agents/                  # AI agent definitions
│   ├── workflows/               # Automation workflows
│   └── orchestrator.js          # Main orchestrator
├── generated/                    # Generated content
│   ├── websites/                # Generated websites
│   ├── apps/                    # Generated applications
│   ├── games/                   # Generated games
│   ├── social/                  # Social media content
│   └── characters/              # Character profiles
└── public/                      # Static assets
```

## 🧪 Testing

### Test All Models
```bash
npm run test-models
```

### Run System Tests
```bash
npm test
```

### Check System Health
```bash
curl http://localhost:3001/health
```

## 🤝 Multi-Agent Workflows

The system supports complex multi-agent collaborations:

```javascript
// Example: Website creation with multiple agents
const result = await agentOrchestrator.generateWebsiteWithTeam(
  "Create a modern e-commerce website for handmade jewelry"
);

// Agents automatically collaborate:
// 1. Project Manager - Plans the project
// 2. UI Designer - Creates design specifications  
// 3. Code Generator - Implements the website
// 4. QA Specialist - Reviews and tests
```

## 🔄 Workflow Automation

### Full Pipeline Example
```bash
# Generate complete project with all assets
node automation/workflows/automation.js \
  --type="full-project" \
  --description="Social media management app" \
  --include="website,app,social-content"
```

### Custom Workflows
Create custom automation workflows:

```javascript
import { AutomationWorkflows } from './automation/workflows/automation.js';

const workflows = new AutomationWorkflows();

// Custom workflow
const result = await workflows.runAutomationPipeline(
  "Create a gaming community platform",
  "custom",
  {
    includeGameFeatures: true,
    socialIntegration: true,
    realtimeChat: true
  }
);
```

## 📊 Monitoring and Analytics

The system provides real-time monitoring:

- **Model Performance** - Response times, success rates
- **Agent Activity** - Task completion, collaboration metrics  
- **Workflow Status** - Progress tracking, resource usage
- **Real-time Updates** - WebSocket-based live updates

## 🛠️ Development

### Adding New Models
```javascript
// In automation/models/orchestrator.js
models['new-model'] = new CustomModel({
  apiKey: process.env.NEW_MODEL_API_KEY,
  // configuration
});
```

### Creating Custom Agents
```javascript
// In automation/agents/orchestrator.js
this.agents.customAgent = {
  name: 'Custom Agent',
  role: 'custom_role', 
  specialty: 'Custom task specialization',
  model: 'preferred-model',
  prompt: 'Custom agent prompt...'
};
```

### Building New Workflows
```javascript
// In automation/workflows/automation.js
async generateCustomContent(prompt, options = {}) {
  // Custom workflow implementation
  const result = await this.agentOrchestrator.invokeAgent(
    'customAgent', 
    prompt, 
    options
  );
  return result;
}
```

## 📈 Performance Optimization

### Model Selection Strategy
- **GPT-4** - Complex reasoning, creative tasks
- **Claude 3** - Long-form content, analysis  
- **Gemini Pro** - Multimodal tasks, balanced performance
- **Mistral** - Fast responses, production workloads
- **Local Models** - Privacy-sensitive, offline capability

### Caching and Optimization
- Response caching for repeated queries
- Model switching based on task requirements
- Parallel agent execution for complex workflows
- Resource usage monitoring and optimization

## 🚨 Troubleshooting

### Common Issues

**Models not responding:**
```bash
npm run test-models  # Check model connectivity
```

**API key errors:**
```bash
# Verify .env configuration
cat .env | grep API_KEY
```

**Port conflicts:**
```bash
# Change ports in .env
AI_ORCHESTRATOR_PORT=3002
PORT=3001
```

**Extension conflicts:**
```bash
# Remove conflicting VS Code extensions
code --uninstall-extension tabnine.tabnine-vscode
code --uninstall-extension codeium.codeium
```

## 🤖 AI Assistant Integration

### GitHub Copilot Integration
The system is optimized for GitHub Copilot, providing:
- Context-aware code suggestions
- Integration with generated workflows
- Seamless development experience

### Roo & Kilo Code Agents
These agents provide:
- Advanced code generation
- Project-level understanding
- Multi-file refactoring capabilities

## 📚 Examples

### Generate a Complete Gaming Website
```bash
node automation/workflows/website-generator.js
# Enter: "Gaming community website with user profiles, game reviews, and forums"
```

### Create a Character-Based Mobile Game
```bash
node automation/workflows/game-generator.js  
# Enter: "2D platformer game with custom characters and power-ups"
```

### Social Media Campaign
```bash
node automation/workflows/social-automation.js
# Enter: "Launch campaign for new AI tool" 
# Platforms: "twitter,linkedin,instagram"
```

## 🔐 Security

- API keys stored securely in environment variables
- No sensitive data in generated content
- Local model support for privacy-sensitive tasks
- Rate limiting and usage monitoring

## 📝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT models
- Anthropic for Claude
- Google for Gemini
- Mistral AI for Mistral models
- Meta for Llama models
- The open-source community

## 🆘 Support

For support and questions:
- Check the [troubleshooting section](#-troubleshooting)
- Run `npm run test-models` for diagnostics
- Review logs in the console output

---

**Built with ❤️ for the AI automation community**

🚀 **Ready to automate your development workflow with AI?** 

Run `npm run setup-ai` and start creating!
