"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useAuthStore, usePropertyStore } from "@/lib/store";
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
  Clock,
  CalendarDays,
  GitCompare,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { PropertyCard } from "@/components/propertyListing/PropertyCard";
import { PageContent } from "@/components/animations/layout-wrapper";
import {
  DashboardEmptyState,
  DashboardQuickAction,
  DashboardSection,
  DashboardSkeleton,
  DashboardStatCard,
} from "@/components/dashboard/dashboard-ui";
import { DashboardCompareSection } from "@/components/dashboard/dashboard-compare-section";
import { DashboardSiteVisitsSection } from "@/components/dashboard/dashboard-site-visits-section";
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
import { toast } from "sonner";

const CHART_COLORS = ["#303030", "#717171", "#484848", "#B0B0B0"];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { favourites, viewedProperties, compareList } = usePropertyStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [recentlyViewedProperties, setRecentlyViewedProperties] = useState<
    any[]
  >([]);
  const [bookVisits, setBookVisits] = useState<any[]>([]);
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
        const [propertiesRes, recentlyViewedRes, bookVisitsRes]: any =
          await Promise.all([
            apiClient.getProperties({ limit: 5 }),
            user
              ? apiClient.getRecentlyViewedProperties(user.id, 5)
              : Promise.resolve({ data: [] }),
            user
              ? apiClient.getUserBookVisits(10)
              : Promise.resolve({ data: [] }),
          ]);

        setProperties(propertiesRes.data || []);
        setRecentlyViewedProperties(recentlyViewedRes.data || []);
        setBookVisits(bookVisitsRes.data || []);
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
      <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="compare-surface max-w-md p-8 text-center">
            <h1 className="property-section-title mb-2">sign in required</h1>
            <p className="mb-6 font-manrope text-sm text-[#717171]">
              Log in to view your dashboard, saved properties, and visit
              bookings.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                className="property-btn-pill h-10 bg-[#303030] px-5 text-white hover:bg-[#1a1a1a]"
                asChild
              >
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button
                variant="outline"
                className="property-btn-pill h-10 border-[#D0D0D0] px-5"
                asChild
              >
                <Link href="/auth/signup">Create account</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1">
        <PageContent>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Page header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="property-section-eyebrow">Account</p>
                <h1 className="property-section-title">
                  hello, {user.firstName?.toLowerCase()}
                </h1>
                <p className="mt-2 font-manrope text-sm text-[#717171]">
                  {user.role === "builder"
                    ? "Manage your listings, leads, and performance."
                    : "Track saved homes, visits, and property tools."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="property-badge-listing uppercase tracking-[0.08em]">
                  {user.role === "builder" ? "Builder" : "Buyer"}
                </span>
                <Button
                  className="property-btn-pill h-10 bg-[#303030] px-5 font-manrope text-sm text-white hover:bg-[#1a1a1a]"
                  asChild
                >
                  <Link
                    href={
                      user.role === "builder"
                        ? "/dashboard/property/create"
                        : "/properties"
                    }
                  >
                    <Plus className="mr-2 size-4" strokeWidth={1.5} />
                    {user.role === "builder" ? "Add property" : "Browse homes"}
                  </Link>
                </Button>
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
              <UserDashboard
                properties={properties}
                loading={loading}
                recentlyViewedProperties={recentlyViewedProperties}
                favourites={favourites}
                viewedProperties={viewedProperties}
                bookVisits={bookVisits}
                compareList={compareList}
                onRefreshVisits={fetchDashboardData}
              />
            )}
          </div>
        </PageContent>
      </main>

      <Footer />
    </div>
  );
}

