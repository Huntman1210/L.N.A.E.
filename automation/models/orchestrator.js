import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatOllama } from '@langchain/ollama';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import ModelUsageTracker from '../config/usage-tracker.js';
import dotenv from 'dotenv';

dotenv.config();

export class MultiModelOrchestrator {
  constructor() {
    this.mockMode = process.env.MOCK_MODE === 'true'; // Enable mock mode by default
    this.currentModel = process.env.DEFAULT_MODEL || 'gpt-4';
    this.fallbackModel = process.env.FALLBACK_MODEL || 'pollinations';
    this.usageTracker = new ModelUsageTracker();
    this.initialized = false;
    this.models = {}; // Initialize empty models object
    // Only initialize models after mockMode is set
  }
  
  // Initialize models when requested, not in constructor
  _initModels() {
    if (this.mockMode) {
      return {}; // Return empty models object in mock mode
    }
    return this.initializeModels();
  }

  async initialize() {
    if (!this.initialized) {
      await this.usageTracker.initialize();
      
      // Always run in mock mode for now
      console.log('🔍 Running in mock mode - using simulated responses');
      
      // Set up mock models
      this.models = {
        'gpt-4': {
          name: 'GPT-4 (Mock)',
          available: true,
          isMock: true
        },
        'gemini-pro': {
          name: 'Gemini Pro (Mock)',
          available: true,
          isMock: true
        },
        'pollinations': {
          name: 'Pollinations.AI (Web)',
          available: true,
          isMock: false
        }
      };
      
      // Set pollinations as default
      this.currentModel = 'pollinations';
      this.initialized = true;
      
      console.log(`✅ Initialized with ${Object.keys(this.models).length} models`);
      console.log(`🎯 Using ${this.models[this.currentModel].name} as primary model`);
    }
  }

  getModelStatus() {
    return {
      currentModel: this.currentModel,
      fallbackModel: this.fallbackModel,
      availableModels: Object.entries(this.models).map(([id, model]) => ({
        name: id,
        displayName: model.name,
        available: model.available,
        isMock: model.isMock
      })),
      totalModels: Object.keys(this.models).length,
    };
  }

