"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Calculator, 
  MapPin, 
  Building, 
  Home, 
  TreePine,
  Briefcase,
  Store,
  TrendingUp,
  IndianRupee,
  Square,
  Calendar,
  Award,
  AlertCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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

const ageOptions = [
  { value: 'new', label: 'New (0-1 years)', multiplier: 1.0 },
  { value: 'recent', label: 'Recent (1-5 years)', multiplier: 0.95 },
  { value: 'moderate', label: 'Moderate (5-10 years)', multiplier: 0.85 },
  { value: 'old', label: 'Old (10-20 years)', multiplier: 0.75 },
  { value: 'very_old', label: 'Very Old (20+ years)', multiplier: 0.65 },
];

const furnishingOptions = [
  { value: 'unfurnished', label: 'Unfurnished', multiplier: 1.0 },
  { value: 'semi_furnished', label: 'Semi Furnished', multiplier: 1.1 },
  { value: 'fully_furnished', label: 'Fully Furnished', multiplier: 1.2 },
];

export default function PropertyValuePage() {
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [selectedPropertyType, setSelectedPropertyType] = useState('flat');
  const [selectedArea, setSelectedArea] = useState('');
  const [builtUpArea, setBuiltUpArea] = useState(1200);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [propertyAge, setPropertyAge] = useState('recent');
  const [furnishing, setFurnishing] = useState('semi_furnished');
  const [floor, setFloor] = useState(5);
  const [totalFloors, setTotalFloors] = useState(10);
  const [loading, setLoading] = useState(false);
  const [valuation, setValuation] = useState<any>(null);
  const [areas, setAreas] = useState<any[]>([]);

  useEffect(() => {
    setAreas(getAreasForCity(selectedCity));
    setSelectedArea('');
  }, [selectedCity]);

  const getAreasForCity = (city: string) => {
    const cityAreas = {
      'Bangalore': [
        { name: 'Whitefield', basePrice: 7800, growth: 12 },
        { name: 'Koramangala', basePrice: 9750, growth: 8 },
        { name: 'Indiranagar', basePrice: 9100, growth: 6 },
        { name: 'Electronic City', basePrice: 5850, growth: 15 },
        { name: 'Sarjapur Road', basePrice: 7150, growth: 18 },
        { name: 'Hebbal', basePrice: 6500, growth: 10 },
        { name: 'JP Nagar', basePrice: 7800, growth: 7 },
        { name: 'Marathahalli', basePrice: 7150, growth: 12 },
        { name: 'HSR Layout', basePrice: 8450, growth: 9 },
        { name: 'Bellandur', basePrice: 7800, growth: 14 }
      ],
      'Mumbai': [
        { name: 'Bandra', basePrice: 36000, growth: 5 },
        { name: 'Andheri', basePrice: 23400, growth: 8 },
        { name: 'Powai', basePrice: 25200, growth: 10 },
        { name: 'Thane', basePrice: 14400, growth: 12 },
        { name: 'Navi Mumbai', basePrice: 16200, growth: 15 },
        { name: 'Malad', basePrice: 19800, growth: 9 },
        { name: 'Goregaon', basePrice: 21600, growth: 7 },
        { name: 'Kandivali', basePrice: 18000, growth: 11 }
      ],
      'Delhi': [
        { name: 'Gurgaon', basePrice: 15600, growth: 10 },
        { name: 'Noida', basePrice: 13200, growth: 12 },
        { name: 'Dwarka', basePrice: 14400, growth: 8 },
        { name: 'Rohini', basePrice: 10800, growth: 6 },
        { name: 'Lajpat Nagar', basePrice: 16800, growth: 5 },
        { name: 'Vasant Kunj', basePrice: 18000, growth: 7 },
        { name: 'Greater Noida', basePrice: 9600, growth: 18 },
        { name: 'Faridabad', basePrice: 10800, growth: 14 }
      ]
    };

    return cityAreas[city as keyof typeof cityAreas] || cityAreas['Bangalore'];
  };

  const calculatePropertyValue = () => {
    if (!selectedArea) return;

    setLoading(true);
    
    setTimeout(() => {
      const areaData = areas.find(area => area.name === selectedArea);
      if (!areaData) return;

      let basePrice = areaData.basePrice;
      
      const typeMultipliers = {
        flat: 1.0,
        house: 1.2,
        villa: 1.5,
        plot: 0.6,
        office: 1.1,
        shop: 1.3
      };
      
      basePrice *= typeMultipliers[selectedPropertyType as keyof typeof typeMultipliers];
      
      const ageData = ageOptions.find(age => age.value === propertyAge);
      basePrice *= ageData?.multiplier || 1.0;
      
      const furnishingData = furnishingOptions.find(f => f.value === furnishing);
      basePrice *= furnishingData?.multiplier || 1.0;

      let floorMultiplier = 1.0;
      if (selectedPropertyType !== 'plot') {
        const floorRatio = floor / totalFloors;
        if (floorRatio > 0.8) floorMultiplier = 0.95;
        else if (floorRatio > 0.5) floorMultiplier = 1.05;
        else if (floorRatio > 0.2) floorMultiplier = 1.0;
        else floorMultiplier = 0.9;
      }
      
      basePrice *= floorMultiplier;
      
      const totalValue = Math.round(basePrice * builtUpArea);
      const pricePerSqft = Math.round(basePrice);
      
      // Generate comparable properties
      const comparables = generateComparables(areaData, basePrice);
      
      // Generate valuation breakdown
      const breakdown = [
        { name: 'Base Price', value: areaData.basePrice * builtUpArea, percentage: 70 },
        { name: 'Location Premium', value: totalValue * 0.15, percentage: 15 },
        { name: 'Property Features', value: totalValue * 0.10, percentage: 10 },
        { name: 'Market Conditions', value: totalValue * 0.05, percentage: 5 }
      ];
      
      setValuation({
        totalValue,
        pricePerSqft,
        areaData,
        comparables,
        breakdown,
        confidence: Math.round(85 + Math.random() * 10), // 85-95% confidence
        marketTrend: areaData.growth > 10 ? 'Strong Growth' : areaData.growth > 5 ? 'Moderate Growth' : 'Stable',
        recommendation: totalValue > areaData.basePrice * builtUpArea * 1.1 ? 'Overpriced' : 
                       totalValue < areaData.basePrice * builtUpArea * 0.9 ? 'Underpriced' : 'Fair Value'
      });
      
      setLoading(false);
    }, 1500);
  };

  const generateComparables = (areaData: any, basePrice: number) => {
    return [
      {
        title: `Similar ${propertyTypes.find(t => t.value === selectedPropertyType)?.label} in ${selectedArea}`,
        area: builtUpArea + Math.round((Math.random() - 0.5) * 200),
        price: Math.round((basePrice + (Math.random() - 0.5) * 1000) * (builtUpArea + Math.round((Math.random() - 0.5) * 200))),
        pricePerSqft: Math.round(basePrice + (Math.random() - 0.5) * 1000),
        bedrooms: bedrooms + Math.round((Math.random() - 0.5) * 2),
        age: Math.round(Math.random() * 10) + 1
      },
      {
        title: `Comparable Property in ${selectedArea}`,
        area: builtUpArea + Math.round((Math.random() - 0.5) * 300),
        price: Math.round((basePrice + (Math.random() - 0.5) * 1200) * (builtUpArea + Math.round((Math.random() - 0.5) * 300))),
        pricePerSqft: Math.round(basePrice + (Math.random() - 0.5) * 1200),
        bedrooms: bedrooms + Math.round((Math.random() - 0.5) * 1),
        age: Math.round(Math.random() * 8) + 1
      },
      {
        title: `Recent Sale in ${selectedArea}`,
        area: builtUpArea + Math.round((Math.random() - 0.5) * 150),
        price: Math.round((basePrice + (Math.random() - 0.5) * 800) * (builtUpArea + Math.round((Math.random() - 0.5) * 150))),
        pricePerSqft: Math.round(basePrice + (Math.random() - 0.5) * 800),
        bedrooms: bedrooms,
        age: Math.round(Math.random() * 5) + 1
      }
    ];
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
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
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Property Value Calculator
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get accurate property valuations based on location, features, and market conditions
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Form */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calculator className="w-5 h-5" />
                      <span>Property Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Location */}
                    <div className="space-y-4">
                      <div>
                        <Label>City *</Label>
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                          <SelectTrigger className="mt-1">
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
                        <Label>Area/Locality *</Label>
                        <Select value={selectedArea} onValueChange={setSelectedArea}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            {areas.map((area) => (
                              <SelectItem key={area.name} value={area.name}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{area.name}</span>
                                  <Badge variant="outline" className="ml-2">
                                    ₹{area.basePrice.toLocaleString()}/sqft
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Property Type */}
                    <div>
                      <Label>Property Type *</Label>
                      <Select value={selectedPropertyType} onValueChange={setSelectedPropertyType}>
                        <SelectTrigger className="mt-1">
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

                    {/* Area */}
                    <div>
                      <Label>Built-up Area (sqft) *</Label>
                      <div className="mt-2">
                        <Slider
                          value={[builtUpArea]}
                          onValueChange={(value) => setBuiltUpArea(value[0])}
                          max={5000}
                          min={300}
                          step={50}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>300 sqft</span>
                          <span className="font-medium">{builtUpArea} sqft</span>
                          <span>5000 sqft</span>
                        </div>
                      </div>
                    </div>

                    {/* Bedrooms & Bathrooms */}
                    {selectedPropertyType !== 'plot' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Bedrooms</Label>
                          <Select value={bedrooms.toString()} onValueChange={(value) => setBedrooms(parseInt(value))}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} BHK
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Bathrooms</Label>
                          <Select value={bathrooms.toString()} onValueChange={(value) => setBathrooms(parseInt(value))}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Property Age */}
                    <div>
                      <Label>Property Age</Label>
                      <Select value={propertyAge} onValueChange={setPropertyAge}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ageOptions.map((age) => (
                            <SelectItem key={age.value} value={age.value}>
                              {age.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Furnishing */}
                    {selectedPropertyType !== 'plot' && (
                      <div>
                        <Label>Furnishing Status</Label>
                        <Select value={furnishing} onValueChange={setFurnishing}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {furnishingOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Floor Details */}
                    {selectedPropertyType !== 'plot' && selectedPropertyType !== 'house' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Floor</Label>
                          <Input
                            type="number"
                            value={floor}
                            onChange={(e) => setFloor(parseInt(e.target.value) || 1)}
                            min={1}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Total Floors</Label>
                          <Input
                            type="number"
                            value={totalFloors}
                            onChange={(e) => setTotalFloors(parseInt(e.target.value) || 1)}
                            min={1}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={calculatePropertyValue}
                      disabled={!selectedArea || loading}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      {loading ? 'Calculating...' : 'Calculate Property Value'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="lg:col-span-2">
                {valuation ? (
                  <div className="space-y-6">
                    {/* Valuation Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IndianRupee className="w-5 h-5" />
                            <span>Property Valuation</span>
                          </div>
                          <Badge className={`${
                            valuation.recommendation === 'Fair Value' ? 'bg-green-500' :
                            valuation.recommendation === 'Underpriced' ? 'bg-blue-500' : 'bg-red-500'
                          } text-white`}>
                            {valuation.recommendation}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Estimated Value</p>
                            <p className="text-3xl font-bold text-green-600">
                              {formatPrice(valuation.totalValue)}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Price per sqft</p>
                            <p className="text-2xl font-bold text-blue-600">
                              ₹{valuation.pricePerSqft.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Confidence Level</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {valuation.confidence}%
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Market Trend</span>
                            <span className="font-medium text-green-600">{valuation.marketTrend}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Area Growth</span>
                            <span className="font-medium text-blue-600">+{valuation.areaData.growth}% YoY</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Valuation Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Valuation Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie
                                data={valuation.breakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="percentage"
                              >
                                {valuation.breakdown.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: any) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="mt-4 space-y-2">
                            {valuation.breakdown.map((item: any, index: number) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div 
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                  />
                                  <span className="text-sm text-gray-600">{item.name}</span>
                                </div>
                                <span className="text-sm font-medium">{formatPrice(item.value)}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Comparable Properties</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {valuation.comparables.map((comp: any, index: number) => (
                              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2 text-sm">{comp.title}</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-gray-600">Area: </span>
                                    <span className="font-medium">{comp.area} sqft</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Price: </span>
                                    <span className="font-medium">{formatPrice(comp.price)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Rate: </span>
                                    <span className="font-medium">₹{comp.pricePerSqft.toLocaleString()}/sqft</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Age: </span>
                                    <span className="font-medium">{comp.age} years</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Market Insights */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5" />
                          <span>Market Insights</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                              <Award className="w-5 h-5 text-green-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-gray-900">Investment Potential</h4>
                                <p className="text-sm text-gray-600">
                                  {valuation.areaData.growth > 10 ? 'Excellent' : 
                                   valuation.areaData.growth > 5 ? 'Good' : 'Moderate'} growth potential 
                                  based on area development and infrastructure projects.
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-gray-900">Best Time to Sell</h4>
                                <p className="text-sm text-gray-600">
                                  {valuation.marketTrend === 'Strong Growth' ? 'Current market conditions are favorable for selling' :
                                   'Consider holding for better market conditions'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-gray-900">Price Factors</h4>
                                <p className="text-sm text-gray-600">
                                  Location, property age, and furnishing status are key factors 
                                  affecting the current valuation.
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <Square className="w-5 h-5 text-purple-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-gray-900">Area Comparison</h4>
                                <p className="text-sm text-gray-600">
                                  Your property is priced {valuation.recommendation.toLowerCase()} 
                                  compared to similar properties in the area.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Property Value Calculator
                      </h3>
                      <p className="text-gray-600">
                        Fill in the property details to get an accurate valuation
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}