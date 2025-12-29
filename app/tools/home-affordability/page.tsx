"use client";

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/lib/store";
import { ToolUsagePrompt } from "@/components/signup/ToolUsagePrompt";
import { SmartSignupPrompt } from "@/components/signup/SmartSignupPrompt";
import {
  MotionWrapper,
  StaggerContainer,
  StaggerItem,
  HoverScale,
} from "@/components/animations/motion-wrapper";
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
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import Link from "next/link";

export default function HomeAffordabilityPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState([100000]); // 1L
  const [monthlyExpenses, setMonthlyExpenses] = useState([40000]); // 40K
  const [existingEMIs, setExistingEMIs] = useState([0]); // 0
  const [downPaymentSavings, setDownPaymentSavings] = useState([1000000]); // 10L
  const [interestRate, setInterestRate] = useState([9]); // 9%
  const [loanTenure, setLoanTenure] = useState([20]); // 20 years
  const [results, setResults] = useState<any>(null);

  const calculateAffordability = useCallback(() => {
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

    console.log("calculateAffordability called with:", {
      monthlyIncome: monthlyIncome[0],
      monthlyExpenses: monthlyExpenses[0],
      existingEMIs: existingEMIs[0],
      downPaymentSavings: downPaymentSavings[0],
      interestRate: interestRate[0],
      loanTenure: loanTenure[0],
    });

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
    const safeLoanAmount =
      (safeEMI * (Math.pow(1 + rate, tenure) - 1)) /
      (rate * Math.pow(1 + rate, tenure));
    const maxLoanAmount =
      (maxEMI * (Math.pow(1 + rate, tenure) - 1)) /
      (rate * Math.pow(1 + rate, tenure));

    // Total property value
    const safePropertyValue = safeLoanAmount + savings;
    const maxPropertyValue = maxLoanAmount + savings;

    // Downpayment requirements
    const requiredDownPayment = safePropertyValue * 0.1; // 10% of property value
    const downPaymentStatus =
      savings === 0
        ? {
            status: "required",
            message: `You need to pay 10% downpayment (₹${Math.round(
              requiredDownPayment
            ).toLocaleString()}) of the property value`,
          }
        : { status: "satisfied", message: "Downpayment requirement satisfied" };

    // Affordability categories
    const budgetRanges = [
      {
        range: "₹20L - ₹50L",
        min: 2000000,
        max: 5000000,
        affordable: safePropertyValue >= 2000000,
      },
      {
        range: "₹50L - ₹1Cr",
        min: 5000000,
        max: 10000000,
        affordable: safePropertyValue >= 5000000,
      },
      {
        range: "₹1Cr - ₹2Cr",
        min: 10000000,
        max: 20000000,
        affordable: safePropertyValue >= 10000000,
      },
      {
        range: "₹2Cr - ₹5Cr",
        min: 20000000,
        max: 50000000,
        affordable: safePropertyValue >= 20000000,
      },
      {
        range: "₹5Cr+",
        min: 50000000,
        max: Infinity,
        affordable: safePropertyValue >= 50000000,
      },
    ];

    // Income breakdown
    const incomeBreakdown = [
      { name: "EMI (Safe)", value: Math.round(safeEMI), color: "#3b82f6" },
      {
        name: "Living Expenses",
        value: Math.round(expenses),
        color: "#ef4444",
      },
      {
        name: "Existing EMIs",
        value: Math.round(existingEMI),
        color: "#f59e0b",
      },
      {
        name: "Savings/Others",
        value: Math.round(income - expenses - existingEMI - safeEMI),
        color: "#10b981",
      },
    ];

    // Property recommendations
    const recommendations = [
      {
        type: "2 BHK Apartment",
        priceRange: "₹40L - ₹80L",
        suitable: safePropertyValue >= 4000000,
        description: "Perfect for small families or first-time buyers",
      },
      {
        type: "3 BHK Apartment",
        priceRange: "₹60L - ₹1.2Cr",
        suitable: safePropertyValue >= 6000000,
        description: "Ideal for growing families with good space",
      },
      {
        type: "Independent House",
        priceRange: "₹80L - ₹2Cr",
        suitable: safePropertyValue >= 8000000,
        description: "More privacy and space for larger families",
      },
      {
        type: "Villa/Premium",
        priceRange: "₹1.5Cr+",
        suitable: safePropertyValue >= 15000000,
        description: "Luxury living with premium amenities",
      },
    ];

    const calculatedResults = {
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
      debtToIncomeRatio: ((existingEMI + safeEMI) / income) * 100,
      downPaymentStatus,
      requiredDownPayment: Math.round(requiredDownPayment),
    };

    console.log("Setting results:", calculatedResults);
    setResults(calculatedResults);
  }, [
    monthlyIncome,
    monthlyExpenses,
    existingEMIs,
    downPaymentSavings,
    interestRate,
    loanTenure,
  ]);

  useEffect(() => {
    console.log("Running calculateAffordability...");
    console.log("Current results state:", results);
    calculateAffordability();
  }, [calculateAffordability, results]);

  // Run calculation on mount to ensure initial results
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateAffordability();
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Premium Tool
              </h2>
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
    <ToolUsagePrompt toolName="Home Affordability Calculator">
      <div className="min-h-screen flex flex-col">
      <Head>
        <title>Home Affordability Calculator | Mortgage Calculator | Property Budget Tool | Urbanhousein</title>
        <meta 
          name="description" 
          content="Calculate your home affordability with our advanced mortgage calculator. Get personalized budget recommendations, EMI calculations, and property investment insights for smart home buying decisions." 
        />
        <meta 
          name="keywords" 
          content="home affordability calculator, mortgage calculator, property budget calculator, EMI calculator, home loan calculator, property investment calculator, real estate calculator, home buying calculator, budget planning tool, property affordability, loan eligibility calculator, down payment calculator, home purchase calculator, real estate investment tool, property finance calculator, home loan EMI, mortgage planning, property budget planning, home buying guide, real estate investment planning" 
        />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://urbanhousein.com/tools/home-affordability" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Home Affordability Calculator | Mortgage Calculator | Property Budget Tool | Urbanhousein" />
        <meta property="og:description" content="Calculate your home affordability with our advanced mortgage calculator. Get personalized budget recommendations, EMI calculations, and property investment insights for smart home buying decisions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://urbanhousein.com/tools/home-affordability" />
        <meta property="og:image" content="https://urbanhousein.com/images/og-home-affordability.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Urbanhousein" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Home Affordability Calculator | Mortgage Calculator | Property Budget Tool | Urbanhousein" />
        <meta name="twitter:description" content="Calculate your home affordability with our advanced mortgage calculator. Get personalized budget recommendations, EMI calculations, and property investment insights for smart home buying decisions." />
        <meta name="twitter:image" content="https://urbanhousein.com/images/og-home-affordability.jpg" />
        <meta name="twitter:site" content="@urbanhousein" />
        <meta name="twitter:creator" content="@urbanhousein" />
        
        {/* Additional Meta Tags */}
        <meta name="author" content="Urbanhousein Team" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Home Affordability Calculator",
              "description": "Calculate your home affordability with our advanced mortgage calculator. Get personalized budget recommendations, EMI calculations, and property investment insights for smart home buying decisions.",
              "url": "https://urbanhousein.com/tools/home-affordability",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR"
              },
              "provider": {
                "@type": "Organization",
                "name": "Urbanhousein",
                "url": "https://urbanhousein.com",
                "logo": "https://urbanhousein.com/logo/urbanhousein-logo.png"
              },
              "featureList": [
                "Advanced EMI calculations",
                "Personalized budget recommendations",
                "Down payment analysis",
                "Debt-to-income ratio assessment",
                "Property budget ranges",
                "Financial health scoring",
                "Income allocation breakdown",
                "Property type recommendations",
                "Interest rate optimization",
                "Loan tenure planning",
                "Affordability score calculation",
                "Smart financial tips"
              ],
              "screenshot": "https://urbanhousein.com/images/home-affordability-screenshot.jpg",
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "softwareVersion": "1.0",
              "datePublished": "2024-01-01",
              "dateModified": new Date().toISOString().split('T')[0]
            })
          }}
        />
      </Head>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-20 lg:py-24">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-pink-100/20 to-purple-100/20" />
          <div className="absolute top-0 left-0 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionWrapper variant="fadeInUp" className="text-center">
              <div className="flex items-center justify-center mb-6">
                <HoverScale scale={1.1}>
                  <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200/50 shadow-lg">
                    <Crown className="w-6 h-6 text-orange-500" />
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 font-medium"
                    >
                      Premium Tool
                    </Badge>
                  </div>
                </HoverScale>
              </div>

              <MotionWrapper variant="fadeInUp" delay={0.2}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-pink-800 bg-clip-text text-transparent mb-6 leading-tight">
                  Home Affordability
                  <br />
                  <span className="text-4xl md:text-5xl lg:text-6xl">
                    Calculator
                  </span>
                </h1>
              </MotionWrapper>

              <MotionWrapper variant="fadeInUp" delay={0.4}>
                <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
                  Discover your perfect home budget with AI-powered insights.
                  <br className="hidden md:block" />
                  Calculate affordability, plan your future, and make confident
                  decisions.
                </p>
              </MotionWrapper>

              <MotionWrapper variant="fadeInUp" delay={0.6}>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Instant Results</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Detailed Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Smart Recommendations</span>
                  </div>
                </div>
              </MotionWrapper>
            </MotionWrapper>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-20 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Panel */}
              <StaggerItem className="lg:col-span-1">
                <MotionWrapper variant="fadeInLeft">
                  <div className="sticky top-8">
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-orange-100/50 hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-500">
                      <CardHeader className="pb-6">
                        <CardTitle className="flex items-center space-x-3 text-xl text-gray-800">
                          <div className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg text-white">
                            <Calculator className="w-5 h-5" />
                          </div>
                          <span className="font-semibold">
                            Financial Details
                          </span>
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-2">
                          Enter your financial information to get personalized
                          results
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        {/* Monthly Income */}
                        <div className="group">
                          <Label className="flex items-center space-x-2 text-gray-700 font-medium mb-4">
                            <div className="p-1.5 bg-green-100 rounded-md group-hover:bg-green-200 transition-colors">
                              <IndianRupee className="w-4 h-4 text-green-600" />
                            </div>
                            <span>Monthly Income</span>
                          </Label>
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 group-hover:from-green-50 group-hover:to-green-100 transition-all duration-300">
                            <Slider
                              value={monthlyIncome}
                              onValueChange={setMonthlyIncome}
                              max={1000000}
                              min={25000}
                              step={5000}
                              className="mb-3"
                            />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">₹25K</span>
                              <span className="font-semibold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                ₹{monthlyIncome[0].toLocaleString()}
                              </span>
                              <span className="text-gray-500">₹10L</span>
                            </div>
                          </div>
                        </div>

                        {/* Monthly Expenses */}
                        <div className="group">
                          <Label className="flex items-center space-x-2 text-gray-700 font-medium mb-4">
                            <div className="p-1.5 bg-red-100 rounded-md group-hover:bg-red-200 transition-colors">
                              <Home className="w-4 h-4 text-red-600" />
                            </div>
                            <span>Monthly Living Expenses</span>
                          </Label>
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 group-hover:from-red-50 group-hover:to-red-100 transition-all duration-300">
                            <Slider
                              value={monthlyExpenses}
                              onValueChange={setMonthlyExpenses}
                              max={monthlyIncome[0]}
                              min={monthlyIncome[0] * 0.2}
                              step={2000}
                              className="mb-3"
                            />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">
                                ₹
                                {Math.round(
                                  monthlyIncome[0] * 0.2
                                ).toLocaleString()}
                              </span>
                              <span className="font-semibold text-lg bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                                ₹{monthlyExpenses[0].toLocaleString()}
                              </span>
                              <span className="text-gray-500">
                                ₹{monthlyIncome[0].toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Existing EMIs */}
                        <div className="group">
                          <Label className="flex items-center space-x-2 text-gray-700 font-medium mb-4">
                            <div className="p-1.5 bg-orange-100 rounded-md group-hover:bg-orange-200 transition-colors">
                              <Calculator className="w-4 h-4 text-orange-600" />
                            </div>
                            <span>Existing EMIs</span>
                          </Label>
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 group-hover:from-orange-50 group-hover:to-orange-100 transition-all duration-300">
                            <Slider
                              value={existingEMIs}
                              onValueChange={setExistingEMIs}
                              max={monthlyIncome[0] - monthlyExpenses[0]}
                              min={0}
                              step={1000}
                              className="mb-3"
                            />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">₹0</span>
                              <span className="font-semibold text-lg bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                                ₹{existingEMIs[0].toLocaleString()}
                              </span>
                              <span className="text-gray-500">
                                ₹
                                {Math.round(
                                  monthlyIncome[0] - monthlyExpenses[0]
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Down Payment Savings */}
                        <div className="group">
                          <Label className="flex items-center space-x-2 text-gray-700 font-medium mb-4">
                            <div className="p-1.5 bg-blue-100 rounded-md group-hover:bg-blue-200 transition-colors">
                              <IndianRupee className="w-4 h-4 text-blue-600" />
                            </div>
                            <span>Available Down Payment</span>
                          </Label>
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
                            <Slider
                              value={downPaymentSavings}
                              onValueChange={setDownPaymentSavings}
                              max={10000000}
                              min={0}
                              step={50000}
                              className="mb-3"
                            />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">₹0</span>
                              <span className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                {formatPrice(downPaymentSavings[0])}
                              </span>
                              <span className="text-gray-500">₹1Cr</span>
                            </div>
                          </div>
                        </div>

                        {/* Interest Rate */}
                        <div className="group">
                          <Label className="flex items-center space-x-2 text-gray-700 font-medium mb-4">
                            <div className="p-1.5 bg-purple-100 rounded-md group-hover:bg-purple-200 transition-colors">
                              <Percent className="w-4 h-4 text-purple-600" />
                            </div>
                            <span>Interest Rate (%)</span>
                          </Label>
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 group-hover:from-purple-50 group-hover:to-purple-100 transition-all duration-300">
                            <Slider
                              value={interestRate}
                              onValueChange={setInterestRate}
                              max={15}
                              min={6}
                              step={0.25}
                              className="mb-3"
                            />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">6%</span>
                              <span className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                                {interestRate[0]}%
                              </span>
                              <span className="text-gray-500">15%</span>
                            </div>
                          </div>
                        </div>

                        {/* Loan Tenure */}
                        <div className="group">
                          <Label className="flex items-center space-x-2 text-gray-700 font-medium mb-4">
                            <div className="p-1.5 bg-indigo-100 rounded-md group-hover:bg-indigo-200 transition-colors">
                              <Calendar className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span>Loan Tenure (Years)</span>
                          </Label>
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 group-hover:from-indigo-50 group-hover:to-indigo-100 transition-all duration-300">
                            <Slider
                              value={loanTenure}
                              onValueChange={setLoanTenure}
                              max={30}
                              min={5}
                              step={1}
                              className="mb-3"
                            />
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">5 years</span>
                              <span className="font-semibold text-lg bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                {loanTenure[0]} years
                              </span>
                              <span className="text-gray-500">30 years</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </MotionWrapper>
              </StaggerItem>

              {/* Results Panel */}
              <StaggerItem className="lg:col-span-2">
                <MotionWrapper variant="fadeInRight">
                  {results ? (
                    <div className="space-y-8">
                      {/* Affordability Summary */}
                      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StaggerItem>
                          <HoverScale>
                            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/30 rounded-full blur-2xl" />
                              <CardContent className="p-6 text-center relative z-10">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                                  <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                                  {formatPrice(results.safePropertyValue)}
                                </div>
                                <div className="text-sm font-medium text-green-700">
                                  Safe Budget
                                </div>
                                <div className="text-xs text-green-600 mt-1">
                                  Recommended for you
                                </div>
                              </CardContent>
                            </Card>
                          </HoverScale>
                        </StaggerItem>

                        <StaggerItem>
                          <HoverScale>
                            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200/30 rounded-full blur-2xl" />
                              <CardContent className="p-6 text-center relative z-10">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                                  {formatPrice(results.maxPropertyValue)}
                                </div>
                                <div className="text-sm font-medium text-orange-700">
                                  Maximum Budget
                                </div>
                                <div className="text-xs text-orange-600 mt-1">
                                  Stretch goal
                                </div>
                              </CardContent>
                            </Card>
                          </HoverScale>
                        </StaggerItem>

                        <StaggerItem>
                          <HoverScale>
                            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full blur-2xl" />
                              <CardContent className="p-6 text-center relative z-10">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                                  <IndianRupee className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                                  ₹{results.safeEMI.toLocaleString()}
                                </div>
                                <div className="text-sm font-medium text-blue-700">
                                  Recommended EMI
                                </div>
                                <div className="text-xs text-blue-600 mt-1">
                                  Monthly payment
                                </div>
                              </CardContent>
                            </Card>
                          </HoverScale>
                        </StaggerItem>
                      </StaggerContainer>

                      {/* Downpayment Status */}
                      <MotionWrapper variant="fadeInUp" delay={0.3}>
                        <HoverScale>
                          <Card
                            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative ${
                              results.downPaymentStatus.status === "satisfied"
                                ? "bg-gradient-to-br from-green-50 to-emerald-50"
                                : "bg-gradient-to-br from-orange-50 to-amber-50"
                            }`}
                          >
                            <div
                              className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${
                                results.downPaymentStatus.status === "satisfied"
                                  ? "bg-green-200/30"
                                  : "bg-orange-200/30"
                              }`}
                            />
                            <CardContent className="p-8 relative z-10">
                              <div className="flex items-start space-x-4">
                                <div
                                  className={`p-3 rounded-xl ${
                                    results.downPaymentStatus.status ===
                                    "satisfied"
                                      ? "bg-green-100"
                                      : "bg-orange-100"
                                  }`}
                                >
                                  {results.downPaymentStatus.status ===
                                  "satisfied" ? (
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Downpayment Status
                                  </h3>
                                  <p
                                    className={`text-base leading-relaxed ${
                                      results.downPaymentStatus.status ===
                                      "satisfied"
                                        ? "text-green-800"
                                        : "text-orange-800"
                                    }`}
                                  >
                                    {results.downPaymentStatus.message}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </HoverScale>
                      </MotionWrapper>

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
                                <span className="text-sm font-medium text-gray-700">
                                  Affordability Score
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                  {Math.round(results.affordabilityScore)}/100
                                </span>
                              </div>
                              <Progress
                                value={results.affordabilityScore}
                                className="h-3"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                  Debt-to-Income Ratio
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                  {Math.round(results.debtToIncomeRatio)}%
                                </span>
                              </div>
                              <Progress
                                value={results.debtToIncomeRatio}
                                className="h-3"
                              />
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
                                  {results.incomeBreakdown.map(
                                    (entry: any, index: number) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                      />
                                    )
                                  )}
                                </Pie>
                                <Tooltip
                                  formatter={(value: any) =>
                                    `₹${value.toLocaleString()}`
                                  }
                                />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                              {results.incomeBreakdown.map(
                                (item: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="flex items-center">
                                      <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: item.color }}
                                      />
                                      <span className="text-sm text-gray-600">
                                        {item.name}
                                      </span>
                                    </div>
                                    <span className="text-sm font-medium">
                                      ₹{item.value.toLocaleString()}
                                    </span>
                                  </div>
                                )
                              )}
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
                              {results.budgetRanges.map(
                                (range: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <span className="font-medium text-gray-900">
                                      {range.range}
                                    </span>
                                    {range.affordable ? (
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                      <AlertTriangle className="w-5 h-5 text-red-500" />
                                    )}
                                  </div>
                                )
                              )}
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
                            {results.recommendations.map(
                              (rec: any, index: number) => (
                                <div
                                  key={index}
                                  className={`p-4 rounded-lg border ${
                                    rec.suitable
                                      ? "border-green-200 bg-green-50"
                                      : "border-red-200 bg-red-50"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">
                                      {rec.type}
                                    </h4>
                                    {rec.suitable ? (
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                      <AlertTriangle className="w-5 h-5 text-red-500" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {rec.priceRange}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {rec.description}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Financial Tips */}
                      <MotionWrapper variant="fadeInUp" delay={0.6}>
                        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-0 shadow-xl overflow-hidden relative">
                          <div className="absolute top-0 left-0 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl" />
                          <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl" />
                          <CardContent className="p-8 relative z-10">
                            <div className="text-center mb-8">
                              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
                                <TrendingUp className="w-8 h-8 text-white" />
                              </div>
                              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-2">
                                Smart Financial Tips
                              </h3>
                              <p className="text-gray-600">
                                Expert recommendations to improve your home
                                buying journey
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <div className="flex items-center space-x-3 mb-4">
                                  <div className="p-2 bg-green-100 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                  </div>
                                  <h4 className="font-semibold text-gray-900 text-lg">
                                    Improve Affordability
                                  </h4>
                                </div>
                                <div className="space-y-3">
                                  {[
                                    "Increase your down payment savings",
                                    "Pay off existing debts to reduce EMI burden",
                                    "Consider a longer tenure for lower EMI",
                                    "Look for properties in emerging areas",
                                  ].map((tip, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start space-x-3"
                                    >
                                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                      <span className="text-gray-700 leading-relaxed">
                                        {tip}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center space-x-3 mb-4">
                                  <div className="p-2 bg-orange-100 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                                  </div>
                                  <h4 className="font-semibold text-gray-900 text-lg">
                                    Important Considerations
                                  </h4>
                                </div>
                                <div className="space-y-3">
                                  {[
                                    "Keep EMI below 40% of income",
                                    "Factor in registration and other costs",
                                    "Maintain emergency fund (6 months expenses)",
                                    "Consider future income growth",
                                  ].map((tip, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start space-x-3"
                                    >
                                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                      <span className="text-gray-700 leading-relaxed">
                                        {tip}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </MotionWrapper>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">
                          Calculating your affordability...
                        </p>
                      </div>
                    </div>
                  )}
                </MotionWrapper>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>
      </main>

      <Footer />

      {/* Signup Modal - Shows when user tries to use tool without login */}
      {showSignupModal && (
        <SmartSignupPrompt
          trigger="tool-usage"
          context={{ toolName: "Home Affordability Calculator" }}
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
