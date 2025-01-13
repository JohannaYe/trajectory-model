import React, { useEffect, useRef } from 'react';
import { Map, Scene, PointLayer, HeatmapLayer } from '@antv/l7';

interface MapComponentProps {
  trajectories: any[];
  showHeatmap: boolean;
  onPointClick?: (point: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  trajectories, 
  showHeatmap, 
  onPointClick 
}) => {
  const mapRef = useRef<Map | null>(null);
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const scene = new Scene({
        id: 'map',
        map: new Map({
          center: [118.0654, 24.4459], // 鼓浪屿中心坐标
          zoom: 15,
          pitch: 0,
          style: 'light',
          minZoom: 14,
          maxZoom: 17,
        })
      });
      
      sceneRef.current = scene;
      mapRef.current = scene.map;
    }
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !trajectories.length) return;

    const scene = sceneRef.current;
    scene.clear();

    if (showHeatmap) {
      const heatmapLayer = new HeatmapLayer({
        data: trajectories,
        shape: 'heatmap',
        size: 20,
        style: {
          intensity: 3,
          radius: 20,
          opacity: 0.8,
          colorsRamp: [
            { color: '#FFE5E5', position: 0 },
            { color: '#FF9B9B', position: 0.3 },
            { color: '#FF4D4D', position: 0.7 },
            { color: '#FF0000', position: 1 }
          ]
        }
      });
      
      scene.addLayer(heatmapLayer);
      return () => scene.removeLayer(heatmapLayer);
    } else {
      // 绘制轨迹线
      trajectories.forEach(trajectory => {
        // 实现轨迹线的绘制逻辑
        // ... 
      });
    }
  }, [trajectories, showHeatmap]);

  return <div id="map" style={{ width: '100%', height: '100%' }} />;
};

export default MapComponent; 