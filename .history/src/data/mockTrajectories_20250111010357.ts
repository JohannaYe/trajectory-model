// Seasonal variations
const seasons = {
  spring: {
    dayStart: 7,
    dayEnd: 18,
    peakHours: { start: 10, end: 16 },
    temperature: { min: 15, max: 25 },
    rainfall: 0.3,
    popularity: {
      indoor: 0.7,
      outdoor: 0.8,
      beach: 0.6,
    },
  },
  summer: {
    dayStart: 6,
    dayEnd: 19,
    peakHours: { start: 9, end: 17 },
    temperature: { min: 25, max: 35 },
    rainfall: 0.4,
    popularity: {
      indoor: 0.9,
      outdoor: 0.6,
      beach: 1.0,
    },
  },
  autumn: {
    dayStart: 7,
    dayEnd: 18,
    peakHours: { start: 10, end: 16 },
    temperature: { min: 20, max: 28 },
    rainfall: 0.2,
    popularity: {
      indoor: 0.7,
      outdoor: 0.9,
      beach: 0.7,
    },
  },
  winter: {
    dayStart: 8,
    dayEnd: 17,
    peakHours: { start: 11, end: 15 },
    temperature: { min: 10, max: 20 },
    rainfall: 0.1,
    popularity: {
      indoor: 1.0,
      outdoor: 0.5,
      beach: 0.3,
    },
  },
};

// Key attractions in Gulangyu Island with seasonal attributes
const attractions = {
  sunlightRock: {
    lng: 118.0670,
    lat: 24.4478,
    name: 'Sunlight Rock',
    type: 'outdoor',
    seasonality: {
      spring: { morning: 0.8, afternoon: 0.9, evening: 0.7 },
      summer: { morning: 0.9, afternoon: 0.6, evening: 0.8 },
      autumn: { morning: 0.8, afternoon: 0.9, evening: 0.7 },
      winter: { morning: 0.7, afternoon: 0.8, evening: 0.5 },
    },
  },
  pianoMuseum: {
    lng: 118.0645,
    lat: 24.4465,
    name: 'Piano Museum',
    type: 'indoor',
    seasonality: {
      spring: { morning: 0.7, afternoon: 0.8, evening: 0.6 },
      summer: { morning: 0.8, afternoon: 0.9, evening: 0.7 },
      autumn: { morning: 0.7, afternoon: 0.8, evening: 0.6 },
      winter: { morning: 0.9, afternoon: 0.9, evening: 0.8 },
    },
  },
  shuzhuangGarden: {
    lng: 118.0685,
    lat: 24.4445,
    name: 'Shuzhuang Garden',
    type: 'outdoor',
    seasonality: {
      spring: { morning: 0.9, afternoon: 0.8, evening: 0.7 },
      summer: { morning: 0.8, afternoon: 0.6, evening: 0.7 },
      autumn: { morning: 0.9, afternoon: 0.8, evening: 0.7 },
      winter: { morning: 0.6, afternoon: 0.7, evening: 0.5 },
    },
  },
  zhengchenggong: {
    lng: 118.0632,
    lat: 24.4482,
    name: 'Zheng Chenggong Memorial Hall',
    type: 'indoor',
    seasonality: {
      spring: { morning: 0.7, afternoon: 0.8, evening: 0.6 },
      summer: { morning: 0.8, afternoon: 0.9, evening: 0.7 },
      autumn: { morning: 0.7, afternoon: 0.8, evening: 0.6 },
      winter: { morning: 0.8, afternoon: 0.9, evening: 0.7 },
    },
  },
  huaweiVilla: {
    lng: 118.0658,
    lat: 24.4458,
    name: 'Huawei Villa',
    type: 'indoor',
    seasonality: {
      spring: { morning: 0.7, afternoon: 0.8, evening: 0.6 },
      summer: { morning: 0.8, afternoon: 0.9, evening: 0.7 },
      autumn: { morning: 0.7, afternoon: 0.8, evening: 0.6 },
      winter: { morning: 0.9, afternoon: 0.8, evening: 0.7 },
    },
  },
  ferry: {
    lng: 118.0627,
    lat: 24.4453,
    name: 'Ferry Terminal',
    type: 'indoor',
    seasonality: {
      spring: { morning: 0.9, afternoon: 0.8, evening: 0.7 },
      summer: { morning: 0.8, afternoon: 0.7, evening: 0.9 },
      autumn: { morning: 0.9, afternoon: 0.8, evening: 0.7 },
      winter: { morning: 0.7, afternoon: 0.8, evening: 0.6 },
    },
  },
  beach: {
    lng: 118.0695,
    lat: 24.4435,
    name: 'Gangzaihou Beach',
    type: 'beach',
    seasonality: {
      spring: { morning: 0.6, afternoon: 0.7, evening: 0.5 },
      summer: { morning: 0.7, afternoon: 1.0, evening: 0.8 },
      autumn: { morning: 0.6, afternoon: 0.7, evening: 0.5 },
      winter: { morning: 0.3, afternoon: 0.4, evening: 0.2 },
    },
  },
  avenuePark: {
    lng: 118.0640,
    lat: 24.4470,
    name: 'Avenue Park',
    type: 'outdoor',
    seasonality: {
      spring: { morning: 0.8, afternoon: 0.7, evening: 0.9 },
      summer: { morning: 0.7, afternoon: 0.5, evening: 0.9 },
      autumn: { morning: 0.8, afternoon: 0.7, evening: 0.9 },
      winter: { morning: 0.6, afternoon: 0.7, evening: 0.5 },
    },
  },
};

