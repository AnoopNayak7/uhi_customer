"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/lib/store';
import { 
  Target, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  Building,
  Crown,
  Lock,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Link from 'next/link';

const cities = [
  'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'
];

const propertyTypes = [
  { value: 'residential', label: 'Residential', icon: Building },
  { value: 'commercial', label: 'Commercial', icon: Building },
  { value: 'plots', label: 'Plots/Land', icon: MapPin },
];

export default function MarketPredictorPage() {
  const { user } = useAuthStore();
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [selectedPropertyType, setSelectedPropertyType] = useState('residential');
  const [selectedArea, setSelectedArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<any>(null);
  const [areas, setAreas] = useState<any[]>([]);

  useEffect(() => {
    setAreas(getAreasForCity(selectedCity));
    setSelectedArea('');
  }, [selectedCity]);

  const getAreasForCity = (city: string) => {
    const cityAreas = {
      'Bangalore': ['Whitefield', 'Koramangala', 'Indiranagar', 'Electronic City', 'Sarjapur Road', 'Hebbal'],
      'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Thane', 'Navi Mumbai', 'Malad'],
      'Delhi': ['Gurgaon', 'Noida', 'Dwarka', 'Rohini', 'Lajpat Nagar', 'Vasant Kunj']
    };
    return cityAreas[city as keyof typeof cityAreas] || cityAreas['Bangalore'];
  };

  const generatePredictions = async () => {
    if (!selectedArea) return;

    setLoading(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockPredictions = generateMockPredictions();
      setPredictions(mockPredictions);
    } catch (error) {
      console.error('Error generating predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPredictions = () => {
    const basePrice = Math.round(6000 + Math.random() * 4000); // 6K-10K per sqft
    const currentPrice = basePrice;
    
    // Generate historical data (last 2 years)
    const historicalData = [];
    for (let i = 24; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const price = Math.round(basePrice * (1 + variation * (i / 24)));
      historicalData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        price: price,
        actual: true
      });
    }

    // Generate future predictions (next 2 years)
    const futureData = [];
    let lastPrice = historicalData[historicalData.length - 1].price;
    const growthRate = 0.08 + (Math.random() - 0.5) * 0.06; // 5-11% annual growth
    
    for (let i = 1; i <= 24; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const monthlyGrowth = Math.pow(1 + growthRate, 1/12) - 1;
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      lastPrice = lastPrice * (1 + monthlyGrowth + variation);
      
      futureData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        price: Math.round(lastPrice),
        predicted: true
      });
    }

    const combinedData = [...historicalData, ...futureData];
    const futurePrice = futureData[futureData.length - 1].price;
    const priceChange = ((futurePrice - currentPrice) / currentPrice) * 100;

    // Market factors
    const factors = [
      { name: 'Infrastructure Development', impact: 85, positive: true },
      { name: 'IT Sector Growth', impact: 78, positive: true },
      { name: 'Government Policies', impact: 65, positive: true },
      { name: 'Interest Rate Changes', impact: 45, positive: false },
      { name: 'Supply vs Demand', impact: 72, positive: true },
      { name: 'Economic Conditions', impact: 68, positive: true }
    ];

    // Investment recommendations
    const recommendations = [
      {
        timeframe: 'Short Term (6-12 months)',
        action: priceChange > 5 ? 'Hold' : 'Buy',
        confidence: Math.round(70 + Math.random() * 20),
        reason: priceChange > 5 ? 'Prices expected to stabilize' : 'Good entry point before price rise'
      },
      {
        timeframe: 'Medium Term (1-3 years)',
        action: 'Buy',
        confidence: Math.round(75 + Math.random() * 20),
        reason: 'Strong fundamentals support steady growth'
      },
      {
        timeframe: 'Long Term (3-5 years)',
        action: 'Strong Buy',
        confidence: Math.round(80 + Math.random() * 15),
        reason: 'Infrastructure development will drive significant appreciation'
      }
    ];

    return {
      currentPrice,
      futurePrice: Math.round(futurePrice),
      priceChange: priceChange.toFixed(1),
      confidence: Math.round(75 + Math.random() * 20),
      chartData: combinedData,
      factors,
      recommendations,
      marketSentiment: priceChange > 8 ? 'Very Bullish' : priceChange > 3 ? 'Bullish' : priceChange > -3 ? 'Neutral' : 'Bearish',
      riskLevel: Math.abs(priceChange) > 10 ? 'High' : Math.abs(priceChange) > 5 ? 'Medium' : 'Low'
    };
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Premium Tool</h2>
              <p className="text-gray-600 mb-6">
                Please login to access the AI Market Trend Predictor
              </p>
              <Button asChild>
                <Link href="/auth/login">Login to Continue</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-50 to-pink-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-yellow-500 mr-2" />
                <Badge className="bg-yellow-500 text-white">Premium AI Tool</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                AI Market Trend Predictor
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Advanced AI-powered predictions for property price movements and market trends
              </p>
            </div>
          </div>
        </section>

        {/* Predictor Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Panel */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5" />
                      <span>AI Analysis Parameters</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
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

                    <Button 
                      onClick={generatePredictions}
                      disabled={!selectedArea || loading}
                      className="w-full bg-red-500 hover:bg-red-600"
                    >
                      {loading ? (
                        <>
                          <Brain className="w-4 h-4 mr-2 animate-pulse" />
                          AI Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Generate AI Predictions
                        </>
                      )}
                    </Button>

                    {loading && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-sm text-gray-600">Analyzing market data...</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <span className="text-sm text-gray-600">Processing economic indicators...</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-sm text-gray-600">Generating predictions...</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-2">
                {predictions ? (
                  <div className="space-y-6">
                    {/* Prediction Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            ₹{predictions.currentPrice.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Current Price/sqft</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            ₹{predictions.futurePrice.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Predicted (2 years)</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className={`text-2xl font-bold mb-1 ${
                            parseFloat(predictions.priceChange) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {parseFloat(predictions.priceChange) >= 0 ? '+' : ''}{predictions.priceChange}%
                          </div>
                          <div className="text-sm text-gray-600">Expected Change</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {predictions.confidence}%
                          </div>
                          <div className="text-sm text-gray-600">AI Confidence</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Market Sentiment */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="w-5 h-5" />
                          <span>Market Sentiment Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className={`text-lg font-bold mb-1 ${
                              predictions.marketSentiment === 'Very Bullish' || predictions.marketSentiment === 'Bullish' ? 'text-green-600' :
                              predictions.marketSentiment === 'Neutral' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {predictions.marketSentiment}
                            </div>
                            <div className="text-sm text-gray-600">Market Sentiment</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className={`text-lg font-bold mb-1 ${
                              predictions.riskLevel === 'Low' ? 'text-green-600' :
                              predictions.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {predictions.riskLevel}
                            </div>
                            <div className="text-sm text-gray-600">Risk Level</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600 mb-1">
                              {predictions.confidence}%
                            </div>
                            <div className="text-sm text-gray-600">Prediction Accuracy</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Price Prediction Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <BarChart3 className="w-5 h-5" />
                          <span>Price Prediction Chart - {selectedArea}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                          <AreaChart data={predictions.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value: any) => [`₹${value.toLocaleString()}/sqft`, 'Price']}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="price" 
                              stroke="#ef4444" 
                              fill="url(#colorPrice)"
                              strokeWidth={2}
                            />
                            <defs>
                              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                          </AreaChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                            <span>Historical Data</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                            <span>AI Predictions</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Market Factors */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Market Influencing Factors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {predictions.factors.map((factor: any, index: number) => (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center space-x-2">
                                  {factor.positive ? (
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                  )}
                                  <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{factor.impact}%</span>
                              </div>
                              <Progress value={factor.impact} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Investment Recommendations */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="w-5 h-5" />
                          <span>AI Investment Recommendations</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {predictions.recommendations.map((rec: any, index: number) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{rec.timeframe}</h4>
                                <div className="flex items-center space-x-2">
                                  <Badge className={
                                    rec.action === 'Strong Buy' ? 'bg-green-500' :
                                    rec.action === 'Buy' ? 'bg-blue-500' :
                                    rec.action === 'Hold' ? 'bg-yellow-500' : 'bg-red-500'
                                  }>
                                    {rec.action}
                                  </Badge>
                                  <span className="text-sm text-gray-600">{rec.confidence}% confidence</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{rec.reason}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* AI Disclaimer */}
                    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
                          <div>
                            <h3 className="font-bold text-gray-900 mb-2">AI Prediction Disclaimer</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              These predictions are generated using advanced AI algorithms analyzing multiple market factors. 
                              While our AI model has high accuracy, real estate markets can be influenced by unforeseen events.
                            </p>
                            <ul className="text-xs text-gray-500 space-y-1">
                              <li>• Predictions are based on historical data and current market trends</li>
                              <li>• Actual results may vary due to economic, political, or social factors</li>
                              <li>• Always consult with real estate professionals before making investment decisions</li>
                              <li>• Past performance does not guarantee future results</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        AI Market Predictor
                      </h3>
                      <p className="text-gray-600">
                        Select location parameters to generate AI-powered market predictions
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