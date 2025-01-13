import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// 设置 Mapbox token - 确保这是一个有效的token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'your_default_token';

// 禁用 Mapbox 的遥测功能
(mapboxgl as any).baseApiUrl = '';
(mapboxgl as any).workerUrl = '';
(mapboxgl as any).prewarm = () => {};

// 定义更明确的类型
interface Point {
  lat: number;
  lng: number;
  timestamp?: number;
  locationName?: string;
}

interface Trajectory {
  id: string;
  points: Point[];
  touristType?: string;
}

interface MapComponentProps {
  trajectories: Array<{
    points: Array<[number, number]>;
    timestamp: number;
    id?: string;
    touristType?: string;
  }>;
  onPointClick: (point: Point) => void;
  showHeatmap: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  trajectories,
  onPointClick,
  showHeatmap 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // 添加数据验证和转换
  const convertedTrajectories = React.useMemo(() => {
    if (!trajectories || !Array.isArray(trajectories)) return [];
    
    return trajectories
      .filter(traj => traj && Array.isArray(traj.points) && traj.points.length > 0)
      .map((traj, index) => ({
        id: traj.id || `trajectory-${index}`,
        points: traj.points.map(point => {
          if (!Array.isArray(point)) {
            return { lat: 0, lng: 0 }; // 默认值
          }
          return {
            lat: typeof point[0] === 'number' ? point[0] : 0,
            lng: typeof point[1] === 'number' ? point[1] : 0
          };
        }),
        timestamp: traj.timestamp,
        touristType: traj.touristType
      }))
      .filter(traj => traj.points.some(p => p.lat !== 0 || p.lng !== 0)); // 过滤掉无效的轨迹
  }, [trajectories]);

  // 更新轨迹的函数
  const updateTrajectories = (mapInstance: mapboxgl.Map) => {
    try {
      // 清除现有图层
      if (mapInstance.getLayer('trajectory-layer')) {
        mapInstance.removeLayer('trajectory-layer');
      }
      if (mapInstance.getSource('trajectory-source')) {
        mapInstance.removeSource('trajectory-source');
      }

      // 验证数据
      if (!convertedTrajectories.length) {
        console.warn('No valid trajectories to display');
        return;
      }

      // 添加新的轨迹图层
      mapInstance.addSource('trajectory-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: convertedTrajectories.map(traj => ({
            type: 'Feature',
            properties: {
              id: traj.id,
              touristType: traj.touristType
            },
            geometry: {
              type: 'LineString',
              coordinates: traj.points
                .filter(point => point && typeof point.lng === 'number' && typeof point.lat === 'number')
                .map(point => [point.lng, point.lat])
            }
          }))
        }
      });

      mapInstance.addLayer({
        id: 'trajectory-layer',
        type: 'line',
        source: 'trajectory-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ff0000',
          'line-width': 2
        }
      });
    } catch (error) {
      console.error('Error updating trajectories:', error);
    }
  };

  // 初始化地图
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      // 使用标准的 Mapbox 样式 URL
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [
                `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxgl.accessToken}`
              ],
              tileSize: 256
            }
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
        center: [118.0686, 24.4432],
        zoom: 15,
        minZoom: 14,
        maxZoom: 18,
        dragRotate: false, // 禁用旋转以简化交互
        pitchWithRotate: false
      });

      // 等待地图加载完成
      mapInstance.on('load', () => {
        console.log('Map loaded successfully');
        
        // 添加导航控件
        mapInstance.addControl(
          new mapboxgl.NavigationControl({
            showCompass: false,
            showZoom: true,
            visualizePitch: false
          }),
          'top-right'
        );

        // 初始加载轨迹
        if (convertedTrajectories.length > 0) {
          updateTrajectories(mapInstance);
        }
      });

      // 添加错误处理
      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

      map.current = mapInstance;

      return () => {
        mapInstance.remove();
      };
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  }, []);

  // 处理轨迹数据更新
  useEffect(() => {
    if (!map.current) return;
    const mapInstance = map.current;

    if (!mapInstance.isStyleLoaded()) {
      mapInstance.once('style.load', () => {
        updateTrajectories(mapInstance);
      });
      return;
    }

    updateTrajectories(mapInstance);
  }, [convertedTrajectories]);

  return (
    <div 
      ref={mapContainer} 
      className="map-container" 
      style={{ height: '500px', width: '100%' }} 
    />
  );
};

export default MapComponent;
