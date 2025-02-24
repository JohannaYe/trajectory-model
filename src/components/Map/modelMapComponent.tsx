// import React, { useEffect, useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import styled from '@emotion/styled';

// // 设置 Mapbox token
// mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNsZWUiLCJhIjoiY2xtNWp0NzdmNTE1NTJrcTJnb2N0dDlicyJ9.yEjbwPZWaGE0OuXSSFCybQ';

// const MapWrapper = styled.div`
//   width: 100%;
//   height: 100%;
//   position: relative;
// `;

// const MapContainer = styled.div`
//   width: 100%;
//   height: 100%;
//   position: absolute;
//   top: 0;
//   left: 0;
// `;

// const Styles = styled.div`
//   .collection-point-marker {
//     background-color: #FF0000;
//     width: 15px;
//     height: 15px;
//     border-radius: 50%;
//     border: 2px solid #FFFFFF;
//     box-shadow: 0 0 10px rgba(0,0,0,0.3);
//     cursor: pointer;
//   }

//   .mapboxgl-popup {
//     max-width: 200px;
//   }

//   .mapboxgl-popup-content {
//     padding: 15px;
//     border-radius: 8px;
    
//     h4 {
//       margin: 0 0 8px;
//       color: #1890ff;
//     }
    
//     p {
//       margin: 5px 0;
//       font-size: 13px;
//     }
//   }
// `;

// interface TrajectoryPoint {
//   lng: number;
//   lat: number;
//   timestamp: string;
//   location?: string;
//   duration?: number;
// }

// interface MapComponentProps {
//   trajectories: Array<Array<TrajectoryPoint>>;
//   onLocationClick?: (point: TrajectoryPoint) => void;
// }

// const MapComponent: React.FC<MapComponentProps> = ({ trajectories, onLocationClick }) => {
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const map = useRef<mapboxgl.Map | null>(null);
//   const marker = useRef<mapboxgl.Marker | null>(null);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [mapError, setMapError] = useState<string | null>(null);

//   // 初始化地图
//   useEffect(() => {
//     if (!mapboxgl.accessToken) {
//       setMapError('Mapbox token is missing');
//       return;
//     }

//     if (mapContainer.current && !map.current) {
//       try {
//         console.log('Initializing map...'); // 调试日志

//         const initialMap = new mapboxgl.Map({
//           container: mapContainer.current,
//           style: 'mapbox://styles/mapbox/light-v10',
//           center: [118.0664, 24.4456],
//           zoom: 14
//         });

//         console.log('Map instance created'); // 调试日志

//         initialMap.on('load', () => {
//           console.log('Map loaded successfully'); // 调试日志
//           setMapLoaded(true);
//           map.current = initialMap;

//           // 添加控件
//           initialMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

//           // 初始化标记
//           if (trajectories.length > 0 && trajectories[0].length > 0) {
//             const firstPoint = trajectories[0][0];
//             const marker = document.createElement('div');
//             marker.className = 'collection-point-marker';

//             new mapboxgl.Marker(marker)
//               .setLngLat([firstPoint.lng, firstPoint.lat])
//               .setPopup(
//                 new mapboxgl.Popup({ offset: 25 })
//                   .setHTML(
//                     `<h4>当前位置</h4>
//                      <p>时间: ${firstPoint.timestamp}</p>
//                      ${firstPoint.location ? `<p>位置: ${firstPoint.location}</p>` : ''}`
//                   )
//               )
//               .addTo(initialMap);
//           }
//         });

//         initialMap.on('error', (e) => {
//           console.error('Map error:', e.error); // 错误日志
//           setMapError(e.error.message);
//         });

//       } catch (error) {
//         console.error('Map initialization error:', error); // 错误日志
//         setMapError(error instanceof Error ? error.message : 'Failed to initialize map');
//       }
//     }

//     return () => {
//       if (map.current) {
//         map.current.remove();
//         map.current = null;
//       }
//     };
//   }, []);

//   // 更新轨迹
//   useEffect(() => {
//     if (!map.current || !mapLoaded || !trajectories.length) return;

//     const currentMap = map.current;
//     const currentTrajectory = trajectories[0];
    
//     if (!currentTrajectory.length) return;

//     const sourceId = 'route';
//     const layerId = 'route-layer';

//     // 移除现有的图层和源
//     if (currentMap.getLayer(layerId)) {
//       currentMap.removeLayer(layerId);
//     }
//     if (currentMap.getSource(sourceId)) {
//       currentMap.removeSource(sourceId);
//     }

//     try {
//       // 添加轨迹数据源
//       currentMap.addSource(sourceId, {
//         type: 'geojson',
//         data: {
//           type: 'Feature',
//           properties: {},
//           geometry: {
//             type: 'LineString',
//             coordinates: currentTrajectory.map(point => [point.lng, point.lat])
//           }
//         }
//       });

//       // 添加轨迹图层
//       currentMap.addLayer({
//         id: layerId,
//         type: 'line',
//         source: sourceId,
//         layout: {
//           'line-join': 'round',
//           'line-cap': 'round'
//         },
//         paint: {
//           'line-color': '#1890ff',
//           'line-width': 3,
//           'line-opacity': 0.8
//         }
//       });

//       // 更新标记位置
//       const currentPoint = currentTrajectory[currentTrajectory.length - 1];
//       const marker = document.createElement('div');
//       marker.className = 'collection-point-marker';

//       new mapboxgl.Marker(marker)
//         .setLngLat([currentPoint.lng, currentPoint.lat])
//         .setPopup(
//           new mapboxgl.Popup({ offset: 25 })
//             .setHTML(
//               `<h4>当前位置</h4>
//                <p>时间: ${currentPoint.timestamp}</p>
//                ${currentPoint.location ? `<p>位置: ${currentPoint.location}</p>` : ''}`
//             )
//         )
//         .addTo(currentMap);

