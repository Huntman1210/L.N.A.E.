/**
 * Mode Registry - Central management system for all development modes
 * Handles dynamic loading, registration, and lifecycle management
 */

class ModeRegistry {
  constructor() {
    this.modes = new Map();
    this.categories = new Map();
    this.capabilities = new Map();
    this.inheritance = new Map();
    this.analytics = new Map();
    this.initialized = false;
  }

  /**
   * Initialize the registry with all mode definitions
   */
  async initialize() {
    if (this.initialized) return;
    
    console.log('🚀 Initializing Mode Registry...');
    
    // Load mode definitions from configuration
    await this.loadModeDefinitions();
    
    // Setup inheritance hierarchy
    await this.setupInheritance();
    
    // Initialize analytics tracking
    this.initializeAnalytics();
    
    this.initialized = true;
    console.log(`✅ Mode Registry initialized with ${this.modes.size} modes`);
  }

  /**
   * Register a new mode
   */
  registerMode(modeConfig) {
    const { slug, name, tier, category, capabilities, tools, permissions } = modeConfig;
    
    if (this.modes.has(slug)) {
      throw new Error(`Mode ${slug} already registered`);
    }

    const mode = {
      slug,
      name,
      tier,
      category,
      capabilities: new Set(capabilities || []),
      tools: new Set(tools || []),
      permissions: new Set(permissions || []),
      parent: modeConfig.extends || null,
      children: new Set(),
      metadata: {
        description: modeConfig.description,
        expertise: modeConfig.expertise || [],
        frameworks: modeConfig.frameworks || [],
        languages: modeConfig.languages || [],
        patterns: modeConfig.patterns || [],
        created: new Date(),
        lastUsed: null,
        usageCount: 0
      }
    };

    this.modes.set(slug, mode);
    this.addToCategory(category, slug);
    this.capabilities.set(slug, capabilities || []);
    
    console.log(`📝 Registered mode: ${name} (${slug})`);
    return mode;
  }

  /**
   * Get mode by slug
   */
  getMode(slug) {
    return this.modes.get(slug);
  }

  /**
   * Get all modes in a category
   */
  getModesByCategory(category) {
    const categoryModes = this.categories.get(category);
    if (!categoryModes) return [];
    
    return Array.from(categoryModes).map(slug => this.modes.get(slug));
  }

  /**
   * Get modes by tier
   */
  getModesByTier(tier) {
    return Array.from(this.modes.values()).filter(mode => mode.tier === tier);
  }

  /**
   * Search modes by capability
   */
  searchByCapability(capability) {
    return Array.from(this.modes.values()).filter(mode => 
      mode.capabilities.has(capability)
    );
  }

  /**
   * Get mode recommendations based on context
   */
  getRecommendations(context) {
    const { task, domain, complexity, preferences } = context;
    const recommendations = [];

    // Score modes based on relevance
    for (const [slug, mode] of this.modes) {
      const score = this.calculateRelevanceScore(mode, context);
      if (score > 0.5) {
        recommendations.push({ mode, score });
      }
    }

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(r => r.mode);
  }

  /**
   * Track mode usage for analytics
   */
  trackUsage(slug, operation, duration) {
    const mode = this.modes.get(slug);
    if (!mode) return;

    mode.metadata.lastUsed = new Date();
    mode.metadata.usageCount++;

    if (!this.analytics.has(slug)) {
      this.analytics.set(slug, {
        totalUsage: 0,
        avgDuration: 0,
        operations: new Map(),
        lastWeek: []
      });
    }

    const analytics = this.analytics.get(slug);
    analytics.totalUsage++;
    analytics.operations.set(operation, (analytics.operations.get(operation) || 0) + 1);
    analytics.lastWeek.push({ date: new Date(), operation, duration });

    // Keep only last 7 days
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    analytics.lastWeek = analytics.lastWeek.filter(entry => entry.date > weekAgo);
  }

  /**
   * Get analytics for a mode
   */
  getAnalytics(slug) {
    return this.analytics.get(slug) || null;
  }

  /**
   * Get system-wide analytics
   */
  getSystemAnalytics() {
    const totalModes = this.modes.size;
    const totalUsage = Array.from(this.analytics.values())
      .reduce((sum, analytics) => sum + analytics.totalUsage, 0);
    
    const modesByTier = {};
    const modesByCategory = {};

    for (const mode of this.modes.values()) {
      modesByTier[mode.tier] = (modesByTier[mode.tier] || 0) + 1;
      modesByCategory[mode.category] = (modesByCategory[mode.category] || 0) + 1;
    }

    return {
      totalModes,
      totalUsage,
      modesByTier,
      modesByCategory,
      mostUsed: this.getMostUsedModes(10),
      recentlyAdded: this.getRecentlyAddedModes(5)
    };
  }

  // Private methods

  async loadModeDefinitions() {
    console.log('📚 Loading mode definitions...');
    
    try {
      // Load mode definitions from all tiers
      // Note: The actual loading is done in the ModeManager component
      // This method is kept for extensibility, in case we want to load
      // modes from different sources or dynamically in the future
    } catch (error) {
      console.error('Error loading mode definitions:', error);
    }
  }

  async setupInheritance() {
    // Setup parent-child relationships
    for (const [slug, mode] of this.modes) {
      if (mode.parent) {
        const parent = this.modes.get(mode.parent);
        if (parent) {
          parent.children.add(slug);
          this.inheritance.set(slug, mode.parent);
        }
      }
    }
  }

  addToCategory(category, slug) {
    if (!this.categories.has(category)) {
      this.categories.set(category, new Set());
    }
    this.categories.get(category).add(slug);
  }

  calculateRelevanceScore(mode, context) {
    let score = 0;
    
    // Task relevance
    if (context.domain && mode.metadata.expertise.includes(context.domain)) {
      score += 0.4;
    }
    
    // Complexity match
    const tierComplexity = {
      1: 'basic',
      2: 'intermediate', 
      3: 'advanced',
      4: 'expert'
    };
    
    if (tierComplexity[mode.tier] === context.complexity) {
      score += 0.3;
    }
    
    // Usage history
    if (mode.metadata.usageCount > 0) {
      score += Math.min(0.2, mode.metadata.usageCount / 100);
    }
    
    // Recent activity
    if (mode.metadata.lastUsed) {
      const daysSinceUse = (Date.now() - mode.metadata.lastUsed) / (1000 * 60 * 60 * 24);
      if (daysSinceUse < 7) {
        score += 0.1 * (7 - daysSinceUse) / 7;
      }
    }

    return Math.min(1, score);
  }

  initializeAnalytics() {
    console.log('📊 Initializing analytics tracking...');
  }

  getMostUsedModes(limit) {
    return Array.from(this.modes.values())
      .sort((a, b) => b.metadata.usageCount - a.metadata.usageCount)
      .slice(0, limit)
      .map(mode => ({ slug: mode.slug, name: mode.name, usage: mode.metadata.usageCount }));
  }

  getRecentlyAddedModes(limit) {
    return Array.from(this.modes.values())
      .sort((a, b) => b.metadata.created - a.metadata.created)
      .slice(0, limit)
      .map(mode => ({ slug: mode.slug, name: mode.name, created: mode.metadata.created }));
  }
}

// Singleton instance
export const modeRegistry = new ModeRegistry();
export default ModeRegistry;