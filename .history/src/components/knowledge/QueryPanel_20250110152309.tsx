import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import './styles/QueryPanel.css';

interface QueryResult {
  type: 'table' | 'chart';
  data: any;
}

const Panel = styled(motion.div)`
  margin-bottom: 24px;
`;

const SearchInput = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 16px;
  
  &:focus {
    outline: none;
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const FilterSection = styled.div`
  margin-bottom: 16px;
`;

const FilterTitle = styled.h3`
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
`;

const QueryPanel: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QueryResult | null>(null);

  const handleQuery = () => {
    // This will be implemented to handle actual queries
    console.log('Query submitted:', query);
  };

  return (
    <Panel 
      className="query-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>{t('鼓浪屿知识库检索')}</h2>
      
      <div className="query-input">
        <div className="natural-language">
          <SearchInput 
            placeholder={t('请输入查询内容')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleQuery}>{t('发送')}</button>
        </div>
        
        <div className="advanced-filters">
          <FilterTitle>{t('高级过滤')}</FilterTitle>
          <div className="filter-group">
            <label>{t('时间范围')}</label>
            <select>
              <option value="today">{t('今天')}</option>
              <option value="week">{t('本周')}</option>
              <option value="month">{t('本月')}</option>
              <option value="custom">{t('自定义范围')}</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>{t('地点')}</label>
            <select>
              <option value="all">{t('所有地点')}</option>
              <option value="sunlight-rock">{t('日光岩')}</option>
              <option value="piano-museum">{t('钢琴博物馆')}</option>
              <option value="beach">{t('鼓浪屿海滩')}</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>{t('游客类型')}</label>
            <select>
              <option value="all">{t('所有游客')}</option>
              <option value="family">{t('家庭游客')}</option>
              <option value="solo">{t('个人游客')}</option>
              <option value="tour">{t('团体游客')}</option>
            </select>
          </div>
        </div>
      </div>
      
      {results && (
        <div className="results-display">
          <div className="results-header">
            <h3>{t('查询结果')}</h3>
            <button>{t('导出结果')}</button>
          </div>
          
          <div className="results-content">
            {results.type === 'table' ? (
              <div className="table-view">
                <div className="placeholder">{t('表格加载中...')}</div>
              </div>
            ) : (
              <div className="chart-view">
                <div className="placeholder">{t('图表加载中...')}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
};

export default QueryPanel;
