import express from 'express';
import stripe from 'stripe';
import User from '../models/User.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// @route   GET api/subscriptions/plans
// @desc    Get all subscription plans
// @access  Private
router.get('/plans', async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ isActive: true }).sort({ price: 1 });
    res.json(plans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/subscriptions/current
// @desc    Get current user subscription
// @access  Private
router.get('/current', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscription usage');
    
    // Check if subscription needs to be updated from Stripe
    if (user.subscription.subscriptionId && user.subscription.status === 'active') {
      try {
        // Get latest subscription data from Stripe
        const subscription = await stripeClient.subscriptions.retrieve(user.subscription.subscriptionId);
        
        // Update status if changed
        if (subscription.status !== user.subscription.status) {
          user.subscription.status = subscription.status;
          await user.save();
        }
      } catch (stripeErr) {
        console.error('Error retrieving Stripe subscription:', stripeErr);
      }
    }
    
    res.json({
      subscription: user.subscription,
      usage: user.usage
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/subscriptions/create-checkout
// @desc    Create a Stripe checkout session for subscription
// @access  Private
router.post('/create-checkout', async (req, res) => {
  try {
    const { planId } = req.body;
    const user = await User.findById(req.user.id);
    const plan = await SubscriptionPlan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({ message: 'Subscription plan not found' });
    }
    
    // Create or retrieve Stripe customer
    let customer;
    if (user.subscription.customerId) {
      customer = await stripeClient.customers.retrieve(user.subscription.customerId);
    } else {
      customer = await stripeClient.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id
        }
      });
      user.subscription.customerId = customer.id;
      await user.save();
    }
    
    // Create Stripe checkout session
    const session = await stripeClient.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePlanId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`
    });
    
    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (err) {
    console.error('Subscription creation error:', err);
    res.status(500).send('Server error');
  }
});

// @route   POST api/subscriptions/webhook
// @desc    Handle Stripe webhook events
// @access  Public
router.post('/webhook', async (req, res) => {
  let event;
  
  try {
    // Verify webhook signature
    const signature = req.headers['stripe-signature'];
    
    try {
      event = stripeClient.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return success response
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/subscriptions/cancel
// @desc    Cancel current subscription
// @access  Private
router.post('/cancel', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.subscription.subscriptionId) {
      return res.status(400).json({ message: 'No active subscription to cancel' });
    }
    
    // Cancel subscription in Stripe
    await stripeClient.subscriptions.del(user.subscription.subscriptionId);
    
    // Update user record
    user.subscription.status = 'canceled';
    await user.save();
    
    res.json({ message: 'Subscription canceled successfully' });
  } catch (err) {
    console.error('Subscription cancellation error:', err);
    res.status(500).send('Server error');
  }
});

// @route   POST api/subscriptions/admin/create-plan
// @desc    Create a new subscription plan
// @access  Private (Admin only)
router.post('/admin/create-plan', isAdmin, async (req, res) => {
  try {
    const {
      name,
      price,
      currency = 'USD',
      billingCycle,
      features
    } = req.body;
    
    // Create Stripe product and price
    const product = await stripeClient.products.create({
      name: `AI Character Creator ${name.charAt(0).toUpperCase() + name.slice(1)} Plan`,
      description: `${name.charAt(0).toUpperCase() + name.slice(1)} subscription plan for AI Character Creator`
    });
    
    const stripePrice = await stripeClient.prices.create({
      product: product.id,
      unit_amount: Math.round(price * 100), // Convert to cents
      currency,
      recurring: {
        interval: billingCycle === 'yearly' ? 'year' : 'month'
      }
    });
    
    // Create plan in database
    const subscriptionPlan = new SubscriptionPlan({
      name,
      price,
      currency,
      billingCycle,
      features,
      stripePlanId: stripePrice.id
    });
    
    const plan = await subscriptionPlan.save();
    
    res.json(plan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Helper functions for subscription webhooks
async function handleSubscriptionUpdated(subscription) {
  try {
    // Find user by Stripe customer ID
    const user = await User.findOne({ 'subscription.customerId': subscription.customer });
    
    if (!user) {
      console.log(`No user found with customer ID: ${subscription.customer}`);
      return;
    }
    
    // Get the plan info from Stripe
    const stripePlan = subscription.items.data[0].plan;
    const plan = await SubscriptionPlan.findOne({ stripePlanId: stripePlan.id });
    
    if (!plan) {
      console.log(`No matching plan found for Stripe price: ${stripePlan.id}`);
      return;
    }
    
    // Update user subscription
    user.subscription = {
      ...user.subscription,
      plan: plan.name,
      status: subscription.status,
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000),
      subscriptionId: subscription.id
    };
    
    await user.save();
    console.log(`Updated subscription for user ${user._id}`);
  } catch (err) {
    console.error('Error updating subscription:', err);
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    // Find user by Stripe customer ID
    const user = await User.findOne({ 'subscription.customerId': subscription.customer });
    
    if (!user) {
      console.log(`No user found with customer ID: ${subscription.customer}`);
      return;
    }
    
    // Update user subscription
    user.subscription = {
      ...user.subscription,
      status: 'canceled',
      endDate: new Date(subscription.canceled_at * 1000)
    };
    
    await user.save();
    console.log(`Marked subscription as canceled for user ${user._id}`);
  } catch (err) {
    console.error('Error handling subscription cancellation:', err);
  }
}

export default router;
