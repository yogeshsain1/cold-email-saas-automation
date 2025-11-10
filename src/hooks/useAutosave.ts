import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAutosaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  interval?: number; // milliseconds
  enabled?: boolean;
}

export function useAutosave<T>({
  data,
  onSave,
  interval = 30000, // 30 seconds default
  enabled = true,
}: UseAutosaveOptions<T>) {
  const savedDataRef = useRef<string>(JSON.stringify(data));
  const isSavingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const save = useCallback(async () => {
    const currentData = JSON.stringify(data);
    
    // Skip if data hasn't changed or already saving
    if (currentData === savedDataRef.current || isSavingRef.current) {
      return;
    }

    isSavingRef.current = true;
    
    try {
      await onSave(data);
      savedDataRef.current = currentData;
      toast.success('Draft saved', { duration: 2000 });
    } catch (error) {
      toast.error('Failed to save draft');
      console.error('Autosave error:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(save, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, save, interval, enabled]);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await save();
  }, [save]);

  return { saveNow };
}
