import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  BarChart2,
  User,
  LogOut,
  Code,
  Layers,
  Image,
  Activity,
  Command,
  Grid,
  Menu,
  X,
  Settings,
  ChevronRight,
  Star
} from 'react-feather';

const SidebarContainer = styled(motion.aside)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: linear-gradient(180deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 255, 255, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  @media (max-width: 1024px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 280px;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.1) 0%, 
    rgba(139, 92, 246, 0.1) 100%
  );
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1.25rem;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  }
  
  .logo-text {
    flex: 1;
    
    h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: ${props => props.theme.colors.dark};
      margin: 0;
      background: linear-gradient(135deg, #6366F1, #8B5CF6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      font-size: 0.75rem;
      color: ${props => props.theme.colors.gray[600]};
      margin: 0;
      font-weight: 500;
    }
  }
`;

const UserProfile = styled(motion.div)`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .profile-card {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.3) 0%, 
      rgba(255, 255, 255, 0.1) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.4) 0%, 
        rgba(255, 255, 255, 0.2) 100%
      );
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #EC4899, #F59E0B);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1rem;
    }
    
    .user-info {
      flex: 1;
      
      .name {
        font-weight: 600;
        color: ${props => props.theme.colors.dark};
        font-size: 0.875rem;
        margin: 0;
      }
      
      .status {
        font-size: 0.75rem;
        color: ${props => props.theme.colors.gray[600]};
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        
        .status-dot {
          width: 6px;
          height: 6px;
          background: ${props => props.theme.colors.success};
          border-radius: 50%;
        }
      }
    }
    
    .upgrade-badge {
      background: linear-gradient(135deg, #F59E0B, #EC4899);
      color: white;
      font-size: 0.625rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 2px;
  }
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;
  
  .section-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${props => props.theme.colors.gray[500]};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 0 1.5rem 0.5rem;
    margin: 0;
  }
`;

const NavItem = styled(motion.div)`
  margin: 0.25rem 1rem;
  
  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    text-decoration: none;
    color: ${props => props.isActive ? 'white' : props.theme.colors.gray[700]};
    font-weight: ${props => props.isActive ? '600' : '500'};
    font-size: 0.875rem;
    position: relative;
    overflow: hidden;
    background: ${props => props.isActive 
      ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' 
      : 'transparent'
    };
    border: 1px solid ${props => props.isActive 
      ? 'transparent' 
      : 'transparent'
    };
    transition: all 0.2s ease;
    
    &:hover {
      background: ${props => props.isActive 
        ? 'linear-gradient(135deg, #5A5FCF, #7C3AED)' 
        : 'rgba(99, 102, 241, 0.1)'
      };
      color: ${props => props.isActive ? 'white' : props.theme.colors.primary};
      transform: translateX(4px);
      box-shadow: ${props => props.isActive 
        ? '0 4px 12px rgba(99, 102, 241, 0.4)' 
        : '0 2px 8px rgba(99, 102, 241, 0.2)'
      };
    }
    
    .icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      opacity: ${props => props.isActive ? '1' : '0.8'};
    }
    
    .label {
      flex: 1;
    }
    
    .badge {
      background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.2)' : '#EF4444'};
      color: ${props => props.isActive ? 'white' : 'white'};
      font-size: 0.625rem;
      font-weight: 600;
      padding: 0.125rem 0.375rem;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
    }
    
    .arrow {
      opacity: ${props => props.isActive ? '1' : '0'};
      transition: opacity 0.2s ease;
    }
  }
`;

const SidebarFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.05) 0%, 
    rgba(139, 92, 246, 0.05) 100%
  );
`;

