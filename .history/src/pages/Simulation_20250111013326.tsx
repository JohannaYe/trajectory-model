import React, { useState, useCallback } from 'react';
import { Switch, Radio, Space, Tooltip } from 'antd';
import { HeatMapOutlined, DotChartOutlined, LoadingOutlined, ThunderboltOutlined } from '@ant-design/icons';
import '../styles/Simulation.css';
import MapComponent from '../components/Map/simulationMapComponent';
import { realTrajectories, generatedTrajectories } from '../data/realTrajectories';

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

  const handleGenerateTrajectories = useCallback(() => {
    setIsGenerating(true);
    
    const generateTrajectoryByScenario = () => {
      let baseTrajectories = generatedTrajectories;
      let explanation = '';
      
      switch (selectedScenario) {
        case 'rainy':
          explanation = '由于下雨天气，游客倾向于选择室内景点和较短的游览路线，部分室外景点的访问频率降低。';
          return {
            trajectories: convertTrajectoryFormat(baseTrajectories).map(trajectory => ({
              ...trajectory,
              points: trajectory.points.map(point => [
                point[0] + Math.random() * 0.001,
                point[1] + Math.random() * 0.001
              ] as [number, number])
            })),
            explanation
          };
        case 'peak':
          explanation = '旺季期间游客数量显著增加，景点周边人流密集，部分游客会选择较少人的替代路线。';
          return {
            trajectories: convertTrajectoryFormat([...baseTrajectories, ...baseTrajectories.slice(0, 5)]),
            explanation
          };
        default:
          explanation = '普通日期的游客行为模式，景点分布相对均匀，游客路线遵循典型的观光路径。';
          return {
            trajectories: convertTrajectoryFormat(baseTrajectories),
            explanation
          };
      }
    };

    setTimeout(() => {
      const { trajectories: newTrajectories, explanation } = generateTrajectoryByScenario();
      setTrajectoryData(prev => ({
        ...prev,
        generated: newTrajectories.map(t => ({ ...t, explanation }))
      }));
      setIsGenerating(false);
    }, 2000);
  }, [selectedScenario]);

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

  return (
    <div className="simulation-container">
      <div className="header-section">
        <h1>轨迹生成效果模拟</h1>
      </div>

      <div className="control-section">
        <div className="control-panel">
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
          {trajectoryData.generated.length > 0 && (
            <div className="trajectory-explanation">
              <p>{trajectoryData.generated[0].explanation}</p>
            </div>
          )}
        </div>
      </div>

      <section className="workflow-overview">
        <h2>生成全岛游客数据工作流</h2>
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
    </div>
  );
}

export default Simulation;