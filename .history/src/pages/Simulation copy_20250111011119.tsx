import React, { useState, useCallback } from 'react';
import { Switch, Radio, Space, Tooltip, Select, DatePicker, Card, Tag } from 'antd';
import { HeatMapOutlined, DotChartOutlined, CalendarOutlined } from '@ant-design/icons';
import '../styles/Simulation.css';
import MapComponent from '../components/Map/modelMapComponent';
import { realTrajectories, generatedTrajectories } from '../data/mockTrajectories';
import dayjs from 'dayjs';

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

// Event definitions
const events = {
  lunarNewYear: {
    name: 'Lunar New Year Festival',
    date: '2025-02-01',
    duration: 15,
    color: '#f50',
    description: 'Traditional celebrations with lanterns and fireworks',
  },
  pianoFestival: {
    name: 'International Piano Festival',
    date: '2025-08-10',
    duration: 7,
    color: '#108ee9',
    description: 'World-class piano performances and concerts',
  },
  midAutumnFestival: {
    name: 'Mid-Autumn Festival',
    date: '2025-09-15',
    duration: 3,
    color: '#87d068',
    description: 'Moon viewing and traditional celebrations',
  },
  summerBeachFestival: {
    name: 'Summer Beach Festival',
    date: '2025-07-01',
    duration: 10,
    color: '#ffa940',
    description: 'Beach activities and water sports',
  },
};

function Simulation() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState('normal');
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'single'>('split');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs('2025-01-06'));
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Check if selected date falls within any event
  const getActiveEvent = (date: dayjs.Dayjs) => {
    return Object.entries(events).find(([_, event]) => {
      const eventStart = dayjs(event.date);
      const eventEnd = eventStart.add(event.duration, 'day');
      return date.isAfter(eventStart) && date.isBefore(eventEnd);
    });
  };

  // Update event when date changes
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      const activeEvent = getActiveEvent(date);
      setSelectedEvent(activeEvent ? activeEvent[0] : null);
    }
  };

  // Directly select an event
  const handleEventSelect = (eventKey: string) => {
    setSelectedEvent(eventKey);
    const event = events[eventKey as keyof typeof events];
    setSelectedDate(dayjs(event.date));
  };

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

  const renderEventControls = () => (
    <div className="event-controls">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card title="Event Simulation" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              style={{ width: '100%' }}
              placeholder="Select date"
            />
            <Select
              style={{ width: '100%' }}
              placeholder="Select event"
              value={selectedEvent}
              onChange={handleEventSelect}
              allowClear
            >
              {Object.entries(events).map(([key, event]) => (
                <Select.Option key={key} value={key}>
                  <Tag color={event.color}>{event.name}</Tag>
                </Select.Option>
              ))}
            </Select>
            {selectedEvent && (
              <Card size="small" style={{ marginTop: 8 }}>
                <p style={{ margin: 0 }}>{events[selectedEvent as keyof typeof events].description}</p>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#888' }}>
                  Duration: {events[selectedEvent as keyof typeof events].duration} days
                </p>
              </Card>
            )}
          </Space>
        </Card>
      </Space>
    </div>
  );

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

  return (
    <div className="simulation-container">
      <div className="simulation-header">
        <h1>Tourist Flow Simulation</h1>
        <p>Visualize and analyze tourist movement patterns</p>
      </div>
      
      <div className="simulation-content">
        <div className="simulation-sidebar">
          {renderEventControls()}
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
          
          {selectedPoint && (
            <div className="model-insights">
              <h3>Model Insights</h3>
              <div className="timeline-events">
                <h4>Timeline</h4>
                {timelineEvents.map((event, index) => (
                  <div key={index} className="timeline-event">
                    <span className="time">{event.time}</span>
                    <span className="event">{event.event}</span>
                  </div>
                ))}
              </div>
              
              <div className="behavioral-traits">
                <h4>Behavioral Analysis</h4>
                <p><strong>Tourist Type:</strong> {behavioralTraits.type}</p>
                <p><strong>Preferences:</strong></p>
                <ul>
                  {behavioralTraits.preferences.map((pref, index) => (
                    <li key={index}>{pref}</li>
                  ))}
                </ul>
                <p><strong>Time Constraints:</strong> {behavioralTraits.timeConstraints}</p>
              </div>
            </div>
          )}
        </div>

        <div className="simulation-main">
          {renderMapControls()}
          <div className="map-container">
            <MapComponent
              viewMode={viewMode}
              showHeatmap={showHeatmap}
              realTrajectories={realTrajectories}
              generatedTrajectories={generatedTrajectories}
              onPointClick={handlePointClick}
              selectedDate={selectedDate}
              selectedEvent={selectedEvent ? events[selectedEvent as keyof typeof events] : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Simulation;