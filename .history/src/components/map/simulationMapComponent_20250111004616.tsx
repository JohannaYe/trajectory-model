import React, { useEffect, useRef } from 'react';
import { Map, Heatmap } from '@antv/l7';
import { Scene } from '@antv/l7-maps';

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
      // 转换轨迹数据为热力图点数据
      const heatmapData = trajectories.flatMap(trajectory => 
        trajectory.map((point: any) => ({
          lng: point.lng,
          lat: point.lat,
          // 根据不同类型设置不同权重
          weight: point.type === 'attraction' ? 1.0 :
                 point.type === 'moving' ? 0.3 :
                 point.type === 'start' || point.type === 'end' ? 0.8 : 0.5
        }))
      );

      const heatmap = new Heatmap({
        data: heatmapData,
        size: 15,
        shape: 'circle',
        blend: 'normal',
        field: 'weight',
        style: {
          intensity: 3,
          radius: 20,
          opacity: 0.8,
          colorsRamp: [
            { color: '#1B91FF', position: 0 },
            { color: '#4AED8D', position: 0.3 },
            { color: '#F7B500', position: 0.6 },
            { color: '#FF4D4F', position: 0.9 },
          ]
        }
      });

      scene.addLayer(heatmap);
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