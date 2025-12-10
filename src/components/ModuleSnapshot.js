import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown, Users, Target, Clock, Award } from "lucide-react";
export function ModuleSnapshot({ module, campaign, surveyResponses, mockData }) {
    const moduleData = useMemo(() => {
        // Calculate module-specific metrics
        const getModuleResponses = (prefix) => Object.keys(surveyResponses).filter(key => key.startsWith(prefix)).length;
        const responseCount = getModuleResponses(module === 'ai-readiness' ? 'ai-' :
            module === 'leadership' ? 'leadership-' : 'ee-');
        // Prefer server-provided summary metrics when available. If missing, return nulls so UI shows placeholders.
        const positiveScore = typeof (serverSummary === null || serverSummary === void 0 ? void 0 : serverSummary.positiveAverage) === 'number' ? serverSummary.positiveAverage : null;
        const previousScore = typeof (serverSummary === null || serverSummary === void 0 ? void 0 : serverSummary.previousScore) === 'number' ? serverSummary.previousScore : null;
        let completionRate = null;
        if (serverSummary && typeof (serverSummary === null || serverSummary === void 0 ? void 0 : serverSummary.responseCount) === 'number' && campaign && typeof campaign.participantCount === 'number' && campaign.participantCount > 0) {
            completionRate = Math.round((Number(serverSummary.responseCount) / Number(campaign.participantCount)) * 100);
        }
        const medianScore = typeof (serverSummary === null || serverSummary === void 0 ? void 0 : serverSummary.medianQuestionScore) === 'number' ? serverSummary.medianQuestionScore : null;
        const topDemographic = serverSummary === null || serverSummary === void 0 ? void 0 : serverSummary.topDemographic ? `${serverSummary.topDemographic.group} ${serverSummary.topDemographic.pct}%` : null;
        return {
            positiveScore,
            previousScore,
            delta: (positiveScore !== null && previousScore !== null) ? positiveScore - previousScore : null,
            completionRate,
            medianScore,
            topDemographic,
            responseCount
        };
    }, [module, campaign, surveyResponses]);
    const cards = [
        {
            title: "Average Positive Score",
            value: moduleData.positiveScore !== null ? `${moduleData.positiveScore.toFixed(1)}%` : '—',
            delta: moduleData.delta,
            icon: _jsx(Target, { className: "h-5 w-5 text-blue-600" }),
            description: "Responses scoring 4-5 (or 7-10 for EX)"
        },
        {
            title: "Completion Rate",
            value: moduleData.completionRate !== null ? `${moduleData.completionRate}%` : '—',
            delta: null,
            icon: _jsx(Users, { className: "h-5 w-5 text-green-600" }),
            description: campaign === null || campaign === void 0 ? void 0 : campaign.participantCount ? `${campaign.participantCount} participants invited` : 'Participant count not available'
        },
        {
            title: "Median Question Score",
            value: moduleData.medianScore !== null ? `${moduleData.medianScore.toFixed(1)}%` : '—',
            delta: null,
            icon: _jsx(Award, { className: "h-5 w-5 text-purple-600" }),
            description: "Middle score across all questions"
        },
        {
            title: "Top Demographic",
            value: moduleData.topDemographic || '—',
            delta: null,
            icon: _jsx(Clock, { className: "h-5 w-5 text-orange-600" }),
            description: "Highest scoring group"
        }
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: cards.map((card, index) => (_jsxs(Card, { className: "bg-white", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: card.title }), card.icon] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900 mb-1", children: card.value }), card.delta !== null && (_jsxs("div", { className: "flex items-center gap-1", children: [card.delta > 0 ? (_jsx(TrendingUp, { className: "h-3 w-3 text-green-600" })) : (_jsx(TrendingDown, { className: "h-3 w-3 text-red-600" })), _jsxs("span", { className: `text-xs ${card.delta > 0 ? 'text-green-600' : 'text-red-600'}`, children: [card.delta > 0 ? '+' : '', card.delta.toFixed(1), "% vs previous"] })] })), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: card.description })] })] }, index))) }));
}
