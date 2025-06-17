#!/usr/bin/env node

import mongoose from 'mongoose';
import User from '../server/models/User.js';
import Character from '../server/models/Character.js';
import Usage from '../server/models/Usage.js';
import SubscriptionPlan from '../server/models/SubscriptionPlan.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function setupDemoData() {
  try {
    console.log('🔄 Setting up demo database...');
    
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-character-creator-demo';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');
    
    // Clear existing data
    await User.deleteMany({});
    await Character.deleteMany({});
    await Usage.deleteMany({});
    await SubscriptionPlan.deleteMany({});
    console.log('✅ Cleared existing data');
    
    // Create subscription plans
    const plans = [
      {
        name: 'Free',
        description: 'Perfect for getting started',
        price: 0,
        interval: 'month',
        features: {
          charactersPerMonth: 5,
          apiCallsPerDay: 100,
          imageGeneration: 10,
          prioritySupport: false,
          advancedFeatures: false
        },
        limits: {
          maxCharacters: 5,
          maxApiCalls: 100,
          maxImages: 10
        }
      },
      {
        name: 'Pro',
        description: 'For serious character creators',
        price: 19.99,
        interval: 'month',
        features: {
          charactersPerMonth: 50,
          apiCallsPerDay: 1000,
          imageGeneration: 100,
          prioritySupport: true,
          advancedFeatures: true
        },
        limits: {
          maxCharacters: 50,
          maxApiCalls: 1000,
          maxImages: 100
        }
      },
      {
        name: 'Enterprise',
        description: 'Unlimited creative power',
        price: 99.99,
        interval: 'month',
        features: {
          charactersPerMonth: -1, // unlimited
          apiCallsPerDay: -1,
          imageGeneration: -1,
          prioritySupport: true,
          advancedFeatures: true,
          customIntegrations: true
        },
        limits: {
          maxCharacters: -1,
          maxApiCalls: -1,
          maxImages: -1
        }
      }
    ];
    
    const createdPlans = await SubscriptionPlan.insertMany(plans);
    console.log('✅ Created subscription plans');
    
    // Create demo users
    const freePlan = createdPlans.find(p => p.name === 'Free');
    const proPlan = createdPlans.find(p => p.name === 'Pro');
    
    const demoUsers = [
      {
        name: 'Demo User',
        email: 'demo@example.com',
        password: await bcrypt.hash('demopass123', 10),
        role: 'user',
        emailVerified: true,
        subscription: {
          plan: freePlan._id,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        },
        usage: {
          charactersThisMonth: 2,
          apiCallsToday: 15,
          imagesThisMonth: 3
        }
      },
      {
        name: 'Pro Demo User',
        email: 'pro@example.com',
        password: await bcrypt.hash('propass123', 10),
        role: 'user',
        emailVerified: true,
        subscription: {
          plan: proPlan._id,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        usage: {
          charactersThisMonth: 12,
          apiCallsToday: 250,
          imagesThisMonth: 45
        }
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('adminpass123', 10),
        role: 'admin',
        emailVerified: true,
        subscription: {
          plan: proPlan._id,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }
    ];
    
    const createdUsers = await User.insertMany(demoUsers);
    console.log('✅ Created demo users');
    
    // Create sample characters
    const demoUser = createdUsers.find(u => u.email === 'demo@example.com');
    const proUser = createdUsers.find(u => u.email === 'pro@example.com');
    
    const sampleCharacters = [
      {
        user: demoUser._id,
        name: 'Aria Stormwind',
        description: 'A fierce elven ranger with silver hair and emerald eyes',
        characterType: 'fantasy',
        background: 'Raised in the ancient forests, Aria protects nature from those who would harm it.',
        personality: 'Brave, independent, protective of nature',
        abilities: ['Archery mastery', 'Animal communication', 'Stealth'],
        appearance: {
          age: 125,
          height: '5\'7"',
          hairColor: 'Silver',
          eyeColor: 'Emerald green',
          build: 'Athletic'
        },
        stats: {
          strength: 14,
          dexterity: 18,
          constitution: 16,
          intelligence: 15,
          wisdom: 17,
          charisma: 13
        },
        isPublic: true
      },
      {
        user: demoUser._id,
        name: 'Marcus Cyberblade',
        description: 'A cybernetic-enhanced detective in Neo Tokyo',
        characterType: 'sci-fi',
        background: 'Former police officer turned private investigator after a cybernetic accident.',
        personality: 'Cynical but determined, values justice above all',
        abilities: ['Cybernetic arm strength', 'Digital forensics', 'Combat protocols'],
        appearance: {
          age: 35,
          height: '6\'0"',
          hairColor: 'Black with silver streaks',
          eyeColor: 'One blue, one cybernetic red',
          build: 'Muscular'
        },
        isPublic: true
      },
      {
        user: proUser._id,
        name: 'Lady Victoria Blackthorne',
        description: 'A sophisticated vampire aristocrat from Victorian London',
        characterType: 'historical',
        background: 'Turned during the height of the British Empire, she now navigates modern society.',
        personality: 'Elegant, manipulative, haunted by her past',
        abilities: ['Vampiric strength', 'Hypnotic gaze', 'Centuries of knowledge'],
        appearance: {
          age: 312,
          height: '5\'6"',
          hairColor: 'Raven black',
          eyeColor: 'Deep crimson',
          build: 'Graceful'
        },
        isPublic: true
      }
    ];
    
    await Character.insertMany(sampleCharacters);
    console.log('✅ Created sample characters');
    
    // Create sample usage data
    const now = new Date();
    const usageData = [];
    
    // Generate usage data for the past 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // Add some random usage for demo user
      for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
        usageData.push({
          user: demoUser._id,
          type: 'character_creation',
          metadata: {
            modelUsed: ['gpt-4', 'claude-3', 'gemini-pro'][Math.floor(Math.random() * 3)],
            tokensUsed: Math.floor(Math.random() * 1000) + 500,
            executionTime: Math.floor(Math.random() * 5000) + 1000,
            success: Math.random() > 0.1
          },
          timestamp: date,
          billingPeriod: {
            year: date.getFullYear(),
            month: date.getMonth() + 1
          }
        });
      }
      
      // Add usage for pro user
      for (let j = 0; j < Math.floor(Math.random() * 10) + 5; j++) {
        usageData.push({
          user: proUser._id,
          type: ['character_creation', 'image_generation', 'api_call'][Math.floor(Math.random() * 3)],
          metadata: {
            modelUsed: ['gpt-4', 'claude-3', 'gemini-pro', 'dall-e-3'][Math.floor(Math.random() * 4)],
            tokensUsed: Math.floor(Math.random() * 2000) + 1000,
            executionTime: Math.floor(Math.random() * 3000) + 500,
            success: Math.random() > 0.05
          },
          timestamp: date,
          billingPeriod: {
            year: date.getFullYear(),
            month: date.getMonth() + 1
          }
        });
      }
    }
    
    await Usage.insertMany(usageData);
    console.log('✅ Created sample usage data');
    
    console.log('');
    console.log('🎉 Demo database setup complete!');
    console.log('');
    console.log('👤 Demo accounts created:');
    console.log('   Free User:  demo@example.com / demopass123');
    console.log('   Pro User:   pro@example.com / propass123');
    console.log('   Admin:      admin@example.com / adminpass123');
    console.log('');
    console.log('🎭 Sample characters created:');
    console.log('   - Aria Stormwind (Fantasy Ranger)');
    console.log('   - Marcus Cyberblade (Sci-fi Detective)');
    console.log('   - Lady Victoria Blackthorne (Vampire Aristocrat)');
    console.log('');
    console.log('📊 Sample usage data generated for analytics demo');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Demo setup failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

setupDemoData();
