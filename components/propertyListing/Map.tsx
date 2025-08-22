"use client";

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { formatPrice } from '@/lib/utils';

// Fix Leaflet icon issues
function fixLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

// Component to update map view when center changes
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// Enable scroll wheel zoom only after user interaction
function ScrollWheelControl() {
  const map = useMap();
  
  useEffect(() => {
    // Disable scroll wheel zoom by default
    map.scrollWheelZoom.disable();
    
    // Enable on focus/click
    const enableScrollZoom = () => {
      map.scrollWheelZoom.enable();
    };
    
    map.on('focus', enableScrollZoom);
    map.on('click', enableScrollZoom);
    
    // Cleanup
    return () => {
      map.off('focus', enableScrollZoom);
      map.off('click', enableScrollZoom);
    };
  }, [map]);
  
  return null;
}

interface MapProps {
  center: [number, number];
  zoom?: number;
  properties?: any[];
  mapType?: 'map' | 'satellite';
}

export default function Map({ center, zoom = 13, properties = [], mapType = 'map' }: MapProps) {
  // Fix Leaflet icon issues on component mount
  useEffect(() => {
    fixLeafletIcons();
  }, []);
  
  // Determine tile layer URL based on map type
  const tileLayerUrl = mapType === 'satellite' 
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%', zIndex: 1 }}
      scrollWheelZoom={false}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={tileLayerUrl}
      />
      <ChangeView center={center} zoom={zoom} />
      <ScrollWheelControl />
      
      {properties.length > 0 ? (
        properties.map((property) => (
          <Marker 
            key={property.id} 
            position={[property.latitude, property.longitude]}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{property.title}</p>
                <p className="text-gray-600">{property.address}</p>
                <p className="font-medium mt-1">{formatPrice(property.price)}</p>
              </div>
            </Popup>
          </Marker>
        ))
      ) : (
        <Marker position={center}>
          <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}