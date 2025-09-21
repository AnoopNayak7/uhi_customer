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
  Calendar,
  Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';



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
  const [areasLoading, setAreasLoading] = useState(false);
  const [cities, setCities] = useState<string[]>(['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad']);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchAreasForCity(selectedCity);
      setSelectedArea('');
    }
  }, [selectedCity]);

  const fetchCities = async () => {
    try {
      // For now, we'll use the hardcoded cities since we don't have a cities API endpoint
      // In the future, we can create an API endpoint to get all available cities
      setCities(['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad']);
    } catch (error) {
      console.error('Error fetching cities:', error);
      // Keep the default cities if API fails
    }
  };

  const fetchAreasForCity = async (city: string) => {
    console.log('Fetching areas for city:', city);
    setAreasLoading(true);
    try {
      const response:any = await apiClient.getToolsAreasForCity(city);
      console.log('API response for areas:', response);
      
      if (response && typeof response === 'object' && 'success' in response && response.success && 'data' in response && response.data) {
        // Extract area names from the API response
        const areaNames = response.data.areas;
        setAreas(areaNames);
        console.log('Areas loaded from API:', areaNames);
        toast.success(`Loaded ${areaNames.length} areas for ${city}`);
      } else {
        console.error('Failed to load areas from API:', response);
        setAreas([]);
        toast.error('Failed to load areas. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
      toast.error('Failed to load areas. Please try again.');
    } finally {
      setAreasLoading(false);
    }
  };

  const generatePredictions = async () => {
    if (!selectedArea) return;

    setLoading(true);
    try {
      const response = await apiClient.getToolsMarketPredictions({
        cityName: selectedCity,
        areaName: selectedArea,
        propertyType: selectedPropertyType,
        predictionYears: 2
      });

      if (response && typeof response === 'object' && 'success' in response && response.success && 'data' in response && response.data) {
        setPredictions(response.data);
        toast.success('AI predictions generated successfully!');
      } else {
        const errorMessage = response && typeof response === 'object' && 'message' in response ? String(response.message) : 'Failed to generate predictions';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error generating predictions:', error);
      toast.error('Failed to generate predictions. Please try again.');
    } finally {
      setLoading(false);
    }
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
              {selectedCity && selectedArea && (
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <Badge variant="outline" className="bg-white/80">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedCity}
                  </Badge>
                  <span className="text-gray-400">→</span>
                  <Badge variant="outline" className="bg-white/80">
                    <Building className="w-3 h-3 mr-1" />
                    {selectedArea}
                  </Badge>
                </div>
              )}
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
                      <Select value={selectedCity} onValueChange={setSelectedCity} disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
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
                        <SelectTrigger disabled={areasLoading}>
                          <SelectValue placeholder={areasLoading ? "Loading areas..." : areas.length === 0 ? "No areas available" : "Select area"} />
                        </SelectTrigger>
                        <SelectContent>
                          {areasLoading ? (
                            <div className="p-2 text-center text-sm text-gray-500">
                              <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                              Loading areas...
                            </div>
                          ) : areas.length === 0 ? (
                            <div className="p-2 text-center text-sm text-gray-500">
                              No areas available for this city
                            </div>
                          ) : (
                            areas.map((area) => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {areasLoading && (
                        <p className="text-xs text-gray-500 mt-1">Loading areas from {selectedCity}...</p>
                      )}
                      {/* {!areasLoading && areas.length > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ {areas.length} areas loaded for {selectedCity}
                        </p>
                      )} */}
                      {!areasLoading && areas.length === 0 && selectedCity && (
                        <div className="mt-2">
                          <p className="text-xs text-red-500 mb-2">
                            No areas found for {selectedCity}. Please try selecting a different city.
                          </p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => fetchAreasForCity(selectedCity)}
                            className="text-xs h-6 px-2"
                          >
                            <Loader2 className="w-3 h-3 mr-1" />
                            Retry
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={generatePredictions}
                      disabled={!selectedArea || loading}
                      className="w-full bg-red-500 hover:bg-red-600"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
                            ₹{predictions.currentMetrics?.averagePrice?.toLocaleString() || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">Current Price/sqft</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            ₹{predictions.futurePredictions?.[predictions.futurePredictions.length - 1]?.predictedPrice?.toLocaleString() || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">Predicted (2 years)</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className={`text-2xl font-bold mb-1 ${
                            predictions.futurePredictions && predictions.currentMetrics ? 
                              ((predictions.futurePredictions[predictions.futurePredictions.length - 1]?.predictedPrice - predictions.currentMetrics.averagePrice) / predictions.currentMetrics.averagePrice * 100) >= 0 ? 'text-green-600' : 'text-red-600'
                              : 'text-gray-600'
                          }`}>
                            {predictions.futurePredictions && predictions.currentMetrics ? 
                              ((predictions.futurePredictions[predictions.futurePredictions.length - 1]?.predictedPrice - predictions.currentMetrics.averagePrice) / predictions.currentMetrics.averagePrice * 100).toFixed(1)
                              : 'N/A'}%
                          </div>
                          <div className="text-sm text-gray-600">Expected Change</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {predictions.confidence || 'N/A'}%
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
                              predictions.sentimentAnalysis?.sentiment === 'Very Bullish' || predictions.sentimentAnalysis?.sentiment === 'Bullish' ? 'text-green-600' :
                              predictions.sentimentAnalysis?.sentiment === 'Neutral' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {predictions.sentimentAnalysis?.sentiment || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-600">Market Sentiment</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className={`text-lg font-bold mb-1 ${
                              predictions.sentimentAnalysis?.riskLevel === 'Low' ? 'text-green-600' :
                              predictions.sentimentAnalysis?.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {predictions.sentimentAnalysis?.riskLevel || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-600">Risk Level</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600 mb-1">
                              {predictions.sentimentAnalysis?.confidence || 'N/A'}%
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
                            <XAxis dataKey="period" />
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
                          {predictions.marketFactors?.map((factor: any, index: number) => (
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
                              {factor.description && (
                                <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
                              )}
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
                          {predictions.recommendations?.map((rec: any, index: number) => (
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
                              {rec.expectedReturn && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Expected Return: {rec.expectedReturn}
                                </div>
                              )}
                              {rec.riskLevel && (
                                <div className="mt-1 text-xs text-gray-500">
                                  Risk Level: {rec.riskLevel}
                                </div>
                              )}
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