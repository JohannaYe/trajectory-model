import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import styled from '@emotion/styled';
import 'mapbox-gl/dist/mapbox-gl.css';

// 替换为您的 Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapContainer = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  margin: 2rem 0;
`;

const MapPreview = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const gulangyu = {
      lng: 118.0664,
      lat: 24.4457,
      zoom: 14
    };

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [gulangyu.lng, gulangyu.lat],
        zoom: gulangyu.zoom,
      });

      map.current.addControl(new mapboxgl.NavigationControl());
    } catch (error) {
      console.error("地图加载失败:", error);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

  return <MapContainer ref={mapContainer} />;
};

export default MapPreview; 