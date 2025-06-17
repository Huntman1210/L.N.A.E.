import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CharacterCreator from './CharacterCreator.js';
import ModelSelector from './ModelSelector.js';
import WorkflowManager from './WorkflowManager.js';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const DashboardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WelcomeText = styled.div``;

const UserName = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const PlanBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.primary ? 'white' : 'transparent'};
  color: ${props => props.primary ? '#764ba2' : 'white'};
  border: ${props => props.primary ? 'none' : '1px solid white'};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const StatTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
`;

const ProgressBarContainer = styled.div`
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(to right, #667eea, #764ba2);
  border-radius: 4px;
`;

const StatMeta = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
`;

const SectionTitle = styled.h2`
  margin: 2rem 0 1.5rem;
  color: #333;
  font-size: 1.5rem;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: ${props => props.active ? '#764ba2' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  position: relative;
  cursor: pointer;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.active ? '#764ba2' : 'transparent'};
  }
  
  &:hover {
    color: ${props => props.active ? '#764ba2' : '#333'};
  }
`;

// Helper function to render dashboard content
const renderDashboardTab = (tab) => {
  // Render the appropriate component based on active tab
  switch (tab) {
    case 'characters':
      return <CharacterCreator />;
    case 'models':
      return <ModelSelector />;
    case 'workflows':
      return <WorkflowManager />;
    default:
      return <CharacterCreator />;
  }
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('characters');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Fetch user data
        const userResponse = await axios.get('/api/auth/me', {
          headers: { 'x-auth-token': token }
        });
        
        setUser(userResponse.data);
        
        // Fetch characters
        const charactersResponse = await axios.get('/api/characters', {
          headers: { 'x-auth-token': token }
        });
        
        setCharacters(charactersResponse.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  if (loading) {
    return <p>Loading dashboard...</p>;
  }
  
  // Use the helper function to render the active tab
  
  // Calculate usage percentages based on subscription plan
  const getCharacterLimit = () => {
    const plan = user?.subscription?.plan;
    if (plan === 'free') return 5;
    if (plan === 'basic') return 25;
    if (plan === 'pro') return 100;
    return 500; // enterprise plan
  };
  
  const getApiCallLimit = () => {
    const plan = user?.subscription?.plan;
    if (plan === 'free') return 100;
    if (plan === 'basic') return 500;
    if (plan === 'pro') return 2000;
    return 10000; // enterprise plan
  };
  
  const usageLimits = {
    characters: getCharacterLimit(),
    apiCalls: getApiCallLimit()
  };
  
  const charactersUsagePercent = Math.min(
    (user?.usage?.charactersCreated / usageLimits.characters) * 100, 
    100
  );
  
  const apiCallsUsagePercent = Math.min(
    (user?.usage?.apiCalls / usageLimits.apiCalls) * 100, 
    100
  );
  
  // Calculate days left in subscription
  const subscriptionEndDate = user?.subscription?.endDate 
    ? new Date(user.subscription.endDate) 
    : null;
  
  const today = new Date();
  const daysLeft = subscriptionEndDate 
    ? Math.max(0, Math.ceil((subscriptionEndDate - today) / (1000 * 60 * 60 * 24))) 
    : 0;
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <HeaderContent>
          <WelcomeText>
            <UserName>
              Welcome, {user?.name}
              {user?.subscription?.plan && (
                <PlanBadge>
                  {user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)}
                </PlanBadge>
              )}
            </UserName>
          </WelcomeText>
          
          <HeaderActions>
            <ActionButton 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/subscription')}
            >
              Manage Subscription
            </ActionButton>
            
            <ActionButton 
              primary
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
            >
              Logout
            </ActionButton>
          </HeaderActions>
        </HeaderContent>
      </DashboardHeader>
      
      <DashboardContent>
        <StatsGrid>
          <StatCard whileHover={{ y: -5 }}>
            <StatTitle>Characters Created</StatTitle>
            <StatValue>{user?.usage?.charactersCreated || 0}</StatValue>
            <StatMeta>
              of {usageLimits.characters} monthly limit
              <ProgressBarContainer>
                <ProgressBar progress={charactersUsagePercent} />
              </ProgressBarContainer>
            </StatMeta>
          </StatCard>
          
          <StatCard whileHover={{ y: -5 }}>
            <StatTitle>API Calls</StatTitle>
            <StatValue>{user?.usage?.apiCalls || 0}</StatValue>
            <StatMeta>
              of {usageLimits.apiCalls} monthly limit
              <ProgressBarContainer>
                <ProgressBar progress={apiCallsUsagePercent} />
              </ProgressBarContainer>
            </StatMeta>
          </StatCard>
          
          <StatCard whileHover={{ y: -5 }}>
            <StatTitle>Subscription Status</StatTitle>
            <StatValue>
              {user?.subscription?.status === 'active' ? 'Active' : 'Inactive'}
            </StatValue>
            {user?.subscription?.status === 'active' && (
              <StatMeta>{daysLeft} days remaining</StatMeta>
            )}
          </StatCard>
          
          <StatCard whileHover={{ y: -5 }}>
            <StatTitle>Created Characters</StatTitle>
            <StatValue>{characters.length}</StatValue>
            <StatMeta>Total characters in your library</StatMeta>
          </StatCard>
        </StatsGrid>
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'characters'} 
            onClick={() => handleTabChange('characters')}
          >
            Create Characters
          </Tab>
          <Tab 
            active={activeTab === 'models'} 
            onClick={() => handleTabChange('models')}
          >
            AI Models
          </Tab>
          <Tab 
            active={activeTab === 'workflows'} 
            onClick={() => handleTabChange('workflows')}
          >
            Workflows
          </Tab>
        </TabsContainer>
        
        {renderDashboardTab(activeTab)}
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Dashboard;
