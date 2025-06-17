// Used to format prices in a consistent way across the app
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: price % 100 === 0 ? 0 : 2,
  }).format(price / 100);
};

// Calculate discounted yearly price
export const calculateYearlyPrice = (monthlyPrice, discountPercentage = 20) => {
  const yearlyPrice = monthlyPrice * 12;
  const discount = yearlyPrice * (discountPercentage / 100);
  return yearlyPrice - discount;
};

// Format the feature value in a human-readable way
export const formatFeatureValue = (value) => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value;
};

// Helper to compare subscriptions for upgrades/downgrades
export const isPlanUpgrade = (currentPlan, newPlan) => {
  const planRanking = {
    free: 0,
    basic: 1,
    pro: 2,
    enterprise: 3
  };
  
  return planRanking[newPlan] > planRanking[currentPlan];
};
