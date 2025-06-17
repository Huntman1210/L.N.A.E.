import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:3001/api';

const useImageStore = create(
  devtools((set, get) => ({
    // Generation state
    isGenerating: false,
    generationProgress: 0,
    currentGeneration: null,
    
    // Images and history
    generatedImages: [],
    imageHistory: [],
    
    // UI state
    selectedImage: null,
    viewMode: 'grid', // 'grid' | 'list' | 'gallery'
    
    // Prompt state
    currentPrompt: '',
    enhancedPrompt: '',
    isEnhancing: false,
    
    // Settings
    currentProvider: 'pollinations',
    availableProviders: [],
    selectedStyle: 'photorealistic',
    availableStyles: [],
    generationOptions: {
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid',
      n: 1
    },
    
    // Socket connection
    socket: null,
    isConnected: false,
    
    // Error handling
    error: null,
    
    // Actions
    initializeSocket: () => {
      const socket = io('http://localhost:3001');
      
      socket.on('connect', () => {
        set({ isConnected: true, socket });
        console.log('Connected to image generation server');
      });
      
      socket.on('disconnect', () => {
        set({ isConnected: false });
        console.log('Disconnected from image generation server');
      });
      
      socket.on('imageGenerationStart', (data) => {
        set({ 
          isGenerating: true, 
          generationProgress: 0,
          currentGeneration: data,
          error: null 
        });
      });
      
      socket.on('imageGenerationComplete', (data) => {
        const newImages = data.result.images.map(img => ({
          id: data.id,
          url: img.url,
          prompt: data.prompt,
          enhancedPrompt: img.revised_prompt || data.prompt,
          provider: data.provider,
          timestamp: data.timestamp,
          options: data.options
        }));
        
        set(state => ({
          isGenerating: false,
          generationProgress: 100,
          currentGeneration: null,
          generatedImages: [...newImages, ...state.generatedImages],
          imageHistory: [...newImages, ...state.imageHistory]
        }));
      });
      
      socket.on('imageGenerationError', (data) => {
        set({ 
          isGenerating: false, 
          generationProgress: 0,
          currentGeneration: null,
          error: data.error 
        });
      });
      
      socket.on('promptEnhancementComplete', (data) => {
        set({ 
          enhancedPrompt: data.enhancedPrompt,
          isEnhancing: false 
        });
      });
      
      set({ socket });
    },
    
    disconnectSocket: () => {
      const { socket } = get();
      if (socket) {
        socket.disconnect();
        set({ socket: null, isConnected: false });
      }
    },
    
    // Image generation
    generateImage: async (prompt, options = {}) => {
      const { socket, generationOptions, currentProvider } = get();
      
      set({ 
        isGenerating: true, 
        generationProgress: 0,
        error: null,
        currentPrompt: prompt
      });
      
      const generationData = {
        prompt,
        options: {
          ...generationOptions,
          ...options,
          provider: currentProvider
        }
      };
      
      if (socket && socket.connected) {
        // Use Socket.IO for real-time updates
        socket.emit('generateImage', generationData);
      } else {
        // Fallback to HTTP API
        try {
          const response = await fetch(`${API_BASE}/images/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(generationData)
          });
          
          const result = await response.json();
          
          if (result.success) {
            const newImages = result.data.images.map(img => ({
              id: result.id,
              url: img.url,
              prompt: prompt,
              enhancedPrompt: img.revised_prompt || prompt,
              provider: result.provider,
              timestamp: new Date().toISOString(),
              options: generationData.options
            }));
            
            set(state => ({
              isGenerating: false,
              generationProgress: 100,
              generatedImages: [...newImages, ...state.generatedImages],
              imageHistory: [...newImages, ...state.imageHistory]
            }));
          } else {
            throw new Error(result.error || 'Generation failed');
          }
        } catch (error) {
          set({ 
            isGenerating: false, 
            generationProgress: 0,
            error: error.message 
          });
        }
      }
    },
    
    // Prompt enhancement
    enhancePrompt: async (prompt, style = null) => {
      const { socket, selectedStyle } = get();
      
      set({ isEnhancing: true, error: null });
      
      const enhancementData = {
        prompt,
        options: {
          style: style || selectedStyle,
          complexity: 'moderate',
          useAI: true
        }
      };
      
      if (socket && socket.connected) {
        socket.emit('enhancePrompt', enhancementData);
      } else {
        try {
          const response = await fetch(`${API_BASE}/images/enhance-prompt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enhancementData)
          });
          
          const result = await response.json();
          
          if (result.success) {
            set({ 
              enhancedPrompt: result.enhancedPrompt,
              isEnhancing: false 
            });
          } else {
            throw new Error(result.error || 'Enhancement failed');
          }
        } catch (error) {
          set({ 
            isEnhancing: false,
            error: error.message 
          });
        }
      }
    },
    
    // Load available providers and styles
    loadProviders: async () => {
      try {
        const response = await fetch(`${API_BASE}/images/providers`);
        const providers = await response.json();
        set({ availableProviders: providers });
      } catch (error) {
        console.error('Failed to load providers:', error);
      }
    },
    
    loadStyles: async () => {
      try {
        const response = await fetch(`${API_BASE}/images/styles`);
        const styles = await response.json();
        set({ availableStyles: styles });
      } catch (error) {
        console.error('Failed to load styles:', error);
      }
    },
    
    // Load image history
    loadHistory: async (limit = 50) => {
      try {
        const response = await fetch(`${API_BASE}/images/history?limit=${limit}`);
        const data = await response.json();
        set({ imageHistory: data.history || [] });
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    },
    
    // Generate variations
    generateVariations: async (imageUrl, count = 2) => {
      try {
        set({ isGenerating: true, error: null });
        
        const response = await fetch(`${API_BASE}/images/variations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl, options: { n: count } })
        });
        
        const result = await response.json();
        
        if (result.images) {
          const variations = result.images.map(img => ({
            id: `var-${Date.now()}-${Math.random()}`,
            url: img.url,
            prompt: 'Variation',
            provider: result.provider,
            timestamp: new Date().toISOString(),
            isVariation: true,
            originalUrl: imageUrl
          }));
          
          set(state => ({
            isGenerating: false,
            generatedImages: [...variations, ...state.generatedImages],
            imageHistory: [...variations, ...state.imageHistory]
          }));
        }
      } catch (error) {
        set({ 
          isGenerating: false,
          error: error.message 
        });
      }
    },
    
    // UI actions
    setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
    setEnhancedPrompt: (prompt) => set({ enhancedPrompt: prompt }),
    setSelectedImage: (image) => set({ selectedImage: image }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setCurrentProvider: (provider) => set({ currentProvider: provider }),
    setSelectedStyle: (style) => set({ selectedStyle: style }),
    setGenerationOptions: (options) => 
      set(state => ({ 
        generationOptions: { ...state.generationOptions, ...options } 
      })),
    
    // Clear actions
    clearError: () => set({ error: null }),
    clearImages: () => set({ generatedImages: [], selectedImage: null }),
    clearHistory: () => set({ imageHistory: [] }),
    
    // Remove image
    removeImage: (imageId) => 
      set(state => ({
        generatedImages: state.generatedImages.filter(img => img.id !== imageId),
        imageHistory: state.imageHistory.filter(img => img.id !== imageId),
        selectedImage: state.selectedImage?.id === imageId ? null : state.selectedImage
      }))
  }), {
    name: 'image-store'
  })
);

export default useImageStore;