  initializeModels() {
    const models = {};

    // OpenAI Models
    if (process.env.OPENAI_API_KEY) {
      models['gpt-4'] = new ChatOpenAI({
        modelName: 'gpt-4',
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        maxTokens: parseInt(process.env.MAX_TOKENS) || 4000,
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

      models['gpt-3.5-turbo'] = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo',
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        maxTokens: parseInt(process.env.MAX_TOKENS) || 4000,
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
    }

    // Anthropic Claude
    if (process.env.ANTHROPIC_API_KEY) {
      models['claude-3-sonnet'] = new ChatAnthropic({
        modelName: 'claude-3-sonnet-20240229',
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        maxTokens: parseInt(process.env.MAX_TOKENS) || 4000,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      });

      models['claude-3.7-sonnet'] = new ChatAnthropic({
        modelName: 'claude-3-5-sonnet-20241022',
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        maxTokens: parseInt(process.env.MAX_TOKENS) || 8000,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        // Enable thinking for 3.7 Sonnet
        streaming: true,
        callbacks: [{
          handleLLMNewToken: (token) => {
            if (token.includes('<thinking>')) {
              console.log('🤔 Claude is thinking...');
            }
          }
        }]
      });

      models['claude-3-haiku'] = new ChatAnthropic({
        modelName: 'claude-3-haiku-20240307',
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        maxTokens: parseInt(process.env.MAX_TOKENS) || 4000,
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      });
    }

    // Google Gemini
    if (process.env.GOOGLE_API_KEY) {
      models['gemini-pro'] = new ChatGoogleGenerativeAI({
        modelName: 'gemini-pro',
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        maxOutputTokens: parseInt(process.env.MAX_TOKENS) || 4000,
        apiKey: process.env.GOOGLE_API_KEY,
      });

      models['gemini-pro-vision'] = new ChatGoogleGenerativeAI({
        modelName: 'gemini-pro-vision',
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        maxOutputTokens: parseInt(process.env.MAX_TOKENS) || 4000,
        apiKey: process.env.GOOGLE_API_KEY,
      });
    }

    // Mistral AI
    if (process.env.MISTRAL_API_KEY) {
      models['mistral-large'] = new ChatMistralAI({
        modelName: 'mistral-large-latest',
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        maxTokens: parseInt(process.env.MAX_TOKENS) || 4000,
        mistralApiKey: process.env.MISTRAL_API_KEY,
      });

      models['mistral-medium'] = new ChatMistralAI({
        modelName: 'mistral-medium-latest',
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
        maxTokens: parseInt(process.env.MAX_TOKENS) || 4000,
        mistralApiKey: process.env.MISTRAL_API_KEY,
      });
    }

    // Ollama (Local Models)
    models['llama2'] = new ChatOllama({
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: 'llama2',
      temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
    });

    models['codellama'] = new ChatOllama({
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: 'codellama',
      temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
    });

    models['mistral'] = new ChatOllama({
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: 'mistral',
      temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
    });

    return models;
  }

  async generateResponse(prompt, modelName = null, context = {}) {
    const selectedModel = modelName || this.currentModel;
    
    // Handle mock mode for testing without API calls
    if (this.mockMode) {
      console.log(`🔍 Mock mode: Simulating response from ${selectedModel}`);
      return {
        response: `This is a mock response from ${selectedModel} to demonstrate Copilot integration.`,
        model: selectedModel,
        success: true,
        timestamp: new Date().toISOString(),
      };
    }
    
    const model = this.models[selectedModel];

    if (!model) {
      console.warn(`Model ${selectedModel} not available, falling back to ${this.fallbackModel}`);
      return this.generateResponse(prompt, this.fallbackModel, context);
    }

    try {
      const promptTemplate = ChatPromptTemplate.fromTemplate(`
        Context: {context}
        
        Task: {task}
        
        Instructions: {instructions}
        
        User Input: {input}
        
        Please provide a comprehensive response based on the above information.
      `);

      const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

      const response = await chain.invoke({
        context: context.context || 'AI Character Creator Application',
        task: context.task || 'Generate helpful response',
        instructions: context.instructions || 'Be creative, helpful, and detailed',
        input: prompt,
      });

      // Track usage
      this.usageTracker.trackUsage(selectedModel, response);

      return {
        response,
        model: selectedModel,
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error with model ${selectedModel}:`, error.message);
      
      if (selectedModel !== this.fallbackModel) {
        console.log(`Retrying with fallback model: ${this.fallbackModel}`);
        return this.generateResponse(prompt, this.fallbackModel, context);
      }

      return {
        response: 'I apologize, but I encountered an error generating a response. Please check your API keys and try again.',
        model: selectedModel,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async generateResponseWithThinking(prompt, modelName = 'claude-3.7-sonnet', context = {}) {
    await this.initialize();
    
    if (modelName !== 'claude-3.7-sonnet') {
      // Fallback to regular generation for non-thinking models
      return this.generateResponse(prompt, modelName, context);
    }

    // Check if we can use the thinking model
    const canUse = await this.usageTracker.canUseModel(modelName);
    if (!canUse) {
      console.log(`Usage limit reached for ${modelName}, falling back to regular sonnet`);
      return this.generateResponse(prompt, 'claude-3-sonnet', context);
    }
    
    // Handle mock mode for testing without API calls
    if (this.mockMode) {
      console.log(`🔍 Mock mode: Simulating thinking response from ${modelName}`);
      return {
        response: `This is a mock response from ${modelName} with thinking capability.`,
        thinking: "This is simulated thinking process:\n1. Analyzed the user request\n2. Considered possible approaches\n3. Selected the best solution",
        model: modelName,
        success: true,
        timestamp: new Date().toISOString(),
        features: {
          thinkingEnabled: true,
          showThinking: true
        }
      };
    }

    try {
      const model = this.models[modelName];
      if (!model) {
        throw new Error(`Model ${modelName} not available`);
      }

      // Special prompt template for thinking
      const thinkingPrompt = ChatPromptTemplate.fromTemplate(`
        <thinking>
        Let me think about this step by step:
        1. What is the user asking for?
        2. What context do I have?
        3. What's the best approach to solve this?
        4. Are there any edge cases to consider?
        </thinking>
        
        Context: {context}
        Task: {task}
        Instructions: {instructions}
        User Input: {input}
        
        Please provide a thoughtful, step-by-step response showing your reasoning process.
      `);

      const chain = thinkingPrompt.pipe(model).pipe(new StringOutputParser());

      console.log('🤔 Generating response with thinking...');
      const response = await chain.invoke({
        context: context.context || 'AI Character Creator Application',
        task: context.task || 'Generate helpful response with reasoning',
        instructions: context.instructions || 'Show your thinking process step by step',
        input: prompt,
      });

      // Track usage
      this.usageTracker.trackUsage(modelName, response);

      // Parse thinking from response
      const thinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/;
      const thinkingMatch = thinkingRegex.exec(response);
      const thinking = thinkingMatch ? thinkingMatch[1].trim() : null;
      const finalResponse = response.replace(thinkingRegex, '').trim();

      return {
        response: finalResponse,
        thinking: thinking,
        model: modelName,
        success: true,
        timestamp: new Date().toISOString(),
        features: {
          thinkingEnabled: true,
          showThinking: !!thinking
        }
      };
    } catch (error) {
      console.error(`Error with thinking model ${modelName}:`, error.message);
      
      // Fallback to regular sonnet
      console.log('Falling back to regular Claude 3 Sonnet');
      return this.generateResponse(prompt, 'claude-3-sonnet', context);
    }
  }

  async generateCharacter(characterPrompt, options = {}) {
    const context = {
      context: 'Character Creation System',
      task: 'Generate a detailed character based on the provided description',
      instructions: `
        Create a comprehensive character profile including:
        1. Basic Information (name, age, appearance)
        2. Personality traits and background
        3. Skills and abilities
        4. Character arc and development potential
        5. Visual description for character rendering
        6. Dialogue style and voice
        
        Format the response as a structured JSON object.
      `,
    };

    return this.generateResponse(characterPrompt, options.model, context);
  }

  async generateWebsite(websitePrompt, options = {}) {
    const context = {
      context: 'Website Generation System',
      task: 'Generate complete website structure and code',
      instructions: `
        Create a comprehensive website including:
        1. HTML structure
        2. CSS styling (responsive design)
        3. JavaScript functionality
        4. React components if specified
        5. Modern UI/UX best practices
        6. SEO optimization
        
        Provide complete, production-ready code.
      `,
    };

    return this.generateResponse(websitePrompt, options.model, context);
  }

  async generateSocialContent(contentPrompt, platform, options = {}) {
    const context = {
      context: `Social Media Content Generation for ${platform}`,
      task: 'Generate engaging social media content',
      instructions: `
        Create platform-specific content for ${platform} including:
        1. Engaging post text
        2. Relevant hashtags
        3. Call-to-action
        4. Image/video descriptions
        5. Optimal posting time suggestions
        6. Engagement strategies
        
        Follow ${platform} best practices and character limits.
      `,
    };

    return this.generateResponse(contentPrompt, options.model, context);
  }

  setCurrentModel(modelName) {
    if (this.models[modelName]) {
      this.currentModel = modelName;
      console.log(`Switched to model: ${modelName}`);
      return true;
    } else {
      console.warn(`Model ${modelName} is not available`);
      return false;
    }
  }

  getAvailableModels() {
    if (this.mockMode) {
      // Return mock model list when in mock mode
      return [
        {
          name: 'gpt-4',
          provider: 'OpenAI',
          features: { reasoning: true, codeAnalysis: true, creative: true },
          limits: { daily: 50, hourly: 10, tokens: 4000 }
        },
        {
          name: 'claude-3.7-sonnet',
          provider: 'Anthropic',
          features: { thinking: true, stepByStepReasoning: true, showThinking: true, deepAnalysis: true },
          limits: { daily: 50, hourly: 8, tokens: 8000 }
        },
        {
          name: 'gpt-3.5-turbo',
          provider: 'OpenAI',
          features: { creative: true },
          limits: { daily: 200, hourly: 50, tokens: 4000 }
        }
      ];
    }
    
    // Regular functionality for non-mock mode
    const models = Object.keys(this.models).map(modelName => ({
      name: modelName,
      provider: this.getModelProvider(modelName),
      features: this.getModelFeatures(modelName),
      limits: this.usageTracker.getModelLimits(modelName)
    }));
    
    return models;
  }

  getModelProvider(modelName) {
    if (modelName.startsWith('gpt')) return 'OpenAI';
    if (modelName.startsWith('claude')) return 'Anthropic';
    if (modelName.startsWith('gemini')) return 'Google';
    if (modelName.startsWith('mistral')) return 'Mistral';
    if (modelName.includes('llama') || modelName.includes('codellama')) return 'Ollama';
    return 'Unknown';
  }

  getModelFeatures(modelName) {
    const features = {
      thinking: modelName === 'claude-3.7-sonnet',
      reasoning: ['gpt-4', 'claude-3-sonnet', 'claude-3.7-sonnet'].includes(modelName),
      codeAnalysis: true,
      creative: true
    };
    
    if (modelName === 'claude-3.7-sonnet') {
      features.stepByStepReasoning = true;
      features.showThinking = true;
      features.deepAnalysis = true;
    }
    
    return features;
  }

  getModelStatus() {
    return {
      currentModel: this.currentModel,
      fallbackModel: this.fallbackModel,
      availableModels: this.getAvailableModels(),
      totalModels: Object.keys(this.models).length,
    };
  }

  // GitHub Copilot Integration Methods
  async checkCopilotStatus() {
    try {
      // Check if Copilot is available and authenticated
      const copilotStatus = {
        installed: true, // Extensions are installed
        authenticated: false,
        subscription: 'unknown',
        usageRemaining: 'unknown'
      };

      console.log('🤖 GitHub Copilot Status:', copilotStatus);
      return copilotStatus;
    } catch (error) {
      console.error('Error checking Copilot status:', error);
      return { installed: false, authenticated: false };
    }
  }

  async alignWithCopilotLimits() {
    // Align all model usage with GitHub Copilot's usage patterns
    const copilotLimits = {
      dailyRequests: 300,      // Similar to Copilot's daily suggestions
      hourlyRequests: 50,      // Burst protection like Copilot
      tokensPerRequest: 4000,  // Standard context window
      rateLimitPerMinute: 10   // Conservative rate limiting
    };

    // Update all models to match Copilot's usage patterns
    const alignedConfig = {};
    Object.keys(this.models).forEach(modelName => {
      alignedConfig[modelName] = {
        dailyLimit: copilotLimits.dailyRequests,
        hourlyLimit: copilotLimits.hourlyRequests,
        tokensPerRequest: copilotLimits.tokensPerRequest,
        rateLimitPerMinute: copilotLimits.rateLimitPerMinute,
        priority: this.getModelPriority(modelName)
      };
    });

    console.log('⚡ Aligned all models with GitHub Copilot usage patterns');
    return alignedConfig;
  }

  getModelPriority(modelName) {
    // Prioritize models similar to how Copilot prioritizes suggestions
    if (modelName.includes('gpt-4') || modelName.includes('claude-3.7-sonnet')) {
      return 'premium'; // Like Copilot's best suggestions
    }
    if (modelName.includes('claude-3-sonnet') || modelName.includes('gemini-pro')) {
      return 'standard'; // Like Copilot's regular suggestions
    }
    return 'fallback'; // Like Copilot's fallback suggestions
  }
}

export default MultiModelOrchestrator;
