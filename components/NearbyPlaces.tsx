import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { School, Building, ShoppingBag, Train, Hospital, Loader2 } from 'lucide-react';
import L from 'leaflet';

// Define interfaces
interface Place {
  name: string;
  position: [number, number];
  distance: number;
  description?: string;
  address?: string;
  rating?: number;
}

interface NearbyPlacesProps {
  center: [number, number];
  locationName?: string;
  radius?: number;
}

const NearbyPlaces = ({ center, locationName = 'Selected Location', radius = 2 }: any) => {
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
    
    const [lat, lng] = center;
    const radiusMeters = radius * 1000;
    
    const queries = {
      schools: `
        [out:json][timeout:25];
        (
          node["amenity"="school"](around:${radiusMeters},${lat},${lng});
          way["amenity"="school"](around:${radiusMeters},${lat},${lng});
          node["amenity"="university"](around:${radiusMeters},${lat},${lng});
          way["amenity"="university"](around:${radiusMeters},${lat},${lng});
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
        );
        out center;
      `,
      metro: `
        [out:json][timeout:25];
        (
          node["railway"="station"]["station"="subway"](around:${radiusMeters},${lat},${lng});
          node["public_transport"="station"]["railway"="subway"](around:${radiusMeters},${lat},${lng});
          node["railway"="subway_entrance"](around:${radiusMeters},${lat},${lng});
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
            address: element.tags['addr:full'] || element.tags['addr:street'],
            description: getPlaceDescription(category, element.tags)
          };
        })
        .filter((place: Place | null) => place !== null)
        .sort((a: Place, b: Place) => a.distance - b.distance)
        .slice(0, 10); // Limit to 10 closest places

      setPlaces(prev => ({ ...prev, [category]: processedPlaces }));
    } catch (error) {
      console.error(`Error fetching ${category}:`, error);
      // Fallback to mock data on error
      setPlaces(prev => ({ ...prev, [category]: getMockData(category, center) }));
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  // Generate description based on category and tags
  const getPlaceDescription = (category: string, tags: any): string => {
    switch (category) {
      case 'schools':
        return tags['school:type'] || tags['amenity'] === 'university' ? 'University' : 'School';
      case 'hospitals':
        return tags['amenity'] === 'clinic' ? 'Medical Clinic' : 'Hospital';
      case 'malls':
        return tags['building'] === 'retail' ? 'Retail Building' : 'Shopping Mall';
      case 'metro':
        return 'Metro Station';
      default:
        return '';
    }
  };


  const getMockData = (category: string, center: [number, number]): any => {
    const [lat, lng] = center;
    const mockData = {
      schools: [
        { name: 'Local Public School', position: [lat + 0.01, lng + 0.01], distance: 1.1 },
        { name: 'Community High School', position: [lat - 0.008, lng + 0.012], distance: 1.3 }
      ],
      hospitals: [
        { name: 'City General Hospital', position: [lat + 0.012, lng - 0.008], distance: 1.4 },
        { name: 'Medical Center', position: [lat - 0.006, lng - 0.01], distance: 1.0 }
      ],
      malls: [
        { name: 'Central Mall', position: [lat + 0.005, lng + 0.008], distance: 0.8 },
        { name: 'Shopping Complex', position: [lat - 0.01, lng + 0.006], distance: 1.2 }
      ],
      metro: [
        { name: 'Metro Station A', position: [lat + 0.008, lng - 0.005], distance: 0.9 },
        { name: 'Metro Station B', position: [lat - 0.012, lng + 0.008], distance: 1.5 }
      ]
    };
    
    return mockData[category as keyof typeof mockData] || [];
  };

  // Custom marker colors
  const markerColors = {
    schools: 'green',
    hospitals: 'red',
    malls: 'blue',
    metro: 'violet'
  };

  const categoryIcons = {
    schools: School,
    hospitals: Hospital,
    malls: ShoppingBag,
    metro: Train
  };

  // Load places when component mounts or center changes
  useEffect(() => {
    fetchNearbyPlaces(activeTab);
  }, [center, activeTab, radius]);

  // Create custom icon
  const createCustomIcon = (color: string) => {
    // Using a simple colored circle as fallback since external marker images might not load
    return new L.DivIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.4);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10],
      className: 'custom-marker'
    });
  };

  return (
    <div className="space-y-4">
      <div className="h-96 rounded-xl overflow-hidden border">
        <MapContainer 
          center={center} 
          zoom={14} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Main location marker */}
          <Marker position={center}>
            <Popup>
              <div className="font-medium">{locationName}</div>
              <div className="text-sm text-gray-600">Property Location</div>
            </Popup>
          </Marker>

          {/* Search radius circle */}
          <Circle 
            center={center}
            radius={radius * 1000}
            pathOptions={{ 
              fillColor: 'blue', 
              fillOpacity: 0.1, 
              color: 'blue', 
              weight: 1,
              dashArray: '5, 5'
            }}
          />
          
          {/* Place markers */}
          {places[activeTab].map((place, index) => (
            <Marker 
              key={`${activeTab}-${index}`}
              position={place.position}
              icon={createCustomIcon(markerColors[activeTab as keyof typeof markerColors])}
            >
              <Popup>
                <div className="font-medium">{place.name}</div>
                <div className="text-sm text-gray-600">{place.distance} km away</div>
                {place.description && <div className="text-xs mt-1">{place.description}</div>}
                {place.address && <div className="text-xs text-gray-500">{place.address}</div>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <Tabs defaultValue="schools" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 h-auto">
          <TabsTrigger value="schools" className="flex items-center gap-2 py-2">
            <School className="h-4 w-4" />
            <span className="hidden sm:inline">Schools</span>
          </TabsTrigger>
          <TabsTrigger value="hospitals" className="flex items-center gap-2 py-2">
            <Hospital className="h-4 w-4" />
            <span className="hidden sm:inline">Hospitals</span>
          </TabsTrigger>
          <TabsTrigger value="malls" className="flex items-center gap-2 py-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Malls</span>
          </TabsTrigger>
          <TabsTrigger value="metro" className="flex items-center gap-2 py-2">
            <Train className="h-4 w-4" />
            <span className="hidden sm:inline">Metro</span>
          </TabsTrigger>
        </TabsList>
        
        {Object.keys(places).map((category) => (
          <TabsContent key={category} value={category} className="mt-4">
            {loading[category] ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading nearby {category}...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {places[category].length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No {category} found within {radius} km radius
                  </div>
                ) : (
                  places[category].map((place, index) => {
                    const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
                    return (
                      <Card key={index} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{place.name}</h3>
                            <p className="text-sm text-gray-600">{place.distance} km away</p>
                            {place.description && <p className="text-xs text-gray-500 mt-1">{place.description}</p>}
                            {place.address && <p className="text-xs text-gray-400 mt-1">{place.address}</p>}
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="text-xs text-gray-500 text-center">
        Search radius: {radius} km • Data from OpenStreetMap
      </div>
    </div>
  );
};

// Example usage component
const ExampleUsage = () => {
  // Example coordinates (Bangalore, Indiranagar)
  const [location, setLocation] = useState<[number, number]>([12.9716, 77.6412]);
  const [locationName, setLocationName] = useState('Indiranagar, Bangalore');
  const [radius, setRadius] = useState(2);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dynamic Nearby Places Finder</h1>
        <p className="text-gray-600">Find schools, hospitals, malls, and metro stations near any location</p>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={location[0]}
              onChange={(e) => setLocation([parseFloat(e.target.value) || 0, location[1]])}
              className="w-full px-3 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={location[1]}
              onChange={(e) => setLocation([location[0], parseFloat(e.target.value) || 0])}
              className="w-full px-3 py-1 border rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Radius (km)</label>
            <select
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full px-3 py-1 border rounded text-sm"
            >
              <option value={1}>1 km</option>
              <option value={2}>2 km</option>
              <option value={3}>3 km</option>
              <option value={5}>5 km</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Location Name</label>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter location name"
          />
        </div>
      </div>
      
      <NearbyPlaces 
        center={location} 
        locationName={locationName}
        radius={radius}
      />
    </div>
  );
};

export default ExampleUsage;