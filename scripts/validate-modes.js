#!/usr/bin/env node

/**
 * Mode Ecosystem Validation Script
 * Validates the completeness and integrity of the 300+ mode ecosystem
 */

import fs from 'fs';
import { modeManager } from '../src/modes/ModeManager.js';

console.log('🌟 ===============================================');
console.log('🔍 VALIDATING MODE ECOSYSTEM');
console.log('===============================================');

// Validate file structure
function validateFileStructure() {
  console.log('📁 Validating file structure...');
  
  const requiredPaths = [
    'src/modes/core/ModeRegistry.js',
    'src/modes/core/BaseMode.js',
    'src/modes/ModeManager.js',
    'src/modes/ModeFactory.js',
    'src/modes/definitions/tier1-core-development.js',
    'src/modes/definitions/tier2-frontend-mastery.js',
    'src/modes/definitions/tier3-backend-mastery.js',
    'src/modes/definitions/tier4-aiml-mastery.js',
    'src/modes/definitions/tier5-10-comprehensive.js',
    'src/components/ModeEcosystem.js',
    'src/components/ModeManager.js',
    'src/styles/ModeEcosystem.css',
    'docs/MODE_ECOSYSTEM_GUIDE.md',
    'README_MODE_ECOSYSTEM.md'
  ];

  let valid = true;
  for (const filePath of requiredPaths) {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing file: ${filePath}`);
      valid = false;
    } else {
      console.log(`✅ Found: ${filePath}`);
    }
  }

  return valid;
}

// Validates tier counts against expected values
async function validateTierCounts(registry) {
  // Expected counts by tier
  const expectedTierCounts = {
    1: 25,  // Core Development
    2: 35,  // Frontend Mastery
    3: 40,  // Backend Mastery
    4: 30,  // AI/ML Mastery
    5: 35,  // Cloud & Infrastructure
    6: 25,  // Data & Analytics
    7: 20,  // Quality & Testing
    8: 30,  // Specialized Domain
    9: 30,  // Operations & Support
    10: 30  // Emerging Technologies
  };
  
  // Count modes by tier
  const tierCounts = {};
  
  for (const [, mode] of Object.entries(registry)) {
    const tier = mode.tier || 1;  // Default to tier 1 if not specified
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
  }
  
  // Validate tier counts
  let tiersValid = true;
  for (const [tier, expectedCount] of Object.entries(expectedTierCounts)) {
    const count = tierCounts[tier] || 0;
    if (count < expectedCount) {
      console.error(`❌ Tier ${tier}: Expected ${expectedCount} modes, found ${count}`);
      tiersValid = false;
    } else {
      console.log(`✅ Tier ${tier}: ${count} modes`);
    }
  }
  
  return tiersValid;
}

// Validates the structure of modes to ensure they have required properties
function validateModeStructure(registry) {
  const requiredModeProperties = ['name', 'description', 'expertise', 'capabilities'];
  let structureValid = true;
  const sampleSize = 3; // Number of modes to sample from each tier
  
  // Sample modes from tiers 1-10
  for (let tier = 1; tier <= 10; tier++) {
    const tierModes = Object.entries(registry).filter(([, mode]) => (mode.tier || 1) == tier);
    const modesCount = Math.min(sampleSize, tierModes.length);
    
    for (let i = 0; i < modesCount; i++) {
      const [modeSlug, mode] = tierModes[i];
      
      for (const prop of requiredModeProperties) {
        if (!mode[prop]) {
          console.error(`❌ Mode '${modeSlug}' missing required property: ${prop}`);
          structureValid = false;
        }
      }
    }
  }
  
  return structureValid;
}

// Count modes and validate mode structure
async function validateModes() {
  console.log('\n📊 Validating mode definitions and structure...');
  
  try {
    // Initialize the mode manager to load all modes
    await modeManager.initialize();
    
    const registry = modeManager.getAllModes();
    const modeCount = Object.keys(registry).length;
    
    console.log(`✅ Total modes loaded: ${modeCount}`);
    
    // Validate tier counts
    const tiersValid = await validateTierCounts(registry);
    
    // Validate mode structure
    const structureValid = validateModeStructure(registry);
    
    return tiersValid && structureValid;
  } catch (error) {
    console.error('❌ Mode validation failed:', error);
    return false;
  }
}

// Validate mode ecosystem functionality
async function validateFunctionality() {
  console.log('\n⚙️ Validating mode ecosystem functionality...');
  
  try {
    // Test mode switching
    const testModes = ['code-architect', 'ui-ux-architect', 'api-architect', 'ai-ml-engineer'];
    
    for (const modeSlug of testModes) {
      console.log(`   Testing mode switch to: ${modeSlug}`);
      const success = await modeManager.switchMode(modeSlug);
      
      if (success) {
        console.log(`   ✅ Successfully switched to ${modeSlug}`);
      } else {
        console.error(`   ❌ Failed to switch to ${modeSlug}`);
        return false;
      }
    }
    
    // Test search functionality
    console.log('\n   Testing search functionality...');
    const searchResults = modeManager.searchModes('architecture');
    
    if (searchResults?.byName?.length > 0) {
      console.log(`   ✅ Search functionality working, found ${searchResults.byName.length} results`);
    } else {
      console.error(`   ❌ Search functionality failed`);
      return false;
    }
    
    // Test mode relationships
    console.log('\n   Testing mode relationships and recommendations...');
    let recommendations = [];
    try {
      recommendations = modeManager.getRecommendations({
        task: 'web-development',
        complexity: 'advanced'
      }) || [];
      
      if (recommendations.length > 0) {
        console.log(`   ✅ Recommendations working, found ${recommendations.length} recommendations`);
      } else {
        console.log(`   ⚠️ No recommendations found, but function executed without errors`);
      }
      
      return true;
    } catch (error) {
      console.error(`   ❌ Recommendations failed: ${error.message}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Functionality validation failed:', error);
    return false;
  }
}

// Main validation function
async function validateEcosystem() {
  try {
    console.log('Starting mode ecosystem validation...\n');
    
    // Validate file structure
    const structureValid = validateFileStructure();
    if (!structureValid) {
      console.error('\n❌ File structure validation failed');
    }
    
    // Validate modes
    const modesValid = await validateModes();
    if (!modesValid) {
      console.error('\n❌ Mode validation failed');
    }
    
    // Validate functionality
    const functionalityValid = await validateFunctionality();
    if (!functionalityValid) {
      console.error('\n❌ Functionality validation failed');
    }
    
    // Overall validation result
    const overallValid = structureValid && modesValid && functionalityValid;
    
    console.log('\n🎯 ===============================================');
    if (overallValid) {
      console.log('✅ MODE ECOSYSTEM VALIDATION SUCCESSFUL');
    } else {
      console.log('❌ MODE ECOSYSTEM VALIDATION FAILED');
    }
    console.log('===============================================');
    
    return overallValid;
  } catch (error) {
    console.error('❌ Validation failed with error:', error);
    process.exit(1);
  }
}

// Run validation
validateEcosystem().then(valid => {
  process.exit(valid ? 0 : 1);
});

export { validateEcosystem };
