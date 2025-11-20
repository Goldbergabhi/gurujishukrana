import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import { BarChart3, Brain, Heart, Users, CheckCircle2, Clock, AlertCircle, FolderOpen } from "lucide-react";
const getStatusIcon = (status) => {
    switch (status) {
        case 'completed':
            return _jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" });
        case 'in-progress':
            return _jsx(Clock, { className: "h-4 w-4 text-yellow-600" });
        default:
            return _jsx(AlertCircle, { className: "h-4 w-4 text-gray-400" });
    }
};
const getStatusText = (status) => {
    switch (status) {
        case 'completed':
            return 'Completed';
        case 'in-progress':
            return 'In Progress';
        default:
            return 'Not Started';
    }
};
export function Sidebar({ activeModule, onModuleChange, surveyStatus, isAdmin = false, availableModules = ['ai-readiness', 'leadership', 'employee-experience'] }) {
    const allNavigationItems = [
        {
            id: 'overview',
            label: 'Overview',
            icon: BarChart3,
            description: 'Dashboard summary',
            alwaysShow: true
        },
        {
            id: 'ai-readiness',
            label: 'AI Readiness',
            icon: Brain,
            description: 'Technology adoption assessment',
            status: surveyStatus.aiReadiness,
            requiresModule: 'ai-readiness'
        },
        {
            id: 'employee-experience',
            label: 'Employee Experience',
            icon: Heart,
            description: 'Workplace satisfaction metrics',
            status: surveyStatus.employeeExperience,
            requiresModule: 'employee-experience'
        },
        {
            id: 'leadership',
            label: 'Leadership',
            icon: Users,
            description: 'Leadership effectiveness analysis',
            status: surveyStatus.leadership,
            requiresModule: 'leadership'
        },
        ...(isAdmin ? [
            {
                id: 'survey-management',
                label: 'Survey Management',
                icon: FolderOpen,
                description: 'Create and manage client surveys',
                alwaysShow: true
            }
        ] : []),
    ];
    // Filter navigation items based on available modules
    const navigationItems = allNavigationItems.filter(item => {
        if (item.alwaysShow)
            return true;
        if (item.requiresModule) {
            return availableModules.includes(item.requiresModule);
        }
        return true;
    });
    return (_jsxs("div", { className: "w-64 bg-white border-r border-gray-200 h-full flex flex-col", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: "L" }) }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-gray-900", children: "LEAP" }), _jsx("p", { className: "text-xs text-gray-500", children: "Analytics Platform" })] })] }) }), _jsx("nav", { className: "flex-1 p-4 space-y-2", children: navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeModule === item.id;
                    return (_jsx(Button, { variant: "ghost", onClick: () => !item.disabled && onModuleChange(item.id), disabled: item.disabled, className: cn("w-full justify-start h-auto p-3 text-left", isActive
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "hover:bg-gray-50", item.disabled && "opacity-50 cursor-not-allowed"), children: _jsxs("div", { className: "flex items-center gap-3 w-full", children: [_jsx(Icon, { className: cn("h-5 w-5 flex-shrink-0", isActive ? "text-blue-600" : "text-gray-500") }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: cn("font-medium text-sm", isActive ? "text-blue-700" : "text-gray-900"), children: item.label }), _jsx("div", { className: "text-xs text-gray-500 truncate", children: item.description }), item.status && (_jsxs("div", { className: "flex items-center gap-1 mt-1", children: [getStatusIcon(item.status), _jsx("span", { className: "text-xs text-gray-600", children: getStatusText(item.status) })] }))] })] }) }, item.id));
                }) }), _jsx("div", { className: "p-4 border-t border-gray-200", children: _jsxs("div", { className: "bg-gray-50 rounded-lg p-3", children: [_jsx("div", { className: "text-xs text-gray-600 mb-1", children: "Last Updated" }), _jsx("div", { className: "text-sm font-medium text-gray-900", children: new Date().toLocaleDateString() })] }) })] }));
}