// Special events and festivals
const events = {
  lunarNewYear: {
    months: [1, 2], // Varies by lunar calendar
    duration: 7,
    popularity: {
      indoor: 1.2,
      outdoor: 1.0,
      beach: 0.4,
    },
    crowdFactor: 2.0,
    specialAttractions: ['zhengchenggong', 'shuzhuangGarden'],
  },
  summerMusicFestival: {
    months: [7, 8],
    duration: 14,
    popularity: {
      indoor: 1.5,
      outdoor: 1.2,
      beach: 1.3,
    },
    crowdFactor: 1.8,
    specialAttractions: ['pianoMuseum', 'avenuePark'],
  },
  midAutumnFestival: {
    months: [9],
    duration: 3,
    popularity: {
      indoor: 1.0,
      outdoor: 1.5,
      beach: 0.8,
    },
    crowdFactor: 1.5,
    specialAttractions: ['sunlightRock', 'shuzhuangGarden'],
  },
  nationalDay: {
    months: [10],
    duration: 7,
    popularity: {
      indoor: 1.3,
      outdoor: 1.4,
      beach: 1.0,
    },
    crowdFactor: 2.0,
    specialAttractions: ['sunlightRock', 'zhengchenggong'],
  },
  christmasNewYear: {
    months: [12, 1],
    duration: 10,
    popularity: {
      indoor: 1.4,
      outdoor: 0.8,
      beach: 0.5,
    },
    crowdFactor: 1.6,
    specialAttractions: ['pianoMuseum', 'avenuePark'],
  },
};

// Get season based on month
const getSeason = (date: Date) => {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
};

// Get time period based on hour and season
const getTimePeriod = (hour: number, season: string) => {
  const { dayStart, dayEnd } = seasons[season as keyof typeof seasons];
  const morning = { start: dayStart, end: 11 };
  const afternoon = { start: 12, end: 16 };
  const evening = { start: 17, end: dayEnd };

  if (hour >= morning.start && hour < morning.end) return 'morning';
  if (hour >= afternoon.start && hour < afternoon.end) return 'afternoon';
  if (hour >= evening.start && hour <= evening.end) return 'evening';
  return 'morning'; // default
};

// Get active events for a given date
const getActiveEvents = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return Object.entries(events).filter(([_, event]) => {
    return event.months.includes(month);
  }).map(([name, event]) => ({
    name,
    ...event
  }));
};

// Modify popularity based on active events
const getEventModifiedPopularity = (
  attraction: any,
  season: string,
  timePeriod: string,
  activeEvents: any[]
) => {
  let basePopularity = attraction.seasonality[season][timePeriod];
  
  activeEvents.forEach(event => {
    // Boost popularity if it's a special attraction for this event
    if (event.specialAttractions.includes(attraction.id)) {
      basePopularity *= 1.5;
    }
    
    // Apply general event popularity modifiers
    basePopularity *= event.popularity[attraction.type] || 1.0;
  });
  
  return Math.min(1.0, basePopularity); // Cap at 1.0
};

