import stripe from 'stripe';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SubscriptionPlan from '../server/models/SubscriptionPlan.js';

dotenv.config();

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

const plans = [
  {
    name: 'basic',
    displayName: 'Basic Plan',
    price: 999, // $9.99
    currency: 'USD',
    billingCycle: 'monthly',
    features: {
      charactersPerMonth: 20,
      apiCallsPerMonth: 500,
      maxImageOutputs: 2,
      customPromptTemplates: false,
      prioritySupport: false,
      batchGeneration: false
    }
  },
  {
    name: 'pro',
    displayName: 'Professional Plan',
    price: 2999, // $29.99
    currency: 'USD',
    billingCycle: 'monthly',
    features: {
      charactersPerMonth: 100,
      apiCallsPerMonth: 2000,
      maxImageOutputs: 5,
      customPromptTemplates: true,
      prioritySupport: true,
      batchGeneration: false
    }
  },
  {
    name: 'enterprise',
    displayName: 'Enterprise Plan',
    price: 9999, // $99.99
    currency: 'USD',
    billingCycle: 'monthly',
    features: {
      charactersPerMonth: 500,
      apiCallsPerMonth: 10000,
      maxImageOutputs: 10,
      customPromptTemplates: true,
      prioritySupport: true,
      batchGeneration: true
    }
  }
];

async function setupStripePlans() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const plan of plans) {
      // 1. Create or update the product in Stripe
      const product = await stripeClient.products.create({
        name: plan.displayName,
        description: `${plan.displayName} - ${plan.features.charactersPerMonth} characters/month`,
        metadata: {
          planType: plan.name
        }
      });

      // 2. Create the price in Stripe
      const price = await stripeClient.prices.create({
        unit_amount: plan.price,
        currency: plan.currency,
        recurring: {
          interval: 'month'
        },
        product: product.id
      });

      // 3. Create or update the plan in our database
      await SubscriptionPlan.findOneAndUpdate(
        { name: plan.name },
        {
          ...plan,
          stripeProductId: product.id,
          stripePriceId: price.id,
          isActive: true
        },
        { upsert: true, new: true }
      );

      console.log(`Created/updated plan: ${plan.name}`);
    }

    // Create the free plan in database only (no Stripe product needed)
    await SubscriptionPlan.findOneAndUpdate(
      { name: 'free' },
      {
        name: 'free',
        displayName: 'Free Plan',
        price: 0,
        currency: 'USD',
        billingCycle: 'monthly',
        features: {
          charactersPerMonth: 5,
          apiCallsPerMonth: 100,
          maxImageOutputs: 1,
          customPromptTemplates: false,
          prioritySupport: false,
          batchGeneration: false
        },
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log('All plans have been set up successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up plans:', error);
    process.exit(1);
  }
}

setupStripePlans();
