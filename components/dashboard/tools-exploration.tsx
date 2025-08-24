"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Calculator,
  Target,
  BookOpen,
  Crown,
  Zap,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function ToolsExplorationSection() {
  const freeTools = [
    {
      id: "price-trends",
      title: "Price Trends",
      description: "Track property prices and market analysis",
      icon: TrendingUp,
      href: "/tools/price-trends",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      badge: "Free",
    },
    {
      id: "property-value",
      title: "Property Value",
      description: "Calculate estimated property worth",
      icon: Calculator,
      href: "/tools/property-value",
      color: "text-green-500",
      bgColor: "bg-green-50",
      badge: "Free",
    },
    {
      id: "area-insights",
      title: "Area Insights",
      description: "Explore neighborhood statistics",
      icon: Target,
      href: "/tools/area-insights",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      badge: "Free",
    },
    {
      id: "investment-guide",
      title: "Investment Guide",
      description: "Smart investment recommendations",
      icon: BookOpen,
      href: "/tools/investment-guide",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      badge: "Free",
    },
  ];

  const premiumTools = [
    {
      id: "mortgage-calculator",
      title: "Mortgage Calculator",
      description: "Advanced EMI and loan calculations",
      icon: Calculator,
      href: "/tools/mortgage-calculator",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      badge: "Premium",
    },
    {
      id: "market-predictor",
      title: "Market Predictor",
      description: "AI-powered market predictions",
      icon: Zap,
      href: "/tools/market-predictor",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      badge: "Premium",
    },
  ];

  return (
    <div className="mb-12">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Explore Our Tools
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Powerful tools to help you make informed property decisions
              </CardDescription>
            </div>
            <Button variant="outline" className="hidden sm:flex" asChild>
              <Link href="/tools/premium">
                View All Tools
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Free Tools */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Free Tools
              </h3>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                No login required
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {freeTools.map((tool) => (
                <Link key={tool.id} href={tool.href}>
                  <div className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 ${tool.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <tool.icon className={`w-5 h-5 ${tool.color}`} />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200"
                      >
                        {tool.badge}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Premium Tools Preview */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Premium Tools
              </h3>
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-800"
              >
                Advanced features
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {premiumTools.map((tool) => (
                <Link key={tool.id} href={tool.href}>
                  <div className="group bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <Crown className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 ${tool.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <tool.icon className={`w-5 h-5 ${tool.color}`} />
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                      >
                        {tool.badge}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                      {tool.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-3">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                asChild
              >
                <Link href="/tools/premium">
                  <Crown className="w-4 h-4 mr-2" />
                  Explore All Premium Tools
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-200 hover:border-gray-300"
                asChild
              >
                <Link href="/pricing">View Pricing Plans</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
