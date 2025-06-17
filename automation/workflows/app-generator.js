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

async function generateApp() {
  console.log('📱 App Generator\n');
  console.log('===============\n');

  const workflows = new AutomationWorkflows();

  try {
    // Get user input
    const description = await askQuestion('Describe the app you want to create: ');
    const name = await askQuestion('Enter a project name (optional): ');
    const type = await askQuestion('App type (web/mobile/desktop) [web]: ') || 'web';

    console.log('\n🚀 Generating full-stack application...\n');

    const result = await workflows.generateApp(description, { 
      name: name || undefined,
      type 
    });

    console.log('✅ App generated successfully!\n');
    console.log(`📁 Project location: ${result.projectPath}`);
    console.log(`📝 Project name: ${result.projectName}`);
    
    console.log('\n🖥️ To start the backend server:');
    console.log(`   cd ${result.projectPath}/server`);
    console.log('   npm install');
    console.log('   npm run dev');

    console.log('\n💻 To start the frontend (in another terminal):');
    console.log(`   cd ${result.projectPath}/client`);
    console.log('   npm install');
    console.log('   npm start');

    console.log('\n📁 Project structure:');
    console.log('   • /server - Backend API (Node.js/Express)');
    console.log('   • /client - Frontend React app');
    console.log('   • /shared - Shared utilities and types');

  } catch (error) {
    console.error('❌ App generation failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateApp().catch(console.error);
}

export default generateApp;
