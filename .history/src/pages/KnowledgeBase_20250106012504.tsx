import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { trajectoryService } from '../services/api';

.knowledge-base {
  padding: 2rem;
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  gap: 2rem;
  height: calc(100vh - 64px);

  .event-feed {
    grid-column: 1;
    grid-row: 1 / span 2;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-y: auto;

    h2 {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .feed-items {
      padding: 1rem;

      .event-card {
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 6px;
        background: #f8f9fa;
        
        &.importance-high {
          border-left: 4px solid #dc3545;
        }

        &.importance-medium {
          border-left: 4px solid #ffc107;
        }

        &.importance-low {
          border-left: 4px solid #28a745;
        }

        .event-icon {
          font-size: 1.5rem;
          margin-right: 0.5rem;
        }

        time {
          color: #6c757d;
          font-size: 0.875rem;
        }
      }
    }
  }

  .interactive-map {
    grid-column: 2;
    grid-row: 1 / span 2;
    position: relative;

    .map-container {
      height: 100%;
      border-radius: 8px;
      overflow: hidden;
    }

    .location-details {
      position: absolute;
      right: 1rem;
      top: 1rem;
      width: 300px;
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      .location-stats {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;

        .stat {
          flex: 1;
          text-align: center;

          label {
            display: block;
            color: #6c757d;
            font-size: 0.875rem;
          }

          span {
            font-size: 1.25rem;
            font-weight: bold;
          }
        }
      }

      .location-images {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
        margin-top: 1rem;

        img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 4px;
        }
      }
    }
  }

  .search {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;
    z-index: 1;

    .search-box {
      display: flex;
      gap: 0.5rem;

      input {
        flex: 1;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .search-button {
        padding: 0.5rem 1rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background: #0056b3;
        }
      }
    }

    .search-results {
      margin-top: 0.5rem;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      max-height: 400px;
      overflow-y: auto;

      .location-card {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        cursor: pointer;

        &:hover {
          background: #f8f9fa;
        }

        h4 {
          margin: 0 0 0.5rem;
        }

        .location-meta {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #6c757d;
        }
      }
    }
  }

  .return-button {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 0.75rem 1.5rem;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      background: #218838;
    }
  }
} 

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