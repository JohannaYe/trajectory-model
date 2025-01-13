// import React from 'react';
// import styled from '@emotion/styled';

// const KnowledgeBaseContainer = styled.div`
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 2rem;
// `;

// const EventFeed = styled.div`
//   background: #fff;
//   border-radius: 8px;
//   padding: 1rem;
//   box-shadow: 0 2px 8px rgba(0,0,0,0.1);
// `;

// function KnowledgeBase() {
//   return (
//     <KnowledgeBaseContainer>
//       <h1>知识库</h1>
//       <EventFeed>
//         <h2>实时动态</h2>
//         {/* 后续添加实时信息流 */}
//       </EventFeed>
//       <div>
//         <h2>交互地图</h2>
//         {/* 后续添加可点击地图 */}
//       </div>
//     </KnowledgeBaseContainer>
//   );
// }

// export default KnowledgeBase; 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { trajectoryService } from '../services/api';

interface Event {
  id: string;
  type: 'ferry' | 'weather' | 'crowd' | 'notice';
  title: string;
  content: string;
  timestamp: string;
  importance: 'high' | 'medium' | 'low';
}

interface Location {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  category: string;
  visitCount: number;
  averageStayTime: number;
  images: string[];
  openingHours: {
    open: string;
    close: string;
  };
}

const KnowledgeBase: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  // 模拟实时动态数据
  const mockEvents: Event[] = [
    {
      id: '1',
      type: 'ferry',
      title: '轮渡班次更新',
      content: '下一班轮渡将于10:30从厦门开往鼓浪屿',
      timestamp: '2024-01-20 10:00:00',
      importance: 'high'
    },
    {
      id: '2',
      type: 'weather',
      title: '天气预警',
      content: '今日下午可能有阵雨，请游客携带雨具',
      timestamp: '2024-01-20 09:30:00',
      importance: 'medium'
    },
    {
      id: '3',
      type: 'crowd',
      title: '人流量提醒',
      content: '日光岩景区当前游客较多，建议错峰游览',
      timestamp: '2024-01-20 11:00:00',
      importance: 'high'
    }
  ];

  // 模拟景点数据
  const mockLocations: Location[] = [
    {
      id: '1',
      name: '日光岩',
      description: '鼓浪屿制高点，可俯瞰整个岛屿风光',
      coordinates: [118.067, 24.449],
      category: 'scenic',
      visitCount: 5000,
      averageStayTime: 60,
      images: ['/images/sunlight-rock.jpg'],
      openingHours: {
        open: '07:30',
        close: '17:30'
      }
    },
    // ... 其他景点数据
  ];

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setEvents(mockEvents);
      setLocations(mockLocations);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // 实现搜索逻辑
    const filteredLocations = mockLocations.filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.description.toLowerCase().includes(query.toLowerCase())
    );
    setLocations(filteredLocations);
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'ferry': return '🚢';
      case 'weather': return '🌤';
      case 'crowd': return '👥';
      case 'notice': return '📢';
      default: return '📌';
    }
  };

  return (
    <Layout>
      <div className="knowledge-base">
        <section className="event-feed">
          <h2>实时动态</h2>
          {loading ? (
            <div className="loading">加载中...</div>
          ) : (
            <div className="feed-items">
              {events.map(event => (
                <div 
                  key={event.id} 
                  className={`event-card importance-${event.importance}`}
                >
                  <span className="event-icon">{getEventIcon(event.type)}</span>
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <p>{event.content}</p>
                    <time>{event.timestamp}</time>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="interactive-map">
          <div className="map-container">
            {/* 这里将集成 Mapbox 地图组件 */}
          </div>
          {selectedLocation && (
            <div className="location-details">
              <h3>{selectedLocation.name}</h3>
              <p>{selectedLocation.description}</p>
              <div className="location-stats">
                <div className="stat">
                  <label>日均游客</label>
                  <span>{selectedLocation.visitCount}</span>
                </div>
                <div className="stat">
                  <label>平均停留</label>
                  <span>{selectedLocation.averageStayTime}分钟</span>
                </div>
              </div>
              <div className="opening-hours">
                <label>开放时间</label>
                <span>{selectedLocation.openingHours.open} - {selectedLocation.openingHours.close}</span>
              </div>
              <div className="location-images">
                {selectedLocation.images.map((image, index) => (
                  <img key={index} src={image} alt={selectedLocation.name} />
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="search">
          <div className="search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索景点信息..."
            />
            <button className="search-button">🔍</button>
          </div>
          <div className="search-results">
            {locations.map(location => (
              <div 
                key={location.id} 
                className="location-card"
                onClick={() => setSelectedLocation(location)}
              >
                <h4>{location.name}</h4>
                <p>{location.description}</p>
                <div className="location-meta">
                  <span>类型: {location.category}</span>
                  <span>开放时间: {location.openingHours.open}-{location.openingHours.close}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button 
          className="return-button"
          onClick={() => navigate('/simulation')}
        >
          返回模拟
        </button>
      </div>
    </Layout>
  );
};

export default KnowledgeBase; 