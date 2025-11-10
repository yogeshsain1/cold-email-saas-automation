"use client"

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RefreshIndicatorProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function RefreshIndicator({ lastUpdated, onRefresh, isLoading }: RefreshIndicatorProps) {
  const getTimeAgo = (date: Date | null): string => {
    if (!date) return "Never";
    
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
        </div>
        <span>Updated {getTimeAgo(lastUpdated)}</span>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="gap-2"
      >
        <motion.div
          animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
          transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        >
          <RefreshCw className="w-4 h-4" />
        </motion.div>
        Refresh
      </Button>
    </div>
  );
}
