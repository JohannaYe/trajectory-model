import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import type { EvaluationMetrics } from '../types';
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import '../styles/Evaluation.css';

const Evaluation: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [chartWidth, setChartWidth] = useState(400);
  const [metrics, setMetrics] = React.useState<EvaluationMetrics>({
    diversity: 0.92,
    realism: 0.88,
    consistency: 0.95
  });

  // Sample data for charts
  const accuracyData = [
    { name: 'People 1', value: 85 },
    { name: 'People 2', value: 88 },
    { name: 'People 3', value: 92 },
    { name: 'People 4', value: 90 },
    { name: 'People 5', value: 95 },
  ];

  const diversityData = [
    { name: 'Type A', value: 30 },
    { name: 'Type B', value: 25 },
    { name: 'Type C', value: 20 },
    { name: 'Type D', value: 25 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="evaluation-page">
      {/* 头部区域 */}
      <header className="evaluation-header">
        <h1>生成的旅游轨迹评估</h1>
        <p className="subheading">评估模拟结果的准确性、一致性和可用性</p>
        
        <nav className="evaluation-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            概述
          </button>
          <button 
            className={`nav-item ${activeSection === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveSection('metrics')}
          >
            评估指标
          </button>
          <button 
            className={`nav-item ${activeSection === 'results' ? 'active' : ''}`}
            onClick={() => setActiveSection('results')}
          >
            结果可视化
          </button>
          <button 
            className={`nav-item ${activeSection === 'comparative' ? 'active' : ''}`}
            onClick={() => setActiveSection('comparative')}
          >
            对比分析
          </button>
        </nav>
      </header>

      <main className="evaluation-content">
        {/* 概述面板 */}
        {activeSection === 'overview' && (
          <section className="overview-panel">
            <h2>概述</h2>
            <div className="purpose-section">
              <h3>为什么要评估？</h3>
              <ul>
                <li>确保与真实世界行为的一致性</li>
                <li>建立对模拟数据的信心</li>
                <li>验证决策过程</li>
              </ul>
            </div>
            <div className="process-flow">
              <h3>评估流程</h3>
              <div className="flow-chart">
                <p>1. 定义指标 → 2. 与真实数据对比 → 3. 生成洞察</p>
              </div>
            </div>
          </section>
        )}

        {/* 指标面板 */}
        {activeSection === 'metrics' && (
          <section className="metrics-panel">
            <h2>评估指标</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>预测准确率</h3>
                <div className="chart">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={accuracyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="metric-card">
                <h3>分布密度</h3>
                <div className="chart">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={diversityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {diversityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 结果可视化面板 */}
        {activeSection === 'results' && (
          <section className="results-panel">
            <h2>结果可视化</h2>
            <div className="key-results">
              <div className="result-summary">
                <h3>主要发现</h3>
                <p>生成的轨迹与真实数据相比达到了 {metrics.diversity * 100}% 的准确率</p>
              </div>
              <div className="interactive-charts">
                {/* 交互式图表位置 */}
              </div>
            </div>
          </section>
        )}

        {/* 对比分析面板 */}
        {activeSection === 'comparative' && (
          <section className="comparative-panel">
            <h2>对比分析</h2>
            <div className="comparison-tools">
              <div className="side-by-side">
                <h3>真实轨迹与生成轨迹对比</h3>
                {/* 地图对比位置 */}
              </div>
              <div className="model-comparison">
                <h3>模型性能</h3>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>模型</th>
                      <th>准确率</th>
                      <th>速度</th>
                      <th>多样性</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>马尔可夫</td>
                      <td>85%</td>
                      <td>快</td>
                      <td>中等</td>
                    </tr>
                    <tr>
                      <td>GAN</td>
                      <td>92%</td>
                      <td>中等</td>
                      <td>高</td>
                    </tr>
                    <tr>
                      <td>大型模型</td>
                      <td>95%</td>
                      <td>慢</td>
                      <td>很高</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 页脚 */}
      <footer className="evaluation-footer">
        <div className="documentation-links">
          <h3>资源</h3>
          <a href="/docs/api">API 文档</a>
          <a href="/docs/tutorials">评估教程</a>
        </div>
        <div className="contact-info">
          <h3>支持</h3>
          <p>需要评估帮助？联系我们的支持团队</p>
        </div>
      </footer>
    </div>
  );
};

export default Evaluation;