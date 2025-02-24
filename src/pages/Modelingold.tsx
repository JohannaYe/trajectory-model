import React, { useState, useEffect } from 'react';
import MapComponent from '../components/Map/modelMapComponent';
import ChatSection from '../components/ChatSection';
import { touristTrajectories, getTrajectoryForMap } from '../data/sampleTrajectory';
import { Input, Button, Select, Card, Spin } from 'antd';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { PauseOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

// 样式组件
const PageContainer = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto; // 居中整个容器
`;

const PageTitle = styled.h1`
  text-align: center;
  margin-bottom: 24px;
`;

const ContentLayout = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  height: calc(100vh - 140px); // 设置整体内容区域高度

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%; // 使用100%高度
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;

const MapSection = styled.div`
  width: 100%;
  height: 100%;
  min-height: 500px; // 添加最小高度
  position: relative;
`;

const MapLegend = styled.div`
  position: absolute;
  left: 20px;
  bottom: 80px;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 14px;
  
  &:before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 3px;
    margin-right: 8px;
    background: ${props => props.color || '#1890ff'};
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const TimeDisplay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const ControlPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  gap: 10px;
`;

const CardTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModelingPage = () => {
    const [selectedTouristType, setSelectedTouristType] = useState('family');
    const [currentPointIndex, setCurrentPointIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const trajectoryPoints = touristTrajectories[selectedTouristType].trajectoryPoints;

    // 添加数据加载效果
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [selectedTouristType]);

    // 优化动画效果
    useEffect(() => {
        let timer;
        if (isPlaying && currentPointIndex < trajectoryPoints.length) {
            timer = setInterval(() => {
                setCurrentPointIndex(prev => {
                    if (prev < trajectoryPoints.length - 1) {
                        const nextPoint = trajectoryPoints[prev + 1];
                        // 根据点之间的距离动态调整动画速度
                        const distance = calculateDistance(
                            trajectoryPoints[prev].coordinates,
                            nextPoint.coordinates
                        );
                        const speed = Math.max(500, Math.min(2000, distance * 200)); // 根据距离调整速度
                        
                        setCurrentTime(dayjs(nextPoint.timestamp).format('YYYY-MM-DD HH:mm:ss'));
                        
                        // 设置下一个定时器的间隔
                        if (timer) {
                            clearInterval(timer);
                            timer = setInterval(() => {
                                setCurrentPointIndex(p => p + 1);
                            }, speed);
                        }
                        
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        return prev;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isPlaying, currentPointIndex, trajectoryPoints]);

    // 计算两点之间的距离
    const calculateDistance = (point1: number[], point2: number[]) => {
        const [lng1, lat1] = point1;
        const [lng2, lat2] = point2;
        return Math.sqrt(Math.pow(lng2 - lng1, 2) + Math.pow(lat2 - lat1, 2));
    };

    // 重置动画
    const handleReset = () => {
        setCurrentPointIndex(0);
        setIsPlaying(false);
        setCurrentTime(dayjs(trajectoryPoints[0].timestamp).format('YYYY-MM-DD HH:mm:ss'));
    };

    // 播放/暂停动画
    const togglePlay = () => {
        if (!isPlaying && currentPointIndex === trajectoryPoints.length - 1) {
            handleReset();
        }
        setIsPlaying(!isPlaying);
    };

    // 获取当前显示的轨迹点
    const getCurrentTrajectory = () => {
        const trajectory = trajectoryPoints.slice(0, currentPointIndex + 1);
        return [trajectory.map(point => ({
            lng: point.coordinates[0],
            lat: point.coordinates[1],
            timestamp: point.timestamp,
            location: point.location,
            duration: point.duration
        }))];
    };

    // 处理游客类型改变
    const handleTouristTypeChange = (value) => {
        setSelectedTouristType(value);
        handleReset();
    };

    return (
        <PageContainer>
            <PageTitle>游客轨迹建模与AI分析</PageTitle>

            <ContentLayout>
                <MapSection>
                    <Card
                        title={
                            <CardTitle>
                                <span>轨迹展示</span>
                                <Select
                                    value={selectedTouristType}
                                    onChange={handleTouristTypeChange}
                                    style={{ width: 200 }}
                                >
                                    {Object.keys(touristTrajectories).map(type => (
                                        <Option key={type} value={type}>
                                            {touristTrajectories[type].type}
                                        </Option>
                                    ))}
                                </Select>
                            </CardTitle>
                        }
                        bodyStyle={{ padding: 0, height: 'calc(100% - 57px)' }} // 减去卡片标题的高度
                    >
                        <MapContainer>
                            {isLoading && (
                                <LoadingOverlay>
                                    <Spin size="large" tip="正在加载轨迹数据..." />
                                </LoadingOverlay>
                            )}
                            
                            <TimeDisplay>
                                {currentTime || dayjs(trajectoryPoints[0].timestamp).format('YYYY-MM-DD HH:mm:ss')}
                            </TimeDisplay>

                            <MapComponent
                                trajectories={getCurrentTrajectory()}
                            />

                            <MapLegend>
                                <h4>图例说明</h4>
                                <LegendItem color="#1890ff">历史轨迹</LegendItem>
                                <LegendItem color="#f5222d">当前位置</LegendItem>
                                <LegendItem color="#52c41a">景点位置</LegendItem>
                            </MapLegend>

                            <ControlPanel>
                                <Button
                                    type="primary"
                                    onClick={togglePlay}
                                    icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
                                >
                                    {isPlaying ? '暂停' : '播放'}
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    icon={<ReloadOutlined />}
                                >
                                    重置
                                </Button>
                            </ControlPanel>
                        </MapContainer>
                    </Card>
                </MapSection>

                <ChatSection style={{ flex: 4, height: '100%' }} /> {/* 调整聊天区域比例 */}
            </ContentLayout>
        </PageContainer>
    );
};

export default ModelingPage;
