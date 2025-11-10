"use client"

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Eye, Play, Pause, MoreVertical } from "lucide-react";
import Link from "next/link";

interface Campaign {
  id: number;
  name: string;
  status: string;
  sentEmails: number;
  totalEmails: number;
  openedEmails: number;
  clickedEmails: number;
}

interface CampaignWidgetProps {
  campaign: Campaign;
  delay?: number;
}

export function CampaignWidget({ campaign, delay = 0 }: CampaignWidgetProps) {
  const progress = campaign.totalEmails > 0 
    ? (campaign.sentEmails / campaign.totalEmails) * 100 
    : 0;
  const openRate = campaign.sentEmails > 0 
    ? ((campaign.openedEmails / campaign.sentEmails) * 100).toFixed(1) 
    : 0;

  const statusColors = {
    active: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    draft: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
    completed: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    paused: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card rounded-xl p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">{campaign.name}</h3>
          <Badge 
            variant="outline" 
            className={statusColors[campaign.status as keyof typeof statusColors] || statusColors.draft}
          >
            {campaign.status}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {campaign.sentEmails} / {campaign.totalEmails} sent
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Open Rate</p>
            <p className="text-2xl font-bold">{openRate}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Clicks</p>
            <p className="text-2xl font-bold">{campaign.clickedEmails}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link href={`/analytics/${campaign.id}`}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Link>
          </Button>
          {campaign.status === "active" ? (
            <Button size="sm" variant="outline">
              <Pause className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="sm" variant="outline">
              <Play className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
