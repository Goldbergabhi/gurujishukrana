import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Users, FileText, Clock, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
export function PostSurveyResponsesPanel({ module, campaign, mockData }) {
    // Mock data for daily responses
    const dailyResponsesData = useMemo(() => [
        { date: 'Oct 1', responses: 12 },
        { date: 'Oct 2', responses: 18 },
        { date: 'Oct 3', responses: 15 },
        { date: 'Oct 4', responses: 22 },
        { date: 'Oct 5', responses: 19 },
        { date: 'Oct 6', responses: 8 },
        { date: 'Oct 7', responses: 25 },
        { date: 'Oct 8', responses: 31 },
        { date: 'Oct 9', responses: 16 },
        { date: 'Oct 10', responses: 28 }
    ], []);
    // Mock demographic distribution data
    const demographicData = useMemo(() => [
        { department: 'Engineering', responses: 45, color: '#3B82F6' },
        { department: 'Product', responses: 32, color: '#10B981' },
        { department: 'Design', responses: 18, color: '#F59E0B' },
        { department: 'Marketing', responses: 24, color: '#EF4444' },
        { department: 'Sales', responses: 16, color: '#8B5CF6' }
    ], []);
    const kpiData = [
        {
            title: "Total Participants",
            value: campaign?.participantCount || 127,
            icon: _jsx(Users, { className: "h-5 w-5 text-blue-600" }),
            description: "Invited to this survey"
        },
        {
            title: "Surveys Completed",
            value: Math.round((campaign?.participantCount || 127) * (campaign?.completionRate || 89) / 100),
            icon: _jsx(FileText, { className: "h-5 w-5 text-green-600" }),
            description: "Successfully submitted"
        },
        {
            title: "Active Respondents",
            value: 12,
            icon: _jsx(Activity, { className: "h-5 w-5 text-orange-600" }),
            description: "Currently in progress"
        },
        {
            title: "Avg Time to Complete",
            value: module === 'ai-readiness' ? '8.2 min' :
                module === 'leadership' ? '11.4 min' : '13.7 min',
            icon: _jsx(Clock, { className: "h-5 w-5 text-purple-600" }),
            description: "Average completion time"
        }
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex gap-4", children: [_jsxs(Select, { defaultValue: "last-30-days", children: [_jsx(SelectTrigger, { className: "w-48", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "last-7-days", children: "Last 7 days" }), _jsx(SelectItem, { value: "last-30-days", children: "Last 30 days" }), _jsx(SelectItem, { value: "last-90-days", children: "Last 90 days" }), _jsx(SelectItem, { value: "custom", children: "Custom range" })] })] }), _jsxs(Select, { defaultValue: "all-departments", children: [_jsx(SelectTrigger, { className: "w-48", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all-departments", children: "All Departments" }), _jsx(SelectItem, { value: "engineering", children: "Engineering" }), _jsx(SelectItem, { value: "product", children: "Product" }), _jsx(SelectItem, { value: "design", children: "Design" }), _jsx(SelectItem, { value: "marketing", children: "Marketing" }), _jsx(SelectItem, { value: "sales", children: "Sales" })] })] }), _jsxs(Select, { defaultValue: "all-locations", children: [_jsx(SelectTrigger, { className: "w-48", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all-locations", children: "All Locations" }), _jsx(SelectItem, { value: "san-francisco", children: "San Francisco" }), _jsx(SelectItem, { value: "new-york", children: "New York" }), _jsx(SelectItem, { value: "london", children: "London" }), _jsx(SelectItem, { value: "remote", children: "Remote" })] })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: kpiData.map((kpi, index) => (_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: kpi.title }), kpi.icon] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: kpi.description })] })] }, index))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Daily Responses" }), _jsx(CardDescription, { children: "Response activity over the survey period" })] }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: dailyResponsesData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date", fontSize: 12, tickLine: false, axisLine: false }), _jsx(YAxis, { fontSize: 12, tickLine: false, axisLine: false }), _jsx(Tooltip, { contentStyle: {
                                                    backgroundColor: 'white',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px'
                                                } }), _jsx(Line, { type: "monotone", dataKey: "responses", stroke: "#3B82F6", strokeWidth: 2, dot: { fill: '#3B82F6', strokeWidth: 2, r: 4 }, activeDot: { r: 6 } })] }) }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Response Distribution by Department" }), _jsx(CardDescription, { children: "Participation across organizational units" })] }), _jsxs(CardContent, { children: [_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: demographicData, margin: { top: 20, right: 30, left: 20, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "department", fontSize: 12, tickLine: false, axisLine: false }), _jsx(YAxis, { fontSize: 12, tickLine: false, axisLine: false }), _jsx(Tooltip, { contentStyle: {
                                                        backgroundColor: 'white',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '8px'
                                                    } }), _jsx(Bar, { dataKey: "responses", fill: "#3B82F6", radius: [4, 4, 0, 0] })] }) }), _jsx("div", { className: "flex flex-wrap gap-2 mt-4 justify-center", children: demographicData.map((item) => (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [_jsx("div", { className: "w-2 h-2 rounded-full mr-1", style: { backgroundColor: item.color } }), item.department, " (", item.responses, ")"] }, item.department))) })] })] })] })] }));
}
