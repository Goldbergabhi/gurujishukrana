import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { SurveyQuestion } from './SurveyQuestion';
export function SurveySection({ title, description, questions, responses, onResponseChange, onComplete, isCompleted }) {
    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 5;
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const currentQuestions = questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);
    const answeredQuestions = questions.filter(q => responses[q.id]).length;
    const progressPercentage = (answeredQuestions / questions.length) * 100;
    const canGoNext = currentPage < totalPages - 1;
    const canGoPrev = currentPage > 0;
    const handleNext = () => {
        if (canGoNext) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handlePrev = () => {
        if (canGoPrev) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handleComplete = () => {
        if (answeredQuestions === questions.length) {
            onComplete();
        }
    };
    if (isCompleted) {
        return (_jsx(Card, { className: "text-center p-8", children: _jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsx(CheckCircle, { className: "h-16 w-16 text-green-600" }), _jsxs("h3", { className: "text-xl font-semibold text-green-700", children: [title, " - Completed!"] }), _jsx("p", { className: "text-gray-600", children: "Thank you for completing this section." }), _jsxs("div", { className: "text-sm text-gray-500", children: [answeredQuestions, " of ", questions.length, " questions answered"] })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center justify-between", children: [_jsx("span", { children: title }), _jsxs("span", { className: "text-sm font-normal text-gray-500", children: ["Page ", currentPage + 1, " of ", totalPages] })] }), _jsx("p", { className: "text-sm text-gray-600", children: description })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { children: ["Progress: ", answeredQuestions, " of ", questions.length, " questions"] }), _jsxs("span", { children: [progressPercentage.toFixed(0), "% complete"] })] }), _jsx(Progress, { value: progressPercentage, className: "h-2" })] }) })] }), _jsx("div", { className: "space-y-4", children: currentQuestions.map((question) => (_jsx(SurveyQuestion, { question: question.question, questionId: question.id, scale: question.scale, value: responses[question.id], onChange: onResponseChange, section: question.section !== title ? question.section : undefined }, question.id))) }), _jsx(Card, { children: _jsxs(CardContent, { className: "flex justify-between items-center p-4", children: [_jsxs(Button, { variant: "outline", onClick: handlePrev, disabled: !canGoPrev, className: "flex items-center gap-2", children: [_jsx(ChevronLeft, { className: "h-4 w-4" }), "Previous"] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Questions ", currentPage * questionsPerPage + 1, " - ", Math.min((currentPage + 1) * questionsPerPage, questions.length), " of ", questions.length] }), canGoNext ? (_jsxs(Button, { onClick: handleNext, className: "flex items-center gap-2", children: ["Next", _jsx(ChevronRight, { className: "h-4 w-4" })] })) : (_jsxs(Button, { onClick: handleComplete, disabled: answeredQuestions < questions.length, className: "flex items-center gap-2 bg-green-600 hover:bg-green-700", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "Complete Section"] }))] }) }), answeredQuestions < questions.length && (_jsx(Card, { className: "bg-amber-50 border-amber-200", children: _jsx(CardContent, { className: "p-4", children: _jsxs("p", { className: "text-sm text-amber-800", children: ["Please answer all questions to complete this section.", questions.length - answeredQuestions, " questions remaining."] }) }) }))] }));
}
