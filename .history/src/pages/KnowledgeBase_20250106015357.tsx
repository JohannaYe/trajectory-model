import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
// ... existing imports ...
import styled from '@emotion/styled';

// 添加样式组件
const KnowledgeBaseContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;

  .event-feed {
    grid-column: 1;
    grid-row: 1 / span 2;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;

    h2 {
      margin-bottom: 20px;
      color: #333;
      font-size: 1.5rem;
    }

    .feed-items {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .event-card {
      display: flex;
      padding: 15px;
      border-radius: 8px;
      background: #f8f9fa;
      transition: transform 0.2s;

      &:hover {
        transform: translateY(-2px);
      }

      &.importance-high { border-left: 4px solid #ff4d4f; }
      &.importance-medium { border-left: 4px solid #faad14; }
      &.importance-low { border-left: 4px solid #52c41a; }
    }

    .event-icon {
      font-size: 24px;
      margin-right: 12px;
    }

    .event-content {
      h3 {
        margin: 0 0 8px;
        font-size: 1.1rem;
      }

      time {
        display: block;
        font-size: 0.85rem;
        color: #666;
        margin-top: 8px;
      }
    }
  }

  .interactive-map {
    grid-column: 2;
    grid-row: 1 / span 2;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .map-container {
      height: 400px;
      background: #f0f2f5;
    }

    .location-details {
      padding: 20px;

      h3 {
        margin: 0 0 15px;
        color: #333;
      }

      .location-stats {
        display: flex;
        gap: 20px;
        margin: 15px 0;

        .stat {
          flex: 1;
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          text-align: center;

          label {
            display: block;
            color: #666;
            margin-bottom: 5px;
          }

          span {
            font-size: 1.2rem;
            font-weight: 500;
            color: #1890ff;
          }
        }
      }

      .location-images {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 10px;
        margin-top: 15px;

        img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 6px;
        }
      }
    }
  }

  .search {
    grid-column: 1 / span 2;
    grid-row: 2;

    .search-box {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;

      input {
        flex: 1;
        padding: 12px;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        font-size: 1rem;

        &:focus {
          outline: none;
          border-color: #1890ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      }

      .search-button {
        padding: 0 20px;
        background: #1890ff;
        border: none;
        border-radius: 6px;
        color: white;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: #40a9ff;
        }
      }
    }

    .search-results {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;

      .location-card {
        background: #fff;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
          transform: translateY(-2px);
        }

        h4 {
          margin: 0 0 10px;
          color: #333;
        }

        .location-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          font-size: 0.9rem;
          color: #666;
        }
      }
    }
  }

  .return-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 24px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #40a9ff;
    }
  }
`;


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

const EventFeed: React.FC<{ events: Event[]; loading: boolean }> = ({ events, loading }) => {
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
    <section className="event-feed">
      <h2>实时动态</h2>
      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="feed-items">
          {events.map(event => (
            <div key={event.id} className={`event-card importance-${event.importance}`}> 
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
  );
};

const InteractiveMap: React.FC<{ selectedLocation: Location | null; setSelectedLocation: (location: Location) => void }> = ({ selectedLocation, setSelectedLocation }) => {
  return (
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
  );
};

const Search: React.FC<{ searchQuery: string; setSearchQuery: (query: string) => void; locations: Location[]; setSelectedLocation: (location: Location) => void; }> = ({ searchQuery, setSearchQuery, locations, setSelectedLocation }) => {
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
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
          <div key={location.id} className="location-card" onClick={() => setSelectedLocation(location)}>
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
  );
};

const KnowledgeBase: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

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
    setTimeout(() => {
      setEvents(mockEvents);
      setLocations(mockLocations);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <KnowledgeBaseContainer>
      <div className="knowledge-base">
        <EventFeed events={events} loading={loading} />
        <InteractiveMap selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} locations={locations} setSelectedLocation={setSelectedLocation} />
        <button className="return-button" onClick={() => navigate('/simulation')}>返回模拟</button>
      </div>
      </KnowledgeBaseContainer>
  );
};

export default KnowledgeBase;