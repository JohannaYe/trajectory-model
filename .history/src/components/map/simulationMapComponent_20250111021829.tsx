import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// 设置 Mapbox token
const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
console.log('Mapbox Token:', token); // 调试token
mapboxgl.accessToken = token;

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
    console.log('Initializing map...'); // 调试初始化
    if (!mapContainer.current || map.current) return;

    try {
      console.log('Creating map instance...'); // 调试地图创建
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11', // 使用不同的样式
        center: [118.0686, 24.4432],
        zoom: 15,
        minZoom: 13,
        maxZoom: 18
      });

      // 添加错误处理
      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

      // 添加样式加载处理
      mapInstance.on('style.load', () => {
        console.log('Map style loaded');
      });

      mapInstance.on('load', () => {
        console.log('Map loaded successfully');
        
        if (!mapInstance.isStyleLoaded()) {
          console.log('Style not loaded yet, waiting...');
          mapInstance.once('style.load', () => {
            console.log('Style loaded, adding layers...');
            addLayers(mapInstance);
          });
          return;
        }

        addLayers(mapInstance);
      });

      map.current = mapInstance;

      return () => {
        console.log('Cleaning up map...');
        mapInstance.remove();
      };
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  }, []);

  const addLayers = (mapInstance: mapboxgl.Map) => {
    try {
      console.log('Adding layers with trajectories:', trajectories);
      
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
              coordinates: traj.points.map(point => [point[1], point[0]])
            }
          }))
        }
      });

      // 添加轨迹线图层
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

      console.log('Layers added successfully');
    } catch (error) {
      console.error('Error adding layers:', error);
    }
  };

  // 更新轨迹数据
  useEffect(() => {
    console.log('Trajectory data updated:', trajectories);
    const mapInstance = map.current;
    if (!mapInstance || !mapInstance.isStyleLoaded()) {
      console.log('Map not ready for data update');
      return;
    }

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
              coordinates: traj.points.map(point => [point[1], point[0]])
            }
          }))
        });
        console.log('Data updated successfully');
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
        position: 'relative',
        backgroundColor: '#f0f0f0' // 添加背景色以便于调试
      }} 
    />
  );
};

export default MapComponent;
