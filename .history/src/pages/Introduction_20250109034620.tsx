import React from 'react';
import styled from '@emotion/styled';
import { Button } from 'antd';
import { Timeline, Card, Statistic, Row, Col } from 'antd';
import { LineChartOutlined, TeamOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const IntroductionContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
`;

const HeroSection = styled.div`
max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  background-size: cover;
  background-position: center;
  color: black;
  padding: 6rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
  overflow: hidden;

  &::before {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/image/gulangyuhengxiang.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.3; /* 20% 透明度 */
    z-index: -1; /* 确保背景图片在内容之下 */
  }
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

const MissionCard = styled(StyledCard)`
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 0.8rem 0;
    padding-left: 1.5rem;
    position: relative;

    &:before {
      content: "✓";
      color: #1890ff;
      position: absolute;
      left: 0;
    }
  }
`;

const TimelineCard = styled(StyledCard)`
  height: 100%;

  .ant-timeline {
    margin-top: 1rem;
  }

  .ant-timeline-item {
    padding-bottom: 1.5rem;

    &-head {
      width: 16px;
      height: 16px;
      background-color: #1890ff;
      border-color: #1890ff;
    }

    &-content {
      font-size: 1rem;

      .timeline-title {
        font-weight: bold;
        color: #1890ff;
        margin-bottom: 0.3rem;
      }

      .timeline-description {
        color: #666;
        font-size: 0.9rem;
      }
    }
  }
`;

const MethodologyCard = styled(StyledCard)`
  h3 {
    color: #1890ff;
    font-size: 1.3rem;
    margin: 1.5rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #f0f0f0;
    &:first-of-type {
      margin-top: 0;
    }
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 0.8rem 0;
    padding-left: 1.5rem;
    position: relative;
    line-height: 1.6;
    color: #1a1a1a;

    &:before {
      content: "•";
      color: #1890ff;
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    &:hover {
      color: #1890ff;
      transition: color 0.3s ease;
    }
  }
`;

const CTAButton = styled(Button)`
  margin: 0.5rem;
  height: 40px;
  padding: 0 2rem;
`;

function Introduction() {
  const navigate = useNavigate();

  const scrollToMission = () => {
    const missionElement = document.getElementById('mission');
    if (missionElement) {
      missionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <IntroductionContainer>
      <HeroSection>
        <Title>欢迎使用鼓浪屿游客轨迹生成系统</Title>
        <Subtitle>使用前沿AI技术探索、建模和模拟游客行为</Subtitle>
        <div>
          <CTAButton type="primary" size="large" onClick={scrollToMission}>
            了解我们的愿景
          </CTAButton>
          <CTAButton
            type="primary"
            size="large"
            ghost
            onClick={() => navigate('/knowledge-base')}
          >
            探索知识库
          </CTAButton>
        </div>
      </HeroSection>

      <MainContent>
        <Section id="about">
          <SectionTitle>关于项目</SectionTitle>
          <Row gutter={[24, 24]}>
            <Col span={16}>
              <MissionCard title="我们的愿景" id="mission">
                <p>
                我们的使命是打造一个革命性的平台，通过大语言模型等人工智能技术，为鼓浪屿等景区提供精准的人流轨迹生成服务。我们致力于利用先进的数据分析和预测能力，优化景区管理策略，提升游客体验质量。通过模拟和预测游客行为模式，我们旨在呈现有效的游客行为轨迹，有效的数据来帮助景区管理者做出更明智的决策，实现资源的高效分配，并为游客提供个性化的游览建议。我们的愿景是成为旅游业智能化转型的先驱，推动景区管理向数据驱动、智能化和可持续发展的方向迈进，最终实现景区与游客的双赢。
                </p>
                <div>
                  <h4 style={{ marginBottom: '1rem', color: '#1890ff' }}>我们的目标</h4>
                  <ul>
                    <li>优化游客流量分布，提升景区承载能力</li>
                    <li>个性化推荐路线，打造智能导游体验</li>
                    <li>实时监控与预警，确保景区安全运营</li>
                    <li>数据驱动决策，助力景区科学管理</li>
                  </ul>
                </div>
              </MissionCard>
            </Col>
            <Col span={8}>
              <TimelineCard>
                <Timeline>
                  <Timeline.Item>
                    <div className="timeline-title">项目启动</div>
                    <div className="timeline-description">
                      2024年第一季度
                      <br />
                      完成项目规划与团队组建
                    </div>
                  </Timeline.Item>
                  <Timeline.Item>
                    <div className="timeline-title">数据收集阶段</div>
                    <div className="timeline-description">
                      2024年第二季度
                      <br />
                      部署传感器网络与数据采集系统
                    </div>
                  </Timeline.Item>
                  <Timeline.Item>
                    <div className="timeline-title">模型开发</div>
                    <div className="timeline-description">
                      2024年第三季度
                      <br />
                      构建并优化AI模型
                    </div>
                  </Timeline.Item>
                  <Timeline.Item>
                    <div className="timeline-title">平台上线</div>
                    <div className="timeline-description">
                      2024年第四季度
                      <br />
                      系统部署与实地测试
                    </div>
                  </Timeline.Item>
                </Timeline>
              </TimelineCard>
            </Col>
          </Row>
        </Section>

        <Section id="data-collection">
          <SectionTitle>数据收集过程</SectionTitle>
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <StyledCard>
                <Statistic 
                  title="总数据点数" 
                  value={2000000} 
                  prefix={<LineChartOutlined />} 
                  suffix="点"
                />
              </StyledCard>
            </Col>
            <Col span={8}>
              <StyledCard>
                <Statistic 
                  title="参与人数" 
                  value={500} 
                  prefix={<TeamOutlined />} 
                  suffix="游客"
                />
              </StyledCard>
            </Col>
            <Col span={8}>
              <StyledCard>
                <Statistic 
                  title="数据收集点" 
                  value={50} 
                  prefix={<EnvironmentOutlined />} 
                  suffix="地点"
                />
              </StyledCard>
            </Col>
          </Row>
          <MethodologyCard title="方法论" style={{ marginTop: '2rem' }}>
            <h3>实验详情</h3>
            <ul>
              <li>持续时间：3个月的密集数据收集</li>
              <li>参与者：来自不同人群的500多名游客</li>
              <li>工具：GPS设备、移动应用和环境传感器</li>
            </ul>
            <h3>收集的数据类型</h3>
            <ul>
              <li>游客轨迹（路线和持续时间）</li>
              <li>环境数据（天气条件、人群密度）</li>
              <li>行为模式（景点偏好、时间）</li>
            </ul>
          </MethodologyCard>
        </Section>

        <Section id="quick-start">
          <SectionTitle>快速入门指南</SectionTitle>
          <Row gutter={[24, 24]}>
            {[
              {
                title: '浏览数据洞察',
                description: '浏览我们的综合知识库'
              },
              {
                title: '测试个体建模',
                description: '创建和分析个体游客模型'
              },
              {
                title: '生成轨迹',
                description: '模拟真实的游客移动模式'
              },
              {
                title: '评估结果',
                description: '分析和验证生成的轨迹'
              }
            ].map((step, index) => (
              <Col span={6} key={index}>
                <StyledCard title={`步骤${index + 1}`}>
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