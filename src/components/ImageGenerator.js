import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useImageStore from '../stores/imageStore.js';
import ImagePromptEditor from './ImagePromptEditor.js';
import ImagePreview from './ImagePreview.js';
import StyleSelector from './StyleSelector.js';

const GeneratorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
  color: white;
`;

const GeneratorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  background: linear-gradient(135deg, #4ade80, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatusBadge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.connected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  border: 1px solid ${props => props.connected ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  color: ${props => props.connected ? '#4ade80' : '#ef4444'};
`;

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.connected ? '#4ade80' : '#ef4444'};
  animation: ${props => props.connected ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  flex: 1;
  min-height: 0;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const GenerationPanel = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem;
  color: white;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #4ade80;
    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
  }
  
  option {
    background: #1f2937;
    color: white;
  }
`;

const ProviderSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ProviderButton = styled(motion.button)`
  background: ${props => props.active ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? '#4ade80' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(74, 222, 128, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: #ef4444;
  margin-top: 1rem;
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  z-index: 10;
`;

const LoadingContent = styled.div`
  text-align: center;
  color: white;
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin: 1rem 0;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #06b6d4);
  border-radius: 2px;
`;

function ImageGenerator() {
  const {
    isGenerating,
    generationProgress,
    currentGeneration,
    isConnected,
    availableProviders,
    availableStyles,
    currentProvider,
    selectedStyle,
    generationOptions,
    error,
    initializeSocket,
    disconnectSocket,
    setCurrentProvider,
    setSelectedStyle,
    setGenerationOptions,
    loadProviders,
    loadStyles,
    clearError
  } = useImageStore();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      initializeSocket();
      loadProviders();
      loadStyles();
      setIsInitialized(true);
    }

    return () => {
      if (isInitialized) {
        disconnectSocket();
      }
    };
  }, [isInitialized, initializeSocket, disconnectSocket, loadProviders, loadStyles]);

  const handleProviderChange = (providerId) => {
    setCurrentProvider(providerId);
  };

  const handleOptionChange = (option, value) => {
    setGenerationOptions({ [option]: value });
  };

  return (
    <GeneratorContainer>
      <GeneratorHeader>
        <Title>🎨 AI Image Generator</Title>
        <StatusBadge connected={isConnected}>
          <StatusDot connected={isConnected} />
          {isConnected ? 'Connected' : 'Disconnected'}
        </StatusBadge>
      </GeneratorHeader>

      <MainContent>
        <LeftPanel>
          {/* Style Selection */}
          <GenerationPanel>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Style Selection</h3>
            <StyleSelector />
          </GenerationPanel>

          {/* Generation Options */}
          <GenerationPanel style={{ position: 'relative' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Generation Settings</h3>
            
            <OptionsGrid>
              <OptionGroup>
                <OptionLabel>Image Size</OptionLabel>
                <Select
                  value={generationOptions.size}
                  onChange={(e) => handleOptionChange('size', e.target.value)}
                  disabled={isGenerating}
                >
                  <option value="1024x1024">Square (1024x1024)</option>
                  <option value="1792x1024">Landscape (1792x1024)</option>
                  <option value="1024x1792">Portrait (1024x1792)</option>
                </Select>
              </OptionGroup>

              <OptionGroup>
                <OptionLabel>Quality</OptionLabel>
                <Select
                  value={generationOptions.quality}
                  onChange={(e) => handleOptionChange('quality', e.target.value)}
                  disabled={isGenerating}
                >
                  <option value="standard">Standard</option>
                  <option value="hd">HD (DALL-E 3 only)</option>
                </Select>
              </OptionGroup>

              <OptionGroup>
                <OptionLabel>Style Mode</OptionLabel>
                <Select
                  value={generationOptions.style}
                  onChange={(e) => handleOptionChange('style', e.target.value)}
                  disabled={isGenerating}
                >
                  <option value="vivid">Vivid</option>
                  <option value="natural">Natural</option>
                </Select>
              </OptionGroup>

              <OptionGroup>
                <OptionLabel>Images Count</OptionLabel>
                <Select
                  value={generationOptions.n}
                  onChange={(e) => handleOptionChange('n', parseInt(e.target.value))}
                  disabled={isGenerating || currentProvider === 'dall-e-3'}
                >
                  <option value={1}>1 Image</option>
                  {currentProvider !== 'dall-e-3' && (
                    <>
                      <option value={2}>2 Images</option>
                      <option value={3}>3 Images</option>
                      <option value={4}>4 Images</option>
                    </>
                  )}
                </Select>
              </OptionGroup>
            </OptionsGrid>

            {/* Provider Selection */}
            <div style={{ marginTop: '1.5rem' }}>
              <OptionLabel>AI Provider</OptionLabel>
              <ProviderSelector>
                {availableProviders.map(provider => (
                  <ProviderButton
                    key={provider.id}
                    active={provider.id === currentProvider}
                    disabled={!provider.available || isGenerating}
                    onClick={() => handleProviderChange(provider.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {provider.name}
                  </ProviderButton>
                ))}
              </ProviderSelector>
            </div>

            {/* Loading Overlay */}
            <AnimatePresence>
              {isGenerating && (
                <LoadingOverlay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingContent>
                    <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                      Generating Image...
                    </div>
                    <ProgressBar>
                      <ProgressFill
                        initial={{ width: '0%' }}
                        animate={{ width: `${generationProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </ProgressBar>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      {currentGeneration ? `Using ${currentGeneration.provider}` : 'Please wait...'}
                    </div>
                  </LoadingContent>
                </LoadingOverlay>
              )}
            </AnimatePresence>
          </GenerationPanel>

          {/* Prompt Editor */}
          <GenerationPanel>
            <ImagePromptEditor />
          </GenerationPanel>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{error}</span>
                  <button
                    onClick={clearError}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                  >
                    ×
                  </button>
                </div>
              </ErrorMessage>
            )}
          </AnimatePresence>
        </LeftPanel>

        <RightPanel>
          <ImagePreview />
        </RightPanel>
      </MainContent>
    </GeneratorContainer>
  );
}

export default ImageGenerator;