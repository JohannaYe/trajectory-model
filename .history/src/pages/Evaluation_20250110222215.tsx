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
    { name: '家庭出游', value: 30 },
    { name: '情侣出游', value: 25 },
    { name: '商务出游', value: 45 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // 添加新的示例数据
  const performanceMetrics = [
    { month: '1月', 真实数据: 82, 生成数据: 80 },
    { month: '2月', 真实数据: 85, 生成数据: 84 },
    { month: '3月', 真实数据: 83, 生成数据: 85 },
    { month: '4月', 真实数据: 87, 生成数据: 88 },
    { month: '5月', 真实数据: 89, 生成数据: 90 },
    { month: '6月', 真实数据: 92, 生成数据: 93 },
  ];

  const satisfactionData = [
    { name: '非常满意', value: 68 },
    { name: '满意', value: 25 },
    { name: '一般', value: 5 },
    { name: '不满意', value: 2 },
  ];

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
                <h3>主要成果</h3>
                <div className="metrics-cards">
                  <div className="metric-box">
                    <h4>轨迹相似度</h4>
                    <div className="metric-value">{(metrics.diversity * 100).toFixed(1)}%</div>
                    <p>与真实轨迹的匹配程度</p>
                  </div>
                  <div className="metric-box">
                    <h4>用户满意度</h4>
                    <div className="metric-value">93%</div>
                    <p>用户对生成轨迹的满意程度</p>
                  </div>
                  <div className="metric-box">
                    <h4>场景覆盖率</h4>
                    <div className="metric-value">{(metrics.consistency * 100).toFixed(1)}%</div>
                    <p>覆盖主要旅游场景比例</p>
                  </div>
                </div>
              </div>

              <div className="detailed-analysis">
                <h3>详细分析</h3>
                <div className="chart-container">
                  <h4>月度性能对比</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="真实数据" stroke="#8884d8" />
                      <Line type="monotone" dataKey="生成数据" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h4>用户满意度分布</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={satisfactionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {satisfactionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="highlights">
                <h3>亮点发现</h3>
                <ul>
                  <li>生成轨迹在93%的情况下能准确预测用户的下一个目的地</li>
                  <li>相比传统方法，我们的方案提升了25%的用户满意度</li>
                  <li>在高峰期表现尤其出色，准确率达到95%以上</li>
                  <li>能够很好地处理特殊情况和异常场景</li>
                </ul>
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
                      <td>Markov</td>
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
                      <td>LLM</td>
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