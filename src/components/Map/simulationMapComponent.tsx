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

  // 添加轨迹或热力图
  const addTrajectoryLayers = (mapInstance: mapboxgl.Map) => {
    try {
      // 先清理现有的图层和数据源
      ['trajectories-heat', 'trajectories-line', 'trajectories-points'].forEach(layerId => {
        if (mapInstance.getLayer(layerId)) {
          mapInstance.removeLayer(layerId);
        }
      });

      if (mapInstance.getSource('trajectories')) {
        mapInstance.removeSource('trajectories');
      }

      // 添加新的数据源
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

      if (showHeatmap) {
        mapInstance.addLayer({
          id: 'trajectories-heat',
          type: 'heatmap',
          source: 'trajectories',
          paint: {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'weight'],
              0, 0,
              1, 2
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,
              15, 3
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 255, 0)',
              0.1, 'rgba(65, 105, 225, 0.5)',
              0.3, 'rgba(0, 255, 255, 0.7)',
              0.5, 'rgba(0, 255, 0, 0.7)',
              0.7, 'rgba(255, 255, 0, 0.8)',
              0.9, 'rgba(255, 140, 0, 0.9)',
              1, 'rgba(255, 0, 0, 1)'
            ],
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 4,
              15, 30
            ],
            'heatmap-opacity': 0.9
          }
        });
      } else {
        // 轨迹线和点图层配置保持不变
        mapInstance.addLayer({
          id: 'trajectories-line',
          type: 'line',
          source: 'trajectories',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': [
              'match',
              ['get', 'touristType'],
              '个人游客', '#4CAF50',
              '团队游客', '#2196F3',
              '亲子游客', '#FF9800',
              '#757575'
            ],
            'line-width': 2,
            'line-opacity': 0.7
          }
        });

        mapInstance.addLayer({
          id: 'trajectories-points',
          type: 'circle',
          source: 'trajectories',
          paint: {
            'circle-radius': 4,
            'circle-color': [
              'match',
              ['get', 'touristType'],
              '个人游客', '#4CAF50',
              '团队游客', '#2196F3',
              '亲子游客', '#FF9800',
              '#757575'
            ],
            'circle-opacity': 0.8
          }
        });
      }
    } catch (error) {
      console.error('Error adding layers:', error);
    }
  };

  // 更新图层显示模式
  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance || !mapInstance.isStyleLoaded()) return;

    try {
      addTrajectoryLayers(mapInstance);
    } catch (error) {
      console.error('Error updating display mode:', error);
    }
  }, [showHeatmap, trajectories]); // 添加 trajectories 作为依赖

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
