interface Point {
    lat: number;
    lng: number;
    timestamp: number;
    locationName?: string;
  }
  
  interface Trajectory {
    id: string;
    touristType: '个人游客' | '团队游客' | '亲子游客';
    points: Point[];
  }
  
  // 鼓浪屿主要景点坐标
  const LANDMARKS = {
    日光岩: { lat: 24.4478, lng: 118.0670, weight: 1 },
    菽庄花园: { lat: 24.4466, lng: 118.0644, weight: 0.9 },
    皓月园: { lat: 24.4482, lng: 118.0653, weight: 0.7 },
    龙头路: { lat: 24.4432, lng: 118.0686, weight: 1 },
    三一堂: { lat: 24.4447, lng: 118.0670, weight: 0.8 },
    钢琴博物馆: { lat: 24.4456, lng: 118.0665, weight: 0.8 },
    鼓浪屿码头: { lat: 24.4426, lng: 118.0704, weight: 1 },
    内厝澳码头: { lat: 24.4495, lng: 118.0634, weight: 0.7 },
    八卦楼: { lat: 24.4453, lng: 118.0662, weight: 0.6 },
    海底世界: { lat: 24.4421, lng: 118.0695, weight: 0.7 }
  };
  
  // 不同时段的游客密度权重
  const TIME_WEIGHTS = {
    '9': 0.6,   // 早上9点
    '10': 0.8,
    '11': 1,
    '12': 0.7,  // 午饭时间
    '13': 0.6,
    '14': 0.9,
    '15': 1,
    '16': 0.8,
    '17': 0.5,  // 傍晚
    '18': 0.3
  };
  
  interface GenerationParams {
    temperature?: number;
    specialEvent?: {
      type: string;
      location: { lat: number; lng: number };
      radius: number;
    };
    scenario?: string;
  }
  
  // 修改生成轨迹点的函数
  const generateLandmarkBasedPoints = (
    startTime: number, 
    params: GenerationParams = {}
  ): Point[] => {
    const points: Point[] = [];
    let currentTime = startTime;
    const { temperature = 1, specialEvent, scenario } = params;
    
    // 基础随机因子，受温度影响
    const randomFactor = 0.0005 * temperature;
    
    // 从码头开始
    const startPoint = {
      ...LANDMARKS['鼓浪屿码头'],
      timestamp: currentTime,
      locationName: '鼓浪屿码头'
    };
    points.push(startPoint);
  
    // 根据场景调整景点选择权重
    const getLandmarkWeight = (landmarkName: string): number => {
      const baseLandmark = LANDMARKS[landmarkName as keyof typeof LANDMARKS];
      let weight = baseLandmark.weight;
  
      // 场景影响
      if (scenario === 'rainy') {
        // 室内景点权重提高
        if (['钢琴博物馆', '海底世界'].includes(landmarkName)) {
          weight *= 1.5;
        }
      }
  
      // 特殊事件影响
      if (specialEvent) {
        const distance = Math.sqrt(
          Math.pow(baseLandmark.lat - specialEvent.location.lat, 2) +
          Math.pow(baseLandmark.lng - specialEvent.location.lng, 2)
        );
        
        if (distance < specialEvent.radius) {
          weight *= 2; // 特殊事件地点权重提高
        }
      }
  
      return weight;
    };
  
    // 基于权重选择景点
    const selectLandmarkWithWeight = (excludeList: string[]): string => {
      const availableLandmarks = Object.keys(LANDMARKS).filter(
        name => !excludeList.includes(name)
      );
      
      const weights = availableLandmarks.map(name => getLandmarkWeight(name));
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      
      let random = Math.random() * totalWeight;
      for (let i = 0; i < availableLandmarks.length; i++) {
        random -= weights[i];
        if (random <= 0) {
          return availableLandmarks[i];
        }
      }
      return availableLandmarks[0];
    };
  
    // 选择4-6个景点
    const selectedLandmarks = ['鼓浪屿码头'];
    const numLandmarks = 4 + Math.floor(Math.random() * 3);
  
    while (selectedLandmarks.length < numLandmarks) {
      const landmark = selectLandmarkWithWeight(selectedLandmarks);
      selectedLandmarks.push(landmark);
    }
  
    // 在每个景点之间生成过渡点
    for (let i = 1; i < selectedLandmarks.length; i++) {
      const prevLandmark = LANDMARKS[selectedLandmarks[i-1] as keyof typeof LANDMARKS];
      const nextLandmark = LANDMARKS[selectedLandmarks[i] as keyof typeof LANDMARKS];
      
      // 生成2-3个过渡点，数量受温度影响
      const transitionPoints = 2 + Math.floor(Math.random() * (1 + temperature));
      
      for (let j = 0; j < transitionPoints; j++) {
        currentTime += 15 * 60 * 1000; // 15分钟间隔
        const progress = (j + 1) / (transitionPoints + 1);
        
        // 随机偏移受温度影响
        const offset = randomFactor * (Math.random() - 0.5);
        
        // 特殊事件影响路径选择
        let adjustedLat = prevLandmark.lat + (nextLandmark.lat - prevLandmark.lat) * progress;
        let adjustedLng = prevLandmark.lng + (nextLandmark.lng - prevLandmark.lng) * progress;
        
        if (specialEvent) {
          const distanceToEvent = Math.sqrt(
            Math.pow(adjustedLat - specialEvent.location.lat, 2) +
            Math.pow(adjustedLng - specialEvent.location.lng, 2)
          );
          
          if (distanceToEvent < specialEvent.radius) {
            // 在特殊事件区域内增加随机性
            adjustedLat += offset * 2;
            adjustedLng += offset * 2;
          }
        }
        
        points.push({
          lat: adjustedLat + offset,
          lng: adjustedLng + offset,
          timestamp: currentTime
        });
      }
  
      // 添加景点位置
      currentTime += 15 * 60 * 1000;
      points.push({
        ...nextLandmark,
        timestamp: currentTime,
        locationName: selectedLandmarks[i]
      });
    }
  
    return points;
  };
  
  // 修改生成轨迹的函数
  const generateDayTrajectories = (
    count: number, 
    isGenerated: boolean = false,
    params: GenerationParams = {}
  ): Trajectory[] => {
    const trajectories: Trajectory[] = [];
    const touristTypes: Trajectory['touristType'][] = ['个人游客', '团队游客', '亲子游客'];
  
    for (let i = 0; i < count; i++) {
      const startHour = 9 + Math.floor(Math.random() * 6);
      const startTime = new Date().setHours(startHour, 0, 0);
      const touristType = touristTypes[Math.floor(Math.random() * touristTypes.length)];
      
      trajectories.push({
        id: `${isGenerated ? 'generated' : 'real'}-${i + 1}`,
        touristType,
        points: generateLandmarkBasedPoints(startTime, params)
      });
    }
  
    return trajectories;
  };
  
  // 导出真实和生成的轨迹数据
  export const realTrajectories = generateDayTrajectories(100, false);
  export const generatedTrajectories = generateDayTrajectories(100, true);