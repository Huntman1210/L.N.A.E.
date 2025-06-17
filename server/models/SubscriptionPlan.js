import mongoose from 'mongoose';

const SubscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['free', 'basic', 'pro', 'enterprise'],
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'one-time'],
    default: 'monthly'
  },
  features: {
    charactersPerMonth: {
      type: Number,
      default: 5
    },
    apiCallsPerMonth: {
      type: Number,
      default: 100
    },
    accessAdvancedModels: {
      type: Boolean,
      default: false
    },
    customCharacterExports: {
      type: Boolean,
      default: false
    },
    apiAccess: {
      type: Boolean,
      default: false
    },
    prioritySupport: {
      type: Boolean,
      default: false
    },
    teamMembers: {
      type: Number,
      default: 1
    }
  },
  stripePlanId: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);

export default SubscriptionPlan;
