import React, { useState, useCallback, useEffect } from 'react';
import { Switch, Radio, Space, Tooltip, Slider, Select, message } from 'antd';
import { HeatMapOutlined, DotChartOutlined, LoadingOutlined, ThunderboltOutlined } from '@ant-design/icons';
import '../styles/Simulation.css';
import MapComponent from '../components/Map/simulationMapComponent';
import { 
  realTrajectories, 
  generatedTrajectories, 
  generateDayTrajectories,
  GenerationParams 
} from '../data/realTrajectories';

const SPECIAL_EVENT_LOCATIONS = {
  'none': { lat: 0, lng: 0 },
  'music_festival': { lat: 24.4456, lng: 118.0665 },  // 钢琴博物馆位置
  'food_festival': { lat: 24.4432, lng: 118.0686 },   // 龙头路位置
  'light_show': { lat: 24.4426, lng: 118.0704 },      // 鼓浪屿码头位置
};

const SPECIAL_EVENTS = [
  { value: 'none', label: '无特殊事件' },
  { 
    value: 'music_festival', 
    label: '音乐节', 
    location: '钢琴博物馆', 
    effect: '人流密集'
  },
  { 
    value: 'food_festival', 
    label: '美食节', 
    location: '龙头路', 
    effect: '停留时间延长'
  },
  { 
    value: 'light_show', 
    label: '灯光秀', 
    location: '鼓浪屿码头', 
    effect: '夜间人流增加'
  },
];

const convertTrajectoryFormat = (trajectories: typeof realTrajectories) => {
  return trajectories.map((trajectory, index) => ({
    id: `trajectory-${index}`,
    points: trajectory.points.map(point => [point.lat, point.lng] as [number, number]),
    timestamp: trajectory.points[0]?.timestamp || Date.now(),
    touristType: trajectory.touristType
  }));
};

interface TrajectoryExplanation {
  scenario: string;
  event?: string;
  description: string;
}

function getTrajectoryExplanation(scenario: string, event: string, temperature: number): TrajectoryExplanation {
  const explanations = {
    normal: {
      base: '在普通日期，游客轨迹呈现较为分散的特点，主要集中在景区核心区域。游客通常会按照常规路线游览，停留时间较为均匀，没有明显的聚集点。',
      high_temp: '由于较高的温度值，生成的轨迹展现出更多样化的游览路线。游客倾向于选择阴凉的地方休息，或者在温度较低的时段进行活动，导致轨迹分布更加分散。',
      low_temp: '由于较低的温度值，生成的轨迹较为保守，主要沿着热门路线。游客更倾向于在室内景点停留，或者选择较短的户外路线，以避免长时间暴露在低温环境中。'
    },
    rainy: {
      base: '在雨天情况下，游客轨迹倾向于选择有遮蔽的路线，停留点较为集中。游客通常会选择有顶棚的步行道或者室内景点，以避免被雨淋湿。',
      high_temp: '即使在雨天，较高的温度值仍然产生了一些创新的避雨路线。游客可能会选择一些临时搭建的遮蔽设施，或者在雨势较小时进行短暂的户外活动。',
      low_temp: '在雨天和低温度值的双重影响下，轨迹高度集中在有遮蔽的区域。游客更倾向于在室内景点停留，或者选择有顶棚的步行道，以避免被雨淋湿和低温困扰。'
    },
    peak: {
      base: '在旺季期间，游客轨迹呈现出较高的密度，各景点间的连接更为频繁。游客数量增加，导致景区内的人流量大，各景点之间的游览路线更加繁忙。',
      high_temp: '旺季的高温度值产生了更多非常规路线，体现出游客寻找替代路线的倾向。游客可能会选择一些通常不常去的景点，以避开人流密集的区域，或者在温度较低的时段进行活动。',
      low_temp: '即使在旺季，低温度值仍然产生了相对保守的路线选择。游客更倾向于在室内景点停留，或者选择较短的户外路线，以避免长时间暴露在低温环境中。'
    }
  };
  
  const eventExplanations = {
    music_festival: '音乐节的举办使得钢琴博物馆周边区域出现明显的人流聚集。音乐节期间，钢琴博物馆及其周边区域的游客数量显著增加，停留时间延长，导致该区域的人流密度明显高于平时。',
    food_festival: '美食节的影响使得龙头路区域的停留时间明显延长。美食节期间，龙头路区域的各类美食摊位吸引了大量游客，游客在品尝美食的同时，停留时间显著增加，导致该区域的人流密度和停留时间明显高于平时。',
    light_show: '灯光秀活动导致鼓浪屿码头区域在夜间出现显著的人流密集。灯光秀活动期间，鼓浪屿码头区域的游客数量显著增加，特别是在夜间，游客聚集在码头区域观看灯光秀，导致该区域的人流密度明显高于平时。'
  };
  

  const tempDescription = temperature > 2.5 ? 'high_temp' : temperature < 1.5 ? 'low_temp' : 'base';
  const baseExplanation = explanations[scenario as keyof typeof explanations][tempDescription];
  const eventExplanation = event !== 'none' ? eventExplanations[event as keyof typeof eventExplanations] : '';

  return {
    scenario: baseExplanation,
    event: eventExplanation,
    description: `${baseExplanation} ${eventExplanation}`
  };
}

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
      id?: string;
      touristType?: string;
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

  const handleGenerateTrajectories = async () => {
    setIsGenerating(true);
    try {
      const params: GenerationParams = {
        temperature,
        scenario: selectedScenario,
        specialEvent: specialEvent !== 'none' ? {
          type: specialEvent,
          location: SPECIAL_EVENT_LOCATIONS[specialEvent as keyof typeof SPECIAL_EVENT_LOCATIONS],
          radius: 0.005
        } : undefined
      };

      const newTrajectories = generateDayTrajectories(100, true, params);
      const explanation = getTrajectoryExplanation(selectedScenario, specialEvent, temperature);
      
      setTrajectoryData(prev => ({
        ...prev,
        generated: convertTrajectoryFormat(newTrajectories).map(traj => ({
          ...traj,
          explanation: explanation.description
        }))
      }));

      message.success('轨迹生成成功！');
    } catch (error) {
      console.error('Error generating trajectories:', error);
      message.error('生成轨迹时发生错误');
    } finally {
      setIsGenerating(false);
    }
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
          <h3>轨迹生成说明</h3>
          <div className="explanation-content">
            <p>{trajectoryData.generated[0].explanation}</p>
            <div className="explanation-details">
              <div className="scenario-info">
                <span className="label">场景：</span>
                <span className="value">{
                  scenarios.find(s => s.id === selectedScenario)?.name || '普通日'
                }</span>
              </div>
              {specialEvent !== 'none' && (
                <div className="event-info">
                  <span className="label">特殊事件：</span>
                  <span className="value">{
                    SPECIAL_EVENTS.find(e => e.value === specialEvent)?.label
                  }</span>
                </div>
              )}
              <div className="temperature-info">
                <span className="label">温度值：</span>
                <span className="value">{temperature}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Simulation;