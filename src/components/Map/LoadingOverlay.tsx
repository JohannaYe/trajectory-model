import React from 'react';
import styled from '@emotion/styled';
import { Spin } from 'antd';

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingOverlay: React.FC = () => (
  <OverlayContainer>
    <Spin size="large" tip="Loading map..." />
  </OverlayContainer>
);

export default LoadingOverlay;
