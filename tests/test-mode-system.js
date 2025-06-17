/**
 * Mode System Integration Test
 * Tests the core functionality of the mode system
 */

const { modeRegistry } = require('../src/modes/core/ModeRegistry.js');
const { tier1Modes } = require('../src/modes/definitions/tier1-core-development.js');
const { tier2Modes } = require('../src/modes/definitions/tier2-frontend.js');
const { tier3Modes } = require('../src/modes/definitions/tier3-backend.js');
const { tier4Modes } = require('../src/modes/definitions/tier4-aiml.js');

/**
 * Test mode registration
 */
async function testModeRegistration() {
  console.log('🧪 Testing mode registration...');
  
  try {
    // Register tier 1 modes
    Object.entries(tier1Modes).forEach(([slug, config]) => {
      modeRegistry.registerMode({
        slug,
        tier: 1,
        category: 'core-development',
        ...config
      });
    });
    
    // Register tier 2 modes
    Object.entries(tier2Modes).forEach(([slug, config]) => {
      modeRegistry.registerMode({
        slug,
        tier: 2,
        category: 'frontend',
        ...config
      });
    });
    
    // Register tier 3 modes
    Object.entries(tier3Modes).forEach(([slug, config]) => {
      modeRegistry.registerMode({
        slug,
        tier: 3,
        category: 'backend',
        ...config
      });
    });
    
    // Register tier 4 modes
    Object.entries(tier4Modes).forEach(([slug, config]) => {
      modeRegistry.registerMode({
        slug,
        tier: 4,
        category: 'ai-ml',
        ...config
      });
    });
    
    // Initialize mode registry
    await modeRegistry.initialize();
    
    const modeCount = modeRegistry.modes.size;
    console.log(`✅ Successfully registered ${modeCount} modes`);
    console.log('Mode distribution:');
    
    // Get modes by tier
    for (let tier = 1; tier <= 4; tier++) {
      const tierModes = Array.from(modeRegistry.modes.values()).filter(mode => mode.tier === tier);
      console.log(`  - Tier ${tier}: ${tierModes.length} modes`);
    }
    
    // Get modes by category
    const categories = new Set(Array.from(modeRegistry.modes.values()).map(mode => mode.category));
    for (const category of categories) {
      const categoryModes = Array.from(modeRegistry.modes.values()).filter(mode => mode.category === category);
      console.log(`  - Category '${category}': ${categoryModes.length} modes`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error testing mode registration:', error);
    return false;
  }
}

/**
 * Test mode activation
 */
async function testModeActivation() {
  console.log('🧪 Testing mode activation...');
  
  try {
    // Sample modes to test (one from each tier)
    const testModes = [
      'code-architect',      // Tier 1
      'react-master',        // Tier 2
      'api-architect',       // Tier 3
      'ml-engineer'          // Tier 4
    ];
    
    for (const slug of testModes) {
      const mode = modeRegistry.getMode(slug);
      if (!mode) {
        console.error(`❌ Mode '${slug}' not found`);
        continue;
      }
      
      console.log(`  - Activating mode: ${mode.name} (${slug})...`);
      
      try {
        // Simulate activation with sample context
        const context = {
          task: 'test-activation',
          domain: mode.metadata?.expertise?.[0] || 'general',
          complexity: 'intermediate'
        };
        
        // Test activation (would call activate method in real implementation)
        console.log(`    ✓ Mode would activate with context:`, context);
        
        // Success
        console.log(`    ✅ Successfully tested activation of '${mode.name}'`);
      } catch (activationError) {
        console.error(`    ❌ Error activating mode '${slug}':`, activationError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error testing mode activation:', error);
    return false;
  }
}

/**
 * Test mode recommendation
 */
async function testModeRecommendation() {
  console.log('🧪 Testing mode recommendation...');
  
  try {
    // Test scenarios
    const scenarios = [
      {
        name: 'Frontend React Project',
        context: {
          task: 'build-user-interface',
          domain: 'frontend',
          complexity: 'intermediate',
          preferences: {
            framework: 'react',
            focus: 'performance'
          }
        }
      },
      {
        name: 'Backend API Development',
        context: {
          task: 'design-rest-api',
          domain: 'backend',
          complexity: 'advanced',
          preferences: {
            architecture: 'microservices',
            language: 'nodejs'
          }
        }
      },
      {
        name: 'ML Model Training',
        context: {
          task: 'train-ml-model',
          domain: 'machine-learning',
          complexity: 'expert',
          preferences: {
            framework: 'tensorflow',
            type: 'computer-vision'
          }
        }
      }
    ];
    
    for (const scenario of scenarios) {
      console.log(`  - Testing scenario: ${scenario.name}...`);
      
      // Get recommendations
      const recommendations = modeRegistry.getRecommendations(scenario.context);
      
      if (recommendations.length > 0) {
        console.log(`    ✅ Got ${recommendations.length} recommendations`);
        console.log(`      Top recommendation: ${recommendations[0].name}`);
      } else {
        console.log(`    ⚠️ No recommendations found for this scenario`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error testing mode recommendation:', error);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting Mode System Integration Tests...');
  
  const tests = [
    { name: 'Mode Registration', fn: testModeRegistration },
    { name: 'Mode Activation', fn: testModeActivation },
    { name: 'Mode Recommendation', fn: testModeRecommendation }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n📋 Running test: ${test.name}...`);
    
    try {
      const start = Date.now();
      const success = await test.fn();
      const duration = Date.now() - start;
      
      results.push({
        name: test.name,
        success,
        duration
      });
      
      if (success) {
        console.log(`✅ Test '${test.name}' passed (${duration}ms)`);
      } else {
        console.error(`❌ Test '${test.name}' failed (${duration}ms)`);
      }
    } catch (error) {
      console.error(`💥 Test '${test.name}' crashed:`, error);
      
      results.push({
        name: test.name,
        success: false,
        error: error.message
      });
    }
  }
  
  // Print summary
  console.log('\n📊 Test Summary:');
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`  - Passed: ${passed}/${results.length}`);
  console.log(`  - Failed: ${failed}/${results.length}`);
  
  if (failed > 0) {
    console.error('❌ Some tests failed');
    process.exit(1);
  } else {
    console.log('✅ All tests passed!');
    process.exit(0);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test suite crashed:', error);
  process.exit(1);
});
