import React, { useState } from 'react';
import MapComponent from '../components/Map/modelMapComponent';
import { touristTrajectories } from '../data/sampleTrajectory';
import { Input, Button } from 'antd';

const ModelingPage = () => {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSend = () => {
        setChatHistory([...chatHistory, userInput]);
        setUserInput('');
    };

    return (
        <div>
            <h1>游客轨迹建模</h1>
            <MapComponent trajectories={touristTrajectories} />
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

