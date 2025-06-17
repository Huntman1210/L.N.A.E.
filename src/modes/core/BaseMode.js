/**
 * Base Mode Class - Foundation for all development modes
 * Provides common functionality, tool access, and lifecycle management
 */

import { modeRegistry } from './ModeRegistry.js';

export class BaseMode {
  constructor(config) {
    this.slug = config.slug;
    this.name = config.name;
    this.tier = config.tier;
    this.category = config.category;
    this.description = config.description;
    this.capabilities = new Set(config.capabilities || []);
    this.tools = new Set(config.tools || []);
    this.permissions = new Set(config.permissions || []);
    this.context = {};
    this.state = 'inactive';
    this.metadata = {
      created: new Date(),
      lastActivated: null,
      totalActivations: 0,
      averageSessionDuration: 0,
      successRate: 0
    };
    
    // Initialize mode-specific properties
    this.initialize(config);
  }

  /**
   * Initialize mode-specific properties
   * Override in subclasses for custom initialization
   */
  initialize(config) {
    // Default implementation
  }

  /**
   * Activate the mode
   */
  async activate(context = {}) {
    try {
      this.state = 'activating';
      this.context = { ...this.context, ...context };
      
      // Pre-activation hooks
      await this.preActivate();
      
      // Load required tools and capabilities
      await this.loadTools();
      await this.loadCapabilities();
      
      // Mode-specific activation
      await this.onActivate();
      
      this.state = 'active';
      this.metadata.lastActivated = new Date();
      this.metadata.totalActivations++;
      
      // Track activation
      modeRegistry.trackUsage(this.slug, 'activate', 0);
      
      console.log(`✅ Mode activated: ${this.name}`);
      return true;
    } catch (error) {
      this.state = 'error';
      console.error(`❌ Failed to activate mode ${this.name}:`, error);
      return false;
    }
  }

  /**
   * Deactivate the mode
   */
  async deactivate() {
    try {
      this.state = 'deactivating';
      
      // Pre-deactivation hooks
      await this.preDeactivate();
      
      // Mode-specific deactivation
      await this.onDeactivate();
      
      // Cleanup
      await this.cleanup();
      
      this.state = 'inactive';
      console.log(`⏹️ Mode deactivated: ${this.name}`);
      return true;
    } catch (error) {
      this.state = 'error';
      console.error(`❌ Failed to deactivate mode ${this.name}:`, error);
      return false;
    }
  }

