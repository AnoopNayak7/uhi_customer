import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { School, Building, ShoppingBag, Train, Hospital, Loader2, MapPin, Plus, Clock, Car, X, Navigation, RefreshCw } from 'lucide-react';
import L from 'leaflet';

interface Place {
  name: string;
  position: [number, number];
  distance: number;
  description?: string;
  address?: string;
  rating?: number;
}

interface TravelDestination {
  id: string;
  name: string;
  address: string;
  position: [number, number];
  travelTime?: string;
  distance?: number;
  calculating?: boolean;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

interface LocationInfo {
  city: string;
  state: string;
  country: string;
  area: string;
  fullAddress: string;
}

interface NearbyPlacesProps {
  center: [number, number];
  locationName?: string;
  radius?: number;
  onLocationInfoUpdate?: (info: LocationInfo) => void;
}

const NearbyPlaces = ({ center, locationName = 'Selected Location', radius = 2, onLocationInfoUpdate }: NearbyPlacesProps) => {
  const [activeTab, setActiveTab] = useState('schools');
  const [places, setPlaces] = useState<{[key: string]: Place[]}>({
    schools: [],
    hospitals: [],
    malls: [],
    metro: []
  });
  const [loading, setLoading] = useState<{[key: string]: boolean}>({
    schools: false,
    hospitals: false,
    malls: false,
    metro: false
  });
  const [currentLocation, setCurrentLocation] = useState(center);
  const [locationDetails, setLocationDetails] = useState<LocationInfo | null>(null);

  useEffect(() => {
    console.log('Center coordinates changed:', center);
    setCurrentLocation(center);
    fetchLocationDetails(center[0], center[1]);
  }, [center]);

  // Fetch location details from coordinates
  const fetchLocationDetails = async (lat: number, lng: number) => {
    console.log(`Fetching location details for coordinates: ${lat}, ${lng}`);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`
      );
      const data = await response.json();
      
      console.log('Location data received:', data);
      
      if (data && data.address) {
        const address = data.address;
        const locationInfo: LocationInfo = {
          city: address.city || address.town || address.village || address.municipality || address.county || 'Unknown City',
          state: address.state || address.region || address.province || 'Unknown State', 
          country: address.country || 'Unknown Country',
          area: address.suburb || address.neighbourhood || address.residential || address.hamlet || address.quarter || address.district || 'Central Area',
          fullAddress: data.display_name || 'Address not available'
        };
        
        console.log('Processed location info:', locationInfo);
        setLocationDetails(locationInfo);
        
        // Call parent callback if provided
        if (onLocationInfoUpdate) {
          onLocationInfoUpdate(locationInfo);
        }
      } else {
        console.warn('No address data found for coordinates');
        // Set fallback location info
        const fallbackInfo: LocationInfo = {
          city: 'Unknown City',
          state: 'Unknown State',
          country: 'Unknown Country',
          area: 'Unknown Area',
          fullAddress: `Location at ${lat.toFixed(6)}, ${lng.toFixed(6)}`
        };
        setLocationDetails(fallbackInfo);
        if (onLocationInfoUpdate) {
          onLocationInfoUpdate(fallbackInfo);
        }
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
      // Set error fallback
      const errorInfo: LocationInfo = {
        city: 'Location Error',
        state: 'Unknown State',
        country: 'Unknown Country', 
        area: 'Unknown Area',
        fullAddress: `Error fetching address for ${lat.toFixed(6)}, ${lng.toFixed(6)}`
      };
      setLocationDetails(errorInfo);
      if (onLocationInfoUpdate) {
        onLocationInfoUpdate(errorInfo);
      }
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchNearbyPlaces = async (category: string) => {
    setLoading(prev => ({ ...prev, [category]: true }));
    
    // Use current location coordinates for fetching
    const [lat, lng] = currentLocation;
    const radiusMeters = radius * 1000;
    
    console.log(`Fetching ${category} near coordinates: ${lat}, ${lng} with radius: ${radiusMeters}m`);
    
    const queries = {
      schools: `
        [out:json][timeout:25];
        (
          node["amenity"="school"](around:${radiusMeters},${lat},${lng});
          way["amenity"="school"](around:${radiusMeters},${lat},${lng});
          node["amenity"="university"](around:${radiusMeters},${lat},${lng});
          way["amenity"="university"](around:${radiusMeters},${lat},${lng});
          node["amenity"="college"](around:${radiusMeters},${lat},${lng});
          way["amenity"="college"](around:${radiusMeters},${lat},${lng});
        );
        out center;
      `,
      hospitals: `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
          way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
          node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
          way["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
          node["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
          way["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
          node["healthcare"="clinic"](around:${radiusMeters},${lat},${lng});
          way["healthcare"="clinic"](around:${radiusMeters},${lat},${lng});
        );
        out center;
      `,
      malls: `
        [out:json][timeout:25];
        (
          node["shop"="mall"](around:${radiusMeters},${lat},${lng});
          way["shop"="mall"](around:${radiusMeters},${lat},${lng});
          node["building"="retail"](around:${radiusMeters},${lat},${lng});
          way["building"="retail"](around:${radiusMeters},${lat},${lng});
          node["amenity"="marketplace"](around:${radiusMeters},${lat},${lng});
          way["amenity"="marketplace"](around:${radiusMeters},${lat},${lng});
          node["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
          way["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
          node["shop"="department_store"](around:${radiusMeters},${lat},${lng});
          way["shop"="department_store"](around:${radiusMeters},${lat},${lng});
        );
        out center;
      `,
      metro: `
        [out:json][timeout:25];
        (
          node["railway"="station"](around:${radiusMeters},${lat},${lng});
          node["public_transport"="station"](around:${radiusMeters},${lat},${lng});
          node["railway"="subway_entrance"](around:${radiusMeters},${lat},${lng});
          node["amenity"="bus_station"](around:${radiusMeters},${lat},${lng});
          way["amenity"="bus_station"](around:${radiusMeters},${lat},${lng});
          node["public_transport"="stop_position"](around:${radiusMeters},${lat},${lng});
          node["highway"="bus_stop"](around:${radiusMeters},${lat},${lng});
        );
        out center;
      `
    };

    try {
      const query = queries[category as keyof typeof queries];
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: query
      });
      
      const data = await response.json();
      
      const processedPlaces: Place[] = data.elements
        .filter((element: any) => element.tags?.name)
        .map((element: any) => {
          const elementLat = element.lat || element.center?.lat;
          const elementLon = element.lon || element.center?.lon;
          
          if (!elementLat || !elementLon) return null;
          
          const distance = calculateDistance(lat, lng, elementLat, elementLon);
          
          return {
            name: element.tags.name,
            position: [elementLat, elementLon] as [number, number],
            distance: Math.round(distance * 100) / 100,
            address: element.tags['addr:full'] || element.tags['addr:street'] || element.tags['addr:city'] || element.tags.address,
            description: getPlaceDescription(category, element.tags)
          };
        })
        .filter((place: Place | null) => place !== null)
        .sort((a: Place, b: Place) => a.distance - b.distance)
        .slice(0, 20); // Increased limit

      console.log(`Found ${processedPlaces.length} ${category} near the location`);
      setPlaces(prev => ({ ...prev, [category]: processedPlaces }));
    } catch (error) {
      console.error(`Error fetching ${category}:`, error);
      setPlaces(prev => ({ ...prev, [category]: [] }));
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  const getPlaceDescription = (category: string, tags: any): string => {
    switch (category) {
      case 'schools':
        if (tags['amenity'] === 'university') return 'University';
        if (tags['amenity'] === 'college') return 'College';
        return 'School';
      case 'hospitals':
        if (tags['amenity'] === 'clinic' || tags['healthcare'] === 'clinic') return 'Medical Clinic';
        if (tags['healthcare'] === 'hospital') return 'Healthcare Facility';
        return 'Hospital';
      case 'malls':
        if (tags['shop'] === 'supermarket') return 'Supermarket';
        if (tags['shop'] === 'department_store') return 'Department Store';
        if (tags['amenity'] === 'marketplace') return 'Marketplace';
        if (tags['building'] === 'retail') return 'Retail Building';
        return 'Shopping Mall';
      case 'metro':
        if (tags['amenity'] === 'bus_station') return 'Bus Station';
        if (tags['highway'] === 'bus_stop') return 'Bus Stop';
        if (tags['railway'] === 'subway_entrance') return 'Metro Entrance';
        if (tags['public_transport'] === 'station') return 'Public Transport';
        if (tags['public_transport'] === 'stop_position') return 'Transit Stop';
        return 'Railway Station';
      default:
        return '';
    }
  };

  const markerColors = {
    schools: '#10b981', // green
    hospitals: '#ef4444', // red
    malls: '#3b82f6', // blue
    metro: '#8b5cf6' // violet
  };

  const categoryIcons = {
    schools: School,
    hospitals: Hospital,
    malls: ShoppingBag,
    metro: Train
  };

  // Fetch places when location, category, or radius changes
  useEffect(() => {
    fetchNearbyPlaces(activeTab);
  }, [currentLocation, activeTab, radius]);

  const createCustomIcon = (color: string, iconType: string) => {
    const iconSvg = {
      schools: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 22v-4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4"/><path d="M22 7s0-2-3-2-3 2-3 2v6c0 .6.4 1 1 1h4c.6 0 1-.4 1-1V7z"/><path d="M2 7s0-2 3-2 3 2 3 2v6c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V7z"/><circle cx="11" cy="12" r="1"/></svg>`,
      hospitals: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12"/><path d="M6 12h12"/><circle cx="12" cy="12" r="10"/></svg>`,
      malls: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
      metro: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M7 15h10"/><path d="M12 4v16"/><path d="M8 11h8"/></svg>`
    };
    
    return new L.DivIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 3px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">${iconSvg[iconType as keyof typeof iconSvg]}</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
      className: 'custom-marker'
    });
  };

  const createMainLocationIcon = () => {
    return new L.DivIcon({
      html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#dc2626" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
      className: 'main-location-marker'
    });
  };

  const refreshLocationData = () => {
    fetchLocationDetails(currentLocation[0], currentLocation[1]);
    fetchNearbyPlaces(activeTab);
  };

  return (
    <div className="space-y-4">
      {/* Location Details Card */}
      {locationDetails && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Location Details</h3>
            </div>
            <Button
              onClick={refreshLocationData}
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Area:</span>
                <div className="font-medium">{locationDetails.area}</div>
              </div>
              <div>
                <span className="text-gray-600">City:</span>
                <div className="font-medium">{locationDetails.city}</div>
              </div>
            </div>
            <div>
              <span className="text-gray-600">Full Address:</span>
              <div className="font-medium text-xs mt-1 break-words">{locationDetails.fullAddress}</div>
            </div>
            <div className="text-xs text-gray-500 bg-white p-2 rounded border">
              <strong>Coordinates:</strong> {currentLocation[0].toFixed(6)}, {currentLocation[1].toFixed(6)}
            </div>
          </div>
        </Card>
      )}

      {/* Map */}
      <div className="h-80 rounded-lg overflow-hidden border">
        <MapContainer 
          center={currentLocation} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          key={`${currentLocation[0]}-${currentLocation[1]}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={currentLocation} icon={createMainLocationIcon()}>
            <Popup>
              <div className="text-sm font-medium">{locationName}</div>
              <div className="text-xs text-gray-600">Property Location</div>
              <div className="text-xs text-gray-500 mt-1">
                {locationDetails?.area}, {locationDetails?.city}
              </div>
            </Popup>
          </Marker>

          <Circle 
            center={currentLocation}
            radius={radius * 1000}
            pathOptions={{ 
              fillColor: 'blue', 
              fillOpacity: 0.1, 
              color: 'blue', 
              weight: 1,
              dashArray: '5, 5'
            }}
          />
          
          {places[activeTab].map((place, index) => (
            <Marker 
              key={`${activeTab}-${index}`}
              position={place.position}
              icon={createCustomIcon(markerColors[activeTab as keyof typeof markerColors], activeTab)}
            >
              <Popup>
                <div className="text-sm font-medium">{place.name}</div>
                <div className="text-xs text-gray-600">{place.distance} km away</div>
                {place.description && <div className="text-xs mt-1">{place.description}</div>}
                {place.address && <div className="text-xs text-gray-500">{place.address}</div>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="schools" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 h-auto">
          <TabsTrigger value="schools" className="flex items-center gap-1.5 py-2 text-xs">
            <School className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Schools</span>
            {places.schools.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs px-1">
                {places.schools.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="hospitals" className="flex items-center gap-1.5 py-2 text-xs">
            <Hospital className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hospitals</span>
            {places.hospitals.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs px-1">
                {places.hospitals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="malls" className="flex items-center gap-1.5 py-2 text-xs">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Malls</span>
            {places.malls.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs px-1">
                {places.malls.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="metro" className="flex items-center gap-1.5 py-2 text-xs">
            <Train className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Transport</span>
            {places.metro.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs px-1">
                {places.metro.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        {Object.keys(places).map((category) => (
          <TabsContent key={category} value={category} className="mt-3">
            {loading[category] ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span className="text-sm">Loading nearby {category}...</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Found {places[category].length} {category} within {radius} km
                  </div>
                  <Button
                    onClick={() => fetchNearbyPlaces(category)}
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refresh
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {places[category].length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500 text-sm">
                      <div className="mb-2">No {category} found within {radius} km radius</div>
                      <div className="text-xs">Try increasing the search radius</div>
                    </div>
                  ) : (
                    places[category].map((place, index) => {
                      const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
                      return (
                        <Card key={index} className="p-3 border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-2.5">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-content flex-shrink-0"
                              style={{ backgroundColor: markerColors[category as keyof typeof markerColors] }}
                            >
                              <IconComponent className="w-4 h-4 text-white mx-auto" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 text-sm">{place.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {place.distance} km
                                </Badge>
                                {place.description && (
                                  <span className="text-xs text-gray-500">{place.description}</span>
                                )}
                              </div>
                              {place.address && (
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{place.address}</p>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="text-xs text-gray-500 text-center">
        Search radius: {radius} km • Data from OpenStreetMap • Location: {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}
      </div>
    </div>
  );
};

const EnhancedNearbyPlaces = () => {
  // Default to Bangalore Central coordinates (12.9716, 77.5946) instead of [0, 0]
  const [location, setLocation] = useState<[number, number]>([12.9716, 77.5946]);
  const [locationName, setLocationName] = useState('Detecting Location...');
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    city: 'Loading...',
    state: 'Loading...',
    country: 'Loading...',
    area: 'Loading...',
    fullAddress: 'Fetching address details...'
  });
  const [radius, setRadius] = useState(2);
  const [travelDestinations, setTravelDestinations] = useState<TravelDestination[]>([]);
  const [newDestination, setNewDestination] = useState('');
  const [showTravelTime, setShowTravelTime] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [connectingRoads, setConnectingRoads] = useState<{name: string; distance: string}[]>([]);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Handle location info updates from NearbyPlaces component
  const handleLocationInfoUpdate = (info: LocationInfo) => {
    console.log('Received location info update:', info);
    setLocationInfo(info);
    
    // Auto-update location name based on the fetched location details
    const detectedLocationName = `${info.area}, ${info.city}`;
    setLocationName(detectedLocationName);
    setIsLocationLoading(false);
    
    console.log(`Location updated to: ${detectedLocationName}`);
  };

  // Function to update location with coordinates
  const updateLocation = (lat: number, lng: number, name?: string) => {
    console.log(`Manually updating location to: ${lat}, ${lng}${name ? ` (${name})` : ''}`);
    setIsLocationLoading(true);
    setLocation([lat, lng]);
    if (name && name !== 'Custom Location') {
      setLocationName(name);
    } else {
      setLocationName('Detecting Location...');
    }
    getNearbyRoads(lat, lng);
  };

  // Function to get nearby roads
  const getNearbyRoads = async (lat: number, lng: number) => {
    console.log(`Fetching nearby roads for: ${lat}, ${lng}`);
    try {
      const radiusMeters = 2000; // 2km radius for roads
      const query = `
        [out:json][timeout:25];
        (
          way["highway"~"^(primary|secondary|tertiary|trunk|motorway|residential)$"](around:${radiusMeters},${lat},${lng});
        );
        out geom;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: query
      });
      
      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const roads = data.elements
          .filter((road: any) => road.tags?.name)
          .slice(0, 6)
          .map((road: any) => {
            // Calculate approximate distance to road
            const roadLat = road.geometry?.[0]?.lat || lat;
            const roadLng = road.geometry?.[0]?.lon || lng;
            const distance = calculateStraightLineDistance(lat, lng, roadLat, roadLng);
            
            return {
              name: road.tags.name,
              distance: `${Math.round(distance * 10) / 10} km`
            };
          });
        
        console.log(`Found ${roads.length} nearby roads`);
        setConnectingRoads(roads);
      } else {
        console.log('No roads found, using fallback');
        setConnectingRoads([
          { name: 'Main Road Access', distance: '0.5 km' },
          { name: 'Local Road', distance: '0.2 km' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching roads:', error);
      setConnectingRoads([
        { name: 'Main Road Access', distance: '0.5 km' },
        { name: 'Local Road', distance: '0.2 km' }
      ]);
    }
  };

  // Initialize with current location
  useEffect(() => {
    const [lat, lng] = location;
    getNearbyRoads(lat, lng);
  }, [location]);

  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      // Include current location's country in search for better results
      const countryCode = locationInfo.country.toLowerCase().includes('india') ? 'in' : '';
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5${countryCode ? `&countrycodes=${countryCode}` : ''}&addressdetails=1`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSearch = (query: string) => {
    setNewDestination(query);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(query);
    }, 300);
  };

  const calculateTravelTime = async (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=false&alternatives=false&steps=false`
      );
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const durationMinutes = Math.round(route.duration / 60);
        const distanceKm = Math.round(route.distance / 1000 * 10) / 10;
        
        const minTime = durationMinutes;
        const maxTime = Math.round(durationMinutes * 1.5);
        
        return {
          travelTime: `${minTime} - ${maxTime} mins`,
          distance: distanceKm
        };
      }
    } catch (error) {
      console.error('Error calculating travel time:', error);
    }
    
    const distance = calculateStraightLineDistance(fromLat, fromLng, toLat, toLng);
    const estimatedTime = Math.round(distance * 3);
    return {
      travelTime: `${estimatedTime} - ${Math.round(estimatedTime * 1.3)} mins`,
      distance: Math.round(distance * 10) / 10
    };
  };

  const calculateStraightLineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const addTravelDestination = async (suggestion: LocationSuggestion) => {
    if (travelDestinations.length >= 3) return;
    
    const newDest: TravelDestination = {
      id: Date.now().toString(),
      name: suggestion.display_name.split(',')[0],
      address: suggestion.display_name,
      position: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)],
      calculating: true
    };
    
    setTravelDestinations(prev => [...prev, newDest]);
    setNewDestination('');
    setSuggestions([]);
    
    const travelData = await calculateTravelTime(
      parseFloat(suggestion.lat),
      parseFloat(suggestion.lon),
      location[0],
      location[1]
    );
    
    setTravelDestinations(prev => 
      prev.map(dest => 
        dest.id === newDest.id 
          ? { ...dest, ...travelData, calculating: false }
          : dest
      )
    );
  };

  const removeTravelDestination = (id: string) => {
    setTravelDestinations(travelDestinations.filter(dest => dest.id !== id));
  };

  // Function to manually set coordinates (useful for testing)
  const setCoordinatesManually = () => {
    const lat = prompt('Enter latitude:', location[0].toString());
    const lng = prompt('Enter longitude:', location[1].toString());
    
    if (lat && lng) {
      const newLat = parseFloat(lat);
      const newLng = parseFloat(lng);
      
      if (!isNaN(newLat) && !isNaN(newLng)) {
        updateLocation(newLat, newLng, 'Custom Location');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            {isLocationLoading ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Building className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">
              {isLocationLoading ? 'Detecting Location...' : locationName}
            </h1>
            <p className="text-sm text-gray-600">
              {isLocationLoading ? 'Fetching address details...' : `${locationInfo.area}, ${locationInfo.city}`}
            </p>
            <p className="text-xs text-gray-500">
              {isLocationLoading ? 'Please wait...' : `${locationInfo.state}, ${locationInfo.country}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={setCoordinatesManually}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Navigation className="w-3 h-3 mr-1" />
              Change
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Location Name:</label>
            <Input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="max-w-xs text-sm h-8"
              placeholder="Enter custom location name"
              disabled={isLocationLoading}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Search Radius:</label>
            <Select value={radius.toString()} onValueChange={(value) => setRadius(parseInt(value))}>
              <SelectTrigger className="w-32 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 km radius</SelectItem>
                <SelectItem value="2">2 km radius</SelectItem>
                <SelectItem value="3">3 km radius</SelectItem>
                <SelectItem value="5">5 km radius</SelectItem>
                <SelectItem value="10">10 km radius</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Current coordinates display */}
          <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md border">
            📍 Coordinates: {location[0].toFixed(6)}, {location[1].toFixed(6)}
          </div>
          
          {!isLocationLoading && (
            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
              ✅ Location Detected
            </div>
          )}
        </div>
      </div>

      {/* Travel Time Section */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <h2 className="text-sm font-medium">Travel Time to {locationName}</h2>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="relative flex-1">
              <Input
                type="text"
                value={newDestination}
                onChange={(e) => handleLocationSearch(e.target.value)}
                className="text-sm h-8 pr-8"
                placeholder="Enter starting point (office, school, etc.)"
                disabled={travelDestinations.length >= 3}
              />
              <MapPin className="absolute right-2 top-1.5 w-4 h-4 text-gray-400" />
              
              {suggestions.length > 0 && (
                <div className="absolute top-9 left-0 right-0 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      onClick={() => addTravelDestination(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b last:border-b-0"
                      disabled={travelDestinations.length >= 3}
                    >
                      <div className="font-medium">{suggestion.display_name.split(',')[0]}</div>
                      <div className="text-xs text-gray-500 truncate">{suggestion.display_name}</div>
                    </button>
                  ))}
                </div>
              )}
              
              {isSearching && newDestination.length >= 3 && (
                <div className="absolute top-9 left-0 right-0 bg-white border rounded-md shadow-lg z-10 p-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Searching locations...
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">to</span>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-sm font-medium">{locationName}</span>
            </div>
          </div>

          {travelDestinations.length > 0 && (
            <Button
              onClick={() => setShowTravelTime(!showTravelTime)}
              variant="outline"
              className="w-full h-8 text-sm"
            >
              <Plus className="w-3 h-3 mr-1" />
              {showTravelTime ? 'Hide' : 'Show'} Travel Times ({travelDestinations.length})
            </Button>
          )}

          {showTravelTime && travelDestinations.length > 0 && (
            <div className="space-y-2">
              {travelDestinations.map((dest) => (
                <div key={dest.id} className="p-3 bg-white border rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{dest.name}</div>
                      <div className="text-xs text-gray-500 line-clamp-2 break-words">{dest.address}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {dest.calculating ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span className="text-xs text-gray-500 whitespace-nowrap">Calculating...</span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <Badge variant="secondary" className="text-xs mb-1">
                            {dest.travelTime}
                          </Badge>
                          {dest.distance && (
                            <div className="text-xs text-gray-500 whitespace-nowrap">
                              {dest.distance} km
                            </div>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => removeTravelDestination(dest.id)}
                        className="p-1 hover:bg-gray-100 rounded mt-1"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {travelDestinations.length >= 3 && (
                <div className="text-xs text-gray-500 text-center py-2">
                  Maximum 3 locations allowed
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Connecting Roads */}
      {connectingRoads.length > 0 && (
        <Card className="p-4">
          <h2 className="text-sm font-medium mb-3">Connecting Roads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {connectingRoads.map((road, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm font-medium truncate flex-1">{road.name}</span>
                <span className="text-xs text-gray-500 whitespace-nowrap">~ {road.distance}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Nearby Places Component */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Nearby Places</h2>
          <p className="text-sm text-gray-600">
            Discover schools, hospitals, malls, and transport options around your location
          </p>
        </div>
        <div className="p-4">
          <NearbyPlaces 
            center={location} 
            locationName={locationName}
            radius={radius}
            onLocationInfoUpdate={handleLocationInfoUpdate}
          />
        </div>
      </Card>
    </div>
  );
};

export default EnhancedNearbyPlaces;