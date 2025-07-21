"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';
import { 
  TrendingUp, 
  IndianRupee, 
  Calendar, 
  Percent,
  BarChart3,
  Crown,
  Lock,
  Target,
  Calculator
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';

export default function InvestmentCalculatorPage() {
  const { user } = useAuthStore();
  const [propertyValue, setPropertyValue] = useState([5000000]); // 50L
  const [downPayment, setDownPayment] = useState([1000000]); // 10L
  const [rentalYield, setRentalYield] = useState([6]); // 6%
  const [appreciationRate, setAppreciationRate] = useState([8]); // 8%
  const [investmentPeriod, setInvestmentPeriod] = useState([10]); // 10 years
  const [maintenanceCost, setMaintenanceCost] = useState([2]); // 2%
  const [taxRate, setTaxRate] = useState([30]); // 30%
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateROI();
  }, [propertyValue, downPayment, rentalYield, appreciationRate, investmentPeriod, maintenanceCost, taxRate]);

  const calculateROI = () => {
    const initialInvestment = downPayment[0];
    const currentValue = propertyValue[0];
    const years = investmentPeriod[0];
    const annualRental = (currentValue * rentalYield[0]) / 100;
    const annualMaintenance = (currentValue * maintenanceCost[0]) / 100;
    const netAnnualRental = annualRental - annualMaintenance;

    // Calculate future value with appreciation
    const futureValue = currentValue * Math.pow(1 + appreciationRate[0] / 100, years);
    const capitalGains = futureValue - currentValue;
    const totalRentalIncome = netAnnualRental * years;

    // Tax calculations
    const taxOnRental = (totalRentalIncome * taxRate[0]) / 100;
    const taxOnCapitalGains = (capitalGains * 20) / 100; // LTCG tax

    const totalReturns = capitalGains + totalRentalIncome - taxOnRental - taxOnCapitalGains;
    const totalROI = ((totalReturns / initialInvestment) * 100);
    const annualizedROI = Math.pow(1 + totalROI / 100, 1 / years) - 1;

    // Generate yearly projections
    const projections = [];
    let cumulativeRental = 0;
    let propertyValueProgression = currentValue;

    for (let year = 1; year <= years; year++) {
      propertyValueProgression *= (1 + appreciationRate[0] / 100);
      cumulativeRental += netAnnualRental;
      
      projections.push({
        year,
        propertyValue: Math.round(propertyValueProgression),
        rentalIncome: Math.round(cumulativeRental),
        totalValue: Math.round(propertyValueProgression + cumulativeRental)
      });
    }

    // Investment breakdown
    const breakdown = [
      { name: 'Capital Appreciation', value: Math.round(capitalGains), color: '#3b82f6' },
      { name: 'Rental Income', value: Math.round(totalRentalIncome), color: '#10b981' },
      { name: 'Taxes', value: Math.round(taxOnRental + taxOnCapitalGains), color: '#ef4444' },
      { name: 'Maintenance', value: Math.round(annualMaintenance * years), color: '#f59e0b' }
    ];

    setResults({
      initialInvestment,
      futureValue: Math.round(futureValue),
      capitalGains: Math.round(capitalGains),
      totalRentalIncome: Math.round(totalRentalIncome),
      netRentalIncome: Math.round(totalRentalIncome - taxOnRental),
      totalReturns: Math.round(totalReturns),
      totalROI: totalROI.toFixed(2),
      annualizedROI: (annualizedROI * 100).toFixed(2),
      monthlyRental: Math.round(annualRental / 12),
      projections,
      breakdown,
      paybackPeriod: Math.round(initialInvestment / netAnnualRental)
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];

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
                Please login to access the ROI Investment Calculator
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
        <section className="bg-gradient-to-r from-purple-50 to-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-yellow-500 mr-2" />
                <Badge className="bg-yellow-500 text-white">Premium Tool</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                ROI Investment Calculator
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Calculate returns, rental yields, and investment projections for real estate investments
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Panel */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calculator className="w-5 h-5" />
                      <span>Investment Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Property Value */}
                    <div>
                      <Label className="flex items-center space-x-2">
                        <IndianRupee className="w-4 h-4" />
                        <span>Property Value</span>
                      </Label>
                      <div className="mt-2">
                        <Slider
                          value={propertyValue}
                          onValueChange={setPropertyValue}
                          max={50000000}
                          min={1000000}
                          step={100000}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>₹10L</span>
                          <span className="font-medium">{formatPrice(propertyValue[0])}</span>
                          <span>₹5Cr</span>
                        </div>
                      </div>
                    </div>

                    {/* Down Payment */}
                    <div>
                      <Label>Down Payment</Label>
                      <div className="mt-2">
                        <Slider
                          value={downPayment}
                          onValueChange={setDownPayment}
                          max={propertyValue[0]}
                          min={propertyValue[0] * 0.1}
                          step={50000}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{formatPrice(propertyValue[0] * 0.1)}</span>
                          <span className="font-medium">{formatPrice(downPayment[0])}</span>
                          <span>{formatPrice(propertyValue[0])}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rental Yield */}
                    <div>
                      <Label className="flex items-center space-x-2">
                        <Percent className="w-4 h-4" />
                        <span>Expected Rental Yield (%)</span>
                      </Label>
                      <div className="mt-2">
                        <Slider
                          value={rentalYield}
                          onValueChange={setRentalYield}
                          max={12}
                          min={3}
                          step={0.5}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>3%</span>
                          <span className="font-medium">{rentalYield[0]}%</span>
                          <span>12%</span>
                        </div>
                      </div>
                    </div>

                    {/* Appreciation Rate */}
                    <div>
                      <Label>Annual Appreciation (%)</Label>
                      <div className="mt-2">
                        <Slider
                          value={appreciationRate}
                          onValueChange={setAppreciationRate}
                          max={15}
                          min={3}
                          step={0.5}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>3%</span>
                          <span className="font-medium">{appreciationRate[0]}%</span>
                          <span>15%</span>
                        </div>
                      </div>
                    </div>

                    {/* Investment Period */}
                    <div>
                      <Label className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Investment Period (Years)</span>
                      </Label>
                      <div className="mt-2">
                        <Slider
                          value={investmentPeriod}
                          onValueChange={setInvestmentPeriod}
                          max={25}
                          min={1}
                          step={1}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>1 year</span>
                          <span className="font-medium">{investmentPeriod[0]} years</span>
                          <span>25 years</span>
                        </div>
                      </div>
                    </div>

                    {/* Maintenance Cost */}
                    <div>
                      <Label>Annual Maintenance (%)</Label>
                      <div className="mt-2">
                        <Slider
                          value={maintenanceCost}
                          onValueChange={setMaintenanceCost}
                          max={5}
                          min={1}
                          step={0.5}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>1%</span>
                          <span className="font-medium">{maintenanceCost[0]}%</span>
                          <span>5%</span>
                        </div>
                      </div>
                    </div>

                    {/* Tax Rate */}
                    <div>
                      <Label>Tax Rate (%)</Label>
                      <div className="mt-2">
                        <Slider
                          value={taxRate}
                          onValueChange={setTaxRate}
                          max={40}
                          min={10}
                          step={5}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>10%</span>
                          <span className="font-medium">{taxRate[0]}%</span>
                          <span>40%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-2">
                {results && (
                  <div className="space-y-6">
                    {/* ROI Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {results.annualizedROI}%
                          </div>
                          <div className="text-sm text-gray-600">Annualized ROI</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {formatPrice(results.totalReturns)}
                          </div>
                          <div className="text-sm text-gray-600">Total Returns</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            ₹{results.monthlyRental.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Monthly Rental</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-orange-600 mb-1">
                            {results.paybackPeriod}
                          </div>
                          <div className="text-sm text-gray-600">Payback (Years)</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Investment Breakdown */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <PieChart className="w-5 h-5" />
                            <span>Investment Breakdown</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie
                                data={results.breakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {results.breakdown.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: any) => formatPrice(value)} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="mt-4 space-y-2">
                            {results.breakdown.map((item: any, index: number) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div 
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="text-sm text-gray-600">{item.name}</span>
                                </div>
                                <span className="text-sm font-medium">{formatPrice(item.value)}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Investment Growth */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5" />
                            <span>Investment Growth</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={results.projections}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis />
                              <Tooltip formatter={(value: any) => formatPrice(value)} />
                              <Line 
                                type="monotone" 
                                dataKey="propertyValue" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                name="Property Value"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="rentalIncome" 
                                stroke="#10b981" 
                                strokeWidth={2}
                                name="Cumulative Rental"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="totalValue" 
                                stroke="#8b5cf6" 
                                strokeWidth={3}
                                name="Total Value"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Investment Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Investment Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Initial Investment</span>
                              <span className="font-medium">{formatPrice(results.initialInvestment)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Property Value (Current)</span>
                              <span className="font-medium">{formatPrice(propertyValue[0])}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Property Value (Future)</span>
                              <span className="font-medium">{formatPrice(results.futureValue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Capital Appreciation</span>
                              <span className="font-medium text-green-600">{formatPrice(results.capitalGains)}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Rental Income</span>
                              <span className="font-medium">{formatPrice(results.totalRentalIncome)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Net Rental (After Tax)</span>
                              <span className="font-medium">{formatPrice(results.netRentalIncome)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total ROI</span>
                              <span className="font-medium text-purple-600">{results.totalROI}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Payback Period</span>
                              <span className="font-medium">{results.paybackPeriod} years</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Investment Insights */}
                    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Investment Insights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">💡 Key Metrics</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Rental yield: {rentalYield[0]}% annually</li>
                              <li>• Capital appreciation: {appreciationRate[0]}% per year</li>
                              <li>• Break-even: {results.paybackPeriod} years</li>
                              <li>• Total returns: {results.totalROI}% over {investmentPeriod[0]} years</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">📈 Investment Grade</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>ROI Grade: {parseFloat(results.annualizedROI) > 12 ? 'Excellent' : parseFloat(results.annualizedROI) > 8 ? 'Good' : 'Average'}</div>
                              <div>Risk Level: {rentalYield[0] > 7 ? 'Low' : 'Medium'}</div>
                              <div>Liquidity: Real estate (Medium)</div>
                              <div>Tax Efficiency: Consider LTCG benefits</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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