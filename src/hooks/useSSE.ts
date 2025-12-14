import { useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/database';

type Handler = (event: MessageEvent) => void;

export default function useSSE(opts: { companyId?: string | null; surveyId?: string | null; onEvent?: Handler }) {
  const esRef = useRef<EventSource | null>(null);
  useEffect(() => {
    const { companyId, surveyId, onEvent } = opts;
    const devRoot = API_BASE_URL.replace(/\/api$/, '');
    let url = `${devRoot}/sse`;
    const params: string[] = [];
    if (companyId) params.push(`companyId=${encodeURIComponent(companyId)}`);
    if (surveyId) params.push(`surveyId=${encodeURIComponent(surveyId)}`);
    if (params.length) url += `?${params.join('&')}`;

    try {
      const es = new EventSource(url);
      esRef.current = es;
      if (onEvent) es.addEventListener('response:created', onEvent as EventListener);
      es.onerror = () => { /* rely on native reconnect */ };
    } catch (err) {
      // ignore — EventSource might not be available in this environment
      console.warn('SSE connection failed', err);
    }

    return () => {
      try {
        if (esRef.current) {
          if (opts.onEvent) esRef.current.removeEventListener('response:created', opts.onEvent as EventListener);
          esRef.current.close();
        }
      } catch (e) {}
    };
  }, [opts.companyId, opts.surveyId, opts.onEvent]);
}