function BuilderDashboard({ analytics, properties, leads, loading }: any) {
  const stats = [
    { title: "Properties", value: analytics?.totalProperties || 0, icon: Building },
    { title: "Views", value: analytics?.totalViews || 0, icon: Eye },
    { title: "Leads", value: analytics?.totalLeads || 0, icon: Users },
    { title: "Favourites", value: analytics?.totalFavourites || 0, icon: Heart },
  ];

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
      property: p.title?.slice(0, 12) || "Property",
      leads: Math.floor(Math.random() * 20),
    }));

  const statusBreakdown = analytics?.statusBreakdown || [
    { name: "Available", value: 10 },
    { name: "Sold", value: 5 },
    { name: "Under construction", value: 3 },
  ];

  if (loading) return <DashboardSkeleton count={4} />;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.title}
            label={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DashboardSection title="Views over time" subtitle="Last 5 days">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsTrend}>
                <CartesianGrid stroke="#F0F0F0" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#717171" }} />
                <YAxis tick={{ fontSize: 12, fill: "#717171" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #D0D0D0",
                    fontFamily: "var(--font-manrope)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#303030"
                  strokeWidth={2}
                  dot={{ fill: "#303030", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardSection>

        <DashboardSection title="Leads by property">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByProperty}>
                <CartesianGrid stroke="#F0F0F0" strokeDasharray="3 3" />
                <XAxis dataKey="property" tick={{ fontSize: 11, fill: "#717171" }} />
                <YAxis tick={{ fontSize: 12, fill: "#717171" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #D0D0D0",
                    fontFamily: "var(--font-manrope)",
                  }}
                />
                <Bar dataKey="leads" fill="#484848" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardSection>

        <DashboardSection title="Property status">
          <div className="flex h-56 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                >
                  {statusBreakdown.map((_: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #D0D0D0",
                    fontFamily: "var(--font-manrope)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardSection>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardSection
          title="Recent properties"
          action={
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-full border-[#D0D0D0] font-manrope text-xs"
              asChild
            >
              <Link href="/dashboard/properties">
                View all
                <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          }
        >
          {properties.length > 0 ? (
            <div className="space-y-3">
              {properties.map((property: any) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.slug || property.id}`}
                  className="flex items-center gap-3 rounded-[12px] border border-[#E8E8E8] bg-[#FAFAFA] p-3 transition-colors hover:border-[#D0D0D0] hover:bg-white"
                >
                  <div className="property-icon-pill shrink-0">
                    <Building className="size-4" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-manrope text-sm font-medium text-[#1A1A1A]">
                      {property.title}
                    </p>
                    <p className="truncate font-manrope text-xs text-[#717171]">
                      {property.city}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-[#B0B0B0]" />
                </Link>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              icon={Building}
              title="No properties yet"
              description="Add your first listing to start receiving leads."
              actionHref="/dashboard/property/create"
              actionLabel="Add property"
            />
          )}
        </DashboardSection>

        <DashboardSection
          title="Recent leads"
          action={
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-full border-[#D0D0D0] font-manrope text-xs"
              asChild
            >
              <Link href="/dashboard/leads">
                View all
                <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          }
        >
          {leads.length > 0 ? (
            <div className="space-y-3">
              {leads.map((lead: any, index: number) => (
                <div
                  key={lead.id || index}
                  className="rounded-[12px] border border-[#E8E8E8] bg-[#FAFAFA] p-3"
                >
                  <p className="font-manrope text-sm font-medium text-[#1A1A1A]">
                    {lead.name || lead.contactName || "New lead"}
                  </p>
                  <p className="mt-0.5 font-manrope text-xs text-[#717171]">
                    {lead.email || lead.phone || "Contact details pending"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <DashboardEmptyState
              icon={Users}
              title="No leads yet"
              description="Leads from your listings will appear here."
            />
          )}
        </DashboardSection>
      </div>

      <DashboardSection title="Quick actions">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardQuickAction
            href="/dashboard/properties"
            icon={Building}
            label="Manage properties"
            description="Edit, publish, and track listings"
          />
          <DashboardQuickAction
            href="/dashboard/leads"
            icon={Users}
            label="View leads"
            description="Follow up with interested buyers"
          />
          <DashboardQuickAction
            href="/dashboard/analytics"
            icon={BarChart3}
            label="Analytics"
            description="Deep dive into performance"
          />
        </div>
      </DashboardSection>
    </div>
  );
}

function UserDashboard({
  properties,
  loading,
  recentlyViewedProperties,
  favourites,
  bookVisits,
  compareList,
  onRefreshVisits,
}: any) {
  const { addToFavourites, removeFromFavourites } = usePropertyStore();
  const { user } = useAuthStore();

  const handleFavorite = async (property: any) => {
    if (!user) {
      toast.error("Please login to add favourites");
      return;
    }

    try {
      const isFavorite = favourites.some((p: any) => p.id === property.id);
      if (isFavorite) {
        await apiClient.removeFromFavourites(property.id);
        removeFromFavourites(property.id);
        toast.success("Property removed from favourites");
      } else {
        await apiClient.addToFavourites(property.id);
        addToFavourites(property);
        toast.success("Property added to favourites");
      }
    } catch (error) {
      console.error("Error updating favourite:", error);
      toast.error("Failed to update favourite");
    }
  };

  if (loading) return <DashboardSkeleton count={3} />;

  const userStats = [
    { title: "Favourites", value: favourites?.length || 0, icon: Heart },
    {
      title: "Recently viewed",
      value: recentlyViewedProperties?.length || 0,
      icon: Clock,
    },
    { title: "Compare list", value: compareList?.length || 0, icon: GitCompare },
    { title: "Site visits", value: bookVisits?.length || 0, icon: CalendarDays },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {userStats.map((stat) => (
          <DashboardStatCard
            key={stat.title}
            label={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <DashboardSection title="Quick actions">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardQuickAction
            href="/properties"
            icon={Building}
            label="Browse properties"
            description="Explore homes across Bengaluru"
          />
          <DashboardQuickAction
            href="/favourites"
            icon={Heart}
            label="My favourites"
            description="Saved properties in one place"
          />
          <DashboardQuickAction
            href="/tools/mortgage-calculator"
            icon={Calculator}
            label="EMI calculator"
            description="Estimate monthly payments"
          />
          <DashboardQuickAction
            href="/tools/property-comparison"
            icon={GitCompare}
            label="Compare properties"
            description="Side-by-side up to 3 homes"
          />
        </div>
      </DashboardSection>

      <DashboardCompareSection
        properties={compareList || []}
        onFavorite={handleFavorite}
        isFavorite={(property) =>
          favourites.some((p: any) => p.id === property.id)
        }
      />

      <DashboardSiteVisitsSection
        visits={bookVisits || []}
        onRefresh={onRefreshVisits}
      />

      <DashboardSection
        title="Recently viewed"
        subtitle="Pick up where you left off"
        action={
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-[#D0D0D0] font-manrope text-xs"
            asChild
          >
            <Link href="/viewed-properties">
              View all
              <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </Button>
        }
      >
        {recentlyViewedProperties?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentlyViewedProperties.map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavorite={() => handleFavorite(property)}
                isFavorite={favourites.some((p: any) => p.id === property.id)}
                compact
              />
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            icon={Eye}
            title="No recently viewed properties"
            description="Browse listings and they'll show up here."
            actionHref="/properties"
            actionLabel="Browse properties"
          />
        )}
      </DashboardSection>

      <DashboardSection
        title="Recommended for you"
        subtitle="Personalised picks based on your activity"
      >
        {properties?.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.slice(0, 3).map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavorite={() => handleFavorite(property)}
                isFavorite={favourites.some((p: any) => p.id === property.id)}
                compact
              />
            ))}
          </div>
        ) : (
          <DashboardEmptyState
            icon={Target}
            title="Recommendations coming soon"
            description="Explore properties to get personalised suggestions."
            actionHref="/properties"
            actionLabel="Browse properties"
          />
        )}
      </DashboardSection>
    </div>
  );
}
