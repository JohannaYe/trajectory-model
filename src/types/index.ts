export interface TouristProfile {
  id: string;
  type: 'solo' | 'family' | 'group';
  preferences: string[];
}

export interface TrajectoryPoint {
  lat: number;
  lng: number;
  timestamp: number;
  locationId: string;
}

export interface SimulationConfig {
  touristCount: number;
  weatherCondition: string;
  timeOfDay: string;
  duration: number;
}

export interface EvaluationMetrics {
  diversity: number;
  realism: number;
  consistency: number;
} 