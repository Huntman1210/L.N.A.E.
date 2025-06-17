import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Check, AlertTriangle, RefreshCw } from 'react-feather';
import axios from 'axios';

const VerificationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
`;

const StatusIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  ${props => props.success && `
    background-color: #10B981;
    color: white;
  `}
  
  ${props => props.error && `
    background-color: #EF4444;
    color: white;
  `}
  
  ${props => props.loading && `
    background-color: #6B7280;
    color: white;
  `}
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #1F2937;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #4B5563;
  margin-bottom: 2rem;
  max-width: 400px;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #7C3AED;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6D28D9;
  }

  &:disabled {
    background-color: #9CA3AF;
    cursor: not-allowed;
  }
`;

const EmailVerification = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. Please request a new one.');
        return;
      }

      try {
        await axios.post('/api/auth/verify-email', { token });
        setStatus('success');
        setMessage('Your email has been successfully verified!');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Failed to verify email. Please try again.');
      }
    };

    verifyEmail();
  }, [location]);

  const handleResendVerification = async () => {
    try {
      await axios.post('/api/auth/resend-verification');
      setMessage('A new verification email has been sent. Please check your inbox.');
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setMessage('Failed to resend verification email. Please try again later.');
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <VerificationContainer>
      <StatusIcon success={status === 'success'} error={status === 'error'} loading={status === 'verifying'}>
        {status === 'success' && <Check size={32} />}
        {status === 'error' && <AlertTriangle size={32} />}
        {status === 'verifying' && <RefreshCw size={32} className="animate-spin" />}
      </StatusIcon>

      <Title>
        {status === 'success' && 'Email Verified!'}
        {status === 'error' && 'Verification Failed'}
        {status === 'verifying' && 'Verifying Email'}
      </Title>

      <Message>{message}</Message>

      {status === 'success' && (
        <Button onClick={handleContinue}>
          Continue to Dashboard
        </Button>
      )}

      {status === 'error' && (
        <Button onClick={handleResendVerification}>
          Resend Verification Email
        </Button>
      )}
    </VerificationContainer>
  );
};

export default EmailVerification;
