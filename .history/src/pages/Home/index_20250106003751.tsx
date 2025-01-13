import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="home">
        <section className="hero">
          <h1>鼓浪屿游客轨迹建模与生成</h1>
          <p className="tagline">AI驱动的智能景区管理解决方案</p>
          <div className="cta-buttons">
            <button onClick={() => navigate('/introduction')}>
              从简介开始
            </button>
            <button onClick={() => navigate('/modeling')}>
              探索建模框架
            </button>
          </div>
        </section>

        <section className="highlight">
          <h2>问题陈述</h2>
          <div className="infographic">
            {/* 这里可以放置轨迹建模挑战的信息图 */}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home; 