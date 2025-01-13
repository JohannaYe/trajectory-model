import React, { useState, useCallback } from 'react';
import { Switch, Radio, Space, Tooltip, Slider, Select } from 'antd';
import { HeatMapOutlined, DotChartOutlined, LoadingOutlined, ThunderboltOutlined } from '@ant-design/icons';
import '../styles/Simulation.css';
import MapComponent from '../components/Map/simulationMapComponent';
import { realTrajectories, generatedTrajectories, generateDayTrajectories, GenerationParams } from '../data/realTrajectories';

const SPECIAL_EVENTS = [
  { value: 'none', label: '无特殊事件' },
  { value: 'music_festival', label: '音乐节', location: '钢琴码头', effect: '人流密集' },
  { value: 'food_festival', label: '美食节', location: '天街', effect: '停留时间延长' },
  { value: 'light_show', label: '灯光秀', location: '江滨公园', effect: '夜间人流增加' },
];

const convertTrajectoryFormat = (trajectories: typeof realTrajectories) => {
  return trajectories.map(trajectory => ({
    points: trajectory.points.map(point => [point.lat, point.lng] as [number, number]),
    timestamp: trajectory.points[0].timestamp
  }));
};

function Simulation() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState('normal');
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'single'>('split');
  const [isGenerating, setIsGenerating] = useState(false);
  const [trajectoryData, setTrajectoryData] = useState({
    real: convertTrajectoryFormat(realTrajectories),
    generated: [] as Array<{
      points: Array<[number, number]>;
      timestamp: number;
      explanation?: string;
    }>
  });
  const [temperature, setTemperature] = useState(1);
  const [specialEvent, setSpecialEvent] = useState('none');

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

  const handleGenerateTrajectories = () => {
    setIsGenerating(true);
    
    const params: GenerationParams = {
      temperature,
      scenario: selectedScenario,
      specialEvent: specialEvent !== 'none' ? {
        type: specialEvent,
        location: SPECIAL_EVENT_LOCATIONS[specialEvent],
        radius: 0.005 // 约500米
      } : undefined
    };

    const newTrajectories = generateDayTrajectories(100, true, params);
    // ... 其余处理逻辑
  };

  const renderMapControls = () => (
    <div className="map-controls">
      <Space>切换热力图
        <Tooltip title="切换热力图">
          <Switch
            checkedChildren={<HeatMapOutlined />}
            unCheckedChildren={<DotChartOutlined />}
            checked={showHeatmap}
            onChange={setShowHeatmap}
          />
        </Tooltip>
        
      </Space>
    </div>
  );

  const renderControls = () => (
    <div className="control-panel">
      {renderMapControls()}
      
      <div className="parameter-controls">
        <div className="temperature-control">
          <h4>模型温度值</h4>
          <Slider
            min={0}
            max={5}
            step={0.1}
            value={temperature}
            onChange={setTemperature}
            tooltip={{ formatter: value => `${value}` }}
          />
          <p className="parameter-description">
            较高的温度值会产生更多样化的轨迹，较低的温度值会产生更确定的路径
          </p>
        </div>

        <div className="event-control">
          <h4>特殊事件</h4>
          <Select
            style={{ width: '100%' }}
            value={specialEvent}
            onChange={setSpecialEvent}
            options={SPECIAL_EVENTS}
          />
        </div>
      </div>

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

      <button 
        className="generate-button"
        onClick={handleGenerateTrajectories}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <LoadingOutlined spin /> 正在生成轨迹...
          </>
        ) : (
          <>
            <ThunderboltOutlined /> 生成游客轨迹数据
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="simulation-container">
      <div className="header-section">
        <h1>基于大模型的游客轨迹生成系统</h1>
      </div>

      {/* <div className="workflow-overview">
        <h2>工作流程</h2>
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
      </div> */}

      <div className="control-section">
        {renderControls()}
      </div>

      <div className="maps-container">
        <div className="map-wrapper">
          <h3>真实轨迹</h3>
          <MapComponent 
            trajectories={trajectoryData.real}
            onPointClick={handlePointClick}
            showHeatmap={showHeatmap}
          />
        </div>
        <div className="map-wrapper">
          <h3>
            生成轨迹 
            {isGenerating ? '(生成中...)' : 
             trajectoryData.generated.length === 0 ? '(请点击生成按钮)' : 
             `(${selectedScenario === 'normal' ? '普通日' : 
                selectedScenario === 'rainy' ? '雨天' : '旺季'})`
            }
          </h3>
          <MapComponent 
            trajectories={trajectoryData.generated}
            onPointClick={handlePointClick}
            showHeatmap={showHeatmap}
          />
        </div>
      </div>

      {trajectoryData.generated.length > 0 && (
        <div className="trajectory-explanation">
          <h3>生成说明</h3>
          <p>{trajectoryData.generated[0].explanation}</p>
        </div>
      )}
    </div>
  );
}

export default Simulation;