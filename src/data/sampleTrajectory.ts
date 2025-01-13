// 不同类型游客的轨迹数据
export const touristTrajectories = {
  family: {
    type: "家庭游客",
    description: "以家庭为单位，偏好休闲和教育景点",
    trajectoryPoints: [
      {
        id: 1,
        location: "轮渡码头",
        coordinates: [118.0704, 24.4478],
        timestamp: "2025-01-06T09:00:00",
        duration: 0,
        nextDestination: "日光岩"
      },
      {
        id: 2,
        location: "日光岩",
        coordinates: [118.0671, 24.4478],
        timestamp: "2025-01-06T09:30:00",
        duration: 60,
        nextDestination: "菽庄花园"
      },
      {
        id: 3,
        location: "菽庄花园",
        coordinates: [118.0659, 24.4456],
        timestamp: "2025-01-06T11:00:00",
        duration: 90,
        nextDestination: "钢琴博物馆"
      },
      {
        id: 4,
        location: "钢琴博物馆",
        coordinates: [118.0665, 24.4445],
        timestamp: "2025-01-06T13:00:00",
        duration: 60,
        nextDestination: "轮渡码头"
      },
      {
        id: 5,
        location: "轮渡码头",
        coordinates: [118.0704, 24.4478],
        timestamp: "2025-01-06T14:30:00",
        duration: 0,
        nextDestination: null
      }
    ]
  },
  
  youngCouple: {
    type: "年轻情侣",
    description: "偏好文艺和浪漫景点，喜欢拍照",
    trajectoryPoints: [
      {
        id: 1,
        location: "轮渡码头",
        coordinates: [118.0704, 24.4478],
        timestamp: "2025-01-06T10:00:00",
        duration: 0,
        nextDestination: "皓月园"
      },
      {
        id: 2,
        location: "皓月园",
        coordinates: [118.0683, 24.4461],
        timestamp: "2025-01-06T10:30:00",
        duration: 90,
        nextDestination: "钢琴博物馆"
      },
      {
        id: 3,
        location: "钢琴博物馆",
        coordinates: [118.0665, 24.4445],
        timestamp: "2025-01-06T12:30:00",
        duration: 120,
        nextDestination: "菽庄花园"
      },
      {
        id: 4,
        location: "菽庄花园",
        coordinates: [118.0659, 24.4456],
        timestamp: "2025-01-06T15:00:00",
        duration: 90,
        nextDestination: "轮渡码头"
      },
      {
        id: 5,
        location: "轮渡码头",
        coordinates: [118.0704, 24.4478],
        timestamp: "2025-01-06T17:00:00",
        duration: 0,
        nextDestination: null
      }
    ]
  },

  photographer: {
    type: "摄影爱好者",
    description: "注重光线和拍摄角度，停留时间较长",
    trajectoryPoints: [
      {
        id: 1,
        location: "轮渡码头",
        coordinates: [118.0704, 24.4478],
        timestamp: "2025-01-06T07:00:00",
        duration: 0,
        nextDestination: "日光岩"
      },
      {
        id: 2,
        location: "日光岩",
        coordinates: [118.0671, 24.4478],
        timestamp: "2025-01-06T07:30:00",
        duration: 120,
        nextDestination: "皓月园"
      },
      {
        id: 3,
        location: "皓月园",
        coordinates: [118.0683, 24.4461],
        timestamp: "2025-01-06T10:00:00",
        duration: 90,
        nextDestination: "菽庄花园"
      },
      {
        id: 4,
        location: "菽庄花园",
        coordinates: [118.0659, 24.4456],
        timestamp: "2025-01-06T12:00:00",
        duration: 180,
        nextDestination: "轮渡码头"
      },
      {
        id: 5,
        location: "轮渡码头",
        coordinates: [118.0704, 24.4478],
        timestamp: "2025-01-06T16:00:00",
        duration: 0,
        nextDestination: null
      }
    ]
  },

  culturalExplorer: {
    type: "文化探索者",
    description: "深度了解鼓浪屿历史文化，参观博物馆",
    trajectoryPoints: [
      {
        id: 1,
        location: "轮渡码头",
        coordinates: [118.0704, 24.4478],
        timestamp: "2025-01-06T09:00:00",
        duration: 0,
        nextDestination: "钢琴博物馆"
      },
      {
        id: 2,
        location: "钢琴博物馆",
        coordinates: [118.0665, 24.4445],
        timestamp: "2025-01-06T09:30:00",
        duration: 150,
        nextDestination: "菽庄花园"
      },
      {
        id: 3,
        location: "菽庄花园",
        coordinates: [118.0659, 24.4456],
        timestamp: "2025-01-06T12:30:00",
        duration: 120,
        nextDestination: "日光岩"
      },
      {
        id: 4,
        location: "日光岩",
        coordinates: [118.0671, 24.4478],
        timestamp: "2025-01-06T15:00:00",
        duration: 90,
        nextDestination: "轮渡码头"
      },
      {
        id: 5,
        location: "轮渡码头",
        coordinates: [118.0704, 24.4478],
        timestamp: "2025-01-06T17:00:00",
        duration: 0,
        nextDestination: null
      }
    ]
  }
};

// Helper function to convert trajectory points to map format
export const getTrajectoryForMap = (touristType: keyof typeof touristTrajectories) => {
  const trajectory = touristTrajectories[touristType].trajectoryPoints;
  return [trajectory.map(point => ({
    lng: point.coordinates[0],
    lat: point.coordinates[1],
    timestamp: point.timestamp,
    type: 'tourist',
    location: point.location,
    duration: point.duration
  }))];
};
