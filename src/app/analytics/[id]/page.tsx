"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authClient, useSession } from "@/lib/auth-client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import {
  Mail,
  Eye,
  MousePointer,
  Reply,
  XCircle,
  ArrowLeft,
  Download,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function CampaignAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const campaignId = parseInt(params.id as string);

  const { metrics, loading, error, refetch, stopPolling, startPolling } = useRealTimeMetrics({
    campaignId,
    enabled: true,
    pollingInterval: 5000,
  });

  const [campaign, setCampaign] = useState<any>(null);
  const [campaignLoading, setCampaignLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchCampaign() {
      if (!session?.user?.id) return;

      try {
        const token = localStorage.getItem("bearer_token");
        const response = await fetch(`/api/campaigns?id=${campaignId}&userId=${session.user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCampaign(data);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setCampaignLoading(false);
      }
    }

    if (session?.user) {
      fetchCampaign();
    }
  }, [campaignId, session]);

  if (isPending || campaignLoading || loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!session?.user || !campaign) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: "bg-gray-500",
      scheduled: "bg-blue-500",
      active: "bg-green-500",
      completed: "bg-purple-500",
      paused: "bg-yellow-500",
    };

    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || "bg-gray-500"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Campaigns
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  {campaign.name}
                </h1>
                {getStatusBadge(campaign.status)}
              </div>
              <p className="text-muted-foreground">Campaign Performance Analytics</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={refetch}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Real-time Metrics */}
        {metrics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge variant="secondary" className="animate-pulse">Live</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Emails Sent</p>
                <p className="text-3xl font-bold">{metrics.sentEmails}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  of {metrics.totalEmails} total
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <Badge variant="secondary">{metrics.openRate.toFixed(1)}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Opens</p>
                <p className="text-3xl font-bold">{metrics.openedEmails}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {metrics.openRate.toFixed(1)}% open rate
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <MousePointer className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Badge variant="secondary">{metrics.clickRate.toFixed(1)}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Clicks</p>
                <p className="text-3xl font-bold">{metrics.clickedEmails}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {metrics.clickRate.toFixed(1)}% click rate
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Reply className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <Badge variant="secondary">{metrics.replyRate.toFixed(1)}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">Replies</p>
                <p className="text-3xl font-bold">{metrics.repliedEmails}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {metrics.replyRate.toFixed(1)}% reply rate
                </p>
              </motion.div>
            </div>

            {/* Delivery Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Delivery Performance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Delivery Rate</span>
                      <span className="text-sm font-medium">{metrics.deliveryRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${metrics.deliveryRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-xs text-muted-foreground">Delivered</p>
                      <p className="text-xl font-bold">{metrics.sentEmails - metrics.bouncedEmails}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="flex items-center gap-1 mb-1">
                        <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                        <p className="text-xs text-muted-foreground">Bounced</p>
                      </div>
                      <p className="text-xl font-bold">{metrics.bouncedEmails}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Open Rate</span>
                      <span className="text-sm font-medium">{metrics.openRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${metrics.openRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Click Rate</span>
                      <span className="text-sm font-medium">{metrics.clickRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${metrics.clickRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Reply Rate</span>
                      <span className="text-sm font-medium">{metrics.replyRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all"
                        style={{ width: `${metrics.replyRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {error && (
          <div className="glass-card rounded-xl p-6 mb-8">
            <p className="text-destructive">Error loading metrics: {error}</p>
          </div>
        )}
      </main>
    </div>
  );
}