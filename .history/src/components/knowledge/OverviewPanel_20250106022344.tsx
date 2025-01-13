import React from 'react';
import { motion } from 'framer-motion';
import './styles/OverviewPanel.css';

const OverviewPanel: React.FC = () => {
  return (
    <motion.div 
      className="overview-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Overview</h2>
      
      <div className="static-info">
        <div className="key-stats">
          <h3>Key Statistics</h3>
          <ul>
            <li>
              <span>Area Size</span>
              <span>1.87 km²</span>
            </li>
            <li>
              <span>Population</span>
              <span>~20,000</span>
            </li>
            <li>
              <span>Daily Visitor Capacity</span>
              <span>50,000</span>
            </li>
          </ul>
        </div>
        
        <div className="top-attractions">
          <h3>Top 5 Attractions</h3>
          <ul>
            <li>Sunlight Rock</li>
            <li>Shuzhuang Garden</li>
            <li>Piano Museum</li>
            <li>Haoyue Garden</li>
            <li>Gulangyu Beach</li>
          </ul>
        </div>
      </div>
      
      <div className="dynamic-info">
        <div className="weather-traffic">
          <h3>Current Conditions</h3>
          <div className="placeholder">Weather and traffic data loading...</div>
        </div>
        
        <div className="visitor-heatmap">
          <h3>Live Visitor Density</h3>
          <div className="placeholder">Heatmap loading...</div>
        </div>
      </div>
      
      <div className="visitor-stats">
        <h3>Visitor Distribution</h3>
        <div className="placeholder">Charts loading...</div>
      </div>
    </motion.div>
  );
};

export default OverviewPanel;
