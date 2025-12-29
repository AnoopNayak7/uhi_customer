"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store";
import { ToolUsagePrompt } from "@/components/signup/ToolUsagePrompt";
import { SmartSignupPrompt } from "@/components/signup/SmartSignupPrompt";
import {
  Calculator,
  IndianRupee,
  Calendar,
  Percent,
  TrendingUp,
  PieChart,
  BarChart3,
  Crown,
  Lock,
  Home,
  Banknote,
  Clock,
} from "lucide-react";
import {
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MortgageCalculatorPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loanAmount, setLoanAmount] = useState([5000000]); // 50L
  const [interestRate, setInterestRate] = useState([9]); // 9%
  const [loanTenure, setLoanTenure] = useState([20]); // 20 years
  const [downPayment, setDownPayment] = useState([1000000]); // 10L
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateEMI = useCallback(() => {
    // Show signup prompt if not authenticated
    if (!isAuthenticated) {
      const dismissedKey = "signup-prompt-dismissed-tool-usage";
      const dismissedTime = localStorage.getItem(dismissedKey);
      if (dismissedTime) {
        const hoursSinceDismiss =
          (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
        if (hoursSinceDismiss < 24) {
          // Continue with calculation if dismissed recently
        } else {
          setShowSignupModal(true);
          return;
        }
      } else {
        setShowSignupModal(true);
        return;
      }
    }

    // Validate inputs
    if (loanAmount[0] <= 0 || interestRate[0] <= 0 || loanTenure[0] <= 0) {
      setResults(null);
      return;
    }

    setIsCalculating(true);

    // Use setTimeout to simulate calculation and prevent UI blocking
    setTimeout(() => {
      const principal = loanAmount[0];
      const rate = interestRate[0] / (12 * 100);
      const tenure = loanTenure[0] * 12;

      const emi =
        (principal * rate * Math.pow(1 + rate, tenure)) /
        (Math.pow(1 + rate, tenure) - 1);
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
          balance: Math.round(balance),
        });
      }

      // Generate yearly breakdown for the full tenure
      const yearlyBreakdown = [];
      let yearlyBalance = principal;

      for (let year = 1; year <= loanTenure[0]; year++) {
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;

        for (let month = 1; month <= 12; month++) {
          if (yearlyBalance > 0) {
            const monthlyInterest = yearlyBalance * rate;
            const monthlyPrincipal = emi - monthlyInterest;
            yearlyPrincipal += monthlyPrincipal;
            yearlyInterest += monthlyInterest;
            yearlyBalance -= monthlyPrincipal;
          }
        }

        yearlyBreakdown.push({
          year,
          principal: Math.round(yearlyPrincipal),
          interest: Math.round(yearlyInterest),
          balance: Math.round(Math.max(0, yearlyBalance)),
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
          { name: "Principal", value: Math.round(principal), color: "#3b82f6" },
          {
            name: "Interest",
            value: Math.round(totalInterest),
            color: "#ef4444",
          },
        ],
      });
      setIsCalculating(false);
    }, 100);
  }, [loanAmount, interestRate, loanTenure, downPayment]);

  useEffect(() => {
    calculateEMI();
  }, [calculateEMI]);

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
    <ToolUsagePrompt toolName="Mortgage Calculator">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Premium Tool
              </h2>
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Airbnb Style */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-full mb-6">
                <Home className="w-6 h-6 text-rose-500 mr-2" />
                <span className="text-sm font-medium text-rose-700 bg-white px-3 py-1 rounded-full">
                  Premium Calculator
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Smart Mortgage
                <span className="block text-transparent bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text">
                  Calculator
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                Plan your dream home purchase with precision. Calculate EMI,
                analyze payment schedules, and make informed decisions with our
                advanced mortgage calculator.
              </p>

              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calculator className="w-4 h-4 mr-2" />
                  <span>Instant Calculations</span>
                </div>
                <div className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span>Detailed Analytics</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>Smart Insights</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Input Panel */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="lg:sticky lg:top-8 shadow-xl border-0 bg-white">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                          <Calculator className="w-5 h-5 text-white" />
                        </div>
                        Loan Details
                      </CardTitle>
                      <p className="text-gray-600">
                        Adjust the parameters to see your personalized EMI
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Loan Amount */}
                      <div className="space-y-4">
                        <Label className="text-lg font-semibold text-gray-900 flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <IndianRupee className="w-4 h-4 text-blue-600" />
                          </div>
                          Loan Amount
                        </Label>
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                          <Slider
                            value={loanAmount}
                            onValueChange={setLoanAmount}
                            max={50000000}
                            min={100000}
                            step={100000}
                            className="mb-4"
                          />
                          <div className="flex justify-between text-sm text-gray-600 mb-4">
                            <span>₹1L</span>
                            <span className="font-bold text-lg text-gray-900">
                              {formatPrice(loanAmount[0])}
                            </span>
                            <span>₹5Cr</span>
                          </div>
                          <Input
                            type="text"
                            defaultValue={loanAmount[0]}
                            key={loanAmount[0]}
                            onChange={() => {}}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const value = parseInt(e.currentTarget.value);
                                if (!isNaN(value)) {
                                  const clampedValue = Math.max(
                                    100000,
                                    Math.min(50000000, value)
                                  );
                                  setLoanAmount([clampedValue]);
                                  e.currentTarget.value =
                                    clampedValue.toString();
                                } else {
                                  e.currentTarget.value =
                                    loanAmount[0].toString();
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value.trim() === "") {
                                setLoanAmount([100000]);
                                e.target.value = "100000";
                              } else {
                                const numValue = parseInt(value);
                                if (!isNaN(numValue)) {
                                  const clampedValue = Math.max(
                                    100000,
                                    Math.min(50000000, numValue)
                                  );
                                  setLoanAmount([clampedValue]);
                                  e.target.value = clampedValue.toString();
                                } else {
                                  e.target.value = loanAmount[0].toString();
                                }
                              }
                            }}
                            className="text-center font-medium bg-white border-2 border-gray-200 rounded-xl h-12"
                            placeholder="Enter loan amount (₹1L - ₹5Cr)"
                          />
                        </div>
                      </div>

                      {/* Interest Rate */}
                      <div className="space-y-4">
                        <Label className="text-lg font-semibold text-gray-900 flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <Percent className="w-4 h-4 text-green-600" />
                          </div>
                          Interest Rate (% p.a.)
                        </Label>
                        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                          <Slider
                            value={interestRate}
                            onValueChange={setInterestRate}
                            max={15}
                            min={6}
                            step={0.1}
                            className="mb-4"
                          />
                          <div className="flex justify-between text-sm text-gray-600 mb-4">
                            <span>6%</span>
                            <span className="font-bold text-lg text-gray-900">
                              {interestRate[0]}%
                            </span>
                            <span>15%</span>
                          </div>
                          <Input
                            type="text"
                            defaultValue={interestRate[0]}
                            key={interestRate[0]}
                            onChange={() => {}}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const value = parseFloat(e.currentTarget.value);
                                if (!isNaN(value)) {
                                  const clampedValue = Math.max(
                                    6,
                                    Math.min(15, value)
                                  );
                                  setInterestRate([clampedValue]);
                                  e.currentTarget.value =
                                    clampedValue.toString();
                                } else {
                                  e.currentTarget.value =
                                    interestRate[0].toString();
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value.trim() === "") {
                                setInterestRate([6]);
                                e.target.value = "6";
                              } else {
                                const numValue = parseFloat(value);
                                if (!isNaN(numValue)) {
                                  const clampedValue = Math.max(
                                    6,
                                    Math.min(15, numValue)
                                  );
                                  setInterestRate([clampedValue]);
                                  e.target.value = clampedValue.toString();
                                } else {
                                  e.target.value = interestRate[0].toString();
                                }
                              }
                            }}
                            className="text-center font-medium bg-white border-2 border-gray-200 rounded-xl h-12"
                            placeholder="Enter interest rate (6% - 15%)"
                          />
                        </div>
                      </div>

                      {/* Loan Tenure */}
                      <div className="space-y-4">
                        <Label className="text-lg font-semibold text-gray-900 flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <Clock className="w-4 h-4 text-purple-600" />
                          </div>
                          Loan Tenure (Years)
                        </Label>
                        <div className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl">
                          <Slider
                            value={loanTenure}
                            onValueChange={setLoanTenure}
                            max={30}
                            min={5}
                            step={1}
                            className="mb-4"
                          />
                          <div className="flex justify-between text-sm text-gray-600 mb-4">
                            <span>5 years</span>
                            <span className="font-bold text-lg text-gray-900">
                              {loanTenure[0]} years
                            </span>
                            <span>30 years</span>
                          </div>
                          <Input
                            type="text"
                            defaultValue={loanTenure[0]}
                            key={loanTenure[0]}
                            onChange={() => {}}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const value = parseInt(e.currentTarget.value);
                                if (!isNaN(value)) {
                                  const clampedValue = Math.max(
                                    5,
                                    Math.min(30, value)
                                  );
                                  setLoanTenure([clampedValue]);
                                  e.currentTarget.value =
                                    clampedValue.toString();
                                } else {
                                  e.currentTarget.value =
                                    loanTenure[0].toString();
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value.trim() === "") {
                                setLoanTenure([5]);
                                e.target.value = "5";
                              } else {
                                const numValue = parseInt(value);
                                if (!isNaN(numValue)) {
                                  const clampedValue = Math.max(
                                    5,
                                    Math.min(30, numValue)
                                  );
                                  setLoanTenure([clampedValue]);
                                  e.target.value = clampedValue.toString();
                                } else {
                                  e.target.value = loanTenure[0].toString();
                                }
                              }
                            }}
                            className="text-center font-medium bg-white border-2 border-gray-200 rounded-xl h-12"
                            placeholder="Enter tenure (5-30 years)"
                          />
                        </div>
                      </div>

                      {/* Down Payment */}
                      <div className="space-y-4">
                        <Label className="text-lg font-semibold text-gray-900 flex items-center">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <Banknote className="w-4 h-4 text-orange-600" />
                          </div>
                          Down Payment
                        </Label>
                        <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl">
                          <Slider
                            value={downPayment}
                            onValueChange={setDownPayment}
                            max={10000000}
                            min={0}
                            step={50000}
                            className="mb-4"
                          />
                          <div className="flex justify-between text-sm text-gray-600 mb-4">
                            <span>₹0</span>
                            <span className="font-bold text-lg text-gray-900">
                              {formatPrice(downPayment[0])}
                            </span>
                            <span>₹1Cr</span>
                          </div>
                          <Input
                            type="text"
                            defaultValue={downPayment[0]}
                            key={downPayment[0]}
                            onChange={() => {}}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const value = parseInt(e.currentTarget.value);
                                if (!isNaN(value)) {
                                  const clampedValue = Math.max(
                                    0,
                                    Math.min(10000000, value)
                                  );
                                  setDownPayment([clampedValue]);
                                  e.currentTarget.value =
                                    clampedValue.toString();
                                } else {
                                  e.currentTarget.value =
                                    downPayment[0].toString();
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value.trim() === "") {
                                setDownPayment([0]);
                                e.target.value = "0";
                              } else {
                                const numValue = parseInt(value);
                                if (!isNaN(numValue)) {
                                  const clampedValue = Math.max(
                                    0,
                                    Math.min(10000000, numValue)
                                  );
                                  setDownPayment([clampedValue]);
                                  e.target.value = clampedValue.toString();
                                } else {
                                  e.target.value = downPayment[0].toString();
                                }
                              }
                            }}
                            className="text-center font-medium bg-white border-2 border-gray-200 rounded-xl h-12"
                            placeholder="Enter down payment (₹0 - ₹1Cr)"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {isCalculating && (
                    <div className="flex items-center justify-center h-96 bg-white rounded-3xl shadow-xl">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-rose-500 mx-auto mb-6"></div>
                        <p className="text-xl font-medium text-gray-700">
                          Calculating your EMI...
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Please wait while we crunch the numbers
                        </p>
                      </div>
                    </div>
                  )}
                  {!isCalculating && !results && (
                    <div className="flex items-center justify-center h-96 bg-white rounded-3xl shadow-xl">
                      <div className="text-center max-w-md mx-auto">
                        <div className="w-20 h-20 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Calculator className="w-10 h-10 text-rose-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          Ready to Calculate
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          Adjust the loan parameters on the left to see your
                          personalized EMI calculation and detailed analysis
                        </p>
                      </div>
                    </div>
                  )}
                  {!isCalculating && results && (
                    <div className="space-y-8">
                      {/* EMI Hero Card */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl"
                      >
                        <div className="text-center">
                          <p className="text-rose-100 mb-2 text-lg">
                            Your Monthly EMI
                          </p>
                          <h2 className="text-5xl md:text-6xl font-bold mb-4">
                            ₹{results.emi.toLocaleString()}
                          </h2>
                          <p className="text-rose-100 text-lg">
                            Making your dream home affordable with structured
                            payments
                          </p>
                        </div>
                      </motion.div>

                      {/* Financial Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.7 }}
                        >
                          <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
                            <CardContent className="p-8 text-center">
                              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-green-600" />
                              </div>
                              <div className="text-3xl font-bold text-gray-900 mb-2">
                                {formatPrice(results.totalAmount)}
                              </div>
                              <div className="text-gray-600 font-medium">
                                Total Amount Payable
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Over {loanTenure[0]} years
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.8 }}
                        >
                          <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
                            <CardContent className="p-8 text-center">
                              <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Percent className="w-8 h-8 text-red-600" />
                              </div>
                              <div className="text-3xl font-bold text-gray-900 mb-2">
                                {formatPrice(results.totalInterest)}
                              </div>
                              <div className="text-gray-600 font-medium">
                                Total Interest
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {(
                                  (results.totalInterest / loanAmount[0]) *
                                  100
                                ).toFixed(1)}
                                % of principal
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.9 }}
                        >
                          <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
                            <CardContent className="p-8 text-center">
                              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Home className="w-8 h-8 text-blue-600" />
                              </div>
                              <div className="text-3xl font-bold text-gray-900 mb-2">
                                {formatPrice(results.propertyValue)}
                              </div>
                              <div className="text-gray-600 font-medium">
                                Property Value
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Loan-to-Value:{" "}
                                {(
                                  (loanAmount[0] / results.propertyValue) *
                                  100
                                ).toFixed(1)}
                                %
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>

                      {/* Payment Breakdown Chart */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                      >
                        <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mr-3">
                                <BarChart3 className="w-5 h-5 text-white" />
                              </div>
                              Payment Breakdown Over Time
                            </CardTitle>
                            <p className="text-gray-600">
                              See how your payments are distributed between
                              principal and interest over {loanTenure[0]} years
                            </p>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[400px] mb-6">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={results.yearlyBreakdown}
                                  margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                  }}
                                >
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                  />
                                  <XAxis
                                    dataKey="year"
                                    tick={{ fontSize: 12, fill: "#666" }}
                                    tickLine={{ stroke: "#ddd" }}
                                    axisLine={{ stroke: "#ddd" }}
                                  />
                                  <YAxis
                                    tick={{ fontSize: 12, fill: "#666" }}
                                    tickLine={{ stroke: "#ddd" }}
                                    axisLine={{ stroke: "#ddd" }}
                                    tickFormatter={(value) =>
                                      formatPrice(value)
                                    }
                                  />
                                  <Tooltip
                                    formatter={(value: any) => [
                                      formatPrice(value),
                                      value ===
                                      results.yearlyBreakdown[0]?.principal
                                        ? "Principal"
                                        : "Interest",
                                    ]}
                                    labelFormatter={(label) => `Year ${label}`}
                                    contentStyle={{
                                      backgroundColor: "white",
                                      border: "none",
                                      borderRadius: "12px",
                                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                    }}
                                  />
                                  <Bar
                                    dataKey="principal"
                                    fill="url(#principalGradient)"
                                    name="Principal"
                                    radius={[4, 4, 0, 0]}
                                  />
                                  <Bar
                                    dataKey="interest"
                                    fill="url(#interestGradient)"
                                    name="Interest"
                                    radius={[4, 4, 0, 0]}
                                  />
                                  <defs>
                                    <linearGradient
                                      id="principalGradient"
                                      x1="0"
                                      y1="0"
                                      x2="0"
                                      y2="1"
                                    >
                                      <stop offset="0%" stopColor="#3b82f6" />
                                      <stop offset="100%" stopColor="#1d4ed8" />
                                    </linearGradient>
                                    <linearGradient
                                      id="interestGradient"
                                      x1="0"
                                      y1="0"
                                      x2="0"
                                      y2="1"
                                    >
                                      <stop offset="0%" stopColor="#ef4444" />
                                      <stop offset="100%" stopColor="#dc2626" />
                                    </linearGradient>
                                  </defs>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Chart Legend */}
                            <div className="flex items-center justify-center space-x-8 text-sm">
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-gradient-to-b from-blue-500 to-blue-700 rounded mr-2"></div>
                                <span className="text-gray-700 font-medium">
                                  Principal Payment
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-gradient-to-b from-red-500 to-red-700 rounded mr-2"></div>
                                <span className="text-gray-700 font-medium">
                                  Interest Payment
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Amortization Schedule */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                      >
                        <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                                <Calendar className="w-5 h-5 text-white" />
                              </div>
                              Payment Schedule (First Year)
                            </CardTitle>
                            <p className="text-gray-600">
                              Month-by-month breakdown of your EMI components
                            </p>
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b-2 border-gray-100">
                                    <th className="text-left p-4 font-bold text-gray-900">
                                      Month
                                    </th>
                                    <th className="text-right p-4 font-bold text-gray-900">
                                      EMI
                                    </th>
                                    <th className="text-right p-4 font-bold text-blue-600">
                                      Principal
                                    </th>
                                    <th className="text-right p-4 font-bold text-red-600">
                                      Interest
                                    </th>
                                    <th className="text-right p-4 font-bold text-gray-900">
                                      Balance
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {results.schedule.map(
                                    (row: any, index: number) => (
                                      <tr
                                        key={row.month}
                                        className={`border-b border-gray-50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-colors ${
                                          index % 2 === 0 ? "bg-gray-25" : ""
                                        }`}
                                      >
                                        <td className="p-4 font-semibold text-gray-900">
                                          {row.month}
                                        </td>
                                        <td className="text-right p-4 font-medium">
                                          ₹{row.emi.toLocaleString()}
                                        </td>
                                        <td className="text-right p-4 font-medium text-blue-600">
                                          ₹{row.principal.toLocaleString()}
                                        </td>
                                        <td className="text-right p-4 font-medium text-red-600">
                                          ₹{row.interest.toLocaleString()}
                                        </td>
                                        <td className="text-right p-4 font-medium">
                                          ₹{row.balance.toLocaleString()}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Smart Insights */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                      >
                        <Card className="bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 shadow-xl border-0 rounded-2xl overflow-hidden">
                          <CardContent className="p-8">
                            <div className="text-center mb-8">
                              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-white" />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Smart Loan Insights
                              </h3>
                              <p className="text-gray-600">
                                Optimize your home loan strategy with expert
                                recommendations
                              </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                <h4 className="text-xl font-bold text-gray-900 flex items-center">
                                  <span className="text-2xl mr-3">💡</span>
                                  Smart Tips
                                </h4>
                                <div className="space-y-4">
                                  <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <p className="text-gray-700">
                                      Higher down payment reduces EMI burden and
                                      total interest
                                    </p>
                                  </div>
                                  <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <p className="text-gray-700">
                                      Shorter tenure saves significantly on
                                      total interest paid
                                    </p>
                                  </div>
                                  <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                    <p className="text-gray-700">
                                      Consider prepayment to reduce interest
                                      burden
                                    </p>
                                  </div>
                                  <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                    <p className="text-gray-700">
                                      Compare rates from multiple lenders for
                                      best deals
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <h4 className="text-xl font-bold text-gray-900 flex items-center">
                                  <span className="text-2xl mr-3">📊</span>
                                  Your Loan Profile
                                </h4>
                                <div className="bg-white rounded-xl p-6 space-y-4">
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                      Loan-to-Value Ratio
                                    </span>
                                    <span className="font-bold text-lg text-gray-900">
                                      {(
                                        (loanAmount[0] /
                                          results.propertyValue) *
                                        100
                                      ).toFixed(1)}
                                      %
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                      Interest-to-Principal Ratio
                                    </span>
                                    <span className="font-bold text-lg text-gray-900">
                                      {(
                                        (results.totalInterest /
                                          loanAmount[0]) *
                                        100
                                      ).toFixed(1)}
                                      %
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">
                                      Monthly Payment
                                    </span>
                                    <span className="font-bold text-lg text-rose-600">
                                      ₹{results.emi.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500 text-center">
                                      💼 Recommended: Keep EMI below 30% of
                                      monthly income
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Signup Modal - Shows when user tries to use tool without login */}
      {showSignupModal && (
        <SmartSignupPrompt
          trigger="tool-usage"
          context={{ toolName: "Mortgage Calculator" }}
          onDismiss={() => {
            setShowSignupModal(false);
            localStorage.setItem(
              "signup-prompt-dismissed-tool-usage",
              Date.now().toString()
            );
          }}
          onSignup={() => {
            setShowSignupModal(false);
          }}
        />
      )}
    </div>
    </ToolUsagePrompt>
  );
}
