import express from 'express';
import jwt from 'jsonwebtoken';

type SSEClient = {
  id: string;
  companyId?: string;
  surveyId?: string;
  res: express.Response;
};

const sseClients = new Map<string, SSEClient[]>();
let ssePingInterval: NodeJS.Timeout | null = null;

function startSsePing() {
  if (ssePingInterval) return;
  // heartbeat every ~8s to keep connections alive through proxies
  ssePingInterval = setInterval(() => {
    sseClients.forEach((list, key) => {
      for (let i = list.length - 1; i >= 0; i--) {
        const client = list[i];
        try {
          client.res.write(': heartbeat\n\n');
        } catch (e: any) {
          // remove clients that are no longer writable
          try { list.splice(i, 1); } catch (e2) { /* ignore */ }
        }
      }
      if (!list || list.length === 0) sseClients.delete(key);
    });
  }, 8000);
}

function stopSsePingIfIdle() {
  let any = false;
  sseClients.forEach((list) => { if (list && list.length > 0) any = true; });
  if (!any && ssePingInterval) {
    clearInterval(ssePingInterval);
    ssePingInterval = null;
  }
}

export function subscribeSSE(req: express.Request, res: express.Response) {
  try {
    const token = (req.query.token as string) || (req.headers.authorization && String(req.headers.authorization).startsWith('Bearer ') ? String(req.headers.authorization).split(' ')[1] : undefined);
    let companyId: string | undefined = undefined;
    let surveyId: string | undefined = undefined;

    let payload: any = undefined;
    if (token) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('SSE token verify failed: JWT_SECRET missing');
        // Respond as SSE error to avoid proxy JSON/HTTP errors
        res.writeHead(200, {
          Connection: 'keep-alive',
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
          'Access-Control-Allow-Origin': (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : '*'),
        });
        res.write(`event: error\ndata: Server misconfigured: JWT_SECRET not set\n\n`);
        res.end();
        return;
      }
      try {
        payload = jwt.verify(token, secret) as any;
      } catch (err: any) {
        console.warn('SSE token invalid', { err: String(err?.message || err), ip: req.ip, origin: req.headers.origin });
        if (process.env.NODE_ENV !== 'development') {
          res.writeHead(200, {
            Connection: 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Access-Control-Allow-Origin': (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : '*'),
          });
          res.write(`event: error\ndata: Invalid token\n\n`);
          res.end();
          return;
        }
      }
    } else {
      // no token provided
      if (process.env.NODE_ENV !== 'development') {
        console.warn('SSE connect rejected: missing token', { ip: req.ip, origin: req.headers.origin, query: req.query });
        res.writeHead(200, {
          Connection: 'keep-alive',
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
          'Access-Control-Allow-Origin': (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : '*'),
        });
        res.write(`event: error\ndata: Authentication required\n\n`);
        res.end();
        return;
      }
    }

    if (!companyId && payload && payload.companyId) companyId = String(payload.companyId);
    if (!companyId && req.query.companyId) companyId = String(req.query.companyId);
    if (req.query.surveyId) surveyId = String(req.query.surveyId);

    // enforce connection limits
    const SSE_MAX_TOTAL = Number(process.env.SSE_MAX_TOTAL_CLIENTS || '1000');
    const SSE_MAX_PER_COMPANY = Number(process.env.SSE_MAX_CLIENTS_PER_COMPANY || '200');
    const totalClients = Array.from(sseClients.values()).reduce((acc, v) => acc + (v?.length || 0), 0);
    if (totalClients >= SSE_MAX_TOTAL) {
      // respond as SSE error so proxy doesn't receive JSON/HTTP error
      res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : '*'),
      });
      res.write(`event: error\ndata: SSE server overloaded\n\n`);
      res.end();
      return;
    }

    const key = companyId || '__all__';
    const arr = sseClients.get(key) || [];
    if (arr.length >= SSE_MAX_PER_COMPANY) {
      res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : '*'),
      });
      res.write(`event: error\ndata: Too many SSE connections for this company\n\n`);
      res.end();
      return;
    }

    // OK — prepare the response headers for SSE
    res.writeHead(200, {
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : '*'),
    });

    res.flushHeaders?.();

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const client: SSEClient = { id, companyId, surveyId, res };
    arr.push(client);
    sseClients.set(key, arr);
    // start keepalive pings
    startSsePing();

    // initial connected comment
    try { res.write(':connected\n\n'); } catch (e) { /* ignore */ }

    req.on('close', () => {
      try {
        const list = sseClients.get(key) || [];
        sseClients.set(key, list.filter((c) => c.id !== id));
        stopSsePingIfIdle();
      } catch (e) { /* ignore */ }
    });
  } catch (err: any) {
    console.error('Unhandled error in subscribeSSE', err);
    try {
      if (!res.headersSent) {
        res.writeHead(200, {
          Connection: 'keep-alive',
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-Accel-Buffering': 'no',
          'Access-Control-Allow-Origin': (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : '*'),
        });
        res.write(`event: error\ndata: Internal server error\n\n`);
        // we couldn't start the stream; close
        res.end();
      } else {
        // headers already sent — emit an SSE-formatted error but keep the connection open
        try { res.write(`event: error\ndata: Internal server error\n\n`); } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }
  }
}

export function publishEvent(event: string, data: any) {
  const companyKey = data.companyId ? String(data.companyId) : '__all__';
  const targets = (sseClients.get(companyKey) || []).concat(sseClients.get('__all__') || []);
  const text = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
  for (let i = targets.length - 1; i >= 0; i--) {
    const client = targets[i];
    try {
      if (client.surveyId && data.surveyId && String(client.surveyId) !== String(data.surveyId)) continue;
      client.res.write(text);
    } catch (err: any) {
      // remove clients that can't be written to anymore
      try {
        const key = client.companyId || '__all__';
        const list = sseClients.get(key) || [];
        const idx = list.findIndex((c) => c.id === client.id);
        if (idx >= 0) list.splice(idx, 1);
        if (list.length === 0) sseClients.delete(key);
      } catch (e) { /* ignore */ }
    }
  }
}
