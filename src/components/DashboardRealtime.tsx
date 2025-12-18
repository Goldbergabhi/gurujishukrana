import React, { useEffect, useRef, useState } from 'react';
import useSSE from '../hooks/useSSE';

function useDebounced(fn: (...args: any[]) => void, ms = 800) {
  const t = useRef<number | null>(null);
  return (...args: any[]) => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => fn(...args), ms);
  };
}

export default function DashboardRealtime({ companyId, surveyId }: { companyId: string; surveyId: string }) {
  const [aggregates, setAggregates] = useState<any>(null);
  const [connected, setConnected] = useState(false);

  const fetchAgg = async () => {
    try {
      const res = await fetch(`/api/aggregates?surveyId=${encodeURIComponent(surveyId)}`, { credentials: 'include' });
      if (!res.ok) return;
      const json = await res.json();
      if (json && json.ok) setAggregates(json.aggregates);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('fetchAgg error', e);
    }
  };

  const debouncedFetch = useDebounced(fetchAgg, 800);

  useEffect(() => {
    // initial load will be triggered after login
    fetchAgg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, surveyId]);

  useSSE({
    companyId,
    surveyId,
    onEvent: (ev: MessageEvent) => {
      try {
        const payload = JSON.parse(ev.data);
        if (payload && payload.surveyId === surveyId && payload.companyId === companyId) {
          debouncedFetch();
        }
      } catch (e) {
        debouncedFetch();
      }
    },
    onStatus: (status) => {
      setConnected(status === 'connected');
    }
  });

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <strong>Realtime</strong> SSE: {connected ? 'connected' : 'disconnected'}
      </div>
      {aggregates ? (
        <pre style={{ maxHeight: 400, overflow: 'auto' }}>{JSON.stringify(aggregates, null, 2)}</pre>
      ) : (
        <div>Loading aggregates...</div>
      )}
    </div>
  );
}
