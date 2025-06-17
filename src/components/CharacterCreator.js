import React, { useState } from 'react';
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

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  flex: 1;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PreviewSection = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #4ade80;
    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
  }
`;

const TextArea = styled.textarea`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #4ade80;
    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4ade80;
    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
  }

  option {
    background: #1a1a1a;
    color: white;
  }
`;

const GenerateButton = styled(motion.button)`
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PreviewCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PreviewTitle = styled.h3`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const PreviewText = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.6;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #4ade80;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function CharacterCreator() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    occupation: '',
    personality: '',
    background: '',
    appearance: '',
    skills: '',
    goals: ''
  });

  const [generatedCharacter, setGeneratedCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateCharacter = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to generate character
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCharacter = {
        name: formData.name || 'Generated Character',
        profile: `A ${formData.age || '25'}-year-old ${formData.gender || 'person'} working as a ${formData.occupation || 'adventurer'}. 
                 ${formData.personality || 'They have a mysterious personality'} with a background of ${formData.background || 'unknown origins'}.`,
        appearance: formData.appearance || 'A striking figure with an enigmatic presence that draws attention wherever they go.',
        skills: formData.skills || 'Skilled in various arts and possesses hidden talents yet to be discovered.',
        goals: formData.goals || 'Seeking their true purpose in a world full of endless possibilities.',
        dialogue: 'I speak with confidence and purpose, choosing my words carefully to leave a lasting impression.',
        stats: {
          strength: Math.floor(Math.random() * 20) + 1,
          intelligence: Math.floor(Math.random() * 20) + 1,
          charisma: Math.floor(Math.random() * 20) + 1,
          wisdom: Math.floor(Math.random() * 20) + 1
        }
      };

      setGeneratedCharacter(mockCharacter);
    } catch (error) {
      console.error('Error generating character:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>🎭 Create Your Character</Title>
      
      <FormContainer>
        <InputSection>
          <FormGroup>
            <Label>AI Model</Label>
            <Select 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="gpt-4">GPT-4 (Creative)</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet (Detailed)</option>
              <option value="gemini-pro">Gemini Pro (Balanced)</option>
              <option value="mistral-large">Mistral Large (Fast)</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Character Name</Label>
            <Input
              type="text"
              placeholder="Enter character name..."
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Age</Label>
            <Input
              type="text"
              placeholder="e.g., 25 or young adult"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Gender</Label>
            <Select 
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
            >
              <option value="">Select gender...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Occupation/Role</Label>
            <Input
              type="text"
              placeholder="e.g., Knight, Wizard, Detective..."
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Personality Traits</Label>
            <TextArea
              placeholder="Describe their personality, quirks, and mannerisms..."
              value={formData.personality}
              onChange={(e) => handleInputChange('personality', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Background Story</Label>
            <TextArea
              placeholder="Their history, origins, and past experiences..."
              value={formData.background}
              onChange={(e) => handleInputChange('background', e.target.value)}
            />
          </FormGroup>

          <GenerateButton
            onClick={generateCharacter}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Generating...' : '✨ Generate Character'}
          </GenerateButton>
        </InputSection>

        <PreviewSection>
          <PreviewTitle>Character Preview</PreviewTitle>
          
          {isLoading && <LoadingSpinner />}
          
          {!isLoading && generatedCharacter && (
            <>
              <PreviewCard>
                <PreviewTitle>{generatedCharacter.name}</PreviewTitle>
                <PreviewText>{generatedCharacter.profile}</PreviewText>
              </PreviewCard>

              <PreviewCard>
                <PreviewTitle>Appearance</PreviewTitle>
                <PreviewText>{generatedCharacter.appearance}</PreviewText>
              </PreviewCard>

              <PreviewCard>
                <PreviewTitle>Skills & Abilities</PreviewTitle>
                <PreviewText>{generatedCharacter.skills}</PreviewText>
              </PreviewCard>

              <PreviewCard>
                <PreviewTitle>Goals & Motivations</PreviewTitle>
                <PreviewText>{generatedCharacter.goals}</PreviewText>
              </PreviewCard>

              <PreviewCard>
                <PreviewTitle>Character Stats</PreviewTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div style={{ color: 'white' }}>Strength: {generatedCharacter.stats.strength}</div>
                  <div style={{ color: 'white' }}>Intelligence: {generatedCharacter.stats.intelligence}</div>
                  <div style={{ color: 'white' }}>Charisma: {generatedCharacter.stats.charisma}</div>
                  <div style={{ color: 'white' }}>Wisdom: {generatedCharacter.stats.wisdom}</div>
                </div>
              </PreviewCard>
            </>
          )}
          
          {!isLoading && !generatedCharacter && (
            <PreviewText>Fill out the form and click &quot;Generate Character&quot; to see your AI-created character here!</PreviewText>
          )}
        </PreviewSection>
      </FormContainer>
    </Container>
  );
}

export default CharacterCreator;