// Helper function to generate random trajectories with seasonal and event patterns
const generateTrajectory = (startTime: string, touristType: string) => {
  const trajectory: any[] = [];
  let currentTime = new Date(startTime);
  const season = getSeason(currentTime);
  const seasonData = seasons[season as keyof typeof seasons];
  const timePeriod = getTimePeriod(currentTime.getHours(), season);
  const activeEvents = getActiveEvents(currentTime);

  // Get sorted attractions based on seasonal and event-modified popularity
  const sortedAttractions = Object.entries(attractions)
    .map(([id, attr]) => ({
      id,
      ...attr,
      currentPopularity: getEventModifiedPopularity(
        { ...attr, id },
        season,
        timePeriod,
        activeEvents
      ) * seasonData.popularity[attr.type as keyof typeof seasonData.popularity],
    }))
    .sort((a, b) => b.currentPopularity - a.currentPopularity);

  // Different patterns based on tourist type, season, and active events
  let visitSequence: any[] = [];
  
  // Adjust visit sequence based on active events
  const eventModifiedSequence = (baseSequence: any[]) => {
    if (activeEvents.length === 0) return baseSequence;
    
    // Prioritize special event attractions
    const specialAttractions = new Set(
      activeEvents.flatMap(event => event.specialAttractions)
    );
    
    // Ensure at least one special attraction is included
    const hasSpecialAttraction = baseSequence.some(
      attr => specialAttractions.has(attr.id)
    );
    
    if (!hasSpecialAttraction && specialAttractions.size > 0) {
      // Replace a middle attraction with a special one
      const specialAttr = attractions[Array.from(specialAttractions)[0]];
      const middleIndex = Math.floor(baseSequence.length / 2);
      baseSequence[middleIndex] = specialAttr;
    }
    
    return baseSequence;
  };

  switch (touristType) {
    case 'cultural':
      if (season === 'summer') {
        visitSequence = eventModifiedSequence([
          attractions.ferry,
          attractions.pianoMuseum,
          attractions.zhengchenggong,
          attractions.huaweiVilla,
          timePeriod === 'evening' ? attractions.sunlightRock : attractions.ferry,
        ]);
      } else if (season === 'winter') {
        visitSequence = eventModifiedSequence([
          attractions.ferry,
          attractions.pianoMuseum,
          attractions.huaweiVilla,
          attractions.zhengchenggong,
          attractions.ferry,
        ]);
      } else {
        visitSequence = eventModifiedSequence([
          attractions.ferry,
          attractions.shuzhuangGarden,
          attractions.pianoMuseum,
          attractions.sunlightRock,
          attractions.ferry,
        ]);
      }
      break;

    case 'leisure':
      if (season === 'summer') {
        visitSequence = eventModifiedSequence([
          attractions.ferry,
          timePeriod === 'morning' ? attractions.beach : attractions.pianoMuseum,
          attractions.shuzhuangGarden,
          timePeriod === 'afternoon' ? attractions.pianoMuseum : attractions.beach,
          attractions.ferry,
        ]);
      } else if (season === 'winter') {
        visitSequence = eventModifiedSequence([
          attractions.ferry,
          attractions.pianoMuseum,
          attractions.huaweiVilla,
          attractions.avenuePark,
          attractions.ferry,
        ]);
      } else {
        visitSequence = eventModifiedSequence([
          attractions.ferry,
          attractions.shuzhuangGarden,
          attractions.sunlightRock,
          attractions.avenuePark,
          attractions.ferry,
        ]);
      }
      break;

    case 'quick':
      if (season === 'summer') {
        visitSequence = eventModifiedSequence([
          attractions.ferry,
          timePeriod === 'morning' ? attractions.sunlightRock : attractions.pianoMuseum,
          timePeriod === 'afternoon' ? attractions.beach : attractions.shuzhuangGarden,
          attractions.ferry,
        ]);
      } else if (season === 'winter') {
        visitSequence = eventModifiedSequence([
          attractions.ferry,
          attractions.pianoMuseum,
          attractions.huaweiVilla,
          attractions.ferry,
        ]);
      } else {
        visitSequence = eventModifiedSequence([
          attractions.ferry,
          attractions.sunlightRock,
          attractions.shuzhuangGarden,
          attractions.ferry,
        ]);
      }
      break;
  }

  // Add event-influenced variations to movement speed and stay duration
  const getStayDuration = (attraction: any, season: string, timePeriod: string) => {
    const baseTime = 30; // base time in minutes
    const seasonalPopularity = getEventModifiedPopularity(
      { ...attraction, id: attraction.id },
      season,
      timePeriod,
      activeEvents
    );
    const typePopularity = seasonData.popularity[attraction.type as keyof typeof seasonData.popularity];
    
    // Additional time during events
    const eventCrowdFactor = activeEvents.reduce(
      (factor, event) => factor * event.crowdFactor,
      1
    );
    
    const crowdFactor = Math.min(2.0, 1 + (seasonalPopularity * typePopularity * eventCrowdFactor));
    return Math.round(baseTime * crowdFactor);
  };

  // Add points with seasonal and event variations
  visitSequence.forEach((attraction, index) => {
    const randomOffset = () => (Math.random() - 0.5) * 0.0005;
    
    // Add more variation based on season, weather, and events
    const eventVariation = activeEvents.length > 0 ? 0.0003 : 0;
    const seasonalVariation = season === 'summer' ? 0.0004 : 
                            season === 'winter' ? 0.0002 : 0.0003;
    
    trajectory.push({
      lng: attraction.lng + randomOffset() * (seasonalVariation + eventVariation),
      lat: attraction.lat + randomOffset() * (seasonalVariation + eventVariation),
      timestamp: currentTime.toISOString(),
      type: index === 0 ? 'start' : index === visitSequence.length - 1 ? 'end' : 'attraction',
      name: attraction.name,
      season,
      timePeriod,
      activeEvents: activeEvents.map(e => e.name),
    });

    // Add intermediate points between attractions
    if (index < visitSequence.length - 1) {
      const nextAttraction = visitSequence[index + 1];
      // More intermediate points during events and good weather
      const eventSteps = activeEvents.length > 0 ? 1 : 0;
      const steps = (season === 'spring' || season === 'autumn' ? 4 : 3) + eventSteps;
      
      for (let i = 1; i <= steps; i++) {
        const ratio = i / (steps + 1);
        const intermediateLng = attraction.lng + (nextAttraction.lng - attraction.lng) * ratio + randomOffset();
        const intermediateLat = attraction.lat + (nextAttraction.lat - attraction.lat) * ratio + randomOffset();
        
        // Adjust movement time based on season and events
        const eventDelay = activeEvents.reduce(
          (delay, event) => delay * event.crowdFactor,
          1
        );
        const moveTime = (season === 'summer' ? 20 : 
                         season === 'winter' ? 12 : 15) * eventDelay;
        
        currentTime = new Date(currentTime.getTime() + moveTime * 60000);
        
        trajectory.push({
          lng: intermediateLng,
          lat: intermediateLat,
          timestamp: currentTime.toISOString(),
          type: 'moving',
          season,
          timePeriod,
          activeEvents: activeEvents.map(e => e.name),
        });
      }
    }
    
    const stayDuration = getStayDuration(attraction, season, timePeriod);
    currentTime = new Date(currentTime.getTime() + stayDuration * 60000);
  });

  return trajectory;
};

