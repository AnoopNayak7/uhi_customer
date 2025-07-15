"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api';
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function LeadsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMyLeads();
      setLeads(response.data || mockLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads(mockLeads);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.property?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesType = typeFilter === 'all' || lead.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view leads.</p>
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
                  Leads Management
                </h1>
                <p className="text-gray-600">
                  Track and manage inquiries on your properties
                </p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-red-500">{leads.length}</div>
                <div className="text-sm text-gray-600">Total Leads</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="view">Property View</SelectItem>
                    <SelectItem value="contact">Contact Request</SelectItem>
                    <SelectItem value="callback">Callback Request</SelectItem>
                    <SelectItem value="visit">Site Visit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Leads List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2" />
                        <div className="h-3 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredLeads.length > 0 ? (
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <Card key={lead.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {lead.user?.firstName?.[0]}{lead.user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {lead.user?.firstName} {lead.user?.lastName}
                            </h3>
                            <Badge className={`${
                              lead.status === 'new' ? 'bg-blue-500' :
                              lead.status === 'contacted' ? 'bg-yellow-500' :
                              lead.status === 'qualified' ? 'bg-green-500' :
                              'bg-gray-500'
                            } text-white border-0`}>
                              {lead.status}
                            </Badge>
                            <Badge variant="outline">
                              {lead.type}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2" />
                              {lead.user?.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2" />
                              {lead.user?.phone}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {lead.property?.title}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {lead.message && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">{lead.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" className="bg-red-500 hover:bg-red-600">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Property
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Leads Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Leads will appear here when users show interest in your properties.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Mock data for demo
const mockLeads = [
  {
    id: '1',
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210'
    },
    property: {
      title: 'Luxury 3BHK Apartment in Whitefield'
    },
    type: 'contact',
    status: 'new',
    message: 'I am interested in this property. Please call me.',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    user: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+91 9876543211'
    },
    property: {
      title: 'Modern 2BHK in Koramangala'
    },
    type: 'visit',
    status: 'contacted',
    message: 'Would like to schedule a site visit this weekend.',
    createdAt: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    user: {
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      phone: '+91 9876543212'
    },
    property: {
      title: 'Spacious Villa in Sarjapur'
    },
    type: 'callback',
    status: 'qualified',
    message: 'Please call me after 6 PM.',
    createdAt: '2024-01-13T09:20:00Z'
  }
];