import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// 使用你的实际 Mapbox token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9oYW5uYWFhYSIsImEiOiJjbTVqdDc3ZjUxNTU1MmtxMmdvY3R0OWJzIn0.yEjbwPZWaGE0OuXSSFCybQ';

interface MapComponentProps {
  trajectories: Array<{
    points: Array<[number, number]>;
    timestamp: number;
  }>;
  onPointClick: (point: any) => void;
  showHeatmap: boolean;
}

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

    try {
      // 初始化地图
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12', // 使用更稳定的样式
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
        attributionControl: false
      });

      const mapInstance = map.current;

      // 添加错误处理
      mapInstance.on('error', (e) => {
        console.error('Map error:', e);
      });

      // 基本控件
      mapInstance.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        'top-right'
      );

      // 初始化完成后的设置
      mapInstance.on('load', () => {
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
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  }, []);

  // 处理轨迹数据更新
  useEffect(() => {
    if (!map.current) return;

    try {
      // 清除现有标记
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      // 更新图层
      if (showHeatmap) {
        updateHeatmapLayer(map.current, trajectories);
      } else {
        updateTrajectoryLayer(map.current, trajectories);
      }
    } catch (error) {
      console.error('Trajectory update error:', error);
    }
  }, [trajectories, showHeatmap]);

  return <div ref={mapContainer} className="map-container" />;
};

// 修改轨迹图层处理函数
const addTrajectoryLayer = (map: mapboxgl.Map, trajectories: Trajectory[]) => {
  try {
    // 转换数据格式
    const features = trajectories.map(trajectory => ({
      type: 'Feature',
      properties: {
        id: trajectory.id,
        touristType: trajectory.touristType
      },
      geometry: {
        type: 'LineString',
        coordinates: trajectory.points.map(point => [point.lng, point.lat])
      }
    }));

    // 添加数据源
    if (!map.getSource('trajectory-source')) {
      map.addSource('trajectory-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features
        }
      });
    }

    // 添加轨迹线图层
    if (!map.getLayer('trajectory-lines')) {
      map.addLayer({
        id: 'trajectory-lines',
        type: 'line',
        source: 'trajectory-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': [
            'match',
            ['get', 'touristType'],
            '个人游客', '#FF6B6B',
            '团队游客', '#4ECDC4',
            '亲子游客', '#45B7D1',
            '#666666' // 默认颜色
          ],
          'line-width': 3,
          'line-opacity': 0.8
        }
      });
    }

    // 添加轨迹点图层
    if (!map.getLayer('trajectory-points')) {
      map.addLayer({
        id: 'trajectory-points',
        type: 'circle',
        source: 'trajectory-source',
        paint: {
          'circle-radius': 5,
          'circle-color': [
            'match',
            ['get', 'touristType'],
            '个人游客', '#FF6B6B',
            '团队游客', '#4ECDC4',
            '亲子游客', '#45B7D1',
            '#666666'
          ],
          'circle-opacity': 0.7
        }
      });

      // 添加点击事件
      map.on('click', 'trajectory-points', (e) => {
        if (e.features && e.features[0] && onPointClick) {
          const feature = e.features[0];
          onPointClick(feature.properties as any);
        }
      });

      // 添加鼠标悬停效果
      map.on('mouseenter', 'trajectory-points', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'trajectory-points', () => {
        map.getCanvas().style.cursor = '';
      });
    }
  } catch (error) {
    console.error('Error adding trajectory layer:', error);
  }
};

const updateTrajectoryLayer = (map: mapboxgl.Map, trajectories: Trajectory[]) => {
  try {
    const source = map.getSource('trajectory-source');
    if (source && 'setData' in source) {
      source.setData({
        type: 'FeatureCollection',
        features: trajectories.map(trajectory => ({
          type: 'Feature',
          properties: {
            id: trajectory.id,
            touristType: trajectory.touristType
          },
          geometry: {
            type: 'LineString',
            coordinates: trajectory.points.map(point => [point.lng, point.lat])
          }
        }))
      });
    }
  } catch (error) {
    console.error('Error updating trajectory layer:', error);
  }
};

// 修改热力图处理函数
const addHeatmapLayer = (map: mapboxgl.Map, trajectories: Trajectory[]) => {
  try {
    const points = trajectories.flatMap(trajectory => 
      trajectory.points.map(point => ({
        type: 'Feature',
        properties: {
          weight: 1,
          touristType: trajectory.touristType
        },
        geometry: {
          type: 'Point',
          coordinates: [point.lng, point.lat]
        }
      }))
    );

    if (!map.getSource('heatmap-source')) {
      map.addSource('heatmap-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: points
        }
      });
    }

    if (!map.getLayer('heatmap-layer')) {
      map.addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: 'heatmap-source',
        paint: {
          'heatmap-weight': ['get', 'weight'],
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
          'heatmap-radius': 20,
          'heatmap-opacity': 0.8
        }
      });
    }
  } catch (error) {
    console.error('Error adding heatmap layer:', error);
  }
};

const updateHeatmapLayer = (map: mapboxgl.Map, trajectories: any[]) => {
  const source = map.getSource('heatmap-source');
  if (source && 'setData' in source) {
    source.setData({
      type: 'FeatureCollection',
      features: trajectories.flatMap(traj => 
        traj.points.map(point => ({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: point
          }
        }))
      )
    });
  }
};

export default MapComponent;
