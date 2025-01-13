import React, { useState } from 'react';
import MapComponent from '../components/Map/modelMapComponent';
import { touristTrajectories, getTrajectoryForMap } from '../data/sampleTrajectory';
import { Input, Button, Select, Card } from 'antd';
import styled from 'styled-components';

const { Option } = Select;
const { TextArea } = Input;

// 样式组件
const PageContainer = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto; // 居中显示
  width: 100%;
`;

const ContentLayout = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 1200px) {
    flex-direction: column; // 在较小屏幕上垂直排列
  }
`;

const MapSection = styled.div`
  flex: 3;
  min-height: 600px;
  
  .ant-card {
    height: 100%;
  }
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

const ModelingPage = () => {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedTouristType, setSelectedTouristType] = useState('family');

    const trajectoryData = getTrajectoryForMap(selectedTouristType);

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

    const handleTouristTypeChange = (value) => {
        setSelectedTouristType(value);
    };

    return (
        <PageContainer>
            <h1>游客轨迹建模与AI分析</h1>
            
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

            <ContentLayout>
                <MapSection>
                    <Card title="轨迹展示">
                        <MapComponent trajectories={trajectoryData} />
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

