import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Brain, Users, Heart, Eye, ArrowRight } from "lucide-react";
export function SurveyTypesDemo() {
    const surveyTypes = [
        {
            id: 'ai-readiness',
            title: 'AI Readiness Assessment',
            description: 'Evaluate organizational preparedness for AI adoption and implementation',
            icon: Brain,
            color: 'from-blue-500 to-cyan-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            features: [
                'Technology Infrastructure Assessment',
                'Data Management Readiness',
                'Skills & Training Gap Analysis',
                'Organizational Culture Evaluation'
            ],
            sampleUrl: '?survey=techcorp-ai-managers-2024-abc123&modules=ai-readiness&primary=ai-readiness',
            surveyUrl: '?mode=survey&modules=ai-readiness&primary=ai-readiness',
            audience: 'Technical Leaders, CTOs, IT Managers',
            duration: '8-10 minutes'
        },
        {
            id: 'leadership',
            title: 'Leadership Effectiveness',
            description: 'Comprehensive assessment of leadership capabilities and team dynamics',
            icon: Users,
            color: 'from-purple-500 to-pink-500',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            features: [
                'Strategic Vision & Communication',
                'Team Development & Growth',
                'Decision Making Quality',
                'Change Leadership Skills'
            ],
            sampleUrl: '?survey=innovate-leadership-employees-2024-def456&modules=leadership&primary=leadership',
            surveyUrl: '?mode=survey&modules=leadership&primary=leadership',
            audience: 'Managers, Team Leaders, Executives',
            duration: '10-12 minutes'
        },
        {
            id: 'employee-experience',
            title: 'Employee Experience Survey',
            description: 'Measure workplace satisfaction and engagement across key experience drivers',
            icon: Heart,
            color: 'from-green-500 to-emerald-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            features: [
                'Work Environment & Culture',
                'Career Growth Opportunities',
                'Recognition & Rewards',
                'Work-Life Balance Assessment'
            ],
            sampleUrl: '?survey=startupco-employee-mixed-2024-ghi789&modules=employee-experience&primary=employee-experience',
            surveyUrl: '?mode=survey&modules=employee-experience&primary=employee-experience',
            audience: 'All Employees, HR Teams',
            duration: '12-15 minutes'
        }
    ];
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-4", children: "LEAP Survey Platform" }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl mx-auto", children: "Choose from our specialized survey modules or explore sample dashboards to see how LEAP can transform your organizational insights." })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: surveyTypes.map((survey) => {
                    const IconComponent = survey.icon;
                    return (_jsxs(Card, { className: `${survey.borderColor} hover:shadow-lg transition-shadow`, children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("div", { className: `p-3 rounded-lg ${survey.bgColor} mb-4`, children: _jsx(IconComponent, { className: `h-6 w-6 ${survey.textColor}` }) }), _jsx(Badge, { variant: "outline", className: "text-xs", children: survey.duration })] }), _jsx(CardTitle, { className: "text-xl", children: survey.title }), _jsx(CardDescription, { className: "text-sm", children: survey.description })] }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-2", children: "Key Assessment Areas:" }), _jsx("ul", { className: "space-y-1", children: survey.features.map((feature, index) => (_jsxs("li", { className: "text-sm text-gray-600 flex items-center gap-2", children: [_jsx("div", { className: `w-1.5 h-1.5 rounded-full ${survey.bgColor} ${survey.textColor}` }), feature] }, index))) })] }), _jsxs("div", { className: `p-3 rounded-lg ${survey.bgColor}`, children: [_jsx("p", { className: "text-xs font-medium text-gray-700 mb-1", children: "Target Audience" }), _jsx("p", { className: "text-sm text-gray-900", children: survey.audience })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs(Button, { className: "w-full", onClick: () => window.location.href = survey.surveyUrl, children: ["Take Survey", _jsx(ArrowRight, { className: "h-4 w-4 ml-2" })] }), _jsxs(Button, { variant: "outline", className: "w-full", onClick: () => window.location.href = survey.sampleUrl, children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "View Sample Dashboard"] })] })] })] }, survey.id));
                }) }), _jsxs(Card, { className: "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-xl text-gray-900", children: "Custom Multi-Module Surveys" }), _jsx(CardDescription, { children: "Need a comprehensive assessment? Combine multiple modules for a complete organizational evaluation." })] }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { variant: "outline", onClick: () => window.location.href = '?survey=megacorp-ai-managers-2024-jkl012&modules=ai-readiness,leadership&primary=ai-readiness', children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "AI + Leadership Sample"] }), _jsx("div", { className: "text-sm text-gray-600", children: "See how multiple modules work together for comprehensive insights" })] }) })] })] }));
}
