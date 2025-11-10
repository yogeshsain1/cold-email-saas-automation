"use client"

import { motion } from "framer-motion";
import { Activity, Target, Zap, Award } from "lucide-react";

interface Metric {
  label: string;
  value: string | number;
  change?: number;
  icon: any;
  color: string;
}

interface PerformanceMetricsProps {
  metrics: {
    deliveryRate: number;
    engagementRate: number;
    responseTime: number; // in hours
    qualityScore: number;
  };
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const performanceMetrics: Metric[] = [
    {
      label: "Delivery Rate",
      value: `${metrics.deliveryRate.toFixed(1)}%`,
      change: metrics.deliveryRate >= 95 ? 2.5 : -1.2,
      icon: Target,
      color: "bg-blue-500",
    },
    {
      label: "Engagement Rate",
      value: `${metrics.engagementRate.toFixed(1)}%`,
      change: 5.3,
      icon: Activity,
      color: "bg-green-500",
    },
    {
      label: "Avg Response Time",
      value: `${metrics.responseTime}h`,
      change: -12.4,
      icon: Zap,
      color: "bg-orange-500",
    },
    {
      label: "Quality Score",
      value: `${metrics.qualityScore}/100`,
      change: 8.1,
      icon: Award,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {performanceMetrics.map((metric, index) => {
        const Icon = metric.icon;
        const isPositive = metric.change && metric.change > 0;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${metric.color} bg-opacity-10 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${metric.color.replace('bg-', 'text-')}`} />
              </div>
              {metric.change !== undefined && (
                <div className={`text-sm font-medium ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}>
                  {isPositive ? "+" : ""}{metric.change.toFixed(1)}%
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
