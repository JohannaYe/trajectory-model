import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const Introduction: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="introduction">
        <section className="background">
          <h2>背景问题</h2>
          <div className="infographic">
            {/* 轨迹建模挑战的静态信息图 */}
          </div>
        </section>

        <section className="data-collection">
          <h2>数据收集过程</h2>
          <div className="experiment-info">
            <h3>鼓浪屿实验</h3>
            <ul>
              <li>5000+ 游客数据</li>
              <li>3个月采集周期</li>
              <li>GPS轨迹、偏好、天气、时间等数据</li>
            </ul>
          </div>

          <div className="data-charts">
            <div className="chart tourist-types">
              {/* 游客类型饼图 */}
            </div>
            <div className="chart attraction-visits">
              {/* 景点访问频率柱状图 */}
            </div>
          </div>

          <button onClick={() => navigate('/modeling')}>
            查看轨迹建模
          </button>
        </section>
      </div>
    </Layout>
  );
};

export default Introduction; 