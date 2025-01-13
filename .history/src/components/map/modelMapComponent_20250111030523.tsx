import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from '@emotion/styled';
import LoadingOverlay from './LoadingOverlay';

// 确保使用正确的 Mapbox token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9oYW5uYWFhYSIsImEiOiJjbTVqdDc3ZjUxNTU1MmtxMmdvY3R0OWJzIn0.yEjbwPZWaGE0OuXSSFCybQ';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

interface Coordinate {
  lng: number;
  lat: number;
}

interface TrajectoryPoint extends Coordinate {
  timestamp: string;
  type?: string;
  location?: string;
  duration?: number;
}

interface MapComponentProps {
  trajectories: TrajectoryPoint[][];
  center?: Coordinate;
  zoom?: number;
  onPointClick?: (point: TrajectoryPoint) => void;
}

const defaultCenter = { lng: 118.0627, lat: 24.4453 }; // 鼓浪屿坐标
const defaultZoom = 15;

const MapComponent: React.FC<MapComponentProps> = ({
  trajectories,
  center = defaultCenter,
  zoom = defaultZoom,
  onPointClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 初始化地图
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [center.lng, center.lat],
      zoom: zoom,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // 更新轨迹显示
  useEffect(() => {
    if (!map.current || !mapLoaded || !trajectories || trajectories.length === 0) return;

    const currentTrajectory = trajectories[0]; // 获取第一条轨迹
    if (!currentTrajectory || currentTrajectory.length === 0) return;

    // 移除现有的图层和源
    ['route', 'points'].forEach(layer => {
      if (map.current?.getLayer(layer)) {
        map.current.removeLayer(layer);
      }
    });
    
    if (map.current.getSource('route')) {
      map.current.removeSource('route');
    }

    // 添加轨迹源
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: currentTrajectory.map(point => [point.lng, point.lat])
            }
          },
          ...currentTrajectory.map(point => ({
            type: 'Feature',
            properties: {
              location: point.location,
              timestamp: point.timestamp
            },
            geometry: {
              type: 'Point',
              coordinates: [point.lng, point.lat]
            }
          }))
        ]
      }
    });

    // 添加轨迹线
    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#007bff',
        'line-width': 3,
        'line-opacity': 0.8
      },
      filter: ['==', '$type', 'LineString']
    });

    // 添加轨迹点
    map.current.addLayer({
      id: 'points',
      type: 'circle',
      source: 'route',
      paint: {
        'circle-radius': 8,
        'circle-color': '#007bff',
        'circle-opacity': 0.8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      },
      filter: ['==', '$type', 'Point']
    });

    // 添加点击事件
    if (onPointClick) {
      map.current.on('click', 'points', (e) => {
        if (e.features && e.features[0]) {
          const properties = e.features[0].properties;
          const coordinates = e.features[0].geometry.coordinates;
          onPointClick({
            lng: coordinates[0],
            lat: coordinates[1],
            timestamp: properties.timestamp,
            location: properties.location
          });
        }
      });

      // 改变鼠标样式
      map.current.on('mouseenter', 'points', () => {
        map.current!.getCanvas().style.cursor = 'pointer';
      });
      
      map.current.on('mouseleave', 'points', () => {
        map.current!.getCanvas().style.cursor = '';
      });
    }

  }, [trajectories, mapLoaded, onPointClick]);

  return <MapContainer ref={mapContainer} />;
};

export default MapComponent;
