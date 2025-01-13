import React, { useState, useCallback } from 'react';
import { Switch, Radio, Space, Tooltip, Row, Col, Card, Select, Typography, Divider } from 'antd';
import { HeatMapOutlined, DotChartOutlined } from '@ant-design/icons';
import '../styles/Simulation.css';
import MapComponent from '../components/Map/modelMapComponent';
import { realTrajectories, generatedTrajectories } from '../data/mockTrajectories';

// Mock data for timeline events
const timelineEvents = [
  { time: '11:30 AM', event: 'Tourist arrived at Sunlight Rock' },
  { time: '12:15 PM', event: 'Moving towards Piano Museum' },
  { time: '12:45 PM', event: 'Lunch break at local restaurant' },
];

// Mock data for behavioral traits
const behavioralTraits = {
  type: 'Cultural Enthusiast',
  preferences: ['Historical Sites', 'Museums', 'Local Cuisine'],
  timeConstraints: '4-6 hours',
};

const seasons = [
  { value: 'spring', label: 'Spring (Mar-May)' },
  { value: 'summer', label: 'Summer (Jun-Aug)' },
  { value: 'autumn', label: 'Autumn (Sep-Nov)' },
  { value: 'winter', label: 'Winter (Dec-Feb)' },
];

const events = [
  { value: 'none', label: 'No Special Event' },
  { value: 'lunarNewYear', label: 'Lunar New Year Festival' },
  { value: 'summerMusic', label: 'Summer Music Festival' },
  { value: 'midAutumn', label: 'Mid-Autumn Festival' },
  { value: 'nationalDay', label: 'National Day Holiday' },
  { value: 'christmas', label: 'Christmas/New Year' },
];

const timePeriods = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

const touristTypes = [
  { value: 'all', label: 'All Tourists' },
  { value: 'cultural', label: 'Cultural Tourists' },
  { value: 'leisure', label: 'Leisure Tourists' },
  { value: 'quick', label: 'Quick-tour Tourists' },
];

