"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Building, 
  Home, 
  TreePine,
  Briefcase,
  Store,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const cities = [
  'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'
];

const propertyTypes = [
  { value: 'flat', label: 'Apartment/Flat', icon: Building },
  { value: 'house', label: 'Independent House', icon: Home },
  { value: 'villa', label: 'Villa', icon: Home },
  { value: 'plot', label: 'Plot/Land', icon: TreePine },
  { value: 'office', label: 'Office Space', icon: Briefcase },
  { value: 'shop', label: 'Shop/Retail', icon: Store },
];

const timeRanges = [
  { value: '6m', label: 'Last 6 Months' },
  { value: '1y', label: 'Last 1 Year' },
  { value: '2y', label: 'Last 2 Years' },
  { value: '5y', label: 'Last 5 Years' },
];

export default function PriceTrendsPage() {
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [selectedPropertyType, setSelectedPropertyType] = useState('flat');
  const [selectedTimeRange, setSelectedTimeRange] = useState('1y');
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<any>(null);

  useEffect(() => {
    fetchPriceTrends();
  }, [selectedCity, selectedPropertyType, selectedTimeRange]);

  const fetchPriceTrends = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on selections
      const mockData = generateMockTrendData(selectedCity, selectedPropertyType, selectedTimeRange);
      setTrendData(mockData);
    } catch (error) {
      console.error('Error fetching price trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTrendData = (city: string, propertyType: string, timeRange: string) => {
    const basePrice = {
      'Bangalore': { flat: 6500, house: 8500, villa: 12000, plot: 4500, office: 9500, shop: 11000 },
      'Mumbai': { flat: 18000, house: 22000, villa: 35000, plot: 25000, office: 28000, shop: 32000 },
      'Delhi': { flat: 12000, house: 15000, villa: 25000, plot: 18000, office: 20000, shop: 24000 },
      'Chennai': { flat: 5500, house: 7500, villa: 11000, plot: 4000, office: 8500, shop: 10000 },
      'Hyderabad': { flat: 5000, house: 7000, villa: 10000, plot: 3500, office: 7500, shop: 9000 },
      'Pune': { flat: 7000, house: 9000, villa: 13000, plot: 5000, office: 10000, shop: 12000 },
    };

    const currentPrice = basePrice[city as keyof typeof basePrice]?.[propertyType as keyof typeof basePrice['Bangalore']] || 6000;
    
    // Generate trend data
    const months = timeRange === '6m' ? 6 : timeRange === '1y' ? 12 : timeRange === '2y' ? 24 : 60;
    const chartData = [];
    
    for (let i = months; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const price = Math.round(currentPrice * (1 + variation * (i / months)));
      
      chartData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        price: price,
        avgPrice: price + Math.round((Math.random() - 0.5) * 500)
      });
    }

    // Calculate growth
    const firstPrice = chartData[0]?.price || currentPrice;
    const lastPrice = chartData[chartData.length - 1]?.price || currentPrice;
    const growth = ((lastPrice - firstPrice) / firstPrice) * 100;

    // Generate area-wise data
    const areas = getAreasForCity(city);
    const areaData = areas.map(area => ({
      area: area.name,
      avgPrice: Math.round(currentPrice * area.multiplier),
      growth: Math.round((Math.random() - 0.3) * 20), // -6% to +14% growth
      properties: Math.round(Math.random() * 500 + 100)
    }));

    return {
      currentPrice,
      growth,
      chartData,
      areaData,
      insights: generateInsights(city, propertyType, growth)
    };
  };

  const getAreasForCity = (city: string) => {
    const cityAreas = {
      'Bangalore': [
        { name: 'Whitefield', multiplier: 1.2 },
        { name: 'Koramangala', multiplier: 1.5 },
        { name: 'Indiranagar', multiplier: 1.4 },
        { name: 'Electronic City', multiplier: 0.9 },
        { name: 'Sarjapur Road', multiplier: 1.1 },
        { name: 'Hebbal', multiplier: 1.0 },
        { name: 'JP Nagar', multiplier: 1.2 },
        { name: 'Marathahalli', multiplier: 1.1 }
      ],
      'Mumbai': [
        { name: 'Bandra', multiplier: 2.0 },
        { name: 'Andheri', multiplier: 1.3 },
        { name: 'Powai', multiplier: 1.4 },
        { name: 'Thane', multiplier: 0.8 },
        { name: 'Navi Mumbai', multiplier: 0.9 },
        { name: 'Malad', multiplier: 1.1 },
        { name: 'Goregaon', multiplier: 1.2 },
        { name: 'Kandivali', multiplier: 1.0 }
      ],
      'Delhi': [
        { name: 'Gurgaon', multiplier: 1.3 },
        { name: 'Noida', multiplier: 1.1 },
        { name: 'Dwarka', multiplier: 1.2 },
        { name: 'Rohini', multiplier: 0.9 },
        { name: 'Lajpat Nagar', multiplier: 1.4 },
        { name: 'Vasant Kunj', multiplier: 1.5 },
        { name: 'Greater Noida', multiplier: 0.8 },
        { name: 'Faridabad', multiplier: 0.9 }
      ]
    };

    return cityAreas[city as keyof typeof cityAreas] || cityAreas['Bangalore'];
  };

  const generateInsights = (city: string, propertyType: string, growth: number) => {
    return [
      `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} prices in ${city} have ${growth > 0 ? 'increased' : 'decreased'} by ${Math.abs(growth).toFixed(1)}% in the selected period.`,
      `Best time to ${growth > 5 ? 'sell' : 'buy'} based on current market trends.`,
      `High demand areas are showing premium pricing compared to city average.`,
      `Infrastructure development is positively impacting property values in key locations.`
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

  const selectedPropertyTypeData = propertyTypes.find(type => type.value === selectedPropertyType);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Property Price Trends
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Track real estate price movements and market trends across major Indian cities
              </p>
            </div>

            {/* Filters */}
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">City</Label>
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
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Property Type</Label>
                    <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center">
                              <type.icon className="w-4 h-4 mr-2" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Time Range</Label>
                    <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {range.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button 
                      onClick={fetchPriceTrends}
                      disabled={loading}
                      className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                      {loading ? 'Loading...' : 'Update Trends'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Results Section */}
        {trendData && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Average Price/sqft
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{trendData.currentPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-50">
                        {selectedPropertyTypeData && (
                          <selectedPropertyTypeData.icon className="w-6 h-6 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Price Growth
                        </p>
                        <p className={`text-2xl font-bold ${
                          trendData.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trendData.growth >= 0 ? '+' : ''}{trendData.growth.toFixed(1)}%
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${
                        trendData.growth >= 0 ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        {trendData.growth >= 0 ? (
                          <TrendingUp className="w-6 h-6 text-green-500" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-red-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Market Status
                        </p>
                        <p className={`text-lg font-bold ${
                          trendData.growth > 5 ? 'text-green-600' : 
                          trendData.growth < -2 ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {trendData.growth > 5 ? 'Bull Market' : 
                           trendData.growth < -2 ? 'Bear Market' : 'Stable Market'}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-gray-50">
                        <BarChart3 className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Best Action
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {trendData.growth > 5 ? 'Good to Sell' : 
                           trendData.growth < 0 ? 'Good to Buy' : 'Hold & Watch'}
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-50">
                        {trendData.growth > 0 ? (
                          <ArrowUp className="w-6 h-6 text-blue-500" />
                        ) : trendData.growth < 0 ? (
                          <ArrowDown className="w-6 h-6 text-blue-500" />
                        ) : (
                          <Minus className="w-6 h-6 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Price Trend Chart */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Price Trend - {selectedCity} ({selectedPropertyTypeData?.label})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={trendData.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [`₹${value.toLocaleString()}/sqft`, 'Price']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Area-wise Pricing */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Area-wise Pricing in {selectedCity}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {trendData.areaData.map((area: any, index: number) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <h4 className="font-semibold text-gray-900 mb-2">{area.area}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Avg Price/sqft</span>
                            <span className="font-bold text-blue-600">₹{area.avgPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Growth</span>
                            <span className={`font-medium ${
                              area.growth >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {area.growth >= 0 ? '+' : ''}{area.growth}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Properties</span>
                            <span className="text-sm text-gray-900">{area.properties}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Market Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendData.insights.map((insight: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}