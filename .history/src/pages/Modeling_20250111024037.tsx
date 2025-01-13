import React, { useState, useEffect } from 'react';
import { Select, Space, Timeline, Slider, Button, Tabs, Card } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import MapComponent from '../components/Map/modelMapComponent';
import { touristTrajectories, getTrajectoryForMap } from '../data/sampleTrajectory';
import '../styles/Modeling.css';

const staticTrajectoryData = {
  radius: 10, // 设置一个静态半径
  trajectoryPoints: [
    { location: "起点", timestamp: new Date().toISOString(), duration: 0 },
    { location: "景点A", timestamp: new Date(Date.now() + 3600000).toISOString(), duration: 30 },
    { location: "景点B", timestamp: new Date(Date.now() + 7200000).toISOString(), duration: 45 },
    { location: "终点", timestamp: new Date(Date.now() + 10800000).toISOString(), duration: 0 },
  ],
};

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
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedTouristType, setSelectedTouristType] = useState<keyof typeof touristTrajectories>('family');
  const [trajectoryData, setTrajectoryData] = useState(staticTrajectoryData); // 使用静态数据

  useEffect(() => {
    let animationTimer: NodeJS.Timeout;
    
    if (isPlaying) {
      animationTimer = setInterval(() => {
        setCurrentTimeIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= touristTrajectories[selectedTouristType].trajectoryPoints.length) {
            setIsPlaying(false);
            return 0;
          }
          return nextIndex;
        });
      }, 2000 / playbackSpeed);
    }

    return () => {
      if (animationTimer) {
        clearInterval(animationTimer);
      }
    };
  }, [isPlaying, playbackSpeed, selectedTouristType]);

  const handlePointClick = (point: any) => {
    setSelectedPoint(point);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (value: number) => {
    setCurrentTimeIndex(value);
    setIsPlaying(false);
  };

  const handleTouristTypeChange = (type: keyof typeof touristTrajectories) => {
    setSelectedTouristType(type);
    setCurrentTimeIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="modeling-page">
      <div className="modeling-header">
        <h1>游客轨迹建模</h1>
        <p className="subheading">分析和可视化游客在鼓浪屿的活动轨迹</p>
      </div>

      <div className="tourist-type-selector">
        <Tabs 
          activeKey={selectedTouristType} 
          onChange={(key) => handleTouristTypeChange(key as keyof typeof touristTrajectories)}
        >
          {Object.entries(touristTrajectories).map(([key, value]) => (
            <TabPane 
              tab={
                <span>
                  {value.type}
                </span>
              } 
              key={key}
            >
              <Card className="tourist-info-card">
                <p className="tourist-description">{value.description}</p>
                <div className="tourist-stats">
                  <div>总游览时间：{
                    new Date(staticTrajectoryData.trajectoryPoints[staticTrajectoryData.trajectoryPoints.length - 1].timestamp).getHours() -
                    new Date(staticTrajectoryData.trajectoryPoints[0].timestamp).getHours()
                  } 小时</div>
                  <div>景点数量：{staticTrajectoryData.trajectoryPoints.length - 2} 个</div>
                </div>
              </Card>
            </TabPane>
          ))}
        </Tabs>
      </div>

      <div className="modeling-content">
        <section>
          <div className="visualization-container">
            <div className="trajectory-details">
              <div className="playback-controls">
                <Button 
                  type="primary" 
                  icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={togglePlayback}
                >
                  {isPlaying ? '暂停' : '播放'}
                </Button>
                <Select
                  defaultValue={1}
                  style={{ width: 120, marginLeft: 16 }}
                  onChange={(value) => setPlaybackSpeed(value)}
                  options={[
                    { value: 0.5, label: '0.5x' },
                    { value: 1, label: '1x' },
                    { value: 2, label: '2x' },
                    { value: 4, label: '4x' },
                  ]}
                />
              </div>
              <div className="current-location">
                {currentTimeIndex < trajectoryData.trajectoryPoints.length && (
                  <div className="location-info">
                    <h3>当前位置：{trajectoryData.trajectoryPoints[currentTimeIndex].location}</h3>
                    <p>时间：{new Date(trajectoryData.trajectoryPoints[currentTimeIndex].timestamp).toLocaleTimeString()}</p>
                    {trajectoryData.trajectoryPoints[currentTimeIndex].duration > 0 && (
                      <p>停留时间：{trajectoryData.trajectoryPoints[currentTimeIndex].duration} 分钟</p>
                    )}
                  </div>
                )}
              </div>
              <Slider
                min={0}
                max={trajectoryData.trajectoryPoints.length - 1}
                value={currentTimeIndex}
                onChange={handleSliderChange}
                tooltip={{
                  formatter: (index) => trajectoryData.trajectoryPoints[index]?.location
                }}
              />
              <Timeline>
                {trajectoryData.trajectoryPoints.map((point, index) => (
                  <Timeline.Item
                    key={index}
                    dot={index === 0 ? <ClockCircleOutlined style={{ fontSize: '16px' }} /> : <EnvironmentOutlined style={{ fontSize: '16px' }} />}
                  >
                    <div>
                      <strong>{point.location}</strong>
                      <div>{new Date(point.timestamp).toLocaleTimeString()}</div>
                      {point.duration > 0 && <div>停留时间: {point.duration}分钟</div>}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
            <Card className="map-card" style={{ height: '500px' }}>
              <MapComponent
                trajectories={getTrajectoryForMap(selectedTouristType)}
                showHeatmap={false}
                onPointClick={handlePointClick}
                center={{ lng: 118.0627, lat: 24.4453 }}
                zoom={15}
                currentTimeIndex={currentTimeIndex}
                isAnimating={isPlaying}
                radius={trajectoryData.radius || 0} // 使用静态数据的半径
              />
            </Card>
          </div>
        </section>

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
      </div>
    </div>
  );
};

export default Modeling;