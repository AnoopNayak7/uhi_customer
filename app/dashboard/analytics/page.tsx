"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart, 
  Users, 
  Building,
  ArrowLeft,
  Calendar,
  MapPin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      fetchProperties();
    }
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getBuilderAnalytics({ days: timeRange });
      setAnalytics(response.data || mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(mockAnalytics);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await apiClient.getMyProperties({ limit: 10 });
      setProperties(response.data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view analytics.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600">
                  Track your property performance and insights
                </p>
              </div>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 3 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-16 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Total Properties
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics?.totalProperties || 0}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          +{analytics?.newProperties || 0} this month
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-50">
                        <Building className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Total Views
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics?.totalViews || 0}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          +{analytics?.viewsGrowth || 0}% vs last period
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-green-50">
                        <Eye className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Total Leads
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics?.totalLeads || 0}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          +{analytics?.newLeads || 0} this week
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-purple-50">
                        <Users className="w-6 h-6 text-purple-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Total Favourites
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {analytics?.totalFavourites || 0}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          +{analytics?.favouritesGrowth || 0}% vs last period
                        </p>
                      </div>
                      <div className="p-3 rounded-full bg-red-50">
                        <Heart className="w-6 h-6 text-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Views Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Property Views Over Time</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics?.viewsChart || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Leads Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>Leads by Property Type</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics?.leadsChart || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="leads" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Top Performing Properties */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {properties.slice(0, 5).map((property, index) => (
                      <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{property.title}</h4>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-3 h-3 mr-1" />
                              {property.city}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1 text-gray-400" />
                              <span>{property.views || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1 text-gray-400" />
                              <span>{property.favourites || 0}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1 text-gray-400" />
                              <span>{property.leads || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Mock data for demo
const mockAnalytics = {
  totalProperties: 12,
  totalViews: 2847,
  totalLeads: 156,
  totalFavourites: 89,
  newProperties: 3,
  viewsGrowth: 15,
  newLeads: 12,
  favouritesGrowth: 8,
  viewsChart: [
    { date: '2024-01-01', views: 120 },
    { date: '2024-01-02', views: 150 },
    { date: '2024-01-03', views: 180 },
    { date: '2024-01-04', views: 200 },
    { date: '2024-01-05', views: 170 },
    { date: '2024-01-06', views: 220 },
    { date: '2024-01-07', views: 250 },
  ],
  leadsChart: [
    { type: 'Apartment', leads: 45 },
    { type: 'House', leads: 32 },
    { type: 'Villa', leads: 28 },
    { type: 'Plot', leads: 15 },
  ]
};