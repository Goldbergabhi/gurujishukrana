import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Brain, Users, Heart, ChevronRight, CheckCircle, Clock, Award, ArrowLeft } from 'lucide-react';
import { SurveyQuestion } from './SurveyQuestion';
import { aiReadinessQuestions, leadershipQuestions, employeeExperienceQuestions } from '../utils/surveyData';
export function ModularSurvey({ onComplete, specificModule }) {
    // If specificModule is provided, start directly in module view
    const [currentView, setCurrentView] = useState(specificModule ? 'module' : 'overview');
    const [activeModule, setActiveModule] = useState(specificModule || null);
    const [responses, setResponses] = useState({});
    const [completedModules, setCompletedModules] = useState(new Set());
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const allModules = [
        {
            id: 'ai-readiness',
            title: 'AI Readiness Assessment',
            description: 'Evaluate your organization\'s preparedness for AI adoption.',
            icon: _jsx(Brain, { className: "h-6 w-6" }),
            questions: aiReadinessQuestions,
            estimatedTime: '15-20 min',
            color: 'blue'
        },
        {
            id: 'leadership',
            title: 'Leadership Excellence Module',
            description: 'Assess leadership effectiveness across key dimensions.',
            icon: _jsx(Users, { className: "h-6 w-6" }),
            questions: leadershipQuestions,
            estimatedTime: '12-15 min',
            color: 'green'
        },
        {
            id: 'employee-experience',
            title: 'Employee Experience Module',
            description: 'Measure employee satisfaction and engagement.',
            icon: _jsx(Heart, { className: "h-6 w-6" }),
            questions: employeeExperienceQuestions,
            estimatedTime: '8-10 min',
            color: 'purple'
        }
    ];
    // Filter to only show the specific module if provided
    const modules = specificModule
        ? allModules.filter(m => m.id === specificModule)
        : allModules;
    const handleResponseChange = (questionId, value) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: value
        }));
    };
    const handleModuleStart = (moduleId) => {
        setActiveModule(moduleId);
        setCurrentView('module');
        setCurrentQuestionIndex(0);
    };
    const handleModuleComplete = () => {
        if (activeModule) {
            setCompletedModules(prev => new Set([...prev, activeModule]));
            // If this is a standalone survey (specificModule), complete immediately
            if (specificModule) {
                onComplete(responses);
            }
            else {
                setActiveModule(null);
                setCurrentView('overview');
                setCurrentQuestionIndex(0);
            }
        }
    };
    const handleSurveyComplete = () => {
        // For multi-module surveys
        if (!specificModule) {
            setCurrentView('complete');
        }
        else {
            // For standalone, this shouldn't be reached
            onComplete(responses);
        }
    };
    const handleNextQuestion = () => {
        const currentModule = modules.find(m => m.id === activeModule);
        if (currentModule && currentQuestionIndex < currentModule.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };
    const getModuleProgress = (module) => {
        const answered = module.questions.filter(q => responses[q.id]).length;
        return (answered / module.questions.length) * 100;
    };
    const getTotalProgress = () => {
        const totalQuestions = modules.reduce((acc, module) => acc + module.questions.length, 0);
        const totalAnswered = Object.keys(responses).length;
        return (totalAnswered / totalQuestions) * 100;
    };
    const allModulesCompleted = completedModules.size === modules.length;
    if (currentView === 'complete') {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 p-6", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsx(Card, { className: "shadow-lg", children: _jsx(CardContent, { className: "p-12 text-center", children: _jsxs("div", { className: "flex flex-col items-center space-y-8", children: [_jsx("div", { className: "w-24 h-24 bg-green-100 rounded-full flex items-center justify-center", children: _jsx(Award, { className: "h-12 w-12 text-green-600" }) }), _jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-headline text-gray-900", children: "Survey Completed Successfully!" }), _jsx("p", { className: "text-subheading max-w-2xl", children: "Thank you for your participation in the LEAP Survey. Your insights are valuable for organizational growth." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl", children: modules.map((module) => (_jsx("div", { className: "p-6 bg-gray-50 rounded-lg border", children: _jsxs("div", { className: "flex flex-col items-center text-center space-y-3", children: [_jsx("div", { className: "p-3 bg-white rounded-lg", children: module.icon }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: module.questions.filter(q => responses[q.id]).length }), _jsxs("div", { className: "text-sm font-medium text-gray-600", children: [module.title.split(' ')[0], " ", module.title.split(' ')[1]] }), _jsxs("div", { className: "text-xs text-gray-500", children: [module.questions.length, " questions"] })] }), _jsx(CheckCircle, { className: "h-6 w-6 text-green-500" })] }) }, module.id))) }), _jsxs(Button, { onClick: () => onComplete(responses), size: "lg", className: "px-8 py-4 text-lg", children: ["View Dashboard Results", _jsx(ChevronRight, { className: "ml-2 h-5 w-5" })] })] }) }) }) }) }));
    }
    if (currentView === 'module' && activeModule) {
        const currentModule = modules.find(m => m.id === activeModule);
        const currentQuestion = currentModule.questions[currentQuestionIndex];
        const moduleProgress = ((currentQuestionIndex + 1) / currentModule.questions.length) * 100;
        const isLastQuestion = currentQuestionIndex === currentModule.questions.length - 1;
        const canProceed = responses[currentQuestion.id];
        return (_jsx("div", { className: "min-h-screen bg-gray-50 p-6", children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsx(Card, { children: _jsxs(CardHeader, { className: "pb-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(Button, { variant: "ghost", onClick: () => setCurrentView('overview'), className: "flex items-center gap-2", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to Overview"] }), _jsxs(Badge, { variant: "secondary", children: ["Question ", currentQuestionIndex + 1, " of ", currentModule.questions.length] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 bg-gray-100 rounded-lg", children: currentModule.icon }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight", children: currentModule.title }), _jsx("p", { className: "text-subheading", children: currentModule.description })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Module Progress" }), _jsxs("span", { children: [Math.round(moduleProgress), "% Complete"] })] }), _jsx(Progress, { value: moduleProgress, className: "h-3" })] })] })] }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-8", children: _jsx(SurveyQuestion, { question: currentQuestion.question, questionId: currentQuestion.id, scale: currentQuestion.scale, value: responses[currentQuestion.id], onChange: handleResponseChange, section: currentQuestion.section }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs(Button, { variant: "outline", onClick: handlePrevQuestion, disabled: currentQuestionIndex === 0, children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Previous"] }), _jsx("div", { className: "text-center", children: _jsxs("div", { className: "text-sm text-gray-500", children: [currentQuestionIndex + 1, " of ", currentModule.questions.length, " questions"] }) }), isLastQuestion ? (_jsxs(Button, { onClick: handleModuleComplete, disabled: !canProceed, children: ["Complete Module", _jsx(CheckCircle, { className: "ml-2 h-4 w-4" })] })) : (_jsxs(Button, { onClick: handleNextQuestion, disabled: !canProceed, children: ["Next", _jsx(ChevronRight, { className: "ml-2 h-4 w-4" })] }))] }) }) })] }) }));
    }
    // Overview
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-6", children: _jsxs("div", { className: "max-w-6xl mx-auto space-y-8", children: [_jsxs("div", { className: "text-center space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "text-display bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent", children: "LEAP Survey Platform" }), _jsx("p", { className: "text-subheading max-w-3xl mx-auto", children: "A comprehensive assessment platform measuring AI Readiness, Leadership Excellence, and Employee Experience." })] }), _jsx(Card, { className: "max-w-2xl mx-auto", children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-lg font-semibold", children: "Overall Progress" }), _jsxs("span", { className: "text-lg font-bold text-blue-600", children: [Math.round(getTotalProgress()), "%"] })] }), _jsx(Progress, { value: getTotalProgress(), className: "h-4" }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600", children: [_jsxs("span", { children: [Object.keys(responses).length, " responses completed"] }), _jsxs("span", { children: [modules.reduce((acc, m) => acc + m.questions.length, 0), " total questions"] })] })] }) }) })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: modules.map((module) => {
                        const progress = getModuleProgress(module);
                        const isCompleted = completedModules.has(module.id);
                        const answeredQuestions = module.questions.filter(q => responses[q.id]).length;
                        return (_jsxs(Card, { className: "shadow-lg hover:shadow-xl transition-shadow", children: [_jsxs(CardHeader, { className: "bg-gray-50", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "p-3 bg-white rounded-lg", children: module.icon }), isCompleted && (_jsxs("div", { className: "flex items-center gap-2 text-green-600", children: [_jsx(CheckCircle, { className: "h-6 w-6" }), _jsx("span", { className: "font-medium", children: "Complete" })] }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-xl font-bold tracking-tight", children: module.title }), _jsx("p", { className: "text-sm text-gray-600 leading-relaxed", children: module.description })] })] }), _jsxs(CardContent, { className: "p-6 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "text-center p-3 bg-gray-50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold", children: module.questions.length }), _jsx("div", { className: "text-xs text-gray-600", children: "Questions" })] }), _jsxs("div", { className: "text-center p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-center gap-1", children: [_jsx(Clock, { className: "h-4 w-4 text-gray-600" }), _jsx("span", { className: "text-sm font-medium", children: module.estimatedTime })] }), _jsx("div", { className: "text-xs text-gray-600", children: "Duration" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [answeredQuestions, "/", module.questions.length] })] }), _jsx(Progress, { value: progress, className: "h-2" })] }), _jsx(Button, { onClick: () => handleModuleStart(module.id), className: "w-full py-3", disabled: isCompleted && progress === 100, children: isCompleted ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "mr-2 h-5 w-5" }), "Review Responses"] })) : progress > 0 ? (_jsxs(_Fragment, { children: ["Continue Module", _jsx(ChevronRight, { className: "ml-2 h-5 w-5" })] })) : (_jsxs(_Fragment, { children: ["Start Module", _jsx(ChevronRight, { className: "ml-2 h-5 w-5" })] })) })] })] }, module.id));
                    }) }), allModulesCompleted && (_jsx("div", { className: "text-center", children: _jsx(Card, { className: "max-w-2xl mx-auto bg-green-50 border-green-200", children: _jsx(CardContent, { className: "p-8", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-center gap-3", children: [_jsx(CheckCircle, { className: "h-8 w-8 text-green-600" }), _jsx("h3", { className: "text-2xl font-bold", children: "All Modules Completed!" })] }), _jsx("p", { className: "text-gray-600", children: "Congratulations! You've successfully completed all survey modules. Click below to submit your responses and view the dashboard." }), _jsxs(Button, { onClick: handleSurveyComplete, size: "lg", className: "px-8 py-4 text-lg", children: ["Complete Survey & View Results", _jsx(Award, { className: "ml-2 h-6 w-6" })] })] }) }) }) }))] }) }));
}
