import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Copy, Plus, ExternalLink, Eye, Settings, Users, BarChart3 } from "lucide-react";
import { createSurveyConfig, generateSurveyUrls, mockSurveyConfigs } from "../utils/surveyManagement";
import { toast } from "sonner@2.0.3";
export function SurveyManagement() {
    const [surveys, setSurveys] = useState(mockSurveyConfigs);
    // Default to a neutral primary module (AI Readiness is not mandatory)
    const [newSurvey, setNewSurvey] = useState({
        companyName: '',
        surveyType: 'managers',
        primaryModule: 'leadership',
        modules: ['leadership']
    });
    const handleCreateSurvey = () => {
        if (!newSurvey.companyName.trim()) {
            toast.error("Please enter a company name");
            return;
        }
        const surveyConfig = createSurveyConfig(newSurvey.companyName, newSurvey.surveyType, newSurvey.modules, newSurvey.primaryModule);
        setSurveys([surveyConfig, ...surveys]);
        setNewSurvey({
            companyName: '',
            surveyType: 'managers',
            primaryModule: 'ai-readiness',
            modules: ['ai-readiness']
        });
        toast.success(`Survey created for ${newSurvey.companyName}!`);
    };
    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 border-green-200';
            case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    const getTypeColor = (type) => {
        switch (type) {
            case 'managers': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'employees': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'mixed': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Survey Management" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Create and manage AI readiness surveys for your clients" })] }) }), _jsxs(Tabs, { defaultValue: "surveys", className: "space-y-6", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "surveys", children: "All Surveys" }), _jsx(TabsTrigger, { value: "create", children: "Create New" }), _jsx(TabsTrigger, { value: "analytics", children: "Analytics" })] }), _jsx(TabsContent, { value: "create", className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Plus, { className: "h-5 w-5" }), "Create New Survey"] }), _jsx(CardDescription, { children: "Generate a custom survey for a client company. Choose from AI Readiness (6 questions), Leadership Effectiveness (8 questions), or Employee Experience (16 questions) modules." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "company-name", children: "Company Name" }), _jsx(Input, { id: "company-name", placeholder: "e.g., TechCorp Inc", value: newSurvey.companyName, onChange: (e) => setNewSurvey({ ...newSurvey, companyName: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "survey-type", children: "Survey Type" }), _jsxs(Select, { value: newSurvey.surveyType, onValueChange: (value) => setNewSurvey({ ...newSurvey, surveyType: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "managers", children: "Managers Only" }), _jsx(SelectItem, { value: "employees", children: "Employees Only" }), _jsx(SelectItem, { value: "mixed", children: "Mixed Audience" })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "primary-module", children: "Primary Module" }), _jsxs(Select, { value: newSurvey.primaryModule, onValueChange: (value) => {
                                                                const primaryModule = value;
                                                                setNewSurvey({
                                                                    ...newSurvey,
                                                                    primaryModule,
                                                                    modules: [primaryModule] // Reset to just primary module
                                                                });
                                                            }, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "ai-readiness", children: "AI Readiness Assessment" }), _jsx(SelectItem, { value: "leadership", children: "Leadership Effectiveness" }), _jsx(SelectItem, { value: "employee-experience", children: "Employee Experience" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Selected Module" }), _jsx("p", { className: "text-xs text-gray-500", children: "Select a single primary module for the client \u2014 one module per company." })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Selected Modules Summary" }), _jsx("div", { className: "flex flex-wrap gap-2", children: newSurvey.modules.map((module) => (_jsxs(Badge, { variant: "outline", className: `${module === newSurvey.primaryModule
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                            : 'bg-green-50 text-green-700 border-green-200'}`, children: [module === 'ai-readiness' ? 'AI Readiness (6 questions)' :
                                                                module === 'leadership' ? 'Leadership (8 questions)' :
                                                                    'Employee Experience (16 questions)', module === newSurvey.primaryModule && ' - Primary'] }, module))) }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-4 space-y-3", children: [_jsx("h4", { className: "font-medium text-gray-900", children: "Calculation Methods:" }), newSurvey.modules.map((module) => (_jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "font-medium text-gray-700", children: module === 'ai-readiness' ? '🤖 AI Readiness:' :
                                                                        module === 'leadership' ? '👥 Leadership:' :
                                                                            '❤️ Employee Experience:' }), _jsx("span", { className: "text-gray-600 ml-2", children: module === 'ai-readiness' ? 'Average % of positive responses (options 4 or 5)' :
                                                                        module === 'leadership' ? 'Average cumulative score across all questions' :
                                                                            'Favorable ratings % (responses 7-10 on 10-point scale)' })] }, module)))] })] }), _jsxs(Button, { onClick: handleCreateSurvey, className: "w-full", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Create Survey"] })] })] }) }), _jsx(TabsContent, { value: "surveys", className: "space-y-4", children: surveys.map((survey) => {
                            const urls = generateSurveyUrls(survey);
                            return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-lg", children: survey.companyName }), _jsxs(CardDescription, { children: ["Created ", new Date(survey.createdDate).toLocaleDateString(), " \u2022 ", survey.targetAudience] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", className: getStatusColor(survey.status), children: survey.status.charAt(0).toUpperCase() + survey.status.slice(1) }), _jsx(Badge, { variant: "outline", className: getTypeColor(survey.surveyType), children: survey.surveyType })] })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Survey ID:" }), _jsx("p", { className: "text-gray-600 font-mono text-xs mt-1", children: survey.id })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Responses:" }), _jsx("p", { className: "text-gray-900 font-semibold", children: survey.responseCount })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "Primary Module:" }), _jsx("p", { className: "text-gray-900 font-semibold capitalize", children: survey.primaryModule.replace('-', ' ') })] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-700", children: "All Modules:" }), _jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: survey.modules.map(module => (_jsx("span", { className: `px-2 py-1 text-xs rounded ${module === survey.primaryModule
                                                                        ? 'bg-blue-100 text-blue-800 font-medium'
                                                                        : 'bg-gray-100 text-gray-600'}`, children: module.replace('-', ' ') }, module))) })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "Survey Link" }), _jsx("p", { className: "text-sm text-gray-600", children: "Send this to participants" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => copyToClipboard(urls.surveyUrl, 'Survey link'), children: _jsx(Copy, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => window.open(urls.surveyUrl, '_blank'), children: _jsx(ExternalLink, { className: "h-4 w-4" }) })] })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-blue-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "Dashboard Link" }), _jsx("p", { className: "text-sm text-gray-600", children: "Send this to see results" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => copyToClipboard(urls.dashboardUrl, 'Dashboard link'), children: _jsx(Copy, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => window.open(urls.dashboardUrl, '_blank'), children: _jsx(Eye, { className: "h-4 w-4" }) })] })] })] }), _jsxs("div", { className: "flex items-center gap-2 pt-2", children: [_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Settings, { className: "h-4 w-4 mr-2" }), "Settings"] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Users, { className: "h-4 w-4 mr-2" }), "Participants"] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(BarChart3, { className: "h-4 w-4 mr-2" }), "Analytics"] })] })] })] }, survey.id));
                        }) }), _jsxs(TabsContent, { value: "analytics", className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-lg", children: "Total Surveys" }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-3xl font-bold text-blue-600", children: surveys.length }), _jsx("p", { className: "text-sm text-gray-600", children: "Active campaigns" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-lg", children: "Total Responses" }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-3xl font-bold text-green-600", children: surveys.reduce((sum, survey) => sum + survey.responseCount, 0) }), _jsx("p", { className: "text-sm text-gray-600", children: "Across all surveys" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-lg", children: "Active Surveys" }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-3xl font-bold text-orange-600", children: surveys.filter(s => s.status === 'active').length }), _jsx("p", { className: "text-sm text-gray-600", children: "Currently collecting data" })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Survey Performance" }), _jsx(CardDescription, { children: "Response rates by company and survey type" })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: surveys.map((survey) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: survey.companyName }), _jsxs("p", { className: "text-sm text-gray-600", children: [survey.surveyType, " \u2022 ", survey.targetAudience] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-semibold", children: [survey.responseCount, " responses"] }), _jsx(Badge, { variant: "outline", className: getStatusColor(survey.status), children: survey.status })] })] }, survey.id))) }) })] })] })] })] }));
}
