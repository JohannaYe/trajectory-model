import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import './styles/DataSourcesPanel.css';

const DataSourcesPanel: React.FC = () => {
  // 数据源分布的假数据
  const dataDistribution = [
    { name: 'GPS追踪数据', value: 35 },
    { name: '问卷调查', value: 25 },
    { name: '传感器数据', value: 20 },
    { name: '社交媒体', value: 15 },
    { name: '其他来源', value: 5 },
  ];

  // 数据收集点的假数据
  const collectionPoints = [
    { id: 1, name: '日光岩', lat: 24.4478, lng: 118.0689, dataTypes: ['GPS', '传感器'] },
    { id: 2, name: '菽庄花园', lat: 24.4421, lng: 118.0647, dataTypes: ['问卷', 'GPS'] },
    { id: 3, name: '三一堂', lat: 24.4456, lng: 118.0664, dataTypes: ['传感器'] },
    { id: 4, name: '皓月园', lat: 24.4445, lng: 118.0675, dataTypes: ['GPS', '问卷'] },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
          <PieChart width={400} height={300}>
            <Pie
              data={dataDistribution}
              cx={200}
              cy={150}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {dataDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              align="left"
              verticalAlign="top"
            />
          </PieChart>
        </div>
        
        <div className="collection-points-map">
          <h4>数据收集点</h4>
          <div className="map-container">
            {/* 这里可以使用实际的地图组件，这里用简单的标记点示意 */}
            <div className="map-points">
              {collectionPoints.map(point => (
                <div 
                  key={point.id}
                  className="map-point"
                  style={{
                    position: 'absolute',
                    left: `${(point.lng - 118.06) * 1000}px`,
                    top: `${(24.45 - point.lat) * 1000}px`,
                  }}
                  title={`${point.name}\n数据类型: ${point.dataTypes.join(', ')}`}
                />
              ))}
            </div>
          </div>
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
