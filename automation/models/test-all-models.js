#!/usr/bin/env node

import { MultiModelOrchestrator } from './orchestrator.js';
import dotenv from 'dotenv';

dotenv.config();

async function testAllModels() {
  console.log('🧪 Testing All AI Models\n');
  console.log('========================\n');

  const orchestrator = new MultiModelOrchestrator();
  const availableModels = orchestrator.getAvailableModels();
  
  console.log(`Found ${availableModels.length} models to test:\n`);

  const testPrompt = "Hello! Please respond with a brief creative description of a magical forest.";
  const results = [];

  for (const modelName of availableModels) {
    console.log(`🤖 Testing ${modelName}...`);
    
    try {
      const startTime = Date.now();
      const result = await orchestrator.generateResponse(testPrompt, modelName);
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (result.success) {
        console.log(`✅ ${modelName} - Success (${duration}ms)`);
        console.log(`   Response: ${result.response.substring(0, 100)}...`);
        results.push({
          model: modelName,
          success: true,
          duration,
          responseLength: result.response.length
        });
      } else {
        console.log(`❌ ${modelName} - Failed: ${result.error}`);
        results.push({
          model: modelName,
          success: false,
          error: result.error
        });
      }
    } catch (error) {
      console.log(`❌ ${modelName} - Error: ${error.message}`);
      results.push({
        model: modelName,
        success: false,
        error: error.message
      });
    }
    
    console.log('');
  }

  // Summary
  console.log('📊 Test Summary\n');
  console.log('===============\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    console.log('\nSuccessful Models:');
    successful.forEach(result => {
      console.log(`  • ${result.model} (${result.duration}ms, ${result.responseLength} chars)`);
    });
  }

  if (failed.length > 0) {
    console.log('\nFailed Models:');
    failed.forEach(result => {
      console.log(`  • ${result.model}: ${result.error}`);
    });
  }

  console.log('\n🎯 Recommendations:');
  if (successful.length === 0) {
    console.log('  ⚠️ No models are working. Please check your API keys in .env');
  } else if (successful.length < availableModels.length) {
    console.log('  ⚠️ Some models failed. Consider checking API keys and network connectivity.');
  } else {
    console.log('  ✅ All models are working perfectly!');
  }

  // Find fastest model
  if (successful.length > 0) {
    const fastest = successful.reduce((prev, current) => 
      prev.duration < current.duration ? prev : current
    );
    console.log(`  🚀 Fastest model: ${fastest.model} (${fastest.duration}ms)`);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAllModels().catch(console.error);
}

export default testAllModels;
