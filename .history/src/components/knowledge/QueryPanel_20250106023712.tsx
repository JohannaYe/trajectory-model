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
      <h2>{t('knowledgeBase.queryAndRetrieval')}</h2>
      
      <div className="query-input">
        <div className="natural-language">
          <SearchInput 
            placeholder={t('knowledgeBase.queryPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleQuery}>{t('knowledgeBase.submitQuery')}</button>
        </div>
        
        <div className="advanced-filters">
          <FilterTitle>{t('knowledgeBase.advancedFilters')}</FilterTitle>
          <div className="filter-group">
            <label>{t('knowledgeBase.timePeriod')}</label>
            <select>
              <option value="today">{t('knowledgeBase.today')}</option>
              <option value="week">{t('knowledgeBase.thisWeek')}</option>
              <option value="month">{t('knowledgeBase.thisMonth')}</option>
              <option value="custom">{t('knowledgeBase.customRange')}</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>{t('knowledgeBase.location')}</label>
            <select>
              <option value="all">{t('knowledgeBase.allLocations')}</option>
              <option value="sunlight-rock">{t('knowledgeBase.sunlightRock')}</option>
              <option value="piano-museum">{t('knowledgeBase.pianoMuseum')}</option>
              <option value="beach">{t('knowledgeBase.beachArea')}</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>{t('knowledgeBase.visitorType')}</label>
            <select>
              <option value="all">{t('knowledgeBase.allVisitors')}</option>
              <option value="family">{t('knowledgeBase.familyGroups')}</option>
              <option value="solo">{t('knowledgeBase.soloTravelers')}</option>
              <option value="tour">{t('knowledgeBase.tourGroups')}</option>
            </select>
          </div>
        </div>
      </div>
      
      {results && (
        <div className="results-display">
          <div className="results-header">
            <h3>{t('knowledgeBase.queryResults')}</h3>
            <button>{t('knowledgeBase.exportResults')}</button>
          </div>
          
          <div className="results-content">
            {results.type === 'table' ? (
              <div className="table-view">
                <div className="placeholder">{t('knowledgeBase.tableViewLoading')}</div>
              </div>
            ) : (
              <div className="chart-view">
                <div className="placeholder">{t('knowledgeBase.chartViewLoading')}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
};

export default QueryPanel;
