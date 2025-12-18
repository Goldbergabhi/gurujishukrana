import { useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config/database';

type Handler = (event: MessageEvent) => void;
type StatusHandler = (status: 'connecting' | 'connected' | 'unavailable' | 'error' | 'closed', detail?: string) => void;

export default function useSSE(opts: { companyId?: string | null; surveyId?: string | null; onEvent?: Handler; onStatus?: StatusHandler }): { reconnect: () => void } {
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const retryRef = useRef(0);
  const maxRetry = 6;

  const resolveToken = async (companyId?: string | null): Promise<string | null> => {
    try {
      const local = (() => { try { return localStorage.getItem('token'); } catch (e) { return null; } })();
      if (local) return local;
      const devRoot = API_BASE_URL.replace(/\/api$/, '');
      const IS_PROD = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.PROD) ? true : false;
      const ENABLE_DEV_TOKEN = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_ENABLE_DEV_TOKEN === 'true') ? true : false;
      if (!IS_PROD && ENABLE_DEV_TOKEN) {
        try {
          const tokUrl = IS_PROD ? `${devRoot}/api/dev-token` : `/api/dev-token`;
          const tokRes = await fetch(`${tokUrl}${companyId ? `?companyId=${encodeURIComponent(String(companyId))}` : ''}`);
          if (tokRes.ok) {
            const tjson = await tokRes.json();
            const t = tjson?.token || null;
            if (t) {
              try { localStorage.setItem('token', t); } catch (e) {}
              return t;
            }
          }
        } catch (e) { /* ignore */ }
      }
    } catch (e) {}
    return null;
  };

  const checkBackendAlive = async (timeout = 3000) => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const devRoot = API_BASE_URL.replace(/\/api$/, '');
      const IS_PROD = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.PROD) ? true : false;
      const healthUrl = IS_PROD ? `${devRoot}/health` : '/health';
      const res = await fetch(healthUrl, { method: 'GET', cache: 'no-store', signal: controller.signal });
      clearTimeout(id);
      return res.ok;
    } catch (e) {
      return false;
    }
  };

  const createConnection = async (companyId?: string | null, surveyId?: string | null, onEvent?: Handler, onStatus?: StatusHandler) => {
    if (!mountedRef.current) return;
    if (onStatus) onStatus('connecting');
    try { console.debug && console.debug('[useSSE] createConnection', { companyId, surveyId, retry: retryRef.current }); } catch (e) {}

    const devRoot = API_BASE_URL.replace(/\/api$/, '');
    const IS_PROD = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.PROD) ? true : false;

    const alive = await checkBackendAlive(2500);
    try { console.debug && console.debug('[useSSE] backend alive check', { alive }); } catch (e) {}
    if (!alive) {
      if (onStatus) onStatus('unavailable', 'Backend not reachable');
      retryRef.current = Math.min(maxRetry, retryRef.current + 1);
      const delay = Math.min(30000, Math.pow(2, retryRef.current) * 1000 + Math.random() * 1000);
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      reconnectTimer.current = window.setTimeout(() => { createConnection(companyId, surveyId, onEvent, onStatus); }, delay) as unknown as number;
      return;
    }

    const params: string[] = [];
    if (companyId) params.push(`companyId=${encodeURIComponent(companyId)}`);
    if (surveyId) params.push(`surveyId=${encodeURIComponent(surveyId)}`);

    const token = await resolveToken(companyId);
    try { console.debug && console.debug('[useSSE] resolved token', { hasToken: !!token }); } catch (e) {}
    // In production, require token
    if (IS_PROD && !token) {
      if (onStatus) onStatus('error', 'SSE requires authentication in production');
      return;
    }

    let url = IS_PROD ? `${devRoot}/sse` : '/sse';
    if (params.length) url += `?${params.join('&')}`;
    if (token) url += (params.length ? '&' : '?') + `token=${encodeURIComponent(token)}`;

    try {
      try { if (esRef.current) { esRef.current.close(); esRef.current = null; } } catch (e) {}
      try { console.debug && console.debug('[useSSE] connecting EventSource', { url }); } catch (e) {}
      const es = new EventSource(url);
      esRef.current = es;

      const onOpen = () => {
        retryRef.current = 0;
        try { console.debug && console.debug('[useSSE] open', { url }); } catch (e) {}
        if (onStatus) onStatus('connected');
      };

      const onError = (ev: any) => {
        try { console.debug && console.debug('[useSSE] error', { ev, retry: retryRef.current }); } catch (e) {}
        try { es.close(); } catch (e) {}
        if (!mountedRef.current) return;
        if (onStatus) onStatus('error', 'SSE connection error');
        retryRef.current = Math.min(maxRetry, retryRef.current + 1);
        const delay = Math.min(30000, Math.pow(2, retryRef.current) * 1000 + Math.random() * 1000);
        if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
        reconnectTimer.current = window.setTimeout(() => { createConnection(companyId, surveyId, onEvent, onStatus); }, delay) as unknown as number;
      };

      if (onEvent) {
        es.addEventListener('response:created', onEvent);
        es.addEventListener('response', onEvent);
      }
      // Generic message listener for debugging (does not replace typed listeners)
      try {
        es.addEventListener('message', (m) => {
          try { console.debug && console.debug('[useSSE] message', { data: m && m.data }); } catch (e) {}
        });
      } catch (e) {}
      es.addEventListener('open', onOpen);
      es.addEventListener('error', onError);
    } catch (err) {
      retryRef.current = Math.min(maxRetry, retryRef.current + 1);
      const delay = Math.min(30000, Math.pow(2, retryRef.current) * 1000 + Math.random() * 1000);
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      reconnectTimer.current = window.setTimeout(() => { createConnection(companyId, surveyId, onEvent, onStatus); }, delay) as unknown as number;
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    const { companyId, surveyId, onEvent, onStatus } = opts;
    createConnection(companyId, surveyId, onEvent, onStatus);

    return () => {
      mountedRef.current = false;
      if (reconnectTimer.current) {
        window.clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      try {
        if (esRef.current) {
          if (opts.onEvent) {
            esRef.current.removeEventListener('response:created', opts.onEvent as EventListener);
            esRef.current.removeEventListener('response', opts.onEvent as EventListener);
          }
          esRef.current.close();
        }
      } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.companyId, opts.surveyId, opts.onEvent, opts.onStatus]);

  const reconnect = () => {
    try { if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current); } catch (e) {}
    try { if (esRef.current) { esRef.current.close(); esRef.current = null; } } catch (e) {}
    retryRef.current = 0;
    const { companyId, surveyId, onEvent, onStatus } = opts;
    // trigger immediate reconnect
    createConnection(companyId, surveyId, onEvent, onStatus);
  };

  return { reconnect };
}

