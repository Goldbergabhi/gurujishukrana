import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';
import { initProducer, produceResponseEvent } from './kafka/producer';
import { startConsumer } from './kafka/consumer';
import { subscribeSSE, publishEvent } from './sse';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);

// SSE client registry and publish helpers moved to `sse.ts`

// MongoDB setup
const MONGODB_URI = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || process.env.VITE_MONGODB_DATABASE || 'leap-survey';

let mongoClient: MongoClient | undefined;
let db: any; // may be a real Db or an in-memory fallback for dev
let useInMemoryDb = false;

async function connectMongo() {
  try {
    mongoClient = new MongoClient(MONGODB_URI, { connectTimeoutMS: 10000 });
    await mongoClient.connect();
    db = mongoClient.db(MONGODB_DB);
    console.log('Connected to MongoDB', MONGODB_URI, 'db=', MONGODB_DB);
    useInMemoryDb = false;
  } catch (err: any) {
    // Fallback to a lightweight in-memory store for local dev/testing when Mongo isn't available
    console.warn('Could not connect to MongoDB, falling back to in-memory DB for dev:', err && err.message ? err.message : err);
    useInMemoryDb = true;
    const store = new Map<string, any[]>();
    const getCollection = (name: string) => {
      if (!store.has(name)) store.set(name, []);
      return {
        insertOne: async (doc: any) => {
          const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
          const saved = { _id: id, ...doc };
          store.get(name)!.unshift(saved);
          return { insertedId: id };
        },
        find: (query: any = {}) => {
          const arr = store.get(name)!.slice();
          const results = arr.filter((d) => {
            for (const k of Object.keys(query)) {
              if (d[k] !== query[k]) return false;
            }
            return true;
          });
          return {
            sort: () => ({
              limit: (n: number) => ({ toArray: async () => results.slice(0, n) })
            })
          };
        }
      };
    };
    db = { collection: (name: string) => getCollection(name) };
  }
}

// Simple JWT auth middleware for API endpoints
function jwtAuthRequired(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Authorization header required' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as any;
    (req as any).auth = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// SSE subscribe endpoint (logic in sse.ts)
app.get('/sse', subscribeSSE);

// publishEvent is implemented in sse.ts and imported above

// API: submit a survey response
app.post('/api/responses', jwtAuthRequired, async (req, res) => {
  try {
    const payload = (req as any).auth as any;
    const { companyId, surveyId, respondentId, answers } = req.body;
    if (!companyId || !surveyId || !answers) return res.status(400).json({ error: 'companyId, surveyId and answers required' });
    if (String(payload.companyId) !== String(companyId)) return res.status(403).json({ error: 'Token not valid for companyId' });

    const responses = db.collection('responses');
    const doc = { companyId: String(companyId), surveyId: String(surveyId), respondentId: respondentId || null, answers, createdAt: new Date() };
    const result = await responses.insertOne(doc);
    const saved = { _id: result.insertedId, ...doc };

    // publish to SSE clients
    publishEvent('response:created', { response: saved, companyId, surveyId });

    // produce to Kafka (fire-and-forget)
    try {
      await produceResponseEvent(companyId, surveyId, saved);
    } catch (err) {
      console.error('Kafka produce error', err);
    }

    return res.json({ ok: true, response: saved });
  } catch (err: any) {
    console.error('POST /api/responses error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

// API: fetch responses
app.get('/api/responses', async (req, res) => {
  try {
    const { companyId, surveyId, limit = '100' } = req.query;
    if (!companyId) return res.status(400).json({ error: 'companyId required' });
    const responses = db.collection('responses');
    const q: any = { companyId: String(companyId) };
    if (surveyId) q.surveyId = String(surveyId);
    const docs = await responses.find(q).sort({ createdAt: -1 }).limit(Number(limit)).toArray();
    return res.json({ ok: true, responses: docs });
  } catch (err: any) {
    console.error('GET /api/responses error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

// Simple health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = Number(process.env.PORT || 4000);

async function start() {
  await connectMongo();
  // initialize kafka producer and start consumer
  try {
    await initProducer();
    startConsumer().catch((err) => console.error('Kafka consumer failed', err));
  } catch (err) {
    console.warn('Kafka not initialized:', err);
  }
  if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => console.log(`SSE + Mongo server listening on ${PORT}`));
  }
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

// graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  try { await mongoClient?.close(); } catch (e) {}
  server.close(() => process.exit(0));
});

export { app, server };