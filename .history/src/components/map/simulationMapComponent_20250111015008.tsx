import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// 设置你的 Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9oYW5uYWFhYSIsImEiOiJjbTVqdDc3ZjUxNTU1MmtxMmdvY3R0OWJzIn0.yEjbwPZWaGE0OuXSSFCybQ';

// 禁用追踪
(mapboxgl as any).config.EVENTS_URL = ''; // 禁用事件追踪
(mapboxgl as any).config.FEEDBACK_URL = ''; // 禁用反馈

interface MapComponentProps {
  trajectories: Array<{
    points: Array<[number, number]>;
    timestamp: number;
  }>;
  onPointClick: (point: any) => void;
  showHeatmap: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ trajectories, onPointClick, showHeatmap }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 初始化地图
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [118.0686, 24.4432], // 鼓浪屿中心位置
      zoom: 15,
      trackResize: true,
      collectResourceTiming: false, // 禁用性能数据收集
      trackUserLocation: false, // 禁用位置追踪
      enableFreeCameraControls: false, // 禁用自由相机控制
      maxBounds: [ // 限制地图范围在鼓浪屿附近
        [118.0586, 24.4332], // 西南角
        [118.0786, 24.4532]  // 东北角
      ],
      attributionControl: false // 禁用归属控制
    });

    // 禁用地图交互功能，只保留必要的
    mapInstance.dragRotate.disable(); // 禁用拖拽旋转
    mapInstance.touchZoomRotate.disableRotation(); // 禁用触摸旋转
    
    mapRef.current = mapInstance;
    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !trajectories.length) return;

    const handleMapLoad = () => {
      // 添加数据源之前先检查并清除旧的数据源
      if (map.getSource('trajectories')) {
        map.removeLayer('trajectory-layer');
        map.removeLayer('point-layer');
        map.removeSource('trajectories');
      }

      if (map.getSource('heatmap')) {
        map.removeLayer('heatmap-layer');
        map.removeSource('heatmap');
      }

      if (showHeatmap) {
        // 热力图数据
        const heatmapData = {
          type: 'FeatureCollection',
          features: trajectories.flatMap(trajectory =>
            trajectory.points.map(point => ({
              type: 'Feature',
              properties: {
                timestamp: trajectory.timestamp
              },
              geometry: {
                type: 'Point',
                coordinates: [point[1], point[0]]  // Mapbox使用[lng, lat]顺序
              }
            }))
          )
        };

        map.addSource('heatmap', {
          type: 'geojson',
          data: heatmapData
        });

        map.addLayer({
          id: 'heatmap-layer',
          type: 'heatmap',
          source: 'heatmap',
          paint: {
            'heatmap-weight': 1,
            'heatmap-intensity': 1,
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 255, 0)',
              0.2, 'royalblue',
              0.4, 'cyan',
              0.6, 'lime',
              0.8, 'yellow',
              1, 'red'
            ],
            'heatmap-radius': 20
          }
        });
      } else {
        // 轨迹线数据
        const geojsonData = {
          type: 'FeatureCollection',
          features: trajectories.map(trajectory => ({
            type: 'Feature',
            properties: {
              timestamp: trajectory.timestamp
            },
            geometry: {
              type: 'LineString',
              coordinates: trajectory.points.map(point => [point[1], point[0]])  // Mapbox使用[lng, lat]顺序
            }
          }))
        };

        console.log('Trajectory data:', geojsonData); // 添加调试日志

        map.addSource('trajectories', {
          type: 'geojson',
          data: geojsonData
        });

        // 添加轨迹线图层
        map.addLayer({
          id: 'trajectory-layer',
          type: 'line',
          source: 'trajectories',
          paint: {
            'line-color': '#1890ff',
            'line-width': 3,
            'line-opacity': 0.6
          }
        });

        // 添加轨迹点图层
        map.addLayer({
          id: 'point-layer',
          type: 'circle',
          source: 'trajectories',
          paint: {
            'circle-radius': 5,
            'circle-color': '#fff',
            'circle-stroke-color': '#1890ff',
            'circle-stroke-width': 2
          }
        });

        // 添加点击事件
        map.on('click', 'point-layer', (e) => {
          if (e.features && e.features[0]) {
            const coordinates = e.features[0].geometry.coordinates;
            const timestamp = e.features[0].properties.timestamp;
            onPointClick({
              coordinates: [coordinates[1], coordinates[0]], // 转换回 [lat, lng]
              timestamp
            });
          }
        });

        // 鼠标悬停时改变光标样式
        map.on('mouseenter', 'point-layer', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'point-layer', () => {
          map.getCanvas().style.cursor = '';
        });
      }
    };

    if (map.loaded()) {
      handleMapLoad();
    } else {
      map.on('load', handleMapLoad);
    }

    return () => {
      map.off('load', handleMapLoad);
    };
  }, [trajectories, showHeatmap, onPointClick]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
};

export default MapComponent;
