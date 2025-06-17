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

async function generateWebsite() {
  console.log('🌐 Website Generator\n');
  console.log('===================\n');

  const workflows = new AutomationWorkflows();

  try {
    // Get user input
    const description = await askQuestion('Describe the website you want to create: ');
    const name = await askQuestion('Enter a project name (optional): ');

    console.log('\n🚀 Generating website...\n');

    const result = await workflows.generateWebsite(description, { 
      name: name || undefined 
    });

    console.log('✅ Website generated successfully!\n');
    console.log(`📁 Project location: ${result.projectPath}`);
    console.log(`📝 Project name: ${result.projectName}`);
    console.log('\n🚀 To start the website:');
    console.log(`   cd ${result.projectPath}`);
    console.log('   npm install');
    console.log('   npm start');

    console.log('\n📋 Generated files:');
    result.files.forEach(file => {
      console.log(`   • ${file}`);
    });

  } catch (error) {
    console.error('❌ Website generation failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateWebsite().catch(console.error);
}

export default generateWebsite;
