import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import './KnowledgeBase.css';

// Import components
import OverviewPanel from '../components/knowledge/OverviewPanel';
import DataSourcesPanel from '../components/knowledge/DataSourcesPanel';
import TouristProfilesPanel from '../components/knowledge/TouristProfilesPanel';
import AnnouncementsPanel from '../components/knowledge/AnnouncementsPanel';
import SpatioTemporalPanel from '../components/knowledge/SpatioTemporalPanel';
import QueryPanel from '../components/knowledge/QueryPanel';

const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: 24px;
  color: #1890ff;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
`;

const Sidebar = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MainContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const KnowledgeBase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('all');
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <Container>
      <header className="knowledge-base-header">
        <Title>{t('knowledgeBase.title')}</Title>
        
        {/* <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder={t('knowledgeBase.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">{t('knowledgeBase.searchButton')}</button>
        </form>

        <div className="quick-links">
          <a href="#data-sources">{t('knowledgeBase.dataSources')}</a>
          <a href="#announcements">{t('knowledgeBase.announcements')}</a>
          <a href="#faq">{t('knowledgeBase.faq')}</a>
        </div> */}
      </header>

      <motion.div 
        className="panels-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <OverviewPanel />
        <DataSourcesPanel />
      </motion.div>

      <motion.div 
        className="panels-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TouristProfilesPanel />
        <AnnouncementsPanel />
      </motion.div>

      <motion.div 
        className="panels-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SpatioTemporalPanel />
        <QueryPanel />
      </motion.div>
    </Container>
  );
};

export default KnowledgeBase;