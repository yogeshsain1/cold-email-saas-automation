import { useState, useEffect, useCallback } from 'react';

interface UseRealtimeDataOptions {
  url: string;
  interval?: number; // milliseconds
  enabled?: boolean;
  headers?: HeadersInit;
}

export function useRealtimeData<T>(options: UseRealtimeDataOptions) {
  const { url, interval = 5000, enabled = true, headers } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [url, headers]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchData();

    // Set up interval
    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [fetchData, interval, enabled]);

  return {
    data,
    isLoading,
    error,
    lastUpdated,
    refetch,
  };
}
