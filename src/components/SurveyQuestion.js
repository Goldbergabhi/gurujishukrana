import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
export function SurveyQuestion({ question, questionId, scale, value, onChange, section }) {
    const getScaleOptions = () => {
        if (scale === '1-5') {
            return [
                { value: '1', label: '(1) Almost never' },
                { value: '2', label: '(2) Seldom' },
                { value: '3', label: '(3) Sometimes' },
                { value: '4', label: '(4) Often' },
                { value: '5', label: '(5) Almost always' },
                { value: '6', label: '(6) Don\'t know or N/A' }
            ];
        }
        else if (scale === '0-10') {
            return Array.from({ length: 11 }, (_, i) => ({
                value: i.toString(),
                label: `${i}${i === 0 ? ' - Not at all likely' : i === 10 ? ' - Extremely likely' : ''}`
            }));
        }
        else if (scale === 'roadblocks') {
            return [
                { value: 'not-part-of-role', label: 'It\'s not part of my role or job' },
                { value: 'others-not-using', label: 'I don\'t see others using it' },
                { value: 'no-time', label: 'I don\'t have time to use it' },
                { value: 'dont-know-how', label: 'I don\'t know how to use it' },
                { value: 'no-access', label: 'I don\'t have access to the tools I need' },
                { value: 'not-motivated', label: 'I don\'t feel motivated or interested in using it' },
                { value: 'something-else', label: 'Something else' },
                { value: 'use-as-much-as-can', label: 'N/A – I use AI as much as I can' }
            ];
        }
        return [];
    };
    const options = getScaleOptions();
    return (_jsxs("div", { className: "space-y-6", children: [section && (_jsx("div", { className: "flex items-center gap-2", children: _jsx(Badge, { variant: "secondary", className: "text-xs", children: section }) })), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-bold leading-relaxed tracking-tight text-gray-900", children: question }), _jsx("div", { className: "bg-gray-50 p-6 rounded-lg border", children: scale === '0-10' ? (_jsxs("div", { className: "space-y-4", children: [_jsxs(Select, { value: value || '', onValueChange: (val) => onChange(questionId, val), children: [_jsx(SelectTrigger, { className: "w-full h-12 bg-white", children: _jsx(SelectValue, { placeholder: "Select a rating from 0 to 10" }) }), _jsx(SelectContent, { children: options.map((option) => (_jsx(SelectItem, { value: option.value, children: option.label }, option.value))) })] }), _jsxs("div", { className: "flex justify-between text-sm text-gray-500 px-2", children: [_jsx("span", { children: "Not at all likely" }), _jsx("span", { children: "Extremely likely" })] })] })) : scale === 'roadblocks' ? (_jsxs(Select, { value: value || '', onValueChange: (val) => onChange(questionId, val), children: [_jsx(SelectTrigger, { className: "w-full h-12 bg-white", children: _jsx(SelectValue, { placeholder: "Select the primary reason" }) }), _jsx(SelectContent, { children: options.map((option) => (_jsx(SelectItem, { value: option.value, children: option.label }, option.value))) })] })) : (_jsx(RadioGroup, { value: value || '', onValueChange: (val) => onChange(questionId, val), className: "space-y-3", children: options.map((option) => {
                                const isSelected = value === option.value;
                                const isPositive = ['4', '5'].includes(option.value);
                                return (_jsxs("div", { className: `flex items-center p-4 rounded-lg border transition-colors cursor-pointer ${isSelected
                                        ? isPositive
                                            ? 'border-green-300 bg-green-50'
                                            : 'border-blue-300 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'}`, onClick: () => onChange(questionId, option.value), children: [_jsx(RadioGroupItem, { value: option.value, id: `${questionId}-${option.value}` }), _jsx(Label, { htmlFor: `${questionId}-${option.value}`, className: "cursor-pointer flex-1 ml-3 font-medium text-gray-800 leading-relaxed", children: option.label }), isSelected && (_jsx("div", { className: `w-3 h-3 rounded-full ${isPositive ? 'bg-green-500' : 'bg-blue-500'}` }))] }, option.value));
                            }) })) })] })] }));
}
