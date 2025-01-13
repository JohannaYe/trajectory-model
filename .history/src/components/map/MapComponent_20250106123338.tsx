import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styled from '@emotion/styled';

// Replace with your actual Mapbox token
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9oYW5uYWFhYSIsImEiOiJjbTVqdDc3ZjUxNTU1MmtxMmdvY3R0OWJzIn0.yEjbwPZWaGE0OuXSSFCybQ';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
`;

interface Coordinate {
  lng: number;
  lat: number;
}

interface TrajectoryPoint extends Coordinate {
  timestamp: string;
  type?: string;
}

interface MapComponentProps {
  trajectories: TrajectoryPoint[][];
  center?: Coordinate;
  zoom?: number;
  onPointClick?: (point: TrajectoryPoint) => void;
  showHeatmap?: boolean;
}

const defaultCenter = { lng: 118.0627, lat: 24.4453 }; // Gulangyu Island coordinates
const defaultZoom = 15;

const MapComponent: React.FC<MapComponentProps> = ({
  trajectories,
  center = defaultCenter,
  zoom = defaultZoom,
  onPointClick,
  showHeatmap = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
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

    return () => {
      map.current?.remove();
    };
  }, []);

  // Add trajectories to map
  useEffect(() => {
    if (!map.current || !mapLoaded || trajectories.length === 0) return;

    // Remove existing layers if they exist
    if (map.current.getLayer('trajectory-line')) {
      map.current.removeLayer('trajectory-line');
    }
    if (map.current.getLayer('trajectory-points')) {
      map.current.removeLayer('trajectory-points');
    }
    if (map.current.getSource('trajectory')) {
      map.current.removeSource('trajectory');
    }

    // Create GeoJSON feature collection for trajectories
    const features = trajectories.flatMap((trajectory, trajectoryIndex) =>
      trajectory.map((point, pointIndex) => ({
        type: 'Feature' as const,
        properties: {
          trajectoryId: trajectoryIndex,
          pointIndex: pointIndex,
          timestamp: point.timestamp,
          type: point.type,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [point.lng, point.lat],
        },
      }))
    );

    // Add source
    map.current.addSource('trajectory', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    });

    // Add line layer
    map.current.addLayer({
      id: 'trajectory-line',
      type: 'line',
      source: 'trajectory',
      paint: {
        'line-color': '#1890ff',
        'line-width': 2,
        'line-opacity': 0.8,
      },
    });

    // Add points layer
    map.current.addLayer({
      id: 'trajectory-points',
      type: 'circle',
      source: 'trajectory',
      paint: {
        'circle-radius': 5,
        'circle-color': '#1890ff',
        'circle-opacity': 0.8,
      },
    });

    // Add heatmap layer if enabled
    if (showHeatmap) {
      map.current.addLayer({
        id: 'trajectory-heat',
        type: 'heatmap',
        source: 'trajectory',
        paint: {
          'heatmap-weight': 1,
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
        },
      });
    }

    // Add click interaction
    if (onPointClick) {
      map.current.on('click', 'trajectory-points', (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const props = feature.properties;
          const coords = feature.geometry.coordinates;
          
          onPointClick({
            lng: coords[0],
            lat: coords[1],
            timestamp: props.timestamp,
            type: props.type,
          });
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'trajectory-points', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'trajectory-points', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    }
  }, [trajectories, mapLoaded, showHeatmap, onPointClick]);

  return <MapContainer ref={mapContainer} />;
};

export default MapComponent;
