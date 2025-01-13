import React, { useState } from 'react';
import { Select, Space, Timeline } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import MapComponent from '../components/map/MapComponent';
import { trajectoryForMap, sampleTouristTrajectory } from '../data/sampleTrajectory';
import '../styles/Modeling.css';

const touristProfiles = [
  {
    id: 1,
    type: "家庭游客",
    icon: "👨‍👩‍👧‍👦",
    duration: "6-8小时",
    spots: "日光岩、菽庄花园",
    features: "更注重休闲和教育价值",
    consumption: "中等偏上"
  },
  {
    id: 2,
    type: "年轻情侣",
    icon: "👫",
    duration: "4-6小时",
    spots: "钢琴博物馆、皓月园",
    features: "偏好拍照和文艺景点",
    consumption: "中等"
  },
  {
    id: 3,
    type: "摄影爱好者",
    icon: "📸",
    duration: "5-7小时",
    spots: "日光岩、皓月园",
    features: "停留时间长，注重光线",
    consumption: "中等偏下"
  }
];

const Modeling: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  const handlePointClick = (point: any) => {
    setSelectedPoint(point);
  };

  return (
    <div className="modeling-page">
      <div className="modeling-header">
        <h1>游客轨迹建模</h1>
        <p className="subheading">分析和可视化游客在鼓浪屿的活动轨迹</p>
      </div>

      <div className="modeling-nav">
        <button
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          概览
        </button>
        <button
          className={`nav-item ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          AI聊天
        </button>
      </div>

      <div className="modeling-content">
        {activeTab === 'overview' && (
          <section>
            <div className="visualization-container">
              <div className="trajectory-details">
                <Timeline>
                  {sampleTouristTrajectory.trajectoryPoints.map((point, index) => (
                    <Timeline.Item
                      key={point.id}
                      dot={index === 0 ? <ClockCircleOutlined style={{ fontSize: '16px' }} /> : <EnvironmentOutlined style={{ fontSize: '16px' }} />}
                    >
                      <div>
                        <strong>{point.location}</strong>
                        <div>{point.timestamp}</div>
                        {point.duration > 0 && <div>停留时间: {point.duration}分钟</div>}
                        {point.nextDestination && <div>下一站: {point.nextDestination}</div>}
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
              <div className="map-container" style={{ height: '500px' }}>
                <MapComponent
                  trajectories={trajectoryForMap}
                  showHeatmap={false}
                  onPointClick={handlePointClick}
                  center={{ lng: 118.0627, lat: 24.4453 }}
                  zoom={15}
                />
              </div>
            </div>
            
            <section className="panel">
              <h2>游客画像分析</h2>
              <div className="profile-grid">
                {touristProfiles.map(profile => (
                  <div key={profile.id} className="profile-card">
                    <div className="profile-icon">{profile.icon}</div>
                    <div className="profile-title">{profile.type}</div>
                    <ul className="profile-info">
                      <li>平均游览时长: {profile.duration}</li>
                      <li>主要景点: {profile.spots}</li>
                      <li>特点: {profile.features}</li>
                      <li>消费水平: {profile.consumption}</li>
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </section>
        )}

        {activeTab === 'results' && (
          <section className="panel">
            <h2>游客画像分析</h2>
            <div className="profile-grid">
              {touristProfiles.map(profile => (
                <div key={profile.id} className="profile-card">
                  <div className="profile-icon">{profile.icon}</div>
                  <div className="profile-title">{profile.type}</div>
                  <ul className="profile-info">
                    <li>平均游览时长: {profile.duration}</li>
                    <li>主要景点: {profile.spots}</li>
                    <li>特点: {profile.features}</li>
                    <li>消费水平: {profile.consumption}</li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedPoint && (
          <div className="point-details">
            <h3>位置详情</h3>
            <p>时间: {selectedPoint.timestamp}</p>
            <p>类型: {selectedPoint.type}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modeling;