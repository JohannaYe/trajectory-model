import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// 创建一个新的 mapboxgl token 配置
mapboxgl.accessToken = 'your_mapbox_token';

interface MapComponentProps {
  trajectories: Array<{
    points: Array<[number, number]>;
    timestamp: number;
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
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // 初始化地图
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [118.0686, 24.4432],
      zoom: 15,
      trackResize: true,
      collectResourceTiming: false,
      trackUserLocation: false,
      enableFreeCameraControls: false,
      maxBounds: [
        [118.0586, 24.4332],
        [118.0786, 24.4532]
      ],
      attributionControl: false,
      // 添加更多限制选项
      boxZoom: false,          // 禁用框选缩放
      dragRotate: false,       // 禁用拖拽旋转
      touchZoomRotate: false,  // 禁用触摸旋转
      renderWorldCopies: false // 禁用世界地图复制
    });

    const mapInstance = map.current;

    // 基本控件
    mapInstance.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      'top-right'
    );

    // 初始化完成后的设置
    mapInstance.on('load', () => {
      // 添加轨迹图层
      if (showHeatmap) {
        addHeatmapLayer(mapInstance, trajectories);
      } else {
        addTrajectoryLayer(mapInstance, trajectories);
      }
    });

    // 清理函数
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  // 处理轨迹数据更新
  useEffect(() => {
    if (!map.current) return;

    // 清除现有标记
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // 更新图层
    if (showHeatmap) {
      updateHeatmapLayer(map.current, trajectories);
    } else {
      updateTrajectoryLayer(map.current, trajectories);
    }
  }, [trajectories, showHeatmap]);

  return <div ref={mapContainer} className="map-container" />;
};

// 辅助函数
const addTrajectoryLayer = (map: mapboxgl.Map, trajectories: any[]) => {
  // 实现轨迹图层添加逻辑
};

const updateTrajectoryLayer = (map: mapboxgl.Map, trajectories: any[]) => {
  // 实现轨迹图层更新逻辑
};

const addHeatmapLayer = (map: mapboxgl.Map, trajectories: any[]) => {
  // 实现热力图层添加逻辑
};

const updateHeatmapLayer = (map: mapboxgl.Map, trajectories: any[]) => {
  // 实现热力图层更新逻辑
};

export default MapComponent;
