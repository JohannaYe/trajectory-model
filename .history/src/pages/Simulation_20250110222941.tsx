import React, { useState, useCallback } from 'react';
import { Switch, Radio, Space, Tooltip } from 'antd';
import { HeatMapOutlined, DotChartOutlined } from '@ant-design/icons';
import '../styles/Simulation.css';
import MapComponent from '../components/map/MapComponent';
import { realTrajectories, generatedTrajectories } from '../data/mockTrajectories';

// 时间轴事件数据
const timelineEvents = [
  { time: '11:30', event: '游客到达日光岩' },
  { time: '12:15', event: '正在前往钢琴博物馆' },
  { time: '12:45', event: '在当地餐厅用午餐' },
];

// 行为特征数据
const behavioralTraits = {
  type: '文化爱好者',
  preferences: ['历史景点', '博物馆', '当地美食'],
  timeConstraints: '4-6小时',
};

function Simulation() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState('normal');
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'single'>('split');

  const workflowSteps = [
    { id: 1, title: '数据采集', description: '真实轨迹数据' },
    { id: 2, title: '行为建模', description: '游客类型预测' },
    { id: 3, title: '轨迹模拟', description: '路径生成' },
    { id: 4, title: '数据评估', description: '与基准比较' },
  ];

  const scenarios = [
    { id: 'normal', name: '普通日', description: '标准游客情况' },
    { id: 'rainy', name: '雨天', description: '天气影响路径' },
    { id: 'peak', name: '旺季', description: '高客流密度' },
  ];

  const handlePointClick = useCallback((point: any) => {
    setSelectedPoint(point);
  }, []);

  const renderMapControls = () => (
    <div className="map-controls">
      <Space>
        <Tooltip title="切换热力图">
          <Switch
            checkedChildren={<HeatMapOutlined />}
            unCheckedChildren={<DotChartOutlined />}
            checked={showHeatmap}
            onChange={setShowHeatmap}
          />
        </Tooltip>
        <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <Radio.Button value="split">分屏视图</Radio.Button>
          <Radio.Button value="single">单屏视图</Radio.Button>
        </Radio.Group>
      </Space>
    </div>
  );

  return (
    <div className="simulation-container">
      <h1>轨迹模拟</h1>

      <section className="workflow-overview">
        <h2>生成工作流程概览</h2>
        <div className="workflow-steps">
          {workflowSteps.map((step) => (
            <div
              key={step.id}
              className={`workflow-step ${activeStep === step.id ? 'active' : ''}`}
              onClick={() => setActiveStep(step.id)}
            >
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="control-panel">
        <h2>模拟控制</h2>
        {renderMapControls()}
        <div className="scenario-selector">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`scenario-card ${selectedScenario === scenario.id ? 'active' : ''}`}
              onClick={() => setSelectedScenario(scenario.id)}
            >
              <h3>{scenario.name}</h3>
              <p>{scenario.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className={`visualization-container ${viewMode === 'single' ? 'single-view' : ''}`}>
        <div className="map-container">
          <h3>真实轨迹</h3>
          <MapComponent 
            trajectories={realTrajectories}
            onPointClick={handlePointClick}
            showHeatmap={showHeatmap}
          />
        </div>
        {viewMode === 'split' && (
          <div className="map-container">
            <h3>生成轨迹</h3>
            <MapComponent 
              trajectories={generatedTrajectories}
              onPointClick={handlePointClick}
              showHeatmap={showHeatmap}
            />
          </div>
        )}
      </div>

      <section className="model-insights">
        <h2>模型洞察</h2>
        <div>
          <h3>当前预测</h3>
          {selectedPoint ? (
            <>
              <p>选中点：{selectedPoint.type}</p>
              <p>时间：{new Date(selectedPoint.timestamp).toLocaleTimeString()}</p>
              <p>位置：[{selectedPoint.lng.toFixed(4)}, {selectedPoint.lat.toFixed(4)}]</p>
            </>
          ) : (
            <>
              <p>下一个目的地：钢琴博物馆（置信度87%）</p>
              <p>预计时长：45分钟</p>
              <p>路线偏好：穿过历史街区的景观路线</p>
            </>
          )}
        </div>
      </section>

      <section className="behavioral-panel">
        <h2>游客行为画像</h2>
        <div>
          <h3>类型：{behavioralTraits.type}</h3>
          <h4>偏好：</h4>
          <ul>
            {behavioralTraits.preferences.map((pref, index) => (
              <li key={index}>{pref}</li>
            ))}
          </ul>
          <p>可用时间：{behavioralTraits.timeConstraints}</p>
        </div>
      </section>

      <section className="timeline-tracker">
        <h2>轨迹时间线</h2>
        <div>
          {timelineEvents.map((event, index) => (
            <div key={index}>
              <strong>{event.time}</strong>: {event.event}
            </div>
          ))}
        </div>
      </section>

      <section className="export-panel">
        <button className="button button-secondary">导出数据</button>
        <button className="button button-primary">生成报告</button>
      </section>
    </div>
  );
}

export default Simulation;