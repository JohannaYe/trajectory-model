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
      <h2>概述</h2>
      
      <div className="static-info">
        <div className="key-stats">
          <h3>关键统计数据</h3>
          <ul>
            <li>
              <span>面积</span>
              <span>1.87 平方公里</span>
            </li>
            <li>
              <span>人口</span>
              <span>约 20,000</span>
            </li>
            <li>
              <span>每日游客容量</span>
              <span>50,000</span>
            </li>
          </ul>
        </div>
        
        <div className="top-attractions">
          <h3>五大景点</h3>
          <ul>
            <li>阳光岩</li>
            <li>菽庄花园</li>
            <li>钢琴博物馆</li>
            <li>皓月园</li>
            <li>鼓浪屿海滩</li>
          </ul>
        </div>
      </div>
      
      <div className="dynamic-info">
        <div className="weather-traffic">
          <h3>当前状况</h3>
          <div className="placeholder">天气和交通数据加载中...</div>
        </div>
        
        <div className="visitor-heatmap">
          <h3>实时游客密度</h3>
          <div className="placeholder">热力图加载中...</div>
        </div>
      </div>
      
      <div className="visitor-stats">
        <h3>游客分布</h3>
        <div className="placeholder">图表加载中...</div>
      </div>
    </motion.div>
  );
};

export default OverviewPanel;