  /**
   * Execute a task using this mode
   */
  async execute(task, options = {}) {
    const startTime = Date.now();
    
    try {
      // Validate task
      if (!this.canExecute(task)) {
        throw new Error(`Mode ${this.name} cannot execute task: ${task.type}`);
      }
      
      // Pre-execution hooks
      await this.preExecute(task, options);
      
      // Execute the task
      const result = await this.onExecute(task, options);
      
      // Post-execution hooks
      await this.postExecute(task, options, result);
      
      const duration = Date.now() - startTime;
      
      // Track execution
      modeRegistry.trackUsage(this.slug, 'execute', duration);
      
      return {
        success: true,
        result,
        duration,
        mode: this.slug
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      console.error(`❌ Execution failed in mode ${this.name}:`, error);
      
      return {
        success: false,
        error: error.message,
        duration,
        mode: this.slug
      };
    }
  }

  /**
   * Check if this mode can execute a specific task
   */
  canExecute(task) {
    // Check if mode has required capabilities
    if (task.requiredCapabilities) {
      for (const capability of task.requiredCapabilities) {
        if (!this.capabilities.has(capability)) {
          return false;
        }
      }
    }
    
    // Check if mode has required tools
    if (task.requiredTools) {
      for (const tool of task.requiredTools) {
        if (!this.tools.has(tool)) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Get mode capabilities
   */
  getCapabilities() {
    return Array.from(this.capabilities);
  }

  /**
   * Get available tools
   */
  getTools() {
    return Array.from(this.tools);
  }

  /**
   * Get mode permissions
   */
  getPermissions() {
    return Array.from(this.permissions);
  }

  /**
   * Update context
   */
  updateContext(newContext) {
    this.context = { ...this.context, ...newContext };
  }

  /**
   * Get current state
   */
  getState() {
    return {
      slug: this.slug,
      name: this.name,
      state: this.state,
      context: this.context,
      capabilities: this.getCapabilities(),
      tools: this.getTools(),
      permissions: this.getPermissions(),
      metadata: this.metadata
    };
  }

  // Lifecycle hooks - override in subclasses

  async preActivate() {
    // Override in subclasses
  }

  async onActivate() {
    // Override in subclasses
  }

  async preDeactivate() {
    // Override in subclasses
  }

  async onDeactivate() {
    // Override in subclasses
  }

  async preExecute(task, options) {
    // Override in subclasses
  }

  async onExecute(task, options) {
    throw new Error('onExecute must be implemented in subclass');
  }

  async postExecute(task, options, result) {
    // Override in subclasses
  }

  async cleanup() {
    // Override in subclasses
  }

  // Tool and capability loading

  async loadTools() {
    // Load tools based on mode requirements
    console.log(`🔧 Loading tools for ${this.name}...`);
  }

  async loadCapabilities() {
    // Load capabilities based on mode requirements
    console.log(`⚡ Loading capabilities for ${this.name}...`);
  }
}

/**
 * Specialized base classes for different tiers
 */

export class CoreDevelopmentMode extends BaseMode {
  constructor(config) {
    super({
      ...config,
      tier: 1,
      category: 'core-development',
      capabilities: [
        'code-analysis',
        'code-generation',
        'debugging',
        'architecture-design',
        'best-practices',
        ...(config.capabilities || [])
      ]
    });
  }

  async onActivate() {
    console.log(`🚀 Activating Core Development Mode: ${this.name}`);
    // Load development tools and frameworks
    await this.loadDevelopmentTools();
  }

  async loadDevelopmentTools() {
    // Load IDEs, compilers, debuggers, etc.
    console.log('🛠️ Loading development tools...');
  }
}

export class FrontendMode extends BaseMode {
  constructor(config) {
    super({
      ...config,
      tier: 2,
      category: 'frontend',
      capabilities: [
        'ui-design',
        'ux-optimization',
        'responsive-design',
        'performance-optimization',
        'accessibility',
        'browser-compatibility',
        ...(config.capabilities || [])
      ]
    });
  }

  async onActivate() {
    console.log(`🎨 Activating Frontend Mode: ${this.name}`);
    await this.loadFrontendTools();
  }

  async loadFrontendTools() {
    // Load browser dev tools, design systems, etc.
    console.log('🎨 Loading frontend tools...');
  }
}

export class BackendMode extends BaseMode {
  constructor(config) {
    super({
      ...config,
      tier: 3,
      category: 'backend',
      capabilities: [
        'api-design',
        'database-design',
        'server-architecture',
        'security',
        'scalability',
        'performance-tuning',
        ...(config.capabilities || [])
      ]
    });
  }

  async onActivate() {
    console.log(`🔧 Activating Backend Mode: ${this.name}`);
    await this.loadBackendTools();
  }

  async loadBackendTools() {
    // Load servers, databases, monitoring tools, etc.
    console.log('🔧 Loading backend tools...');
  }
}

export class AIMLMode extends BaseMode {
  constructor(config) {
    super({
      ...config,
      tier: 4,
      category: 'ai-ml',
      capabilities: [
        'machine-learning',
        'deep-learning',
        'data-science',
        'model-training',
        'model-deployment',
        'ai-ethics',
        ...(config.capabilities || [])
      ]
    });
  }

  async onActivate() {
    console.log(`🤖 Activating AI/ML Mode: ${this.name}`);
    await this.loadAIMLTools();
  }

  async loadAIMLTools() {
    // Load ML frameworks, GPU resources, etc.
    console.log('🤖 Loading AI/ML tools...');
  }
}

export default BaseMode;