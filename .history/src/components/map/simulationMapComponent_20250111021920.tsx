import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// 设置 Mapbox token
const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
console.log('Mapbox Token:', token);
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
    console.log('Initializing map...');
    if (!mapContainer.current || map.current) return;

    try {
      console.log('Creating map instance...');
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: [
                'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + token
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        },
        center: [118.0686, 24.4432],
        zoom: 15,
        minZoom: 13,
        maxZoom: 18
      });

      // 等待样式加载完成
      mapInstance.on('style.load', () => {
        console.log('Style loaded');
        
        // 添加导航控件
        mapInstance.addControl(
          new mapboxgl.NavigationControl({
            showCompass: false,
            showZoom: true,
          })
        );

        // 添加轨迹数据
        if (trajectories.length > 0) {
          try {
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

            console.log('Added trajectory layers');
          } catch (error) {
            console.error('Error adding trajectory layers:', error);
          }
        }
      });

      map.current = mapInstance;

      // 错误处理
      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e);
      });

      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Map initialization error:', error);
    }
  }, []);

  // 更新轨迹数据
  useEffect(() => {
    if (!map.current || !trajectories.length) return;

    const mapInstance = map.current;
    if (!mapInstance.isStyleLoaded()) {
      console.log('Waiting for style to load...');
      mapInstance.once('style.load', () => updateTrajectories(mapInstance));
      return;
    }

    updateTrajectories(mapInstance);
  }, [trajectories]);

  const updateTrajectories = (mapInstance: mapboxgl.Map) => {
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
        console.log('Updated trajectories data');
      }
    } catch (error) {
      console.error('Error updating trajectories:', error);
    }
  };

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%', 
        height: '500px',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f0f0f0'
      }} 
    />
  );
};

export default MapComponent;
