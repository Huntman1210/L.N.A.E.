/**
 * Mode Factory - Creates concrete mode implementations
 * Acts as a bridge between mode definitions and the BaseMode classes
 */

import {
  CoreDevelopmentMode,
  FrontendMode,
  BackendMode,
  AIMLMode
} from './core/BaseMode.js';

import {
  modeRegistry
} from './core/ModeRegistry.js';

/**
 * Create mode instances from definitions
 */
export const createModeInstance = (slug, config) => {
  switch (config.tier) {
    case 1:
      return new CoreDevelopmentMode({
        slug,
        ...config,
        onActivate: async () => {
          console.log(`🚀 Activating Core Development Mode: ${config.name}`);
          // Implement core development functionality
          return true;
        },
        onExecute: async (task) => {
          console.log(`🔧 Executing task in ${config.name} mode:`, task);
          // Implement task execution for core development
          return {
            success: true,
            result: {
              task: task.description,
              mode: config.name,
              capabilities: Array.from(config.capabilities || []).slice(0, 3),
              completed: new Date()
            }
          };
        }
      });
      
    case 2:
      return new FrontendMode({
        slug,
        ...config,
        onActivate: async () => {
          console.log(`🎨 Activating Frontend Mode: ${config.name}`);
          // Implement frontend development functionality
          return true;
        },
        onExecute: async (task) => {
          console.log(`🎨 Executing task in ${config.name} mode:`, task);
          // Implement task execution for frontend development
          return {
            success: true,
            result: {
              task: task.description,
              mode: config.name,
              ui: {
                components: ['sample-component-1', 'sample-component-2'],
                styles: ['responsive', 'animated']
              },
              completed: new Date()
            }
          };
        }
      });
      
    case 3:
      return new BackendMode({
        slug,
        ...config,
        onActivate: async () => {
          console.log(`🔧 Activating Backend Mode: ${config.name}`);
          // Implement backend development functionality
          return true;
        },
        onExecute: async (task) => {
          console.log(`🔧 Executing task in ${config.name} mode:`, task);
          // Implement task execution for backend development
          return {
            success: true,
            result: {
              task: task.description,
              mode: config.name,
              api: {
                endpoints: ['/api/sample', '/api/test'],
                methods: ['GET', 'POST']
              },
              completed: new Date()
            }
          };
        }
      });
      
    case 4:
      return new AIMLMode({
        slug,
        ...config,
        onActivate: async () => {
          console.log(`🤖 Activating AI/ML Mode: ${config.name}`);
          // Implement AI/ML development functionality
          return true;
        },
        onExecute: async (task) => {
          console.log(`🤖 Executing task in ${config.name} mode:`, task);
          // Implement task execution for AI/ML development
          return {
            success: true,
            result: {
              task: task.description,
              mode: config.name,
              model: {
                type: 'sample-model',
                parameters: {
                  learning_rate: 0.01,
                  epochs: 10
                }
              },
              completed: new Date()
            }
          };
        }
      });
      
    default:
      throw new Error(`Unknown tier ${config.tier} for mode ${slug}`);
  }
};

/**
 * Register all modes from definitions
 */
export const registerAllModes = async () => {
  console.log('🚀 Registering all modes...');
  
  try {
    // Import all mode definitions
    const { tier1Modes } = await import('./definitions/tier1-core-development.js');
    const { tier2Modes } = await import('./definitions/tier2-frontend.js');
    const { tier3Modes } = await import('./definitions/tier3-backend.js');
    const { tier4Modes } = await import('./definitions/tier4-aiml.js');
    
    // Register Tier 1 modes
    Object.entries(tier1Modes).forEach(([slug, config]) => {
      const mode = createModeInstance(slug, {
        ...config,
        tier: 1,
        category: 'core-development'
      });
      
      modeRegistry.registerMode(mode);
    });
    
    // Register Tier 2 modes
    Object.entries(tier2Modes).forEach(([slug, config]) => {
      const mode = createModeInstance(slug, {
        ...config,
        tier: 2,
        category: 'frontend'
      });
      
      modeRegistry.registerMode(mode);
    });
    
    // Register Tier 3 modes
    Object.entries(tier3Modes).forEach(([slug, config]) => {
      const mode = createModeInstance(slug, {
        ...config,
        tier: 3,
        category: 'backend'
      });
      
      modeRegistry.registerMode(mode);
    });
    
    // Register Tier 4 modes
    Object.entries(tier4Modes).forEach(([slug, config]) => {
      const mode = createModeInstance(slug, {
        ...config,
        tier: 4,
        category: 'ai-ml'
      });
      
      modeRegistry.registerMode(mode);
    });
    
    console.log(`✅ Registered ${modeRegistry.modes.size} modes`);
    return true;
  } catch (error) {
    console.error('Error registering modes:', error);
    return false;
  }
};

export default {
  createModeInstance,
  registerAllModes
};
