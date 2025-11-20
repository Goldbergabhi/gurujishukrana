import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, Eye, Users, BarChart3 } from "lucide-react";
export function WelcomeBanner({ currentSurvey, isAdmin, availableModules = [] }) {
    const getModuleName = (module) => {
        switch (module) {
            case 'ai-readiness': return 'AI Readiness';
            case 'leadership': return 'Leadership';
            case 'employee-experience': return 'Employee Experience';
            default: return module;
        }
    };
    const getPrimaryModuleName = (primaryModule) => {
        return getModuleName(primaryModule);
    };
    if (currentSurvey) {
        return (_jsxs(Card, { className: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-6", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "text-xl text-blue-900", children: ["Welcome to ", currentSurvey.companyName, "'s ", getPrimaryModuleName(currentSurvey.primaryModule), " Dashboard"] }), _jsxs(CardDescription, { className: "text-blue-700 mt-1", children: ["This dashboard shows results for your ", currentSurvey.surveyType, " survey", currentSurvey.modules.length > 1 && (_jsxs("span", { children: [" covering ", currentSurvey.modules.map(getModuleName).join(', ')] }))] })] }), _jsxs(Badge, { variant: "outline", className: "bg-blue-100 text-blue-800 border-blue-300", children: [currentSurvey.responseCount, " responses"] })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: _jsx(Eye, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-blue-900", children: "View Results" }), _jsx("p", { className: "text-sm text-blue-600", children: "Explore detailed analytics and insights" })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-green-100 rounded-lg", children: _jsx(Users, { className: "h-5 w-5 text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-blue-900", children: "Survey Status" }), _jsx("p", { className: "text-sm text-blue-600", children: currentSurvey.status === 'active' ? 'Currently collecting responses' : 'Survey completed' })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-purple-100 rounded-lg", children: _jsx(BarChart3, { className: "h-5 w-5 text-purple-600" }) }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-blue-900", children: [getPrimaryModuleName(currentSurvey.primaryModule), " Score"] }), _jsx("p", { className: "text-sm text-blue-600", children: "Real-time calculation of positive responses" })] })] })] }) })] }));
    }
    if (isAdmin) {
        return (_jsxs(Card, { className: "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 mb-6", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-xl text-purple-900", children: "Survey Management Dashboard" }), _jsx(CardDescription, { className: "text-purple-700", children: "Create and manage AI readiness surveys for your clients. Currently viewing aggregated data from all surveys." })] }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { variant: "outline", onClick: () => window.location.hash = '#survey-management', children: [_jsx(Users, { className: "h-4 w-4 mr-2" }), "Manage Surveys"] }), _jsx("div", { className: "text-sm text-purple-600", children: "\u2022 Create custom surveys for companies \u2022 Generate unique survey and dashboard links \u2022 Track response rates across all clients" })] }) })] }));
    }
    return (_jsxs(Card, { className: "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 mb-6", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-xl text-gray-900", children: "LEAP Survey Dashboard" }), _jsx(CardDescription, { className: "text-gray-700", children: "Comprehensive insights into AI readiness, leadership effectiveness, and employee experience" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { variant: "outline", children: [_jsx(ExternalLink, { className: "h-4 w-4 mr-2" }), "Take Survey"] }), _jsx("div", { className: "text-sm text-gray-600", children: "\u2022 Complete assessment modules \u2022 View real-time results \u2022 Track progress over time" })] }) })] }));
}
