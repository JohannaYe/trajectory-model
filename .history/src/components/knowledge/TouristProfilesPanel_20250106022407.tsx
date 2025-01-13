import React from 'react';
import { motion } from 'framer-motion';
import './styles/TouristProfilesPanel.css';

interface TouristProfile {
  id: string;
  ageGroup: string;
  travelPurpose: string;
  mostVisitedSpots: string[];
  visitFrequency: string;
}

const TouristProfilesPanel: React.FC = () => {
  const sampleProfiles: TouristProfile[] = [
    {
      id: "FAM001",
      ageGroup: "30-40",
      travelPurpose: "Family Vacation",
      mostVisitedSpots: ["Sunlight Rock", "Piano Museum", "Beach"],
      visitFrequency: "First Time"
    },
    {
      id: "SOLO001",
      ageGroup: "20-30",
      travelPurpose: "Solo Travel",
      mostVisitedSpots: ["Shuzhuang Garden", "Coffee Shops", "Historical Sites"],
      visitFrequency: "Regular"
    }
  ];

  return (
    <motion.div 
      className="tourist-profiles-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Tourist Profiles</h2>
      
      <div className="search-filters">
        <input type="text" placeholder="Search profiles..." />
        <select>
          <option value="">Age Group</option>
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-50">36-50</option>
          <option value="50+">50+</option>
        </select>
        <select>
          <option value="">Visit Frequency</option>
          <option value="first">First Time</option>
          <option value="occasional">Occasional</option>
          <option value="regular">Regular</option>
        </select>
      </div>
      
      <div className="profile-cards">
        {sampleProfiles.map(profile => (
          <motion.div 
            key={profile.id}
            className="profile-card"
            whileHover={{ scale: 1.02 }}
          >
            <h3>{profile.travelPurpose}</h3>
            <p>
              <span>Age Group</span>
              <span>{profile.ageGroup}</span>
            </p>
            <p>
              <span>Visit Frequency</span>
              <span>{profile.visitFrequency}</span>
            </p>
            <div className="visited-spots">
              <h4>Most Visited Spots</h4>
              <ul>
                {profile.mostVisitedSpots.map((spot, index) => (
                  <li key={index}>{spot}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TouristProfilesPanel;
