#!/usr/bin/env node

import { AutomationWorkflows } from './automation.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function generateGame() {
  console.log('🎮 Game Generator\n');
  console.log('================\n');

  const workflows = new AutomationWorkflows();

  try {
    // Get user input
    const description = await askQuestion('Describe the game you want to create: ');
    const name = await askQuestion('Enter a game name (optional): ');
    const genre = await askQuestion('Game genre (adventure/puzzle/action/rpg) [adventure]: ') || 'adventure';

    console.log('\n🚀 Generating game...\n');

    const result = await workflows.generateGame(description, { 
      name: name || undefined,
      genre 
    });

    console.log('✅ Game generated successfully!\n');
    console.log(`📁 Project location: ${result.projectPath}`);
    console.log(`📝 Project name: ${result.projectName}`);
    
    console.log('\n🎮 To start the game:');
    console.log(`   cd ${result.projectPath}`);
    console.log('   npm install');
    console.log('   npm start');

    console.log('\n🎯 Game features:');
    console.log('   • 3D graphics with Three.js');
    console.log('   • Interactive gameplay');
    console.log('   • Character system');
    console.log('   • Modern web technologies');

    console.log('\n📋 Generated files:');
    result.files.forEach(file => {
      console.log(`   • ${file}`);
    });

    console.log('\n🎨 Game Design:');
    console.log(result.result.gameDesign.substring(0, 200) + '...');

  } catch (error) {
    console.error('❌ Game generation failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateGame().catch(console.error);
}

export default generateGame;
