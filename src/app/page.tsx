"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authClient, useSession } from "@/lib/auth-client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CampaignWidget } from "@/components/dashboard/CampaignWidget";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RefreshIndicator } from "@/components/dashboard/RefreshIndicator";
import { ExportMenu } from "@/components/dashboard/ExportMenu";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Mail, Users, Eye } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [activities, setActivities] = useState<any[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Real-time data fetching for stats
  const {
    data: stats,
    isLoading: statsLoading,
    lastUpdated: statsLastUpdated,
    refetch: refetchStats,
  } = useRealtimeData({
    url: `/api/analytics/overview?userId=${session?.user?.id || ''}`,
    interval: 10000, // 10 seconds
    enabled: !!session?.user?.id,
    headers: {
      'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : ""}`,
    },
  });

  // Real-time data fetching for campaigns
  const {
    data: campaigns,
    isLoading: campaignsLoading,
    lastUpdated: campaignsLastUpdated,
    refetch: refetchCampaigns,
  } = useRealtimeData<any[]>({
    url: `/api/campaigns?userId=${session?.user?.id || ''}&limit=6`,
    interval: 10000, // 10 seconds
    enabled: !!session?.user?.id,
    headers: {
      'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : ""}`,
    },
  });

  useEffect(() => {
    // Fetch recent activity (mock data for now)
    setActivities([
      {
        id: 1,
        type: "opened",
        email: "sarah.chen@nexusai.com",
        campaign: "Q1 Tech Startups Outreach",
        timestamp: "2 minutes ago",
      },
      {
        id: 2,
        type: "clicked",
        email: "michael.rodriguez@cloudshift.io",
        campaign: "Q1 Tech Startups Outreach",
        timestamp: "5 minutes ago",
      },
      {
        id: 3,
        type: "replied",
        email: "jennifer.clark@acmecorp.com",
        campaign: "Marketing Directors Campaign",
        timestamp: "12 minutes ago",
      },
      {
        id: 4,
        type: "sent",
        email: "emily.watson@datastream.tech",
        campaign: "Q1 Tech Startups Outreach",
        timestamp: "15 minutes ago",
      },
      {
        id: 5,
        type: "opened",
        email: "robert.taylor@globalreach.com",
        campaign: "Marketing Directors Campaign",
        timestamp: "23 minutes ago",
      },
      {
        id: 6,
        type: "clicked",
        email: "david@techhaven.io",
        campaign: "Q1 Tech Startups Outreach",
        timestamp: "31 minutes ago",
      },
      {
        id: 7,
        type: "bounced",
        email: "invalid@example.com",
        campaign: "Marketing Directors Campaign",
        timestamp: "45 minutes ago",
      },
      {
        id: 8,
        type: "replied",
        email: "maria.garcia@techsolutions.com",
        campaign: "Marketing Directors Campaign",
        timestamp: "1 hour ago",
      },
    ]);
  }, []);

  const handleRefreshAll = () => {
    refetchStats();
    refetchCampaigns();
  };

  if (isPending || (statsLoading && campaignsLoading && !stats && !campaigns)) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // Ensure campaigns is always an array
  const safeCampaigns = Array.isArray(campaigns) ? campaigns : [];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user.name}! Here's what's happening with your campaigns.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshIndicator 
              lastUpdated={statsLastUpdated || campaignsLastUpdated}
              onRefresh={handleRefreshAll}
              isLoading={statsLoading || campaignsLoading}
            />
            <ExportMenu 
              data={{ campaigns: safeCampaigns, stats }}
              type="campaigns"
            />
            <Button size="lg" className="gap-2" asChild>
              <Link href="/campaigns/new">
                <Plus className="w-5 h-5" />
                New Campaign
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Campaigns"
            value={stats?.totalCampaigns || 0}
            change={`${stats?.activeCampaigns || 0} active`}
            changeType="positive"
            icon={Mail}
            iconColor="text-blue-600 dark:text-blue-400"
            delay={0}
          />
          <StatsCard
            title="Emails Sent"
            value={stats?.totalEmailsSent?.toLocaleString() || 0}
            change={`${stats?.averageOpenRate || 0}% open rate`}
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-green-600 dark:text-green-400"
            delay={0.1}
          />
          <StatsCard
            title="Total Contacts"
            value={stats?.totalContacts?.toLocaleString() || 0}
            change={`${stats?.totalEmailLists || 0} lists`}
            changeType="neutral"
            icon={Users}
            iconColor="text-purple-600 dark:text-purple-400"
            delay={0.2}
          />
          <StatsCard
            title="Click Rate"
            value={`${stats?.averageClickRate || 0}%`}
            change={`${stats?.totalEmailsClicked || 0} clicks`}
            changeType="positive"
            icon={Eye}
            iconColor="text-orange-600 dark:text-orange-400"
            delay={0.3}
          />
        </div>

        {/* Campaigns Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Active Campaigns</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/campaigns">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeCampaigns.length > 0 && safeCampaigns.slice(0, 6).map((campaign, index) => (
              <CampaignWidget
                key={campaign.id}
                campaign={campaign}
                delay={index * 0.1}
              />
            ))}
          </div>
          {safeCampaigns.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-xl p-12 text-center"
            >
              <Mail className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first campaign to start sending cold emails
              </p>
              <Button asChild>
                <Link href="/campaigns/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Link>
              </Button>
            </motion.div>
          )}
        </div>

        {/* Recent Activity */}
        <RecentActivity activities={activities} />
      </main>
    </div>
  );
}