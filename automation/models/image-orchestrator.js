import OpenAI from 'openai';
import axios from 'axios';
import { EventEmitter } from 'events';
import dotenv from 'dotenv';

dotenv.config();

class ImageOrchestrator extends EventEmitter {
  constructor() {
    super();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.providers = {
      'automatic1111': {
        name: 'Automatic1111 (Local GPU)',
        available: false, // Will be checked dynamically
        generate: this.generateWithAutomatic1111.bind(this),
        url: process.env.AUTOMATIC1111_URL || 'http://localhost:7860'
      },
      'comfyui': {
        name: 'ComfyUI (Local GPU)',
        available: false,
        generate: this.generateWithComfyUI.bind(this),
        url: process.env.COMFYUI_URL || 'http://localhost:8188'
      },
      'stable-diffusion': {
        name: 'Stable Diffusion WebUI',
        available: false,
        generate: this.generateWithStableDiffusion.bind(this),
        url: process.env.STABLE_DIFFUSION_URL || 'http://localhost:7861'
      },
      'dall-e-3': {
        name: 'DALL-E 3 (Cloud)',
        available: !!process.env.OPENAI_API_KEY,
        generate: this.generateWithDALLE3.bind(this)
      },
      'dall-e-2': {
        name: 'DALL-E 2 (Cloud)',
        available: !!process.env.OPENAI_API_KEY,
        generate: this.generateWithDALLE2.bind(this)
      },
      'pollinations': {
        name: 'Pollinations.AI (Free Web)',
        available: true,
        generate: this.generateWithPollinations.bind(this)
      },
      'craiyon': {
        name: 'Craiyon (Free Web)',
        available: true,
        generate: this.generateWithCraiyon.bind(this)
      },
      'leonardo': {
        name: 'Leonardo.AI (Web)',
        available: !!process.env.LEONARDO_API_KEY,
        generate: this.generateWithLeonardo.bind(this)
      },
      'replicate': {
        name: 'Replicate (Web)',
        available: !!process.env.REPLICATE_API_TOKEN,
        generate: this.generateWithReplicate.bind(this)
      }
    };
    
    // Initialize history tracking
    this.generationHistory = [];
    this.maxHistorySize = 100;
    
    // Set default provider
    this.currentProvider = 'pollinations';

    // Initialize providers asynchronously
    this.initializeProviders().catch(error => {
      console.log('Provider initialization error:', error.message);
      console.log('Using Pollinations.AI as fallback provider');
    });

    // Set up event handlers
    this.on('generationStart', (data) => {
      console.log(`🎨 Starting image generation with ${this.providers[this.currentProvider].name}`);
    });

    this.on('generationComplete', (data) => {
      this.addToHistory({
        id: this.generateId(),
        timestamp: Date.now(),
        provider: this.currentProvider,
        prompt: data.prompt,
        options: data.options,
        results: data.images
      });
    });
  }

  async initializeProviders() {
    try {
      await this.checkProviderAvailability();
    } catch (error) {
      console.log('Provider initialization completed with default settings');
    }
  }

  async generateImage(prompt, options = {}) {
    try {
      const {
        provider = this.currentProvider,
        size = '1024x1024',
        quality = 'standard',
        style = 'vivid',
        n = 1,
        userId = 'anonymous'
      } = options;

      // Emit generation start event
      this.emit('generationStart', {
        prompt,
        provider,
        options,
        timestamp: new Date().toISOString(),
        userId
      });

      // Validate provider
      if (!this.providers[provider] || !this.providers[provider].available) {
        throw new Error(`Provider ${provider} is not available`);
      }

      // Generate image
      const result = await this.providers[provider].generate(prompt, options);
      
      // Store in history
      const generationRecord = {
        id: this.generateId(),
        prompt,
        provider,
        options,
        result,
        timestamp: new Date().toISOString(),
        userId
      };
      
      this.addToHistory(generationRecord);

      // Emit success event
      this.emit('generationComplete', generationRecord);

      return {
        success: true,
        data: result,
        id: generationRecord.id,
        provider,
        metadata: {
          prompt,
          timestamp: generationRecord.timestamp,
          options
        }
      };

    } catch (error) {
      console.error('Image generation error:', error);
      
      // Emit error event
      this.emit('generationError', {
        error: error.message,
        prompt,
        provider: options.provider || this.currentProvider,
        timestamp: new Date().toISOString()
      });

      // Try fallback if available
      if (options.provider !== 'dall-e-2' && this.providers['dall-e-2'].available) {
        console.log('Trying fallback to DALL-E 2...');
        return this.generateImage(prompt, { ...options, provider: 'dall-e-2' });
      }

      throw error;
    }
  }

