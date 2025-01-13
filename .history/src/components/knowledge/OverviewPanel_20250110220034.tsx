import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar,Legend
} from 'recharts';
import './styles/OverviewPanel.css';

const OverviewPanel: React.FC = () => {
  // 天气和交通数据
  const weatherData = {
    temperature: 26,
    humidity: 65,
    windSpeed: 3.5,
    condition: '晴朗'
  };
  const trafficData = [
    { time: '08:00', traffic: 400 },
    { time: '10:00', traffic: 800 },
    { time: '12:00', traffic: 1200 },
    { time: '14:00', traffic: 1000 },
    { time: '16:00', traffic: 1500 },
    { time: '18:00', traffic: 900 },
  ];

  // 游客密度热点数据
  const densityData = [
    { name: '日光岩', value: 400 },
    { name: '菽庄花园', value: 300 },
    { name: '钢琴博物馆', value: 200 },
    { name: '皓月园', value: 150 },
    { name: '鼓浪屿海滩', value: 350 },
  ];

  // 游客分布数据
  const visitorDistribution = [
    { type: '本地游客', value: 30 },
    { type: '国内游客', value: 50 },
    { type: '国际游客', value: 20 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
              <span>10,000+</span>
            </li>
          </ul>
        </div>
        
        <div className="top-attractions">
          <h3>五大景点</h3>
          <ul>
            <li>日光岩</li>
            <li>菽庄花园</li>
            <li>钢琴博物馆</li>
            <li>皓月园</li>
            <li>鼓浪屿海滩</li>
          </ul>
        </div>
      </div>
      
      <div className="dynamic-info">
      {/* <div className="weather-info"> */}
      <div className="top-attractions">
          <h3>实时天气</h3>
          <ul>
            <li>
              <span>温度</span>
              <span>{weatherData.temperature}°C</span>
            </li>
            <li>
              <span>湿度</span>
              <span>{weatherData.humidity}%</span>
            </li>
            <li>
              <span>风速</span>
              <span>{weatherData.windSpeed} m/s</span>
            </li>
            <li>
              <span>天气状况</span>
              <span>{weatherData.condition}</span>
            </li>
          </ul>
        </div>
        
        <div className="visitor-heatmap">
          <h3>实时游客密度</h3>
          <BarChart width={400} height={200} data={densityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
      
      <div className="visitor-stats">
        <h3>游客分布</h3>
        <PieChart width={400} height={220}>
          <Pie
            data={visitorDistribution}
            cx={200}
            cy={100}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            nameKey="type"  // 添加这行来指定图例显示的文本
            label
          >
            {visitorDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />  {/* 添加图例组件 */}
        </PieChart>
      </div>
    </motion.div>
  );
};

export default OverviewPanel;
