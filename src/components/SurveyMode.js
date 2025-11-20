import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { CheckCircle, Brain, Users, Heart, Award } from 'lucide-react';
import { SurveySection } from './SurveySection';
import { aiReadinessQuestions, leadershipQuestions, employeeExperienceQuestions } from '../utils/surveyData';
export function SurveyMode({ onComplete }) {
    const [currentSection, setCurrentSection] = useState('intro');
    const [responses, setResponses] = useState({});
    const [completedSections, setCompletedSections] = useState(new Set());
    const handleResponseChange = (questionId, value) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: value
        }));
    };
    const handleSectionComplete = (sectionName) => {
        setCompletedSections(prev => new Set([...prev, sectionName]));
        // Auto-advance to next section
        if (sectionName === 'ai-readiness') {
            setCurrentSection('leadership');
        }
        else if (sectionName === 'leadership') {
            setCurrentSection('employee-experience');
        }
        else if (sectionName === 'employee-experience') {
            setCurrentSection('complete');
        }
    };
    const getSectionProgress = (questions) => {
        const answered = questions.filter(q => responses[q.id]).length;
        return (answered / questions.length) * 100;
    };
    const totalQuestions = aiReadinessQuestions.length + leadershipQuestions.length + employeeExperienceQuestions.length;
    const totalAnswered = Object.keys(responses).length;
    const overallProgress = (totalAnswered / totalQuestions) * 100;
    if (currentSection === 'intro') {
        return (_jsx("div", { className: "max-w-4xl mx-auto space-y-6", children: _jsxs(Card, { className: "text-center", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-3xl", children: "Welcome to the LEAP Survey" }), _jsx("p", { className: "text-lg text-gray-600", children: "Leadership Excellence \u2022 AI Readiness \u2022 Employee Experience" })] }), _jsxs(CardContent, { className: "space-y-6", children: [_jsx("p", { className: "text-gray-700 max-w-2xl mx-auto", children: "This comprehensive survey will help us understand your organization's readiness for AI, leadership effectiveness, and employee experience. Your responses will contribute to valuable insights and help drive organizational improvements." }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 my-8", children: [_jsxs("div", { className: "p-6 bg-blue-50 rounded-lg", children: [_jsx(Brain, { className: "h-12 w-12 text-blue-600 mx-auto mb-4" }), _jsx("h3", { className: "font-semibold text-blue-900 mb-2", children: "AI Readiness" }), _jsxs("p", { className: "text-sm text-blue-700", children: [aiReadinessQuestions.length, " questions"] }), _jsx("p", { className: "text-xs text-blue-600 mt-2", children: "\u2248 15-20 minutes" })] }), _jsxs("div", { className: "p-6 bg-green-50 rounded-lg", children: [_jsx(Users, { className: "h-12 w-12 text-green-600 mx-auto mb-4" }), _jsx("h3", { className: "font-semibold text-green-900 mb-2", children: "Leadership" }), _jsxs("p", { className: "text-sm text-green-700", children: [leadershipQuestions.length, " questions"] }), _jsx("p", { className: "text-xs text-green-600 mt-2", children: "\u2248 10-15 minutes" })] }), _jsxs("div", { className: "p-6 bg-purple-50 rounded-lg", children: [_jsx(Heart, { className: "h-12 w-12 text-purple-600 mx-auto mb-4" }), _jsx("h3", { className: "font-semibold text-purple-900 mb-2", children: "Employee Experience" }), _jsxs("p", { className: "text-sm text-purple-700", children: [employeeExperienceQuestions.length, " questions"] }), _jsx("p", { className: "text-xs text-purple-600 mt-2", children: "\u2248 5-10 minutes" })] })] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg max-w-2xl mx-auto", children: [_jsx("h4", { className: "font-medium mb-2", children: "Important Notes:" }), _jsxs("ul", { className: "text-sm text-gray-600 space-y-1", children: [_jsx("li", { children: "\u2022 Your responses are confidential and will be aggregated with others" }), _jsx("li", { children: "\u2022 You can save your progress and return later" }), _jsx("li", { children: "\u2022 Complete all sections to contribute to the dashboard insights" }), _jsx("li", { children: "\u2022 Estimated total time: 30-45 minutes" })] })] }), _jsx(Button, { onClick: () => setCurrentSection('ai-readiness'), size: "lg", className: "px-8", children: "Start Survey" })] })] }) }));
    }
    if (currentSection === 'complete') {
        return (_jsx("div", { className: "max-w-4xl mx-auto space-y-6", children: _jsx(Card, { className: "text-center p-8", children: _jsxs("div", { className: "flex flex-col items-center space-y-6", children: [_jsx(Award, { className: "h-20 w-20 text-green-600" }), _jsx("h2", { className: "text-3xl font-bold text-green-700", children: "Survey Complete!" }), _jsx("p", { className: "text-lg text-gray-600 max-w-2xl", children: "Thank you for taking the time to complete the LEAP Survey. Your responses have been recorded and will contribute to valuable organizational insights." }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl", children: [_jsxs("div", { className: "text-center p-4 bg-green-50 rounded-lg", children: [_jsx(CheckCircle, { className: "h-8 w-8 text-green-600 mx-auto mb-2" }), _jsx("div", { className: "text-2xl font-bold text-green-700", children: aiReadinessQuestions.filter(q => responses[q.id]).length }), _jsx("div", { className: "text-sm text-green-600", children: "AI Readiness" })] }), _jsxs("div", { className: "text-center p-4 bg-green-50 rounded-lg", children: [_jsx(CheckCircle, { className: "h-8 w-8 text-green-600 mx-auto mb-2" }), _jsx("div", { className: "text-2xl font-bold text-green-700", children: leadershipQuestions.filter(q => responses[q.id]).length }), _jsx("div", { className: "text-sm text-green-600", children: "Leadership" })] }), _jsxs("div", { className: "text-center p-4 bg-green-50 rounded-lg", children: [_jsx(CheckCircle, { className: "h-8 w-8 text-green-600 mx-auto mb-2" }), _jsx("div", { className: "text-2xl font-bold text-green-700", children: employeeExperienceQuestions.filter(q => responses[q.id]).length }), _jsx("div", { className: "text-sm text-green-600", children: "Employee Experience" })] })] }), _jsx(Button, { onClick: () => onComplete(responses), size: "lg", className: "px-8", children: "View Dashboard Results" })] }) }) }));
    }
    // Progress header for all survey sections
    const progressHeader = (_jsx(Card, { className: "mb-6", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h2", { className: "text-xl font-semibold", children: "LEAP Survey Progress" }), _jsxs("span", { className: "text-sm text-gray-600", children: [totalAnswered, " of ", totalQuestions, " questions answered"] })] }), _jsx(Progress, { value: overallProgress, className: "h-2 mb-3" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${completedSections.has('ai-readiness') ? 'bg-green-500' : currentSection === 'ai-readiness' ? 'bg-blue-500' : 'bg-gray-300'}` }), _jsx("span", { children: "AI Readiness" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${completedSections.has('leadership') ? 'bg-green-500' : currentSection === 'leadership' ? 'bg-blue-500' : 'bg-gray-300'}` }), _jsx("span", { children: "Leadership" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${completedSections.has('employee-experience') ? 'bg-green-500' : currentSection === 'employee-experience' ? 'bg-blue-500' : 'bg-gray-300'}` }), _jsx("span", { children: "Employee Experience" })] })] })] }) }));
    return (_jsxs("div", { className: "max-w-4xl mx-auto", children: [progressHeader, currentSection === 'ai-readiness' && (_jsx(SurveySection, { title: "AI Readiness Assessment", description: "These questions help us understand your organization's preparedness and approach to artificial intelligence adoption.", questions: aiReadinessQuestions, responses: responses, onResponseChange: handleResponseChange, onComplete: () => handleSectionComplete('ai-readiness'), isCompleted: completedSections.has('ai-readiness') })), currentSection === 'leadership' && (_jsx(SurveySection, { title: "Leadership Module", description: "These questions assess leadership effectiveness across different dimensions of team performance.", questions: leadershipQuestions, responses: responses, onResponseChange: handleResponseChange, onComplete: () => handleSectionComplete('leadership'), isCompleted: completedSections.has('leadership') })), currentSection === 'employee-experience' && (_jsx(SurveySection, { title: "Employee Experience", description: "These questions explore your experience as an employee and your relationship with the organization.", questions: employeeExperienceQuestions, responses: responses, onResponseChange: handleResponseChange, onComplete: () => handleSectionComplete('employee-experience'), isCompleted: completedSections.has('employee-experience') }))] }));
}
