import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import heatmap from 'leaflet-heatmap';

interface MapComponentProps {
  trajectories: Array<{
    points: Array<[number, number]>;
    timestamp: number;
  }>;
  onPointClick: (point: any) => void;
  showHeatmap: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({ trajectories, onPointClick, showHeatmap }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 初始化地图
    const map = L.map(mapContainerRef.current).setView([24.4539, 118.3889], 13); // 厦门市中心坐标

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // 清除现有图层
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
        layer.remove();
      }
    });

    // 绘制轨迹
    trajectories.forEach((trajectory) => {
      if (showHeatmap) {
        // 热力图显示
        const heatData = {
          data: trajectory.points.map(point => ({
            lat: point[0],
            lng: point[1],
            count: 1
          }))
        };

        const heatmapLayer = new HeatmapOverlay({
          radius: 20,
          maxOpacity: 0.8,
          scaleRadius: true,
          useLocalExtrema: true
        });

        heatmapLayer.setData(heatData);
        mapRef.current?.addLayer(heatmapLayer);
      } else {
        // 轨迹线显示
        const polyline = L.polyline(trajectory.points, {
          color: '#1890ff',
          weight: 3,
          opacity: 0.6
        }).addTo(mapRef.current);

        // 添加轨迹点
        trajectory.points.forEach((point) => {
          L.circleMarker(point as L.LatLngExpression, {
            radius: 5,
            color: '#1890ff',
            fillColor: '#fff',
            fillOpacity: 1,
            weight: 2
          })
            .addTo(mapRef.current!)
            .on('click', () => onPointClick({ coordinates: point, timestamp: trajectory.timestamp }));
        });
      }
    });
  }, [trajectories, showHeatmap, onPointClick]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
};

export default MapComponent;
