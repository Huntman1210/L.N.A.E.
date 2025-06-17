import UsageService from '../services/usageService.js';

// Middleware to track character creation usage
export const trackCharacterCreation = async (req, res, next) => {
  try {
    // Check if user has remaining usage
    const hasUsage = await UsageService.hasUsageRemaining(req.user.id, 'character_creation');
    
    if (!hasUsage) {
      return res.status(403).json({ 
        message: 'Character creation limit reached for your current plan',
        upgrade: true 
      });
    }

    next();
  } catch (error) {
    console.error('Error checking character creation usage:', error);
    res.status(500).send('Server error');
  }
};

// Middleware to track API call usage
export const trackApiCall = async (req, res, next) => {
  try {
    const hasUsage = await UsageService.hasUsageRemaining(req.user.id, 'api_call');
    
    if (!hasUsage) {
      return res.status(403).json({ 
        message: 'API call limit reached for your current plan',
        upgrade: true 
      });
    }

    next();
  } catch (error) {
    console.error('Error checking API call usage:', error);
    res.status(500).send('Server error');
  }
};

// Middleware to record usage after successful operation
export const recordUsage = (type) => {
  return async (req, res, next) => {
    // Store original res.json to intercept successful responses
    const originalJson = res.json;
    
    res.json = function(data) {
      // Only track usage on successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        UsageService.trackUsage(req.user.id, type, {
          success: true,
          executionTime: Date.now() - req.startTime,
          ...req.usageMetadata
        }).catch(err => {
          console.error('Error recording usage:', err);
        });
      }
      
      return originalJson.call(this, data);
    };

    // Record start time
    req.startTime = Date.now();
    next();
  };
};
