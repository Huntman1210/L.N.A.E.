import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { mockAIResponse, mockImageGeneration } from '../utils/mockServices.js';

const router = express.Router();

// Mock AI service for demo environment
const isDemoMode = process.env.DEMO_MODE === 'true';

// @route   POST api/demo/character
// @desc    Generate a demo character (no API keys required)
// @access  Public in demo mode
router.post('/character', isDemoMode ? [] : [verifyToken], async (req, res) => {
  try {
    const { prompt, characterType = 'fantasy', includeImage = false } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Character prompt is required' });
    }

    // In demo mode, return mock character data
    const character = await mockAIResponse(prompt, characterType);
    
    let imageUrl = null;
    if (includeImage) {
      imageUrl = await mockImageGeneration(character.name, character.description);
    }

    res.json({
      success: true,
      character: {
        ...character,
        imageUrl,
        generatedAt: new Date(),
        model: 'demo-gpt-4',
        tokensUsed: Math.floor(Math.random() * 1000) + 500
      }
    });

  } catch (error) {
    console.error('Demo character generation error:', error);
    res.status(500).json({ 
      message: 'Character generation failed',
      error: isDemoMode ? error.message : 'Internal server error'
    });
  }
});

// @route   POST api/demo/batch-characters
// @desc    Generate multiple demo characters
// @access  Public in demo mode
router.post('/batch-characters', isDemoMode ? [] : [verifyToken], async (req, res) => {
  try {
    const { prompts, characterType = 'fantasy', count = 1 } = req.body;

    if (!prompts && !count) {
      return res.status(400).json({ message: 'Either prompts array or count is required' });
    }

    const characters = [];
    const generatePrompts = prompts || Array(count).fill('Generate a random character');

    for (const prompt of generatePrompts.slice(0, 5)) { // Limit to 5 in demo
      const character = await mockAIResponse(prompt, characterType);
      characters.push({
        ...character,
        generatedAt: new Date(),
        model: 'demo-gpt-4'
      });
    }

    res.json({
      success: true,
      characters,
      generated: characters.length,
      model: 'demo-gpt-4'
    });

  } catch (error) {
    console.error('Demo batch generation error:', error);
    res.status(500).json({ 
      message: 'Batch generation failed',
      error: isDemoMode ? error.message : 'Internal server error'
    });
  }
});

// @route   GET api/demo/models
// @desc    Get available demo AI models
// @access  Public
router.get('/models', (req, res) => {
  const models = [
    {
      id: 'demo-gpt-4',
      name: 'GPT-4 (Demo)',
      description: 'Advanced language model for character creation',
      provider: 'OpenAI',
      capabilities: ['text-generation', 'character-creation'],
      available: true,
      cost: 'Free in demo'
    },
    {
      id: 'demo-claude-3',
      name: 'Claude 3 (Demo)',
      description: 'Anthropic\'s advanced AI for creative writing',
      provider: 'Anthropic',
      capabilities: ['text-generation', 'character-creation', 'dialogue'],
      available: true,
      cost: 'Free in demo'
    },
    {
      id: 'demo-gemini-pro',
      name: 'Gemini Pro (Demo)',
      description: 'Google\'s multimodal AI model',
      provider: 'Google',
      capabilities: ['text-generation', 'character-creation', 'world-building'],
      available: true,
      cost: 'Free in demo'
    },
    {
      id: 'demo-dall-e-3',
      name: 'DALL-E 3 (Demo)',
      description: 'Advanced image generation for character portraits',
      provider: 'OpenAI',
      capabilities: ['image-generation'],
      available: true,
      cost: 'Free in demo'
    }
  ];

  res.json({
    success: true,
    models,
    demoMode: isDemoMode
  });
});

// @route   POST api/demo/reset
// @desc    Reset demo data for a user
// @access  Public in demo mode
router.post('/reset', isDemoMode ? [] : [verifyToken], async (req, res) => {
  try {
    if (!isDemoMode) {
      return res.status(403).json({ message: 'Reset only available in demo mode' });
    }

    // In a real implementation, you would reset user's demo data
    // For now, just return success
    res.json({
      success: true,
      message: 'Demo data reset successfully',
      resetAt: new Date()
    });

  } catch (error) {
    console.error('Demo reset error:', error);
    res.status(500).json({ 
      message: 'Reset failed',
      error: error.message
    });
  }
});

// @route   GET api/demo/status
// @desc    Get demo environment status
// @access  Public
router.get('/status', (req, res) => {
  res.json({
    demoMode: isDemoMode,
    features: {
      characterGeneration: true,
      imageGeneration: true,
      batchProcessing: true,
      userAccounts: isDemoMode,
      subscriptions: false,
      realAIModels: false
    },
    limits: {
      charactersPerHour: 20,
      batchSize: 5,
      imageGeneration: 10
    },
    message: isDemoMode 
      ? 'Demo mode active - all features available with mock data'
      : 'Production mode - real AI models and authentication required'
  });
});

export default router;
