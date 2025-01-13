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
        style: 'mapbox://styles/mapbox/streets-v11', // 使用预定义样式
        center: [118.0686, 24.4432],
        zoom: 15
      });

      map.current = mapInstance;

      mapInstance.on('load', () => {
        // 添加轨迹数据
        if (trajectories.length > 0) {
          mapInstance.addSource('trajectories', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: trajectories.map(traj => ({
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: traj.points
                }
              }))
            }
          });

          mapInstance.addLayer({
            id: 'trajectories',
            type: 'line',
            source: 'trajectories',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#ff0000',
              'line-width': 2
            }
          });
        }
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
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: traj.points
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
        overflow: 'hidden'
      }} 
    />
  );
};

export default MapComponent;
