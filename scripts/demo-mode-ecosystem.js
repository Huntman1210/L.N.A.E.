#!/usr/bin/env node

/**
 * Mode Ecosystem Demo
 * Interactive demonstration of the 300+ mode ecosystem
 */

import { modeManager } from '../src/modes/ModeManager.js';

async function runDemo() {
  console.log('🌟 ===============================================');
  console.log('🎭 MODE ECOSYSTEM INTERACTIVE DEMO');
  console.log('===============================================');
  
  // Initialize ecosystem
  console.log('🚀 Initializing mode ecosystem...');
  await modeManager.initialize();
  
  // Display ecosystem stats
  const stats = modeManager.getEcosystemStats();
  console.log(`📊 Ecosystem loaded with ${stats.totalModes} modes`);
  
  // Demo mode switching
  console.log('\n🔄 Demonstrating mode switching...');
  
  const demoModes = [
    'code-architect',
    'react-architect', 
    'api-architect',
    'ai-ml-engineer',
    'cloud-architect'
  ];
  
  for (const mode of demoModes) {
    console.log(`\n🎯 Switching to ${mode}...`);
    const success = await modeManager.switchMode(mode, {
      demo: true,
      timestamp: new Date()
    });
    
    if (success) {
      console.log(`✅ Successfully activated ${mode}`);
    } else {
      console.log(`❌ Failed to activate ${mode}`);
    }
  }
  
  // Demo search functionality
  console.log('\n🔍 Demonstrating search functionality...');
  const searchResults = modeManager.searchModes('react');
  console.log(`Found ${searchResults.byName.length} modes matching "react"`);
  
  // Demo recommendations
  console.log('\n💡 Demonstrating recommendations...');
  const recommendations = modeManager.getRecommendations({
    task: 'web-development',
    complexity: 'advanced',
    domain: 'e-commerce'
  });
  console.log(`Generated ${recommendations.length} recommendations`);
  
  // Export configuration
  console.log('\n📄 Exporting ecosystem configuration...');
  modeManager.exportEcosystemConfig();
  console.log('Configuration exported successfully');
  
  console.log('\n🎉 Demo completed successfully!');
  console.log('===============================================');
}

runDemo().catch(console.error);
