"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { MotionWrapper } from "@/components/animations/motion-wrapper";
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
  Star,
  Settings,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const cities = [
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];

const investmentGoals = [
  { value: "rental_income", label: "Rental Income", icon: DollarSign },
  {
    value: "capital_appreciation",
    label: "Capital Appreciation",
    icon: TrendingUp,
  },
  { value: "balanced", label: "Balanced Growth", icon: BarChart3 },
  { value: "retirement", label: "Retirement Planning", icon: Clock },
];

const riskProfiles = [
  {
    value: "conservative",
    label: "Conservative",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    value: "moderate",
    label: "Moderate",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    value: "aggressive",
    label: "Aggressive",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
];

const propertyTypes = [
  { value: "residential", label: "Residential", icon: Home },
  { value: "commercial", label: "Commercial", icon: Briefcase },
  { value: "plots", label: "Plots/Land", icon: TreePine },
  { value: "mixed", label: "Mixed Portfolio", icon: Building },
];

export default function InvestmentGuidePage() {
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [investmentGoal, setInvestmentGoal] = useState("");
  const [riskProfile, setRiskProfile] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState([5000000]); // 50L default
  const [timeHorizon, setTimeHorizon] = useState([5]); // 5 years default
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasAnimated = useRef(false);

  const generateRecommendations = async () => {
    if (!investmentGoal || !riskProfile || !propertyType) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockRecommendations = generateMockRecommendations();
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRecommendations = () => {
    const budgetValue = budget[0];
    const timeValue = timeHorizon[0];

    const areas = getRecommendedAreas(selectedCity, riskProfile, propertyType);
    const portfolio = generatePortfolioAllocation(propertyType, riskProfile);
    const projections = generateProjections(
      budgetValue,
      timeValue,
      riskProfile
    );
    const strategies = getInvestmentStrategies(
      investmentGoal,
      riskProfile,
      timeValue
    );

    return {
      overview: {
        totalBudget: budgetValue,
        timeHorizon: timeValue,
        expectedReturns: projections.expectedReturns,
        riskLevel: riskProfile,
        recommendedAreas: areas.length,
        portfolioScore: Math.round(75 + Math.random() * 20),
      },
      recommendedAreas: areas,
      portfolioAllocation: portfolio,
      projections: projections,
      strategies: strategies,
      marketInsights: generateMarketInsights(selectedCity, propertyType),
      riskAnalysis: generateRiskAnalysis(riskProfile, propertyType),
      actionPlan: generateActionPlan(investmentGoal, budgetValue, timeValue),
    };
  };

  const getRecommendedAreas = (city: string, risk: string, type: string) => {
    const cityAreas = {
      Bangalore: [
        {
          name: "Electronic City",
          growth: 15,
          rental: 8,
          risk: "low",
          price: 5800,
          type: "residential",
        },
        {
          name: "Whitefield",
          growth: 12,
          rental: 7,
          risk: "low",
          price: 7800,
          type: "residential",
        },
        {
          name: "Sarjapur Road",
          growth: 18,
          rental: 6,
          risk: "medium",
          price: 7200,
          type: "residential",
        },
        {
          name: "Outer Ring Road",
          growth: 20,
          rental: 5,
          risk: "high",
          price: 8500,
          type: "commercial",
        },
        {
          name: "Hebbal",
          growth: 10,
          rental: 9,
          risk: "low",
          price: 6500,
          type: "residential",
        },
      ],
      Mumbai: [
        {
          name: "Thane",
          growth: 12,
          rental: 7,
          risk: "low",
          price: 14400,
          type: "residential",
        },
        {
          name: "Navi Mumbai",
          growth: 15,
          rental: 6,
          risk: "medium",
          price: 16200,
          type: "residential",
        },
        {
          name: "Andheri",
          growth: 8,
          rental: 8,
          risk: "low",
          price: 23400,
          type: "commercial",
        },
        {
          name: "Powai",
          growth: 10,
          rental: 7,
          risk: "medium",
          price: 25200,
          type: "residential",
        },
      ],
    };

    const areas =
      cityAreas[city as keyof typeof cityAreas] || cityAreas["Bangalore"];

    return areas
      .filter((area) => {
        if (type === "residential") return area.type === "residential";
        if (type === "commercial") return area.type === "commercial";
        return true;
      })
      .map((area) => ({
        ...area,
        score: calculateAreaScore(area, risk, investmentGoal),
        recommendation: getAreaRecommendation(area, risk),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  const calculateAreaScore = (area: any, risk: string, goal: string) => {
    let score = 0;

    score += area.growth * 2;
    score += area.rental * 1.5;

    if (risk === "conservative" && area.risk === "low") score += 20;
    if (risk === "moderate" && area.risk === "medium") score += 15;
    if (risk === "aggressive" && area.risk === "high") score += 25;

    if (goal === "rental_income") score += area.rental * 3;
    if (goal === "capital_appreciation") score += area.growth * 3;

    return Math.min(100, score);
  };

  const getAreaRecommendation = (area: any, risk: string) => {
    if (area.growth > 15) return "High Growth Potential";
    if (area.rental > 7) return "Excellent Rental Yield";
    if (area.risk === "low") return "Safe Investment";
    return "Balanced Option";
  };

  const generatePortfolioAllocation = (type: string, risk: string) => {
    if (type === "residential") {
      return [
        { name: "Apartments", value: 60, color: "#3b82f6" },
        { name: "Villas", value: 25, color: "#10b981" },
        { name: "Plots", value: 15, color: "#f59e0b" },
      ];
    } else if (type === "commercial") {
      return [
        { name: "Office Spaces", value: 50, color: "#3b82f6" },
        { name: "Retail Shops", value: 30, color: "#10b981" },
        { name: "Warehouses", value: 20, color: "#f59e0b" },
      ];
    } else {
      return [
        { name: "Residential", value: 50, color: "#3b82f6" },
        { name: "Commercial", value: 30, color: "#10b981" },
        { name: "Plots", value: 20, color: "#f59e0b" },
      ];
    }
  };

  const generateProjections = (budget: number, years: number, risk: string) => {
    const baseReturn =
      risk === "conservative" ? 8 : risk === "moderate" ? 12 : 16;
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
      finalValue: Math.round(currentValue),
    };
  };

  const getInvestmentStrategies = (
    goal: string,
    risk: string,
    time: number
  ) => {
    const strategies = {
      rental_income: [
        "Focus on high-rental-yield properties in established areas",
        "Consider commercial properties for better rental returns",
        "Look for properties near IT hubs and business districts",
        "Ensure good connectivity and infrastructure",
      ],
      capital_appreciation: [
        "Invest in emerging areas with development potential",
        "Focus on properties near upcoming infrastructure projects",
        "Consider pre-launch and under-construction properties",
        "Monitor government policy changes and urban planning",
      ],
      balanced: [
        "Diversify across residential and commercial properties",
        "Mix of established and emerging locations",
        "Balance between rental yield and growth potential",
        "Regular portfolio review and rebalancing",
      ],
      retirement: [
        "Focus on stable, income-generating properties",
        "Prioritize locations with good healthcare facilities",
        "Consider properties with long-term appreciation potential",
        "Plan for property maintenance and management",
      ],
    };

    return (
      strategies[goal as keyof typeof strategies] || strategies["balanced"]
    );
  };

  const generateMarketInsights = (city: string, type: string) => {
    return [
      `${city} real estate market showing strong fundamentals with IT sector growth`,
      `${type} properties in ${city} expected to appreciate 12-15% annually`,
      "Government infrastructure projects boosting connectivity and property values",
      "Rental demand increasing due to corporate expansion and job creation",
      "New regulations favoring transparent transactions and buyer protection",
    ];
  };

  const generateRiskAnalysis = (risk: string, type: string) => {
    const riskFactors = {
      conservative: {
        level: "Low Risk",
        factors: [
          "Market volatility",
          "Liquidity concerns",
          "Regulatory changes",
        ],
        mitigation: [
          "Diversified portfolio",
          "Established locations",
          "Long-term holding",
        ],
      },
      moderate: {
        level: "Medium Risk",
        factors: ["Market cycles", "Location risks", "Construction delays"],
        mitigation: [
          "Research-based selection",
          "Phased investments",
          "Professional advice",
        ],
      },
      aggressive: {
        level: "High Risk",
        factors: ["Market speculation", "Development risks", "Economic cycles"],
        mitigation: [
          "Expert guidance",
          "Thorough due diligence",
          "Risk diversification",
        ],
      },
    };

    return riskFactors[risk as keyof typeof riskFactors];
  };

  const generateActionPlan = (goal: string, budget: number, time: number) => {
    return [
      {
        phase: "Phase 1 (Months 1-3)",
        tasks: [
          "Market research and area analysis",
          "Finalize investment strategy",
          "Arrange financing options",
        ],
        budget: Math.round(budget * 0.4),
      },
      {
        phase: "Phase 2 (Months 4-8)",
        tasks: [
          "Property selection and due diligence",
          "Legal verification",
          "Purchase execution",
        ],
        budget: Math.round(budget * 0.4),
      },
      {
        phase: "Phase 3 (Months 9-12)",
        tasks: [
          "Portfolio optimization",
          "Rental management setup",
          "Performance monitoring",
        ],
        budget: Math.round(budget * 0.2),
      },
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

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  // Reusable form content component
  const InvestmentProfileForm = () => {
    useEffect(() => {
      hasAnimated.current = true;
    }, []);

    return (
      <div className="space-y-6">
        {/* City Selection */}
        <motion.div
          variants={itemVariants}
          initial={hasAnimated.current ? false : "hidden"}
          animate={hasAnimated.current ? false : "visible"}
        >
          <Label className="text-sm font-semibold text-gray-700">
            Preferred City *
          </Label>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="mt-2 h-12 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {city}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Investment Goal */}
        <motion.div
          variants={itemVariants}
          initial={hasAnimated.current ? false : "hidden"}
          animate={hasAnimated.current ? false : "visible"}
        >
          <Label className="text-sm font-semibold text-gray-700">
            Investment Goal *
          </Label>
          <Select value={investmentGoal} onValueChange={setInvestmentGoal}>
            <SelectTrigger className="mt-2 h-12 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
              <SelectValue placeholder="Select your goal" />
            </SelectTrigger>
            <SelectContent>
              {investmentGoals.map((goal) => (
                <SelectItem key={goal.value} value={goal.value}>
                  <div className="flex items-center">
                    <goal.icon className="w-4 h-4 mr-2 text-gray-500" />
                    {goal.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Risk Profile */}
        <motion.div
          variants={itemVariants}
          initial={hasAnimated.current ? false : "hidden"}
          animate={hasAnimated.current ? false : "visible"}
        >
          <Label className="text-sm font-semibold text-gray-700">
            Risk Profile *
          </Label>
          <div className="grid grid-cols-1 gap-3 mt-3">
            {riskProfiles.map((risk) => (
              <motion.button
                key={risk.value}
                onClick={() => setRiskProfile(risk.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  riskProfile === risk.value
                    ? `${risk.borderColor} ${risk.bgColor} shadow-lg ring-2 ring-orange-100`
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className={`font-semibold ${risk.color} mb-1`}>
                  {risk.label}
                </div>
                <div className="text-sm text-gray-600">
                  {risk.value === "conservative" &&
                    "Low risk, steady returns (8-10% p.a.)"}
                  {risk.value === "moderate" &&
                    "Balanced risk and returns (10-14% p.a.)"}
                  {risk.value === "aggressive" &&
                    "High risk, high returns (14-18% p.a.)"}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Property Type */}
        <motion.div
          variants={itemVariants}
          initial={hasAnimated.current ? false : "hidden"}
          animate={hasAnimated.current ? false : "visible"}
        >
          <Label className="text-sm font-semibold text-gray-700">
            Property Type *
          </Label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="mt-2 h-12 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center">
                    <type.icon className="w-4 h-4 mr-2 text-gray-500" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Budget */}
        <motion.div
          variants={itemVariants}
          initial={hasAnimated.current ? false : "hidden"}
          animate={hasAnimated.current ? false : "visible"}
        >
          <Label className="text-sm font-semibold text-gray-700">
            Investment Budget
          </Label>
          <div className="mt-3 p-4 bg-gray-50 rounded-xl">
            <Slider
              value={budget}
              onValueChange={setBudget}
              max={50000000}
              min={1000000}
              step={500000}
              className="mb-3"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>₹10L</span>
              <span className="font-semibold text-lg text-gray-900">
                {formatPrice(budget[0])}
              </span>
              <span>₹5Cr</span>
            </div>
          </div>
        </motion.div>

        {/* Time Horizon */}
        <motion.div
          variants={itemVariants}
          initial={hasAnimated.current ? false : "hidden"}
          animate={hasAnimated.current ? false : "visible"}
        >
          <Label className="text-sm font-semibold text-gray-700">
            Investment Time Horizon
          </Label>
          <div className="mt-3 p-4 bg-gray-50 rounded-xl">
            <Slider
              value={timeHorizon}
              onValueChange={setTimeHorizon}
              max={20}
              min={1}
              step={1}
              className="mb-3"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>1 year</span>
              <span className="font-semibold text-lg text-gray-900">
                {timeHorizon[0]} years
              </span>
              <span>20 years</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial={hasAnimated.current ? false : "hidden"}
          animate={hasAnimated.current ? false : "visible"}
        >
          <motion.div
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={() => {
                generateRecommendations();
                setSheetOpen(false);
              }}
              disabled={
                !investmentGoal || !riskProfile || !propertyType || loading
              }
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span>Generating Recommendations...</span>
                </motion.div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Get Investment Guide</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-20 lg:py-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-red-100/20"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-orange-600 mb-6 shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Investment Insights</span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Smart Investment
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Guide
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Get personalized real estate investment recommendations based on
                your goals, risk profile, and market insights
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <div className="flex items-center space-x-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Free Analysis</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Expert Insights</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Personalized Strategy</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Investment Form */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile: Bottom Sheet Trigger */}
            <div className="lg:hidden mb-8">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg"
                      size="lg"
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      Set Investment Profile
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="h-[90vh] overflow-y-auto rounded-t-3xl"
                >
                  <SheetHeader className="pb-6">
                    <SheetTitle className="flex items-center space-x-2 text-xl">
                      <Target className="w-6 h-6 text-orange-500" />
                      <span>Investment Profile</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="pb-6">
                    <InvestmentProfileForm />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Desktop: Input Form Sidebar */}
              <div className="hidden lg:block lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="sticky top-8 shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center space-x-3 text-xl">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Target className="w-6 h-6 text-orange-600" />
                        </div>
                        <span>Investment Profile</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <InvestmentProfileForm />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Results */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {recommendations ? (
                    <motion.div
                      className="space-y-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Overview Cards */}
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.div variants={itemVariants}>
                          <motion.div
                            variants={cardHoverVariants}
                            initial="rest"
                            whileHover="hover"
                          >
                            <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-600 mb-2">
                                      Expected Returns
                                    </p>
                                    <p className="text-3xl font-bold text-green-600">
                                      {
                                        recommendations.projections
                                          .expectedReturns
                                      }
                                      % p.a.
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-2xl bg-green-100">
                                    <TrendingUp className="w-8 h-8 text-green-600" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <motion.div
                            variants={cardHoverVariants}
                            initial="rest"
                            whileHover="hover"
                          >
                            <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-600 mb-2">
                                      Portfolio Score
                                    </p>
                                    <p className="text-3xl font-bold text-blue-600">
                                      {recommendations.overview.portfolioScore}
                                      /100
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-2xl bg-blue-100">
                                    <Award className="w-8 h-8 text-blue-600" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <motion.div
                            variants={cardHoverVariants}
                            initial="rest"
                            whileHover="hover"
                          >
                            <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-600 mb-2">
                                      Projected Value
                                    </p>
                                    <p className="text-3xl font-bold text-purple-600">
                                      {formatPrice(
                                        recommendations.projections.finalValue
                                      )}
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-2xl bg-purple-100">
                                    <Calculator className="w-8 h-8 text-purple-600" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </motion.div>
                      </motion.div>

                      {/* Recommended Areas */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                      >
                        <Card className="border-0 shadow-xl rounded-2xl">
                          <CardHeader className="pb-6">
                            <CardTitle className="flex items-center space-x-3 text-xl">
                              <div className="p-2 bg-orange-100 rounded-lg">
                                <MapPin className="w-6 h-6 text-orange-600" />
                              </div>
                              <span>Recommended Areas in {selectedCity}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {recommendations.recommendedAreas.map(
                                (area: any, index: number) => (
                                  <motion.div
                                    key={index}
                                    className="group p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-orange-50 hover:to-red-50 transition-all duration-300 cursor-pointer"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      delay: index * 0.1,
                                      duration: 0.5,
                                    }}
                                  >
                                    {/* Mobile-first vertical layout */}
                                    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                      {/* Header section with rank and area info */}
                                      <div className="flex items-center space-x-3 sm:space-x-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                                          {index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <h4 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-orange-600 transition-colors truncate">
                                            {area.name}
                                          </h4>
                                          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                            {area.recommendation}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Metrics section - responsive grid */}
                                      <div className="flex flex-col space-y-3 sm:space-y-0">
                                        {/* Mobile: 3-column grid, Desktop: horizontal layout */}
                                        <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:space-x-6 sm:gap-0">
                                          <div className="text-center">
                                            <span className="text-xs text-gray-500 block font-medium">
                                              Growth
                                            </span>
                                            <span className="font-bold text-green-600 text-sm sm:text-lg">
                                              {area.growth}%
                                            </span>
                                          </div>
                                          <div className="text-center">
                                            <span className="text-xs text-gray-500 block font-medium">
                                              Rental
                                            </span>
                                            <span className="font-bold text-blue-600 text-sm sm:text-lg">
                                              {area.rental}%
                                            </span>
                                          </div>
                                          <div className="text-center">
                                            <span className="text-xs text-gray-500 block font-medium">
                                              Score
                                            </span>
                                            <span className="font-bold text-orange-600 text-sm sm:text-lg">
                                              {area.score}/100
                                            </span>
                                          </div>
                                        </div>

                                        {/* Price - centered on mobile, right-aligned on desktop */}
                                        <div className="text-center sm:text-right">
                                          <p className="text-sm font-semibold text-gray-700 bg-white/60 rounded-lg px-3 py-1 inline-block">
                                            ₹{area.price.toLocaleString()}/sqft
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Portfolio Allocation & Projections */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                        >
                          <Card className="border-0 shadow-xl rounded-2xl h-full">
                            <CardHeader className="pb-6">
                              <CardTitle className="flex items-center space-x-3 text-xl">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <BarChart3 className="w-6 h-6 text-blue-600" />
                                </div>
                                <span>Portfolio Allocation</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                  <Pie
                                    data={recommendations.portfolioAllocation}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                  >
                                    {recommendations.portfolioAllocation.map(
                                      (entry: any, index: number) => (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={entry.color}
                                        />
                                      )
                                    )}
                                  </Pie>
                                  <Tooltip
                                    formatter={(value: any) => `${value}%`}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                              <div className="mt-6 space-y-3">
                                {recommendations.portfolioAllocation.map(
                                  (item: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                                    >
                                      <div className="flex items-center">
                                        <div
                                          className="w-4 h-4 rounded-full mr-3"
                                          style={{
                                            backgroundColor: item.color,
                                          }}
                                        />
                                        <span className="font-medium text-gray-700">
                                          {item.name}
                                        </span>
                                      </div>
                                      <span className="font-bold text-gray-900">
                                        {item.value}%
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                        >
                          <Card className="border-0 shadow-xl rounded-2xl h-full">
                            <CardHeader className="pb-6">
                              <CardTitle className="flex items-center space-x-3 text-xl">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                                <span>Investment Projections</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ResponsiveContainer width="100%" height={280}>
                                <LineChart
                                  data={
                                    recommendations.projections.projectionData
                                  }
                                >
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                  />
                                  <XAxis dataKey="year" stroke="#666" />
                                  <YAxis stroke="#666" />
                                  <Tooltip
                                    formatter={(value: any, name: string) => [
                                      formatPrice(value),
                                      name === "value"
                                        ? "Property Value"
                                        : "Rental Income",
                                    ]}
                                    contentStyle={{
                                      backgroundColor: "white",
                                      border: "none",
                                      borderRadius: "12px",
                                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                    }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#f97316"
                                    strokeWidth={4}
                                    dot={{
                                      fill: "#f97316",
                                      strokeWidth: 2,
                                      r: 6,
                                    }}
                                    activeDot={{
                                      r: 8,
                                      stroke: "#f97316",
                                      strokeWidth: 2,
                                    }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="rental"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{
                                      fill: "#3b82f6",
                                      strokeWidth: 2,
                                      r: 4,
                                    }}
                                    activeDot={{
                                      r: 6,
                                      stroke: "#3b82f6",
                                      strokeWidth: 2,
                                    }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>

                      {/* Investment Strategies */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                      >
                        <Card className="border-0 shadow-xl rounded-2xl">
                          <CardHeader className="pb-6">
                            <CardTitle className="flex items-center space-x-3 text-xl">
                              <div className="p-2 bg-yellow-100 rounded-lg">
                                <Lightbulb className="w-6 h-6 text-yellow-600" />
                              </div>
                              <span>Investment Strategies</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {recommendations.strategies.map(
                                (strategy: string, index: number) => (
                                  <motion.div
                                    key={index}
                                    className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      delay: index * 0.1,
                                      duration: 0.5,
                                    }}
                                  >
                                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700 font-medium">
                                      {strategy}
                                    </p>
                                  </motion.div>
                                )
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Risk Analysis */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                      >
                        <Card className="border-0 shadow-xl rounded-2xl">
                          <CardHeader className="pb-6">
                            <CardTitle className="flex items-center space-x-3 text-xl">
                              <div className="p-2 bg-red-100 rounded-lg">
                                <Shield className="w-6 h-6 text-red-600" />
                              </div>
                              <span>Risk Analysis</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                <h4 className="font-bold text-gray-900 mb-4 text-lg">
                                  Risk Factors
                                </h4>
                                <div className="space-y-3">
                                  {recommendations.riskAnalysis.factors.map(
                                    (factor: string, index: number) => (
                                      <motion.div
                                        key={index}
                                        className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          delay: index * 0.1,
                                          duration: 0.5,
                                        }}
                                      >
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        <span className="text-gray-700 font-medium">
                                          {factor}
                                        </span>
                                      </motion.div>
                                    )
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 mb-4 text-lg">
                                  Risk Mitigation
                                </h4>
                                <div className="space-y-3">
                                  {recommendations.riskAnalysis.mitigation.map(
                                    (mitigation: string, index: number) => (
                                      <motion.div
                                        key={index}
                                        className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          delay: index * 0.1,
                                          duration: 0.5,
                                        }}
                                      >
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-gray-700 font-medium">
                                          {mitigation}
                                        </span>
                                      </motion.div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Action Plan */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                      >
                        <Card className="border-0 shadow-xl rounded-2xl">
                          <CardHeader className="pb-6">
                            <CardTitle className="flex items-center space-x-3 text-xl">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-purple-600" />
                              </div>
                              <span>Investment Action Plan</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              {recommendations.actionPlan.map(
                                (phase: any, index: number) => (
                                  <motion.div
                                    key={index}
                                    className="relative p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      delay: index * 0.2,
                                      duration: 0.6,
                                    }}
                                  >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-red-500 rounded-l-2xl"></div>
                                    <h4 className="font-bold text-gray-900 mb-3 text-lg">
                                      {phase.phase}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                      {phase.tasks.map(
                                        (task: string, taskIndex: number) => (
                                          <div
                                            key={taskIndex}
                                            className="flex items-center space-x-3"
                                          >
                                            <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                                            <span className="text-gray-700 font-medium">
                                              {task}
                                            </span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                    <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200 font-semibold">
                                      Budget: {formatPrice(phase.budget)}
                                    </Badge>
                                  </motion.div>
                                )
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Market Insights */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      >
                        <Card className="border-0 shadow-xl rounded-2xl">
                          <CardHeader className="pb-6">
                            <CardTitle className="flex items-center space-x-3 text-xl">
                              <div className="p-2 bg-indigo-100 rounded-lg">
                                <Star className="w-6 h-6 text-indigo-600" />
                              </div>
                              <span>Market Insights</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {recommendations.marketInsights.map(
                                (insight: string, index: number) => (
                                  <motion.div
                                    key={index}
                                    className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: index * 0.1,
                                      duration: 0.5,
                                    }}
                                  >
                                    <Star className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700 font-medium">
                                      {insight}
                                    </p>
                                  </motion.div>
                                )
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Card className="border-0 shadow-xl rounded-2xl bg-gradient-to-br from-gray-50 to-white">
                        <CardContent className="flex items-center justify-center py-20">
                          <div className="text-center max-w-md">
                            <motion.div
                              animate={{
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.05, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                              className="mb-6"
                            >
                              <BookOpen className="w-20 h-20 text-gray-300 mx-auto" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                              Ready to Start?
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                              Fill in your investment profile to get
                              personalized recommendations and insights tailored
                              to your goals
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
