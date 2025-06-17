import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import useImageStore from '../stores/imageStore.js';

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
`;

const StyleCard = styled(motion.div)`
  background: ${props => props.selected ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.selected ? '#4ade80' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.selected ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
    border-color: ${props => props.selected ? '#4ade80' : 'rgba(255, 255, 255, 0.4)'};
    transform: translateY(-2px);
  }
`;

const StyleIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  filter: ${props => props.selected ? 'none' : 'grayscale(0.3)'};
  transform: ${props => props.selected ? 'scale(1.1)' : 'scale(1)'};
  transition: all 0.3s ease;
`;

const StyleName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.selected ? '#4ade80' : 'white'};
  margin-bottom: 0.25rem;
`;

const StyleDescription = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.3;
`;

const SelectedBadge = styled(motion.div)`
  position: absolute;
  top: 8px;
  right: 8px;
  background: #4ade80;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
`;

const CustomStyleInput = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const CustomInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  padding: 0.6rem;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #4ade80;
    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const AddButton = styled(motion.button)`
  background: rgba(74, 222, 128, 0.2);
  border: 1px solid #4ade80;
  border-radius: 8px;
  color: white;
  padding: 0.6rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(74, 222, 128, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuggestionsSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const SuggestionsTitle = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuggestionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const defaultStyles = [
  {
    id: 'photorealistic',
    name: 'Photorealistic',
    icon: '📸',
    description: 'Realistic, high-quality photography style'
  },
  {
    id: 'artistic',
    name: 'Artistic',
    icon: '🎨',
    description: 'Creative, expressive artistic interpretation'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    icon: '🧙‍♀️',
    description: 'Magical, otherworldly fantasy art'
  },
  {
    id: 'portrait',
    name: 'Portrait',
    icon: '👤',
    description: 'Professional portrait photography'
  },
  {
    id: 'landscape',
    name: 'Landscape',
    icon: '🏔️',
    description: 'Natural scenery and environments'
  },
  {
    id: 'abstract',
    name: 'Abstract',
    icon: '🌀',
    description: 'Non-representational, conceptual art'
  }
];

function StyleSelector() {
  const {
    selectedStyle,
    availableStyles,
    currentPrompt,
    setSelectedStyle,
    loadStyles
  } = useImageStore();

  const [customStyle, setCustomStyle] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Use default styles if availableStyles is empty
  const stylesToShow = availableStyles.length > 0 ? availableStyles : defaultStyles;

  useEffect(() => {
    loadStyles();
  }, [loadStyles]);

  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);
  };

  const handleAddCustomStyle = () => {
    if (customStyle.trim()) {
      // For now, just select the custom style as the selected style
      // In a full implementation, you might want to add it to a custom styles list
      setSelectedStyle(customStyle.trim());
      setCustomStyle('');
    }
  };

  const loadStyleSuggestions = async () => {
    if (!currentPrompt.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch('http://localhost:3001/api/images/suggest-styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt })
      });
      
      const data = await response.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to load style suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (currentPrompt.length > 10) {
        loadStyleSuggestions();
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [currentPrompt]);

  return (
    <SelectorContainer>
      <StyleGrid>
        {stylesToShow.map(style => (
          <StyleCard
            key={style.id}
            selected={selectedStyle === style.id}
            onClick={() => handleStyleSelect(style.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <StyleIcon selected={selectedStyle === style.id}>
              {style.icon || '🎨'}
            </StyleIcon>
            <StyleName selected={selectedStyle === style.id}>
              {style.name}
            </StyleName>
            <StyleDescription>
              {style.description}
            </StyleDescription>
            
            <AnimatePresence>
              {selectedStyle === style.id && (
                <SelectedBadge
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  ✓
                </SelectedBadge>
              )}
            </AnimatePresence>
          </StyleCard>
        ))}
      </StyleGrid>

      <CustomStyleInput>
        <CustomInput
          type="text"
          value={customStyle}
          onChange={(e) => setCustomStyle(e.target.value)}
          placeholder="Enter custom style..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddCustomStyle();
            }
          }}
        />
        <AddButton
          onClick={handleAddCustomStyle}
          disabled={!customStyle.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add
        </AddButton>
      </CustomStyleInput>

      <AnimatePresence>
        {(suggestions.length > 0 || isLoadingSuggestions) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <SuggestionsSection>
              <SuggestionsTitle>
                🤖 AI Suggested Styles
                {isLoadingSuggestions && (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    borderTopColor: 'white',
                    animation: 'spin 1s linear infinite'
                  }} />
                )}
              </SuggestionsTitle>
              {suggestions.map((suggestion, index) => (
                <SuggestionButton
                  key={index}
                  onClick={() => handleStyleSelect(suggestion)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </SuggestionButton>
              ))}
            </SuggestionsSection>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ 
        fontSize: '0.8rem', 
        color: 'rgba(255, 255, 255, 0.6)',
        fontStyle: 'italic',
        textAlign: 'center'
      }}>
        💡 Style affects how your prompt is enhanced and the final image appearance
      </div>
    </SelectorContainer>
  );
}

export default StyleSelector;