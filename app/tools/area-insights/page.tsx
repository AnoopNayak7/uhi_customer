"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  TrendingUp, 
  Building, 
  Users, 
  Car,
  GraduationCap,
  Hospital,
  ShoppingCart,
  Train,
  Plane,
  Bus,
  Coffee,
  TreePine,
  Shield,
  Zap,
  Wifi,
  Star,
  Clock,
  IndianRupee,
  BarChart3,
  Home,
  Briefcase,
  Baby,
  Utensils
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const cities = [
  'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'
];

export default function AreaInsightsPage() {
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [selectedArea, setSelectedArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [areaData, setAreaData] = useState<any>(null);
  const [areas, setAreas] = useState<any[]>([]);

  useEffect(() => {
    setAreas(getAreasForCity(selectedCity));
    setSelectedArea('');
    setAreaData(null);
  }, [selectedCity]);

  const getAreasForCity = (city: string) => {
    const cityAreas = {
      'Bangalore': [
        'Whitefield', 'Koramangala', 'Indiranagar', 'Electronic City', 
        'Sarjapur Road', 'Hebbal', 'JP Nagar', 'Marathahalli', 'HSR Layout', 'Bellandur'
      ],
      'Mumbai': [
        'Bandra', 'Andheri', 'Powai', 'Thane', 'Navi Mumbai', 
        'Malad', 'Goregaon', 'Kandivali', 'Borivali', 'Juhu'
      ],
      'Delhi': [
        'Gurgaon', 'Noida', 'Dwarka', 'Rohini', 'Lajpat Nagar', 
        'Vasant Kunj', 'Greater Noida', 'Faridabad', 'Connaught Place', 'Karol Bagh'
      ],
      'Chennai': [
        'Anna Nagar', 'T. Nagar', 'Velachery', 'Adyar', 'Porur', 
        'OMR', 'Tambaram', 'Chrompet', 'Mylapore', 'Nungambakkam'
      ],
      'Hyderabad': [
        'Hitech City', 'Gachibowli', 'Kondapur', 'Madhapur', 'Banjara Hills', 
        'Jubilee Hills', 'Kukatpally', 'Miyapur', 'Secunderabad', 'Begumpet'
      ],
      'Pune': [
        'Koregaon Park', 'Hinjewadi', 'Wakad', 'Baner', 'Aundh', 
        'Kharadi', 'Magarpatta', 'Hadapsar', 'Viman Nagar', 'Kalyani Nagar'
      ]
    };

    return cityAreas[city as keyof typeof cityAreas] || cityAreas['Bangalore'];
  };

  const fetchAreaInsights = async () => {
    if (!selectedArea) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = generateAreaInsights(selectedCity, selectedArea);
      setAreaData(mockData);
    } catch (error) {
      console.error('Error fetching area insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAreaInsights = (city: string, area: string) => {
    // Base data for different cities and areas
    const baseData:any = {
      'Bangalore': {
        'Whitefield': { basePrice: 7800, growth: 12, safety: 85, connectivity: 90 },
        'Koramangala': { basePrice: 9750, growth: 8, safety: 90, connectivity: 95 },
        'Indiranagar': { basePrice: 9100, growth: 6, safety: 88, connectivity: 92 },
        'Electronic City': { basePrice: 5850, growth: 15, safety: 82, connectivity: 85 },
        'Sarjapur Road': { basePrice: 7150, growth: 18, safety: 80, connectivity: 88 }
      },
      'Mumbai': {
        'Bandra': { basePrice: 36000, growth: 5, safety: 92, connectivity: 98 },
        'Andheri': { basePrice: 23400, growth: 8, safety: 85, connectivity: 95 },
        'Powai': { basePrice: 25200, growth: 10, safety: 88, connectivity: 90 }
      }
    };

    const areaInfo:any = baseData[city as keyof typeof baseData]?.[area as keyof typeof baseData['Bangalore']] || 
                    { basePrice: 8000, growth: 10, safety: 85, connectivity: 88 };

    return {
      overview: {
        name: area,
        city: city,
        avgPrice: areaInfo.basePrice,
        growth: areaInfo.growth,
        safety: areaInfo.safety,
        connectivity: areaInfo.connectivity,
        livability: Math.round((areaInfo.safety + areaInfo.connectivity + 80) / 3),
        population: Math.round(Math.random() * 200000 + 50000),
        pincode: Math.floor(Math.random() * 99999 + 100000)
      },
      priceAnalysis: {
        residential: [
          { type: '1 BHK', avgPrice: Math.round(areaInfo.basePrice * 600), range: '₹45L - ₹65L' },
          { type: '2 BHK', avgPrice: Math.round(areaInfo.basePrice * 900), range: '₹65L - ₹95L' },
          { type: '3 BHK', avgPrice: Math.round(areaInfo.basePrice * 1200), range: '₹95L - ₹1.4Cr' },
          { type: '4+ BHK', avgPrice: Math.round(areaInfo.basePrice * 1800), range: '₹1.4Cr - ₹2.2Cr' }
        ],
        commercial: [
          { type: 'Office Space', rate: Math.round(areaInfo.basePrice * 1.2), unit: 'per sqft' },
          { type: 'Retail Shop', rate: Math.round(areaInfo.basePrice * 1.5), unit: 'per sqft' },
          { type: 'Warehouse', rate: Math.round(areaInfo.basePrice * 0.8), unit: 'per sqft' }
        ]
      },
      demographics: {
        ageGroups: [
          { name: '18-25', value: 25, color: '#3b82f6' },
          { name: '26-35', value: 35, color: '#10b981' },
          { name: '36-50', value: 28, color: '#f59e0b' },
          { name: '50+', value: 12, color: '#ef4444' }
        ],
        familyTypes: [
          { name: 'Young Professionals', percentage: 40 },
          { name: 'Nuclear Families', percentage: 35 },
          { name: 'Joint Families', percentage: 15 },
          { name: 'Senior Citizens', percentage: 10 }
        ]
      },
      infrastructure: {
        transportation: {
          metro: Math.random() > 0.5,
          bus: true,
          auto: true,
          taxi: true,
          score: areaInfo.connectivity
        },
        utilities: {
          electricity: Math.round(85 + Math.random() * 10),
          water: Math.round(80 + Math.random() * 15),
          internet: Math.round(90 + Math.random() * 8),
          waste: Math.round(75 + Math.random() * 20)
        }
      },
      amenities: {
        education: {
          schools: Math.round(Math.random() * 20 + 10),
          colleges: Math.round(Math.random() * 5 + 2),
          rating: Math.round(Math.random() * 2 + 3.5)
        },
        healthcare: {
          hospitals: Math.round(Math.random() * 8 + 3),
          clinics: Math.round(Math.random() * 25 + 15),
          rating: Math.round(Math.random() * 1.5 + 3.5)
        },
        shopping: {
          malls: Math.round(Math.random() * 5 + 2),
          markets: Math.round(Math.random() * 10 + 5),
          rating: Math.round(Math.random() * 1.5 + 3.5)
        },
        recreation: {
          parks: Math.round(Math.random() * 8 + 3),
          gyms: Math.round(Math.random() * 15 + 8),
          restaurants: Math.round(Math.random() * 50 + 30)
        }
      },
      trends: {
        priceHistory: generatePriceHistory(areaInfo.basePrice, areaInfo.growth),
        demandSupply: generateDemandSupplyData(),
        futureProjects: [
          { name: 'Metro Extension', completion: '2025', impact: 'High' },
          { name: 'IT Park Development', completion: '2024', impact: 'Medium' },
          { name: 'Shopping Complex', completion: '2026', impact: 'Medium' }
        ]
      },
      livabilityScore: {
        overall: Math.round((areaInfo.safety + areaInfo.connectivity + 80 + 85 + 78) / 5),
        factors: [
          { name: 'Safety', score: areaInfo.safety, max: 100 },
          { name: 'Connectivity', score: areaInfo.connectivity, max: 100 },
          { name: 'Environment', score: 80, max: 100 },
          { name: 'Social Infrastructure', score: 85, max: 100 },
          { name: 'Economic Factors', score: 78, max: 100 }
        ]
      }
    };
  };

  const generatePriceHistory = (basePrice: number, growth: number) => {
    const data = [];
    for (let i = 12; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const variation = (Math.random() - 0.5) * 0.1;
      const price = Math.round(basePrice * (1 + (growth / 100) * (i / 12) + variation));
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        price: price
      });
    }
    return data;
  };

  const generateDemandSupplyData = () => {
    return [
      { month: 'Jan', demand: 85, supply: 70 },
      { month: 'Feb', demand: 88, supply: 72 },
      { month: 'Mar', demand: 92, supply: 75 },
      { month: 'Apr', demand: 90, supply: 78 },
      { month: 'May', demand: 95, supply: 80 },
      { month: 'Jun', demand: 93, supply: 82 }
    ];
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-50 to-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Area Insights
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore comprehensive neighborhood statistics, demographics, and livability scores
              </p>
            </div>

            {/* Filters */}
            <Card className="max-w-3xl mx-auto">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {city}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area/Locality</label>
                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button 
                      onClick={fetchAreaInsights}
                      disabled={!selectedArea || loading}
                      className="w-full bg-purple-500 hover:bg-purple-600"
                    >
                      {loading ? 'Loading...' : 'Get Insights'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results Section */}
        {areaData && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Avg Price/sqft</p>
                        <p className="text-2xl font-bold text-purple-600">
                          ₹{areaData.overview.avgPrice.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          +{areaData.overview.growth}% YoY
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-purple-50">
                        <IndianRupee className="w-6 h-6 text-purple-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Livability Score</p>
                        <p className="text-2xl font-bold text-green-600">
                          {areaData.livabilityScore.overall}/100
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Excellent</p>
                      </div>
                      <div className="p-3 rounded-full bg-green-50">
                        <Star className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Safety Rating</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {areaData.overview.safety}/100
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Very Safe</p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-50">
                        <Shield className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Population</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {(areaData.overview.population / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Residents</p>
                      </div>
                      <div className="p-3 rounded-full bg-orange-50">
                        <Users className="w-6 h-6 text-orange-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Price Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Home className="w-5 h-5" />
                      <span>Residential Pricing</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {areaData.priceAnalysis.residential.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-900">{item.type}</span>
                            <p className="text-sm text-gray-600">{item.range}</p>
                          </div>
                          <span className="font-bold text-purple-600">
                            {formatPrice(item.avgPrice)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5" />
                      <span>Commercial Rates</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {areaData.priceAnalysis.commercial.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{item.type}</span>
                          <span className="font-bold text-blue-600">
                            ₹{item.rate.toLocaleString()}/{item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Age Demographics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={areaData.demographics.ageGroups}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {areaData.demographics.ageGroups.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {areaData.demographics.ageGroups.map((item: any, index: number) => (
                        <div key={index} className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Baby className="w-5 h-5" />
                      <span>Family Types</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {areaData.demographics.familyTypes.map((family: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">{family.name}</span>
                            <span className="text-sm font-bold text-gray-900">{family.percentage}%</span>
                          </div>
                          <Progress value={family.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Infrastructure & Amenities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>Infrastructure Quality</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Electricity</span>
                          <span className="text-sm font-bold text-gray-900">{areaData.infrastructure.utilities.electricity}%</span>
                        </div>
                        <Progress value={areaData.infrastructure.utilities.electricity} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Water Supply</span>
                          <span className="text-sm font-bold text-gray-900">{areaData.infrastructure.utilities.water}%</span>
                        </div>
                        <Progress value={areaData.infrastructure.utilities.water} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Internet</span>
                          <span className="text-sm font-bold text-gray-900">{areaData.infrastructure.utilities.internet}%</span>
                        </div>
                        <Progress value={areaData.infrastructure.utilities.internet} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Waste Management</span>
                          <span className="text-sm font-bold text-gray-900">{areaData.infrastructure.utilities.waste}%</span>
                        </div>
                        <Progress value={areaData.infrastructure.utilities.waste} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="w-5 h-5" />
                      <span>Amenities Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="font-bold text-gray-900">{areaData.amenities.education.schools}</div>
                        <div className="text-xs text-gray-600">Schools</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <Hospital className="w-6 h-6 text-red-500 mx-auto mb-2" />
                        <div className="font-bold text-gray-900">{areaData.amenities.healthcare.hospitals}</div>
                        <div className="text-xs text-gray-600">Hospitals</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <div className="font-bold text-gray-900">{areaData.amenities.shopping.malls}</div>
                        <div className="text-xs text-gray-600">Malls</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <Utensils className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <div className="font-bold text-gray-900">{areaData.amenities.recreation.restaurants}</div>
                        <div className="text-xs text-gray-600">Restaurants</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Price Trends */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Price History - {areaData.overview.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={areaData.trends.priceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [`₹${value.toLocaleString()}/sqft`, 'Price']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Livability Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Livability Score Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={areaData.livabilityScore.factors}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="name" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar
                            name="Score"
                            dataKey="score"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      {areaData.livabilityScore.factors.map((factor: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                            <span className="text-sm font-bold text-gray-900">{factor.score}/{factor.max}</span>
                          </div>
                          <Progress value={(factor.score / factor.max) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Default State */}
        {!areaData && !loading && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Area Insights
                  </h3>
                  <p className="text-gray-600">
                    Select a city and area to explore comprehensive neighborhood statistics
                  </p>
                </div>
              </Card>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}