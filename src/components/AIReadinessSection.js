import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export function AIReadinessSection({ data }) {
    // Sort by positive percentage descending
    const sortedData = [...data].sort((a, b) => b.positivePercentage - a.positivePercentage);
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (_jsxs("div", { className: "bg-white p-3 border rounded-lg shadow-lg", children: [_jsx("p", { className: "font-medium", children: label }), _jsxs("p", { className: "text-green-600", children: ["Positive Responses: ", data.positivePercentage.toFixed(1), "%"] }), _jsxs("p", { className: "text-sm text-gray-600", children: [data.positiveCount, " of ", data.totalCount, " responses"] })] }));
        }
        return null;
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "AI Readiness by Section" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Percentage of \"Often\" and \"Almost always\" responses by section" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "h-96", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: sortedData, margin: { top: 20, right: 30, left: 40, bottom: 100 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "section", angle: -45, textAnchor: "end", height: 120, fontSize: 12 }), _jsx(YAxis, { domain: [0, 100], label: { value: 'Positive %', angle: -90, position: 'insideLeft' } }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Bar, { dataKey: "positivePercentage", fill: "#16a34a", radius: [4, 4, 0, 0] })] }) }) }), _jsxs("div", { className: "mt-6", children: [_jsx("h4", { className: "font-medium mb-3", children: "Top Performing Sections" }), _jsx("div", { className: "space-y-2", children: sortedData.slice(0, 5).map((section, index) => (_jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "flex-1 truncate pr-2", children: section.section }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-20 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-green-600 h-2 rounded-full", style: { width: `${section.positivePercentage}%` } }) }), _jsxs("span", { className: "w-12 text-right font-medium", children: [section.positivePercentage.toFixed(1), "%"] })] })] }, section.section))) })] })] })] }));
}
