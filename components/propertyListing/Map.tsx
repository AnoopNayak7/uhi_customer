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

// Create custom red circle marker
function createRedCircleMarker() {
  return L.divIcon({
    className: 'custom-red-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #dc2626;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        border: 2px solid white;
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
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

// Component to auto-fit map to show all markers
function AutoFitBounds({ properties }: { properties: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (properties.length > 0) {
      // Create bounds from all property locations
      const bounds = L.latLngBounds(
        properties.map(property => [property.latitude, property.longitude])
      );
      
      // Fit map to bounds with padding
      map.fitBounds(bounds, {
        padding: [20, 20],
        maxZoom: 15 // Limit max zoom to prevent too close view
      });
    }
  }, [map, properties]);
  
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
  
  // Filter properties with valid coordinates
  const propertiesWithCoordinates = properties.filter(
    (p) => p.latitude && p.longitude
  );
  
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
      
      {/* Auto-fit bounds to show all markers */}
      {propertiesWithCoordinates.length > 0 && (
        <AutoFitBounds properties={propertiesWithCoordinates} />
      )}
      
      {propertiesWithCoordinates.length > 0 ? (
        propertiesWithCoordinates.map((property) => (
          <Marker 
            key={property.id} 
            position={[property.latitude, property.longitude]}
            icon={createRedCircleMarker()}
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
        <Marker position={center} icon={createRedCircleMarker()}>
          <Popup>You are here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}