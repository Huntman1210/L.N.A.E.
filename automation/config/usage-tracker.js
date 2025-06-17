import fs from 'fs/promises';
import path from 'path';
import MODEL_USAGE_CONFIG from './usage-limits.js';

export class ModelUsageTracker {
  constructor() {
    this.usageFile = path.join(process.cwd(), 'automation', 'data', 'usage-tracking.json');
    this.usage = {
      daily: {},
      hourly: {},
      lastReset: {
        daily: new Date().toDateString(),
        hourly: new Date().toISOString().substring(0, 13) + ':00:00.000Z'
      }
    };
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      await this.loadUsage();
      this.initialized = true;
    }
  }

  async loadUsage() {
    try {
      const data = await fs.readFile(this.usageFile, 'utf8');
      this.usage = JSON.parse(data);
      await this.checkReset();
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, create it with default values
        console.log('Creating new usage tracking file...');
        await this.saveUsage();
      } else {
        // Re-throw other errors for proper handling upstream
        console.error('Error loading usage data:', error.message);
        throw error;
      }
    }
  }

  async saveUsage() {
    try {
      await fs.mkdir(path.dirname(this.usageFile), { recursive: true });
      await fs.writeFile(this.usageFile, JSON.stringify(this.usage, null, 2));
    } catch (error) {
      console.error('Error saving usage data:', error);
    }
  }

  async checkReset() {
    const now = new Date();
    const currentDay = now.toDateString();
    const currentHour = now.toISOString().substring(0, 13) + ':00:00.000Z';

    // Reset daily counters
    if (this.usage.lastReset.daily !== currentDay) {
      this.usage.daily = {};
      this.usage.lastReset.daily = currentDay;
      console.log('🔄 Daily usage counters reset');
    }

    // Reset hourly counters
    if (this.usage.lastReset.hourly !== currentHour) {
      this.usage.hourly = {};
      this.usage.lastReset.hourly = currentHour;
    }

    await this.saveUsage();
  }

  async canUseModel(modelName) {
    await this.initialize();
    await this.checkReset();
    
    const config = MODEL_USAGE_CONFIG.limits;
    const currentDaily = this.usage.daily[modelName] || 0;
    const currentHourly = this.usage.hourly[modelName] || 0;
    
    const dailyLimit = config.daily[modelName] || 0;
    const hourlyLimit = config.hourly[modelName] || 0;

    // Local models have unlimited usage
    if (MODEL_USAGE_CONFIG.priority.unlimited.includes(modelName)) {
      return { canUse: true, reason: 'unlimited' };
    }

    // Check daily limit
    if (currentDaily >= dailyLimit) {
      return { 
        canUse: false, 
        reason: 'daily_limit_exceeded',
        current: currentDaily,
        limit: dailyLimit
      };
    }

    // Check hourly limit
    if (currentHourly >= hourlyLimit) {
      return { 
        canUse: false, 
        reason: 'hourly_limit_exceeded',
        current: currentHourly,
        limit: hourlyLimit
      };
    }

    return { canUse: true };
  }

  async recordUsage(modelName, tokens = 0) {
    await this.initialize();
    await this.checkReset();
    
    this.usage.daily[modelName] = (this.usage.daily[modelName] || 0) + 1;
    this.usage.hourly[modelName] = (this.usage.hourly[modelName] || 0) + 1;
    
    await this.saveUsage();

    // Check if approaching limits
    await this.checkUsageWarnings(modelName);
  }

  async checkUsageWarnings(modelName) {
    const config = MODEL_USAGE_CONFIG.limits;
    const tracking = MODEL_USAGE_CONFIG.tracking;
    
    const currentDaily = this.usage.daily[modelName] || 0;
    const dailyLimit = config.daily[modelName] || 0;
    
    const usagePercentage = currentDaily / dailyLimit;
    
    if (usagePercentage >= tracking.warningThreshold) {
      console.log(`⚠️ Usage Warning: ${modelName} at ${Math.round(usagePercentage * 100)}% of daily limit`);
      console.log(`   Current: ${currentDaily}/${dailyLimit} requests`);
    }
  }

  getUsageStatus(modelName = null) {
    if (modelName) {
      const config = MODEL_USAGE_CONFIG.limits;
      const currentDaily = this.usage.daily[modelName] || 0;
      const currentHourly = this.usage.hourly[modelName] || 0;
      
      return {
        model: modelName,
        daily: {
          current: currentDaily,
          limit: config.daily[modelName] || 0,
          percentage: Math.round((currentDaily / (config.daily[modelName] || 1)) * 100)
        },
        hourly: {
          current: currentHourly,
          limit: config.hourly[modelName] || 0,
          percentage: Math.round((currentHourly / (config.hourly[modelName] || 1)) * 100)
        }
      };
    }

    // Return status for all models
    const allModels = Object.keys(MODEL_USAGE_CONFIG.limits.daily);
    return allModels.map(model => this.getUsageStatus(model));
  }

  async findFallbackModel(originalModel) {
    if (!MODEL_USAGE_CONFIG.fallback.enabled) {
      return null;
    }

    const priorities = MODEL_USAGE_CONFIG.priority;
    let fallbackModels = [];

    // Find current model's priority level
    for (const [level, models] of Object.entries(priorities)) {
      if (models.includes(originalModel)) {
        // Try same priority level first
        fallbackModels = [...models];
        // Then try lower priority levels
        if (level === 'high') fallbackModels.push(...priorities.medium, ...priorities.low);
        if (level === 'medium') fallbackModels.push(...priorities.low);
        break;
      }
    }

    // Always add unlimited models as last resort
    fallbackModels.push(...priorities.unlimited);

    // Find first available model
    for (const model of fallbackModels) {
      if (model === originalModel) continue;
      
      const canUse = await this.canUseModel(model);
      if (canUse.canUse) {
        console.log(`🔄 Falling back from ${originalModel} to ${model}`);
        return model;
      }
    }

    return null;
  }

  async exportUsageReport() {
    const report = {
      timestamp: new Date().toISOString(),
      period: {
        daily: this.usage.lastReset.daily,
        hourly: this.usage.lastReset.hourly
      },
      usage: this.getUsageStatus(),
      summary: {
        totalRequestsToday: Object.values(this.usage.daily).reduce((a, b) => a + b, 0),
        totalRequestsThisHour: Object.values(this.usage.hourly).reduce((a, b) => a + b, 0),
        mostUsedModel: this.getMostUsedModel()
      }
    };

    const reportFile = path.join(process.cwd(), 'automation', 'data', `usage-report-${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    return report;
  }

  getMostUsedModel() {
    const dailyUsage = this.usage.daily;
    return Object.keys(dailyUsage).reduce((a, b) => dailyUsage[a] > dailyUsage[b] ? a : b, '');
  }
}

export default ModelUsageTracker;
