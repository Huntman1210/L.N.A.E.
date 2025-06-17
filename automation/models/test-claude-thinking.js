// Test script for Claude 3.7 Sonnet with thinking capabilities
import { MultiModelOrchestrator } from './orchestrator.js';
import dotenv from 'dotenv';

dotenv.config();

async function testClaudeThinking() {
  console.log('🧪 Testing Claude 3.7 Sonnet with thinking capabilities...\n');
  
  // Set mock API keys for testing if not present
  if (!process.env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = 'dummy-key-for-testing';
  if (!process.env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = 'dummy-key-for-testing';
  if (!process.env.GOOGLE_API_KEY) process.env.GOOGLE_API_KEY = 'dummy-key-for-testing';
  if (!process.env.MISTRAL_API_KEY) process.env.MISTRAL_API_KEY = 'dummy-key-for-testing';
  
  const orchestrator = new MultiModelOrchestrator();
  orchestrator.mockMode = true; // Don't actually call APIs
  await orchestrator.initialize();
  
  // Test 1: Check available models
  console.log('📋 Available models:');
  const models = orchestrator.getAvailableModels();
  models.forEach(model => {
    console.log(`- ${model.name} (${model.provider})`);
    if (model.features.thinking) {
      console.log('  ✨ Thinking enabled');
    }
  });
  console.log();
  
  // Test 2: Generate response with thinking
  const prompt = "Explain how to create a character for a video game, considering personality, backstory, and abilities.";
  
  console.log('🤔 Testing thinking response...');
  console.log(`Prompt: ${prompt}\n`);
  
  try {
    const result = await orchestrator.generateResponseWithThinking(prompt, 'claude-3.7-sonnet', {
      context: 'Game Development',
      task: 'Character Creation Guide',
      instructions: 'Provide detailed, step-by-step guidance with reasoning'
    });
    
    if (result.success) {
      console.log('✅ Success!');
      console.log(`Model: ${result.model}`);
      
      if (result.thinking) {
        console.log('\n🧠 Thinking Process:');
        console.log('─'.repeat(50));
        console.log(result.thinking);
        console.log('─'.repeat(50));
      }
      
      console.log('\n💬 Response:');
      console.log('─'.repeat(50));
      console.log(result.response);
      console.log('─'.repeat(50));
      
      console.log(`\n📊 Features:`);
      console.log(`- Thinking enabled: ${result.features.thinkingEnabled}`);
      console.log(`- Thinking shown: ${result.features.showThinking}`);
    } else {
      console.log('❌ Failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test 3: Compare with regular Claude
async function compareModels() {
  console.log('\n🔄 Comparing regular Claude vs Claude with thinking...\n');
  
  // Set mock API keys for testing if not present
  if (!process.env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = 'dummy-key-for-testing';
  if (!process.env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = 'dummy-key-for-testing';
  if (!process.env.GOOGLE_API_KEY) process.env.GOOGLE_API_KEY = 'dummy-key-for-testing';
  if (!process.env.MISTRAL_API_KEY) process.env.MISTRAL_API_KEY = 'dummy-key-for-testing';
  
  const orchestrator = new MultiModelOrchestrator();
  orchestrator.mockMode = true; // Enable mock mode
  await orchestrator.initialize();
  
  const prompt = "How would you design a puzzle game mechanic?";
  
  // Regular Claude 3 Sonnet
  console.log('Testing regular Claude 3 Sonnet...');
  const regularResult = await orchestrator.generateResponse(prompt, 'claude-3-sonnet');
  
  // Claude 3.7 Sonnet with thinking
  console.log('Testing Claude 3.7 Sonnet with thinking...');
  const thinkingResult = await orchestrator.generateResponseWithThinking(prompt, 'claude-3.7-sonnet');
  
  console.log('\n📊 Comparison Results:');
  console.log('─'.repeat(60));
  console.log(`Regular Claude: ${regularResult.response.substring(0, 100)}...`);
  console.log(`Thinking Claude: ${thinkingResult.response.substring(0, 100)}...`);
  console.log(`Thinking process available: ${!!thinkingResult.thinking}`);
  console.log('─'.repeat(60));
}

// Run tests
async function runAllTests() {
  try {
    await testClaudeThinking();
    await compareModels();
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { testClaudeThinking, compareModels, runAllTests };
