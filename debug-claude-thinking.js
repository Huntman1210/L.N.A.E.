#!/usr/bin/env node

/**
 * Debug Script for Claude 3.7 Sonnet Thinking
 * 
 * This script helps debug the Claude 3.7 Sonnet integration with thinking capabilities.
 * It runs in mock mode by default to avoid API calls, but can use real APIs if needed.
 */

import { MultiModelOrchestrator } from './automation/models/orchestrator.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Parse command line arguments
const args = process.argv.slice(2);
const useMockMode = !args.includes('--real-api');
const prompt = args.find(arg => !arg.startsWith('--')) || 
  "Create a character for a fantasy RPG with unique magical abilities.";

async function debugClaudeThinking() {
  console.log('🔍 Claude 3.7 Sonnet Thinking Debugger\n');
  
  try {
    // Handle API keys for testing
    if (useMockMode) {
      console.log('🧪 Using mock mode (no API calls will be made)');
      
      // Set mock keys
      process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'dummy-key-for-testing';
      process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'dummy-key-for-testing';
    } else {
      console.log('⚠️ Using REAL API mode - API calls will be made');
      
      // Check for required keys
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY not found in environment. Required for real API mode.');
      }
    }
    
    // Initialize orchestrator
    const orchestrator = new MultiModelOrchestrator();
    orchestrator.mockMode = useMockMode;
    await orchestrator.initialize();
    
    // Log configuration
    console.log('\n📋 Configuration:');
    console.log(`Mode: ${useMockMode ? 'Mock' : 'Real API'}`);
    console.log(`Model: claude-3.7-sonnet`);
    console.log(`Prompt: "${prompt}"\n`);
    
    // List available models
    const models = orchestrator.getAvailableModels();
    console.log('Available models:');
    const thinkingModels = models.filter(m => m.features?.thinking);
    console.log(`Found ${thinkingModels.length} model(s) with thinking capabilities:`);
    thinkingModels.forEach(model => {
      console.log(`- ${model.name} (${model.provider})`);
    });
    
    // Generate response with thinking
    console.log('\n🧠 Generating response with thinking...');
    console.time('Generation time');
    
    const result = await orchestrator.generateResponseWithThinking(prompt, 'claude-3.7-sonnet', {
      context: 'AI Character Creator Debug Mode',
      task: 'Generate response with thinking',
      instructions: 'Show detailed thinking process'
    });
    
    console.timeEnd('Generation time');
    
    // Show results
    if (result.success) {
      console.log('\n✅ Success!');
      console.log('\n📊 Response metadata:');
      console.log(`Model: ${result.model}`);
      console.log(`Timestamp: ${result.timestamp}`);
      console.log(`Features: ${JSON.stringify(result.features, null, 2)}`);
      
      if (result.thinking) {
        console.log('\n🧠 THINKING PROCESS:');
        console.log('─'.repeat(80));
        console.log(result.thinking);
        console.log('─'.repeat(80));
      } else {
        console.log('\n⚠️ No thinking process returned');
      }
      
      console.log('\n📝 RESPONSE:');
      console.log('─'.repeat(80));
      console.log(result.response);
      console.log('─'.repeat(80));
    } else {
      console.log('\n❌ Error generating response:');
      console.log(result.error);
    }
    
  } catch (error) {
    console.error('\n❌ Debug Error:', error.message);
    console.error(error.stack);
  }
}

// Run the debugger
debugClaudeThinking().then(() => {
  console.log('\nDebug completed!');
});
