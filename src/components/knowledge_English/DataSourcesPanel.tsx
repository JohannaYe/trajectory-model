import React from 'react';
import { motion } from 'framer-motion';
import './styles/DataSourcesPanel.css';

const DataSourcesPanel: React.FC = () => {
  return (
    <motion.div 
      className="data-sources-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Where Our Knowledge Comes From</h2>
      
      <div className="data-collection">
        <div className="experiment-details">
          <h4>Gulangyu Experiments</h4>
          <ul>
            <li>Duration: 12 months</li>
            <li>Participants: 10,000+</li>
            <li>Methods: GPS tracking, surveys, sensors</li>
          </ul>
        </div>
        
        <div className="open-source-data">
          <h4>External Data Sources</h4>
          <ul>
            <li>Weather data from OpenWeatherMap API</li>
            <li>Tourist feedback from review platforms</li>
            <li>Public transportation schedules</li>
          </ul>
        </div>
      </div>
      
      <div className="visualization">
        <div className="data-distribution">
          <h4>Data Source Distribution</h4>
          <div className="placeholder">Chart loading...</div>
        </div>
        
        <div className="collection-points-map">
          <h4>Data Collection Points</h4>
          <div className="placeholder">Map loading...</div>
        </div>
      </div>
      
      <div className="access-options">
        <h3>Access Data</h3>
        <div className="download-options">
          <button>Download CSV</button>
          <button>Download JSON</button>
        </div>
        <div className="api-docs">
          <a href="/api-docs">View API Documentation →</a>
        </div>
      </div>
    </motion.div>
  );
};

export default DataSourcesPanel;
