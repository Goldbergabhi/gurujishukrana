import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// LEAP Survey Dashboard - Real-time MongoDB Integration
// This version replaces mock data with actual API calls
import { useState, useMemo, useCallback } from 'react';
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { Sidebar } from "./components/Sidebar";
import { OverviewDashboard } from "./components/OverviewDashboard";
import { ModuleSurveyTab } from "./components/ModuleSurveyTab";
import { ModularSurvey } from "./components/ModularSurvey";
import { PostSurveyDashboard } from "./components/PostSurveyDashboard";
import { SurveyManagement } from "./components/SurveyManagement";
import { WelcomeBanner } from "./components/WelcomeBanner";
import { parseUrlParams } from "./utils/surveyManagement";
import { useOverviewAnalytics, useAllModuleAnalytics } from "./hooks/useAnalytics";
import { useCampaign } from "./hooks/useCampaigns";
import { api } from "./utils/api";
// Loading Component
function LoadingSpinner({ message = "Loading..." }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" }), _jsx("p", { className: "text-muted-foreground", children: message })] }));
}
// Error Component
function ErrorDisplay({ error, onRetry }) {
    return (_jsx("div", { className: "flex flex-col items-center justify-center min-h-screen p-6", children: _jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center", children: [_jsx("h3", { className: "text-lg font-semibold text-red-900 mb-2", children: "Error Loading Data" }), _jsx("p", { className: "text-red-700 mb-4", children: error }), _jsx("button", { onClick: onRetry, className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition", children: "Retry" })] }) }));
}
export default function App() {
    // Parse URL parameters
    const urlParams = useMemo(() => parseUrlParams(), []);
    // Fetch campaign data if surveyId is provided
    const { data: currentSurvey, loading: campaignLoading, error: campaignError, refetch: refetchCampaign } = useCampaign(urlParams.surveyId);
    // Determine available modules
    const availableModules = useMemo(() => {
        if (currentSurvey) {
            return currentSurvey.modules;
        }
        if (urlParams.modules.length > 0) {
            return urlParams.modules;
        }
        return ['ai-readiness', 'leadership', 'employee-experience'];
    }, [currentSurvey, urlParams.modules]);
    // Check if this is a direct survey link
    const isDirectSurveyLink = useMemo(() => {
        return availableModules.length === 1 && urlParams.mode === 'survey';
    }, [availableModules, urlParams.mode]);
    // Fetch analytics data
    const { data: overviewData, loading: overviewLoading, error: overviewError, refetch: refetchOverview } = useOverviewAnalytics(urlParams.surveyId);
    const moduleAnalytics = useAllModuleAnalytics(urlParams.surveyId);
    // Local state
    const [activeModule, setActiveModule] = useState(urlParams.primaryModule || (availableModules.length === 1 ? availableModules[0] : 'overview'));
    const [activeSubTab, setActiveSubTab] = useState('survey');
    const [mode, setMode] = useState(urlParams.mode === 'survey' || isDirectSurveyLink ? 'survey' : 'dashboard');
    const [surveyResponses, setSurveyResponses] = useState({});
    const [completedModule, setCompletedModule] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Survey status tracking
    const surveyStatus = useMemo(() => {
        const aiResponses = Object.keys(surveyResponses).filter(key => key.startsWith('ai-')).length;
        const leadershipResponses = Object.keys(surveyResponses).filter(key => key.startsWith('leadership-')).length;
        const eeResponses = Object.keys(surveyResponses).filter(key => key.startsWith('ee-')).length;
        return {
            aiReadiness: aiResponses > 0 ? (aiResponses >= 6 ? 'completed' : 'in-progress') : 'not-started',
            leadership: leadershipResponses > 0 ? (leadershipResponses >= 8 ? 'completed' : 'in-progress') : 'not-started',
            employeeExperience: eeResponses > 0 ? (eeResponses >= 16 ? 'completed' : 'in-progress') : 'not-started'
        };
    }, [surveyResponses]);
    // Handle survey completion and submission to MongoDB
    const handleSurveyComplete = useCallback(async (responses) => {
        setSurveyResponses(responses);
        // Determine which module was completed
        const aiResponses = Object.keys(responses).filter(key => key.startsWith('ai-')).length;
        const leadershipResponses = Object.keys(responses).filter(key => key.startsWith('leadership-')).length;
        const eeResponses = Object.keys(responses).filter(key => key.startsWith('ee-')).length;
        let completed = '';
        let module = '';
        if (aiResponses >= 6 && availableModules.includes('ai-readiness')) {
            completed = 'ai-readiness';
            module = 'ai-readiness';
        }
        else if (leadershipResponses >= 8 && availableModules.includes('leadership')) {
            completed = 'leadership';
            module = 'leadership';
        }
        else if (eeResponses >= 16 && availableModules.includes('employee-experience')) {
            completed = 'employee-experience';
            module = 'employee-experience';
        }
        // Submit to MongoDB
        if (completed && module) {
            setIsSubmitting(true);
            try {
                // Convert string responses to numbers
                const numericResponses = {};
                Object.entries(responses).forEach(([key, value]) => {
                    numericResponses[key] = parseInt(value);
                });
                await api.responses.submit({
                    surveyId: urlParams.surveyId || 'default',
                    module,
                    responses: numericResponses,
                    metadata: {
                        userId: `user-${Date.now()}`, // Generate or get from auth
                        department: undefined,
                        role: undefined,
                    }
                });
                toast.success('Survey submitted successfully!');
                setCompletedModule(completed);
                setMode('post-survey');
                // Refresh analytics data
                refetchOverview();
                moduleAnalytics.refetchAll();
                if (currentSurvey)
                    refetchCampaign();
            }
            catch (error) {
                console.error('Error submitting survey:', error);
                toast.error('Failed to submit survey. Please try again.');
            }
            finally {
                setIsSubmitting(false);
            }
        }
        else {
            setMode('dashboard');
            setActiveModule('overview');
        }
    }, [availableModules, urlParams.surveyId, currentSurvey, refetchOverview, moduleAnalytics, refetchCampaign]);
    const handleTakeSurvey = () => {
        setMode('survey');
    };
    const handleBackToDashboard = () => {
        setMode('dashboard');
        setActiveModule('overview');
    };
    const handleModuleChange = (module) => {
        setActiveModule(module);
        if (module !== 'overview') {
            setActiveSubTab('survey');
        }
    };
    // Module configurations
    const moduleConfigs = {
        'ai-readiness': {
            id: 'ai-readiness',
            title: 'AI Readiness Assessment',
            description: 'Evaluate your organization\'s readiness for AI adoption and implementation',
            timeToComplete: '3-5 minutes',
            totalQuestions: 6,
            sections: [
                { name: 'Strategy & Leadership', questions: 2, description: 'Strategic AI vision and leadership commitment' },
                { name: 'Infrastructure & Skills', questions: 2, description: 'Technology infrastructure and team capabilities' },
                { name: 'Data & Culture', questions: 2, description: 'Data governance and organizational culture' }
            ]
        },
        'leadership': {
            id: 'leadership',
            title: 'Leadership Effectiveness',
            description: 'Assess leadership capabilities across multiple dimensions and contexts',
            timeToComplete: '4-6 minutes',
            totalQuestions: 8,
            sections: [
                { name: 'Strategic Vision', questions: 2, description: 'Vision setting and strategic direction' },
                { name: 'Team Development', questions: 2, description: 'People management and growth' },
                { name: 'Communication Excellence', questions: 2, description: 'Communication and listening skills' },
                { name: 'Decision Making', questions: 2, description: 'Decision quality and accountability' }
            ]
        },
        'employee-experience': {
            id: 'employee-experience',
            title: 'Employee Experience',
            description: 'Measure workplace satisfaction and engagement across key experience drivers',
            timeToComplete: '8-10 minutes',
            totalQuestions: 16,
            sections: [
                { name: 'Work Environment', questions: 4, description: 'Physical and cultural workspace' },
                { name: 'Career Growth', questions: 4, description: 'Development and advancement' },
                { name: 'Recognition & Rewards', questions: 4, description: 'Compensation and acknowledgment' },
                { name: 'Work-Life Balance', questions: 4, description: 'Flexibility and wellbeing' }
            ]
        }
    };
    // Show loading state while fetching initial data
    if (campaignLoading || overviewLoading) {
        return _jsx(LoadingSpinner, { message: "Loading survey data from MongoDB..." });
    }
    // Show error state if data fetch fails
    if (campaignError) {
        return _jsx(ErrorDisplay, { error: campaignError, onRetry: refetchCampaign });
    }
    if (overviewError && !overviewData) {
        return _jsx(ErrorDisplay, { error: overviewError, onRetry: refetchOverview });
    }
    // Survey mode
    if (mode === 'survey') {
        return (_jsxs(_Fragment, { children: [isSubmitting && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: _jsx("div", { className: "bg-white rounded-lg p-6", children: _jsx(LoadingSpinner, { message: "Submitting to MongoDB..." }) }) })), _jsx(ModularSurvey, { onComplete: handleSurveyComplete, specificModule: isDirectSurveyLink ? availableModules[0] : undefined })] }));
    }
    // Post-survey results mode
    if (mode === 'post-survey') {
        return (_jsx(PostSurveyDashboard, { completedModule: completedModule, onBackToDashboard: handleBackToDashboard, surveyResponses: surveyResponses, mockData: {
                aiReadinessData: [],
                leadershipData: [],
                employeeExperienceData: []
            }, isStandalone: isDirectSurveyLink }));
    }
    // Main dashboard
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, {}), _jsxs("div", { className: "min-h-screen bg-gray-50 flex", children: [_jsx(Sidebar, { activeModule: activeModule, onModuleChange: handleModuleChange, surveyStatus: surveyStatus, isAdmin: urlParams.isAdmin, availableModules: availableModules }), _jsxs("div", { className: "flex-1 overflow-hidden", children: [_jsx("div", { className: "bg-white border-b border-gray-200 px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: activeModule === 'overview' ?
                                                        (currentSurvey ?
                                                            `${currentSurvey.companyName} - ${currentSurvey.primaryModule === 'ai-readiness' ? 'AI Readiness' :
                                                                currentSurvey.primaryModule === 'leadership' ? 'Leadership' :
                                                                    'Employee Experience'} Overview` :
                                                            'Overview') :
                                                        activeModule === 'ai-readiness' ? 'AI Readiness' :
                                                            activeModule === 'leadership' ? 'Leadership' :
                                                                activeModule === 'employee-experience' ? 'Employee Experience' :
                                                                    activeModule === 'survey-management' ? 'Survey Management' :
                                                                        activeModule.replace('-', ' ') }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: currentSurvey ?
                                                        `${currentSurvey.targetAudience} • ${currentSurvey.responseCount} responses • ${currentSurvey.status}` :
                                                        activeModule === 'overview' ? 'Real-time dashboard summary from MongoDB' :
                                                            activeModule.replace('-', ' ') })] }), _jsxs("div", { className: "flex items-center gap-4", children: [currentSurvey && (_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg px-4 py-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full animate-pulse" }), _jsxs("span", { className: "text-sm font-medium text-blue-800", children: ["Live Data: ", currentSurvey.companyName] })] }) })), overviewData && (_jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg px-4 py-2", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), _jsxs("span", { className: "text-sm font-medium text-green-800", children: [overviewData.totalResponses, " Total Responses"] })] }) }))] })] }) }), _jsxs("div", { className: "p-6 h-full overflow-auto", children: [activeModule === 'overview' && (_jsxs(_Fragment, { children: [_jsx(WelcomeBanner, { currentSurvey: currentSurvey, isAdmin: urlParams.isAdmin, availableModules: availableModules }), overviewData ? (_jsx(OverviewDashboard, { overallAverages: {
                                                    aiReadiness: overviewData.aiReadiness,
                                                    leadership: overviewData.leadership,
                                                    employeeExperience: overviewData.employeeExperience
                                                }, surveyResponses: surveyResponses, mockData: {
                                                    aiReadinessData: [],
                                                    leadershipData: [],
                                                    employeeExperienceData: []
                                                }, availableModules: availableModules })) : (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-600", children: "No data available yet. Submit some surveys to see analytics!" }) }))] })), activeModule === 'survey-management' && (_jsx(SurveyManagement, {})), availableModules.includes(activeModule) && (_jsx("div", { className: "space-y-6", children: _jsxs(Tabs, { value: activeSubTab, onValueChange: (value) => setActiveSubTab(value), children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2 max-w-md", children: [_jsx(TabsTrigger, { value: "survey", children: "Survey" }), _jsx(TabsTrigger, { value: "analysis", children: "Analysis" })] }), _jsx(TabsContent, { value: "survey", className: "mt-6", children: _jsx(ModuleSurveyTab, { module: moduleConfigs[activeModule], status: activeModule === 'ai-readiness' ? surveyStatus.aiReadiness :
                                                            activeModule === 'leadership' ? surveyStatus.leadership :
                                                                activeModule === 'employee-experience' ? surveyStatus.employeeExperience :
                                                                    'not-started', progress: activeModule === 'ai-readiness' ?
                                                            Math.round((Object.keys(surveyResponses).filter(k => k.startsWith('ai-')).length / 6) * 100) :
                                                            activeModule === 'leadership' ?
                                                                Math.round((Object.keys(surveyResponses).filter(k => k.startsWith('leadership-')).length / 8) * 100) :
                                                                Math.round((Object.keys(surveyResponses).filter(k => k.startsWith('ee-')).length / 16) * 100), onStartSurvey: handleTakeSurvey, onResumeSurvey: handleTakeSurvey, onViewAnalysis: () => setActiveSubTab('analysis'), lastUpdated: Object.keys(surveyResponses).length > 0 ? new Date().toLocaleDateString() : undefined }) }), _jsx(TabsContent, { value: "analysis", className: "mt-6", children: moduleAnalytics.loading ? (_jsx(LoadingSpinner, { message: "Loading module analytics..." })) : moduleAnalytics.error ? (_jsx(ErrorDisplay, { error: moduleAnalytics.error, onRetry: moduleAnalytics.refetchAll })) : (_jsxs(_Fragment, { children: [activeModule === 'ai-readiness' && moduleAnalytics.aiReadiness.data && (_jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "AI Readiness Analytics" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Positive Score" }), _jsxs("p", { className: "text-3xl font-bold text-green-600", children: [moduleAnalytics.aiReadiness.data.positiveScore.toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Responses" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: moduleAnalytics.aiReadiness.data.totalResponses })] })] })] })), activeModule === 'leadership' && moduleAnalytics.leadership.data && (_jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Leadership Analytics" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Positive Score" }), _jsxs("p", { className: "text-3xl font-bold text-green-600", children: [moduleAnalytics.leadership.data.positiveScore.toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Responses" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: moduleAnalytics.leadership.data.totalResponses })] })] })] })), activeModule === 'employee-experience' && moduleAnalytics.employeeExperience.data && (_jsxs("div", { className: "bg-white rounded-lg border p-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Employee Experience Analytics" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Positive Score" }), _jsxs("p", { className: "text-3xl font-bold text-green-600", children: [moduleAnalytics.employeeExperience.data.positiveScore.toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Responses" }), _jsx("p", { className: "text-3xl font-bold text-blue-600", children: moduleAnalytics.employeeExperience.data.totalResponses })] })] })] }))] })) })] }) }))] })] })] })] }));
}
