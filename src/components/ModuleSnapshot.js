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
        // Mock calculations - in real app, these would come from your calculations utility
        const positiveScore = module === 'ai-readiness' ? 74.2 :
            module === 'leadership' ? 78.6 :
                71.8;
        const previousScore = positiveScore - (module === 'ai-readiness' ? 2.3 :
            module === 'leadership' ? 1.8 : -0.5);
        const completionRate = campaign ? campaign.completionRate : 89;
        const medianScore = positiveScore - 3.2;
        const topDemographic = module === 'ai-readiness' ? 'Engineering 89%' :
            module === 'leadership' ? 'Product Ops 87%' :
                'Design Team 84%';
        return {
            positiveScore,
            previousScore,
            delta: positiveScore - previousScore,
            completionRate,
            medianScore,
            topDemographic,
            responseCount
        };
    }, [module, campaign, surveyResponses]);
    const cards = [
        {
            title: "Average Positive Score",
            value: `${moduleData.positiveScore.toFixed(1)}%`,
            delta: moduleData.delta,
            icon: _jsx(Target, { className: "h-5 w-5 text-blue-600" }),
            description: "Responses scoring 4-5 (or 7-10 for EX)"
        },
        {
            title: "Completion Rate",
            value: `${moduleData.completionRate}%`,
            delta: 12.3,
            icon: _jsx(Users, { className: "h-5 w-5 text-green-600" }),
            description: `${campaign?.participantCount || 127} participants invited`
        },
        {
            title: "Median Question Score",
            value: `${moduleData.medianScore.toFixed(1)}%`,
            delta: 1.8,
            icon: _jsx(Award, { className: "h-5 w-5 text-purple-600" }),
            description: "Middle score across all questions"
        },
        {
            title: "Top Demographic",
            value: moduleData.topDemographic,
            delta: null,
            icon: _jsx(Clock, { className: "h-5 w-5 text-orange-600" }),
            description: "Highest scoring group"
        }
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: cards.map((card, index) => (_jsxs(Card, { className: "bg-white", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: card.title }), card.icon] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900 mb-1", children: card.value }), card.delta !== null && (_jsxs("div", { className: "flex items-center gap-1", children: [card.delta > 0 ? (_jsx(TrendingUp, { className: "h-3 w-3 text-green-600" })) : (_jsx(TrendingDown, { className: "h-3 w-3 text-red-600" })), _jsxs("span", { className: `text-xs ${card.delta > 0 ? 'text-green-600' : 'text-red-600'}`, children: [card.delta > 0 ? '+' : '', card.delta.toFixed(1), "% vs previous"] })] })), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: card.description })] })] }, index))) }));
}
