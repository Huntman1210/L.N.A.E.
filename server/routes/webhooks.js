import express from 'express';
import stripe from 'stripe';
import User from '../models/User.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import EmailService from '../services/emailService.js';

const router = express.Router();
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// @route   POST api/webhooks/stripe
// @desc    Handle Stripe webhook events
// @access  Public
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripeClient.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).send('Webhook processing failed');
  }
});

async function handleSubscriptionCreated(subscription) {
  const user = await User.findOne({ 'subscription.stripeCustomerId': subscription.customer });
  if (!user) return;

  const plan = await SubscriptionPlan.findOne({ stripePriceId: subscription.items.data[0].price.id });
  if (!plan) return;

  user.subscription = {
    ...user.subscription,
    status: subscription.status,
    plan: plan._id,
    stripeSubscriptionId: subscription.id,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end
  };

  await user.save();
  await EmailService.sendSubscriptionChangeEmail(user.email, plan.name);
}

async function handleSubscriptionUpdated(subscription) {
  const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscription.id });
  if (!user) return;

  const plan = await SubscriptionPlan.findOne({ stripePriceId: subscription.items.data[0].price.id });
  if (!plan) return;

  const oldPlan = user.subscription.plan;

  user.subscription = {
    ...user.subscription,
    status: subscription.status,
    plan: plan._id,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end
  };

  await user.save();

  if (oldPlan.toString() !== plan._id.toString()) {
    await EmailService.sendSubscriptionChangeEmail(user.email, plan.name);
  }
}

async function handleSubscriptionDeleted(subscription) {
  const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscription.id });
  if (!user) return;

  // Reset to free plan
  const freePlan = await SubscriptionPlan.findOne({ name: 'free' });
  
  user.subscription = {
    plan: freePlan._id,
    status: 'inactive',
    stripeCustomerId: user.subscription.stripeCustomerId,
    stripeSubscriptionId: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false
  };

  await user.save();
  await EmailService.sendSubscriptionCanceledEmail(user.email);
}

async function handlePaymentFailed(invoice) {
  const user = await User.findOne({ 'subscription.stripeCustomerId': invoice.customer });
  if (!user) return;

  // You might want to send a notification to the user about the failed payment
  await EmailService.sendEmail(user.email, {
    subject: 'Payment Failed - Action Required',
    html: `
      <h1>Payment Failed</h1>
      <p>We were unable to process your payment for your subscription.</p>
      <p>Please update your payment method to continue using premium features:</p>
      <a href="${process.env.FRONTEND_URL}/subscription/update-payment" 
         style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
        Update Payment Method
      </a>
    `
  });
}

async function handlePaymentSucceeded(invoice) {
  const user = await User.findOne({ 'subscription.stripeCustomerId': invoice.customer });
  if (!user) return;

  // Update payment status and send confirmation if needed
  user.subscription.status = 'active';
  await user.save();
}

export default router;
