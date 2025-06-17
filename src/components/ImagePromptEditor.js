import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useImageStore from '../stores/imageStore.js';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditorTitle = styled.h4`
  margin: 0;
  font-size: 1.1rem;
  color: white;
`;

const ToggleButton = styled(motion.button)`
  background: ${props => props.active ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.active ? '#4ade80' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 6px;
  color: white;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background: rgba(74, 222, 128, 0.1);
  }
`;

const PromptTextarea = styled.textarea`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  padding: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #4ade80;
    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const EnhancedPromptDisplay = styled.div`
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  max-height: 150px;
  overflow-y: auto;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.primary ? 'linear-gradient(135deg, #4ade80, #06b6d4)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.primary ? 'transparent' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  color: white;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.primary ? 'linear-gradient(135deg, #22c55e, #0891b2)' : 'rgba(255, 255, 255, 0.2)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuickPrompts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const QuickPromptButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.8rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const quickPrompts = [
  "a beautiful landscape",
  "a futuristic city",
  "a magical forest",
  "a portrait of a person",
  "abstract art",
  "a cozy interior",
  "a dramatic sky",
  "underwater scene"
];

function ImagePromptEditor() {
  const {
    currentPrompt,
    enhancedPrompt,
    isEnhancing,
    isGenerating,
    selectedStyle,
    setCurrentPrompt,
    setEnhancedPrompt,
    enhancePrompt,
    generateImage
  } = useImageStore();

  const [showEnhanced, setShowEnhanced] = useState(false);
  const [autoEnhance, setAutoEnhance] = useState(true);
  const textareaRef = useRef(null);

  const handlePromptChange = (e) => {
    const value = e.target.value;
    setCurrentPrompt(value);
    
    // Auto-enhance if enabled and prompt is substantial
    if (autoEnhance && value.length > 10 && value !== currentPrompt) {
      const debounceTimer = setTimeout(() => {
        enhancePrompt(value);
      }, 1000);
      
      return () => clearTimeout(debounceTimer);
    }
  };

  const handleEnhanceClick = () => {
    if (currentPrompt.trim()) {
      enhancePrompt(currentPrompt);
      setShowEnhanced(true);
    }
  };

  const handleGenerateClick = () => {
    const promptToUse = showEnhanced && enhancedPrompt ? enhancedPrompt : currentPrompt;
    if (promptToUse.trim()) {
      generateImage(promptToUse);
    }
  };

  const handleUseEnhanced = () => {
    if (enhancedPrompt) {
      setCurrentPrompt(enhancedPrompt);
      setEnhancedPrompt('');
      setShowEnhanced(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setCurrentPrompt(prompt);
    if (autoEnhance) {
      enhancePrompt(prompt);
      setShowEnhanced(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleGenerateClick();
    }
  };

  useEffect(() => {
    if (enhancedPrompt && autoEnhance) {
      setShowEnhanced(true);
    }
  }, [enhancedPrompt, autoEnhance]);

  return (
    <EditorContainer>
      <EditorHeader>
        <EditorTitle>Prompt Editor</EditorTitle>
        <ToggleButton
          active={autoEnhance}
          onClick={() => setAutoEnhance(!autoEnhance)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Auto-Enhance
        </ToggleButton>
      </EditorHeader>

      <PromptTextarea
        ref={textareaRef}
        value={currentPrompt}
        onChange={handlePromptChange}
        onKeyDown={handleKeyDown}
        placeholder="Describe the image you want to generate... (Ctrl+Enter to generate)"
        disabled={isGenerating}
      />

      <AnimatePresence>
        {showEnhanced && enhancedPrompt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ 
                fontSize: '0.9rem', 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500 
              }}>
                🤖 Enhanced Prompt
              </span>
              <motion.button
                onClick={() => setShowEnhanced(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
                whileHover={{ color: 'white' }}
              >
                ×
              </motion.button>
            </div>
            <EnhancedPromptDisplay>
              {enhancedPrompt}
            </EnhancedPromptDisplay>
          </motion.div>
        )}
      </AnimatePresence>

      <ButtonRow>
        <ActionButton
          onClick={handleEnhanceClick}
          disabled={!currentPrompt.trim() || isEnhancing || isGenerating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isEnhancing ? (
            <>
              <LoadingSpinner /> Enhancing...
            </>
          ) : (
            '✨ Enhance Prompt'
          )}
        </ActionButton>

        {showEnhanced && enhancedPrompt && (
          <ActionButton
            onClick={handleUseEnhanced}
            disabled={isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📝 Use Enhanced
          </ActionButton>
        )}

        <ActionButton
          primary
          onClick={handleGenerateClick}
          disabled={!currentPrompt.trim() || isGenerating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isGenerating ? (
            <>
              <LoadingSpinner /> Generating...
            </>
          ) : (
            '🎨 Generate Image'
          )}
        </ActionButton>
      </ButtonRow>

      <div>
        <div style={{ 
          fontSize: '0.9rem', 
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '0.5rem'
        }}>
          Quick Prompts:
        </div>
        <QuickPrompts>
          {quickPrompts.map((prompt, index) => (
            <QuickPromptButton
              key={index}
              onClick={() => handleQuickPrompt(prompt)}
              disabled={isGenerating}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {prompt}
            </QuickPromptButton>
          ))}
        </QuickPrompts>
      </div>

      <div style={{ 
        fontSize: '0.8rem', 
        color: 'rgba(255, 255, 255, 0.6)',
        fontStyle: 'italic'
      }}>
        💡 Tip: Be specific about style, lighting, composition, and details for better results. 
        Selected style: <strong>{selectedStyle}</strong>
      </div>
    </EditorContainer>
  );
}

export default ImagePromptEditor;