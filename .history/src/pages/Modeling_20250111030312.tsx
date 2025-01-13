import React, { useState, useEffect } from 'react';
import MapComponent from '../components/Map/modelMapComponent';
import { touristTrajectories, getTrajectoryForMap } from '../data/sampleTrajectory';
import { Input, Button, Select, Card } from 'antd';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { PauseOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

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

const SelectWrapper = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const ContentLayout = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 1200px) {
    flex-direction: column; // 在较小屏幕上垂直排列
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 500px; // 确保地图有固定高度
  position: relative;
`;

const MapSection = styled.div`
  flex: 3;
  min-height: 600px;
  position: relative;
`;

const ChatSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  min-width: 300px; // 确保聊天区域不会太窄
`;

const ChatHistory = styled.div`
  height: 500px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
`;

const ChatMessage = styled.div`
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
  
  &.user {
    background-color: #e6f7ff;
    margin-left: 20%;
  }
  
  &.ai {
    background-color: #f5f5f5;
    margin-right: 20%;
  }
`;

const ChatInput = styled.div`
  display: flex;
  gap: 10px;
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

const ModelingPage = () => {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedTouristType, setSelectedTouristType] = useState('family');
    const [currentPointIndex, setCurrentPointIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    
    const trajectoryPoints = touristTrajectories[selectedTouristType].trajectoryPoints;
    
    // 处理轨迹动画
    useEffect(() => {
        let timer;
        if (isPlaying && currentPointIndex < trajectoryPoints.length) {
            timer = setInterval(() => {
                setCurrentPointIndex(prev => {
                    if (prev < trajectoryPoints.length - 1) {
                        const nextPoint = trajectoryPoints[prev + 1];
                        setCurrentTime(dayjs(nextPoint.timestamp).format('YYYY-MM-DD HH:mm:ss'));
                        return prev + 1;
                    } else {
                        setIsPlaying(false);
                        return prev;
                    }
                });
            }, 2000); // 每2秒显示下一个点
        }
        return () => clearInterval(timer);
    }, [isPlaying, currentPointIndex, trajectoryPoints]);

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
        return getTrajectoryForMap(selectedTouristType).map(trajectory => 
            trajectory.slice(0, currentPointIndex + 1)
        );
    };

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSend = () => {
        if (!userInput.trim()) return;
        
        // 添加用户消息
        const newMessage = {
            type: 'user',
            content: userInput
        };
        
        // 这里可以添加AI响应的逻辑
        const aiResponse = {
            type: 'ai',
            content: '这是AI的示例回复。实际使用时请替换为真实的AI响应。'
        };
        
        setChatHistory([...chatHistory, newMessage, aiResponse]);
        setUserInput('');
    };

    // 处理游客类型改变
    const handleTouristTypeChange = (value) => {
        setSelectedTouristType(value);
        handleReset();
    };

    return (
        <PageContainer>
            <PageTitle>游客轨迹建模与AI分析</PageTitle>
            
            <SelectWrapper>
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
            </SelectWrapper>

            <ContentLayout>
                <MapSection>
                    <Card 
                        title="轨迹展示"
                        bodyStyle={{ padding: 0, height: '500px' }}
                    >
                        <MapContainer>
                            <TimeDisplay>
                                {currentTime || dayjs(trajectoryPoints[0].timestamp).format('YYYY-MM-DD HH:mm:ss')}
                            </TimeDisplay>
                            
                            <MapComponent 
                                trajectories={getCurrentTrajectory()} 
                            />
                            
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

                <ChatSection>
                    <Card title="AI 助手">
                        <ChatHistory>
                            {chatHistory.map((msg, index) => (
                                <ChatMessage 
                                    key={index} 
                                    className={msg.type}
                                >
                                    {msg.content}
                                </ChatMessage>
                            ))}
                        </ChatHistory>
                        
                        <ChatInput>
                            <TextArea 
                                value={userInput}
                                onChange={handleInputChange}
                                placeholder="请输入您的问题..."
                                autoSize={{ minRows: 2, maxRows: 4 }}
                                onPressEnter={(e) => {
                                    if (!e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                            <Button 
                                type="primary" 
                                onClick={handleSend}
                            >
                                发送
                            </Button>
                        </ChatInput>
                    </Card>
                </ChatSection>
            </ContentLayout>
        </PageContainer>
    );
};

export default ModelingPage;

