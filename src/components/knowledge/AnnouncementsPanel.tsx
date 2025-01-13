import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaExclamationTriangle, FaCloudSun } from 'react-icons/fa';
import './styles/AnnouncementsPanel.css';

interface Announcement {
  id: string;
  type: 'event' | 'notice' | 'weather';
  title: string;
  content: string;
  date: string;
  urgent?: boolean;
}

const AnnouncementsPanel: React.FC = () => {
  const announcements: Announcement[] = [
    {
      id: '1',
      type: 'event',
      title: '钢琴节',
      content: '年度钢琴节，邀请国际艺术家参与',
      date: '2025-02-15',
    },
    {
      id: '2',
      type: 'notice',
      title: '维护通知',
      content: '日光岩小径因维护暂时关闭',
      date: '2025-01-10',
      urgent: true,
    },
    {
      id: '3',
      type: 'weather',
      title: '天气预警',
      content: '预计有强风，部分户外活动可能受到影响',
      date: '2025-01-07',
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <FaCalendarAlt />;
      case 'notice':
        return <FaExclamationTriangle />;
      case 'weather':
        return <FaCloudSun />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="announcements-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>景点公告</h2>
      
      <div className="announcements-container">
        {announcements.map(announcement => (
          <motion.div 
            key={announcement.id}
            className={'announcement ' + (announcement.urgent ? 'urgent' : '')}
            whileHover={{ scale: 1.02 }}
          >
            <div className="announcement-icon">
              {getIcon(announcement.type)}
            </div>
            <div className="announcement-content">
              <h3>{announcement.title}</h3>
              <p>{announcement.content}</p>
              <span className="date">{announcement.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="timeline">
        <h3>即将到来的活动</h3>
        <div className="placeholder">新活动加载中...</div>
      </div>
    </motion.div>
  );
};

export default AnnouncementsPanel;
