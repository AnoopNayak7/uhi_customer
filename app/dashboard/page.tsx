"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api';
import { 
  BarChart3, 
  Eye, 
  Heart, 
  Building, 
  Users, 
  TrendingUp, 
  Plus,
  Calendar,
  MapPin,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (user?.role === 'builder') {
        const [analyticsRes, propertiesRes, leadsRes]:any = await Promise.all([
          apiClient.getBuilderAnalytics(),
          apiClient.getMyProperties({ limit: 5 }),
          apiClient.getMyLeads({ limit: 5 })
        ]);
        
        setAnalytics(analyticsRes.data);
        setProperties(propertiesRes.data || []);
        setLeads(leadsRes.data || []);
      } else {
        const propertiesRes:any = await apiClient.getProperties({ limit: 5 });
        setProperties(propertiesRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-gray-600 mt-2">
              {user.role === 'builder' 
                ? 'Manage your properties and track performance'
                : 'Track your property searches and manage your favourites'
              }
            </p>
          </div>

          {user.role === 'builder' ? (
            <BuilderDashboard 
              analytics={analytics}
              properties={properties}
              leads={leads}
              loading={loading}
            />
          ) : (
            <UserDashboard 
              properties={properties}
              loading={loading}
            />
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
      title: 'Total Properties',
      value: analytics?.totalProperties || 0,
      icon: Building,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Views',
      value: analytics?.totalViews || 0,
      icon: Eye,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Leads',
      value: analytics?.totalLeads || 0,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Favourites',
      value: analytics?.totalFavourites || 0,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Properties</CardTitle>
              <CardDescription>Your latest property listings</CardDescription>
            </div>
            <Button size="sm" asChild>
              <Link href="/dashboard/property/create">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.slice(0, 3).map((property: any) => (
                <div key={property.id} className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {property.city}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{(property.price / 100000).toFixed(1)}L
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {property.status}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {properties.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No properties yet. Create your first listing!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>Latest inquiries on your properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.slice(0, 3).map((lead: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {lead.user?.firstName} {lead.user?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Viewed: {lead.property?.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {lead.type}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {leads.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No leads yet. Promote your properties to get more visibility!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your properties and account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/dashboard/property/create">
                <Plus className="w-6 h-6 mb-2" />
                Add New Property
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/dashboard/properties">
                <Building className="w-6 h-6 mb-2" />
                Manage Properties
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/dashboard/analytics">
                <BarChart3 className="w-6 h-6 mb-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserDashboard({ properties, loading }: any) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Favourite Properties
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Recently Viewed
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Saved Searches
                </p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Find and manage your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col bg-red-500 hover:bg-red-600" asChild>
              <Link href="/properties">
                <Building className="w-6 h-6 mb-2" />
                Browse Properties
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/favourites">
                <Heart className="w-6 h-6 mb-2" />
                My Favourites
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/viewed-properties">
                <Eye className="w-6 h-6 mb-2" />
                Recently Viewed
              </Link>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col" asChild>
              <Link href="/profile">
                <Users className="w-6 h-6 mb-2" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>Properties matching your preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              Start browsing properties to get personalized recommendations
            </p>
            <Button asChild>
              <Link href="/properties">
                Explore Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}