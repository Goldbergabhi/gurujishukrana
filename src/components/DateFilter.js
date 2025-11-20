import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
export function DateFilter({ selectedPeriod, onPeriodChange }) {
    const periods = [
        { value: 'current-quarter', label: 'Current Quarter' },
        { value: 'last-quarter', label: 'Last Quarter' },
        { value: 'current-year', label: 'Current Year' },
        { value: 'last-year', label: 'Last Year' },
        { value: 'all-time', label: 'All Time' }
    ];
    return (_jsxs("div", { className: "flex items-center gap-4 px-4 py-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Time Period:" }), _jsxs(Select, { value: selectedPeriod, onValueChange: onPeriodChange, children: [_jsx(SelectTrigger, { className: "w-48 bg-white", children: _jsx(SelectValue, { placeholder: "Select time period" }) }), _jsx(SelectContent, { children: periods.map((period) => (_jsx(SelectItem, { value: period.value, children: period.label }, period.value))) })] })] }));
}
