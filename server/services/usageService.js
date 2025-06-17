import Usage from '../models/Usage.js';
import User from '../models/User.js';
import EmailService from './emailService.js';

class UsageService {
  static async trackUsage(userId, type, metadata = {}) {
    try {
      const now = new Date();
      const usage = new Usage({
        user: userId,
        type,
        metadata,
        billingPeriod: {
          year: now.getFullYear(),
          month: now.getMonth() + 1
        }
      });

      await usage.save();

      // Check if user is approaching limits
      await this.checkUsageLimits(userId);

      return usage;
    } catch (error) {
      console.error('Error tracking usage:', error);
      throw error;
    }
  }

  static async getUserUsage(userId, period = 'current') {
    try {
      const now = new Date();
      let startDate, endDate;

      switch (period) {
        case 'current':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'last30days':
          endDate = now;
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last7days':
          endDate = now;
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }

      const usage = await Usage.aggregate([
        {
          $match: {
            user: userId,
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalTokens: { $sum: '$metadata.tokensUsed' },
            totalImages: { $sum: '$metadata.imageCount' },
            avgExecutionTime: { $avg: '$metadata.executionTime' },
            successRate: {
              $avg: { $cond: ['$metadata.success', 1, 0] }
            }
          }
        }
      ]);

      return usage;
    } catch (error) {
      console.error('Error getting user usage:', error);
      throw error;
    }
  }

  static async checkUsageLimits(userId) {
    try {
      const user = await User.findById(userId).populate('subscription.plan');
      if (!user) return;

      const plan = user.subscription?.plan;
      if (!plan) return;

      const currentUsage = await this.getUserUsage(userId, 'current');
      const characterUsage = currentUsage.find(u => u._id === 'character_creation');
      const apiUsage = currentUsage.find(u => u._id === 'api_call');

      const characterCount = characterUsage?.count || 0;
      const apiCount = apiUsage?.count || 0;

      // Check character limit
      const characterLimit = plan.features.charactersPerMonth;
      const characterUsagePercent = (characterCount / characterLimit) * 100;

      // Check API limit
      const apiLimit = plan.features.apiCallsPerMonth;
      const apiUsagePercent = (apiCount / apiLimit) * 100;

      // Send alerts at 80% and 95% usage
      if (characterUsagePercent >= 80 && characterUsagePercent < 95) {
        await EmailService.sendUsageAlertEmail(user.email, Math.round(characterUsagePercent));
      } else if (characterUsagePercent >= 95) {
        await EmailService.sendUsageAlertEmail(user.email, Math.round(characterUsagePercent));
      }

      if (apiUsagePercent >= 80 && apiUsagePercent < 95) {
        await EmailService.sendUsageAlertEmail(user.email, Math.round(apiUsagePercent));
      } else if (apiUsagePercent >= 95) {
        await EmailService.sendUsageAlertEmail(user.email, Math.round(apiUsagePercent));
      }

    } catch (error) {
      console.error('Error checking usage limits:', error);
    }
  }

  static async hasUsageRemaining(userId, type) {
    try {
      const user = await User.findById(userId).populate('subscription.plan');
      if (!user) return false;

      const plan = user.subscription?.plan;
      if (!plan) return false;

      const currentUsage = await this.getUserUsage(userId, 'current');
      
      switch (type) {
        case 'character_creation': {
          const characterUsage = currentUsage.find(u => u._id === 'character_creation');
          const characterCount = characterUsage?.count || 0;
          return characterCount < plan.features.charactersPerMonth;
        }
        case 'api_call': {
          const apiUsage = currentUsage.find(u => u._id === 'api_call');
          const apiCount = apiUsage?.count || 0;
          return apiCount < plan.features.apiCallsPerMonth;
        }
        default:
          return true;
      }
    } catch (error) {
      console.error('Error checking usage remaining:', error);
      return false;
    }
  }

  static async getUsageAnalytics(userId, period = 'last30days') {
    try {
      const now = new Date();
      let startDate;

      switch (period) {
        case 'last7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'last30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'last90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const analytics = await Usage.aggregate([
        {
          $match: {
            user: userId,
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
              type: '$type'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.date',
            usage: {
              $push: {
                type: '$_id.type',
                count: '$count'
              }
            },
            totalCount: { $sum: '$count' }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      return analytics;
    } catch (error) {
      console.error('Error getting usage analytics:', error);
      throw error;
    }
  }
}

export default UsageService;