function Simulation() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState('normal');
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'single'>('split');
  const [selectedSeason, setSelectedSeason] = useState<string>('winter');
  const [selectedEvent, setSelectedEvent] = useState<string>('none');
  const [selectedTime, setSelectedTime] = useState<string>('afternoon');
  const [selectedTouristType, setSelectedTouristType] = useState<string>('all');

  const workflowSteps = [
    { id: 1, title: 'Data Collection', description: 'Real-world trajectory data' },
    { id: 2, title: 'Behavior Modeling', description: 'Tourist type prediction' },
    { id: 3, title: 'Trajectory Simulation', description: 'Path generation' },
    { id: 4, title: 'Data Evaluation', description: 'Comparison with benchmarks' },
  ];

  const scenarios = [
    { id: 'normal', name: 'Normal Day', description: 'Standard tourist conditions' },
    { id: 'rainy', name: 'Rainy Day', description: 'Weather-influenced paths' },
    { id: 'peak', name: 'Peak Season', description: 'High crowd density' },
  ];

  const handlePointClick = useCallback((point: any) => {
    setSelectedPoint(point);
  }, []);

  const renderMapControls = () => (
    <div className="map-controls">
      <Space>
        <Tooltip title="Toggle Heatmap">
          <Switch
            checkedChildren={<HeatMapOutlined />}
            unCheckedChildren={<DotChartOutlined />}
            checked={showHeatmap}
            onChange={setShowHeatmap}
          />
        </Tooltip>
        <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <Radio.Button value="split">Split View</Radio.Button>
          <Radio.Button value="single">Single View</Radio.Button>
        </Radio.Group>
      </Space>
    </div>
  );

  const getFilteredTrajectories = (trajectories: any[]) => {
    return trajectories.filter(trajectory => {
      const matchesSeason = trajectory[0]?.season === selectedSeason;
      const matchesTime = trajectory[0]?.timePeriod === selectedTime;
      const matchesEvent = selectedEvent === 'none' ? 
        !trajectory[0]?.activeEvents?.length :
        trajectory[0]?.activeEvents?.includes(selectedEvent);
      const matchesTouristType = selectedTouristType === 'all' ? true :
        trajectory[0]?.touristType === selectedTouristType;

      return matchesSeason && matchesTime && matchesEvent && matchesTouristType;
    });
  };

  const filteredReal = getFilteredTrajectories(realTrajectories);
  const filteredGenerated = getFilteredTrajectories(generatedTrajectories);

  return (
    <div className="simulation-container">
      <h1>轨迹模拟</h1>

      {/* Generation Workflow Overview */}
      <section className="workflow-overview">
        <h2>Generation Workflow Overview</h2>
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

      {/* Control Panel */}
      <section className="control-panel">
        <h2>Simulation Controls</h2>
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
        <Card>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <div className="select-label">Season:</div>
              <Select
                style={{ width: '100%' }}
                value={selectedSeason}
                onChange={setSelectedSeason}
              >
                {seasons.map(season => (
                  <Select.Option key={season.value} value={season.value}>
                    {season.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <div className="select-label">Special Event:</div>
              <Select
                style={{ width: '100%' }}
                value={selectedEvent}
                onChange={setSelectedEvent}
              >
                {events.map(event => (
                  <Select.Option key={event.value} value={event.value}>
                    {event.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <div className="select-label">Time Period:</div>
              <Select
                style={{ width: '100%' }}
                value={selectedTime}
                onChange={setSelectedTime}
              >
                {timePeriods.map(time => (
                  <Select.Option key={time.value} value={time.value}>
                    {time.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <div className="select-label">Tourist Type:</div>
              <Select
                style={{ width: '100%' }}
                value={selectedTouristType}
                onChange={setSelectedTouristType}
              >
                {touristTypes.map(type => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Card>
      </section>

      {/* Main Visualization Area */}
      <div className={`visualization-container ${viewMode === 'single' ? 'single-view' : ''}`}>
        <div className="map-container">
          <h3>Real-world Trajectories</h3>
          <MapComponent 
            trajectories={filteredReal}
            onPointClick={handlePointClick}
            showHeatmap={showHeatmap}
          />
        </div>
        {viewMode === 'split' && (
          <div className="map-container">
            <h3>Generated Trajectories</h3>
            <MapComponent 
              trajectories={filteredGenerated}
              onPointClick={handlePointClick}
              showHeatmap={showHeatmap}
            />
          </div>
        )}
      </div>

      {/* Model Insights Panel */}
      <section className="model-insights">
        <h2>Model Insights</h2>
        <div>
          <h3>Current Predictions</h3>
          {selectedPoint ? (
            <>
              <p>Selected Point: {selectedPoint.type}</p>
              <p>Time: {new Date(selectedPoint.timestamp).toLocaleTimeString()}</p>
              <p>Location: [{selectedPoint.lng.toFixed(4)}, {selectedPoint.lat.toFixed(4)}]</p>
            </>
          ) : (
            <>
              <p>Next Destination: Piano Museum (87% confidence)</p>
              <p>Estimated Duration: 45 minutes</p>
              <p>Route Preference: Scenic route through historical district</p>
            </>
          )}
        </div>
      </section>

      {/* Behavioral Panel */}
      <section className="behavioral-panel">
        <h2>Tourist Behavioral Profile</h2>
        <div>
          <h3>Type: {behavioralTraits.type}</h3>
          <h4>Preferences:</h4>
          <ul>
            {behavioralTraits.preferences.map((pref, index) => (
              <li key={index}>{pref}</li>
            ))}
          </ul>
          <p>Time Available: {behavioralTraits.timeConstraints}</p>
        </div>
      </section>

      {/* Timeline Tracker */}
      <section className="timeline-tracker">
        <h2>Trajectory Timeline</h2>
        <div>
          {timelineEvents.map((event, index) => (
            <div key={index}>
              <strong>{event.time}</strong>: {event.event}
            </div>
          ))}
        </div>
      </section>

      {/* Export Panel */}
      <section className="export-panel">
        <button className="button button-secondary">Export Data</button>
        <button className="button button-primary">Generate Report</button>
      </section>
    </div>
  );
}

export default Simulation;