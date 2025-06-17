import express from 'express';
import Character from '../models/Character.js';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';
import { trackCharacterCreation, recordUsage } from '../middleware/usage.js';
import { MultiModelOrchestrator } from '../../automation/models/orchestrator.js';

const router = express.Router();
const orchestrator = new MultiModelOrchestrator();

// Initialize the orchestrator
orchestrator.initialize().catch(err => {
  console.error('Failed to initialize AI models:', err);
});

// @route   GET api/characters
// @desc    Get all characters for a user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const characters = await Character.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(characters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/characters/:id
// @desc    Get character by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    // Check if character exists
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    
    // Check if user owns character or character is public
    if (character.user.toString() !== req.user.id && !character.isPublic) {
      return res.status(401).json({ message: 'Not authorized to view this character' });
    }
    
    // Increment views if not owner
    if (character.user.toString() !== req.user.id) {
      character.meta.views += 1;
      await character.save();
    }
    
    res.json(character);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/characters
// @desc    Create a character
// @access  Private
router.post('/', 
  verifyToken,
  trackCharacterCreation,
  recordUsage('character_creation'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      
      // Check usage limits based on subscription plan
      const { plan } = user.subscription;
      const { charactersCreated } = user.usage;
      
      // Get plan limits
      let characterLimit;
      switch (plan) {
        case 'free':
          characterLimit = 5;
          break;
        case 'basic':
          characterLimit = 25;
          break;
        case 'pro':
          characterLimit = 100;
          break;
        case 'enterprise':
          characterLimit = Infinity;
          break;
        default:
          characterLimit = 5;
      }
      
      // Check if user has reached their limit
      if (charactersCreated >= characterLimit) {
        return res.status(403).json({
          message: `You have reached your limit of ${characterLimit} characters this month.`,
          currentUsage: charactersCreated,
          limit: characterLimit
        });
      }
      
      const { prompt, characterType, modelName = 'claude-3.7-sonnet' } = req.body;
      
      // Generate character using AI
      const result = await orchestrator.generateCharacter(prompt, { model: modelName });
      
      if (!result.success) {
        return res.status(500).json({ message: 'Failed to generate character' });
      }
      
      // Parse the AI response
      let characterData;
      try {
        // Attempt to parse JSON from the AI response
        const jsonMatch = result.response.match(/\{[\s\S]*\}/);
        characterData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        
        if (!characterData) {
          // Fallback to structured parsing if JSON not found
          const nameMatch = result.response.match(/name:?\s*["']?([^"'\n]+)["']?/i);
          const descriptionMatch = result.response.match(/description:?\s*["']?([^"'\n]+)["']?/i);
          
          characterData = {
            name: nameMatch ? nameMatch[1] : 'Unnamed Character',
            description: descriptionMatch ? descriptionMatch[1] : prompt,
            background: result.response
          };
        }
      } catch (error) {
        console.error('Error parsing AI response:', error);
        characterData = {
          name: 'Auto-generated Character',
          description: prompt,
          background: result.response
        };
      }
      
      // Create new character
      const newCharacter = new Character({
        user: req.user.id,
        name: characterData.name || 'Unnamed Character',
        description: characterData.description || prompt,
        characterType,
        background: characterData.background || '',
        abilities: characterData.abilities || [],
        appearance: characterData.appearance || {},
        personality: characterData.personality || [],
        story: characterData.story || '',
        generatedBy: result.model,
        tags: characterData.tags || []
      });
      
      // Save character
      const character = await newCharacter.save();
      
      // Update user usage
      user.usage.charactersCreated += 1;
      user.usage.apiCalls += 1;
      user.usage.lastUsed = Date.now();
      await user.save();
      
      res.json(character);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/characters/:id
// @desc    Update a character
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    // Check if character exists
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    
    // Check ownership
    if (character.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this character' });
    }
    
    // Update character fields
    const {
      name,
      description,
      characterType,
      background,
      abilities,
      appearance,
      personality,
      story,
      isPublic,
      tags
    } = req.body;
    
    if (name) character.name = name;
    if (description) character.description = description;
    if (characterType) character.characterType = characterType;
    if (background) character.background = background;
    if (abilities) character.abilities = abilities;
    if (appearance) character.appearance = appearance;
    if (personality) character.personality = personality;
    if (story) character.story = story;
    if (typeof isPublic !== 'undefined') character.isPublic = isPublic;
    if (tags) character.tags = tags;
    
    // Save changes
    await character.save();
    
    res.json(character);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/characters/:id
// @desc    Delete a character
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    // Check if character exists
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    
    // Check ownership
    if (character.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this character' });
    }
    
    // Delete character
    await character.remove();
    
    res.json({ message: 'Character removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/characters/public
// @desc    Get public characters
// @access  Private
router.get('/public', async (req, res) => {
  try {
    const characters = await Character.find({ isPublic: true })
      .sort({ 'meta.likes': -1, createdAt: -1 })
      .limit(50);
    
    res.json(characters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/characters/:id/like
// @desc    Like a character
// @access  Private
router.post('/:id/like', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    // Check if character exists
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    
    // Increment likes
    character.meta.likes += 1;
    await character.save();
    
    res.json({ likes: character.meta.likes });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.status(500).send('Server error');
  }
});

export default router;
