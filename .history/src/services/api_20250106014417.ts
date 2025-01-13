import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const trajectoryService = {
  generateTrajectory: async (config: SimulationConfig) => {
    return api.post('/trajectory/generate', config);
  },
  
  getHistoricalData: async (params: {
    startDate: string;
    endDate: string;
  }) => {
    return api.get('/trajectory/historical', { params });
  },
  
  getLocationInfo: async (locationId: string) => {
    return api.get(`/locations/${locationId}`);
  }
}; 