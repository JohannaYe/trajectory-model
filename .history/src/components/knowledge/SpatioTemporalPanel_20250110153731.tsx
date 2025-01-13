// import React from 'react';
// import { motion } from 'framer-motion';
// import './styles/SpatioTemporalPanel.css';

// const SpatioTemporalPanel: React.FC = () => {
//   return (
//     <motion.div 
//       className="spatio-temporal-panel"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h2>时空洞察</h2>
      
//       <div className="visualization-container">
//         <div className="density-graphs">
//           <h3>访客密度分析</h3>
//           <div className="graph-controls">
//             <select>
//               <option value="hourly">每小时</option>
//               <option value="daily">每日</option>
//               <option value="weekly">每周</option>
//               <option value="monthly">每月</option>
//             </select>
//           </div>
//           <div className="graph-area">
//             <div className="placeholder">密度图加载中...</div>
//           </div>
//         </div>
        
//         <div className="popularity-trends">
//           <h3>景点受欢迎趋势</h3>
//           <div className="trend-controls">
//             <select>
//               <option value="summer">夏季</option>
//               <option value="winter">冬季</option>
//               <option value="spring">春季</option>
//               <option value="fall">秋季</option>
//             </select>
//           </div>
//           <div className="trend-visualization">
//             <div className="placeholder">趋势可视化加载中...</div>
//           </div>
//         </div>
//       </div>
      
//       <div className="predictive-analytics">
//         <h3>预测分析</h3>
//         <div className="prediction-controls">
//           <input type="date" />
//           <select>
//             <option value="weekday">工作日</option>
//             <option value="weekend">周末</option>
//             <option value="holiday">假日</option>
//           </select>
//         </div>
//         <div className="prediction-results">
//           <div className="placeholder">预测结果加载中...</div>
//         </div>
//       </div>
      
//       <div className="customization-tools">
//         <h3>自定义视图</h3>
//         <div className="parameters">
//           <div className="parameter">
//             <label>团体规模</label>
//             <input type="range" min="1" max="10" defaultValue="1" />
//           </div>
//           <div className="parameter">
//             <label>天气状况</label>
//             <select>
//               <option value="sunny">晴天</option>
//               <option value="rainy">雨天</option>
//               <option value="cloudy">阴天</option>
//             </select>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default SpatioTemporalPanel;
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import './styles/SpatioTemporalPanel.css';

const densityData = [
  { name: '00:00', visitors: 100 },
  { name: '01:00', visitors: 20 },
  { name: '02:00', visitors: 20 },
  { name: '03:00', visitors: 10 },
  { name: '04:00', visitors: 5 },
  { name: '05:00', visitors: 6 },
  { name: '06:00', visitors: 7 },
  { name: '07:00', visitors: 24 },
  { name: '08:00', visitors: 60 },
  { name: '09:00', visitors: 180 },
  { name: '10:00', visitors: 300 },
  { name: '11:00', visitors: 320 },
  { name: '12:00', visitors: 440 },
  { name: '13:00', visitors: 460 },
  { name: '14:00', visitors: 580 },
  { name: '15:00', visitors: 500 },
  { name: '16:00', visitors: 420 },
  { name: '17:00', visitors: 440 },
  { name: '18:00', visitors: 460 },
  { name: '19:00', visitors: 480 },
  { name: '20:00', visitors: 300 },
  { name: '21:00', visitors: 200 },
  { name: '22:00', visitors: 240 },
  { name: '23:00', visitors: 260 },
];

const popularityData = [
  { name: '菽庄花园', summer: 400, winter: 240, spring: 300, fall: 280 },
  { name: '日光岩', summer: 300, winter: 139, spring: 220, fall: 200 },
  { name: '钢琴博物馆', summer: 200, winter: 980, spring: 229, fall: 250 },
  { name: '皓月园', summer: 278, winter: 390, spring: 200, fall: 230 },
  { name: '国际刻字馆', summer: 189, winter: 480, spring: 218, fall: 240 },
  { name: '风琴博物馆', summer: 239, winter: 380, spring: 250, fall: 220 },
  { name: '林巧稚纪念馆', summer: 349, winter: 430, spring: 210, fall: 200 },
];

const SpatioTemporalPanel: React.FC = () => {
  return (
    <motion.div
      className="spatio-temporal-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>时空洞察</h2>

      <div className="visualization-container">
        <div className="density-graphs">
          <h3>访客密度分析</h3>
          <div className="graph-controls">
            <select>
              <option value="hourly">每小时</option>
              <option value="daily">每日</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
            </select>
          </div>
          <div className="graph-area">
            <LineChart
              width={500}
              height={300}
              data={densityData}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visitors" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </div>
        </div>

        <div className="popularity-trends">
          <h3>景点受欢迎趋势</h3>
          <div className="trend-controls">
            <select>
              <option value="summer">夏季</option>
              <option value="winter">冬季</option>
              <option value="spring">春季</option>
              <option value="fall">秋季</option>
            </select>
          </div>
          <div className="trend-visualization">
            <BarChart
              width={500}
              height={300}
              data={popularityData}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="summer" fill="#8884d8" />
              <Bar dataKey="winter" fill="#82ca9d" />
              <Bar dataKey="spring" fill="#ffc658" />
              <Bar dataKey="fall" fill="#ff7300" />
            </BarChart>
          </div>
        </div>
      </div>

      <div className="predictive-analytics">
        <h3>预测分析</h3>
        <div className="prediction-controls">
          <input type="date" />
          <select>
            <option value="weekday">工作日</option>
            <option value="weekend">周末</option>
            <option value="holiday">假日</option>
          </select>
        </div>
        <div className="prediction-results">
          <div className="placeholder">预测结果加载中...</div>
        </div>
      </div>

      <div className="customization-tools">
        <h3>自定义视图</h3>
        <div className="parameters">
          <div className="parameter">
            <label>团体规模</label>
            <input type="range" min="1" max="10" defaultValue="1" />
          </div>
          <div className="parameter">
            <label>天气状况</label>
            <select>
              <option value="sunny">晴天</option>
              <option value="rainy">雨天</option>
              <option value="cloudy">阴天</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpatioTemporalPanel;