  async generateWithDALLE3(prompt, options = {}) {
    const {
      size = '1024x1024',
      quality = 'standard',
      style = 'vivid'
    } = options;

    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1, // DALL-E 3 only supports n=1
      size: size,
      quality: quality,
      style: style,
      response_format: 'url'
    });

    return {
      images: response.data.map(img => ({
        url: img.url,
        revised_prompt: img.revised_prompt
      })),
      provider: 'dall-e-3',
      model: 'dall-e-3'
    };
  }

  async generateWithDALLE2(prompt, options = {}) {
    const {
      size = '1024x1024',
      n = 1
    } = options;

    const response = await this.openai.images.generate({
      model: 'dall-e-2',
      prompt: prompt,
      n: Math.min(n, 10), // DALL-E 2 supports up to 10 images
      size: size,
      response_format: 'url'
    });

    return {
      images: response.data.map(img => ({
        url: img.url,
        revised_prompt: prompt // DALL-E 2 doesn't provide revised prompts
      })),
      provider: 'dall-e-2',
      model: 'dall-e-2'
    };
  }

  async generateWithAutomatic1111(prompt, options = {}) {
    const {
      size = '1024x1024',
      n = 1,
      style = 'photorealistic',
      steps = 20,
      cfg_scale = 7,
      sampler = 'DPM++ 2M Karras'
    } = options;

    // Parse size for Automatic1111
    const [width, height] = size.split('x').map(Number);

    // Style-specific prompts and negative prompts
    const styleConfigs = {
      photorealistic: {
        positive_suffix: ', realistic, high quality, detailed, professional photography',
        negative_prompt: 'cartoon, anime, drawing, sketch, low quality, blurry, distorted'
      },
      artistic: {
        positive_suffix: ', artistic, beautiful, creative, masterpiece',
        negative_prompt: 'low quality, blurry, amateur, ugly'
      },
      fantasy: {
        positive_suffix: ', fantasy art, magical, ethereal, epic, detailed',
        negative_prompt: 'realistic, modern, low quality, blurry'
      },
      portrait: {
        positive_suffix: ', portrait, professional, detailed face, high quality',
        negative_prompt: 'full body, landscape, low quality, blurry, distorted face'
      }
    };

    const config = styleConfigs[style] || styleConfigs.photorealistic;
    const enhancedPrompt = prompt + config.positive_suffix;

    const payload = {
      prompt: enhancedPrompt,
      negative_prompt: config.negative_prompt,
      width: width,
      height: height,
      steps: steps,
      cfg_scale: cfg_scale,
      sampler_name: sampler,
      batch_size: Math.min(n, 4), // Limit batch size for GPU memory
      restore_faces: style === 'portrait',
      enable_hr: width > 512 || height > 512, // High-res fix for larger images
      hr_scale: 2,
      hr_upscaler: 'ESRGAN_4x'
    };

    try {
      const response = await axios.post(
        `${process.env.AUTOMATIC1111_URL || 'http://localhost:7860'}/sdapi/v1/txt2img`,
        payload,
        {
          timeout: 120000, // 2 minute timeout for generation
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const images = response.data.images.map((imageData, index) => ({
        url: `data:image/png;base64,${imageData}`,
        revised_prompt: enhancedPrompt,
        seed: response.data.info ? JSON.parse(response.data.info).seed + index : Math.random()
      }));

      return {
        images,
        provider: 'automatic1111',
        model: 'Stable Diffusion',
        generation_info: response.data.info
      };
    } catch (error) {
      console.error('Automatic1111 generation error:', error.message);
      throw new Error(`Local GPU generation failed: ${error.message}. Make sure Automatic1111 WebUI is running on ${process.env.AUTOMATIC1111_URL || 'http://localhost:7860'}`);
    }
  }

  async generateWithComfyUI(prompt, options = {}) {
    const {
      size = '1024x1024',
      n = 1,
      style = 'photorealistic',
      steps = 20,
      cfg = 7
    } = options;

    const [width, height] = size.split('x').map(Number);

    // ComfyUI workflow for text-to-image
    const workflow = {
      "3": {
        "inputs": {
          "seed": Math.floor(Math.random() * 1000000),
          "steps": steps,
          "cfg": cfg,
          "sampler_name": "euler",
          "scheduler": "normal",
          "denoise": 1,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSampler"
      },
      "4": {
        "inputs": {
          "ckpt_name": "sd_xl_base_1.0.safetensors"
        },
        "class_type": "CheckpointLoaderSimple"
      },
      "5": {
        "inputs": {
          "width": width,
          "height": height,
          "batch_size": n
        },
        "class_type": "EmptyLatentImage"
      },
      "6": {
        "inputs": {
          "text": prompt,
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "7": {
        "inputs": {
          "text": "low quality, blurry, distorted",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode"
      },
      "8": {
        "inputs": {
          "samples": ["3", 0],
          "vae": ["4", 2]
        },
        "class_type": "VAEDecode"
      },
      "9": {
        "inputs": {
          "filename_prefix": "ComfyUI",
          "images": ["8", 0]
        },
        "class_type": "SaveImage"
      }
    };

    try {
      const response = await axios.post(
        `${process.env.COMFYUI_URL || 'http://localhost:8188'}/prompt`,
        { prompt: workflow },
        {
          timeout: 120000,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      // ComfyUI returns a prompt_id, we need to poll for results
      const promptId = response.data.prompt_id;
      
      // Poll for completion (simplified - in production you'd use WebSocket)
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

      const historyResponse = await axios.get(
        `${process.env.COMFYUI_URL || 'http://localhost:8188'}/history/${promptId}`
      );

      const images = [];
      if (historyResponse.data[promptId] && historyResponse.data[promptId].outputs) {
        const outputs = historyResponse.data[promptId].outputs;
        Object.values(outputs).forEach(output => {
          if (output.images) {
            output.images.forEach(img => {
              images.push({
                url: `${process.env.COMFYUI_URL || 'http://localhost:8188'}/view?filename=${img.filename}`,
                revised_prompt: prompt
              });
            });
          }
        });
      }

      return {
        images,
        provider: 'comfyui',
        model: 'ComfyUI Workflow'
      };
    } catch (error) {
      console.error('ComfyUI generation error:', error.message);
      throw new Error(`ComfyUI generation failed: ${error.message}. Make sure ComfyUI is running on ${process.env.COMFYUI_URL || 'http://localhost:8188'}`);
    }
  }

  async generateWithStableDiffusion(prompt, options = {}) {
    const {
      size = '1024x1024',
      n = 1,
      style = 'photorealistic'
    } = options;

    // This is a generic Stable Diffusion API endpoint
    // Can be adapted for various local SD implementations
    try {
      const [width, height] = size.split('x').map(Number);
      
      const response = await axios.post(
        `${process.env.STABLE_DIFFUSION_URL || 'http://localhost:7861'}/api/v1/generation/text-to-image`,
        {
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: height,
          width: width,
          samples: n,
          steps: 20
        },
        {
          timeout: 120000,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const images = response.data.artifacts.map(artifact => ({
        url: `data:image/png;base64,${artifact.base64}`,
        revised_prompt: prompt,
        seed: artifact.seed
      }));

      return {
        images,
        provider: 'stable-diffusion',
        model: 'Stable Diffusion'
      };
    } catch (error) {
      console.error('Stable Diffusion generation error:', error.message);
      throw new Error(`Stable Diffusion generation failed: ${error.message}. Make sure your Stable Diffusion server is running on ${process.env.STABLE_DIFFUSION_URL || 'http://localhost:7861'}`);
    }
  }

  async generateWithPollinations(prompt, options = {}) {
    const {
      size = '1024x1024',
      n = 1,
      style = 'photorealistic'
    } = options;

    try {
      const [width, height] = size.split('x').map(Number);
      
      // Pollinations.AI free API - simple GET request
      const images = [];
      for (let i = 0; i < Math.min(n, 4); i++) {
        const encodedPrompt = encodeURIComponent(prompt);
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=flux`;
        
        images.push({
          url: imageUrl,
          revised_prompt: prompt,
          seed: seed
        });
      }

      return {
        images,
        provider: 'pollinations',
        model: 'Flux (Pollinations.AI)'
      };
    } catch (error) {
      console.error('Pollinations generation error:', error.message);
      throw new Error(`Pollinations generation failed: ${error.message}`);
    }
  }

  async generateWithCraiyon(prompt, options = {}) {
    const { n = 1 } = options;

    try {
      // Craiyon API endpoint
      const response = await axios.post(
        'https://api.craiyon.com/v3',
        {
          prompt: prompt,
          model: 'art',
          negative_prompt: 'low quality, blurry, distorted',
          version: 'c4ue22fb7kb6wlac'
        },
        {
          timeout: 60000,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'AI-Character-Creator/1.0'
          }
        }
      );

      const images = response.data.images.slice(0, n).map((imageData, index) => ({
        url: `data:image/webp;base64,${imageData}`,
        revised_prompt: prompt,
        seed: index
      }));

      return {
        images,
        provider: 'craiyon',
        model: 'Craiyon v3'
      };
    } catch (error) {
      console.error('Craiyon generation error:', error.message);
      throw new Error(`Craiyon generation failed: ${error.message}`);
    }
  }

  async generateWithLeonardo(prompt, options = {}) {
    const {
      size = '1024x1024',
      n = 1,
      style = 'photorealistic'
    } = options;

    if (!process.env.LEONARDO_API_KEY) {
      throw new Error('Leonardo API key not configured');
    }

    try {
      const [width, height] = size.split('x').map(Number);
      
      const response = await axios.post(
        'https://cloud.leonardo.ai/api/rest/v1/generations',
        {
          prompt: prompt,
          modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3', // Leonardo Creative model
          width: width,
          height: height,
          num_images: Math.min(n, 4),
          guidance_scale: 7,
          num_inference_steps: 15
        },
        {
          timeout: 120000,
          headers: {
            'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Leonardo API returns generation ID, need to poll for results
      const generationId = response.data.sdGenerationJob.generationId;
      
      // Wait for generation to complete
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      const resultResponse = await axios.get(
        `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
        {
          headers: { 'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}` }
        }
      );

      const images = resultResponse.data.generations_by_pk.generated_images.map(img => ({
        url: img.url,
        revised_prompt: prompt,
        seed: img.seed
      }));

      return {
        images,
        provider: 'leonardo',
        model: 'Leonardo Creative'
      };
    } catch (error) {
      console.error('Leonardo generation error:', error.message);
      throw new Error(`Leonardo generation failed: ${error.message}`);
    }
  }

  async generateWithReplicate(prompt, options = {}) {
    const {
      size = '1024x1024',
      n = 1,
      style = 'photorealistic'
    } = options;

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error('Replicate API token not configured');
    }

    try {
      const [width, height] = size.split('x').map(Number);
      
      const response = await axios.post(
        'https://api.replicate.com/v1/predictions',
        {
          version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e93', // SDXL
          input: {
            prompt: prompt,
            width: width,
            height: height,
            num_outputs: Math.min(n, 4),
            guidance_scale: 7.5,
            num_inference_steps: 25
          }
        },
        {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Poll for completion
      let prediction = response.data;
      while (prediction.status === 'starting' || prediction.status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResponse = await axios.get(
          `https://api.replicate.com/v1/predictions/${prediction.id}`,
          {
            headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
          }
        );
        prediction = statusResponse.data;
      }

      if (prediction.status !== 'succeeded') {
        throw new Error(`Generation failed with status: ${prediction.status}`);
      }

      const images = prediction.output.map((url, index) => ({
        url: url,
        revised_prompt: prompt,
        seed: index
      }));

      return {
        images,
        provider: 'replicate',
        model: 'SDXL (Replicate)'
      };
    } catch (error) {
      console.error('Replicate generation error:', error.message);
      throw new Error(`Replicate generation failed: ${error.message}`);
    }
  }

  async enhancePrompt(originalPrompt, style = 'photorealistic') {
    try {
      const enhancementPrompts = {
        photorealistic: `Enhance this image prompt for photorealistic generation: "${originalPrompt}". Add specific details about lighting, composition, camera settings, and visual quality that would make this image look professional and photorealistic.`,
        artistic: `Enhance this image prompt for artistic generation: "${originalPrompt}". Add details about art style, color palette, composition, and artistic techniques that would make this a compelling artistic image.`,
        fantasy: `Enhance this image prompt for fantasy art generation: "${originalPrompt}". Add magical elements, fantastical details, mystical atmosphere, and epic composition elements.`,
        portrait: `Enhance this portrait image prompt: "${originalPrompt}". Add details about facial features, expression, lighting, background, and portrait photography techniques.`
      };

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating detailed image generation prompts. Provide enhanced prompts that are specific, detailed, and optimized for AI image generation.'
          },
          {
            role: 'user',
            content: enhancementPrompts[style] || enhancementPrompts.photorealistic
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Prompt enhancement error:', error);
      return originalPrompt; // Return original if enhancement fails
    }
  }

  async generateVariations(imageUrl, options = {}) {
    try {
      const { n = 2, size = '1024x1024' } = options;

      // Download the image first
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
      });
      
      const imageBuffer = Buffer.from(imageResponse.data);

      const response = await this.openai.images.createVariation({
        image: imageBuffer,
        n: Math.min(n, 10),
        size: size,
        response_format: 'url'
      });

      return {
        images: response.data.map(img => ({
          url: img.url,
          type: 'variation'
        })),
        provider: 'dall-e-2', // Variations only available with DALL-E 2
        original_url: imageUrl
      };
    } catch (error) {
      console.error('Image variation error:', error);
      throw error;
    }
  }

  getProviderStatus() {
    return Object.entries(this.providers).map(([key, provider]) => ({
      id: key,
      name: provider.name,
      available: provider.available,
      current: key === this.currentProvider
    }));
  }

  setCurrentProvider(providerId) {
    if (this.providers[providerId] && this.providers[providerId].available) {
      this.currentProvider = providerId;
      return true;
    }
    return false;
  }

  getGenerationHistory(userId = null, limit = 50) {
    let history = [...this.generationHistory];
    
    if (userId) {
      history = history.filter(record => record.userId === userId);
    }
    
    return history
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  clearHistory(userId = null) {
    if (userId) {
      this.generationHistory = this.generationHistory.filter(record => record.userId !== userId);
    } else {
      this.generationHistory = [];
    }
  }

  getStats() {
    const totalGenerations = this.generationHistory.length;
    const providerUsage = {};
    const styleUsage = {};
    
    this.generationHistory.forEach(record => {
      providerUsage[record.provider] = (providerUsage[record.provider] || 0) + 1;
      if (record.options.style) {
        styleUsage[record.options.style] = (styleUsage[record.options.style] || 0) + 1;
      }
    });

    return {
      totalGenerations,
      providerUsage,
      styleUsage,
      availableProviders: this.getProviderStatus()
    };
  }

  // Provider availability checking
  async checkProviderAvailability() {
    console.log('🔍 Checking provider availability...');
    
    // Check local GPU providers
    for (const [providerId, provider] of Object.entries(this.providers)) {
      if (provider.url) {
        try {
          const response = await axios.get(`${provider.url}/`, { timeout: 3000 });
          this.providers[providerId].available = true;
          console.log(`✅ ${provider.name} is available at ${provider.url}`);
        } catch (error) {
          this.providers[providerId].available = false;
          console.log(`❌ ${provider.name} is not available at ${provider.url}`);
        }
      }
    }
    
    // Set current provider priority: web services first, then local GPU, then cloud
    const webProviders = ['pollinations', 'craiyon'];
    const availableWebProviders = webProviders.filter(id => this.providers[id]?.available);
    
    const localProviders = Object.keys(this.providers).filter(id =>
      this.providers[id]?.available && this.providers[id]?.url
    );
    
    if (availableWebProviders.length > 0) {
      this.currentProvider = availableWebProviders[0];
      console.log(`🌐 Using ${this.providers[this.currentProvider].name} as primary provider`);
    } else if (localProviders.length > 0) {
      this.currentProvider = localProviders[0];
      console.log(`🖥️ Using ${this.providers[this.currentProvider].name} as primary provider`);
    } else if (this.providers['dall-e-3']?.available) {
      this.currentProvider = 'dall-e-3';
      console.log(`☁️ Using DALL-E 3 as fallback provider`);
    } else {
      console.log(`✅ Using Pollinations.AI as free web provider`);
      this.currentProvider = 'pollinations';
    }
  }

  async detectGPUCapabilities() {
    try {
      // Try to detect GPU info if nvidia-smi is available
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      
      const { stdout } = await execAsync('nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits');
      const gpuInfo = stdout.trim().split('\n').map(line => {
        const [name, memory] = line.split(', ');
        return { name: name.trim(), memory: parseInt(memory) };
      });
      
      return {
        hasGPU: true,
        gpus: gpuInfo,
        recommendedProvider: gpuInfo[0].memory > 8000 ? 'automatic1111' : 'stable-diffusion'
      };
    } catch (error) {
      return {
        hasGPU: false,
        gpus: [],
        recommendedProvider: 'pollinations'
      };
    }
  }

  getProviderStatus() {
    // Get status of all providers
    const activeProviders = Object.entries(this.providers)
      .filter(([_, provider]) => provider.available)
      .map(([id, provider]) => ({
        id,
        name: provider.name,
        available: true,
        url: provider.url
      }));

    const inactiveProviders = Object.entries(this.providers)
      .filter(([_, provider]) => !provider.available)
      .map(([id, provider]) => ({
        id,
        name: provider.name,
        available: false,
        url: provider.url
      }));

    return {
      activeProviders,
      inactiveProviders,
      currentProvider: {
        id: this.currentProvider,
        name: this.providers[this.currentProvider].name
      }
    };
  }

  getStats() {
    return {
      totalImages: this.generationHistory.length,
      activeProvider: this.currentProvider,
      availableProviders: Object.keys(this.providers).length,
      successfulGenerations: this.generationHistory.length,
      providers: Object.entries(this.providers).map(([id, provider]) => ({
        id,
        name: provider.name,
        available: provider.available,
        usageCount: this.generationHistory.filter(record => record.provider === id).length
      }))
    };
  }

  getModelStatus() {
    // Required by the main orchestrator
    return {
      availableModels: Object.entries(this.providers)
        .filter(([_, provider]) => provider.available)
        .map(([id, provider]) => ({
          id,
          name: provider.name,
          type: 'image'
        })),
      currentModel: this.currentProvider
    };
  }

  // Private methods
  generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  addToHistory(record) {
    this.generationHistory.push(record);
    
    // Keep history size under control
    if (this.generationHistory.length > this.maxHistorySize) {
      this.generationHistory = this.generationHistory.slice(-this.maxHistorySize);
    }
  }
}

export { ImageOrchestrator };