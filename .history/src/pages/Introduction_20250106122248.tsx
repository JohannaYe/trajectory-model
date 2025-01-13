import React from 'react';
import styled from '@emotion/styled';
import { Button } from 'antd';
import { Timeline, Card, Statistic, Row, Col } from 'antd';
import { LineChartOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';

const IntroductionContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
`;

const HeroSection = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/hero-background.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 6rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const Section = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #1a1a1a;
`;

const StyledCard = styled(Card)`
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CTAButton = styled(Button)`
  margin: 0.5rem;
  height: 40px;
  padding: 0 2rem;
`;

function Introduction() {
  return (
    <IntroductionContainer>
      <HeroSection>
        <Title>Welcome to the Gulangyu Tourist Trajectory System</Title>
        <Subtitle>Explore, Model, and Simulate Tourist Behavior with Cutting-Edge Technology</Subtitle>
        <div>
          <CTAButton type="primary" size="large">
            Learn More About Our Vision
          </CTAButton>
          <CTAButton type="default" size="large" ghost>
            Explore the Knowledge Base
          </CTAButton>
        </div>
      </HeroSection>

      <MainContent>
        <Section id="about">
          <SectionTitle>About the Project</SectionTitle>
          <Row gutter={[24, 24]}>
            <Col span={16}>
              <StyledCard title="Our Mission">
                <p>
                  Our mission is to create a dynamic, data-rich platform that transforms 
                  the way scenic spots like Gulangyu are managed. Through innovative use 
                  of large models and AI technology, we're revolutionizing tourism management 
                  and enhancing visitor experiences.
                </p>
              </StyledCard>
            </Col>
            <Col span={8}>
              <StyledCard>
                <Timeline>
                  <Timeline.Item>Project Initiation - 2023 Q1</Timeline.Item>
                  <Timeline.Item>Data Collection Phase - 2023 Q2</Timeline.Item>
                  <Timeline.Item>Model Development - 2023 Q3</Timeline.Item>
                  <Timeline.Item>Platform Launch - 2023 Q4</Timeline.Item>
                </Timeline>
              </StyledCard>
            </Col>
          </Row>
        </Section>

        <Section id="data-collection">
          <SectionTitle>Data Collection Process</SectionTitle>
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <StyledCard>
                <Statistic 
                  title="Total Data Points" 
                  value={2000000} 
                  prefix={<LineChartOutlined />} 
                  suffix="points"
                />
              </StyledCard>
            </Col>
            <Col span={8}>
              <StyledCard>
                <Statistic 
                  title="Participants" 
                  value={5000} 
                  prefix={<TeamOutlined />} 
                  suffix="tourists"
                />
              </StyledCard>
            </Col>
            <Col span={8}>
              <StyledCard>
                <Statistic 
                  title="Collection Points" 
                  value={50} 
                  prefix={<EnvironmentOutlined />} 
                  suffix="locations"
                />
              </StyledCard>
            </Col>
          </Row>
          <StyledCard title="Methodology" style={{ marginTop: '2rem' }}>
            <h3>Experiment Details</h3>
            <ul>
              <li>Duration: 3 months of intensive data collection</li>
              <li>Participants: Over 5,000 tourists from diverse demographics</li>
              <li>Tools: GPS devices, mobile apps, and environmental sensors</li>
            </ul>
            <h3>Data Types Collected</h3>
            <ul>
              <li>Tourist trajectories (routes and duration)</li>
              <li>Environmental data (weather conditions, crowd density)</li>
              <li>Behavioral patterns (attraction preferences, timing)</li>
            </ul>
          </StyledCard>
        </Section>

        <Section id="quick-start">
          <SectionTitle>Quick Start Guide</SectionTitle>
          <Row gutter={[24, 24]}>
            {[
              {
                title: 'Explore Data Insights',
                description: 'Browse through our comprehensive knowledge base'
              },
              {
                title: 'Test Individual Modeling',
                description: 'Create and analyze individual tourist models'
              },
              {
                title: 'Generate Trajectories',
                description: 'Simulate realistic tourist movement patterns'
              },
              {
                title: 'Evaluate Results',
                description: 'Analyze and validate generated trajectories'
              }
            ].map((step, index) => (
              <Col span={6} key={index}>
                <StyledCard title={`Step ${index + 1}`}>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </StyledCard>
              </Col>
            ))}
          </Row>
        </Section>
      </MainContent>
    </IntroductionContainer>
  );
}

export default Introduction;