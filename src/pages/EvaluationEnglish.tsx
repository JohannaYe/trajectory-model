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
    { name: 'Day 1', value: 85 },
    { name: 'Day 2', value: 88 },
    { name: 'Day 3', value: 92 },
    { name: 'Day 4', value: 90 },
    { name: 'Day 5', value: 95 },
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
      {/* Header Section */}
      <header className="evaluation-header">
        <h1>Evaluation of Generated Tourist Trajectories</h1>
        <p className="subheading">Assessing Accuracy, Consistency, and Usability of Simulation Results</p>
        
        <nav className="evaluation-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-item ${activeSection === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveSection('metrics')}
          >
            Evaluation Metrics
          </button>
          <button 
            className={`nav-item ${activeSection === 'results' ? 'active' : ''}`}
            onClick={() => setActiveSection('results')}
          >
            Results Visualization
          </button>
          <button 
            className={`nav-item ${activeSection === 'comparative' ? 'active' : ''}`}
            onClick={() => setActiveSection('comparative')}
          >
            Comparative Analysis
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="evaluation-content">
        {/* Overview Panel */}
        {activeSection === 'overview' && (
          <section className="overview-panel">
            <h2>Overview</h2>
            <div className="purpose-section">
              <h3>Why Evaluate?</h3>
              <ul>
                <li>Ensure alignment with real-world behaviors</li>
                <li>Build confidence in simulated data</li>
                <li>Validate decision-making processes</li>
              </ul>
            </div>
            <div className="process-flow">
              <h3>Evaluation Process</h3>
              <div className="flow-chart">
                <p>1. Define Metrics → 2. Compare with Ground Truth → 3. Generate Insights</p>
              </div>
            </div>
          </section>
        )}

        {/* Metrics Panel */}
        {activeSection === 'metrics' && (
          <section className="metrics-panel">
            <h2>Evaluation Metrics</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <h3>Accuracy</h3>
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
                <h3>Diversity</h3>
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

        {/* Results Visualization Panel */}
        {activeSection === 'results' && (
          <section className="results-panel">
            <h2>Results Visualization</h2>
            <div className="key-results">
              <div className="result-summary">
                <h3>Key Findings</h3>
                <p>Generated trajectories achieved {metrics.diversity * 100}% accuracy compared to real-world data</p>
              </div>
              <div className="interactive-charts">
                {/* Add interactive charts here */}
              </div>
            </div>
          </section>
        )}

        {/* Comparative Analysis Panel */}
        {activeSection === 'comparative' && (
          <section className="comparative-panel">
            <h2>Comparative Analysis</h2>
            <div className="comparison-tools">
              <div className="side-by-side">
                <h3>Real vs Generated Trajectories</h3>
                {/* Add map comparison here */}
              </div>
              <div className="model-comparison">
                <h3>Model Performance</h3>
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Accuracy</th>
                      <th>Speed</th>
                      <th>Diversity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Markov</td>
                      <td>85%</td>
                      <td>Fast</td>
                      <td>Medium</td>
                    </tr>
                    <tr>
                      <td>GAN</td>
                      <td>92%</td>
                      <td>Medium</td>
                      <td>High</td>
                    </tr>
                    <tr>
                      <td>Large Model</td>
                      <td>95%</td>
                      <td>Slow</td>
                      <td>Very High</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="evaluation-footer">
        <div className="documentation-links">
          <h3>Resources</h3>
          <a href="/docs/api">API Documentation</a>
          <a href="/docs/tutorials">Evaluation Tutorials</a>
        </div>
        <div className="contact-info">
          <h3>Support</h3>
          <p>Need help with evaluation? Contact our support team</p>
        </div>
      </footer>
    </div>
  );
};

export default Evaluation;