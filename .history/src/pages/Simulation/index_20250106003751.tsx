import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useStore } from '../../store';
import { trajectoryService } from '../../services/api';
import type { SimulationConfig } from '../../types';

const Simulation: React.FC = () => {
  const navigate = useNavigate();
  const [isSimulating, setIsSimulating] = useState(false);
  const { touristCount, setTouristCount } = useStore();

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const config: SimulationConfig = {
        touristCount,
        weatherCondition: 'sunny',
        timeOfDay: 'morning',
        duration: 24
      };
      await trajectoryService.generateTrajectory(config);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Layout>
      <div className="simulation">
        <section className="control-panel">
          <h2>模拟控制</h2>
          <div className="controls">
            <div className="control-item">
              <label>游客数量</label>
              <input 
                type="number" 
                value={touristCount}
                onChange={(e) => setTouristCount(Number(e.target.value))}
                min="1"
                max="1000"
              />
            </div>
            {/* 更多控制选项 */}
          </div>
          
          <div className="actions">
            <button 
              onClick={runSimulation}
              disabled={isSimulating}
            >
              {isSimulating ? '模拟中...' : '运行模拟'}
            </button>
            <button onClick={() => window.location.reload()}>
              重置
            </button>
          </div>
        </section>

        <section className="visualization">
          <div className="heatmap">
            {/* 使用 Mapbox 显示热力图 */}
          </div>
        </section>

        <section className="comparison">
          <div className="split-view">
            <div className="sunny-condition">
              {/* 晴天轨迹图 */}
            </div>
            <div className="rainy-condition">
              {/* 雨天轨迹图 */}
            </div>
          </div>
        </section>

        <button 
          className="next-step"
          onClick={() => navigate('/evaluation')}
        >
          分析结果
        </button>
      </div>
    </Layout>
  );
};

export default Simulation; 