const MobileToggle = styled(motion.button)`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  border: none;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  display: none;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  
  @media (max-width: 1024px) {
    display: flex;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
  
  @media (max-width: 1024px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const Sidebar = ({ isOpen = false, onToggle }) => {
  const location = useLocation();
  const [user] = useState({
    name: 'Alex Johnson',
    email: 'alex@company.com',
    avatar: 'AJ',
    plan: 'Pro'
  });

  const navigationItems = [
    {
      section: 'Main',
      items: [
        { path: '/', icon: Home, label: 'Dashboard', badge: null },
        { path: '/create', icon: PlusCircle, label: 'Create Character', badge: 'New' },
        { path: '/modes', icon: Command, label: 'Development Modes', badge: '168' },
        { path: '/ecosystem', icon: Grid, label: 'Mode Ecosystem', badge: null }
      ]
    },
    {
      section: 'Tools',
      items: [
        { path: '/models', icon: Code, label: 'AI Models', badge: null },
        { path: '/workflows', icon: Layers, label: 'Workflows', badge: null },
        { path: '/agents', icon: Activity, label: 'AI Agents', badge: '3' },
        { path: '/images', icon: Image, label: 'Image Generator', badge: null }
      ]
    },
    {
      section: 'Account',
      items: [
        { path: '/analytics', icon: BarChart2, label: 'Analytics', badge: null },
        { path: '/subscription', icon: Star, label: 'Subscription', badge: null },
        { path: '/profile', icon: User, label: 'Profile', badge: null },
        { path: '/settings', icon: Settings, label: 'Settings', badge: null }
      ]
    }
  ];

  return (
    <>
      <MobileToggle
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </MobileToggle>

      <AnimatePresence>
        {isOpen && (
          <Overlay
            isOpen={isOpen}
            onClick={onToggle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <SidebarContainer
        isOpen={isOpen}
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <SidebarHeader>
          <Logo
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="logo-icon">
              AI
            </div>
            <div className="logo-text">
              <h2>Character Creator</h2>
              <p>Premium AI Platform</p>
            </div>
          </Logo>
        </SidebarHeader>

        <UserProfile
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="profile-card">
            <div className="avatar">{user.avatar}</div>
            <div className="user-info">
              <p className="name">{user.name}</p>
              <p className="status">
                <span className="status-dot"></span>
                Online
              </p>
            </div>
            <div className="upgrade-badge">{user.plan}</div>
          </div>
        </UserProfile>

        <Navigation>
          {navigationItems.map((section, sectionIndex) => (
            <NavSection key={section.section}>
              <h3 className="section-title">{section.section}</h3>
              {section.items.map((item, itemIndex) => (
                <NavItem
                  key={item.path}
                  isActive={location.pathname === item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to={item.path}>
                    <item.icon className="icon" />
                    <span className="label">{item.label}</span>
                    {item.badge && <span className="badge">{item.badge}</span>}
                    <ChevronRight className="arrow" size={16} />
                  </Link>
                </NavItem>
              ))}
            </NavSection>
          ))}
        </Navigation>

        <SidebarFooter>
          <NavItem
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/logout">
              <LogOut className="icon" />
              <span className="label">Sign Out</span>
            </Link>
          </NavItem>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func
};

const NavSection = styled.div`
  margin-bottom: 2rem;
  flex: 1;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: ${props => props.active ? '#7C3AED' : '#6B7280'};
  background: ${props => props.active ? '#F3F4F6' : 'transparent'};
  text-decoration: none;
  transition: all 0.2s;
  border-right: ${props => props.active ? '2px solid #7C3AED' : '2px solid transparent'};

  &:hover {
    color: #7C3AED;
    background: #F9FAFB;
  }

  svg {
    margin-right: 0.75rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1.5rem;
  color: #EF4444;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #FEF2F2;
  }

  svg {
    margin-right: 0.75rem;
  }
`;

const Sidebar = ({ isOpen = true }) => {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <SidebarContainer
      isOpen={isOpen}
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Logo>
        <h2>AI Character Creator</h2>
      </Logo>

      <NavSection>
        <NavItem to="/dashboard" active={isActive('/dashboard')}>
          <Home size={18} />
          Dashboard
        </NavItem>
        
        <NavItem to="/create" active={isActive('/create')}>
          <PlusCircle size={18} />
          Create Character
        </NavItem>
        
        <NavItem to="/modes" active={isActive('/modes')}>
          <Code size={18} />
          Modes
        </NavItem>
        
        <NavItem to="/ecosystem" active={isActive('/ecosystem')}>
          <Grid size={18} />
          Mode Ecosystem
        </NavItem>
        
        <NavItem to="/models" active={isActive('/models')}>
          <Layers size={18} />
          Models
        </NavItem>
        
        <NavItem to="/workflows" active={isActive('/workflows')}>
          <Command size={18} />
          Workflows
        </NavItem>
        
        <NavItem to="/images" active={isActive('/images')}>
          <Image size={18} />
          Images
        </NavItem>
        
        <NavItem to="/analytics" active={isActive('/analytics')}>
          <BarChart2 size={18} />
          Analytics
        </NavItem>
        
        <NavItem to="/profile" active={isActive('/profile')}>
          <User size={18} />
          Profile
        </NavItem>
        
        <NavItem to="/subscription" active={isActive('/subscription')}>
          <CreditCard size={18} />
          Subscription
        </NavItem>
      </NavSection>

      <div>
        <LogoutButton onClick={handleLogout}>
          <LogOut size={18} />
          Sign Out
        </LogoutButton>
      </div>
    </SidebarContainer>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool
};

export default Sidebar;
