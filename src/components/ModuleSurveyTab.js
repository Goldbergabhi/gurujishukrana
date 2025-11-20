import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Clock, CheckCircle2, AlertCircle, ChevronDown, FileText, BarChart3, Timer, Users } from "lucide-react";
export function ModuleSurveyTab({ module, status, progress, onStartSurvey, onResumeSurvey, onViewAnalysis, lastUpdated }) {
    const [sectionsOpen, setSectionsOpen] = useState(false);
    const getStatusConfig = () => {
        switch (status) {
            case 'completed':
                return {
                    icon: CheckCircle2,
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    label: 'Completed',
                    description: 'Survey completed successfully'
                };
            case 'in-progress':
                return {
                    icon: Clock,
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    label: 'In Progress',
                    description: `${progress}% completed`
                };
            default:
                return {
                    icon: AlertCircle,
                    color: 'text-gray-500',
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    label: 'Not Started',
                    description: 'Ready to begin'
                };
        }
    };
    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: `${statusConfig.bgColor} ${statusConfig.borderColor}`, children: [_jsxs(CardHeader, { children: [_jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CardTitle, { className: "text-xl", children: module.title }), _jsxs(Badge, { variant: "secondary", className: `${statusConfig.color} ${statusConfig.bgColor}`, children: [_jsx(StatusIcon, { className: "h-3 w-3 mr-1" }), statusConfig.label] })] }), _jsx(CardDescription, { className: "text-base", children: module.description })] }) }), status === 'in-progress' && (_jsxs("div", { className: "space-y-2 mt-4", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Progress" }), _jsxs("span", { className: "font-medium", children: [progress, "% complete"] })] }), _jsx(Progress, { value: progress, className: "h-2" })] }))] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Timer, { className: "h-4 w-4" }), _jsxs("span", { children: [module.timeToComplete, " to complete"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(FileText, { className: "h-4 w-4" }), _jsxs("span", { children: [module.totalQuestions, " questions total"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Users, { className: "h-4 w-4" }), _jsxs("span", { children: [module.sections.length, " sections"] })] })] }), lastUpdated && (_jsxs("p", { className: "text-sm text-gray-500 mb-4", children: ["Last updated: ", lastUpdated] })), _jsxs("div", { className: "flex gap-3", children: [status === 'not-started' && (_jsxs(Button, { onClick: onStartSurvey, size: "lg", className: "flex items-center gap-2", children: [_jsx(FileText, { className: "h-4 w-4" }), "Start Survey"] })), status === 'in-progress' && (_jsxs(Button, { onClick: onResumeSurvey, size: "lg", className: "flex items-center gap-2", children: [_jsx(Clock, { className: "h-4 w-4" }), "Resume Survey"] })), _jsxs(Button, { variant: status === 'completed' ? 'default' : 'outline', onClick: onViewAnalysis, disabled: status === 'not-started', size: "lg", className: "flex items-center gap-2", children: [_jsx(BarChart3, { className: "h-4 w-4" }), "View Analysis"] })] })] })] }), _jsx(Card, { children: _jsx(CardHeader, { children: _jsxs(Collapsible, { open: sectionsOpen, onOpenChange: setSectionsOpen, children: [_jsx(CollapsibleTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", className: "w-full justify-between p-0 h-auto", children: [_jsx(CardTitle, { className: "text-lg", children: "Survey Sections" }), _jsx(ChevronDown, { className: `h-4 w-4 transition-transform ${sectionsOpen ? 'rotate-180' : ''}` })] }) }), _jsx(CollapsibleContent, { className: "mt-4", children: _jsx("div", { className: "space-y-3", children: module.sections.map((section, index) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg border", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-white rounded-full flex items-center justify-center border text-sm font-medium", children: index + 1 }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900", children: section.name }), section.description && (_jsx("p", { className: "text-sm text-gray-600", children: section.description }))] })] }), _jsxs("div", { className: "text-sm text-gray-500", children: [section.questions, " questions"] })] }, section.name))) }) })] }) }) })] }));
}
