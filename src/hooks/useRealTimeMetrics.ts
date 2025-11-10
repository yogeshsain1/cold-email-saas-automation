import { useEffect, useState, useRef } from 'react';

export interface CampaignMetrics {
  totalEmails: number;
  sentEmails: number;
  openedEmails: number;
  clickedEmails: number;
  repliedEmails: number;
  bouncedEmails: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
}

export interface UseRealTimeMetricsOptions {
  campaignId: number;
  enabled?: boolean;
  pollingInterval?: number; // milliseconds
  onUpdate?: (metrics: CampaignMetrics) => void;
}

export function useRealTimeMetrics({
  campaignId,
  enabled = true,
  pollingInterval = 5000,
  onUpdate,
}: UseRealTimeMetricsOptions) {
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMetrics = async () => {
    try {
      const token = localStorage.getItem('bearer_token');
      const response = await fetch(`/api/analytics/campaigns/${campaignId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      
      const campaignMetrics: CampaignMetrics = {
        totalEmails: data.totalEmails || 0,
        sentEmails: data.sentEmails || 0,
        openedEmails: data.openedEmails || 0,
        clickedEmails: data.clickedEmails || 0,
        repliedEmails: data.repliedEmails || 0,
        bouncedEmails: data.bouncedEmails || 0,
        deliveryRate: data.totalEmails > 0 
          ? ((data.sentEmails - data.bouncedEmails) / data.totalEmails) * 100 
          : 0,
        openRate: data.sentEmails > 0 
          ? (data.openedEmails / data.sentEmails) * 100 
          : 0,
        clickRate: data.sentEmails > 0 
          ? (data.clickedEmails / data.sentEmails) * 100 
          : 0,
        replyRate: data.sentEmails > 0 
          ? (data.repliedEmails / data.sentEmails) * 100 
          : 0,
      };

      setMetrics(campaignMetrics);
      setError(null);
      
      if (onUpdate) {
        onUpdate(campaignMetrics);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchMetrics();

    // Set up polling
    intervalRef.current = setInterval(fetchMetrics, pollingInterval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [campaignId, enabled, pollingInterval]);

  const refetch = () => {
    setLoading(true);
    fetchMetrics();
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startPolling = () => {
    if (!intervalRef.current && enabled) {
      intervalRef.current = setInterval(fetchMetrics, pollingInterval);
    }
  };

  return {
    metrics,
    loading,
    error,
    refetch,
    stopPolling,
    startPolling,
  };
}
