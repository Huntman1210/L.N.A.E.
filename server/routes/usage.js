import express from 'express';
import UsageService from '../services/usageService.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// @route   GET api/usage/current
// @desc    Get current month usage for user
// @access  Private
router.get('/current', async (req, res) => {
  try {
    const usage = await UsageService.getUserUsage(req.user.id, 'current');
    res.json(usage);
  } catch (err) {
    console.error('Error fetching current usage:', err);
    res.status(500).send('Server error');
  }
});

// @route   GET api/usage/analytics
// @desc    Get usage analytics
// @access  Private
router.get('/analytics', async (req, res) => {
  try {
    const { period = 'last30days' } = req.query;
    const analytics = await UsageService.getUsageAnalytics(req.user.id, period);
    res.json(analytics);
  } catch (err) {
    console.error('Error fetching usage analytics:', err);
    res.status(500).send('Server error');
  }
});

// @route   GET api/usage/limits
// @desc    Check usage limits for user
// @access  Private
router.get('/limits', async (req, res) => {
  try {
    const characterRemaining = await UsageService.hasUsageRemaining(req.user.id, 'character_creation');
    const apiRemaining = await UsageService.hasUsageRemaining(req.user.id, 'api_call');
    
    res.json({
      characterCreation: characterRemaining,
      apiCalls: apiRemaining
    });
  } catch (err) {
    console.error('Error checking usage limits:', err);
    res.status(500).send('Server error');
  }
});

// @route   POST api/usage/track
// @desc    Track usage (internal endpoint)
// @access  Private
router.post('/track', async (req, res) => {
  try {
    const { type, metadata } = req.body;
    const usage = await UsageService.trackUsage(req.user.id, type, metadata);
    res.json(usage);
  } catch (err) {
    console.error('Error tracking usage:', err);
    res.status(500).send('Server error');
  }
});

export default router;
