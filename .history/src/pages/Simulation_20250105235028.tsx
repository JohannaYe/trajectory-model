import React from 'react';
import styled from '@emotion/styled';

const SimulationContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ControlPanel = styled.div`
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

function Simulation() {
  return (
    <SimulationContainer>
      <h1>轨迹模拟</h1>
      <ControlPanel>
        <h2>控制面板</h2>
        {/* 后续添加控制选项 */}
      </ControlPanel>
      <div>
        <h2>主要可视化区域</h2>
        {/* 后续添加热力图 */}
      </div>
    </SimulationContainer>
  );
}

export default Simulation; 