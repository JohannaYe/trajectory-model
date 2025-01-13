import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaRoute, FaChartLine, FaSimCard } from 'react-icons/fa';
import { BiAnalyse } from 'react-icons/bi';
import { AiOutlineSchedule } from 'react-icons/ai';
import MapPreview from '../components/Map/MapPreview';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled(motion.section)`
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(to right, #e6f7ff, #f0f5ff);
  border-radius: 12px;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #003a8c;
  margin-bottom: 1rem;
`;

const Tagline = styled.p`
  font-size: 1.25rem;
  color: #595959;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.primary ? `
    background-color: #1890ff;
    color: white;
    border: none;
    &:hover {
      background-color: #096dd9;
    }
  ` : `
    background-color: white;
    color: #1890ff;
    border: 1px solid #1890ff;
    &:hover {
      background-color: #e6f7ff;
    }
  `}
`;

const HighlightSection = styled.section`
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const ProblemStatement = styled.div`
  h2 {
    color: #003a8c;
    margin-bottom: 1rem;
  }
  
  p {
    color: #595959;
    line-height: 1.6;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const FeatureCard = styled(motion.div)`
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: #1890ff;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  text-align: center;
`;

const StatItem = styled(motion.div)`
  h4 {
    font-size: 2.5rem;
    color: #1890ff;
    margin-bottom: 0.5rem;
  }
`;

const MapSection = styled.section`
  margin: 3rem 0;
`;

const MapTitle = styled.h2`
  color: #003a8c;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
`;

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaRoute />,
      title: "智能轨迹建模",
      description: "基于深度学习的游客行为分析，精准把握游客偏好与移动模式。"
    },
    {
      icon: <BiAnalyse />,
      title: "实时路径预测",
      description: "结合时空数据，实时预测游客可能的下一个目的地。"
    },
    {
      icon: <AiOutlineSchedule />,
      title: "场景模拟分析",
      description: "多场景下的游客流量模拟，为景区管理决策提供支持。"
    }
  ];

  const stats = [
    { number: "300+", label: "采样游客数据" },
    { number: "90%", label: "预测准确率" },
    { number: "24/7", label: "有效监测" }
  ];

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <HomeContainer>
      <HeroSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>鼓浪屿游客轨迹建模与生成系统</Title>
        <Tagline>
          基于AI的景区智能管理解决方案
        </Tagline>
        <ButtonGroup>
          <Button 
            primary 
            onClick={() => navigate('/introduction')}
          >
            开始了解
          </Button>
          <Button 
            onClick={() => navigate('/modeling')}
          >
            探索建模框架
          </Button>
        </ButtonGroup>
      </HeroSection>

      <HighlightSection>
        <ProblemStatement>
          <h2>研究背景</h2>
          <p>
            鼓浪屿作为著名的文化旅游目的地，每年接待大量游客。
            准确理解和预测游客行为对于提升景区管理效率、优化游客体验具有重要意义。
            本项目通过先进的AI技术，对游客轨迹进行建模与分析，为景区管理提供数据支持。
          </p>
        </ProblemStatement>

        <StatsSection
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              variants={itemVariants}
            >
              <motion.h4
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {stat.number}
              </motion.h4>
              <p>{stat.label}</p>
            </StatItem>
          ))}
        </StatsSection>

        <FeaturesGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <IconWrapper>{feature.icon}</IconWrapper>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeaturesGrid>

        <MapSection
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <MapTitle>鼓浪屿景区概览</MapTitle>
          <MapPreview />
        </MapSection>
      </HighlightSection>
    </HomeContainer>
  );
}

export default Home; 