//       // 平滑移动到当前位置
//       currentMap.easeTo({
//         center: [currentPoint.lng, currentPoint.lat],
//         duration: 1000,
//         essential: true
//       });

//     } catch (error) {
//       console.error('Error updating trajectory:', error);
//     }
//   }, [trajectories, mapLoaded]);

//   // 添加地图点击事件处理
//   useEffect(() => {
//     if (!map.current || !mapLoaded) return;

//     const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
//       const features = map.current?.queryRenderedFeatures(e.point, {
//         layers: ['route-layer']
//       });

//       if (features && features.length > 0) {
//         // 找到最近的轨迹点
//         const clickedCoord = e.lngLat;
//         const trajectory = trajectories[0];
//         let nearestPoint = trajectory[0];
//         let minDistance = Infinity;

//         trajectory.forEach(point => {
//           const distance = Math.sqrt(
//             Math.pow(clickedCoord.lng - point.lng, 2) + 
//             Math.pow(clickedCoord.lat - point.lat, 2)
//           );
//           if (distance < minDistance) {
//             minDistance = distance;
//             nearestPoint = point;
//           }
//         });

//         // 创建或更新点击标记
//         if (marker.current) {
//           marker.current.remove();
//         }

//         const markerElement = document.createElement('div');
//         markerElement.className = 'collection-point-marker';

//         marker.current = new mapboxgl.Marker(markerElement)
//           .setLngLat([nearestPoint.lng, nearestPoint.lat])
//           .setPopup(
//             new mapboxgl.Popup({ offset: 25 })
//               .setHTML(
//                 `<h4>选中位置</h4>
//                  <p>时间: ${nearestPoint.timestamp}</p>
//                  ${nearestPoint.location ? `<p>位置: ${nearestPoint.location}</p>` : ''}`
//               )
//           )
//           .addTo(map.current);

//         // 触发回调
//         onLocationClick?.(nearestPoint);
//       }
//     };

//     map.current.on('click', handleMapClick);

//     return () => {
//       map.current?.off('click', handleMapClick);
//     };
//   }, [mapLoaded, trajectories, onLocationClick]);

//   return (
//     <Styles>
//       <MapWrapper>
//         <MapContainer ref={mapContainer}>
//           {mapError && (
//             <div style={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               background: 'rgba(255, 255, 255, 0.9)',
//               padding: '20px',
//               borderRadius: '8px',
//               color: 'red',
//               zIndex: 1000
//             }}>
//               Error loading map: {mapError}
//             </div>
//           )}
//         </MapContainer>
//       </MapWrapper>
//     </Styles>
//   );
// };

// export default MapComponent;

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from '@emotion/styled';

mapboxgl.accessToken = 'pk.eyJ1IjoiamFtZXNsZWUiLCJhIjoiY2xtNWp0NzdmNTE1NTJrcTJnb2N0dDlicyJ9.yEjbwPZWaGE0OuXSSFCybQ';

const MapWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

interface TrajectoryPoint {
  lng: number;
  lat: number;
  timestamp: string;
  location?: string;
}

interface MapComponentProps {
  trajectories: Array<Array<TrajectoryPoint>>;
  pathColor: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ trajectories, pathColor }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 初始化地图
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [118.0664, 24.4456],
        zoom: 15
      });

      map.current.on('load', () => {
        setMapLoaded(true);
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // 清除现有的标记和路线
  const clearMap = () => {
    // 清除标记
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // 清除路线
    if (map.current) {
      const style = map.current.getStyle();
      if (style.layers) {
        style.layers.forEach(layer => {
          if (layer.id.startsWith('route-')) {
            map.current?.removeLayer(layer.id);
          }
        });
      }
      Object.keys(style.sources || {}).forEach(sourceId => {
        if (sourceId.startsWith('route-')) {
          map.current?.removeSource(sourceId);
        }
      });
    }
  };

  // 添加轨迹路线
  useEffect(() => {
    if (!map.current || !mapLoaded || !trajectories.length) return;

    clearMap();

    // 为轨迹获取导航路线并绘制
    trajectories.forEach(async (trajectory, index) => {
      if (trajectory.length < 2) return;

      const coordinates = trajectory.map(point => `${point.lng},${point.lat}`).join(';');
      
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        
        if (data.routes && data.routes[0]) {
          // 添加路线源
          map.current?.addSource(`route-${index}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: data.routes[0].geometry
            }
          });

          // 添加路线图层
          map.current?.addLayer({
            id: `route-${index}`,
            type: 'line',
            source: `route-${index}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': pathColor,
              'line-width': 4,
              'line-opacity': 0.8
            }
          });

          // 添加位置标记
          trajectory.forEach((point, pointIndex) => {
            const marker = document.createElement('div');
            marker.className = 'marker';
            marker.style.width = '15px';
            marker.style.height = '15px';
            marker.style.borderRadius = '50%';
            marker.style.backgroundColor = pointIndex === 0 ? '#52c41a' : 
                                        pointIndex === trajectory.length - 1 ? '#f5222d' : 
                                        pathColor;
            marker.style.border = '2px solid white';
            marker.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

            const newMarker = new mapboxgl.Marker(marker)
              .setLngLat([point.lng, point.lat])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                  .setHTML(`<h4>${point.location}</h4><p>时间: ${point.timestamp}</p>`)
              )
              .addTo(map.current!);

            markersRef.current.push(newMarker);
          });
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    });
  }, [trajectories, pathColor, mapLoaded]);

  return (
    <MapWrapper ref={mapContainer} />
  );
};

export default MapComponent;