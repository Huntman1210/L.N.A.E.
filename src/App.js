import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import CharacterCreator from './components/CharacterCreator.js';
import ModelSelector from './components/ModelSelector.js';
import AgentDashboard from './components/AgentDashboard.js';
import WorkflowManager from './components/WorkflowManager.js';
import ImageGenerator from './components/ImageGenerator.js';
import SubscriptionPlans from './components/SubscriptionPlans.js';
import Dashboard from './components/Dashboard.js';
import UserProfile from './components/UserProfile.js';
import UsageAnalytics from './components/UsageAnalytics.js';
import ModeManager from './components/ModeManager.js';
import ModeEcosystem from './components/ModeEcosystem.js';
import Sidebar from './components/Sidebar.js';
import NotificationSystem, { useNotifications } from './components/NotificationSystem.js';
import './styles/ModeEcosystem.css';

// Premium Theme Configuration
const theme = {
  colors: {
    primary: '#6366F1',
    primaryDark: '#4F46E5',
    secondary: '#EC4899',
    accent: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    dark: '#111827',
    darkSecondary: '#1F2937',
    light: '#F9FAFB',
    white: '#FFFFFF',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      hero: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)',
      card: 'linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)',
      glass: 'linear-gradient(145deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)',
      dark: 'linear-gradient(145deg, #1F2937 0%, #111827 100%)'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      glow: '0 0 50px rgba(99, 102, 241, 0.3)',
      premium: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  typography: {
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      xxxl: '2rem'
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px'
  }
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 400;
    line-height: 1.6;
    color: ${props => props.theme.colors.gray[800]};
    background: ${props => props.theme.colors.gradients.hero};
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #6366F1, #8B5CF6);
    border-radius: 3px;
    
    &:hover {
      background: linear-gradient(45deg, #4F46E5, #7C3AED);
    }
  }

  ::selection {
    background: rgba(99, 102, 241, 0.3);
    color: inherit;
  }

  .glass-morphism {
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.125);
  }

  .premium-gradient-text {
    background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
`;

const MainContent = styled(motion.main)`
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  background: transparent;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 280px;
    right: 0;
    height: 100vh;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.02) 100%
    );
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: -1;
  }

  @media (max-width: 1024px) {
    margin-left: 0;
    
    &::before {
      left: 0;
    }
  }
`;

const ContentWrapper = styled(motion.div)`
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FloatingElements = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -2;
  overflow: hidden;

  .floating-circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
    animation: float 20s infinite ease-in-out;
    
    &:nth-child(1) {
      width: 300px;
      height: 300px;
      top: -150px;
      right: -150px;
      animation-delay: 0s;
    }
    
    &:nth-child(2) {
      width: 200px;
      height: 200px;
      bottom: -100px;
      left: -100px;
      animation-delay: -7s;
    }
    
    &:nth-child(3) {
      width: 150px;
      height: 150px;
      top: 30%;
      right: 10%;
      animation-delay: -14s;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
      opacity: 0.5;
    }
    33% {
      transform: translateY(-20px) rotate(120deg);
      opacity: 0.8;
    }
    66% {
      transform: translateY(20px) rotate(240deg);
      opacity: 0.3;
    }
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  .loading-content {
    text-align: center;
    color: white;
    
    .spinner {
      width: 60px;
      height: 60px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }
    
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    p {
      opacity: 0.9;
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const App = () => {
  const { notifications, removeNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <LoadingOverlay
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-content">
            <div className="spinner"></div>
            <h2>AI Character Creator</h2>
            <p>Initializing premium experience...</p>
          </div>
        </LoadingOverlay>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <FloatingElements>
            <div className="floating-circle"></div>
            <div className="floating-circle"></div>
            <div className="floating-circle"></div>
          </FloatingElements>

          <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          <MainContent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ContentWrapper>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route 
                    path="/subscription" 
                    element={
                      <motion.div {...pageTransition}>
                        <SubscriptionPlans />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <motion.div {...pageTransition}>
                        <Dashboard />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <motion.div {...pageTransition}>
                        <UserProfile />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <motion.div {...pageTransition}>
                        <UsageAnalytics />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/modes" 
                    element={
                      <motion.div {...pageTransition}>
                        <ModeManager />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/ecosystem" 
                    element={
                      <motion.div {...pageTransition}>
                        <ModeEcosystem />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/create" 
                    element={
                      <motion.div {...pageTransition}>
                        <CharacterCreator />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/models" 
                    element={
                      <motion.div {...pageTransition}>
                        <ModelSelector />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/workflows" 
                    element={
                      <motion.div {...pageTransition}>
                        <WorkflowManager />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/agents" 
                    element={
                      <motion.div {...pageTransition}>
                        <AgentDashboard />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/images" 
                    element={
                      <motion.div {...pageTransition}>
                        <ImageGenerator />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/" 
                    element={
                      <motion.div {...pageTransition}>
                        <Dashboard />
                      </motion.div>
                    } 
                  />
                </Routes>
              </AnimatePresence>
            </ContentWrapper>
          </MainContent>
          
          <NotificationSystem
            notifications={notifications}
            removeNotification={removeNotification}
          />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
};

export default App;
