import React, { useState } from 'react';
import { Select, Space, Timeline, Card } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import MapComponent from '../components/map/MapComponent';
import { trajectoryForMap, sampleTouristTrajectory } from '../data/sampleTrajectory';
import '../styles/Modeling.css';

const Modeling: React.FC = () => {
  const [activeSection, setActiveSection] = useState('results');
  const [selectedTouristType, setSelectedTouristType] = useState('family');
  const [selectedTimeRange, setSelectedTimeRange] = useState('morning');
  const [selectedWeather, setSelectedWeather] = useState('sunny');
  const [selectedPoint, setSelectedPoint] = useState<any>(null);

  const workflowSteps = [
    {
      id: 'data',
      title: 'Data Preparation',
      description: 'Clean and preprocess tourist trajectory data for modeling.',
    },
    {
      id: 'training',
      title: 'Model Training',
      description: 'Train the large model using prepared datasets and embeddings.',
    },
    {
      id: 'prediction',
      title: 'Trajectory Prediction',
      description: 'Generate predicted paths based on tourist attributes.',
    },
  ];

  const handlePointClick = (point: any) => {
    // Find the matching trajectory point to get additional data
    const matchingPoint = sampleTouristTrajectory.trajectoryPoints.find(
      p => p.coordinates[0] === point.lng && p.coordinates[1] === point.lat
    );
    if (matchingPoint) {
      setSelectedPoint({
        ...point,
        location: matchingPoint.location,
        duration: matchingPoint.duration,
        nextDestination: matchingPoint.nextDestination
      });
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modeling-page">
      <header className="modeling-header">
        <h1>Tourist Trajectory Modeling</h1>
        <p className="subheading">
          Advanced modeling system for understanding and predicting tourist movements
        </p>
        
        <nav className="modeling-nav">
          {['overview', 'workflow', 'customization', 'results'].map((section) => (
            <button
              key={section}
              className={`nav-item ${activeSection === section ? 'active' : ''}`}
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      <main className="modeling-content">
        {activeSection === 'overview' && (
          <section className="panel">
            <h2>Overview</h2>
            <p>
              Our trajectory modeling system uses advanced algorithms to understand and predict tourist movements
              across Gulangyu. By analyzing patterns in historical data and considering various factors such as
              tourist preferences, time of day, and environmental conditions, we generate realistic and diverse
              trajectories.
            </p>
            <div className="insights-panel">
              <h3>Key Features</h3>
              <div className="insights-grid">
                <div className="insight-card">
                  <h4>Data-Driven</h4>
                  <p>Based on real tourist behavior patterns</p>
                </div>
                <div className="insight-card">
                  <h4>Contextual</h4>
                  <p>Considers environmental and temporal factors</p>
                </div>
                <div className="insight-card">
                  <h4>Adaptive</h4>
                  <p>Adjusts to different tourist profiles</p>
                </div>
              </div>
            </div>
            <br></br>
            <section className="panel">
            <h2>Modeling Workflow</h2>
            <div className="workflow-steps">
              {workflowSteps.map((step) => (
                <div key={step.id} className="workflow-step">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </section>
          </section>
        )}

        {activeSection === 'workflow' && (
          <section className="panel">
            <h2>Modeling Workflow</h2>
            <div className="workflow-steps">
              {workflowSteps.map((step) => (
                <div key={step.id} className="workflow-step">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'customization' && (
          <section className="panel">
            <h2>Model Customization</h2>
            <div className="customization-form">
              <div className="form-group">
                <label>Tourist Type</label>
                <Select
                  className="select-input"
                  value={selectedTouristType}
                  onChange={setSelectedTouristType}
                  options={[
                    { value: 'family', label: 'Family Group' },
                    { value: 'solo', label: 'Solo Traveler' },
                    { value: 'couple', label: 'Couple' },
                    { value: 'group', label: 'Tour Group' },
                  ]}
                />
              </div>
              <div className="form-group">
                <label>Time Range</label>
                <Select
                  className="select-input"
                  value={selectedTimeRange}
                  onChange={setSelectedTimeRange}
                  options={[
                    { value: 'morning', label: 'Morning (8:00-12:00)' },
                    { value: 'afternoon', label: 'Afternoon (12:00-17:00)' },
                    { value: 'evening', label: 'Evening (17:00-21:00)' },
                  ]}
                />
              </div>
              <div className="form-group">
                <label>Weather Condition</label>
                <Select
                  className="select-input"
                  value={selectedWeather}
                  onChange={setSelectedWeather}
                  options={[
                    { value: 'sunny', label: 'Sunny' },
                    { value: 'rainy', label: 'Rainy' },
                    { value: 'cloudy', label: 'Cloudy' },
                  ]}
                />
              </div>
            </div>
            <Space>
              <button className="button button-primary">Generate Trajectory</button>
              <button className="button button-secondary">Reset</button>
            </Space>
          </section>
        )}

        {activeSection === 'results' && (
          <section className="panel">
            <h2>Results and Visualizations</h2>
            <div className="visualization-container">
              <div className="trajectory-details">
                <Card title="Tourist Information" style={{ marginBottom: '1rem' }}>
                  <p><strong>Tourist Type:</strong> {sampleTouristTrajectory.type}</p>
                  <p><strong>Total Locations:</strong> {sampleTouristTrajectory.trajectoryPoints.length}</p>
                  <p><strong>Visit Duration:</strong> 5 hours</p>
                </Card>
                
                <Card title="Visit Timeline">
                  <Timeline>
                    {sampleTouristTrajectory.trajectoryPoints.map((point, index) => (
                      <Timeline.Item
                        key={point.id}
                        dot={index === sampleTouristTrajectory.trajectoryPoints.length - 1 ? 
                          <EnvironmentOutlined style={{ fontSize: '16px' }} /> : 
                          <ClockCircleOutlined style={{ fontSize: '16px' }} />}
                      >
                        <p><strong>{point.location}</strong></p>
                        <p>Time: {formatTime(point.timestamp)}</p>
                        {point.duration > 0 && <p>Duration: {point.duration} minutes</p>}
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              </div>

              <div className="map-container" style={{ height: '500px' }}>
                <MapComponent
                  trajectories={trajectoryForMap}
                  showHeatmap={false}
                  onPointClick={handlePointClick}
                  center={{ lng: 118.0627, lat: 24.4453 }}
                  zoom={15}
                />
              </div>

              {selectedPoint && (
                <Card title="Selected Location Details" className="point-details">
                  <p><strong>Location:</strong> {selectedPoint.location}</p>
                  <p><strong>Time:</strong> {new Date(selectedPoint.timestamp).toLocaleTimeString()}</p>
                  <p><strong>Duration:</strong> {selectedPoint.duration} minutes</p>
                  <p><strong>Next Destination:</strong> {selectedPoint.nextDestination}</p>
                </Card>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Modeling;