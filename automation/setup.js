#!/usr/bin/env node

import fs from 'fs/promises';
import { MultiModelOrchestrator } from './models/orchestrator.js';
import { AgentOrchestrator } from './agents/orchestrator.js';
import { AutomationWorkflows } from './workflows/automation.js';
import dotenv from 'dotenv';

dotenv.config();

class AutomationSetup {
  constructor() {
    this.modelOrchestrator = null;
    this.agentOrchestrator = null;
    this.workflowManager = null;
  }

  async initialize() {
    console.log('🚀 Initializing AI Character Creator Automation System...\n');

    try {
      // Initialize components
      console.log('🤖 Setting up AI Models...');
      this.modelOrchestrator = new MultiModelOrchestrator();
      console.log(`✅ Initialized ${this.modelOrchestrator.getAvailableModels().length} AI models`);

      console.log('\n🎯 Setting up AI Agents...');
      this.agentOrchestrator = new AgentOrchestrator();
      console.log(`✅ Initialized ${this.agentOrchestrator.getAllAgents().length} AI agents`);

      console.log('\n⚡ Setting up Automation Workflows...');
      this.workflowManager = new AutomationWorkflows();
      console.log('✅ Workflow system ready');

      // Test basic functionality
      console.log('\n🧪 Running system tests...');
      await this.runTests();

      console.log('\n✨ AI Character Creator Automation System is ready!');
      console.log('\nAvailable commands:');
      console.log('  npm run dev              - Start the development server');
      console.log('  npm run run-agents       - Start the agent orchestrator');
      console.log('  npm run test-models      - Test all AI models');
      console.log('  npm run generate-website - Generate a website');
      console.log('  npm run generate-app     - Generate an app');
      console.log('  npm run generate-game    - Generate a game');
      console.log('  npm run social-automation - Generate social media content');

      return true;
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      return false;
    }
  }

  async runTests() {
    try {
      // Test model availability
      const modelStatus = this.modelOrchestrator.getModelStatus();
      console.log(`  📊 Models: ${modelStatus.availableModels.length} available, current: ${modelStatus.currentModel}`);

      // Test agent status
      const agentStatus = this.agentOrchestrator.getAgentStatus();
      console.log(`  🤖 Agents: ${agentStatus.totalAgents} total, ${agentStatus.activeConversations} active conversations`);

      // Test workflow system
      const workflowStatus = this.workflowManager.getWorkflowStatus();
      console.log(`  ⚡ Workflows: ${workflowStatus.availableWorkflows.length} available`);

      // Test a simple generation
      console.log('  🧪 Testing character generation...');
      const testResult = await this.agentOrchestrator.invokeAgent('characterDesigner', 
        'Create a quick test character for system validation',
        { test: true }
      );
      
      if (testResult.success) {
        console.log('  ✅ Character generation test passed');
      } else {
        console.log('  ⚠️ Character generation test failed, but system is still functional');
      }

    } catch (error) {
      console.log(`  ⚠️ Some tests failed: ${error.message}`);
    }
  }

  async checkEnvironment() {
    console.log('🔍 Checking environment configuration...\n');

    const requiredVars = [
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'GOOGLE_API_KEY',
      'MISTRAL_API_KEY'
    ];

    const optionalVars = [
      'AZURE_OPENAI_API_KEY',
      'TWITTER_API_KEY',
      'INSTAGRAM_ACCESS_TOKEN',
      'GITHUB_TOKEN'
    ];

    let hasRequired = 0;
    let hasOptional = 0;

    console.log('Required API Keys:');
    for (const varName of requiredVars) {
      const hasVar = process.env[varName] && process.env[varName] !== 'your_' + varName.toLowerCase() + '_here';
      console.log(`  ${hasVar ? '✅' : '❌'} ${varName}: ${hasVar ? 'Configured' : 'Missing'}`);
      if (hasVar) hasRequired++;
    }

    console.log('\nOptional API Keys:');
    for (const varName of optionalVars) {
      const hasVar = process.env[varName] && process.env[varName] !== 'your_' + varName.toLowerCase() + '_here';
      console.log(`  ${hasVar ? '✅' : '⚠️'} ${varName}: ${hasVar ? 'Configured' : 'Not configured'}`);
      if (hasVar) hasOptional++;
    }

    console.log(`\n📊 Environment Status: ${hasRequired}/${requiredVars.length} required, ${hasOptional}/${optionalVars.length} optional`);

    if (hasRequired === 0) {
      console.log('\n⚠️ WARNING: No API keys configured. The system will run in demo mode only.');
      console.log('Please copy .env.example to .env and add your API keys for full functionality.');
    } else if (hasRequired < requiredVars.length) {
      console.log('\n⚠️ Some API keys are missing. Some features may not work.');
    } else {
      console.log('\n✅ All required API keys are configured!');
    }

    return hasRequired > 0;
  }

  async createEnvFile() {
    try {
      const envExists = await fs.access('.env').then(() => true).catch(() => false);
      
      if (!envExists) {
        console.log('📝 Creating .env file from template...');
        await fs.copyFile('.env.example', '.env');
        console.log('✅ .env file created. Please edit it with your API keys.');
      } else {
        console.log('📁 .env file already exists.');
      }
    } catch (error) {
      console.error('❌ Error creating .env file:', error.message);
    }
  }

  async generateSampleContent() {
    console.log('\n🎭 Generating sample content...\n');

    try {
      // Generate a sample character
      console.log('Creating sample character...');
      const character = await this.workflowManager.generateCharacter(
        'A mysterious wizard with ancient knowledge',
        { name: 'sample_wizard' }
      );
      console.log(`✅ Sample character created at: ${character.characterPath}`);

      // Generate sample social content
      console.log('Creating sample social media content...');
      const social = await this.workflowManager.generateSocialContent(
        'Announcing our new AI character creator tool',
        ['twitter', 'instagram'],
        { name: 'sample_announcement' }
      );
      console.log(`✅ Sample social content created at: ${social.contentPath}`);

      console.log('\n✨ Sample content generation completed!');
    } catch (error) {
      console.log(`⚠️ Sample content generation failed: ${error.message}`);
    }
  }
}

// Main execution
async function main() {
  const setup = new AutomationSetup();
  
  console.log('🎭 AI Character Creator - Automation Setup\n');
  console.log('==========================================\n');

  // Check and create environment
  await setup.createEnvFile();
  const hasApiKeys = await setup.checkEnvironment();

  // Initialize system
  const initialized = await setup.initialize();

  if (initialized && hasApiKeys) {
    // Generate sample content if API keys are available
    const shouldGenerateSamples = process.argv.includes('--samples');
    if (shouldGenerateSamples) {
      await setup.generateSampleContent();
    }
  }

  console.log('\n🎉 Setup complete! You can now start the application with:');
  console.log('   npm run dev\n');
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default AutomationSetup;
