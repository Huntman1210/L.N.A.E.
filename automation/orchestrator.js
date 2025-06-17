#!/usr/bin/env node

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { MultiModelOrchestrator } from './models/orchestrator.js';
import { AgentOrchestrator } from './agents/orchestrator.js';
import { AutomationWorkflows } from './workflows/automation.js';
import { ImageOrchestrator } from './models/image-orchestrator.js';
import { PromptEnhancementService } from './services/prompt-enhancement.js';

dotenv.config();

class MainOrchestrator {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    
    this.port = process.env.AI_ORCHESTRATOR_PORT || 3001;
    this.modelOrchestrator = new MultiModelOrchestrator();
    this.agentOrchestrator = new AgentOrchestrator();
    this.workflowManager = new AutomationWorkflows();
    this.imageOrchestrator = new ImageOrchestrator();
    this.promptEnhancer = new PromptEnhancementService();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        models: this.modelOrchestrator.getModelStatus(),
        agents: this.agentOrchestrator.getAgentStatus(),
        workflows: this.workflowManager.getWorkflowStatus()
      });
    });

    // Model routes
    this.app.get('/api/models', (req, res) => {
      res.json(this.modelOrchestrator.getModelStatus());
    });

    this.app.post('/api/models/generate', async (req, res) => {
      try {
        const { prompt, model, context } = req.body;
        const result = await this.modelOrchestrator.generateResponse(prompt, model, context);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/models/switch', (req, res) => {
      try {
        const { model } = req.body;
        const success = this.modelOrchestrator.setCurrentModel(model);
        res.json({ success, currentModel: model });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Agent routes
    this.app.get('/api/agents', (req, res) => {
      res.json({
        status: this.agentOrchestrator.getAgentStatus(),
        agents: this.agentOrchestrator.getAllAgents()
      });
    });

    this.app.post('/api/agents/invoke', async (req, res) => {
      try {
        const { agentRole, task, context } = req.body;
        const result = await this.agentOrchestrator.invokeAgent(agentRole, task, context);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/agents/conversation', async (req, res) => {
      try {
        const { conversationId, participants, initialTask } = req.body;
        const result = await this.agentOrchestrator.startConversation(conversationId, participants, initialTask);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Workflow routes
    this.app.get('/api/workflows', (req, res) => {
      res.json(this.workflowManager.getWorkflowStatus());
    });

    this.app.post('/api/workflows/character', async (req, res) => {
      try {
        const { prompt, options } = req.body;
        const result = await this.workflowManager.generateCharacter(prompt, options);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/workflows/website', async (req, res) => {
      try {
        const { prompt, options } = req.body;
        const result = await this.workflowManager.generateWebsite(prompt, options);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/workflows/app', async (req, res) => {
      try {
        const { prompt, options } = req.body;
        const result = await this.workflowManager.generateApp(prompt, options);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/workflows/game', async (req, res) => {
      try {
        const { prompt, options } = req.body;
        const result = await this.workflowManager.generateGame(prompt, options);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/workflows/social', async (req, res) => {
      try {
        const { prompt, platforms, options } = req.body;
        const result = await this.workflowManager.generateSocialContent(prompt, platforms, options);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Image generation routes
    this.app.get('/api/images/providers', (req, res) => {
      res.json(this.imageOrchestrator.getProviderStatus());
    });

    this.app.post('/api/images/generate', async (req, res) => {
      try {
        const { prompt, options } = req.body;
        const result = await this.imageOrchestrator.generateImage(prompt, options);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/images/enhance-prompt', async (req, res) => {
      try {
        const { prompt, options } = req.body;
        const result = await this.promptEnhancer.enhancePrompt(prompt, options);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/images/variations', async (req, res) => {
      try {
        const { imageUrl, options } = req.body;
        const result = await this.imageOrchestrator.generateVariations(imageUrl, options);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/images/history', (req, res) => {
      try {
        const { userId, limit } = req.query;
        const history = this.imageOrchestrator.getGenerationHistory(userId, parseInt(limit) || 50);
        res.json({ history });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/images/styles', (req, res) => {
      res.json(this.promptEnhancer.getAvailableStyles());
    });

    this.app.post('/api/images/suggest-styles', async (req, res) => {
      try {
        const { prompt } = req.body;
        const suggestions = await this.promptEnhancer.suggestStyles(prompt);
        res.json({ suggestions });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.get('/api/images/stats', (req, res) => {
      res.json(this.imageOrchestrator.getStats());
    });

    this.app.get('/api/images/gpu-info', async (req, res) => {
      try {
        const gpuInfo = await this.imageOrchestrator.detectGPUCapabilities();
        res.json(gpuInfo);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    this.app.post('/api/images/check-providers', async (req, res) => {
      try {
        await this.imageOrchestrator.checkProviderAvailability();
        const providers = this.imageOrchestrator.getProviderStatus();
        res.json({ providers });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Send initial status
      socket.emit('status', {
        models: this.modelOrchestrator.getModelStatus(),
        agents: this.agentOrchestrator.getAgentStatus(),
        workflows: this.workflowManager.getWorkflowStatus()
      });

      // Handle model switching
      socket.on('switchModel', (model) => {
        const success = this.modelOrchestrator.setCurrentModel(model);
        this.io.emit('modelSwitched', { model, success });
      });

      // Handle agent invocation
      socket.on('invokeAgent', async (data) => {
        try {
          const result = await this.agentOrchestrator.invokeAgent(data.agentRole, data.task, data.context);
          socket.emit('agentResponse', result);
        } catch (error) {
          socket.emit('agentError', { error: error.message });
        }
      });

      // Handle workflow execution
      socket.on('startWorkflow', async (data) => {
        try {
          const result = await this.workflowManager.runAutomationPipeline(data.task, data.type, data.options);
          socket.emit('workflowComplete', result);
        } catch (error) {
          socket.emit('workflowError', { error: error.message });
        }
      });

      // Handle image generation
      socket.on('generateImage', async (data) => {
        try {
          const result = await this.imageOrchestrator.generateImage(data.prompt, data.options);
          socket.emit('imageGenerated', result);
        } catch (error) {
          socket.emit('imageGenerationError', { error: error.message });
        }
      });

      // Handle prompt enhancement
      socket.on('enhancePrompt', async (data) => {
        try {
          const result = await this.promptEnhancer.enhancePrompt(data.prompt, data.options);
          socket.emit('promptEnhanced', result);
        } catch (error) {
          socket.emit('promptEnhancementError', { error: error.message });
        }
      });

      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
      });
    });

    // Listen for agent events
    this.agentOrchestrator.on('agentResponse', (data) => {
      this.io.emit('agentActivity', data);
    });

    // Listen for image generation events
    this.imageOrchestrator.on('generationStart', (data) => {
      this.io.emit('imageGenerationStart', data);
    });

    this.imageOrchestrator.on('generationComplete', (data) => {
      this.io.emit('imageGenerationComplete', data);
    });

    this.imageOrchestrator.on('generationError', (data) => {
      this.io.emit('imageGenerationError', data);
    });

    // Listen for prompt enhancement events
    this.promptEnhancer.on('promptEnhanced', (data) => {
      this.io.emit('promptEnhancementComplete', data);
    });
  }

  async start() {
    try {
      console.log('🚀 Starting AI Character Creator Orchestrator...\n');
      
      // Initialize all systems
      console.log('🤖 Initializing AI systems...');
      
      // Initialize model orchestrator
      await this.modelOrchestrator.initialize();
      const modelStatus = this.modelOrchestrator.getModelStatus();
      console.log(`✅ Models ready: ${modelStatus.availableModels.length} available`);
      
      // Initialize agent orchestrator
      const agentStatus = this.agentOrchestrator.getAgentStatus();
      console.log(`✅ Agents ready: ${agentStatus.totalAgents} available`);
      
      // Initialize workflow manager
      const workflowStatus = this.workflowManager.getWorkflowStatus();
      console.log(`✅ Workflows ready: ${workflowStatus.availableWorkflows.length} available`);
      
      // Check image orchestrator
      const imageStatus = await this.imageOrchestrator.checkProviderAvailability();
      console.log(`✅ Image providers ready: ${Object.keys(this.imageOrchestrator.providers).length} available`);

      // Start server
      this.server.listen(this.port, () => {
        console.log(`\n🌐 AI Orchestrator running on http://localhost:${this.port}`);
        console.log('📡 WebSocket server ready for real-time communication');
        console.log('\n🎯 Available endpoints:');
        console.log('   GET  /health - System health check');
        console.log('   GET  /api/models - Model status');
        console.log('   POST /api/models/generate - Generate with specific model');
        console.log('   GET  /api/agents - Agent status');
        console.log('   POST /api/agents/invoke - Invoke specific agent');
        console.log('   GET  /api/workflows - Workflow status');
        console.log('   POST /api/workflows/character - Generate character');
        console.log('   POST /api/workflows/website - Generate website');
        console.log('   POST /api/workflows/app - Generate app');
        console.log('   POST /api/workflows/game - Generate game');
        console.log('   POST /api/workflows/social - Generate social content');
        console.log('\n✨ System ready for AI automation!');
      });

    } catch (error) {
      console.error('❌ Failed to start orchestrator:', error.message);
      process.exit(1);
    }
  }
}

// Start the orchestrator if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const orchestrator = new MainOrchestrator();
  orchestrator.start().catch(console.error);
}

export default MainOrchestrator;
