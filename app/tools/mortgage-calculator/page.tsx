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
import { useAuthStore } from '@/lib/store';
import { 
  Calculator, 
  IndianRupee, 
  Calendar, 
  Percent,
  TrendingUp,
  PieChart,
  BarChart3,
  Crown,
  Lock
} from 'lucide-react';
import { Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import Link from 'next/link';

export default function MortgageCalculatorPage() {
  const { user } = useAuthStore();
  const [loanAmount, setLoanAmount] = useState([5000000]); // 50L
  const [interestRate, setInterestRate] = useState([9]); // 9%
  const [loanTenure, setLoanTenure] = useState([20]); // 20 years
  const [downPayment, setDownPayment] = useState([1000000]); // 10L
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure, downPayment]);

  const calculateEMI = () => {
    const principal = loanAmount[0];
    const rate = interestRate[0] / (12 * 100);
    const tenure = loanTenure[0] * 12;

    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    const totalAmount = emi * tenure;
    const totalInterest = totalAmount - principal;

    // Generate amortization schedule
    const schedule = [];
    let balance = principal;
    
    for (let month = 1; month <= Math.min(tenure, 12); month++) {
      const interestPayment = balance * rate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;
      
      schedule.push({
        month,
        emi: Math.round(emi),
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.round(balance)
      });
    }

    // Generate yearly breakdown
    const yearlyBreakdown = [];
    let yearlyBalance = principal;
    
    for (let year = 1; year <= Math.min(loanTenure[0], 10); year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        const monthlyInterest = yearlyBalance * rate;
        const monthlyPrincipal = emi - monthlyInterest;
        yearlyPrincipal += monthlyPrincipal;
        yearlyInterest += monthlyInterest;
        yearlyBalance -= monthlyPrincipal;
      }
      
      yearlyBreakdown.push({
        year,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        balance: Math.round(yearlyBalance)
      });
    }

    setResults({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      propertyValue: principal + downPayment[0],
      schedule,
      yearlyBreakdown,
      pieData: [
        { name: 'Principal', value: Math.round(principal), color: '#3b82f6' },
        { name: 'Interest', value: Math.round(totalInterest), color: '#ef4444' }
      ]
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
                Please login to access the Advanced Mortgage Calculator
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
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-yellow-500 mr-2" />
                <Badge className="bg-yellow-500 text-white">Premium Tool</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Advanced Mortgage Calculator
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Calculate EMI, analyze payment schedules, and plan your home loan with detailed insights
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
                      <span>Loan Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Loan Amount */}
                    <div>
                      <Label className="flex items-center space-x-2">
                        <IndianRupee className="w-4 h-4" />
                        <span>Loan Amount</span>
                      </Label>
                      <div className="mt-2">
                        <Slider
                          value={loanAmount}
                          onValueChange={setLoanAmount}
                          max={50000000}
                          min={100000}
                          step={100000}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>₹1L</span>
                          <span className="font-medium">{formatPrice(loanAmount[0])}</span>
                          <span>₹5Cr</span>
                        </div>
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div>
                      <Label className="flex items-center space-x-2">
                        <Percent className="w-4 h-4" />
                        <span>Interest Rate (% p.a.)</span>
                      </Label>
                      <div className="mt-2">
                        <Slider
                          value={interestRate}
                          onValueChange={setInterestRate}
                          max={15}
                          min={6}
                          step={0.1}
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

                    {/* Down Payment */}
                    <div>
                      <Label>Down Payment</Label>
                      <div className="mt-2">
                        <Slider
                          value={downPayment}
                          onValueChange={setDownPayment}
                          max={10000000}
                          min={0}
                          step={50000}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>₹0</span>
                          <span className="font-medium">{formatPrice(downPayment[0])}</span>
                          <span>₹1Cr</span>
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
                    {/* EMI Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            ₹{results.emi.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Monthly EMI</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {formatPrice(results.totalAmount)}
                          </div>
                          <div className="text-sm text-gray-600">Total Amount</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-red-600 mb-1">
                            {formatPrice(results.totalInterest)}
                          </div>
                          <div className="text-sm text-gray-600">Total Interest</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {formatPrice(results.propertyValue)}
                          </div>
                          <div className="text-sm text-gray-600">Property Value</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Principal vs Interest */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <PieChart className="w-5 h-5" />
                            <span>Principal vs Interest</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie
                                data={results.pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {results.pieData.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: any) => formatPrice(value)} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="mt-4 space-y-2">
                            {results.pieData.map((item: any, index: number) => (
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

                      {/* Yearly Breakdown */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5" />
                            <span>Yearly Payment Breakdown</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={results.yearlyBreakdown}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis />
                              <Tooltip formatter={(value: any) => formatPrice(value)} />
                              <Bar dataKey="principal" fill="#3b82f6" />
                              <Bar dataKey="interest" fill="#ef4444" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Amortization Schedule */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Payment Schedule (First Year)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Month</th>
                                <th className="text-right p-2">EMI</th>
                                <th className="text-right p-2">Principal</th>
                                <th className="text-right p-2">Interest</th>
                                <th className="text-right p-2">Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results.schedule.map((row: any) => (
                                <tr key={row.month} className="border-b">
                                  <td className="p-2">{row.month}</td>
                                  <td className="text-right p-2">₹{row.emi.toLocaleString()}</td>
                                  <td className="text-right p-2">₹{row.principal.toLocaleString()}</td>
                                  <td className="text-right p-2">₹{row.interest.toLocaleString()}</td>
                                  <td className="text-right p-2">₹{row.balance.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Loan Insights */}
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Loan Insights & Tips</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">💡 Smart Tips</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Higher down payment reduces EMI burden</li>
                              <li>• Shorter tenure saves on total interest</li>
                              <li>• Consider prepayment to reduce interest</li>
                              <li>• Compare rates from multiple lenders</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">📊 Your Loan Profile</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Loan-to-Value: {((loanAmount[0] / results.propertyValue) * 100).toFixed(1)}%</div>
                              <div>Interest-to-Principal: {((results.totalInterest / loanAmount[0]) * 100).toFixed(1)}%</div>
                              <div>EMI-to-Income: Calculate based on your income</div>
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