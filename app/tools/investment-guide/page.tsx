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
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  BookOpen, 
  TrendingUp, 
  Target, 
  DollarSign,
  BarChart3,
  Calculator,
  Lightbulb,
  Shield,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Home,
  Building,
  TreePine,
  Briefcase,
  MapPin,
  Calendar,
  IndianRupee,
  Users,
  Star
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const cities = [
  'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'
];

const investmentGoals = [
  { value: 'rental_income', label: 'Rental Income', icon: DollarSign },
  { value: 'capital_appreciation', label: 'Capital Appreciation', icon: TrendingUp },
  { value: 'balanced', label: 'Balanced Growth', icon: PieChart },
  { value: 'retirement', label: 'Retirement Planning', icon: Clock },
];

const riskProfiles = [
  { value: 'conservative', label: 'Conservative', color: 'text-green-600', bgColor: 'bg-green-50' },
  { value: 'moderate', label: 'Moderate', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { value: 'aggressive', label: 'Aggressive', color: 'text-red-600', bgColor: 'bg-red-50' },
];

const propertyTypes = [
  { value: 'residential', label: 'Residential', icon: Home },
  { value: 'commercial', label: 'Commercial', icon: Briefcase },
  { value: 'plots', label: 'Plots/Land', icon: TreePine },
  { value: 'mixed', label: 'Mixed Portfolio', icon: Building },
];

export default function InvestmentGuidePage() {
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [investmentGoal, setInvestmentGoal] = useState('');
  const [riskProfile, setRiskProfile] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState([5000000]); // 50L default
  const [timeHorizon, setTimeHorizon] = useState([5]); // 5 years default
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  const generateRecommendations = async () => {
    if (!investmentGoal || !riskProfile || !propertyType) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecommendations = generateMockRecommendations();
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRecommendations = () => {
    const budgetValue = budget[0];
    const timeValue = timeHorizon[0];
    
    const areas = getRecommendedAreas(selectedCity, riskProfile, propertyType);
    const portfolio = generatePortfolioAllocation(propertyType, riskProfile);
    const projections = generateProjections(budgetValue, timeValue, riskProfile);
    const strategies = getInvestmentStrategies(investmentGoal, riskProfile, timeValue);
    
    return {
      overview: {
        totalBudget: budgetValue,
        timeHorizon: timeValue,
        expectedReturns: projections.expectedReturns,
        riskLevel: riskProfile,
        recommendedAreas: areas.length,
        portfolioScore: Math.round(75 + Math.random() * 20)
      },
      recommendedAreas: areas,
      portfolioAllocation: portfolio,
      projections: projections,
      strategies: strategies,
      marketInsights: generateMarketInsights(selectedCity, propertyType),
      riskAnalysis: generateRiskAnalysis(riskProfile, propertyType),
      actionPlan: generateActionPlan(investmentGoal, budgetValue, timeValue)
    };
  };

  const getRecommendedAreas = (city: string, risk: string, type: string) => {
    const cityAreas = {
      'Bangalore': [
        { name: 'Electronic City', growth: 15, rental: 8, risk: 'low', price: 5800, type: 'residential' },
        { name: 'Whitefield', growth: 12, rental: 7, risk: 'low', price: 7800, type: 'residential' },
        { name: 'Sarjapur Road', growth: 18, rental: 6, risk: 'medium', price: 7200, type: 'residential' },
        { name: 'Outer Ring Road', growth: 20, rental: 5, risk: 'high', price: 8500, type: 'commercial' },
        { name: 'Hebbal', growth: 10, rental: 9, risk: 'low', price: 6500, type: 'residential' },
      ],
      'Mumbai': [
        { name: 'Thane', growth: 12, rental: 7, risk: 'low', price: 14400, type: 'residential' },
        { name: 'Navi Mumbai', growth: 15, rental: 6, risk: 'medium', price: 16200, type: 'residential' },
        { name: 'Andheri', growth: 8, rental: 8, risk: 'low', price: 23400, type: 'commercial' },
        { name: 'Powai', growth: 10, rental: 7, risk: 'medium', price: 25200, type: 'residential' },
      ]
    };

    const areas = cityAreas[city as keyof typeof cityAreas] || cityAreas['Bangalore'];
    
    return areas
      .filter(area => {
        if (type === 'residential') return area.type === 'residential';
        if (type === 'commercial') return area.type === 'commercial';
        return true;
      })
      .map(area => ({
        ...area,
        score: calculateAreaScore(area, risk, investmentGoal),
        recommendation: getAreaRecommendation(area, risk)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const calculateAreaScore = (area: any, risk: string, goal: string) => {
    let score = 0;
    
    score += area.growth * 2;
    score += area.rental * 1.5;
    
    if (risk === 'conservative' && area.risk === 'low') score += 20;
    if (risk === 'moderate' && area.risk === 'medium') score += 15;
    if (risk === 'aggressive' && area.risk === 'high') score += 25;
    
    if (goal === 'rental_income') score += area.rental * 3;
    if (goal === 'capital_appreciation') score += area.growth * 3;
    
    return Math.min(100, score);
  };

  const getAreaRecommendation = (area: any, risk: string) => {
    if (area.growth > 15) return 'High Growth Potential';
    if (area.rental > 7) return 'Excellent Rental Yield';
    if (area.risk === 'low') return 'Safe Investment';
    return 'Balanced Option';
  };

  const generatePortfolioAllocation = (type: string, risk: string) => {
    if (type === 'residential') {
      return [
        { name: 'Apartments', value: 60, color: '#3b82f6' },
        { name: 'Villas', value: 25, color: '#10b981' },
        { name: 'Plots', value: 15, color: '#f59e0b' }
      ];
    } else if (type === 'commercial') {
      return [
        { name: 'Office Spaces', value: 50, color: '#3b82f6' },
        { name: 'Retail Shops', value: 30, color: '#10b981' },
        { name: 'Warehouses', value: 20, color: '#f59e0b' }
      ];
    } else {
      return [
        { name: 'Residential', value: 50, color: '#3b82f6' },
        { name: 'Commercial', value: 30, color: '#10b981' },
        { name: 'Plots', value: 20, color: '#f59e0b' }
      ];
    }
  };

  const generateProjections = (budget: number, years: number, risk: string) => {
    const baseReturn = risk === 'conservative' ? 8 : risk === 'moderate' ? 12 : 16;
    const expectedReturns = baseReturn + Math.round((Math.random() - 0.5) * 4);
    
    const projectionData = [];
    let currentValue = budget;
    
    for (let year = 0; year <= years; year++) {
      if (year > 0) {
        currentValue = currentValue * (1 + expectedReturns / 100);
      }
      projectionData.push({
        year: year,
        value: Math.round(currentValue),
        rental: Math.round(currentValue * 0.06), // 6% rental yield
      });
    }
    
    return {
      expectedReturns,
      projectionData,
      totalGains: Math.round(currentValue - budget),
      finalValue: Math.round(currentValue)
    };
  };

  const getInvestmentStrategies = (goal: string, risk: string, time: number) => {
    const strategies = {
      'rental_income': [
        'Focus on high-rental-yield properties in established areas',
        'Consider commercial properties for better rental returns',
        'Look for properties near IT hubs and business districts',
        'Ensure good connectivity and infrastructure'
      ],
      'capital_appreciation': [
        'Invest in emerging areas with development potential',
        'Focus on properties near upcoming infrastructure projects',
        'Consider pre-launch and under-construction properties',
        'Monitor government policy changes and urban planning'
      ],
      'balanced': [
        'Diversify across residential and commercial properties',
        'Mix of established and emerging locations',
        'Balance between rental yield and growth potential',
        'Regular portfolio review and rebalancing'
      ],
      'retirement': [
        'Focus on stable, income-generating properties',
        'Prioritize locations with good healthcare facilities',
        'Consider properties with long-term appreciation potential',
        'Plan for property maintenance and management'
      ]
    };
    
    return strategies[goal as keyof typeof strategies] || strategies['balanced'];
  };

  const generateMarketInsights = (city: string, type: string) => {
    return [
      `${city} real estate market showing strong fundamentals with IT sector growth`,
      `${type} properties in ${city} expected to appreciate 12-15% annually`,
      'Government infrastructure projects boosting connectivity and property values',
      'Rental demand increasing due to corporate expansion and job creation',
      'New regulations favoring transparent transactions and buyer protection'
    ];
  };

  const generateRiskAnalysis = (risk: string, type: string) => {
    const riskFactors = {
      'conservative': {
        level: 'Low Risk',
        factors: ['Market volatility', 'Liquidity concerns', 'Regulatory changes'],
        mitigation: ['Diversified portfolio', 'Established locations', 'Long-term holding']
      },
      'moderate': {
        level: 'Medium Risk',
        factors: ['Market cycles', 'Location risks', 'Construction delays'],
        mitigation: ['Research-based selection', 'Phased investments', 'Professional advice']
      },
      'aggressive': {
        level: 'High Risk',
        factors: ['Market speculation', 'Development risks', 'Economic cycles'],
        mitigation: ['Expert guidance', 'Thorough due diligence', 'Risk diversification']
      }
    };
    
    return riskFactors[risk as keyof typeof riskFactors];
  };

  const generateActionPlan = (goal: string, budget: number, time: number) => {
    return [
      {
        phase: 'Phase 1 (Months 1-3)',
        tasks: ['Market research and area analysis', 'Finalize investment strategy', 'Arrange financing options'],
        budget: Math.round(budget * 0.4)
      },
      {
        phase: 'Phase 2 (Months 4-8)',
        tasks: ['Property selection and due diligence', 'Legal verification', 'Purchase execution'],
        budget: Math.round(budget * 0.4)
      },
      {
        phase: 'Phase 3 (Months 9-12)',
        tasks: ['Portfolio optimization', 'Rental management setup', 'Performance monitoring'],
        budget: Math.round(budget * 0.2)
      }
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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-50 to-red-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Investment Guide
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get personalized real estate investment recommendations based on your goals and risk profile
              </p>
            </div>
          </div>
        </section>

        {/* Investment Form */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Form */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Investment Profile</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* City Selection */}
                    <div>
                      <Label>Preferred City *</Label>
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

                    {/* Investment Goal */}
                    <div>
                      <Label>Investment Goal *</Label>
                      <Select value={investmentGoal} onValueChange={setInvestmentGoal}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                        <SelectContent>
                          {investmentGoals.map((goal) => (
                            <SelectItem key={goal.value} value={goal.value}>
                              <div className="flex items-center">
                                <goal.icon className="w-4 h-4 mr-2" />
                                {goal.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Risk Profile */}
                    <div>
                      <Label>Risk Profile *</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {riskProfiles.map((risk) => (
                          <button
                            key={risk.value}
                            onClick={() => setRiskProfile(risk.value)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              riskProfile === risk.value
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className={`font-medium ${risk.color}`}>
                              {risk.label}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {risk.value === 'conservative' && 'Low risk, steady returns'}
                              {risk.value === 'moderate' && 'Balanced risk and returns'}
                              {risk.value === 'aggressive' && 'High risk, high returns'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Property Type */}
                    <div>
                      <Label>Property Type *</Label>
                      <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select property type" />
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

                    {/* Budget */}
                    <div>
                      <Label>Investment Budget</Label>
                      <div className="mt-2">
                        <Slider
                          value={budget}
                          onValueChange={setBudget}
                          max={50000000}
                          min={1000000}
                          step={500000}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>₹10L</span>
                          <span className="font-medium">{formatPrice(budget[0])}</span>
                          <span>₹5Cr</span>
                        </div>
                      </div>
                    </div>

                    {/* Time Horizon */}
                    <div>
                      <Label>Investment Time Horizon</Label>
                      <div className="mt-2">
                        <Slider
                          value={timeHorizon}
                          onValueChange={setTimeHorizon}
                          max={20}
                          min={1}
                          step={1}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>1 year</span>
                          <span className="font-medium">{timeHorizon[0]} years</span>
                          <span>20 years</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={generateRecommendations}
                      disabled={!investmentGoal || !riskProfile || !propertyType || loading}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      {loading ? 'Generating Recommendations...' : 'Get Investment Guide'}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="lg:col-span-2">
                {recommendations ? (
                  <div className="space-y-6">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">Expected Returns</p>
                              <p className="text-2xl font-bold text-green-600">
                                {recommendations.projections.expectedReturns}% p.a.
                              </p>
                            </div>
                            <div className="p-3 rounded-full bg-green-50">
                              <TrendingUp className="w-6 h-6 text-green-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">Portfolio Score</p>
                              <p className="text-2xl font-bold text-blue-600">
                                {recommendations.overview.portfolioScore}/100
                              </p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-50">
                              <Award className="w-6 h-6 text-blue-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">Projected Value</p>
                              <p className="text-2xl font-bold text-purple-600">
                                {formatPrice(recommendations.projections.finalValue)}
                              </p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-50">
                              <Calculator className="w-6 h-6 text-purple-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recommended Areas */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <MapPin className="w-5 h-5" />
                          <span>Recommended Areas in {selectedCity}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recommendations.recommendedAreas.map((area: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-4">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{area.name}</h4>
                                  <p className="text-sm text-gray-600">{area.recommendation}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Growth: </span>
                                    <span className="font-medium text-green-600">{area.growth}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Rental: </span>
                                    <span className="font-medium text-blue-600">{area.rental}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Score: </span>
                                    <span className="font-bold text-orange-600">{area.score}/100</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  ₹{area.price.toLocaleString()}/sqft
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Portfolio Allocation & Projections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <PieChart className="w-5 h-5" />
                            <span>Portfolio Allocation</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie
                                data={recommendations.portfolioAllocation}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {recommendations.portfolioAllocation.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: any) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="mt-4 space-y-2">
                            {recommendations.portfolioAllocation.map((item: any, index: number) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div 
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="text-sm text-gray-600">{item.name}</span>
                                </div>
                                <span className="text-sm font-medium">{item.value}%</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5" />
                            <span>Investment Projections</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={recommendations.projections.projectionData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis />
                              <Tooltip 
                                formatter={(value: any, name: string) => [
                                  formatPrice(value), 
                                  name === 'value' ? 'Property Value' : 'Rental Income'
                                ]}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#f97316" 
                                strokeWidth={3}
                                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="rental" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Investment Strategies */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Lightbulb className="w-5 h-5" />
                          <span>Investment Strategies</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {recommendations.strategies.map((strategy: string, index: number) => (
                            <div key={index} className="flex items-start space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700">{strategy}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Risk Analysis */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Shield className="w-5 h-5" />
                          <span>Risk Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Risk Factors</h4>
                            <div className="space-y-2">
                              {recommendations.riskAnalysis.factors.map((factor: string, index: number) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm text-gray-600">{factor}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Risk Mitigation</h4>
                            <div className="space-y-2">
                              {recommendations.riskAnalysis.mitigation.map((mitigation: string, index: number) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-gray-600">{mitigation}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Plan */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5" />
                          <span>Investment Action Plan</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {recommendations.actionPlan.map((phase: any, index: number) => (
                            <div key={index} className="border-l-4 border-orange-500 pl-4">
                              <h4 className="font-semibold text-gray-900 mb-2">{phase.phase}</h4>
                              <div className="space-y-1 mb-3">
                                {phase.tasks.map((task: string, taskIndex: number) => (
                                  <div key={taskIndex} className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                    <span className="text-sm text-gray-600">{task}</span>
                                  </div>
                                ))}
                              </div>
                              <Badge variant="outline" className="text-orange-600 border-orange-200">
                                Budget: {formatPrice(phase.budget)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Market Insights */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5" />
                          <span>Market Insights</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {recommendations.marketInsights.map((insight: string, index: number) => (
                            <div key={index} className="flex items-start space-x-3">
                              <Star className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Investment Guide
                      </h3>
                      <p className="text-gray-600">
                        Fill in your investment profile to get personalized recommendations
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