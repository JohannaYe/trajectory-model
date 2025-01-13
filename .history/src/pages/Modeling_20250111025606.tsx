import React, { useState } from 'react';
import MapComponent from '../components/Map/modelMapComponent';
import { touristTrajectories, getTrajectoryForMap } from '../data/sampleTrajectory';
import { Input, Button, Select } from 'antd';

const { Option } = Select;

const ModelingPage = () => {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedTouristType, setSelectedTouristType] = useState('family');

    // 获取选中类型的轨迹数据
    const trajectoryData = getTrajectoryForMap(selectedTouristType);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSend = () => {
        setChatHistory([...chatHistory, userInput]);
        setUserInput('');
    };

    const handleTouristTypeChange = (value) => {
        setSelectedTouristType(value);
    };

    return (
        <div>
            <h1>游客轨迹建模</h1>
            
            {/* 添加游客类型选择器 */}
            <Select 
                value={selectedTouristType}
                onChange={handleTouristTypeChange}
                style={{ width: 200, marginBottom: 16 }}
            >
                {Object.keys(touristTrajectories).map(type => (
                    <Option key={type} value={type}>
                        {touristTrajectories[type].type}
                    </Option>
                ))}
            </Select>

            {/* 传递正确格式的轨迹数据 */}
            <MapComponent trajectories={trajectoryData} />
            
            <div>
                <Input 
                    value={userInput} 
                    onChange={handleInputChange} 
                    placeholder="输入你的消息" 
                />
                <Button onClick={handleSend}>发送</Button>
            </div>
            <div>
                {chatHistory.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
        </div>
    );
};

export default ModelingPage;

