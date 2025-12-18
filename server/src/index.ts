import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';
// Kafka producer/consumer are optional for local dev. Provide safe stubs
// so the TypeScript server builds/runs when Kafka modules are not present.
let initProducer: () => Promise<void> = async () => { return; };
let produceResponseEvent: (companyId: string, surveyId: string, saved: any) => Promise<void> = async () => { return; };
let startConsumer: () => Promise<void> = async () => { return; };
// Kafka removed: no runtime producer/consumer in this build (calls are no-ops)
import { subscribeSSE, publishEvent } from './sse';
// per-route rate limits
const responseLimiter = rateLimit({ windowMs: 60 * 1000, max: Number(process.env.RESPONSES_PER_MINUTE || '60') });

dotenv.config();

const app = express();
app.use(bodyParser.json());
// In dev, behind Vite proxy, trust the proxy headers so rate-limit can use X-Forwarded-* safely
if (process.env.NODE_ENV === 'development') {
  app.set('trust proxy', true);
}
// Security: apply helmet and guarded CORS. ALLOWED_ORIGINS can be a comma-separated list.
app.use(helmet());
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean) : [];
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('JWT_SECRET is required in production');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production' && ALLOWED_ORIGINS.length === 0) {
  console.error('ALLOWED_ORIGINS must be set in production to restrict CORS');
  process.exit(1);
}

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
} else {
  app.use(cors({
    origin: (origin, callback) => {
      // allow non-browser tools with no origin header only when explicitly configured
      if (!origin) return callback(null, false);
      if (ALLOWED_ORIGINS.length === 0) return callback(new Error('CORS not configured'), false);
      return ALLOWED_ORIGINS.includes(origin) ? callback(null, true) : callback(new Error('Not allowed by CORS'), false);
    }
  }));
}

// Basic rate limiting (skip /sse to avoid interfering with long-lived connections)
const generalLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 1000 }); // 1000 requests per 10 minutes
app.use((req, res, next) => {
  if (req.path === '/sse') return next();
  return generalLimiter(req as any, res as any, next as any);
});

const server = http.createServer(app);

// SSE client registry and publish helpers moved to `sse.ts`

// MongoDB setup
const MONGODB_URI = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || process.env.VITE_MONGODB_DATABASE || 'leap-survey';

// Log DB config at startup to help debugging (remove or secure in production)
console.log('MONGODB_URI=', MONGODB_URI ? '[REDACTED]' : null, '  MONGODB_DB=', MONGODB_DB);

let mongoClient: MongoClient | undefined;
let db: any; // may be a real Db or an in-memory fallback for dev
let useInMemoryDb = false;
let mongoChangeStream: any = null;

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
    // Try spinning up an embedded MongoDB for local dev using mongodb-memory-server
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { MongoMemoryServer } = require('mongodb-memory-server');
      console.log('Starting embedded MongoDB (mongodb-memory-server) for local development...');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      mongoClient = new MongoClient(memUri, { connectTimeoutMS: 10000 });
      await mongoClient.connect();
      db = mongoClient.db(MONGODB_DB);
      useInMemoryDb = false;
      console.log('Connected to embedded MongoDB');
    } catch (memErr) {
      // If embedded Mongo isn't available, fallback to the lightweight Map store
      useInMemoryDb = true;
      const store = new Map<string, any[]>();
      const getCollection = (name: string) => {
        if (!store.has(name)) store.set(name, []);
        const coll = {
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
          },
          // basic findOne implementation
          findOne: async (query: any = {}) => {
            const arr = store.get(name)!.slice();
            for (const d of arr) {
              let ok = true;
              for (const k of Object.keys(query)) {
                if (d[k] !== query[k]) { ok = false; break; }
              }
              if (ok) return d;
            }
            return null;
          },
          // basic updateOne supporting $inc and $set for aggregates materialized store
          updateOne: async (query: any, update: any, opts?: any) => {
            let doc = await coll.findOne(query);
            if (!doc && opts && opts.upsert) {
              doc = { ...query };
              store.get(name)!.unshift(doc);
            }
            if (!doc) return { matchedCount: 0, modifiedCount: 0 };
            if (update.$inc) {
              for (const [k, v] of Object.entries(update.$inc)) {
                // support nested keys like 'questions.qid.count'
                const parts = (k as string).split('.');
                let target: any = doc;
                for (let i = 0; i < parts.length - 1; i++) {
                  const p = parts[i];
                  if (typeof target[p] === 'undefined') target[p] = {};
                  target = target[p];
                }
                const last = parts[parts.length - 1];
                target[last] = (Number(target[last] || 0) + Number(v));
              }
            }
            if (update.$set) {
              for (const [k, v] of Object.entries(update.$set)) {
                const parts = (k as string).split('.');
                let target: any = doc;
                for (let i = 0; i < parts.length - 1; i++) {
                  const p = parts[i];
                  if (typeof target[p] === 'undefined') target[p] = {};
                  target = target[p];
                }
                const last = parts[parts.length - 1];
                target[last] = v;
              }
            }
            return { matchedCount: 1, modifiedCount: 1 };
          },
          countDocuments: async (q: any = {}) => {
            const arr = store.get(name)!.slice();
            if (!q || Object.keys(q).length === 0) return arr.length;
            return arr.filter((d) => {
              for (const k of Object.keys(q)) if (d[k] !== q[k]) return false;
              return true;
            }).length;
          },
          createIndex: async () => { /* noop for in-memory */ }
        };
        return coll;
      };
      db = { collection: (name: string) => getCollection(name) };
      console.warn('mongodb-memory-server not available; using lightweight in-memory store (not persisted)');
    }
  }
}

