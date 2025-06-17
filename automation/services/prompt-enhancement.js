import { EventEmitter } from 'events';
import { MultiModelOrchestrator } from '../models/orchestrator.js';

export class PromptEnhancementService extends EventEmitter {
  constructor() {
    super();
    this.modelOrchestrator = new MultiModelOrchestrator();
    this.styles = {
      photorealistic: {
        name: 'Photorealistic',
        description: 'Realistic, detailed photographic style',
        prompt_suffix: ', photorealistic, high quality, professional photography, 8k uhd',
        negative_prompt: 'cartoon, anime, illustration, painting, drawing, low quality, blurry'
      },
      artistic: {
        name: 'Artistic',
        description: 'Creative artistic interpretation',
        prompt_suffix: ', artistic style, creative, imaginative, masterpiece quality',
        negative_prompt: 'photographic, mundane, low quality'
      },
      anime: {
        name: 'Anime',
        description: 'Japanese anime/manga style',
        prompt_suffix: ', anime style, manga art, cel shaded, vibrant',
        negative_prompt: 'realistic, photographic, western art'
      },
      fantasy: {
        name: 'Fantasy',
        description: 'Epic fantasy artwork style',
        prompt_suffix: ', fantasy art style, magical, ethereal, epic scene',
        negative_prompt: 'realistic, modern, urban, mundane'
      },
      cinematic: {
        name: 'Cinematic',
        description: 'Movie-like cinematic style',
        prompt_suffix: ', cinematic lighting, film grain, movie scene, dramatic',
        negative_prompt: 'flat lighting, simple background, amateur'
      }
    };
  }

  getAvailableStyles() {
    return Object.entries(this.styles).map(([id, style]) => ({
      id,
      name: style.name,
      description: style.description
    }));
  }

  async enhancePrompt(prompt, options = {}) {
    const { style = 'photorealistic' } = options;
    const selectedStyle = this.styles[style] || this.styles.photorealistic;

    try {
      // Use AI to enhance the base prompt
      const enhancementPrompt = `Enhance this image generation prompt to be more detailed and descriptive: "${prompt}"`;
      const enhancement = await this.modelOrchestrator.generateResponse(enhancementPrompt);
      
      // Combine enhanced prompt with style-specific additions
      const enhancedPrompt = `${enhancement.content}${selectedStyle.prompt_suffix}`;
      
      this.emit('promptEnhanced', { 
        originalPrompt: prompt,
        enhancedPrompt,
        style,
        negative_prompt: selectedStyle.negative_prompt
      });

      return {
        originalPrompt: prompt,
        enhancedPrompt,
        style,
        negative_prompt: selectedStyle.negative_prompt
      };
    } catch (error) {
      console.error('Prompt enhancement error:', error);
      // Fallback to basic enhancement if AI fails
      const basicEnhancedPrompt = `${prompt}${selectedStyle.prompt_suffix}`;
      return {
        originalPrompt: prompt,
        enhancedPrompt: basicEnhancedPrompt,
        style,
        negative_prompt: selectedStyle.negative_prompt
      };
    }
  }

  async suggestStyles(prompt) {
    try {
      const suggestionPrompt = `Analyze this image description and suggest the best artistic styles from this list: photorealistic, artistic, anime, fantasy, cinematic. Description: "${prompt}"`;
      const suggestions = await this.modelOrchestrator.generateResponse(suggestionPrompt);
      
      // Parse the AI response to get style recommendations
      const recommendedStyles = Object.keys(this.styles)
        .filter(style => suggestions.content.toLowerCase().includes(style.toLowerCase()))
        .slice(0, 3); // Get top 3 suggestions
      
      return recommendedStyles.length > 0 ? recommendedStyles : ['photorealistic'];
    } catch (error) {
      console.error('Style suggestion error:', error);
      return ['photorealistic']; // Default fallback
    }
  }
}