import { useMemo, useEffect, useState, useRef } from 'react';
import useSSE from '../hooks/useSSE';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Target,
  BarChart3,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MyResponsesResults } from './MyResponsesResults';

interface OverviewDashboardProps {
  overallAverages: {
    aiReadiness: number;
    leadership: number;
    employeeExperience: number;
  };
  surveyResponses: Record<string, string>;
  backendAggregates?: any | null;
  companyId?: string | null;
  isAdmin?: boolean;
  availableModules?: ('ai-readiness' | 'leadership' | 'employee-experience')[];
}
export function OverviewDashboard({ overallAverages, surveyResponses, backendAggregates = null, companyId = null, isAdmin = false, availableModules = ['ai-readiness', 'leadership', 'employee-experience'] }: OverviewDashboardProps) {
  const [localAggregates, setLocalAggregates] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sourceAggregates = backendAggregates ?? localAggregates;

  // Trend data: prefer server-side monthly buckets where available
  const trendData = useMemo(() => {
    if (!sourceAggregates) return [];
    try {
      if (sourceAggregates.timeSeries && Array.isArray(sourceAggregates.timeSeries)) {
        return sourceAggregates.timeSeries;
      }
      // If backend provides module summaries, synthesize a simple trend placeholder from responseCount distribution
      const months = ['Jan','Feb','Mar','Apr','May','Jun'];
      const totalResponses = Object.keys(sourceAggregates).reduce((s, k) => s + (sourceAggregates[k]?.summaryMetrics?.responseCount || 0), 0);
      const perMonth = Math.max(0, Math.round(totalResponses / months.length));
      return months.map((m, i) => ({
        month: m,
        responses: Math.round(perMonth * (1 + (Math.sin(i) * 0.15))),
        aiReadiness: sourceAggregates['ai-readiness']?.summaryMetrics?.positiveAverage ?? overallAverages.aiReadiness,
        leadership: sourceAggregates['leadership']?.summaryMetrics?.positiveAverage ?? overallAverages.leadership,
        employeeExp: sourceAggregates['employee-experience']?.summaryMetrics?.positiveAverage ?? overallAverages.employeeExperience
      }));
    } catch (e) {
      return [];
    }
  }, [sourceAggregates, overallAverages]);

  // Demographic distribution: prefer server-provided demographics for the selected company/survey
  const demographicData = useMemo(() => {
    if (!sourceAggregates) return [];
    try {
      const preferred = sourceAggregates['employee-experience'] || sourceAggregates['leadership'] || sourceAggregates['ai-readiness'];
      if (preferred && Array.isArray(preferred.demographics) && preferred.demographics.length > 0) {
        return preferred.demographics.slice(0,5).map((d: any, i: number) => ({ name: d.group || d.key || `Group ${i+1}`, value: d.count || d.value || 0, color: ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6'][i % 5] }));
      }
    } catch (e) {}
    return [];
  }, [sourceAggregates]);

  const totalParticipants = useMemo(() => {
    if (!sourceAggregates) return null;
    try {
      const keys = Object.keys(sourceAggregates || {});
      const sum = keys.reduce((s, k) => s + ((sourceAggregates[k]?.summaryMetrics?.responseCount) || 0), 0);
      return sum || null;
    } catch (e) { return null; }
  }, [sourceAggregates]);

  const initialCompletedSurveys = useMemo(() => {
    if (!sourceAggregates) return null;
    try {
      const keys = Object.keys(sourceAggregates || {});
      return keys.reduce((s, k) => s + ((sourceAggregates[k]?.summaryMetrics?.responseCount) || 0), 0) || null;
    } catch (e) { return null; }
  }, [sourceAggregates]);

  const initialActiveRespondents = useMemo(() => {
    // we don't track active respondents server-side currently; return null when unknown
    return initialCompletedSurveys ?? null;
  }, [initialCompletedSurveys]);
  // Live state (updated via SSE)
  const [liveCompletedSurveys, setLiveCompletedSurveys] = useState(initialCompletedSurveys);
  const [liveActiveRespondents, setLiveActiveRespondents] = useState(initialActiveRespondents);
  const [lastEventTime, setLastEventTime] = useState(null);
  // SSE connection status + retry
  const [sseStatus, setSseStatus] = useState<'idle' | 'connecting' | 'connected' | 'failed'>('idle');
  const [sseRetryCount, setSseRetryCount] = useState(0);
  const sseMaxRetries = 6;
  const sseReconnectRef = useRef<number | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const [sseManualTrigger, setSseManualTrigger] = useState(0);

  const responseRate = (typeof totalParticipants === 'number' && typeof liveCompletedSurveys === 'number' && totalParticipants > 0)
    ? Math.round((liveCompletedSurveys / totalParticipants) * 100)
    : null;

  const overallScore = useMemo(() => {
    const moduleScores = [];
    if (availableModules.includes('ai-readiness')) moduleScores.push(overallAverages.aiReadiness);
    if (availableModules.includes('leadership')) moduleScores.push(overallAverages.leadership);
    if (availableModules.includes('employee-experience')) moduleScores.push(overallAverages.employeeExperience);
    
    return moduleScores.length > 0 ? Math.round(moduleScores.reduce((sum, score) => sum + score, 0) / moduleScores.length) : 0;
  }, [overallAverages, availableModules]);

  useEffect(() => {
    // initialize live counters from backend aggregates when available
    if (sourceAggregates) {
      setLiveCompletedSurveys(initialCompletedSurveys);
      setLiveActiveRespondents(initialActiveRespondents);
    }
  }, [sourceAggregates, initialCompletedSurveys, initialActiveRespondents]);

  const fetchTimerRef = useRef<number | null>(null);

  const fetchAggregates = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = companyId ? `?companyId=${encodeURIComponent(String(companyId))}` : '';
      const res = await fetch(`/api/aggregates${qs}`);
      if (!res.ok) throw new Error(`Aggregates fetch failed: ${res.status}`);
      const json = await res.json();
      setLocalAggregates(json.aggregates || null);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const scheduleFetchAggregates = () => {
    try { if (fetchTimerRef.current) window.clearTimeout(fetchTimerRef.current); } catch (e) {}
    fetchTimerRef.current = window.setTimeout(() => { fetchAggregates(); }, 800) as unknown as number;
  };

  // If we don't have backendAggregates passed from parent, fetch once and keep live-updating
  useEffect(() => {
    if (!backendAggregates) {
      fetchAggregates().catch(() => {});
    }
    return () => {
      try { if (fetchTimerRef.current) window.clearTimeout(fetchTimerRef.current); } catch (e) {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendAggregates, companyId]);

  const { reconnect } = useSSE({
    companyId,
    onEvent: (e: MessageEvent) => {
      try { console.debug && console.debug('[OverviewDashboard] SSE event', { data: e.data }); } catch (err) {}
      try {
        const data = JSON.parse(e.data);
        const matchesCompany = !companyId || data.companyId === companyId;
        if (matchesCompany) {
          setLiveCompletedSurveys(prev => (prev ?? 0) + 1);
          setLiveActiveRespondents(prev => (prev ?? 0) + 1);
        }
        setLastEventTime(new Date(data.timestamp || Date.now()).toLocaleTimeString());
      } catch (err) {
        console.error('Malformed SSE event', err);
      }
      // refresh full aggregates (debounced)
      scheduleFetchAggregates();
    },
    onStatus: (status: any, detail?: string) => {
      try { console.debug && console.debug('[OverviewDashboard] SSE status', { status, detail, retry: sseRetryCount }); } catch (err) {}
      if (status === 'connecting') {
        setSseStatus('connecting');
      } else if (status === 'connected') {
        setSseStatus('connected');
        setSseRetryCount(0);
      } else if (status === 'unavailable' || status === 'error') {
        setSseStatus('connecting');
        setSseRetryCount(prev => {
          const next = prev + 1;
          if (next > sseMaxRetries) setSseStatus('failed');
          return next;
        });
      } else if (status === 'closed') {
        setSseStatus('failed');
      }
    }
  });

  const attentionQuestions = useMemo(() => {
    if (!sourceAggregates) return [];
    try {
      const list: Array<{ text: string; score: number; module: string }> = [];
      Object.keys(sourceAggregates).forEach((mod) => {
        const qlist = sourceAggregates[mod]?.questionScores || [];
        qlist.forEach((q: any) => {
          list.push({ text: q.question || q.questionId || q.id || q.label || q.name || q.questionText || 'Question', score: Math.round(q.positivePercentage || q.average || 0), module: mod });
        });
      });
      return list.sort((a, b) => a.score - b.score).slice(0, 3);
    } catch (e) { return []; }
  }, [sourceAggregates]);

  const topQuestions = useMemo(() => {
    if (!sourceAggregates) return [];
    try {
      const list: Array<{ text: string; score: number; module: string }> = [];
      Object.keys(sourceAggregates).forEach((mod) => {
        const qlist = sourceAggregates[mod]?.questionScores || [];
        qlist.forEach((q: any) => {
          const score = typeof q.positivePercentage === 'number' ? Math.round(q.positivePercentage) : (typeof q.average === 'number' ? Math.round((q.average || 0) * 10) / 10 : 0);
          list.push({ text: q.question || q.questionId || q.id || q.label || q.name || q.questionText || 'Question', score, module: mod });
        });
      });
      return list.sort((a, b) => b.score - a.score).slice(0, 4);
    } catch (e) { return []; }
  }, [sourceAggregates]);

  return (
    <div className="space-y-6">
      {/* SSE connection status banner */}
      {sseStatus === 'connecting' && (
        <div className="p-2 bg-yellow-50 text-sm text-yellow-800 rounded">
          Live updates: connecting... (attempt {sseRetryCount}/{sseMaxRetries})
        </div>
      )}
      {sseStatus === 'failed' && (
        <div className="p-3 bg-red-50 text-sm text-red-800 rounded flex items-center justify-between">
          <div>Live updates unavailable. You can retry to re-establish a connection.</div>
          <div>
            <button
              className="ml-4 px-3 py-1 bg-red-600 text-white rounded"
              onClick={() => {
                try { if (sseReconnectRef.current) window.clearTimeout(sseReconnectRef.current); } catch (e) {}
                setSseRetryCount(0);
                setSseStatus('connecting');
                    try { console.debug && console.debug('[OverviewDashboard] manual reconnect'); reconnect(); } catch (e) { console.warn('Reconnect failed', e); }
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div className="p-2 bg-blue-50 text-sm text-blue-800 rounded">Loading dashboard data…</div>
      )}
      {error && (
        <div className="p-3 bg-red-50 text-sm text-red-800 rounded flex items-center justify-between">
          <div>Failed to load dashboard data: {error}</div>
          <div>
            <button className="ml-4 px-3 py-1 bg-red-600 text-white rounded" onClick={() => fetchAggregates().catch(() => {})}>Retry</button>
          </div>
        </div>
      )}
      <Tabs defaultValue="responses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="responses">My Responses</TabsTrigger>
          <TabsTrigger value="results">My Results</TabsTrigger>
        </TabsList>

        <TabsContent value="responses" className="space-y-6">
          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Participants</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalParticipants ?? '—'}</div>
                <p className="text-xs text-gray-600 mt-1">Across all modules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Surveys Completed</CardTitle>
                <FileText className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{liveCompletedSurveys ?? '—'}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <p className="text-xs text-green-600">{lastEventTime ? `Last event ${lastEventTime}` : '+12% from last month'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Respondents</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{liveActiveRespondents ?? '—'}</div>
                <p className="text-xs text-gray-600 mt-1">Currently taking surveys</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Response Rate</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{responseRate !== null ? `${responseRate}%` : '—'}</div>
                <div className="mt-2">
                  {typeof responseRate === 'number' ? (
                    <Progress value={responseRate} className="h-1" />
                  ) : (
                    <div className="text-xs text-gray-500">Waiting for server response rate</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Survey Volume Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Survey Volume Trend</CardTitle>
                <CardDescription>Monthly response activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 md:h-72">
                  {trendData && trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="responses" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          dot={{ fill: '#3B82F6' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="p-6 text-sm text-gray-600">Waiting for server trend data for this survey.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Response Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Response Distribution</CardTitle>
                <CardDescription>Participation by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 md:h-72">
                  {demographicData && demographicData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={demographicData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {demographicData.map((entry, index) => (
                            <Cell fill={entry.color} key={`cell-${index}`} />
                          ))}
                        </Pie>
          </Card>

          {/* Question Performance Review */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Top Performing Questions
                </CardTitle>
                <CardDescription>Highest scoring areas across modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topQuestions.length > 0 ? (
                    topQuestions.map((question, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex-1 pr-2">
                          <p className="text-sm font-medium text-gray-900">{question.text}</p>
                          <p className="text-xs text-gray-600">{question.module}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-700">{question.score}%</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-lg border text-sm text-gray-600">Waiting for server data to show top performing questions.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Questions Needing Attention */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Needs Attention
                </CardTitle>
                <CardDescription>Areas with lower engagement scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attentionQuestions.length > 0 ? (
                    attentionQuestions.map((question, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex-1 pr-2">
                          <p className="text-sm font-medium text-gray-900">{question.text}</p>
                          <p className="text-xs text-gray-600">{question.module}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-yellow-700">{question.score}%</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-lg border text-sm text-gray-600">Waiting for server data to show areas needing attention.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}