// Generate multiple trajectories for different seasons
const generateDailyTrajectories = (date: string, count: number) => {
  const trajectories: any[] = [];
  const touristTypes = ['cultural', 'leisure', 'quick'];
  
  // Define time slots based on season
  const currentDate = new Date(date);
  const season = getSeason(currentDate);
  const { dayStart, dayEnd, peakHours } = seasons[season as keyof typeof seasons];
  
  const timeSlots = {
    morning: Array.from({ length: 4 }, (_, i) => 
      `${String(dayStart + i).padStart(2, '0')}:30`
    ),
    afternoon: Array.from({ length: 4 }, (_, i) => 
      `${String(peakHours.start + i).padStart(2, '0')}:30`
    ),
    evening: Array.from({ length: 3 }, (_, i) => 
      `${String(dayEnd - 3 + i).padStart(2, '0')}:00`
    ),
  };

  // Adjust distribution based on season
  const distribution = {
    morning: Math.floor(count * (season === 'summer' ? 0.4 : 0.3)),
    afternoon: Math.floor(count * (season === 'winter' ? 0.4 : 0.3)),
    evening: Math.floor(count * (season === 'summer' ? 0.3 : 0.4)),
  };

  Object.entries(distribution).forEach(([period, periodCount]) => {
    const times = timeSlots[period as keyof typeof timeSlots];
    for (let i = 0; i < periodCount; i++) {
      const touristType = touristTypes[Math.floor(Math.random() * touristTypes.length)];
      const startTime = times[Math.floor(Math.random() * times.length)];
      const trajectory = generateTrajectory(`${date}T${startTime}:00`, touristType);
      trajectories.push(trajectory);
    }
  });

  return trajectories;
};
// Generate real trajectories (more structured)
export const realTrajectories = generateDailyTrajectories('2025-01-06', 30);

// Generate simulated trajectories (slightly more varied)
export const generatedTrajectories = generateDailyTrajectories('2025-01-06', 30).map(trajectory => 
  trajectory.map(point => ({
    ...point,
    lng: point.lng + (Math.random() - 0.5) * 0.0003,
    lat: point.lat + (Math.random() - 0.5) * 0.0003,
  }))
);

