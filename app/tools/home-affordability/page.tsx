"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/lib/store';
import { 
  Home, 
  IndianRupee, 
  Calendar, 
  Percent,
  Calculator,
  Crown,
  Lock,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Link from 'next/link';

export default function HomeAffordabilityPage() {
  const { user } = useAuthStore();
  const [monthlyIncome, setMonthlyIncome] = useState([100000]); // 1L
  const [monthlyExpenses, setMonthlyExpenses] = useState([40000]); // 40K
  const [existingEMIs, setExistingEMIs] = useState([0]); // 0
  const [downPaymentSavings, setDownPaymentSavings] = useState([1000000]); // 10L
  const [interestRate, setInterestRate] = useState([9]); // 9%
  const [loanTenure, setLoanTenure] = useState([20]); // 20 years
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateAffordability();
  }, [monthlyIncome, monthlyExpenses, existingEMIs, downPaymentSavings, interestRate, loanTenure]);

  const calculateAffordability = () => {
    const income = monthlyIncome[0];
    const expenses = monthlyExpenses[0];
    const existingEMI = existingEMIs[0];
    const savings = downPaymentSavings[0];
    const rate = interestRate[0] / (12 * 100);
    const tenure = loanTenure[0] * 12;

    // Calculate disposable income
    const disposableIncome = income - expenses - existingEMI;
    
    // Safe EMI (40% of disposable income)
    const safeEMI = disposableIncome * 0.4;
    const maxEMI = disposableIncome * 0.6; // Maximum recommended

    // Calculate loan amount based on EMI
    const safeLoanAmount = (safeEMI * (Math.pow(1 + rate, tenure) - 1)) / (rate * Math.pow(1 + rate, tenure));
    const maxLoanAmount = (maxEMI * (Math.pow(1 + rate, tenure) - 1)) / (rate * Math.pow(1 + rate, tenure));

    // Total property value
    const safePropertyValue = safeLoanAmount + savings;
    const maxPropertyValue = maxLoanAmount + savings;

    // Affordability categories
    const budgetRanges = [
      { range: '₹20L - ₹50L', min: 2000000, max: 5000000, affordable: safePropertyValue >= 2000000 },
      { range: '₹50L - ₹1Cr', min: 5000000, max: 10000000, affordable: safePropertyValue >= 5000000 },
      { range: '₹1Cr - ₹2Cr', min: 10000000, max: 20000000, affordable: safePropertyValue >= 10000000 },
      { range: '₹2Cr - ₹5Cr', min: 20000000, max: 50000000, affordable: safePropertyValue >= 20000000 },
      { range: '₹5Cr+', min: 50000000, max: Infinity, affordable: safePropertyValue >= 50000000 }
    ];

    // Income breakdown
    const incomeBreakdown = [
      { name: 'EMI (Safe)', value: Math.round(safeEMI), color: '#3b82f6' },
      { name: 'Living Expenses', value: Math.round(expenses), color: '#ef4444' },
      { name: 'Existing EMIs', value: Math.round(existingEMI), color: '#f59e0b' },
      { name: 'Savings/Others', value: Math.round(income - expenses - existingEMI - safeEMI), color: '#10b981' }
    ];

    // Property recommendations
    const recommendations = [
      {
        type: '2 BHK Apartment',
        priceRange: '₹40L - ₹80L',
        suitable: safePropertyValue >= 4000000,
        description: 'Perfect for small families or first-time buyers'
      },
      {
        type: '3 BHK Apartment',
        priceRange: '₹60L - ₹1.2Cr',
        suitable: safePropertyValue >= 6000000,
        description: 'Ideal for growing families with good space'
      },
      {
        type: 'Independent House',
        priceRange: '₹80L - ₹2Cr',
        suitable: safePropertyValue >= 8000000,
        description: 'More privacy and space for larger families'
      },
      {
        type: 'Villa/Premium',
        priceRange: '₹1.5Cr+',
        suitable: safePropertyValue >= 15000000,
        description: 'Luxury living with premium amenities'
      }
    ];

    setResults({
      disposableIncome: Math.round(disposableIncome),
      safeEMI: Math.round(safeEMI),
      maxEMI: Math.round(maxEMI),
      safeLoanAmount: Math.round(safeLoanAmount),
      maxLoanAmount: Math.round(maxLoanAmount),
      safePropertyValue: Math.round(safePropertyValue),
      maxPropertyValue: Math.round(maxPropertyValue),
      budgetRanges,
      incomeBreakdown,
      recommendations,
      affordabilityScore: Math.min(100, (disposableIncome / income) * 100),
      debtToIncomeRatio: ((existingEMI + safeEMI) / income) * 100
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
                Please login to access the Home Affordability Calculator
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
        <section className="bg-gradient-to-r from-orange-50 to-red-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-yellow-500 mr-2" />
                <Badge className="bg-yellow-500 text-white">Premium Tool</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Home Affordability Calculator
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Determine how much house you can afford based on your income and financial situation
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
                      <span>Financial Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Monthly Income */}
                    <div>
                      <Label className="flex items-center space-x-2">
                        <IndianRupee className="w-4 h-4" />
                        <span>Monthly Income</span>
                      </Label>
                      <div className="mt-2">
                        <Slider
                          value={monthlyIncome}
                          onValueChange={setMonthlyIncome}
                          max={1000000}
                          min={25000}
                          step={5000}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>₹25K</span>
                          <span className="font-medium">₹{monthlyIncome[0].toLocaleString()}</span>
                          <span>₹10L</span>
                        </div>
                      </div>
                    </div>

                    {/* Monthly Expenses */}
                    <div>
                      <Label>Monthly Living Expenses</Label>
                      <div className="mt-2">
                        <Slider
                          value={monthlyExpenses}
                          onValueChange={setMonthlyExpenses}
                          max={monthlyIncome[0] * 0.8}
                          min={monthlyIncome[0] * 0.2}
                          step={2000}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>₹{Math.round(monthlyIncome[0] * 0.2).toLocaleString()}</span>
                          <span className="font-medium">₹{monthlyExpenses[0].toLocaleString()}</span>
                          <span>₹{Math.round(monthlyIncome[0] * 0.8).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Existing EMIs */}
                    <div>
                      <Label>Existing EMIs</Label>
                      <div className="mt-2">
                        <Slider
                          value={existingEMIs}
                          onValueChange={setExistingEMIs}
                          max={monthlyIncome[0] * 0.3}
                          min={0}
                          step={1000}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>₹0</span>
                          <span className="font-medium">₹{existingEMIs[0].toLocaleString()}</span>
                          <span>₹{Math.round(monthlyIncome[0] * 0.3).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Down Payment Savings */}
                    <div>
                      <Label>Available Down Payment</Label>
                      <div className="mt-2">
                        <Slider
                          value={downPaymentSavings}
                          onValueChange={setDownPaymentSavings}
                          max={10000000}
                          min={0}
                          step={50000}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>₹0</span>
                          <span className="font-medium">{formatPrice(downPaymentSavings[0])}</span>
                          <span>₹1Cr</span>
                        </div>
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div>
                      <Label className="flex items-center space-x-2">
                        <Percent className="w-4 h-4" />
                        <span>Interest Rate (%)</span>
                      </Label>
                      <div className="mt-2">
                        <Slider
                          value={interestRate}
                          onValueChange={setInterestRate}
                          max={15}
                          min={6}
                          step={0.25}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>6%</span>
                          <span className="font-medium">{interestRate[0]}%</span>
                          <span>15%</span>
                        </div>
                      </div>
                    </div>

                    {/* Loan Tenure */}
                    <div>
                      <Label className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Loan Tenure (Years)</span>
                      </Label>
                      <div className="mt-2">
                        <Slider
                          value={loanTenure}
                          onValueChange={setLoanTenure}
                          max={30}
                          min={5}
                          step={1}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>5 years</span>
                          <span className="font-medium">{loanTenure[0]} years</span>
                          <span>30 years</span>
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
                    {/* Affordability Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {formatPrice(results.safePropertyValue)}
                          </div>
                          <div className="text-sm text-gray-600">Safe Budget</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-orange-600 mb-1">
                            {formatPrice(results.maxPropertyValue)}
                          </div>
                          <div className="text-sm text-gray-600">Maximum Budget</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            ₹{results.safeEMI.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Recommended EMI</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Affordability Score */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5" />
                          <span>Financial Health Score</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Affordability Score</span>
                              <span className="text-sm font-bold text-gray-900">{Math.round(results.affordabilityScore)}/100</span>
                            </div>
                            <Progress value={results.affordabilityScore} className="h-3" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Debt-to-Income Ratio</span>
                              <span className="text-sm font-bold text-gray-900">{Math.round(results.debtToIncomeRatio)}%</span>
                            </div>
                            <Progress value={results.debtToIncomeRatio} className="h-3" />
                            <p className="text-xs text-gray-500 mt-1">
                              Recommended: Below 40%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Income Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Monthly Income Allocation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie
                                data={results.incomeBreakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {results.incomeBreakdown.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="mt-4 space-y-2">
                            {results.incomeBreakdown.map((item: any, index: number) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div 
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="text-sm text-gray-600">{item.name}</span>
                                </div>
                                <span className="text-sm font-medium">₹{item.value.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Budget Ranges */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Property Budget Ranges</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {results.budgetRanges.map((range: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-900">{range.range}</span>
                                {range.affordable ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-red-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Property Recommendations */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Property Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {results.recommendations.map((rec: any, index: number) => (
                            <div key={index} className={`p-4 rounded-lg border ${
                              rec.suitable ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{rec.type}</h4>
                                {rec.suitable ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <AlertTriangle className="w-5 h-5 text-red-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{rec.priceRange}</p>
                              <p className="text-xs text-gray-500">{rec.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Financial Tips */}
                    <Card className="bg-gradient-to-r from-orange-50 to-red-50">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Financial Tips</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">💡 Improve Affordability</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Increase your down payment savings</li>
                              <li>• Pay off existing debts to reduce EMI burden</li>
                              <li>• Consider a longer tenure for lower EMI</li>
                              <li>• Look for properties in emerging areas</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">⚠️ Important Considerations</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Keep EMI below 40% of income</li>
                              <li>• Factor in registration and other costs</li>
                              <li>• Maintain emergency fund (6 months expenses)</li>
                              <li>• Consider future income growth</li>
                            </ul>
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