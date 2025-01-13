import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import './index.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const challenges = [
    {
      id: 1,
      title: '数据稀疏性',
      description: '真实轨迹数据采集困难，样本量有限'
    },
    {
      id: 2,
      title: '时空依赖性',
      description: '游客行为受时间、天气等多重因素影响'
    },
    {
      id: 3,
      title: '个体差异性',
      description: '不同类型游客表现出不同的行为模式'
    }
  ];

  return (
    <Layout>
      <div className="home">
        <section className="hero">
          <h1>鼓浪屿游客轨迹建模与生成</h1>
          <p className="tagline">AI驱动的智能景区管理解决方案</p>
          <div className="cta-buttons">
            <button 
              className="primary-button"
              onClick={() => navigate('/introduction')}
            >
              从简介开始
            </button>
            <button 
              className="secondary-button"
              onClick={() => navigate('/modeling')}
            >
              探索建模框架
            </button>
          </div>
        </section>

        <section className="highlight">
          <h2>主要挑战</h2>
          <div className="challenges-grid">
            {challenges.map(challenge => (
              <div key={challenge.id} className="challenge-card">
                <h3>{challenge.title}</h3>
                <p>{challenge.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home; 