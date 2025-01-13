import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from '@emotion/styled';

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
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 初始化地图
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12', // 使用支持3D的地图样式
      center: [center.lng, center.lat],
      zoom: zoom,
      pitch: 60, // 添加倾斜角度
      bearing: 0, // 初始方向
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // 添加3D建筑图层
      map.current?.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      });
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // 创建自定义标记
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.fontSize = '24px';
    el.innerHTML = '🚶'; // 使用行走的emoji

    markerRef.current = new mapboxgl.Marker(el)
      .setLngLat([center.lng, center.lat])
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, []);

  // 更新轨迹显示
  useEffect(() => {
    if (!map.current || !mapLoaded || !trajectories || trajectories.length === 0) return;

    const currentTrajectory = trajectories[0];
    if (!currentTrajectory || currentTrajectory.length === 0) return;

    // 移除现有的图层和源
    ['route'].forEach(layer => {
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
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: currentTrajectory.map(point => [point.lng, point.lat])
        }
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
      }
    });

    // 更新标记位置
    if (currentTrajectory.length > 0) {
      const lastPoint = currentTrajectory[currentTrajectory.length - 1];
      markerRef.current?.setLngLat([lastPoint.lng, lastPoint.lat]);

      // 计算方向
      if (currentTrajectory.length > 1) {
        const prevPoint = currentTrajectory[currentTrajectory.length - 2];
        const bearing = getBearing(
          [prevPoint.lng, prevPoint.lat],
          [lastPoint.lng, lastPoint.lat]
        );
        
        // 平滑地转动地图
        map.current.easeTo({
          center: [lastPoint.lng, lastPoint.lat],
          bearing: bearing,
          duration: 1000
        });
      }
    }

  }, [trajectories, mapLoaded]);

  return <MapContainer ref={mapContainer} />;
};

// 计算两点之间的方位角
function getBearing(start: [number, number], end: [number, number]): number {
  const startLat = toRad(start[1]);
  const startLng = toRad(start[0]);
  const endLat = toRad(end[1]);
  const endLng = toRad(end[0]);

  const dLng = endLng - startLng;

  const y = Math.sin(dLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) -
          Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  let bearing = toDeg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  return bearing;
}

function toRad(deg: number): number {
  return deg * Math.PI / 180;
}

function toDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

export default MapComponent;