// Redis/pubsub removed — SSE will be used for cross-instance notifications

// Simple JWT auth middleware for API endpoints
function jwtAuthRequired(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Authorization header required' });
  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET not set' });
  try {
    const payload = jwt.verify(token, secret) as any;
    (req as any).auth = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function adminRequired(req: express.Request, res: express.Response, next: express.NextFunction) {
  const payload = (req as any).auth as any;
  if (!payload || !payload.isAdmin) return res.status(403).json({ error: 'admin role required' });
  return next();
}

// SSE subscribe endpoint (logic in sse.ts)
app.get('/sse', subscribeSSE);

// publishEvent is implemented in sse.ts and imported above

// Debug endpoint (development only) - report whether connected to MongoDB and collection counts
app.get('/api/debug/db', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'debug endpoint disabled in production' });
  try {
    const info: any = { useInMemoryDb, dbName: MONGODB_DB };
    if (!useInMemoryDb && db) {
      try {
        // list collections and counts
        const cols = await db.listCollections().toArray();
        const counts: Record<string, number> = {};
        for (const c of cols) {
          try {
            counts[c.name] = await db.collection(c.name).countDocuments();
          } catch (innerErr) {
            counts[c.name] = -1;
          }
        }
        info.collections = counts;
      } catch (e: any) {
        info.collectionsError = String((e as any)?.message || e);
      }
    } else {
      info.collections = useInMemoryDb ? 'in-memory-store (not persisted)' : 'db not initialized';
    }
    return res.json({ ok: true, info });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

// Dev-only: return raw responses and aggregates documents for a company+survey
app.get('/api/debug/collections', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'debug endpoint disabled in production' });
    const { companyId, surveyId } = req.query;
    if (!companyId || !surveyId) return res.status(400).json({ error: 'companyId and surveyId required' });
    const responsesColl = db.collection('responses');
    const aggregatesColl = db.collection('aggregates');
    let responsesDocs: any[] = [];
    try {
      responsesDocs = await responsesColl.find({ companyId: String(companyId), surveyId: String(surveyId) }).sort({ createdAt: -1 }).limit(1000).toArray();
    } catch (e: any) {
      // try fallback for in-memory find
      try {
        const q = responsesColl.find({ companyId: String(companyId), surveyId: String(surveyId) });
        responsesDocs = await (q.sort ? q.sort({ createdAt: -1 }).limit(1000).toArray() : q.toArray());
      } catch (e2) { responsesDocs = []; }
    }
    let aggDoc: any = null;
    try {
      if (typeof aggregatesColl.findOne === 'function') aggDoc = await aggregatesColl.findOne({ companyId: String(companyId), surveyId: String(surveyId) });
    } catch (e: any) { aggDoc = null; }
    return res.json({ ok: true, responses: responsesDocs, aggregate: aggDoc });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

// API: submit a survey response
app.post('/api/responses', responseLimiter, async (req, res) => {
  try {
    // Support multiple request shapes for backward compatibility:
    // 1) { companyId, surveyId, respondentId, answers }
    // 2) { surveyId, module, responses, metadata }
    let { companyId, surveyId, respondentId, answers } = req.body || {};

    // If the client sent the modern frontend shape, map it to legacy fields
    if (!answers && req.body && req.body.responses) {
      answers = req.body.responses;
      if (!surveyId && req.body.surveyId) surveyId = req.body.surveyId;
      if (!respondentId && req.body.metadata && req.body.metadata.userId) respondentId = req.body.metadata.userId;
      if (!companyId && req.body.metadata && req.body.metadata.companyId) companyId = req.body.metadata.companyId;
    }

    // Allow companyId to be provided via query param when no auth is used
    if (!companyId && req.query && req.query.companyId) companyId = String(req.query.companyId);

    if (!companyId || !surveyId || !answers) return res.status(400).json({ error: 'companyId, surveyId and answers required' });

    const responses = db.collection('responses');
    const now = new Date();
    const doc = { companyId: String(companyId), surveyId: String(surveyId), respondentId: respondentId || null, answers, createdAt: now };
    const result = await responses.insertOne(doc);

    // Update materialized aggregates collection (upsert per company+survey)
    try {
      const aggregates = db.collection('aggregates');
      const key = { companyId: String(companyId), surveyId: String(surveyId) };
      const incs: any = { responseCount: 1 };
      // answers expected to be an object mapping questionId -> numeric value OR an array of {questionId, answer}
      if (Array.isArray(answers)) {
        answers.forEach((a: any) => {
          const qid = String(a.questionId);
          const val = Number(a.answer || 0);
          if (!Number.isFinite(val)) return;
          incs[`questions.${qid}.count`] = (incs[`questions.${qid}.count`] || 0) + 1;
          incs[`questions.${qid}.sum`] = (incs[`questions.${qid}.sum`] || 0) + val;
          const prefix = qid.split('-')[0];
          const threshold = (prefix === 'ee' || prefix === 'employee') ? 7 : 4;
          if (val >= threshold) {
            incs[`questions.${qid}.positiveCount`] = (incs[`questions.${qid}.positiveCount`] || 0) + 1;
          }
        });
      } else if (answers && typeof answers === 'object') {
        Object.entries(answers).forEach(([qid, raw]) => {
          const val = Number(raw);
          if (!Number.isFinite(val)) return;
          incs[`questions.${qid}.count`] = (incs[`questions.${qid}.count`] || 0) + 1;
          incs[`questions.${qid}.sum`] = (incs[`questions.${qid}.sum`] || 0) + val;
          const prefix = String(qid).split('-')[0];
          const threshold = (prefix === 'ee' || prefix === 'employee') ? 7 : 4;
          if (val >= threshold) {
            incs[`questions.${qid}.positiveCount`] = (incs[`questions.${qid}.positiveCount`] || 0) + 1;
          }
        });
      }
      const update: any = { $inc: incs, $set: { lastUpdated: now } };
      await aggregates.updateOne(key, update, { upsert: true });
      // Read back the updated buckets for affected questions and compute exact positivePercentage
      try {
        const updated = await aggregates.findOne(key as any);
        const qBuckets = (updated && updated.questions) ? updated.questions : {};
        const affectedQids = Array.isArray(answers) ? answers.map((a: any) => String(a.questionId)) : Object.keys(answers || {});
        const setObj: any = {};
        affectedQids.forEach((qid: string) => {
          const q = qBuckets[qid];
          if (q && q.count > 0) {
            const pct = Math.round(((Number(q.positiveCount || 0) / Number(q.count)) * 100 + Number.EPSILON) * 10) / 10;
            setObj[`questions.${qid}.positivePercentage`] = pct;
          }
        });
        if (Object.keys(setObj).length > 0) {
          await aggregates.updateOne(key, { $set: setObj });
        }

        // Compute and persist summaryMetrics for quick reads: positiveAverage, totalQuestions, responseCount, medianQuestionScore, topDemographic
        try {
          const updated2 = await aggregates.findOne(key as any);
          const buckets = (updated2 && updated2.questions) ? updated2.questions : {};
          const responseCount = Number(updated2?.responseCount || 0);
          const perQuestion = Object.entries(buckets).map(([qid, stats]: any) => {
            const cnt = Number(stats.count || 0);
            const sum = Number(stats.sum || 0);
            const avg = cnt > 0 ? (sum / cnt) : 0;
            const positivePct = Number(stats.positivePercentage || 0);
            return { qid, avg, positivePct, cnt };
          });
          const totalQuestions = perQuestion.length;
          // median of question averages
          const sortedAvgs = perQuestion.map(p => p.avg).sort((a, b) => a - b);
          let medianQuestionScore = 0;
          if (sortedAvgs.length > 0) {
            const mid = Math.floor(sortedAvgs.length / 2);
            medianQuestionScore = sortedAvgs.length % 2 === 1 ? sortedAvgs[mid] : (sortedAvgs[mid - 1] + sortedAvgs[mid]) / 2;
            medianQuestionScore = Math.round((medianQuestionScore + Number.EPSILON) * 10) / 10;
          }

          // Attempt to compute topDemographic by scanning recent responses for demographic fields
          let topDemographic: any = null;
          try {
            const respDocs = await responses.find(key).limit(1000).toArray();
            const demCounts: Record<string, number> = {};
            respDocs.forEach((d: any) => {
              if (d.demographics && typeof d.demographics === 'object') {
                Object.values(d.demographics).forEach((v: any) => {
                  if (!v) return;
                  const name = String(v);
                  demCounts[name] = (demCounts[name] || 0) + 1;
                });
              } else if (d.answers && typeof d.answers === 'object') {
                Object.entries(d.answers).forEach(([k, v]: any) => {
                  if (k.startsWith('dem-') || k.startsWith('dept') || k.toLowerCase().includes('department') || k.toLowerCase().includes('team')) {
                    if (!v) return;
                    const name = String(v);
                    demCounts[name] = (demCounts[name] || 0) + 1;
                  }
                });
              }
            });
            const entries = Object.entries(demCounts);
            if (entries.length > 0) {
              entries.sort((a, b) => b[1] - a[1]);
              const [group, count] = entries[0];
              topDemographic = { group, count, pct: responseCount > 0 ? Math.round((count / responseCount) * 100) : 0 };
            }
          } catch (demErr) {
            console.warn('failed to compute topDemographic', demErr);
          }

          const summaryMetrics = {
            positiveAverage: perQuestion.length > 0 ? Math.round((perQuestion.reduce((s: number, p: any) => s + (Number(p.positivePct) || 0), 0) / perQuestion.length + Number.EPSILON) * 10) / 10 : 0,
            totalQuestions,
            responseCount,
            medianQuestionScore,
            topDemographic
          };
          await aggregates.updateOne(key, { $set: { summaryMetrics } });
        } catch (sErr) {
          console.warn('failed to compute/store summaryMetrics', sErr);
        }
      } catch (pctErr) {
        console.warn('failed to compute positivePercentage for aggregates', pctErr);
      }
    } catch (aggErr) {
      console.warn('could not update aggregates materialized store', aggErr);
    }

    // publish to SSE clients (aggregated event only)
    publishEvent('response:created', { companyId, surveyId, timestamp: now.toISOString() });

    // Kafka disabled in this build — no-op for event production

    // Return only a minimal acknowledgement to avoid echoing respondent-level data
    return res.json({ ok: true, insertedId: result.insertedId });
  } catch (err: any) {
    console.error('POST /api/responses error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

// Development helper: issue a short-lived dev JWT for a company (only when not in production)
app.get('/api/dev-token', (req, res) => {
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_DEV_TOKEN !== 'true') return res.status(403).json({ error: 'dev token endpoint disabled' });
  const { companyId, isAdmin } = req.query;
  if (!companyId) return res.status(400).json({ error: 'companyId query parameter required' });
  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET not set' });
  try {
    const payload = { companyId: String(companyId), isAdmin: String(isAdmin) === 'true' };
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });
    return res.json({ ok: true, token });
  } catch (err: any) {
    console.error('Failed to create dev token', err);
    return res.status(500).json({ error: 'failed to create token' });
  }
});

// API: fetch responses
// Raw responses endpoint: restricted to admin users only. Company users should use /api/aggregates.
app.get('/api/responses', jwtAuthRequired, adminRequired, async (req, res) => {
  try {
    const { companyId, surveyId, limit = '100' } = req.query;
    const responses = db.collection('responses');
    const q: any = {};
    if (companyId) q.companyId = String(companyId);
    if (surveyId) q.surveyId = String(surveyId);
    const docs = await responses.find(q).sort({ createdAt: -1 }).limit(Number(limit)).toArray();
    return res.json({ ok: true, responses: docs });
  } catch (err: any) {
    console.error('GET /api/responses error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

// API: fetch aggregated metrics (company-level, no respondent PII)

// Shared helper: compute modules analytics from aggregates doc or raw responses
async function computeAggregates(key: any, aggDoc?: any) {
  // Helper to build module shapes from question sums/counts
  const buildModulesFromQuestionBuckets = (questionBuckets: Record<string, any>, responseCount: number) => {
    const modules = {
      'ai-readiness': { questionScores: [], sectionData: [], summaryMetrics: { positiveAverage: 0, totalQuestions: 0, responseCount, trend: 0 } },
      'leadership': { questionScores: [], sectionData: [], summaryMetrics: { positiveAverage: 0, totalQuestions: 0, responseCount, trend: 0 } },
      'employee-experience': { questionScores: [], sectionData: [], summaryMetrics: { positiveAverage: 0, totalQuestions: 0, responseCount, trend: 0 } }
    } as any;
    Object.entries(questionBuckets || {}).forEach(([qid, stats]: any) => {
      const cnt = stats.count || 0;
      const sum = stats.sum || 0;
      if (cnt <= 0) return;
      const avg = sum / cnt;
      const prefix = String(qid).split('-')[0];
      const threshold = prefix === 'ee' || prefix === 'employee' ? 7 : 4;
      const positivePct = Math.round(((Array.isArray(stats.positiveCount) ? (stats.positiveCount[0] || 0) : (stats.positiveCount || 0)) / cnt) * 100 * 10) / 10 || (avg >= threshold ? 100 : 0);
      const q = { questionId: qid, average: avg, positivePercentage: positivePct };
      if (qid.startsWith('ai-')) modules['ai-readiness'].questionScores.push(q);
      else if (qid.startsWith('leadership-')) modules['leadership'].questionScores.push(q);
      else if (qid.startsWith('ee-') || qid.startsWith('employee')) modules['employee-experience'].questionScores.push(q);
    });

    Object.keys(modules).forEach((modKey) => {
      const qlist = modules[modKey].questionScores;
      modules[modKey].summaryMetrics.totalQuestions = qlist.length;
      if (qlist.length > 0) {
        const avgPos = qlist.reduce((acc: number, q: any) => acc + (q.positivePercentage || 0), 0) / qlist.length;
        modules[modKey].summaryMetrics.positiveAverage = Math.round((avgPos + Number.EPSILON) * 10) / 10;
      } else modules[modKey].summaryMetrics.positiveAverage = 0;
    });
    return modules;
  };

  // If materialized aggregates provided, use them
  if (aggDoc) {
    const modules = buildModulesFromQuestionBuckets(aggDoc.questions || {}, aggDoc.responseCount || 0);
    // compute median per module and attach topDemographic if possible
    try {
      Object.keys(modules).forEach((modKey) => {
        const qlist = modules[modKey].questionScores || [];
        const avgs = qlist.map((q: any) => q.average).sort((a: number, b: number) => a - b);
        let median = 0;
        if (avgs.length > 0) {
          const mid = Math.floor(avgs.length / 2);
          median = avgs.length % 2 === 1 ? avgs[mid] : (avgs[mid - 1] + avgs[mid]) / 2;
          median = Math.round((median + Number.EPSILON) * 10) / 10;
        }
        modules[modKey].summaryMetrics = modules[modKey].summaryMetrics || {};
        modules[modKey].summaryMetrics.medianQuestionScore = median;
      });

      // attach topDemographic from recent responses
      try {
        const responsesColl = db.collection('responses');
        const respDocs = await responsesColl.find(key).limit(1000).toArray();
        const demCounts: Record<string, number> = {};
        respDocs.forEach((d: any) => {
          if (d.demographics && typeof d.demographics === 'object') {
            Object.values(d.demographics).forEach((v: any) => {
              if (!v) return;
              demCounts[String(v)] = (demCounts[String(v)] || 0) + 1;
            });
          } else if (d.answers && typeof d.answers === 'object') {
            Object.entries(d.answers).forEach(([k, v]: any) => {
              if (k.startsWith('dem-') || k.startsWith('dept') || k.toLowerCase().includes('department') || k.toLowerCase().includes('team')) {
                if (!v) return;
                demCounts[String(v)] = (demCounts[String(v)] || 0) + 1;
              }
            });
          }
        });
        const entries = Object.entries(demCounts);
        let topDemographic: any = null;
        if (entries.length > 0) {
          entries.sort((a, b) => b[1] - a[1]);
          const [group, count] = entries[0];
          topDemographic = { group, count, pct: (aggDoc.responseCount ? Math.round((count / aggDoc.responseCount) * 100) : 0) };
        }
        if (topDemographic) {
          Object.keys(modules).forEach((modKey) => {
            modules[modKey].summaryMetrics = modules[modKey].summaryMetrics || {};
            modules[modKey].summaryMetrics.topDemographic = topDemographic;
          });
        }
      } catch (demErr: any) {
        console.warn('Could not compute topDemographic from responses', demErr);
      }
    } catch (e: any) {
      console.warn('Failed to enrich modules with median/topDemographic', e);
    }

    return modules;
  }

  // Otherwise compute from raw responses
  const responses = db.collection('responses');
  const q: any = {};
  if (key.companyId) q.companyId = String(key.companyId);
  if (key.surveyId) q.surveyId = String(key.surveyId);
  const docs = await responses.find(q).sort({ createdAt: -1 }).limit(10000).toArray();

  const questionStats: Record<string, { sum: number; count: number; positiveCount: number }> = {};
  let totalRespondents = 0;
  docs.forEach((doc: any) => {
    if (doc.answers && typeof doc.answers === 'object') {
      totalRespondents += 1;
      Object.entries(doc.answers).forEach(([qid, rawVal]) => {
        const val = typeof rawVal === 'number' ? rawVal : Number(rawVal);
        if (!Number.isFinite(val)) return;
        if (!questionStats[qid]) questionStats[qid] = { sum: 0, count: 0, positiveCount: 0 };
        questionStats[qid].sum += val;
        questionStats[qid].count += 1;
        const prefix = String(qid).split('-')[0];
        const threshold = prefix === 'ee' || prefix === 'employee' || prefix === 'ee' ? 7 : 4;
        if (val >= threshold) questionStats[qid].positiveCount += 1;
      });
    } else if (doc.question && typeof doc.response !== 'undefined') {
      const qid = doc.question;
      const val = typeof doc.response === 'number' ? doc.response : Number(doc.response);
      if (!Number.isFinite(val)) return;
      if (!questionStats[qid]) questionStats[qid] = { sum: 0, count: 0, positiveCount: 0 };
      questionStats[qid].sum += val;
      questionStats[qid].count += 1;
      const prefix = String(qid).split('-')[0];
      const threshold = prefix === 'ee' || prefix === 'employee' ? 7 : 4;
      if (val >= threshold) questionStats[qid].positiveCount += 1;
    }
  });

  const modules = {
    'ai-readiness': { questionScores: [], sectionData: [], summaryMetrics: { positiveAverage: 0, totalQuestions: 0, responseCount: totalRespondents, trend: 0 } },
    'leadership': { questionScores: [], sectionData: [], summaryMetrics: { positiveAverage: 0, totalQuestions: 0, responseCount: totalRespondents, trend: 0 } },
    'employee-experience': { questionScores: [], sectionData: [], summaryMetrics: { positiveAverage: 0, totalQuestions: 0, responseCount: totalRespondents, trend: 0 } }
  } as any;

  Object.entries(questionStats).forEach(([qid, stats]) => {
    const avg = stats.sum / stats.count;
    const positivePct = stats.count > 0 ? (stats.positiveCount / stats.count) * 100 : 0;
    if (qid.startsWith('ai-')) {
      modules['ai-readiness'].questionScores.push({ questionId: qid, average: avg, positivePercentage: Math.round(positivePct * 10) / 10 });
    } else if (qid.startsWith('leadership-')) {
      modules['leadership'].questionScores.push({ questionId: qid, average: avg, positivePercentage: Math.round(positivePct * 10) / 10 });
    } else if (qid.startsWith('ee-') || qid.startsWith('employee') || qid.startsWith('ee')) {
      modules['employee-experience'].questionScores.push({ questionId: qid, average: avg, positivePercentage: Math.round(positivePct * 10) / 10 });
    }
  });

  Object.keys(modules).forEach((modKey) => {
    const qlist = modules[modKey].questionScores;
    modules[modKey].summaryMetrics.totalQuestions = qlist.length;
    if (qlist.length > 0) {
      const avgPos = qlist.reduce((acc: number, q: any) => acc + (q.positivePercentage || 0), 0) / qlist.length;
      modules[modKey].summaryMetrics.positiveAverage = Math.round((avgPos + Number.EPSILON) * 10) / 10;
    } else {
      modules[modKey].summaryMetrics.positiveAverage = 0;
    }
  });

  try {
    Object.keys(modules).forEach((modKey) => {
      const qlist = modules[modKey].questionScores || [];
      const avgs = qlist.map((q: any) => q.average).sort((a: number, b: number) => a - b);
      let median = 0;
      if (avgs.length > 0) {
        const mid = Math.floor(avgs.length / 2);
        median = avgs.length % 2 === 1 ? avgs[mid] : (avgs[mid - 1] + avgs[mid]) / 2;
        median = Math.round((median + Number.EPSILON) * 10) / 10;
      }
      modules[modKey].summaryMetrics = modules[modKey].summaryMetrics || {};
      modules[modKey].summaryMetrics.medianQuestionScore = median;
    });

    const demCounts: Record<string, number> = {};
    docs.forEach((d: any) => {
      if (d.demographics && typeof d.demographics === 'object') {
        Object.values(d.demographics).forEach((v: any) => {
          if (!v) return;
          demCounts[String(v)] = (demCounts[String(v)] || 0) + 1;
        });
      } else if (d.answers && typeof d.answers === 'object') {
        Object.entries(d.answers).forEach(([k, v]: any) => {
          if (k.startsWith('dem-') || k.startsWith('dept') || k.toLowerCase().includes('department') || k.toLowerCase().includes('team')) {
            if (!v) return;
            demCounts[String(v)] = (demCounts[String(v)] || 0) + 1;
          }
        });
      }
    });
    const demEntries = Object.entries(demCounts);
    if (demEntries.length > 0) {
      demEntries.sort((a, b) => b[1] - a[1]);
      const [group, count] = demEntries[0];
      const topDemographic = { group, count, pct: totalRespondents > 0 ? Math.round((count / totalRespondents) * 100) : 0 };
      Object.keys(modules).forEach((modKey) => {
        modules[modKey].summaryMetrics = modules[modKey].summaryMetrics || {};
        modules[modKey].summaryMetrics.topDemographic = topDemographic;
      });
    }
  } catch (err2) {
    console.warn('Failed to compute fallback median/topDemographic', err2);
  }

  return modules;
}

app.get('/api/aggregates', async (req, res) => {
  try {
    const { companyId, surveyId } = req.query;
    const key: any = {};
    if (companyId) key.companyId = String(companyId);
    if (surveyId) key.surveyId = String(surveyId);

    const aggregatesColl = db.collection('aggregates');
    let aggDoc: any = null;
    try {
      if (Object.keys(key).length > 0) {
        aggDoc = await aggregatesColl.findOne(key as any);
      }
    } catch (e: any) {
      console.warn('aggregates collection not available or read failed', e);
    }

    const modules = await computeAggregates(key, aggDoc);
    return res.json({ ok: true, aggregates: modules });
  }
  catch (err: any) {
    console.error('GET /api/aggregates error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

// Module-specific analytics endpoints
app.get('/api/analytics/ai-readiness', async (req, res) => {
  try {
    const { companyId, surveyId } = req.query;
    const key: any = {};
    if (companyId) key.companyId = String(companyId);
    if (surveyId) key.surveyId = String(surveyId);
    const aggregatesColl = db.collection('aggregates');
    let aggDoc: any = null;
    try { if (Object.keys(key).length > 0) aggDoc = await aggregatesColl.findOne(key as any); } catch (e: any) { /* ignore */ }
    const modules = await computeAggregates(key, aggDoc);
    const mod = modules['ai-readiness'] || { questionScores: [], summaryMetrics: {} };
    return res.json({ ok: true, analytics: mod });
  } catch (err: any) {
    console.error('GET /api/analytics/ai-readiness error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

app.get('/api/analytics/leadership', async (req, res) => {
  try {
    const { companyId, surveyId } = req.query;
    const key: any = {};
    if (companyId) key.companyId = String(companyId);
    if (surveyId) key.surveyId = String(surveyId);
    const aggregatesColl = db.collection('aggregates');
    let aggDoc: any = null;
    try { if (Object.keys(key).length > 0) aggDoc = await aggregatesColl.findOne(key as any); } catch (e: any) { /* ignore */ }
    const modules = await computeAggregates(key, aggDoc);
    const mod = modules['leadership'] || { questionScores: [], summaryMetrics: {} };
    return res.json({ ok: true, analytics: mod });
  } catch (err: any) {
    console.error('GET /api/analytics/leadership error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

app.get('/api/analytics/employee-experience', async (req, res) => {
  try {
    const { companyId, surveyId } = req.query;
    const key: any = {};
    if (companyId) key.companyId = String(companyId);
    if (surveyId) key.surveyId = String(surveyId);
    const aggregatesColl = db.collection('aggregates');
    let aggDoc: any = null;
    try { if (Object.keys(key).length > 0) aggDoc = await aggregatesColl.findOne(key as any); } catch (e: any) { /* ignore */ }
    const modules = await computeAggregates(key, aggDoc);
    const mod = modules['employee-experience'] || { questionScores: [], summaryMetrics: {} };
    return res.json({ ok: true, analytics: mod });
  } catch (err: any) {
    console.error('GET /api/analytics/employee-experience error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

// Simple health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Campaigns / Survey management endpoints
// NOTE: These are intentionally permissive for dev — secure them before production (add auth/adminRequired)
app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = db.collection('campaigns');
    // Use limit before toArray to support in-memory fallback implementation
    const docs = await campaigns.find({}).sort({ createdDate: -1 }).limit(1000).toArray();
    return res.json({ ok: true, campaigns: docs });
  } catch (err: any) {
    console.error('GET /api/campaigns error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    const body = req.body;
    if (!body || !body.companyName) return res.status(400).json({ error: 'companyName required' });
    const campaigns = db.collection('campaigns');
    const created = { ...body, createdDate: new Date().toISOString(), status: body.status || 'active' };
    const result = await campaigns.insertOne(created);
    return res.json({ ok: true, insertedId: result.insertedId, campaign: created });
  } catch (err: any) {
    console.error('POST /api/campaigns error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const campaigns = db.collection('campaigns');
    const doc = await campaigns.findOne({ id } as any) || await campaigns.findOne({ _id: id } as any);
    if (!doc) return res.status(404).json({ error: 'not found' });
    return res.json({ ok: true, campaign: doc });
  } catch (err: any) {
    console.error('GET /api/campaigns/:id error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

app.put('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const campaigns = db.collection('campaigns');
    await campaigns.updateOne({ id } as any, { $set: updates });
    return res.json({ ok: true });
  } catch (err: any) {
    console.error('PUT /api/campaigns/:id error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const campaigns = db.collection('campaigns');
    await campaigns.deleteOne({ id } as any);
    return res.json({ ok: true });
  } catch (err: any) {
    console.error('DELETE /api/campaigns/:id error', err);
    return res.status(500).json({ error: err.message || 'internal server error' });
  }
});

const PORT = Number(process.env.PORT || 4001);

async function start() {
  await connectMongo();
  // Ensure indexes for performance on materialized aggregates and responses
  try {
    if (!useInMemoryDb && db && typeof db.collection === 'function') {
      const aggColl = db.collection('aggregates');
      if (aggColl && typeof aggColl.createIndex === 'function') {
        await aggColl.createIndex({ companyId: 1, surveyId: 1 });
      }
      const respColl = db.collection('responses');
      if (respColl && typeof respColl.createIndex === 'function') {
        await respColl.createIndex({ companyId: 1, surveyId: 1, createdAt: -1 });
      }
      console.log('Ensured DB indexes for aggregates and responses');
    } else {
      console.log('Skipping DB index creation: using in-memory fallback');
    }
  } catch (idxErr) {
    console.warn('Failed to ensure DB indexes:', idxErr);
  }
  // Redis removed: no cross-process pub/sub here

  // If MongoDB is available, attempt to open a change stream on the responses collection to forward inserts
  try {
    if (!useInMemoryDb && db && typeof db.collection === 'function') {
      try {
        const coll = db.collection('responses');
        mongoChangeStream = coll.watch([], { fullDocument: 'updateLookup' });
        mongoChangeStream.on('change', (change: any) => {
          try {
            const doc = change.fullDocument || null;
            const payload = { type: change.operationType, doc: doc ? { _id: doc._id, companyId: doc.companyId, surveyId: doc.surveyId, createdAt: doc.createdAt } : null };
            // Publish change events to SSE clients
            publishEvent('response:changed', payload);
          } catch (e: any) { console.warn('Error processing change stream event', e); }
        });
        mongoChangeStream.on('error', (err: any) => {
          console.warn('Mongo change stream error — disabling change stream', err && err.message);
          try { mongoChangeStream.close(); } catch (e: any) { }
          mongoChangeStream = null;
        });
        console.log('Mongo change stream established for responses collection');
      } catch (e: any) {
        console.warn('Could not open change stream (likely single-node Mongo). SSE will still work via app publish.');
      }
    }
  } catch (e: any) {
    console.warn('Failed to initialize change stream', e);
  }
  // Kafka disabled — no producer/consumer will be started in this build
  if (process.env.NODE_ENV !== 'test') {
    // Attempt to bind to PORT, but if already in use try subsequent ports
    const startPort = PORT;
    const maxAttempts = 10;
    let boundPort: number | null = null;
    for (let i = 0; i < maxAttempts; i++) {
      const tryPort = startPort + i;
      try {
        // eslint-disable-next-line no-await-in-loop
        await new Promise<void>((resolve, reject) => {
          const onError = (err: any) => {
            server.removeListener('listening', onListen);
            if (err && (err as any).code === 'EADDRINUSE') return reject(err);
            return reject(err);
          };
          const onListen = () => {
            server.removeListener('error', onError);
            return resolve();
          };
          server.once('error', onError);
          server.once('listening', onListen);
          server.listen(tryPort);
        });
        boundPort = tryPort;
        break;
      } catch (err: any) {
        if (err && err.code === 'EADDRINUSE') {
          console.warn(`Port ${tryPort} in use, trying next port`);
          // continue loop
          continue;
        }
        console.error('Failed to bind server', err);
        process.exit(1);
      }
    }
    if (!boundPort) {
      console.error(`Could not bind to a port in range ${startPort}-${startPort + maxAttempts - 1}`);
      process.exit(1);
    }
    console.log(`SSE + Mongo server listening on ${boundPort}`);
    // Write dev port file for dev tooling to pick up (optional)
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs');
      fs.writeFileSync('.dev_backend_port', String(boundPort), 'utf8');
    } catch (e) {
      // ignore
    }
  }
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

// graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  try { await mongoClient?.close(); } catch (e: any) {}
  server.close(() => process.exit(0));
});

export { app, server };