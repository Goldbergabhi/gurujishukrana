import React from 'react';

export function ModuleAnalysisTab(props: { moduleId?: string; questionScores?: any[]; orgQuestionScores?: any[] }) {
  // Render organization-level aggregates by default.
  // Prefer `orgQuestionScores` when provided by the server; fall back to `questionScores`.
  const { moduleId, questionScores = [], orgQuestionScores } = props;
  const qs = Array.isArray(orgQuestionScores) && orgQuestionScores.length > 0 ? orgQuestionScores : questionScores || [];

  const computeQuestionAvg = (q: any) => {
    if (typeof q.avg === 'number') return q.avg;
    if (typeof q.average === 'number') return q.average;
    const counts = Array.isArray(q.distribution) && q.distribution.length === 6 ? q.distribution : Array.isArray(q.counts) && q.counts.length === 6 ? q.counts : null;
    if (!counts) return 0;
    const total = counts.reduce((a: number, b: number) => a + b, 0) || 1;
    const weighted = counts.reduce((acc: number, c: number, i: number) => acc + c * (i + 1), 0);
    return weighted / total;
  };

  const totals = qs.map((q: any) => ({ avg: computeQuestionAvg(q), total: q.totalResponses || (Array.isArray(q.distribution) ? q.distribution.reduce((a: number, b: number) => a + b, 0) : 0) || 0 }));
  const totalResponses = totals.reduce((s, t) => s + t.total, 0) || 0;
  const overall = totalResponses === 0 ? 0 : totals.reduce((s, t) => s + t.avg * t.total, 0) / totalResponses;

  let pos = 0;
  let tot = 0;
  qs.forEach((q: any) => {
    const counts = Array.isArray(q.distribution) && q.distribution.length === 6 ? q.distribution : Array.isArray(q.counts) && q.counts.length === 6 ? q.counts : null;
    if (!counts) return;
    pos += (counts[4] || 0) + (counts[5] || 0);
    tot += counts.reduce((a: number, b: number) => a + b, 0);
  });
  const overallPositiveRate = tot === 0 ? 0 : (pos / tot) * 100;

  const scoreShade = (i: number) => {
    const shades = ['bg-gray-200', 'bg-gray-300', 'bg-green-100', 'bg-green-200', 'bg-green-400', 'bg-green-600'];
    return shades[Math.max(0, Math.min(5, i - 1))];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Total Responses</div>
          <div className="text-3xl font-semibold">{totalResponses}</div>
        </div>
        <div className="p-4 rounded-lg bg-white shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Org Average</div>
          <div className="text-3xl font-semibold">{overall ? overall.toFixed(1) : '—'}</div>
        </div>
        <div className="p-4 rounded-lg bg-white shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Positive Rate</div>
          <div className="text-3xl font-semibold text-green-600">{overallPositiveRate ? `${Math.round(overallPositiveRate)}%` : '0%'}</div>
        </div>
      </div>

      <div className="space-y-4">
        {qs.map((question: any, idx: number) => {
          const counts = Array.isArray(question.distribution) && question.distribution.length === 6 ? question.distribution : Array.isArray(question.counts) && question.counts.length === 6 ? question.counts : Array(6).fill(0);
          const total = counts.reduce((a: number, b: number) => a + b, 0) || 0;
          const percents = counts.map((c: number) => (total ? (c / total) * 100 : 0));
          const avg = computeQuestionAvg(question);
          const positive = total ? ((counts[4] || 0) + (counts[5] || 0)) / total * 100 : 0;
          return (
            <div key={idx} className="p-4 rounded-lg bg-white shadow-sm border flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1 pr-4">
                <div className="font-medium text-gray-900">{question.question || question.questionId || `Question ${idx + 1}`}</div>
                <div className="mt-3">
                  <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden flex">
                    {percents.map((p, i) => (
                      <div key={i} className={`h-5 ${scoreShade(i + 1)}`} style={{ width: `${p}%` }} />
                    ))}
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

export default ModuleAnalysisTab;
