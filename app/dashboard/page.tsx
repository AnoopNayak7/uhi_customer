"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import {
  BarChart3,
  Eye,
  Heart,
  Building,
  Users,
  Plus,
  Calculator,
  Target,
  Bookmark,
} from "lucide-react";
import Link from "next/link";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      if (user?.role === "builder") {
        const [analyticsRes, propertiesRes, leadsRes]: any = await Promise.all([
          apiClient.getBuilderAnalytics(),
          apiClient.getMyProperties({ limit: 5 }),
          apiClient.getMyLeads({ limit: 5 }),
        ]);

        setAnalytics(analyticsRes.data);
        setProperties(propertiesRes.data || []);
        setLeads(leadsRes.data || []);
      } else {
        const propertiesRes: any = await apiClient.getProperties({ limit: 5 });
        setProperties(propertiesRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome back, {user.firstName}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {user.role === "builder" ? "Builder" : "User"}
                </Badge>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                  asChild
                >
                  <Link
                    href={
                      user.role === "builder"
                        ? "/dashboard/property/create"
                        : "/properties"
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {user.role === "builder" ? "Add Property" : "Browse"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {user.role === "builder" ? (
            <BuilderDashboard
              analytics={analytics}
              properties={properties}
              leads={leads}
              loading={loading}
            />
          ) : (
            <UserDashboard properties={properties} loading={loading} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function BuilderDashboard({ analytics, properties, leads, loading }: any) {
  const stats = [
    {
      title: "Properties",
      value: analytics?.totalProperties || 0,
      icon: Building,
      color: "text-blue-600",
    },
    {
      title: "Views",
      value: analytics?.totalViews || 0,
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Leads",
      value: analytics?.totalLeads || 0,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Favourites",
      value: analytics?.totalFavourites || 0,
      icon: Heart,
      color: "text-red-600",
    },
  ];

  // Fallback demo data
  const viewsTrend = analytics?.viewsTrend || [
    { date: "Mon", views: 120 },
    { date: "Tue", views: 200 },
    { date: "Wed", views: 150 },
    { date: "Thu", views: 250 },
    { date: "Fri", views: 300 },
  ];

  const leadsByProperty =
    analytics?.leadsByProperty ||
    properties.map((p: any) => ({
      property: p.title,
      leads: Math.floor(Math.random() * 20),
    }));

  const statusBreakdown = analytics?.statusBreakdown || [
    { name: "Available", value: 10 },
    { name: "Sold", value: 5 },
    { name: "Under Construction", value: 3 },
  ];

  const statusColors = ["#2563eb", "#16a34a", "#f97316"];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg h-24 animate-pulse border"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views Over Time */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              Views Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leads by Property */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              Leads by Property
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByProperty}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="property" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Property Status Breakdown */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              Property Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  label
                >
                  {statusBreakdown.map((_: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[index % statusColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties & Leads (existing code) */}
      {/* Quick Actions (existing code) */}
    </div>
  );
}

function UserDashboard({ properties, loading }: any) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg h-24 animate-pulse border"
          />
        ))}
      </div>
    );
  }

  // Mock user activity data - in real app, this would come from API
  const userStats = [
    { title: "Favourites", value: 12, icon: Heart, color: "text-red-600" },
    { title: "Recently Viewed", value: 28, icon: Eye, color: "text-blue-600" },
    {
      title: "Saved Searches",
      value: 5,
      icon: Bookmark,
      color: "text-green-600",
    },
  ];

  // Mock recently viewed properties
  const recentlyViewed = [
    {
      id: 1,
      title: "Modern 3BHK Apartment",
      location: "Whitefield, Bangalore",
      price: 8500000,
      image: "/api/placeholder/300/200",
      type: "Apartment",
      bedrooms: 3,
      area: "1450 sq ft",
    },
    {
      id: 2,
      title: "Luxury Villa with Garden",
      location: "Koramangala, Bangalore",
      price: 15000000,
      image: "/api/placeholder/300/200",
      type: "Villa",
      bedrooms: 4,
      area: "2800 sq ft",
    },
    {
      id: 3,
      title: "Cozy 2BHK Near Metro",
      location: "Indiranagar, Bangalore",
      price: 6200000,
      image: "/api/placeholder/300/200",
      type: "Apartment",
      bedrooms: 2,
      area: "1100 sq ft",
    },
  ];

  // User preference insights
  const budgetPreferences = [
    { range: "30L-50L", count: 15, percentage: 35 },
    { range: "50L-80L", count: 18, percentage: 42 },
    { range: "80L-1Cr", count: 8, percentage: 19 },
    { range: "1Cr+", count: 2, percentage: 4 },
  ];

  const propertyTypePreferences = [
    { type: "Apartment", count: 25, color: "#3b82f6" },
    { type: "Villa", count: 12, color: "#10b981" },
    { type: "Plot", count: 6, color: "#f59e0b" },
    { type: "Commercial", count: 2, color: "#ef4444" },
  ];

  const searchActivityTrend = [
    { day: "Mon", searches: 8 },
    { day: "Tue", searches: 12 },
    { day: "Wed", searches: 6 },
    { day: "Thu", searches: 15 },
    { day: "Fri", searches: 10 },
    { day: "Sat", searches: 20 },
    { day: "Sun", searches: 14 },
  ];

  const locationPreferences = [
    { location: "Whitefield", interest: 85 },
    { location: "Koramangala", interest: 72 },
    { location: "Indiranagar", interest: 68 },
    { location: "HSR Layout", interest: 55 },
    { location: "Electronic City", interest: 45 },
  ];

  return (
    <div className="space-y-6">
      {/* User Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {userStats.map((stat) => (
          <Card
            key={stat.title}
            className="border border-gray-200 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg bg-gray-50`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline" className="justify-start h-12" asChild>
              <Link href="/properties">
                <Building className="w-4 h-4 mr-3" />
                Browse Properties
              </Link>
            </Button>

            <Button variant="outline" className="justify-start h-12" asChild>
              <Link href="/favourites">
                <Heart className="w-4 h-4 mr-3" />
                My Favourites
              </Link>
            </Button>

            <Button variant="outline" className="justify-start h-12" asChild>
              <Link href="/tools/mortgage-calculator">
                <Calculator className="w-4 h-4 mr-3" />
                EMI Calculator
              </Link>
            </Button>

            <Button variant="outline" className="justify-start h-12" asChild>
              <Link href="/tools/property-comparison">
                <Target className="w-4 h-4 mr-3" />
                Compare Properties
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recently Viewed Properties */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Recently Viewed Properties
            </CardTitle>
            <Button size="sm" variant="outline" asChild>
              <Link href="/viewed-properties">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentlyViewed.map((property) => (
              <div
                key={property.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-32 bg-gray-200 relative">
                  <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium">
                    {property.type}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {property.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-600 text-sm">
                      ₹{(property.price / 100000).toFixed(1)}L
                    </span>
                    <span className="text-xs text-gray-500">
                      {property.bedrooms}BHK • {property.area}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Insights Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Activity Trend */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              Search Activity This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={searchActivityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="searches"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Property Type Preferences */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              Property Type Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypePreferences}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  label={({ type, count }) => `${type}: ${count}`}
                >
                  {propertyTypePreferences.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Budget & Location Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Range Analysis */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              Budget Range Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetPreferences}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [`${value} properties`, "Viewed"]}
                />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Location Interest Heatmap */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              Location Interest Score
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {locationPreferences.map((location) => (
                <div
                  key={location.location}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {location.location}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${location.interest}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8">
                      {location.interest}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      

      {/* Personalized Recommendations */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI-Powered Recommendations
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Based on your search history and preferences, we&apos;ll show
              personalized property recommendations here.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/properties?recommended=true">
                View Recommendations
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
