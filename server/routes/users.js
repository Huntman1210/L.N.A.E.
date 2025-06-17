import express from 'express';
import bcrypt from 'bcryptjs';
import { verifyToken } from '../middleware/auth.js';
import User from '../models/User.js';
import EmailService from '../services/emailService.js';
import Character from '../models/Character.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('subscription.plan');
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const {
      name,
      email,
      currentPassword,
      newPassword,
      emailNotifications,
      privacySettings
    } = req.body;

    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    if (name) user.name = name;
    
    // Handle email change
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
      user.emailVerified = false;
      // Send verification email for new address
      await EmailService.sendVerificationEmail(email, user._id);
    }

    // Update password
    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update notification preferences
    if (emailNotifications) {
      user.emailNotifications = {
        ...user.emailNotifications,
        ...emailNotifications
      };
    }

    // Update privacy settings
    if (privacySettings) {
      user.privacySettings = {
        ...user.privacySettings,
        ...privacySettings
      };
    }

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('subscription.plan');

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/users/profile
// @desc    Delete user profile
// @access  Private
router.delete('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user has an active subscription, cancel it first
    if (user.subscription?.status === 'active') {
      // Cancel subscription in Stripe
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      await stripe.subscriptions.del(user.subscription.stripeSubscriptionId);
    }

    // Delete user's characters
    await Character.deleteMany({ user: user._id });

    // Delete the user
    await user.remove();

    res.json({ message: 'User profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting profile:', err);
    res.status(500).send('Server error');
  }
});

export default router;
