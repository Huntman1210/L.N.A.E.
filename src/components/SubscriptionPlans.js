import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Check, X } from 'react-feather';
import axios from 'axios';

const PlansContainer = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const PlansHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PlansTitle = styled.h2`
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const PlansDescription = styled.p`
  color: #666;
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
`;

const BillingToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  gap: 1rem;

  .toggle {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
  }

  .toggle input {
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
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #7c3aed;
  }

  input:checked + .slider:before {
    transform: translateX(30px);
  }
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const PlanCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  ${props => props.popular && `
    border: 2px solid #7c3aed;
    &:before {
      content: 'Most Popular';
      position: absolute;
      top: 12px;
      right: -30px;
      background: #7c3aed;
      color: white;
      padding: 4px 40px;
      transform: rotate(45deg);
      font-size: 0.8rem;
      font-weight: 500;
    }
  `}
`;

const PlanName = styled.h3`
  color: #1a1a1a;
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
`;

const PlanPrice = styled.div`
  margin: 1rem 0;
  
  .amount {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a1a;
  }
  
  .period {
    color: #666;
    font-size: 1rem;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  flex-grow: 1;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: ${props => props.disabled ? '#999' : '#333'};
  
  svg {
    margin-right: 0.5rem;
    color: ${props => props.disabled ? '#999' : '#7c3aed'};
  }
`;

const SubscribeButton = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: none;
  background: ${props => props.primary ? '#7c3aed' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#7c3aed'};
  border: ${props => props.primary ? 'none' : '2px solid #7c3aed'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  }

  &:disabled {
    background: #ccc;
    border-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.p`
  color: #e53935;
  text-align: center;
  margin-top: 1rem;
`;

const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: price % 100 === 0 ? 0 : 2,
  }).format(price / 100);
};

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await axios.get('/api/subscriptions/plans');
        setPlans(data);
        
        // Get current subscription
        const { data: userData } = await axios.get('/api/subscriptions/current');
        setCurrentPlan(userData.subscription?.plan);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load subscription plans');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, []);

  const handleSubscribe = async (plan) => {
    try {
      const { data: { sessionUrl } } = await axios.post('/api/subscriptions/create-checkout-session', {
        priceId: yearlyBilling ? plan.yearlyPriceId : plan.monthlyPriceId,
        planId: plan._id
      });
      
      window.location.href = sessionUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate checkout');
    }
  };

  if (loading) {
    return <div>Loading plans...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PlansContainer>
      <PlansHeader>
        <PlansTitle>Choose Your Plan</PlansTitle>
        <PlansDescription>
          Select the plan that best fits your needs. All plans include access to our core features.
        </PlansDescription>
        <BillingToggle>
          <span>Monthly</span>
          <label className="toggle" aria-label="Toggle yearly billing">
            <input
              type="checkbox"
              checked={yearlyBilling}
              onChange={() => setYearlyBilling(!yearlyBilling)}
            />
            <span className="slider"></span>
          </label>
          <span>Yearly (Save 20%)</span>
        </BillingToggle>
      </PlansHeader>

      <PlansGrid>
        {plans.map((plan) => (
          <PlanCard
            key={plan._id}
            popular={plan.name === 'pro'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PlanName>{plan.displayName}</PlanName>
            <PlanPrice>
              <span className="amount">
                {formatPrice(yearlyBilling ? plan.price * 12 * 0.8 : plan.price)}
              </span>
              <span className="period">/{yearlyBilling ? 'year' : 'month'}</span>
            </PlanPrice>

            <FeaturesList>
              <Feature>
                <Check size={18} />
                {plan.features.charactersPerMonth} characters per month
              </Feature>
              <Feature>
                <Check size={18} />
                {plan.features.apiCallsPerMonth} API calls per month
              </Feature>
              <Feature>
                <Check size={18} />
                Up to {plan.features.maxImageOutputs} image outputs per generation
              </Feature>
              <Feature disabled={!plan.features.customPromptTemplates}>
                {plan.features.customPromptTemplates ? <Check size={18} /> : <X size={18} />}
                Custom prompt templates
              </Feature>
              <Feature disabled={!plan.features.prioritySupport}>
                {plan.features.prioritySupport ? <Check size={18} /> : <X size={18} />}
                Priority support
              </Feature>
              <Feature disabled={!plan.features.batchGeneration}>
                {plan.features.batchGeneration ? <Check size={18} /> : <X size={18} />}
                Batch character generation
              </Feature>
            </FeaturesList>

            <SubscribeButton
              primary={plan.name === 'pro'}
              onClick={() => handleSubscribe(plan)}
              disabled={currentPlan?.name === plan.name}
            >
              {currentPlan?.name === plan.name ? 'Current Plan' : 'Subscribe'}
            </SubscribeButton>
          </PlanCard>
        ))}
      </PlansGrid>
    </PlansContainer>
  );
};

export default SubscriptionPlans;
