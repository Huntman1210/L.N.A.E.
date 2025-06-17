/**
 * Mode Manager Component - Interface for managing and using development modes
 * Provides access to the mode registry and allows users to activate/use different modes
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { modeRegistry } from '../modes/core/ModeRegistry.js';
import { tier1Modes } from '../modes/definitions/tier1-core-development.js';
import { tier2Modes } from '../modes/definitions/tier2-frontend.js';
import { tier3Modes } from '../modes/definitions/tier3-backend.js';
import { tier4Modes } from '../modes/definitions/tier4-aiml.js';

const ModeManagerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)`
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  border: 2px solid ${props => props.active ? 'transparent' : '#e1e8ed'};
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
  }
`;

const TierBadge = styled.div`
  background: ${props => {
    const colors = {
      1: '#3498db',
      2: '#e74c3c', 
      3: '#f39c12',
      4: '#9b59b6'
    };
    return colors[props.tier] || '#95a5a6';
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CategoryBadge = styled.div`
  background: #ecf0f1;
  color: #2c3e50;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
`;

const ModeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ModeCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 64px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

const ModeIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ModeName = styled.h3`
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const ModeDescription = styled.p`
  color: #7f8c8d;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ModeDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #34495e;
  min-width: 80px;
`;

const DetailValue = styled.span`
  color: #7f8c8d;
  flex: 1;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background: #ecf0f1;
  color: #2c3e50;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.active ? '#27ae60' : '#95a5a6'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const AnalyticsSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-top: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const AnalyticsTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const ModeManager = () => {
  const [modes, setModes] = useState([]);
  const [filteredModes, setFilteredModes] = useState([]);
  const [activeModes, setActiveModes] = useState(new Set());
  const [analytics, setAnalytics] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    initializeModeRegistry();
  }, []);

  useEffect(() => {
    filterModes();
  }, [modes, selectedTier, selectedCategory]);

  const filterModes = () => {
    let filtered = modes;
    
    if (selectedTier !== 'all') {
      filtered = filtered.filter(mode => mode.tier === parseInt(selectedTier));
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(mode => mode.category === selectedCategory);
    }
    
    setFilteredModes(filtered);
  };

  const initializeModeRegistry = async () => {
    try {
      // Register all tier 1 modes (Core Development)
      Object.entries(tier1Modes).forEach(([slug, config]) => {
        modeRegistry.registerMode({
          slug,
          tier: 1,
          category: 'core-development',
          ...config
        });
      });

      // Register all tier 2 modes (Frontend)
      Object.entries(tier2Modes).forEach(([slug, config]) => {
        modeRegistry.registerMode({
          slug,
          tier: 2,
          category: 'frontend',
          ...config
        });
      });

      // Register all tier 3 modes (Backend)
      Object.entries(tier3Modes).forEach(([slug, config]) => {
        modeRegistry.registerMode({
          slug,
          tier: 3,
          category: 'backend',
          ...config
        });
      });

      // Register all tier 4 modes (AI/ML)
      Object.entries(tier4Modes).forEach(([slug, config]) => {
        modeRegistry.registerMode({
          slug,
          tier: 4,
          category: 'ai-ml',
          ...config
        });
      });

      await modeRegistry.initialize();
      
      // Get all registered modes
      const allModes = Array.from(modeRegistry.modes.values());
      setModes(allModes);
      
      // Get system analytics
      const systemAnalytics = modeRegistry.getSystemAnalytics();
      setAnalytics(systemAnalytics);
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize mode registry:', error);
    }
  };

  const handleModeActivation = async (modeSlug) => {
    const mode = modeRegistry.getMode(modeSlug);
    if (!mode) return;

    try {
      if (activeModes.has(modeSlug)) {
        // Deactivate mode
        await mode.deactivate?.();
        setActiveModes(prev => {
          const updated = new Set(prev);
          updated.delete(modeSlug);
          return updated;
        });
      } else {
        // Activate mode
        await mode.activate?.();
        setActiveModes(prev => new Set([...prev, modeSlug]));
      }
    } catch (error) {
      console.error(`Failed to toggle mode ${modeSlug}:`, error);
    }
  };

  const handleModeExecution = async (modeSlug) => {
    const mode = modeRegistry.getMode(modeSlug);
    if (!mode) return;

    try {
      const result = await mode.execute?.({
        type: 'demo-task',
        description: 'Demonstration task execution',
        requiredCapabilities: Array.from(mode.capabilities).slice(0, 2)
      });
      
      console.log('Mode execution result:', result);
      
      // Update analytics
      const updatedAnalytics = modeRegistry.getSystemAnalytics();
      setAnalytics(updatedAnalytics);
    } catch (error) {
      console.error(`Failed to execute mode ${modeSlug}:`, error);
    }
  };

  if (!isInitialized) {
    return (
      <ModeManagerContainer>
        <Header>
          <Title>🔄 Initializing Mode Registry...</Title>
          <Subtitle>Setting up development modes and capabilities</Subtitle>
        </Header>
      </ModeManagerContainer>
    );
  }

  return (
    <ModeManagerContainer>
      <Header>
        <Title>🚀 Development Mode Manager</Title>
        <Subtitle>
          Activate and manage specialized development modes to enhance your coding capabilities.
          Each mode provides unique tools, frameworks, and expertise for specific development scenarios.
        </Subtitle>
      </Header>

      <FilterSection>
        <FilterButton 
          active={selectedTier === 'all'} 
          onClick={() => setSelectedTier('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All Tiers
        </FilterButton>
        <FilterButton 
          active={selectedTier === '1'} 
          onClick={() => setSelectedTier('1')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Tier 1: Core Dev
        </FilterButton>
        <FilterButton 
          active={selectedTier === '2'} 
          onClick={() => setSelectedTier('2')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Tier 2: Frontend
        </FilterButton>
        <FilterButton 
          active={selectedTier === '3'} 
          onClick={() => setSelectedTier('3')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Tier 3: Backend
        </FilterButton>
        <FilterButton 
          active={selectedTier === '4'} 
          onClick={() => setSelectedTier('4')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Tier 4: AI/ML
        </FilterButton>
      </FilterSection>

      <FilterSection>
        <FilterButton 
          active={selectedCategory === 'all'} 
          onClick={() => setSelectedCategory('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All Categories
        </FilterButton>
        <FilterButton 
          active={selectedCategory === 'core-development'} 
          onClick={() => setSelectedCategory('core-development')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Core Development
        </FilterButton>
        <FilterButton 
          active={selectedCategory === 'frontend'} 
          onClick={() => setSelectedCategory('frontend')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Frontend
        </FilterButton>
        <FilterButton 
          active={selectedCategory === 'backend'} 
          onClick={() => setSelectedCategory('backend')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Backend
        </FilterButton>
        <FilterButton 
          active={selectedCategory === 'ai-ml'} 
          onClick={() => setSelectedCategory('ai-ml')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          AI/ML
        </FilterButton>
      </FilterSection>

      <ModeGrid>
        <AnimatePresence>
          {filteredModes.map((mode) => (
            <ModeCard
              key={mode.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StatusBadge active={activeModes.has(mode.slug)}>
                {activeModes.has(mode.slug) ? 'ACTIVE' : 'INACTIVE'}
              </StatusBadge>
              
              <ModeIcon>{mode.name.split(' ')[0]}</ModeIcon>
              <TierBadge tier={mode.tier}>TIER {mode.tier}</TierBadge>
              <CategoryBadge>{mode.category.replace('-', ' ')}</CategoryBadge>
              <ModeName>{mode.name}</ModeName>
              <ModeDescription>{mode.description}</ModeDescription>
              
              <ModeDetails>
                <DetailRow>
                  <DetailLabel>Tier:</DetailLabel>
                  <DetailValue>{mode.tier}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Category:</DetailLabel>
                  <DetailValue>{mode.category}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Capabilities:</DetailLabel>
                  <DetailValue>{Array.from(mode.capabilities).length}</DetailValue>
                </DetailRow>
              </ModeDetails>

              {mode.metadata.expertise && (
                <TagList>
                  {mode.metadata.expertise.slice(0, 3).map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                  {mode.metadata.expertise.length > 3 && (
                    <Tag key="more-tags">+{mode.metadata.expertise.length - 3} more</Tag>
                  )}
                </TagList>
              )}

              <ActionButton
                onClick={() => handleModeActivation(mode.slug)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeModes.has(mode.slug) ? 'Deactivate' : 'Activate'}
              </ActionButton>

              {activeModes.has(mode.slug) && (
                <ActionButton
                  onClick={() => handleModeExecution(mode.slug)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ marginLeft: '0.5rem', background: '#27ae60' }}
                >
                  Execute Demo
                </ActionButton>
              )}
            </ModeCard>
          ))}
        </AnimatePresence>
      </ModeGrid>

      {analytics && (
        <AnalyticsSection>
          <AnalyticsTitle>📊 Mode Analytics</AnalyticsTitle>
          <StatsGrid>
            <StatCard>
              <StatValue>{analytics.totalModes}</StatValue>
              <StatLabel>Total Modes</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{analytics.totalUsage}</StatValue>
              <StatLabel>Total Usage</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{activeModes.size}</StatValue>
              <StatLabel>Active Modes</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{filteredModes.length}</StatValue>
              <StatLabel>Visible Modes</StatLabel>
            </StatCard>
          </StatsGrid>

          <AnalyticsTitle style={{ marginTop: '2rem', fontSize: '1.4rem' }}>Mode Distribution</AnalyticsTitle>
          <StatsGrid>
            <StatCard>
              <StatValue>{analytics.modesByTier[1] || 0}</StatValue>
              <StatLabel>Tier 1: Core Dev</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{analytics.modesByTier[2] || 0}</StatValue>
              <StatLabel>Tier 2: Frontend</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{analytics.modesByTier[3] || 0}</StatValue>
              <StatLabel>Tier 3: Backend</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{analytics.modesByTier[4] || 0}</StatValue>
              <StatLabel>Tier 4: AI/ML</StatLabel>
            </StatCard>
          </StatsGrid>

          <AnalyticsTitle style={{ marginTop: '2rem', fontSize: '1.4rem' }}>Category Distribution</AnalyticsTitle>
          <StatsGrid>
            <StatCard>
              <StatValue>{analytics.modesByCategory['core-development'] || 0}</StatValue>
              <StatLabel>Core Development</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{analytics.modesByCategory['frontend'] || 0}</StatValue>
              <StatLabel>Frontend</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{analytics.modesByCategory['backend'] || 0}</StatValue>
              <StatLabel>Backend</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{analytics.modesByCategory['ai-ml'] || 0}</StatValue>
              <StatLabel>AI/ML</StatLabel>
            </StatCard>
          </StatsGrid>
        </AnalyticsSection>
      )}
    </ModeManagerContainer>
  );
};

export default ModeManager;
