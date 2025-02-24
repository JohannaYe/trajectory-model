import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  trajectories: TrajectoryData[];
  onMapClick: (event: L.LeafletMouseEvent) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ trajectories, onMapClick }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([24.4478, 118.0689], 15);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      
      // 添加地图点击事件监听
      map.on('click', onMapClick);
      
      mapRef.current = map;
    }
    
    // 清除现有轨迹
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // 绘制新轨迹
    trajectories.forEach((trajectory) => {
      const polyline = L.polyline(trajectory.points, {
        color: trajectory.color || '#3388ff',
        weight: 3,
        opacity: 0.8
      }).addTo(mapRef.current!);

      // 添加起点和终点标记
      if (trajectory.points.length > 0) {
        const startPoint = trajectory.points[0];
        const endPoint = trajectory.points[trajectory.points.length - 1];

        L.marker(startPoint, {
          icon: L.divIcon({ className: 'start-point-marker' })
        }).addTo(mapRef.current!);

        L.marker(endPoint, {
          icon: L.divIcon({ className: 'end-point-marker' })
        }).addTo(mapRef.current!);
      }
    });
  }, [trajectories]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default MapComponent; 