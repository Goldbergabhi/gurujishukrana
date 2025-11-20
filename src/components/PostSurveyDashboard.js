import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Brain, Users, Heart, ChevronRight, Calendar, Building2, Eye } from 'lucide-react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SurveyCampaignSelector } from "./SurveyCampaignSelector";
import { SummaryBanner } from "./SummaryBanner";
import { ModuleSnapshot } from "./ModuleSnapshot";
import { PostSurveyResponsesPanel } from "./PostSurveyResponsesPanel";
import { PostSurveyResultsPanel } from "./PostSurveyResultsPanel";
import { ControlStrip } from "./ControlStrip";
export function PostSurveyDashboard({ completedModule, onBackToDashboard, surveyResponses, mockData, isStandalone = false }) {
    const [selectedModule, setSelectedModule] = useState(completedModule);
    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [activeTab, setActiveTab] = useState('results');
    const moduleConfigs = {
        'ai-readiness': {
            id: 'ai-readiness',
            name: 'AI Readiness',
            icon: _jsx(Brain, { className: "h-5 w-5" }),
            color: 'text-blue-700',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        'leadership': {
            id: 'leadership',
            name: 'Leadership',
            icon: _jsx(Users, { className: "h-5 w-5" }),
            color: 'text-green-700',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        'employee-experience': {
            id: 'employee-experience',
            name: 'Employee Experience',
            icon: _jsx(Heart, { className: "h-5 w-5" }),
            color: 'text-purple-700',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        }
    };
    // Mock survey campaigns data
    const surveyCampaigns = useMemo(() => [
        {
            id: '1',
            title: 'AI Readiness Pulse Q4 2024',
            status: 'live',
            moduleId: 'ai-readiness',
            startDate: '2024-10-01',
            participantCount: 127,
            completionRate: 89,
            isActive: true
        },
        {
            id: '2',
            title: 'Leadership Assessment Q4 2024',
            status: 'live',
            moduleId: 'leadership',
            startDate: '2024-09-15',
            participantCount: 98,
            completionRate: 76,
            isActive: true
        },
        {
            id: '3',
            title: 'Employee Experience Survey Q4 2024',
            status: 'live',
            moduleId: 'employee-experience',
            startDate: '2024-09-20',
            participantCount: 156,
            completionRate: 82,
            isActive: true
        },
        {
            id: '4',
            title: 'Leadership Deep Dive Q3 2024',
            status: 'closed',
            moduleId: 'leadership',
            startDate: '2024-07-01',
            endDate: '2024-08-15',
            participantCount: 134,
            completionRate: 95,
            isActive: false
        }
    ], []);
    const currentModule = moduleConfigs[selectedModule];
    const currentCampaigns = surveyCampaigns.filter(c => c.moduleId === selectedModule);
    const activeCampaign = currentCampaigns.find(c => c.id === selectedCampaign) || currentCampaigns.find(c => c.isActive) || currentCampaigns[0];
    // Set initial campaign selection
    useMemo(() => {
        if (!selectedCampaign && activeCampaign) {
            setSelectedCampaign(activeCampaign.id);
        }
    }, [selectedModule, activeCampaign, selectedCampaign]);
    const completedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white border-b border-gray-200", children: _jsxs("div", { className: "px-6 py-4", children: [!isStandalone && (_jsxs("nav", { className: "flex items-center space-x-2 text-sm text-gray-600 mb-3", children: [_jsx("button", { onClick: onBackToDashboard, className: "hover:text-gray-900 transition-colors", children: "Overview" }), _jsx(ChevronRight, { className: "h-4 w-4" }), _jsx("span", { className: "text-gray-900", children: currentModule.name }), _jsx(ChevronRight, { className: "h-4 w-4" }), _jsx("span", { className: "text-gray-900", children: "Post-Survey Summary" })] })), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `p-2 rounded-lg ${currentModule.bgColor} ${currentModule.borderColor} border`, children: _jsx("div", { className: currentModule.color, children: currentModule.icon }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: isStandalone ? `${currentModule.name} Survey Results` : `Module Insights – ${currentModule.name}` }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600 mt-1", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsxs("span", { children: ["Completed: ", completedDate] })] }), !isStandalone && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Building2, { className: "h-4 w-4" }), _jsx("span", { children: "Company: Novatek Labs" })] }))] })] })] }), !isStandalone && (_jsxs(Button, { variant: "outline", onClick: onBackToDashboard, className: "gap-2", children: [_jsx(Eye, { className: "h-4 w-4" }), "Back to Dashboard"] }))] })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex flex-col lg:flex-row gap-4", children: [_jsx(Card, { className: "flex-1", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `p-2 rounded-lg ${currentModule.bgColor} ${currentModule.borderColor} border`, children: _jsx("div", { className: currentModule.color, children: currentModule.icon }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: currentModule.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Survey completed on ", completedDate] })] }), _jsx(Badge, { variant: "outline", className: "ml-auto bg-green-50 text-green-700 border-green-200", children: "Completed" })] }) }) }), _jsx(SurveyCampaignSelector, { campaigns: currentCampaigns, selectedCampaign: selectedCampaign, onCampaignChange: setSelectedCampaign })] }), _jsx(SummaryBanner, { moduleName: currentModule.name, moduleColor: currentModule.color }), _jsx(ModuleSnapshot, { module: selectedModule, campaign: activeCampaign, surveyResponses: surveyResponses, mockData: mockData }), _jsxs(Tabs, { value: activeTab, onValueChange: (value) => setActiveTab(value), children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2 max-w-md", children: [_jsx(TabsTrigger, { value: "responses", children: "Demographics" }), _jsx(TabsTrigger, { value: "results", children: "Survey Results" })] }), _jsx(TabsContent, { value: "responses", className: "mt-6", children: _jsx(PostSurveyResponsesPanel, { module: selectedModule, campaign: activeCampaign, mockData: mockData }) }), _jsx(TabsContent, { value: "results", className: "mt-6", children: _jsx(PostSurveyResultsPanel, { module: selectedModule, campaign: activeCampaign, surveyResponses: surveyResponses, mockData: mockData }) })] }), !isStandalone && (_jsx(ControlStrip, { campaign: activeCampaign, onCampaignUpdate: (updatedCampaign) => {
                            // Handle campaign updates
                            console.log('Campaign updated:', updatedCampaign);
                        } }))] })] }));
}
