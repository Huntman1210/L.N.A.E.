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

const AgentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  flex: 1;
`;

const AgentCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.isActive ? '#4ade80' : props.color || '#64748b'};
  }
`;

const AgentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AgentAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.color || '#4ade80'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const AgentInfo = styled.div`
  flex: 1;
`;

const AgentName = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.2rem;
`;

const AgentRole = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 0.9rem;
  text-transform: capitalize;
`;

const AgentStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.active ? '#4ade80' : '#64748b'};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#4ade80' : '#64748b'};
`;

const AgentDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const AgentStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  color: #4ade80;
  font-size: 1.1rem;
  font-weight: 600;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.7rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.primary ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.primary ? 'transparent' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  flex: 1;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConversationPanel = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  min-height: 200px;
`;

const ConversationTitle = styled.h3`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

const Message = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid ${props => props.color || '#4ade80'};
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MessageAgent = styled.span`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const MessageTime = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
`;

const MessageContent = styled.p`
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

function AgentDashboard() {
  const [agents, setAgents] = useState([]);
  const [activeAgents, setActiveAgents] = useState(new Set());
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Simulate loading agents
    const mockAgents = [
      {
        id: 'character_designer',
        name: 'Character Designer',
        role: 'character_designer',
        specialty: 'Creating detailed character profiles and backstories',
        icon: '🎭',
        color: '#8b5cf6',
        active: true,
        tasks: 12,
        success: 94,
        model: 'GPT-4'
      },
      {
        id: 'code_generator',
        name: 'Code Generator',
        role: 'code_generator',
        specialty: 'Writing clean, efficient code',
        icon: '💻',
        color: '#3b82f6',
        active: true,
        tasks: 8,
        success: 98,
        model: 'CodeLlama'
      },
      {
        id: 'ui_designer',
        name: 'UI/UX Designer',
        role: 'ui_designer',
        specialty: 'Creating beautiful user interfaces',
        icon: '🎨',
        color: '#ec4899',
        active: false,
        tasks: 15,
        success: 92,
        model: 'Claude 3'
      },
      {
        id: 'game_designer',
        name: 'Game Designer',
        role: 'game_designer',
        specialty: 'Designing engaging game mechanics',
        icon: '🎮',
        color: '#f59e0b',
        active: false,
        tasks: 6,
        success: 89,
        model: 'Gemini Pro'
      },
      {
        id: 'social_manager',
        name: 'Social Media Manager',
        role: 'social_manager',
        specialty: 'Creating viral social content',
        icon: '📱',
        color: '#10b981',
        active: true,
        tasks: 23,
        success: 87,
        model: 'Mistral'
      },
      {
        id: 'project_manager',
        name: 'Project Manager',
        role: 'project_manager',
        specialty: 'Coordinating tasks and workflows',
        icon: '📊',
        color: '#6366f1',
        active: false,
        tasks: 18,
        success: 96,
        model: 'GPT-4'
      },
    ];

    const mockConversations = [
      {
        id: 1,
        agent: 'Character Designer',
        color: '#8b5cf6',
        time: '2 min ago',
        message: 'I\'ve completed the character profile for the medieval knight. The backstory includes a tragic past that drives their quest for redemption.'
      },
      {
        id: 2,
        agent: 'Code Generator',
        color: '#3b82f6',
        time: '5 min ago',
        message: 'Generated the React component for the character display. Implemented responsive design and smooth animations.'
      },
      {
        id: 3,
        agent: 'Social Manager',
        color: '#10b981',
        time: '8 min ago',
        message: 'Created a Twitter thread about the new character creation feature. The engagement predictions look promising!'
      },
    ];

    setAgents(mockAgents);
    setActiveAgents(new Set(mockAgents.filter(a => a.active).map(a => a.id)));
    setConversations(mockConversations);
  }, []);

  const toggleAgent = (agentId) => {
    const newActiveAgents = new Set(activeAgents);
    if (newActiveAgents.has(agentId)) {
      newActiveAgents.delete(agentId);
    } else {
      newActiveAgents.add(agentId);
    }
    setActiveAgents(newActiveAgents);

    // Update agent status
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, active: newActiveAgents.has(agentId) }
        : agent
    ));
  };

  const assignTask = (agentId, task) => {
    console.log(`Assigning task to ${agentId}: ${task}`);
    // Here you would typically call the agent orchestrator
  };

  return (
    <Container>
      <Title>🎯 Agent Dashboard</Title>
      
      <AgentsGrid>
        {agents.map(agent => (
          <AgentCard
            key={agent.id}
            isActive={agent.active}
            color={agent.color}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <AgentHeader>
              <AgentAvatar color={agent.color}>
                {agent.icon}
              </AgentAvatar>
              <AgentInfo>
                <AgentName>{agent.name}</AgentName>
                <AgentRole>{agent.role.replace('_', ' ')}</AgentRole>
              </AgentInfo>
              <AgentStatus active={agent.active}>
                <StatusDot active={agent.active} />
                {agent.active ? 'Active' : 'Idle'}
              </AgentStatus>
            </AgentHeader>

            <AgentDescription>
              {agent.specialty}
            </AgentDescription>

            <AgentStats>
              <StatItem>
                <StatValue>{agent.tasks}</StatValue>
                <StatLabel>Tasks</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{agent.success}%</StatValue>
                <StatLabel>Success</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{agent.model}</StatValue>
                <StatLabel>Model</StatLabel>
              </StatItem>
            </AgentStats>

            <ActionButtons>
              <ActionButton
                primary={agent.active}
                onClick={() => toggleAgent(agent.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {agent.active ? '⏸️ Pause' : '▶️ Activate'}
              </ActionButton>
              <ActionButton
                onClick={() => assignTask(agent.id, 'New task')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📋 Assign Task
              </ActionButton>
            </ActionButtons>
          </AgentCard>
        ))}
      </AgentsGrid>

      <ConversationPanel>
        <ConversationTitle>💬 Recent Agent Activity</ConversationTitle>
        <MessageList>
          {conversations.map(conversation => (
            <Message key={conversation.id} color={conversation.color}>
              <MessageHeader>
                <MessageAgent>{conversation.agent}</MessageAgent>
                <MessageTime>{conversation.time}</MessageTime>
              </MessageHeader>
              <MessageContent>{conversation.message}</MessageContent>
            </Message>
          ))}
        </MessageList>
      </ConversationPanel>
    </Container>
  );
}

export default AgentDashboard;
