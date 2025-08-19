'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issues
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

// Control component to prevent map from overlapping navbar
const MapController = () => {
  const map:any = useMap();
  
  useEffect(() => {
    // Add padding to the top of the map to prevent navbar overlap
    // map?.setOptions({ paddingTopLeft: [0, 72] });
    
    // Disable scroll wheel zoom by default to prevent accidental zooming
    map.scrollWheelZoom.disable();
    
    // Enable scroll wheel zoom only when map is clicked/focused
    const enableZoom = () => {
      map.scrollWheelZoom.enable();
    };
    
    const disableZoom = () => {
      map.scrollWheelZoom.disable();
    };
    
    map.on('click', enableZoom);
    map.on('focus', enableZoom);
    map.on('blur', disableZoom);
    
    return () => {
      map.off('click', enableZoom);
      map.off('focus', enableZoom);
      map.off('blur', disableZoom);
    };
  }, [map]);
  
  return null;
};

interface MarkerData {
  id: string;
  position: [number, number];
  popupText: string;
}

interface MapProps {
  center: [number, number];
  zoom?: number;
  markers?: MarkerData[];
}

const Map = ({ center, zoom = 15, markers = [] }: MapProps) => {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
      className="z-0" // Ensure map has lower z-index than navbar
    >
      <MapController />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* If no markers provided, show a single marker at the center */}
      {markers.length === 0 ? (
        <Marker position={center}>
          <Popup>Location</Popup>
        </Marker>
      ) : (
        // Otherwise, show all provided markers
        markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>{marker.popupText}</Popup>
          </Marker>
        ))
      )}
    </MapContainer>
  );
};

export default Map;