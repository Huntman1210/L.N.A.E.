// Model Usage Configuration
// This file defines usage limits similar to GitHub Copilot for all AI models

export const MODEL_USAGE_CONFIG = {
  // Usage limits per model (similar to Copilot's approach)
  limits: {
    // Daily limits
    daily: {
      'gpt-4': 50,              // 50 requests per day
      'gpt-3.5-turbo': 200,     // 200 requests per day  
      'claude-3-sonnet': 50,    // 50 requests per day
      'claude-3.7-sonnet': 50,  // 50 requests per day (with thinking)
      'claude-3-haiku': 200,    // 200 requests per day
      'gemini-pro': 100,        // 100 requests per day
      'mistral-large': 100,     // 100 requests per day
      'mistral-medium': 200,    // 200 requests per day
      'llama2': 500,            // 500 requests per day (local)
      'codellama': 500,         // 500 requests per day (local)
    },
    
    // Hourly limits (burst protection)
    hourly: {
      'gpt-4': 10,
      'gpt-3.5-turbo': 50,
      'claude-3-sonnet': 10,
      'claude-3.7-sonnet': 8,   // Slightly lower due to thinking overhead
      'claude-3-haiku': 50,
      'gemini-pro': 25,
      'mistral-large': 25,
      'mistral-medium': 50,
      'llama2': 100,
      'codellama': 100,
    },
    
    // Token limits per request
    tokens: {
      'gpt-4': 4000,
      'gpt-3.5-turbo': 4000,
      'claude-3-sonnet': 4000,
      'claude-3.7-sonnet': 8000,  // Higher token limit for thinking
      'claude-3-haiku': 4000,
      'gemini-pro': 4000,
      'mistral-large': 4000,
      'mistral-medium': 4000,
      'llama2': 4000,
      'codellama': 4000,
    }
  },
  
  // Priority levels (Copilot-style)
  priority: {
    high: ['gpt-4', 'claude-3-sonnet', 'claude-3.7-sonnet'],           // Premium models
    medium: ['gemini-pro', 'mistral-large'],      // Balanced models  
    low: ['gpt-3.5-turbo', 'claude-3-haiku', 'mistral-medium'], // Fast models
    unlimited: ['llama2', 'codellama']            // Local models
  },
  
  // Usage tracking
  tracking: {
    enableUsageTracking: true,
    enableRateLimiting: true,
    resetDaily: '00:00:00',
    resetHourly: true,
    logUsage: true,
    warningThreshold: 0.8,  // Warn at 80% usage
  },
  
  // Fallback strategy (like Copilot's graceful degradation)
  fallback: {
    enabled: true,
    strategy: 'priority_descent', // Fall back to lower priority models
    autoSwitch: true,
    notifyUser: true
  },
  
  // Model-specific features and capabilities
  features: {
    'claude-3.7-sonnet': {
      thinking: {
        enabled: true,
        showThinking: true,
        stepByStepReasoning: true,
        maxThinkingTokens: 4000,
        thinkingTimeout: 30000, // 30 seconds
        enableDeepAnalysis: true
      },
      capabilities: {
        reasoning: true,
        codeAnalysis: true,
        problemSolving: true,
        creativeWriting: true
      }
    },
    'claude-3-sonnet': {
      thinking: {
        enabled: false
      },
      capabilities: {
        reasoning: true,
        codeAnalysis: true,
        problemSolving: true
      }
    }
  }
};

export default MODEL_USAGE_CONFIG;
