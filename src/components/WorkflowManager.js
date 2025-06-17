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

const WorkflowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const WorkflowCard = styled(motion.div)`
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
    background: ${props => props.color || '#4ade80'};
  }
`;

const WorkflowHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WorkflowIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${props => props.color || '#4ade80'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const WorkflowInfo = styled.div`
  flex: 1;
`;

const WorkflowName = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.2rem;
`;

const WorkflowType = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-size: 0.9rem;
`;

const WorkflowDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const LaunchButton = styled(motion.button)`
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: auto;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ActiveWorkflows = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  flex: 1;
`;

const SectionTitle = styled.h3`
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const WorkflowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WorkflowItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WorkflowStatus = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'running': return '#4ade80';
      case 'completed': return '#22c55e';
      case 'failed': return '#f87171';
      default: return '#64748b';
    }
  }};
`;

const WorkflowDetails = styled.div`
  flex: 1;
`;

const WorkflowTitle = styled.div`
  color: white;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const WorkflowProgress = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
`;

const ProgressBar = styled.div`
  width: 100px;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #4ade80;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 2rem;
  font-style: italic;
`;

function WorkflowManager() {
  const [workflows] = useState([
    {
      id: 'character_gen',
      name: 'Character Generator',
      type: 'Character Creation',
      icon: '🎭',
      color: '#8b5cf6',
      description: 'Generate detailed characters with AI agents working together'
    },
    {
      id: 'website_gen',
      name: 'Website Builder',
      type: 'Web Development',
      icon: '🌐',
      color: '#3b82f6',
      description: 'Create complete websites from simple descriptions'
    },
    {
      id: 'app_gen',
      name: 'App Generator',
      type: 'App Development',
      icon: '📱',
      color: '#ec4899',
      description: 'Build full-stack applications with frontend and backend'
    },
    {
      id: 'game_gen',
      name: 'Game Creator',
      type: 'Game Development',
      icon: '🎮',
      color: '#f59e0b',
      description: 'Design and implement games with 3D graphics and mechanics'
    },
    {
      id: 'social_gen',
      name: 'Social Content',
      type: 'Social Media',
      icon: '📱',
      color: '#10b981',
      description: 'Generate engaging content for multiple social platforms'
    },
    {
      id: 'automation',
      name: 'Full Automation',
      type: 'Complete Pipeline',
      icon: '⚡',
      color: '#6366f1',
      description: 'Run multiple workflows in parallel for comprehensive projects'
    }
  ]);

  const [activeWorkflows, setActiveWorkflows] = useState([
    {
      id: 1,
      name: 'Fantasy Character Creation',
      type: 'Character',
      status: 'running',
      progress: 75,
      startTime: '2 min ago'
    },
    {
      id: 2,
      name: 'E-commerce Website',
      type: 'Website',
      status: 'completed',
      progress: 100,
      startTime: '15 min ago'
    },
    {
      id: 3,
      name: 'Social Media Campaign',
      type: 'Social',
      status: 'running',
      progress: 45,
      startTime: '5 min ago'
    }
  ]);

  const launchWorkflow = (workflowId, workflowName) => {
    console.log(`Launching workflow: ${workflowId}`);
    
    // Add to active workflows
    const newWorkflow = {
      id: Date.now(),
      name: `New ${workflowName}`,
      type: workflowName.split(' ')[0],
      status: 'running',
      progress: 0,
      startTime: 'Just now'
    };

    setActiveWorkflows(prev => [newWorkflow, ...prev]);

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        // Update status to completed
        setActiveWorkflows(prev => 
          prev.map(wf => 
            wf.id === newWorkflow.id 
              ? { ...wf, status: 'completed', progress: 100 }
              : wf
          )
        );
      } else {
        setActiveWorkflows(prev => 
          prev.map(wf => 
            wf.id === newWorkflow.id 
              ? { ...wf, progress: Math.floor(progress) }
              : wf
          )
        );
      }
    }, 1000);
  };

  const pauseWorkflow = (workflowId) => {
    console.log(`Pausing workflow: ${workflowId}`);
  };

  const stopWorkflow = (workflowId) => {
    setActiveWorkflows(prev => prev.filter(wf => wf.id !== workflowId));
  };

  return (
    <Container>
      <Title>⚡ Automation Workflows</Title>
      
      <WorkflowGrid>
        {workflows.map(workflow => (
          <WorkflowCard
            key={workflow.id}
            color={workflow.color}
            onClick={() => launchWorkflow(workflow.id, workflow.name)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WorkflowHeader>
              <WorkflowIcon color={workflow.color}>
                {workflow.icon}
              </WorkflowIcon>
              <WorkflowInfo>
                <WorkflowName>{workflow.name}</WorkflowName>
                <WorkflowType>{workflow.type}</WorkflowType>
              </WorkflowInfo>
            </WorkflowHeader>

            <WorkflowDescription>
              {workflow.description}
            </WorkflowDescription>

            <LaunchButton
              onClick={(e) => {
                e.stopPropagation();
                launchWorkflow(workflow.id, workflow.name);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 Launch Workflow
            </LaunchButton>
          </WorkflowCard>
        ))}
      </WorkflowGrid>

      <ActiveWorkflows>
        <SectionTitle>🔄 Active Workflows</SectionTitle>
        <WorkflowList>
          {activeWorkflows.length === 0 ? (
            <EmptyState>
              No active workflows. Launch a workflow above to get started!
            </EmptyState>
          ) : (
            activeWorkflows.map(workflow => (
              <WorkflowItem key={workflow.id}>
                <WorkflowStatus status={workflow.status} />
                <WorkflowDetails>
                  <WorkflowTitle>{workflow.name}</WorkflowTitle>
                  <WorkflowProgress>
                    {workflow.type} • Started {workflow.startTime}
                  </WorkflowProgress>
                </WorkflowDetails>
                <ProgressBar>
                  <ProgressFill progress={workflow.progress} />
                </ProgressBar>
                <ActionButtons>
                  {workflow.status === 'running' && (
                    <>
                      <ActionButton
                        onClick={() => pauseWorkflow(workflow.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ⏸️
                      </ActionButton>
                      <ActionButton
                        onClick={() => stopWorkflow(workflow.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ⏹️
                      </ActionButton>
                    </>
                  )}
                  {workflow.status === 'completed' && (
                    <ActionButton
                      onClick={() => stopWorkflow(workflow.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✅ Done
                    </ActionButton>
                  )}
                </ActionButtons>
              </WorkflowItem>
            ))
          )}
        </WorkflowList>
      </ActiveWorkflows>
    </Container>
  );
}

export default WorkflowManager;
