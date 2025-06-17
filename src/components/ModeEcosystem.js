/**
 * Mode Ecosystem UI Component
 * Interactive interface for the 300+ development mode ecosystem
 */

import React, { useState, useEffect } from 'react';
import { modeManager } from '../modes/ModeManager.js';

const ModeEcosystem = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentMode, setCurrentMode] = useState(null);
  const [ecosystemStats, setEcosystemStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [selectedTier, setSelectedTier] = useState(1);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeEcosystem = async () => {
      setLoading(true);
      try {
        const initialized = await modeManager.initialize();
        if (initialized) {
          setIsInitialized(true);
          updateStats();
        }
      } catch (error) {
        console.error('Failed to initialize mode ecosystem:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeEcosystem();
  }, []);

  const updateStats = () => {
    const stats = modeManager.getEcosystemStats();
    setEcosystemStats(stats);
    setCurrentMode(stats.currentMode);
  };

  const handleModeSwitch = async (modeSlug) => {
    const success = await modeManager.switchMode(modeSlug);
    if (success) {
      updateStats();
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = modeManager.searchModes(query);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    const tierModes = modeManager.getModesByTier(tier);
    // Update display with tier modes
  };

  const getRecommendations = (context) => {
    const recs = modeManager.getRecommendations(context);
    setRecommendations(recs);
  };

  if (loading) {
    return (
      <div className="mode-ecosystem-loading">
        <div className="loading-spinner"></div>
        <h2>🚀 Initializing Mode Ecosystem...</h2>
        <p>Loading 300+ specialized development modes...</p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="mode-ecosystem-error">
        <h2>❌ Failed to Initialize Mode Ecosystem</h2>
        <p>Please refresh to try again.</p>
      </div>
    );
  }

  return (
    <div className="mode-ecosystem">
      <header className="ecosystem-header">
        <h1>🌟 Development Mode Ecosystem</h1>
        <div className="ecosystem-stats">
          <div className="stat-card">
            <span className="stat-number">{ecosystemStats?.totalModes}</span>
            <span className="stat-label">Total Modes</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{ecosystemStats?.modesUsedToday}</span>
            <span className="stat-label">Used Today</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{ecosystemStats?.totalSessions}</span>
            <span className="stat-label">Total Sessions</span>
          </div>
        </div>
      </header>

      <div className="ecosystem-content">
        <aside className="ecosystem-sidebar">
          <div className="search-section">
            <h3>🔍 Search Modes</h3>
            <input
              type="text"
              placeholder="Search by name, capability, or expertise..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="tier-navigation">
            <h3>📚 Tiers</h3>
            <div className="tier-list">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(tier => (
                <button
                  key={tier}
                  className={`tier-button ${selectedTier === tier ? 'active' : ''}`}
                  onClick={() => handleTierSelect(tier)}
                >
                  <span className="tier-number">Tier {tier}</span>
                  <span className="tier-name">{getTierName(tier)}</span>
                </button>
              ))}
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="recommendations">
              <h3>💡 Recommendations</h3>
              <div className="recommendation-list">
                {recommendations.map(mode => (
                  <div key={mode.slug} className="recommendation-item">
                    <span className="mode-name">{mode.name}</span>
                    <button
                      onClick={() => handleModeSwitch(mode.slug)}
                      className="switch-button"
                    >
                      Switch
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="ecosystem-main">
          <div className="current-mode-display">
            {currentMode ? (
              <div className="active-mode">
                <h2>🎯 Active Mode</h2>
                <div className="mode-info">
                  <span className="mode-name">{currentMode}</span>
                  <button
                    onClick={() => modeManager.deactivateMode()}
                    className="deactivate-button"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-active-mode">
                <h2>💤 No Active Mode</h2>
                <p>Select a mode to begin specialized development</p>
              </div>
            )}
          </div>

          <div className="mode-grid">
            {searchResults ? (
              <SearchResults
                results={searchResults}
                onModeSelect={handleModeSwitch}
              />
            ) : (
              <TierModes
                tier={selectedTier}
                onModeSelect={handleModeSwitch}
              />
            )}
          </div>
        </main>
      </div>

      <footer className="ecosystem-footer">
        <div className="performance-metrics">
          <h4>⚡ Performance</h4>
          <div className="metrics">
            <span>Load Time: {ecosystemStats?.performanceMetrics?.loadTime}ms</span>
            <span>Memory Usage: {ecosystemStats?.performanceMetrics?.memoryUsage}MB</span>
            <span>Active Modes: {ecosystemStats?.modesUsedToday?.size || 0}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const SearchResults = ({ results, onModeSelect }) => {
  return (
    <div className="search-results">
      <h3>🔍 Search Results</h3>
      {Object.entries(results).map(([category, modes]) => (
        modes.length > 0 && (
          <div key={category} className="result-category">
            <h4>{formatCategoryName(category)}</h4>
            <div className="mode-cards">
              {modes.map(mode => (
                <ModeCard
                  key={mode.slug}
                  mode={mode}
                  onSelect={onModeSelect}
                />
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

const TierModes = ({ tier, onModeSelect }) => {
  const [tierModes, setTierModes] = useState([]);

  useEffect(() => {
    const modes = modeManager.getModesByTier(tier);
    setTierModes(modes);
  }, [tier]);

  return (
    <div className="tier-modes">
      <h3>{getTierName(tier)} - Tier {tier}</h3>
      <div className="mode-cards">
        {tierModes.map(mode => (
          <ModeCard
            key={mode.slug}
            mode={mode}
            onSelect={onModeSelect}
          />
        ))}
      </div>
    </div>
  );
};

const ModeCard = ({ mode, onSelect }) => {
  return (
    <div className="mode-card">
      <div className="mode-header">
        <h4 className="mode-name">{mode.name}</h4>
        <span className="mode-tier">Tier {mode.tier}</span>
      </div>
      <div className="mode-description">
        <p>{mode.description}</p>
      </div>
      <div className="mode-details">
        <div className="mode-capabilities">
          <strong>Capabilities:</strong>
          <div className="capability-tags">
            {Array.from(mode.capabilities || []).slice(0, 3).map(cap => (
              <span key={cap} className="capability-tag">{cap}</span>
            ))}
          </div>
        </div>
        <div className="mode-tools">
          <strong>Tools:</strong>
          <div className="tool-tags">
            {Array.from(mode.tools || []).slice(0, 3).map(tool => (
              <span key={tool} className="tool-tag">{tool}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mode-actions">
        <button
          onClick={() => onSelect(mode.slug)}
          className="activate-button"
        >
          Activate Mode
        </button>
      </div>
    </div>
  );
};

// Helper functions
const getTierName = (tier) => {
  const tierNames = {
    1: 'Core Development',
    2: 'Frontend Mastery',
    3: 'Backend Mastery',
    4: 'AI/ML Mastery',
    5: 'Cloud & Infrastructure',
    6: 'Data & Analytics',
    7: 'Quality & Testing',
    8: 'Specialized Domain',
    9: 'Operations & Support',
    10: 'Emerging Technologies'
  };
  return tierNames[tier] || `Tier ${tier}`;
};

const formatCategoryName = (category) => {
  return category.split(/(?=[A-Z])/).join(' ').replace(/^./, str => str.toUpperCase());
};

export default ModeEcosystem;