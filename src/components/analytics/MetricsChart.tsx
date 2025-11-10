"use client"

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DataPoint {
  label: string;
  value: number;
}

interface MetricsChartProps {
  title: string;
  data: DataPoint[];
  change?: number; // Percentage change
  color?: string;
}

export function MetricsChart({ title, data, change, color = "bg-primary" }: MetricsChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  const getTrendIcon = () => {
    if (!change) return <Minus className="w-4 h-4" />;
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getTrendColor = () => {
    if (!change) return "text-muted-foreground";
    if (change > 0) return "text-green-500";
    return "text-red-500";
  };

  return (
    <div className="glass-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">{title}</h3>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="space-y-3">
        {data.map((point, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{point.label}</span>
              <span className="font-medium">{point.value.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(point.value / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full ${color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-semibold text-lg">
            {data.reduce((sum, point) => sum + point.value, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
