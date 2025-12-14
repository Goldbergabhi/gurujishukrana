import express from 'express';

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
  ssePingInterval = setInterval(() => {
    sseClients.forEach((list) => {
      list.forEach((client) => {
        try {
          client.res.write(': ping\n\n');
        } catch (e: any) {
          // ignore per-client write errors
        }
      });
    });
  }, 20000);
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
  const token = (req.query.token as string) || (req.headers.authorization && String(req.headers.authorization).startsWith('Bearer ') ? String(req.headers.authorization).split(' ')[1] : undefined);
  let companyId: string | undefined = undefined;
  let surveyId: string | undefined = undefined;
  if (token) {
    // token parsing is handled by index.ts; here we accept companyId query as fallback
    try {
      // do nothing here; index may have already validated
    } catch (err) {}
  }
  if (!companyId && req.query.companyId) companyId = String(req.query.companyId);
  if (req.query.surveyId) surveyId = String(req.query.surveyId);

  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': '*',
  });

  res.flushHeaders?.();

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const client: SSEClient = { id, companyId, surveyId, res };
  const key = companyId || '__all__';
  const arr = sseClients.get(key) || [];
  arr.push(client);
  sseClients.set(key, arr);
  // start keepalive pings
  startSsePing();

  res.write(':connected\n\n');

  req.on('close', () => {
    const list = sseClients.get(key) || [];
    sseClients.set(key, list.filter((c) => c.id !== id));
    stopSsePingIfIdle();
  });
}

export function publishEvent(event: string, data: any) {
  const companyKey = data.companyId ? String(data.companyId) : '__all__';
  const targets = (sseClients.get(companyKey) || []).concat(sseClients.get('__all__') || []);
  const text = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
  targets.forEach((client) => {
    try {
      if (client.surveyId && data.surveyId && String(client.surveyId) !== String(data.surveyId)) return;
      client.res.write(text);
    } catch (err: any) {
      // ignore
    }
  });
}
