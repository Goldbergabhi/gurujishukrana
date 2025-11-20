import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CheckCircle2, Circle } from "lucide-react";
import { aiReadinessQuestions, leadershipQuestions, employeeExperienceQuestions } from "../utils/surveyData";
export function MyResponsesResults({ surveyResponses, module }) {
    // Helper to pick questions for a single module id
    const questionsForModule = (m) => {
        if (m === 'ai-readiness')
            return aiReadinessQuestions;
        if (m === 'leadership')
            return leadershipQuestions;
        return employeeExperienceQuestions;
    };
    // Get scale labels based on question scale
    const getScaleLabel = (scale, value) => {
        const numValue = parseInt(value);
        if (scale === '1-5') {
            const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
            return labels[numValue - 1] || value;
        }
        else if (scale === '1-10') {
            if (numValue <= 3)
                return `${value} - Low`;
            if (numValue <= 6)
                return `${value} - Medium`;
            return `${value} - High`;
        }
        return value;
    };
    // Check if response is positive
    const isPositiveResponse = (scale, value) => {
        const numValue = parseInt(value);
        if (scale === '1-5') {
            return numValue >= 4; // 4 or 5 is positive
        }
        else if (scale === '1-10') {
            return numValue >= 7; // 7-10 is positive
        }
        return false;
    };
    // Render results for a single module
    const renderModuleResults = (m) => {
        const questions = questionsForModule(m);
        // Group questions by section
        const groupedQuestions = {};
        questions.forEach(question => {
            if (!groupedQuestions[question.section])
                groupedQuestions[question.section] = [];
            groupedQuestions[question.section].push(question);
        });
        // Filter to only show questions that have responses for this module
        const answeredSections = {};
        Object.entries(groupedQuestions).forEach(([sectionName, sectionQuestions]) => {
            const answeredInSection = sectionQuestions.filter(q => surveyResponses[q.id]);
            if (answeredInSection.length > 0) {
                answeredSections[sectionName] = answeredInSection;
            }
        });
        const totalResponses = Object.keys(surveyResponses).filter(k => questions.some(q => q.id === k)).length;
        const positiveResponses = Object.entries(surveyResponses).filter(([key, value]) => {
            const question = questions.find(q => q.id === key);
            if (!question)
                return false;
            return isPositiveResponse(question.scale, value);
        }).length;
        const positivePercentage = totalResponses > 0 ? Math.round((positiveResponses / totalResponses) * 100) : 0;
        return {
            answeredSections,
            totalResponses,
            positiveResponses,
            positivePercentage,
            questions
        };
    };
    // If module === 'all', render for all three modules
    if (module === 'all') {
        const modules = ['ai-readiness', 'leadership', 'employee-experience'];
        // Determine if any responses at all exist across modules
        const anyResponses = modules.some(m => {
            const questions = questionsForModule(m);
            return questions.some(q => !!surveyResponses[q.id]);
        });
        if (!anyResponses) {
            return (_jsx(Card, { children: _jsx(CardContent, { className: "p-12 text-center", children: _jsx("p", { className: "text-gray-600", children: "No responses recorded yet." }) }) }));
        }
        return (_jsx("div", { className: "space-y-6", children: modules.map((m) => {
                const { answeredSections, totalResponses, positiveResponses, positivePercentage, questions } = renderModuleResults(m);
                if (totalResponses === 0)
                    return null;
                return (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold capitalize", children: m.replace('-', ' ') }), _jsxs(Card, { className: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-green-900", children: [_jsx(CheckCircle2, { className: "h-6 w-6" }), "Your Response Summary"] }), _jsx(CardDescription, { className: "text-green-700", children: "Review your submitted responses for this module" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg p-4 border border-green-200", children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Total Responses" }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: totalResponses })] }), _jsxs("div", { className: "bg-white rounded-lg p-4 border border-green-200", children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Positive Responses" }), _jsx("div", { className: "text-2xl font-bold text-green-600", children: positiveResponses })] }), _jsxs("div", { className: "bg-white rounded-lg p-4 border border-green-200", children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Positive Rate" }), _jsxs("div", { className: "text-2xl font-bold text-green-600", children: [positivePercentage, "%"] })] })] }) })] }), _jsx("div", { className: "space-y-4", children: Object.entries(answeredSections).map(([sectionName, sectionQuestions], sectionIndex) => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-lg", children: sectionName }), _jsxs(CardDescription, { children: [sectionQuestions.length, " question", sectionQuestions.length > 1 ? 's' : '', " answered"] })] }), _jsxs(Badge, { variant: "outline", className: "bg-blue-50 text-blue-700 border-blue-200", children: ["Section ", sectionIndex + 1] })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-6", children: sectionQuestions.map((question, qIndex) => {
                                                const response = surveyResponses[question.id];
                                                if (!response)
                                                    return null;
                                                const isPositive = isPositiveResponse(question.scale, response);
                                                const scaleLabel = getScaleLabel(question.scale, response);
                                                return (_jsxs("div", { className: "space-y-3", children: [qIndex > 0 && _jsx(Separator, {}), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `mt-1 p-1 rounded-full ${isPositive ? 'bg-green-100' : 'bg-gray-100'}`, children: isPositive ? (_jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" })) : (_jsx(Circle, { className: "h-4 w-4 text-gray-400" })) }), _jsx("div", { className: "flex-1", children: _jsx("p", { className: "font-medium text-gray-900", children: question.question }) })] }), _jsx("div", { className: "ml-10 flex items-center gap-3", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Your response:" }), _jsx(Badge, { variant: "outline", className: `$ {
                                          isPositive 
                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                            : 'bg-gray-50 text-gray-700 border-gray-200'
                                        }`, children: scaleLabel })] }), _jsxs("div", { className: "mt-2 flex items-center gap-1", children: [question.scale === '1-5' && (_jsx(_Fragment, { children: [1, 2, 3, 4, 5].map((num) => (_jsx("div", { className: `h-2 flex-1 rounded ${num === parseInt(response)
                                                                                                ? isPositive
                                                                                                    ? 'bg-green-500'
                                                                                                    : 'bg-gray-500'
                                                                                                : 'bg-gray-200'}` }, num))) })), question.scale === '1-10' && (_jsx(_Fragment, { children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (_jsx("div", { className: `h-2 flex-1 rounded ${num === parseInt(response)
                                                                                                ? isPositive
                                                                                                    ? 'bg-green-500'
                                                                                                    : 'bg-gray-500'
                                                                                                : 'bg-gray-200'}` }, num))) }))] }), _jsxs("div", { className: "mt-1 flex justify-between text-xs text-gray-500", children: [_jsx("span", { children: question.scale === '1-5' ? '1 - Strongly Disagree' : '1 - Low' }), _jsx("span", { children: question.scale === '1-5' ? '5 - Strongly Agree' : '10 - High' })] })] }) })] })] }, question.id));
                                            }) }) })] }, sectionIndex))) })] }, m));
            }) }));
    }
    // Default: single module (existing behavior)
    const { answeredSections, totalResponses, positiveResponses, positivePercentage, questions } = renderModuleResults(module);
    if (totalResponses === 0) {
        return (_jsx(Card, { children: _jsx(CardContent, { className: "p-12 text-center", children: _jsx("p", { className: "text-gray-600", children: "No responses recorded yet." }) }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { className: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-green-900", children: [_jsx(CheckCircle2, { className: "h-6 w-6" }), "Your Response Summary"] }), _jsx(CardDescription, { className: "text-green-700", children: "Review all your submitted responses for this module" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg p-4 border border-green-200", children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Total Responses" }), _jsx("div", { className: "text-2xl font-bold text-gray-900", children: totalResponses })] }), _jsxs("div", { className: "bg-white rounded-lg p-4 border border-green-200", children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Positive Responses" }), _jsx("div", { className: "text-2xl font-bold text-green-600", children: positiveResponses })] }), _jsxs("div", { className: "bg-white rounded-lg p-4 border border-green-200", children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: "Positive Rate" }), _jsxs("div", { className: "text-2xl font-bold text-green-600", children: [positivePercentage, "%"] })] })] }) })] }), _jsx("div", { className: "space-y-6", children: Object.entries(answeredSections).map(([sectionName, sectionQuestions], sectionIndex) => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-lg", children: sectionName }), _jsxs(CardDescription, { children: [sectionQuestions.length, " question", sectionQuestions.length > 1 ? 's' : '', " answered"] })] }), _jsxs(Badge, { variant: "outline", className: "bg-blue-50 text-blue-700 border-blue-200", children: ["Section ", sectionIndex + 1] })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-6", children: sectionQuestions.map((question, qIndex) => {
                                    const response = surveyResponses[question.id];
                                    if (!response)
                                        return null;
                                    const isPositive = isPositiveResponse(question.scale, response);
                                    const scaleLabel = getScaleLabel(question.scale, response);
                                    return (_jsxs("div", { className: "space-y-3", children: [qIndex > 0 && _jsx(Separator, {}), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `mt-1 p-1 rounded-full ${isPositive ? 'bg-green-100' : 'bg-gray-100'}`, children: isPositive ? (_jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" })) : (_jsx(Circle, { className: "h-4 w-4 text-gray-400" })) }), _jsx("div", { className: "flex-1", children: _jsx("p", { className: "font-medium text-gray-900", children: question.question }) })] }), _jsx("div", { className: "ml-10 flex items-center gap-3", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Your response:" }), _jsx(Badge, { variant: "outline", className: `$ {
                                  isPositive 
                                    ? 'bg-green-50 text-green-700 border-green-200' 
                                    : 'bg-gray-50 text-gray-700 border-gray-200'
                                }`, children: scaleLabel })] }), _jsxs("div", { className: "mt-2 flex items-center gap-1", children: [question.scale === '1-5' && (_jsx(_Fragment, { children: [1, 2, 3, 4, 5].map((num) => (_jsx("div", { className: `h-2 flex-1 rounded ${num === parseInt(response)
                                                                                    ? isPositive
                                                                                        ? 'bg-green-500'
                                                                                        : 'bg-gray-500'
                                                                                    : 'bg-gray-200'}` }, num))) })), question.scale === '1-10' && (_jsx(_Fragment, { children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (_jsx("div", { className: `h-2 flex-1 rounded ${num === parseInt(response)
                                                                                    ? isPositive
                                                                                        ? 'bg-green-500'
                                                                                        : 'bg-gray-500'
                                                                                    : 'bg-gray-200'}` }, num))) }))] }), _jsxs("div", { className: "mt-1 flex justify-between text-xs text-gray-500", children: [_jsx("span", { children: question.scale === '1-5' ? '1 - Strongly Disagree' : '1 - Low' }), _jsx("span", { children: question.scale === '1-5' ? '5 - Strongly Agree' : '10 - High' })] })] }) })] })] }, question.id));
                                }) }) })] }, sectionIndex))) })] }));
}
