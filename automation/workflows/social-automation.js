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

async function generateSocialContent() {
  console.log('📱 Social Media Content Generator\n');
  console.log('=================================\n');

  const workflows = new AutomationWorkflows();

  try {
    // Get user input
    const description = await askQuestion('Describe the content you want to create: ');
    const platformsInput = await askQuestion('Platforms (twitter,instagram,facebook,linkedin) [twitter,instagram]: ');
    const platforms = platformsInput || 'twitter,instagram';
    const platformList = platforms.split(',').map(p => p.trim());

    const campaign = await askQuestion('Campaign name (optional): ');

    console.log('\n🚀 Generating social media content...\n');

    const result = await workflows.generateSocialContent(description, platformList, { 
      name: campaign || undefined 
    });

    console.log('✅ Social media content generated successfully!\n');
    console.log(`📁 Content location: ${result.contentPath}`);
    console.log(`📱 Platforms: ${result.platforms.join(', ')}`);
    
    console.log('\n📋 Generated content:');
    result.platforms.forEach(platform => {
      console.log(`\n🔸 ${platform.toUpperCase()}:`);
      const content = result.result.content[platform];
      if (content) {
        console.log(content.substring(0, 150) + '...');
      }
    });

    console.log('\n📅 Content Calendar:');
    console.log(`   Check ${result.contentPath}/content_calendar.md for detailed scheduling`);

    console.log('\n💡 Tips:');
    console.log('   • Review and customize the content before posting');
    console.log('   • Consider optimal posting times for each platform');
    console.log('   • Add relevant images or videos to increase engagement');
    console.log('   • Monitor performance and adjust strategy accordingly');

  } catch (error) {
    console.error('❌ Social content generation failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSocialContent().catch(console.error);
}

export default generateSocialContent;
