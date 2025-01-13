import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// 设置 Mapbox token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface MapComponentProps {
  trajectories: Array<{
    points: Array<[number, number]>;
    timestamp: number;
    id?: string;
    touristType?: string;
  }>;
  onPointClick: (point: any) => void;
  showHeatmap: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  trajectories,
  onPointClick,
  showHeatmap 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // 初始化地图
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [118.0686, 24.4432], // 注意：这里是 [经度, 纬度]
        zoom: 15,
        minZoom: 13,
        maxZoom: 18
      });

      map.current = mapInstance;

      // 等待地图加载完成
      mapInstance.on('load', () => {
        console.log('Map loaded successfully');
        
        // 添加轨迹数据源
        mapInstance.addSource('trajectories', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: trajectories.map(traj => ({
              type: 'Feature',
              properties: {
                id: traj.id,
                touristType: traj.touristType
              },
              geometry: {
                type: 'LineString',
                coordinates: traj.points.map(point => [point[1], point[0]]) // 转换为 [经度, 纬度]
              }
            }))
          }
        });

        // 添加轨迹图层
        mapInstance.addLayer({
          id: 'trajectories-line',
          type: 'line',
          source: 'trajectories',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#FF4B4B',
            'line-width': 3,
            'line-opacity': 0.8
          }
        });

        // 添加点图层
        mapInstance.addLayer({
          id: 'trajectories-points',
          type: 'circle',
          source: 'trajectories',
          paint: {
            'circle-radius': 5,
            'circle-color': '#FF4B4B',
            'circle-opacity': 0.7
          }
        });
      });

      return () => {
        mapInstance.remove();
      };
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  }, []);

  // 更新轨迹数据
  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance || !mapInstance.isStyleLoaded()) return;

    try {
      const source = mapInstance.getSource('trajectories');
      if (source && 'setData' in source) {
        source.setData({
          type: 'FeatureCollection',
          features: trajectories.map(traj => ({
            type: 'Feature',
            properties: {
              id: traj.id,
              touristType: traj.touristType
            },
            geometry: {
              type: 'LineString',
              coordinates: traj.points.map(point => [point[1], point[0]]) // 转换为 [经度, 纬度]
            }
          }))
        });
      }
    } catch (error) {
      console.error('Error updating trajectories:', error);
    }
  }, [trajectories]);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%', 
        height: '500px',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative'
      }} 
    />
  );
};

export default MapComponent;
