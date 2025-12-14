import React, { useEffect, useState } from 'react';

type QuestionScore = { questionId?: string; question?: string; average?: number; positivePercentage?: number; distribution?: number[]; counts?: number[]; totalResponses?: number };

type ModuleAggregate = { questionScores: QuestionScore[]; summaryMetrics?: any };

export default function ModuleAnalysisTab(props: { moduleId?: string; companyId?: string; surveyId?: string; orgQuestionScores?: QuestionScore[] }) {
  const { moduleId = 'leadership', companyId, surveyId, orgQuestionScores } = props;
  const [modules, setModules] = useState<Record<string, ModuleAggregate> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orgQuestionScores && orgQuestionScores.length > 0) {
      setModules({ [moduleId]: { questionScores: orgQuestionScores, summaryMetrics: {} } });
      return;
    }
    if (!companyId || !surveyId) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    fetch(`/api/aggregates?companyId=${encodeURIComponent(companyId)}&surveyId=${encodeURIComponent(surveyId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (!data || !data.aggregates) {
          setError('No aggregates available');
          setModules(null);
        } else {
          setModules(data.aggregates as Record<string, ModuleAggregate>);
        }
      })
      .catch((e) => { if (mounted) setError(String(e)); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [companyId, surveyId, orgQuestionScores, moduleId]);

  const mod: ModuleAggregate = modules && modules[moduleId] ? modules[moduleId] : { questionScores: [], summaryMetrics: {} };

  const questionScores = mod.questionScores || [];

  const totalResponses = Number(mod.summaryMetrics?.responseCount || questionScores.reduce((s, q) => s + (q.totalResponses || 0), 0));
  const orgAvg = Number(mod.summaryMetrics?.medianQuestionScore || 0);
  const positiveAvg = Number(mod.summaryMetrics?.positiveAverage || 0);

  const avgToPercent = (avg?: number) => {
    if (!avg || typeof avg !== 'number') return 0;
    return Math.max(0, Math.min(100, (avg / 6) * 100));
  };

  if (loading) return <div>Loading organization aggregates…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Total Responses</div>
          <div className="text-3xl font-semibold">{totalResponses}</div>
        </div>
        <div className="p-4 rounded-lg bg-white shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Org Average</div>
          <div className="text-3xl font-semibold">{orgAvg ? orgAvg.toFixed(1) : '—'}</div>
        </div>
        <div className="p-4 rounded-lg bg-white shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Positive Rate</div>
          <div className="text-3xl font-semibold text-green-600">{positiveAvg ? `${positiveAvg}%` : '0%'}</div>
        </div>
      </div>

      <div className="space-y-4">
        {questionScores.map((q, idx) => {
          const avg = Number(q.average || 0);
          const percent = avgToPercent(avg);
          const positive = Number(q.positivePercentage || 0);
          const total = Number(q.totalResponses || 0);
          return (
            <div key={q.questionId || idx} className="p-4 rounded-lg bg-white shadow-sm border flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1 pr-4">
                <div className="font-medium text-gray-900">{q.question || q.questionId || `Question ${idx + 1}`}</div>
                <div className="mt-3">
                  <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div className="h-5 bg-blue-500" style={{ width: `${percent}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs text-gray-500 mr-2">1</span>
                      <span className="text-xs text-gray-500 mr-2">2</span>
                      <span className="text-xs text-gray-500 mr-2">3</span>
                      <span className="text-xs text-gray-500 mr-2">4</span>
                      <span className="text-xs text-gray-500 mr-2">5</span>
                      <span className="text-xs text-gray-500">6</span>
                    </div>
                    <div className="text-xs text-gray-500">{total} responses</div>
                  </div>
                </div>
              </div>
              <div className="w-40 mt-3 md:mt-0 flex flex-col items-end">
                <div className="text-xl font-semibold">{avg ? avg.toFixed(1) : '—'}</div>
                <div className="text-sm text-green-600 mt-1">{Math.round(positive)}% positive</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
