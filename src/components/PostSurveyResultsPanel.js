import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TrendingUp, AlertTriangle, BarChart3, Users, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MyResponsesResults } from "./MyResponsesResults";
export function PostSurveyResultsPanel({ module, campaign, surveyResponses, mockData }) {
    // Mock question scores data
    const questionScores = useMemo(() => {
        if (module === 'ai-readiness') {
            return [
                { question: 'Technology Infrastructure', positive: 78, neutral: 15, negative: 7 },
                { question: 'Data Management', positive: 71, neutral: 22, negative: 7 },
                { question: 'Skills & Training', positive: 69, neutral: 18, negative: 13 },
                { question: 'Strategy & Culture', positive: 82, neutral: 12, negative: 6 }
            ];
        }
        else if (module === 'leadership') {
            return [
                { question: 'Strategic Vision', positive: 85, neutral: 10, negative: 5 },
                { question: 'Team Development', positive: 79, neutral: 16, negative: 5 },
                { question: 'Decision Making', positive: 73, neutral: 19, negative: 8 },
                { question: 'Change Leadership', positive: 77, neutral: 15, negative: 8 }
            ];
        }
        else {
            return [
                { question: 'Work Environment', positive: 74, neutral: 18, negative: 8 },
                { question: 'Career Growth', positive: 68, neutral: 22, negative: 10 },
                { question: 'Recognition & Rewards', positive: 71, neutral: 20, negative: 9 },
                { question: 'Work-Life Balance', positive: 76, neutral: 16, negative: 8 },
                { question: 'Communication', positive: 69, neutral: 23, negative: 8 }
            ];
        }
    }, [module]);
    // Mock demographic comparison data
    const demographicScores = useMemo(() => [
        { department: 'Engineering', score: 79 },
        { department: 'Product', score: 82 },
        { department: 'Design', score: 74 },
        { department: 'Marketing', score: 77 },
        { department: 'Sales', score: 71 }
    ], []);
    // Mock trend data
    const trendData = useMemo(() => [
        { month: 'Jun', score: 72 },
        { month: 'Jul', score: 74 },
        { month: 'Aug', score: 71 },
        { month: 'Sep', score: 76 },
        { month: 'Oct', score: 78 }
    ], []);
    // Questions flagged as needing attention (below 70%)
    const flaggedQuestions = questionScores.filter(q => q.positive < 70);
    const modulePositiveAvg = questionScores.reduce((sum, q) => sum + q.positive, 0) / questionScores.length;
    return (_jsxs(Tabs, { defaultValue: "my-responses", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2 max-w-md", children: [_jsxs(TabsTrigger, { value: "my-responses", className: "gap-2", children: [_jsx(FileText, { className: "h-4 w-4" }), "My Responses"] }), _jsxs(TabsTrigger, { value: "benchmarks", className: "gap-2", children: [_jsx(BarChart3, { className: "h-4 w-4" }), "Benchmarks & Insights"] })] }), _jsx(TabsContent, { value: "my-responses", className: "mt-6", children: _jsx(MyResponsesResults, { surveyResponses: surveyResponses, module: module }) }), _jsx(TabsContent, { value: "benchmarks", className: "mt-6", children: _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "text-xl text-blue-900", children: [module === 'ai-readiness' ? 'AI Readiness' :
                                                                module === 'leadership' ? 'Leadership' :
                                                                    'Employee Experience', " Score"] }), _jsx(CardDescription, { className: "text-blue-700", children: "Average positive response rate for this module" })] }), _jsx(TrendingUp, { className: "h-8 w-8 text-green-600" })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { className: "text-4xl font-bold text-blue-900", children: [modulePositiveAvg.toFixed(1), "%"] }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: "text-sm text-blue-700", children: "Trend (last 5 months)" }), _jsx(Badge, { variant: "outline", className: "bg-green-100 text-green-800 border-green-200", children: "+6% vs last cycle" })] }), _jsx(ResponsiveContainer, { width: "100%", height: 60, children: _jsx(LineChart, { data: trendData, children: _jsx(Line, { type: "monotone", dataKey: "score", stroke: "#3B82F6", strokeWidth: 2, dot: false }) }) })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(BarChart3, { className: "h-5 w-5 text-blue-600" }), "Question Score Breakdown"] }), _jsx(CardDescription, { children: "Response distribution by section" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: questionScores.map((question, index) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm font-medium text-gray-900", children: question.question }), _jsxs("span", { className: "text-sm font-bold text-green-600", children: [question.positive, "%"] })] }), _jsxs("div", { className: "flex h-2 bg-gray-200 rounded-full overflow-hidden", children: [_jsx("div", { className: "bg-green-500 h-full", style: { width: `${question.positive}%` } }), _jsx("div", { className: "bg-yellow-400 h-full", style: { width: `${question.neutral}%` } }), _jsx("div", { className: "bg-red-500 h-full", style: { width: `${question.negative}%` } })] }), _jsxs("div", { className: "flex justify-between text-xs text-gray-600", children: [_jsxs("span", { children: ["Positive: ", question.positive, "%"] }), _jsxs("span", { children: ["Neutral: ", question.neutral, "%"] }), _jsxs("span", { children: ["Negative: ", question.negative, "%"] })] })] }, index))) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Users, { className: "h-5 w-5 text-purple-600" }), "Demographic Scores"] }), _jsx(CardDescription, { children: "Performance comparison across departments" })] }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(BarChart, { data: demographicScores, layout: "horizontal", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { type: "number", domain: [0, 100], fontSize: 12 }), _jsx(YAxis, { type: "category", dataKey: "department", fontSize: 12, width: 80 }), _jsx(Tooltip, { formatter: (value) => [`${value}%`, 'Score'], contentStyle: {
                                                                backgroundColor: 'white',
                                                                border: '1px solid #e5e7eb',
                                                                borderRadius: '8px'
                                                            } }), _jsx(Bar, { dataKey: "score", fill: "#8B5CF6", radius: [0, 4, 4, 0] })] }) }) })] })] }), flaggedQuestions.length > 0 && (_jsxs(Card, { className: "border-yellow-200 bg-yellow-50", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-yellow-800", children: [_jsx(AlertTriangle, { className: "h-5 w-5" }), "Questions Needing Attention"] }), _jsx(CardDescription, { className: "text-yellow-700", children: "Areas scoring below 70% positive responses" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: flaggedQuestions.map((question, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200", children: [_jsxs("div", { className: "flex-1", children: [_jsx("span", { className: "font-medium text-gray-900", children: question.question }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(Progress, { value: question.positive, className: "h-2 flex-1 max-w-32" }), _jsxs("span", { className: "text-sm text-yellow-700", children: [question.positive, "% positive"] })] })] }), _jsx(Badge, { variant: "outline", className: "bg-yellow-100 text-yellow-800 border-yellow-300", children: "Needs focus" })] }, index))) }) })] })), _jsx(Card, { className: "bg-gray-50 border-gray-200", children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Ready for deeper insights?" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Explore detailed question-by-question analysis and demographic breakdowns." }), _jsxs(Button, { className: "gap-2", children: [_jsx(BarChart3, { className: "h-4 w-4" }), "Drill into Question Breakdown"] })] }) }) })] }) })] }));
}
