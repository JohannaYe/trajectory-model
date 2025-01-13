import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import type { EvaluationMetrics } from '../types';

const Evaluation: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = React.useState<EvaluationMetrics>({
    diversity: 0,
    realism: 0,
    consistency: 0
  });

  return (

      <div className="evaluation">
        <section className="metrics-dashboard">
          <h2>评估指标</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>轨迹多样性</h3>
              <div className="chart">
                {/* 多样性指标图表 */}
              </div>
            </div>
            {/* 更多指标卡片 */}
          </div>
        </section>

        <section className="validation">
          <h2>数据验证</h2>
          <div className="comparison-view">
            <div className="heatmap-comparison">
              {/* 真实vs生成轨迹对比图 */}
            </div>
            <div className="visits-chart">
              {/* 景点访问对比图表 */}
            </div>
          </div>
        </section>

        <section className="case-studies">
          <h2>案例研究</h2>
          <div className="gallery">
            {/* 特定场景验证案例 */}
          </div>
        </section>

        <button 
          className="next-step"
          onClick={() => navigate('/knowledge-base')}
        >
          了解更多知识库
        </button>
      </div>

  );
};

export default Evaluation; 