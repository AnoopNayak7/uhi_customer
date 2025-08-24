"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  BarChart3,
  TrendingUp,
  Home,
  Target,
  Crown,
  Lock,
  Star,
  ArrowRight,
  CheckCircle,
  MapPin,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";

export default function PremiumToolsPage() {
  const { user } = useAuthStore();

  const freeTools = [
    {
      id: "price-trends",
      title: "Price Trends",
      description:
        "Track property prices and market analysis across different cities and areas",
      icon: TrendingUp,
      href: "/tools/price-trends",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      features: [
        "Historical price data",
        "Market trend analysis",
        "City-wise comparison",
        "Basic charts and graphs",
      ],
    },
    {
      id: "property-value",
      title: "Property Value Estimator",
      description:
        "Get estimated property worth based on location, size, and market data",
      icon: Calculator,
      href: "/tools/property-value",
      color: "text-green-500",
      bgColor: "bg-green-50",
      features: [
        "Quick value estimation",
        "Location-based pricing",
        "Size and type factors",
        "Market comparison",
      ],
    },
    {
      id: "area-insights",
      title: "Area Insights",
      description:
        "Explore neighborhood statistics, amenities, and connectivity information",
      icon: MapPin,
      href: "/tools/area-insights",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      features: [
        "Neighborhood statistics",
        "Amenity mapping",
        "Transport connectivity",
        "Safety ratings",
      ],
    },
    {
      id: "investment-guide",
      title: "Investment Guide",
      description: "Smart investment recommendations and basic market insights",
      icon: BookOpen,
      href: "/tools/investment-guide",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      features: [
        "Investment basics",
        "Market recommendations",
        "Risk assessment guide",
        "Property type analysis",
      ],
    },
  ];

  const premiumTools = [
    {
      id: "mortgage-calculator",
      title: "Advanced Mortgage Calculator",
      description:
        "Calculate EMI, interest rates, and loan eligibility with detailed breakdowns",
      icon: Calculator,
      href: "/tools/mortgage-calculator",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      features: [
        "Detailed EMI breakdown",
        "Interest rate comparisons",
        "Loan eligibility assessment",
        "Amortization schedule",
        "Tax benefit calculations",
      ],
    },
    {
      id: "property-comparison",
      title: "Property Comparison Tool",
      description:
        "Compare multiple properties side-by-side with detailed analysis",
      icon: BarChart3,
      href: "/tools/property-comparison",
      color: "text-green-500",
      bgColor: "bg-green-50",
      features: [
        "Side-by-side comparison",
        "Price per sq ft analysis",
        "Amenities comparison",
        "Location scoring",
        "Investment potential rating",
      ],
    },
    {
      id: "investment-calculator",
      title: "ROI Investment Calculator",
      description:
        "Calculate returns, rental yields, and investment projections",
      icon: TrendingUp,
      href: "/tools/investment-calculator",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      features: [
        "ROI calculations",
        "Rental yield analysis",
        "Capital appreciation forecast",
        "Tax implications",
        "Investment timeline planning",
      ],
    },
    {
      id: "home-affordability",
      title: "Home Affordability Calculator",
      description:
        "Determine how much house you can afford based on your income",
      icon: Home,
      href: "/tools/home-affordability",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      features: [
        "Income-based affordability",
        "Down payment planning",
        "Monthly budget analysis",
        "Debt-to-income ratio",
        "Affordability recommendations",
      ],
    },
    {
      id: "market-predictor",
      title: "Market Trend Predictor",
      description: "AI-powered predictions for property price movements",
      icon: Target,
      href: "/tools/market-predictor",
      color: "text-red-500",
      bgColor: "bg-red-50",
      features: [
        "AI-powered predictions",
        "Market trend analysis",
        "Price movement forecasts",
        "Area-wise insights",
        "Investment timing recommendations",
      ],
    },
  ];

  const benefits = [
    {
      icon: Star,
      title: "Advanced Analytics",
      description:
        "Get detailed insights and comprehensive analysis for better decision making",
    },
    {
      icon: Target,
      title: "Accurate Predictions",
      description:
        "AI-powered tools provide precise calculations and market forecasts",
    },
    {
      icon: CheckCircle,
      title: "Professional Grade",
      description:
        "Tools used by real estate professionals and investment experts",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-blue-50"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="text-center max-w-4xl mx-auto">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-full px-4 py-2 mb-8">
                <Crown className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  Premium Tools
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Professional Real Estate
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Analytics Suite
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
                Unlock advanced calculators, AI-powered market insights, and
                professional-grade tools to make data-driven property investment
                decisions
              </p>

              {/* CTA Buttons */}
              {!user && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    asChild
                  >
                    <Link href="/auth/login">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-gray-300 px-8 py-4 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                    asChild
                  >
                    <Link href="/pricing">View Pricing</Link>
                  </Button>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-4">
                  Trusted by 10,000+ property professionals
                </p>
                <div className="flex items-center justify-center gap-8 opacity-60">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">99% Accuracy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">AI-Powered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why professionals choose us
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Join thousands of real estate professionals who rely on our
                advanced analytics to make smarter investment decisions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {benefits.map((benefit, index) => (
                <div key={benefit.title} className="group">
                  <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 h-full">
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <benefit.icon className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            {/* <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  10K+
                </div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  ₹500Cr+
                </div>
                <div className="text-gray-600">Properties Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  99.2%
                </div>
                <div className="text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  24/7
                </div>
                <div className="text-gray-600">Support</div>
              </div>
            </div> */}
          </div>
        </section>

        {/* Free Tools Section */}
        <section className="py-20 bg-gradient-to-br from-green-50/50 via-white to-blue-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200/50 rounded-full px-4 py-2 mb-6">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Free Tools
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Start with our free tools
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Get started with our comprehensive free tools - no login
                required. Perfect for exploring basic property insights and
                market trends
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {freeTools.map((tool) => (
                <div
                  key={tool.id}
                  className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Icon */}
                    <div className="mb-4">
                      <div
                        className={`w-12 h-12 ${tool.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <tool.icon className={`w-6 h-6 ${tool.color}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {tool.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <ul className="space-y-2">
                        {tool.features.slice(0, 3).map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-xs text-gray-600"
                          >
                            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Button
                      variant="outline"
                      className="w-full border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200"
                      asChild
                    >
                      <Link href={tool.href}>
                        Try Free Tool
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Upgrade CTA */}
            {/* <div className="text-center">
              <div className="inline-flex flex-col items-center bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Crown className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Need more advanced features?
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Upgrade to premium tools for detailed analytics, AI-powered
                  insights, and professional-grade calculations
                </p>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => {
                    document.getElementById("premium-tools")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  View Premium Tools
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div> */}
          </div>
        </section>

        {/* Premium Tools Grid */}
        <section id="premium-tools" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Premium Tools Collection
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive suite of advanced tools designed for property
                analysis, investment planning, and market research
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {premiumTools.map((tool, index) => (
                <div
                  key={tool.id}
                  className="group relative bg-white rounded-3xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div
                            className={`w-16 h-16 ${tool.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                          >
                            <tool.icon className={`w-8 h-8 ${tool.color}`} />
                          </div>
                          {/* Premium Badge */}
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full p-1">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {tool.title}
                          </h3>
                          <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/50 rounded-full px-3 py-1">
                            <span className="text-xs font-medium text-amber-800">
                              Premium
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {tool.description}
                    </p>

                    {/* Features */}
                    <div className="mb-8">
                      <h4 className="font-bold text-gray-900 mb-4 text-lg">
                        Key Features
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {tool.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl group-hover:bg-white transition-colors duration-300"
                          >
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-gray-700 font-medium">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    {user ? (
                      <Button
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        asChild
                      >
                        <Link href={tool.href}>
                          Access Tool
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full border-2 border-gray-200 hover:border-gray-300 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                        asChild
                      >
                        <Link href="/auth/login">
                          <Lock className="w-5 h-5 mr-2" />
                          Login to Access
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">
                  Trusted by 10,000+ professionals
                </span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Ready to unlock
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  premium insights?
                </span>
              </h2>

              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Join thousands of property investors and professionals who rely
                on our advanced analytics to make smarter decisions
              </p>
            </div>

            {user ? (
              <div className="space-y-6">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  asChild
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    asChild
                  >
                    <Link href="/auth/signup">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold transition-all duration-200"
                    asChild
                  >
                    <Link href="/pricing">View Pricing Plans</Link>
                  </Button>
                </div>

                {/* Additional Trust Elements */}
                <div className="pt-8 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-4">
                    No credit card required • Cancel anytime
                  </p>
                  <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>14-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Full feature access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>24/7 support</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
