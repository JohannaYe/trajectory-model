import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const KnowledgeBase: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <Layout>
      <div className="knowledge-base">
        <section className="event-feed">
          <h2>实时动态</h2>
          <div className="feed-items">
            {/* 轮渡时刻表、天气变化、游客提示等 */}
          </div>
        </section>

        <section className="interactive-map">
          <div className="map-container">
            {/* Mapbox 交互式地图 */}
          </div>
          <div className="location-details">
            {/* 点击位置的详细信息 */}
          </div>
        </section>

        <section className="search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索景点信息..."
          />
          <div className="search-results">
            {/* 搜索结果列表 */}
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