import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { User as UserIcon, Key, CreditCard, Bell, Shield } from 'react-feather';
import axios from 'axios';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SideNav = styled.nav`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: ${props => props.active ? '#7c3aed' : 'transparent'};
  color: ${props => props.active ? 'white' : '#4B5563'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.5rem;

  &:hover {
    background: ${props => props.active ? '#6D28D9' : '#F3F4F6'};
  }

  svg {
    margin-right: 0.75rem;
  }
`;

const ContentCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  color: #1F2937;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
  max-width: 500px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #4B5563;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #7C3AED;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
  }
`;

const SaveButton = styled.button`
  background: #7C3AED;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: fit-content;

  &:hover {
    background: #6D28D9;
  }

  &:disabled {
    background: #9CA3AF;
    cursor: not-allowed;
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #D1D5DB;
    transition: .4s;
    border-radius: 24px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #7C3AED;
  }

  input:checked + .slider:before {
    transform: translateX(24px);
  }
`;

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: {
      newFeatures: true,
      usageAlerts: true,
      promotions: false
    },
    privacySettings: {
      publicProfile: false,
      shareUsage: true
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/users/profile');
        setProfileData(prevData => ({
          ...prevData,
          name: data.name,
          email: data.email,
          emailNotifications: {
            ...prevData.emailNotifications,
            ...data.emailNotifications
          },
          privacySettings: {
            ...prevData.privacySettings,
            ...data.privacySettings
          }
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, key] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.put('/api/users/profile', profileData);
      setMessage('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            <Title>Personal Information</Title>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <SaveButton type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </SaveButton>
            </Form>
          </>
        );

      case 'security':
        return (
          <>
            <Title>Security Settings</Title>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <SaveButton type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </SaveButton>
            </Form>
          </>
        );

      case 'notifications':
        return (
          <>
            <Title>Notification Preferences</Title>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      name="emailNotifications.newFeatures"
                      checked={profileData.emailNotifications.newFeatures}
                      onChange={handleInputChange}
                    />
                    <span className="slider"></span>
                  </ToggleSwitch>
                  {' '}New Features & Updates
                </Label>
              </FormGroup>
              <FormGroup>
                <Label>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      name="emailNotifications.usageAlerts"
                      checked={profileData.emailNotifications.usageAlerts}
                      onChange={handleInputChange}
                    />
                    <span className="slider"></span>
                  </ToggleSwitch>
                  {' '}Usage Alerts
                </Label>
              </FormGroup>
              <FormGroup>
                <Label>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      name="emailNotifications.promotions"
                      checked={profileData.emailNotifications.promotions}
                      onChange={handleInputChange}
                    />
                    <span className="slider"></span>
                  </ToggleSwitch>
                  {' '}Promotional Emails
                </Label>
              </FormGroup>
              <SaveButton type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences'}
              </SaveButton>
            </Form>
          </>
        );

      case 'privacy':
        return (
          <>
            <Title>Privacy Settings</Title>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      name="privacySettings.publicProfile"
                      checked={profileData.privacySettings.publicProfile}
                      onChange={handleInputChange}
                    />
                    <span className="slider"></span>
                  </ToggleSwitch>
                  {' '}Make my profile public
                </Label>
              </FormGroup>
              <FormGroup>
                <Label>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      name="privacySettings.shareUsage"
                      checked={profileData.privacySettings.shareUsage}
                      onChange={handleInputChange}
                    />
                    <span className="slider"></span>
                  </ToggleSwitch>
                  {' '}Share anonymous usage data
                </Label>
              </FormGroup>
              <SaveButton type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
              </SaveButton>
            </Form>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <ProfileContainer>
      <ProfileGrid>
        <SideNav>
          <NavItem
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          >
            <UserIcon size={18} /> Profile
          </NavItem>
          <NavItem
            active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
          >
            <Key size={18} /> Security
          </NavItem>
          <NavItem
            active={activeTab === 'billing'}
            onClick={() => setActiveTab('billing')}
          >
            <CreditCard size={18} /> Billing
          </NavItem>
          <NavItem
            active={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} /> Notifications
          </NavItem>
          <NavItem
            active={activeTab === 'privacy'}
            onClick={() => setActiveTab('privacy')}
          >
            <Shield size={18} /> Privacy
          </NavItem>
        </SideNav>

        <ContentCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          key={activeTab}
        >
          {message && (
            <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
          {renderContent()}
        </ContentCard>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default UserProfile;
