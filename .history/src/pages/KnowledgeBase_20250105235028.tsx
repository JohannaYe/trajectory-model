import React from 'react';
import styled from '@emotion/styled';

const KnowledgeBaseContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const EventFeed = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

function KnowledgeBase() {
  return (
    <KnowledgeBaseContainer>
      <h1>知识库</h1>
      <EventFeed>
        <h2>实时动态</h2>
        {/* 后续添加实时信息流 */}
      </EventFeed>
      <div>
        <h2>交互地图</h2>
        {/* 后续添加可点击地图 */}
      </div>
    </KnowledgeBaseContainer>
  );
}

export default KnowledgeBase; 