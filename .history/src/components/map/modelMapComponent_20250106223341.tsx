import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from '@emotion/styled';
import LoadingOverlay from './LoadingOverlay';

// Replace with your actual Mapbox token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9oYW5uYWFhYSIsImEiOiJjbTVqdDc3ZjUxNTU1MmtxMmdvY3R0OWJzIn0.yEjbwPZWaGE0OuXSSFCybQ';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
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
  showHeatmap?: boolean;
  currentTimeIndex: number;
  isAnimating: boolean;
}

const defaultCenter = { lng: 118.0627, lat: 24.4453 }; // Gulangyu Island coordinates
const defaultZoom = 15;

const MapComponent: React.FC<MapComponentProps> = ({
  trajectories,
  center = defaultCenter,
  zoom = defaultZoom,
  onPointClick,
  showHeatmap = false,
  currentTimeIndex,
  isAnimating,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    setLoading(true);
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [center.lng, center.lat],
      zoom: zoom,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      setLoading(false);
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update trajectory visualization based on currentTimeIndex
  useEffect(() => {
    if (!map.current || !mapLoaded || !trajectories || trajectories.length === 0) return;

    const trajectory = trajectories[0];
    const currentPoints = trajectory.slice(0, currentTimeIndex + 1);
    
    // Remove existing layers if they exist
    const layers = ['route', 'points', 'current-point'];
    layers.forEach(layer => {
      if (map.current?.getLayer(layer)) {
        map.current.removeLayer(layer);
      }
    });

    if (map.current.getSource('route')) {
      map.current.removeSource('route');
    }

    // Add the route line
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: currentPoints.map(point => [point.lng, point.lat])
        }
      }
    });

    // Add the line layer
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

    // Add points layer
    map.current.addLayer({
      id: 'points',
      type: 'circle',
      source: 'route',
      paint: {
        'circle-radius': 6,
        'circle-color': '#007bff',
        'circle-opacity': 0.7,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    });

    // Add current point with animation
    if (currentPoints.length > 0) {
      const currentPoint = currentPoints[currentPoints.length - 1];
      
      if (map.current.getSource('current-point')) {
        map.current.removeSource('current-point');
      }

      map.current.addSource('current-point', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [currentPoint.lng, currentPoint.lat]
          }
        }
      });

      map.current.addLayer({
        id: 'current-point',
        type: 'circle',
        source: 'current-point',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'radius'],
            0, 6,
            100, 20
          ],
          'circle-color': '#ff4d4f',
          'circle-opacity': 0.8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });

      // Animate the map to the current point
      if (isAnimating) {
        map.current.easeTo({
          center: [currentPoint.lng, currentPoint.lat],
          duration: 1000,
          zoom: zoom
        });
      }
    }
  }, [currentTimeIndex, isAnimating, mapLoaded, trajectories]);

  return (
    <MapContainer ref={mapContainer}>
      {loading && <LoadingOverlay />}
    </MapContainer>
  );
};

export default MapComponent;
