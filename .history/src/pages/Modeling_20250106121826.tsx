import React, { useState } from 'react';
import styled from '@emotion/styled';

const ModelingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const NavItem = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.active ? '#1a73e8' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#1557b0' : '#f0f0f0'};
  }
`;

const Panel = styled.section`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const PanelTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const PanelContent = styled.div`
  color: #666;
  line-height: 1.6;
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
`;

const WorkflowStep = styled.div<{ active: boolean }>`
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.active ? '#f8f9fa' : 'white'};
  
  &:hover {
    background: #f8f9fa;
  }
`;

const CustomizationForm = styled.form`
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
`;

function Modeling() {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeWorkflowStep, setActiveWorkflowStep] = useState('data');

  return (
    <ModelingContainer>
      <Header>
        <Title>轨迹建模</Title>
        <Navigation>
          {['overview', 'workflow', 'results', 'customization'].map(section => (
            <NavItem
              key={section}
              active={activeSection === section}
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </NavItem>
          ))}
        </Navigation>
      </Header>

      {activeSection === 'overview' && (
        <Panel>
          <PanelTitle>Overview</PanelTitle>
          <PanelContent>
            <p>Trajectory modeling is a sophisticated approach to understanding and predicting tourist movements within Gulangyu. By leveraging advanced algorithms and historical data, we can better understand visitor patterns and optimize the tourist experience.</p>
            <FlexContainer>
              {/* Placeholder for infographic */}
              <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '4px', textAlign: 'center' }}>
                Modeling Process Infographic
              </div>
            </FlexContainer>
          </PanelContent>
        </Panel>
      )}

      {activeSection === 'workflow' && (
        <Panel>
          <PanelTitle>Modeling Workflow</PanelTitle>
          <FlexContainer>
            {['data', 'training', 'evaluation'].map(step => (
              <WorkflowStep
                key={step}
                active={activeWorkflowStep === step}
                onClick={() => setActiveWorkflowStep(step)}
              >
                <h3>{step.charAt(0).toUpperCase() + step.slice(1)}</h3>
                <p>{getWorkflowDescription(step)}</p>
              </WorkflowStep>
            ))}
          </FlexContainer>
        </Panel>
      )}

      {activeSection === 'customization' && (
        <Panel>
          <PanelTitle>Model Customization</PanelTitle>
          <CustomizationForm>
            <div>
              <label>Tourist Type</label>
              <Select>
                <option>Family</option>
                <option>Solo Traveler</option>
                <option>Group</option>
              </Select>
            </div>
            <div>
              <label>Time of Visit</label>
              <Select>
                <option>Weekday</option>
                <option>Weekend</option>
                <option>Holiday</option>
              </Select>
            </div>
            <div>
              <label>Weather Condition</label>
              <Select>
                <option>Sunny</option>
                <option>Rainy</option>
                <option>Cloudy</option>
              </Select>
            </div>
          </CustomizationForm>
        </Panel>
      )}

      {activeSection === 'results' && (
        <Panel>
          <PanelTitle>Results and Visualizations</PanelTitle>
          <PanelContent>
            {/* Placeholder for visualization components */}
            <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '4px', textAlign: 'center' }}>
              Interactive Map Visualization
            </div>
          </PanelContent>
        </Panel>
      )}
    </ModelingContainer>
  );
}

function getWorkflowDescription(step: string): string {
  switch (step) {
    case 'data':
      return 'Data preparation including cleaning and preprocessing of tourist trajectories.';
    case 'training':
      return 'Model training using advanced algorithms for trajectory prediction.';
    case 'evaluation':
      return 'Evaluation of model performance using various metrics.';
    default:
      return '';
  }
}

export default Modeling;