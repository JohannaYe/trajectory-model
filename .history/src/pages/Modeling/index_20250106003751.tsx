import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useStore } from '../../store';

const Modeling: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentTouristProfile, 
    setTouristProfile,
    weatherCondition,
    setWeatherCondition,
    timeOfDay,
    setTimeOfDay
  } = useStore();

  return (
    <Layout>
      <div className="modeling">
        <section className="tourist-profile">
          <h2>游客画像建模</h2>
          <div className="profile-selector">
            <button 
              className={currentTouristProfile === 'solo' ? 'active' : ''}
              onClick={() => setTouristProfile('solo')}
            >
              个人游客
            </button>
            <button 
              className={currentTouristProfile === 'family' ? 'active' : ''}
              onClick={() => setTouristProfile('family')}
            >
              家庭游客
            </button>
            {/* 更多游客类型 */}
          </div>
        </section>

        <section className="visualization">
          <div className="map-container">
            {/* 使用 Mapbox 显示轨迹预测 */}
          </div>
        </section>

        <aside className="factors-panel">
          <h3>影响因素</h3>
          <div className="factor">
            <label>时间</label>
            <select 
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
            >
              <option value="morning">上午</option>
              <option value="afternoon">下午</option>
              <option value="evening">晚上</option>
            </select>
          </div>
          {/* 更多因素选项 */}
          
          <button onClick={() => navigate('/simulation')}>
            探索全局轨迹生成
          </button>
        </aside>
      </div>
    </Layout>
  );
};

export default Modeling; 