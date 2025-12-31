import { useState, useEffect } from 'react';

interface CERData {
  cer_value: number;
  timestamp: string;
  source: 'blockchain' | 'cache' | 'mock';
}

interface UseCERResult {
  cer: number | null;
  loading: boolean;
  error: string | null;
  source: string;
  lastUpdate: Date | null;
  refetch: () => Promise<void>;
}

/**
 * React hook to fetch current CER from API
 * Automatically refetches every 5 minutes
 */
export function useCER(): UseCERResult {
  const [cer, setCER] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<string>('unknown');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchCER = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/cer/current');
      const json = await response.json();

      if (json.success) {
        setCER(json.data.cer_value);
        setSource(json.data.source);
        setLastUpdate(new Date(json.data.timestamp));
      } else {
        setError(json.error || 'Failed to fetch CER');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('❌ useCER fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchCER();

    // Refetch every 5 minutes
    const interval = setInterval(fetchCER, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    cer,
    loading,
    error,
    source,
    lastUpdate,
    refetch: fetchCER,
  };
}