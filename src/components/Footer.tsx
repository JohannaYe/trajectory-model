import React from 'react';
import styled from '@emotion/styled';

const FooterContainer = styled.footer`
  background-color: #f0f2f5;
  padding: 1rem 2rem;
  text-align: center;
`;

function Footer() {
  return (
    <FooterContainer>
      <p>© 2024 鼓浪屿游客轨迹分析系统</p>
    </FooterContainer>
  );
}

export default Footer; 