"use client"

import { motion } from "framer-motion";
import { Mail, MousePointerClick, Reply, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Activity {
  id: number;
  type: "sent" | "opened" | "clicked" | "replied" | "bounced";
  email: string;
  campaign: string;
  timestamp: string;
}

const activityIcons = {
  sent: Mail,
  opened: Mail,
  clicked: MousePointerClick,
  replied: Reply,
  bounced: AlertCircle,
};

const activityColors = {
  sent: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
  opened: "text-green-600 dark:text-green-400 bg-green-500/10",
  clicked: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
  replied: "text-orange-600 dark:text-orange-400 bg-orange-500/10",
  bounced: "text-red-600 dark:text-red-400 bg-red-500/10",
};

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-xl p-6"
    >
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-1">
                    Email {activity.type} - {activity.email}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {activity.campaign}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
