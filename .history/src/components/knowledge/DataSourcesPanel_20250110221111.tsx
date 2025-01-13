import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/DataSourcesPanel.css';

const DataSourcesPanel: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // 数据源分布的假数据
  const dataDistribution = [
    { name: 'GPS追踪数据', value: 35, description: '游客轨迹追踪' },
    { name: '问卷调查', value: 25, description: '游客满意度调查' },
    { name: '传感器数据', value: 20, description: '人流量监测' },
    { name: '社交媒体', value: 15, description: '游客评论分析' },
    { name: '其他来源', value: 5, description: '天气数据等' },
  ];

  // 数据收集点的假数据 - 使用真实的鼓浪屿景点坐标
  const collectionPoints = [
    { 
      id: 1, 
      name: '日光岩', 
      coordinates: [118.0689, 24.4478],
      dataTypes: ['GPS', '传感器'],
      description: '主要景点，人流量监测点'
    },
    { 
      id: 2, 
      name: '菽庄花园', 
      coordinates: [118.0647, 24.4421],
      dataTypes: ['问卷', 'GPS'],
      description: '游客问卷调查站点'
    },
    { 
      id: 3, 
      name: '三一堂', 
      coordinates: [118.0664, 24.4456],
      dataTypes: ['传感器'],
      description: '传感器监测站点'
    },
    { 
      id: 4, 
      name: '皓月园', 
      coordinates: [118.0675, 24.4445],
      dataTypes: ['GPS', '问卷'],
      description: '游客行为研究点'
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    if (map.current) return;
    
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [118.0664, 24.4456],
      zoom: 15
    });

    map.current.on('load', () => {
      // 添加数据收集点标记
      collectionPoints.forEach(point => {
        const marker = document.createElement('div');
        marker.className = 'collection-point-marker';

        new mapboxgl.Marker(marker)
          .setLngLat(point.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(
                `<h4>${point.name}</h4>
                 <p>数据类型: ${point.dataTypes.join(', ')}</p>
                 <p>${point.description}</p>`
              )
          )
          .addTo(map.current!);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

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
              nameKey="name"
              label
            >
              {dataDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend 
              // layout="vertical"
              align="left"
              verticalAlign="top"
              wrapperStyle={{
                paddingTop: "1px",
                paddingLeft: "1px"
              }}
            />
          </PieChart>
        </div>
        
        <div className="collection-points-map">
          <h4>数据收集点分布图</h4>
          <div ref={mapContainer} className="map-container" />
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
