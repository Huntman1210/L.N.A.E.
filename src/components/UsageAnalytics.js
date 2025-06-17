import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Activity, TrendingUp, Users, Zap } from 'react-feather';
import axios from 'axios';

const AnalyticsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || '#7C3AED'};
  color: white;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1F2937;
  line-height: 1;
`;

const StatLabel = styled.div`
  color: #6B7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ChartContainer = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  color: #1F2937;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #D1D5DB;
  background: ${props => props.active ? '#7C3AED' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #7C3AED;
    ${props => !props.active && 'background: #F9FAFB;'}
  }
`;

const COLORS = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444'];

const UsageAnalytics = () => {
  const [period, setPeriod] = useState('last30days');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState([]);
  const [currentUsage, setCurrentUsage] = useState([]);
  const [stats, setStats] = useState({
    totalCharacters: 0,
    totalApiCalls: 0,
    totalImages: 0,
    avgExecutionTime: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const [analyticsRes, usageRes] = await Promise.all([
        axios.get(`/api/usage/analytics?period=${period}`),
        axios.get('/api/usage/current')
      ]);

      setAnalytics(analyticsRes.data);
      setCurrentUsage(usageRes.data);

      // Calculate stats
      const characterCreation = usageRes.data.find(u => u._id === 'character_creation');
      const apiCalls = usageRes.data.find(u => u._id === 'api_call');
      const imageGeneration = usageRes.data.find(u => u._id === 'image_generation');

      setStats({
        totalCharacters: characterCreation?.count || 0,
        totalApiCalls: apiCalls?.count || 0,
        totalImages: imageGeneration?.totalImages || 0,
        avgExecutionTime: Math.round(
          (characterCreation?.avgExecutionTime || 0) + 
          (apiCalls?.avgExecutionTime || 0)
        ) / 2
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    return analytics.map(item => ({
      date: new Date(item._id).toLocaleDateString(),
      total: item.totalCount,
      characters: item.usage.find(u => u.type === 'character_creation')?.count || 0,
      apiCalls: item.usage.find(u => u.type === 'api_call')?.count || 0,
      images: item.usage.find(u => u.type === 'image_generation')?.count || 0
    }));
  };

  const preparePieData = () => {
    return currentUsage.map((item, index) => ({
      name: item._id.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: item.count,
      color: COLORS[index % COLORS.length]
    }));
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  const chartData = prepareChartData();
  const pieData = preparePieData();

  return (
    <AnalyticsContainer>
      <h2>Usage Analytics</h2>
      
      <FilterContainer>
        <FilterButton
          active={period === 'last7days'}
          onClick={() => setPeriod('last7days')}
        >
          Last 7 Days
        </FilterButton>
        <FilterButton
          active={period === 'last30days'}
          onClick={() => setPeriod('last30days')}
        >
          Last 30 Days
        </FilterButton>
        <FilterButton
          active={period === 'last90days'}
          onClick={() => setPeriod('last90days')}
        >
          Last 90 Days
        </FilterButton>
      </FilterContainer>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon color="#7C3AED">
            <Users size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalCharacters}</StatValue>
            <StatLabel>Characters Created</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon color="#10B981">
            <Activity size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalApiCalls}</StatValue>
            <StatLabel>API Calls</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon color="#F59E0B">
            <TrendingUp size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalImages}</StatValue>
            <StatLabel>Images Generated</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatIcon color="#EF4444">
            <Zap size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.avgExecutionTime}ms</StatValue>
            <StatLabel>Avg Response Time</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ChartContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ChartTitle>Usage Over Time</ChartTitle>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="characters" stroke="#7C3AED" strokeWidth={2} />
            <Line type="monotone" dataKey="apiCalls" stroke="#10B981" strokeWidth={2} />
            <Line type="monotone" dataKey="images" stroke="#F59E0B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <ChartContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ChartTitle>Daily Usage Breakdown</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="characters" fill="#7C3AED" />
              <Bar dataKey="apiCalls" fill="#10B981" />
              <Bar dataKey="images" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <ChartTitle>Usage Distribution</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </AnalyticsContainer>
  );
};

export default UsageAnalytics;
