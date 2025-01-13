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
      <h2>我们的知识来源</h2>
      
      <div className="data-collection">
        <div className="experiment-details">
          <h4>鼓浪屿实验</h4>
          <ul>
            <li>持续时间：12 个月</li>
            <li>参与者：5000+ 人</li>
            <li>方法：GPS 跟踪、调查、传感器</li>
          </ul>
        </div>
        
        <div className="open-source-data">
          <h4>外部数据源</h4>
          <ul>
            <li>来自 OpenWeatherMap API 的天气数据</li>
            <li>来自评论平台的游客反馈</li>
            <li>公共交通时刻表</li>
          </ul>
        </div>
      </div>
      
      <div className="visualization">
        <div className="data-distribution">
          <h4>数据源分布</h4>
          <div className="placeholder">图表加载中...</div>
        </div>
        
        <div className="collection-points-map">
          <h4>数据收集点</h4>
          <div className="placeholder">地图加载中...</div>
        </div>
      </div>
      
      <div className="access-options">
        <h3>访问数据</h3>
        <div className="download-options">
          <button>下载 CSV</button>
          <button>下载 JSON</button>
        </div>
        <div className="api-docs">
          <a href="/api-docs">查看 API 文档 →</a>
        </div>
      </div>
    </motion.div>
  );
};

export default DataSourcesPanel;
