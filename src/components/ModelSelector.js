import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h2`
  color: white;
  margin: 0;
  font-size: 1.8rem;
  text-align: center;
`;

const ModelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  flex: 1;
`;

const ModelCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.isActive ? '#4ade80' : 'transparent'};
  }
`;

const ModelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ModelIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${props => props.color || '#4ade80'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const ModelInfo = styled.div`
  flex: 1;
`;

const ModelName = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.2rem;
`;

const ModelProvider = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 0.9rem;
`;

const ModelStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.online ? '#4ade80' : '#f87171'};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.online ? '#4ade80' : '#f87171'};
`;

const ModelDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const ModelStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  color: #4ade80;
  font-size: 1.2rem;
  font-weight: 600;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.primary ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.primary ? 'transparent' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: auto;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function ModelSelector() {
  const [models, setModels] = useState([]);
  const [activeModel, setActiveModel] = useState('gpt-4');

  useEffect(() => {
    // Simulate loading models
    const mockModels = [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'OpenAI',
        icon: '🧠',
        color: '#10b981',
        online: true,
        description: 'Most capable model for complex tasks requiring deep understanding and reasoning.',
        requests: 142,
        tokens: '2.3M'
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'Anthropic',
        icon: '🎭',
        color: '#8b5cf6',
        online: true,
        description: 'Excellent for creative writing, analysis, and nuanced conversations.',
        requests: 89,
        tokens: '1.8M'
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'Google',
        icon: '💎',
        color: '#3b82f6',
        online: true,
        description: 'Powerful multimodal AI with strong reasoning and code generation capabilities.',
        requests: 67,
        tokens: '1.2M'
      },
      {
        id: 'mistral-large',
        name: 'Mistral Large',
        provider: 'Mistral AI',
        icon: '🌟',
        color: '#f59e0b',
        online: true,
        description: 'Fast and efficient model optimized for production workloads.',
        requests: 134,
        tokens: '2.1M'
      },
      {
        id: 'llama2',
        name: 'Llama 2',
        provider: 'Meta (Ollama)',
        icon: '🦙',
        color: '#6366f1',
        online: false,
        description: 'Open-source model running locally. Start Ollama to enable.',
        requests: 0,
        tokens: '0'
      },
      {
        id: 'codellama',
        name: 'Code Llama',
        provider: 'Meta (Ollama)',
        icon: '💻',
        color: '#ec4899',
        online: false,
        description: 'Specialized for code generation and programming tasks.',
        requests: 0,
        tokens: '0'
      }
    ];

    setModels(mockModels);
  }, []);

  const selectModel = (modelId) => {
    setActiveModel(modelId);
    // Here you would typically call an API to switch models
    console.log(`Switching to model: ${modelId}`);
  };

  const testModel = async (modelId) => {
    console.log(`Testing model: ${modelId}`);
    // Simulate model test
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <Container>
      <Title>🤖 AI Model Selector</Title>
      
      <ModelsGrid>
        {models.map(model => (
          <ModelCard
            key={model.id}
            isActive={activeModel === model.id}
            onClick={() => selectModel(model.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ModelHeader>
              <ModelIcon color={model.color}>
                {model.icon}
              </ModelIcon>
              <ModelInfo>
                <ModelName>{model.name}</ModelName>
                <ModelProvider>{model.provider}</ModelProvider>
              </ModelInfo>
              <ModelStatus online={model.online}>
                <StatusDot online={model.online} />
                {model.online ? 'Online' : 'Offline'}
              </ModelStatus>
            </ModelHeader>

            <ModelDescription>
              {model.description}
            </ModelDescription>

            <ModelStats>
              <StatItem>
                <StatValue>{model.requests}</StatValue>
                <StatLabel>Requests</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{model.tokens}</StatValue>
                <StatLabel>Tokens</StatLabel>
              </StatItem>
            </ModelStats>

            <ActionButton
              primary={activeModel === model.id}
              disabled={!model.online}
              onClick={(e) => {
                e.stopPropagation();
                if (activeModel === model.id) {
                  testModel(model.id);
                } else {
                  selectModel(model.id);
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {(() => {
                if (activeModel === model.id) return '🧪 Test Model';
                if (model.online) return '✅ Select';
                return '⚠️ Offline';
              })()}
            </ActionButton>
          </ModelCard>
        ))}
      </ModelsGrid>
    </Container>
  );
}

export default ModelSelector;
