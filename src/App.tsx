import { useState, useMemo, useEffect } from 'react';
import { Brain, Users, Heart, Menu, X } from 'lucide-react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";
import { Sidebar } from "./components/Sidebar";
import { OverviewDashboard } from "./components/OverviewDashboard";
import { ModuleSurveyTab } from "./components/ModuleSurveyTab";
import { ModuleAnalysisTab } from "./components/ModuleAnalysisTab";
import { EmployeeExperienceSection } from "./components/EmployeeExperienceSection";
import { ModularSurvey } from "./components/ModularSurvey";
import { PostSurveyDashboard } from "./components/PostSurveyDashboard";
import { SurveyManagement } from "./components/SurveyManagement";
import { WelcomeBanner } from "./components/WelcomeBanner";
import { generateMockData } from "./utils/mockData";
import api from './utils/api';
import { API_BASE_URL } from './config/database';
import { parseUrlParams, getSurveyConfig, filterDataBySurvey } from "./utils/surveyManagement";
import { 
  calculateOverallAverages,
  calculateAIReadinessBySection,
  calculateLeadershipByLens,
  calculateLeadershipByConfiguration,
  calculateLeadershipByDriver,
  calculateEmployeeExperienceByCategory,
  calculateEmployeeExperienceByDriver,
  getEmployeeExperienceDistribution
} from "./utils/calculations";

export default function App() {
  // Parse URL parameters for survey filtering
  const urlParams = useMemo(() => parseUrlParams(), []);
  const currentSurvey = useMemo(() => 
    urlParams.surveyId ? getSurveyConfig(urlParams.surveyId) : null, 
    [urlParams.surveyId]
  );
  
  // Determine available modules based on URL params or current survey
  const availableModules = useMemo(() => {
    if (currentSurvey) {
      return currentSurvey.modules;
    }
    if (urlParams.modules.length > 0) {
      return urlParams.modules as ('ai-readiness' | 'leadership' | 'employee-experience')[];
    }
    // Admin view - all modules available
    return ['ai-readiness', 'leadership', 'employee-experience'] as const;
  }, [currentSurvey, urlParams.modules]);
  
  // Check if this is a direct survey link (single module)
  const isDirectSurveyLink = useMemo(() => {
    return availableModules.length === 1 && urlParams.mode === 'survey';
  }, [availableModules, urlParams.mode]);
  
  // Set initial active module based on primary module or available modules
  const initialModule = useMemo(() => {
    if (urlParams.primaryModule && availableModules.includes(urlParams.primaryModule)) {
      return urlParams.primaryModule;
    }
    if (availableModules.length === 1) {
      return availableModules[0];
    }
    return 'overview';
  }, [urlParams.primaryModule, availableModules]);
  
  const [activeModule, setActiveModule] = useState(initialModule);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'survey' | 'analysis'>('survey');
  const [mode, setMode] = useState<'dashboard' | 'survey' | 'post-survey'>(
    urlParams.mode === 'survey' || isDirectSurveyLink ? 'survey' : 'dashboard'
  );
  const [surveyResponses, setSurveyResponses] = useState<Record<string, string>>({});
  const [completedModule, setCompletedModule] = useState<string>('');
  // Generate mock data (stateful so we can refresh it in real-time)
  const [mockData, setMockData] = useState(() => generateMockData(urlParams.surveyId));

  // Re-generate mock data when the survey filter changes
  useEffect(() => {
    setMockData(generateMockData(urlParams.surveyId));
  }, [urlParams.surveyId]);

  // Fetch aggregates from API when a surveyId is present so dashboards reflect persisted data
  const [apiAggregates, setApiAggregates] = useState<any | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [campaignInfo, setCampaignInfo] = useState<any | null>(null);
  useEffect(() => {
    let mounted = true;
    async function fetchAggregates() {
      if (!urlParams.surveyId) {
        setApiAggregates(null);
        return;
      }
      setApiLoading(true);
      try {
        const companyQuery = urlParams.company ? `&companyId=${encodeURIComponent(urlParams.company)}` : '';
        const res = await fetch(`${API_BASE_URL}/aggregates?surveyId=${encodeURIComponent(urlParams.surveyId)}${companyQuery}`);
        if (!res.ok) throw new Error(`Failed to fetch aggregates: ${res.status}`);
        const json = await res.json();
        if (mounted) setApiAggregates(json.aggregates || null);
      } catch (err) {
        console.warn('Could not load aggregates, falling back to mock data', err);
        if (mounted) setApiAggregates(null);
      } finally {
        if (mounted) setApiLoading(false);
      }
    }
    fetchAggregates();
    // also fetch campaign info for display
    (async () => {
      try {
        if (urlParams.surveyId) {
          const camp = await api.campaigns.getById(urlParams.surveyId);
          setCampaignInfo(camp || null);
        }
      } catch (e) {
        setCampaignInfo(null);
      }
    })();
    return () => { mounted = false; };
  }, [urlParams.surveyId]);
  
  // Filter data by survey ID
  const filteredData = useMemo(() => {
    return {
      aiReadinessData: filterDataBySurvey(mockData.aiReadinessData, urlParams.surveyId),
      leadershipData: filterDataBySurvey(mockData.leadershipData, urlParams.surveyId),
      employeeExperienceData: filterDataBySurvey(mockData.employeeExperienceData, urlParams.surveyId)
    };
  }, [mockData, urlParams.surveyId]);

  // Calculate all metrics using filtered data (or API aggregates when available)
  const overallAverages = useMemo(() => {
    if (apiAggregates) {
      return {
        aiReadiness: apiAggregates['ai-readiness']?.summaryMetrics?.positiveAverage || 0,
        leadership: apiAggregates['leadership']?.summaryMetrics?.positiveAverage || 0,
        employeeExperience: apiAggregates['employee-experience']?.summaryMetrics?.positiveAverage || 0
      };
    }
    return calculateOverallAverages(
      filteredData.aiReadinessData,
      filteredData.leadershipData,
      filteredData.employeeExperienceData
    );
  }, [filteredData, apiAggregates]);
  
  const aiReadinessBySection = useMemo(() => {
    if (apiAggregates && apiAggregates['ai-readiness'] && apiAggregates['ai-readiness'].questionScores) {
      // Map questionScores into configured sections by distributing in order
      const qlist = apiAggregates['ai-readiness'].questionScores;
      const sections = moduleConfigs['ai-readiness'].sections;
      const result: any[] = [];
      let idx = 0;
      sections.forEach((sec) => {
        const take = sec.questions;
        const slice = qlist.slice(idx, idx + take);
        const total = slice.length;
        const positiveSum = slice.reduce((s: number, q: any) => s + (q.positivePercentage || 0), 0);
        result.push({ section: sec.name, positiveCount: 0, totalCount: total, positivePercentage: total > 0 ? Math.round((positiveSum / total) * 10) / 10 : 0 });
        idx += take;
      });
      return result;
    }
    return calculateAIReadinessBySection(filteredData.aiReadinessData);
  }, [filteredData.aiReadinessData, apiAggregates]);
  
  const leadershipByLens = useMemo(() => {
    if (apiAggregates && apiAggregates['leadership'] && apiAggregates['leadership'].questionScores) {
      // Distribute leadership questionScores into configured sections (approximate)
      const qlist = apiAggregates['leadership'].questionScores;
      const sections = moduleConfigs['leadership'].sections;
      const result: any[] = [];
      let idx = 0;
      sections.forEach((sec) => {
        const take = sec.questions;
        const slice = qlist.slice(idx, idx + take);
        const total = slice.length;
        const positiveSum = slice.reduce((s: number, q: any) => s + (q.positivePercentage || 0), 0);
        result.push({ driver: sec.name, positiveCount: 0, totalCount: total, positivePercentage: total > 0 ? Math.round((positiveSum / total) * 10) / 10 : 0 });
        idx += take;
      });
      return result;
    }
    return calculateLeadershipByLens(filteredData.leadershipData);
  }, [filteredData.leadershipData, apiAggregates]);

  const leadershipByConfiguration = useMemo(() => {
    if (apiAggregates && apiAggregates['leadership'] && apiAggregates['leadership'].questionScores) {
      // reuse lens grouping approximation
      return leadershipByLens;
    }
    return calculateLeadershipByConfiguration(filteredData.leadershipData);
  }, [filteredData.leadershipData, apiAggregates, leadershipByLens]);

  const leadershipByDriver = useMemo(() => {
    if (apiAggregates && apiAggregates['leadership'] && apiAggregates['leadership'].questionScores) {
      return leadershipByLens;
    }
    return calculateLeadershipByDriver(filteredData.leadershipData);
  }, [filteredData.leadershipData, apiAggregates, leadershipByLens]);
  
  const employeeByCategory = useMemo(() => {
    if (apiAggregates && apiAggregates['employee-experience'] && apiAggregates['employee-experience'].questionScores) {
      const qlist = apiAggregates['employee-experience'].questionScores;
      const sections = moduleConfigs['employee-experience'].sections;
      const result: any[] = [];
      let idx = 0;
      sections.forEach((sec) => {
        const take = sec.questions;
        const slice = qlist.slice(idx, idx + take);
        const total = slice.length;
        const positiveSum = slice.reduce((s: number, q: any) => s + (q.positivePercentage || 0), 0);
        result.push({ driver: sec.name, positiveCount: 0, totalCount: total, positivePercentage: total > 0 ? Math.round((positiveSum / total) * 10) / 10 : 0 });
        idx += take;
      });
      return result;
    }
    return calculateEmployeeExperienceByCategory(filteredData.employeeExperienceData);
  }, [filteredData.employeeExperienceData, apiAggregates]);

  const employeeByDriver = useMemo(() => {
    if (apiAggregates) return employeeByCategory;
    return calculateEmployeeExperienceByDriver(filteredData.employeeExperienceData);
  }, [filteredData.employeeExperienceData, apiAggregates, employeeByCategory]);

  const employeeDistribution = useMemo(() => {
    // distribution requires raw responses; fall back to mock data when aggregates are present
    if (apiAggregates) {
      return { '0-10': {}, '1-5': {} } as any;
    }
    return getEmployeeExperienceDistribution(filteredData.employeeExperienceData);
  }, [filteredData.employeeExperienceData, apiAggregates]);

  // Survey status tracking - updated for correct question counts
  const surveyStatus = useMemo(() => {
    const aiResponses = Object.keys(surveyResponses).filter(key => key.startsWith('ai-')).length;
    const leadershipResponses = Object.keys(surveyResponses).filter(key => key.startsWith('leadership-')).length;
    const eeResponses = Object.keys(surveyResponses).filter(key => key.startsWith('ee-')).length;
    
    return {
      aiReadiness: aiResponses > 0 ? (aiResponses >= 6 ? 'completed' : 'in-progress') : 'not-started',
      leadership: leadershipResponses > 0 ? (leadershipResponses >= 8 ? 'completed' : 'in-progress') : 'not-started',
      employeeExperience: eeResponses > 0 ? (eeResponses >= 16 ? 'completed' : 'in-progress') : 'not-started'
    } as const;
  }, [surveyResponses]);

  const handleSurveyComplete = (responses: Record<string, string>) => {
    setSurveyResponses(responses);
    
    // Determine which module was completed based on response keys and available modules
    const aiResponses = Object.keys(responses).filter(key => key.startsWith('ai-')).length;
    const leadershipResponses = Object.keys(responses).filter(key => key.startsWith('leadership-')).length;
    const eeResponses = Object.keys(responses).filter(key => key.startsWith('ee-')).length;
    
    let completed = '';
    // Only consider modules that are available in the current survey
    if (aiResponses >= 6 && availableModules.includes('ai-readiness')) {
      completed = 'ai-readiness';
    } else if (leadershipResponses >= 8 && availableModules.includes('leadership')) {
      completed = 'leadership';
    } else if (eeResponses >= 16 && availableModules.includes('employee-experience')) {
      completed = 'employee-experience';
    }
    
    if (completed) {
      setCompletedModule(completed);
      setMode('post-survey');
    } else {
      setMode('dashboard');
      setActiveModule('overview');
    }
  };

  const handleTakeSurvey = () => {
    setMode('survey');
  };

  const handleBackToDashboard = () => {
    setMode('dashboard');
    setActiveModule('overview');
  };

  // SSE listener: refresh mock data on response events so dashboards update in real-time
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      const devRoot = API_BASE_URL.replace(/\/api$/, '');
      let sseUrl = `${devRoot}/sse`;
      const params: string[] = [];
      if (urlParams.company) params.push(`companyId=${encodeURIComponent(urlParams.company)}`);
      if (urlParams.surveyId) params.push(`surveyId=${encodeURIComponent(urlParams.surveyId)}`);
      if (params.length) sseUrl += `?${params.join('&')}`;
      es = new EventSource(sseUrl);
    } catch (err) {
      console.warn('SSE not available', err);
      return;
    }

    const onResponseCreated = async (e: MessageEvent) => {
      try {
        // Refresh server aggregates when a new response is created for this company/survey
        if (urlParams.surveyId) {
          try {
            const companyQuery = urlParams.company ? `&companyId=${encodeURIComponent(urlParams.company)}` : '';
            const res = await fetch(`${API_BASE_URL}/aggregates?surveyId=${encodeURIComponent(urlParams.surveyId)}${companyQuery}`);
            if (res.ok) {
              const json = await res.json();
              const aggregates = json.aggregates || null;
              setApiAggregates(aggregates);
              // Notify other parts of the app that aggregates updated (so hooks can refetch)
              try { window.dispatchEvent(new CustomEvent('aggregates:updated', { detail: { surveyId: urlParams.surveyId, company: urlParams.company, aggregates } })); } catch (e) {}
            }
          } catch (err) {
            console.warn('Failed to refresh aggregates on SSE', err);
          }
        }
        // Also refresh mock data for components that rely on it
        setMockData(generateMockData(urlParams.surveyId));
      } catch (err) {
        console.error('Failed to handle SSE response event', err);
      }
    };

    es.addEventListener('response:created', onResponseCreated as EventListener);
    es.onerror = (err) => {
      // EventSource auto-reconnects; log for diagnostics
      console.warn('SSE error', err);
    };

    return () => {
      if (es) es.close();
    };
  }, [urlParams.surveyId]);

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    if (module !== 'overview') {
      setActiveSubTab('survey');
    }
  };

  // Module configurations - updated with correct question counts
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

  if (mode === 'survey') {
    return (
      <ModularSurvey 
        onComplete={handleSurveyComplete} 
        specificModule={isDirectSurveyLink ? availableModules[0] : undefined}
      />
    );
  }

  if (mode === 'post-survey') {
    return (
      <PostSurveyDashboard
        completedModule={completedModule}
        onBackToDashboard={handleBackToDashboard}
        surveyResponses={surveyResponses}
        mockData={mockData}
        backendAggregates={apiAggregates}
        companyId={urlParams.company}
        isStandalone={isDirectSurveyLink}
      />
    );
  }

  return (
    <>
      <Toaster />
      {campaignInfo && (
        <div className="bg-white border-b py-3">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Viewing results for</div>
              <div className="text-lg font-semibold">{campaignInfo.companyName}</div>
            </div>
            <div className="text-sm text-gray-500">Survey: {campaignInfo.id}</div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar: hide on Employee Experience dashboard to allow full-width overview */}
        {!(activeModule === 'employee-experience' && mode === 'dashboard') && (
          <div className="hidden md:flex">
            <Sidebar 
              activeModule={activeModule} 
              onModuleChange={handleModuleChange}
              surveyStatus={surveyStatus}
              isAdmin={urlParams.isAdmin}
              availableModules={availableModules}
            />
          </div>
        )}

        {/* Mobile sidebar overlay (hidden on md+) */}
        {showMobileSidebar && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileSidebar(false)} />
            <div className="relative w-64 bg-white h-full shadow-lg">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="text-lg font-bold">Menu</div>
                <Button variant="ghost" onClick={() => setShowMobileSidebar(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Sidebar
                activeModule={activeModule}
                onModuleChange={(m) => { setShowMobileSidebar(false); handleModuleChange(m); }}
                surveyStatus={surveyStatus}
                isAdmin={urlParams.isAdmin}
                availableModules={availableModules}
              />
            </div>
          </div>
        )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" className="md:hidden p-2 mr-3" onClick={() => setShowMobileSidebar(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeModule === 'overview' ? 
                  (currentSurvey ? 
                    `${currentSurvey.companyName} - ${currentSurvey.primaryModule === 'ai-readiness' ? 'AI Readiness' : 
                                                     currentSurvey.primaryModule === 'leadership' ? 'Leadership' : 
                                                     'Employee Experience'} Overview` : 
                    'Overview') :
                 activeModule === 'ai-readiness' ? 'AI Readiness' :
                 activeModule === 'leadership' ? 'Leadership' :
                 activeModule === 'employee-experience' ? 'Employee Experience' :
                 activeModule === 'survey-management' ? 'Survey Management' :
                 activeModule.replace('-', ' ')}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentSurvey ? 
                  `${currentSurvey.targetAudience} • ${currentSurvey.responseCount} responses • ${currentSurvey.status}${currentSurvey.modules.length > 1 ? ` • ${currentSurvey.modules.length} modules` : ''}` :
                 activeModule === 'overview' ? 'Dashboard summary and key insights' :
                 activeModule === 'ai-readiness' ? 'Technology adoption assessment' :
                 activeModule === 'leadership' ? 'Leadership effectiveness analysis' :
                 activeModule === 'employee-experience' ? 'Workplace satisfaction metrics' :
                 activeModule === 'survey-management' ? 'Create and manage client surveys' :
                 activeModule.replace('-', ' ')}
              </p>
            </div>
          
            </div>

            {/* Survey context indicator */}
            <div className="flex items-center gap-4">
              {currentSurvey && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">
                      {currentSurvey.companyName} ({
                        currentSurvey.primaryModule === 'ai-readiness' ? 'AI Readiness' :
                        currentSurvey.primaryModule === 'leadership' ? 'Leadership' :
                        'Employee Experience'
                      })
                    </span>
                  </div>
                </div>
              )}
              
              {Object.keys(surveyResponses).length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">
                      Survey Completed ({Object.keys(surveyResponses).length} responses)
                    </span>
                  </div>
                </div>
              )}
              
              {urlParams.isAdmin && !currentSurvey && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium text-purple-800">
                      Admin View (All Data)
                    </span>
                  </div>
                </div>
              )}

              {/* Global View removed */}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 h-full overflow-auto">
          {activeModule === 'overview' && (
            <>
              <WelcomeBanner
                currentSurvey={currentSurvey}
                isAdmin={urlParams.isAdmin}
                availableModules={availableModules}
              />
              <OverviewDashboard 
                overallAverages={overallAverages}
                surveyResponses={surveyResponses}
                mockData={filteredData}
                backendAggregates={apiAggregates}
                companyId={urlParams.company}
                availableModules={availableModules}
              />
            </>
          )}

          {activeModule === 'survey-management' && (
            <SurveyManagement />
          )}

          {/* Standalone survey links removed from UI */}

          

          {availableModules.includes(activeModule as any) && (
            <div className="space-y-6">
              {/* Module Sub-tabs */}
              <Tabs value={activeSubTab} onValueChange={(value) => setActiveSubTab(value as 'survey' | 'analysis')}>
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                  <TabsTrigger value="survey">Survey</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>

                <TabsContent value="survey" className="mt-6">
                  <ModuleSurveyTab
                    module={moduleConfigs[activeModule as keyof typeof moduleConfigs]}
                    status={
                      activeModule === 'ai-readiness' ? surveyStatus.aiReadiness :
                      activeModule === 'leadership' ? surveyStatus.leadership :
                      activeModule === 'employee-experience' ? surveyStatus.employeeExperience :
                      'not-started'
                    }
                    progress={
                      activeModule === 'ai-readiness' ? 
                        Math.round((Object.keys(surveyResponses).filter(k => k.startsWith('ai-')).length / 6) * 100) :
                      activeModule === 'leadership' ?
                        Math.round((Object.keys(surveyResponses).filter(k => k.startsWith('leadership-')).length / 8) * 100) :
                        Math.round((Object.keys(surveyResponses).filter(k => k.startsWith('ee-')).length / 16) * 100)
                    }
                    onStartSurvey={handleTakeSurvey}
                    onResumeSurvey={handleTakeSurvey}
                    onViewAnalysis={() => setActiveSubTab('analysis')}
                    lastUpdated={Object.keys(surveyResponses).length > 0 ? new Date().toLocaleDateString() : undefined}
                  />
                </TabsContent>

                <TabsContent value="analysis" className="mt-6">
                  {activeModule === 'ai-readiness' && availableModules.includes('ai-readiness') && (
                    <ModuleAnalysisTab
                      moduleTitle="AI Readiness"
                      summaryMetrics={{
                        positiveAverage: overallAverages.aiReadiness,
                        totalQuestions: 6,
                        responseCount: filteredData.aiReadinessData.length,
                        trend: 2.3
                      }}
                      questionScores={aiReadinessBySection.map(section => ({
                        question: section.section,
                        score: section.positivePercentage,
                        section: 'AI Readiness'
                      }))}
                        sectionData={aiReadinessBySection.map(section => ({
                        section: section.section,
                        score: section.positivePercentage,
                        questionCount: section.totalCount
                      }))}
                        surveyResponses={surveyResponses}
                        moduleId={'ai-readiness'}
                        backendAggregates={apiAggregates}
                    />
                  )}

                  {activeModule === 'leadership' && availableModules.includes('leadership') && (
                    <ModuleAnalysisTab
                      moduleTitle="Leadership"
                      summaryMetrics={{
                        positiveAverage: overallAverages.leadership,
                        totalQuestions: 8,
                        responseCount: filteredData.leadershipData.length,
                        trend: 1.8
                      }}
                      questionScores={leadershipByLens.map(lens => ({
                        question: lens.driver,
                        score: lens.positivePercentage,
                        section: 'Leadership Lens'
                      }))}
                      sectionData={leadershipByLens.map(lens => ({
                        section: lens.driver,
                        score: lens.positivePercentage,
                        questionCount: lens.totalCount
                      }))}
                      surveyResponses={surveyResponses}
                      moduleId={'leadership'}
                      backendAggregates={apiAggregates}
                    />
                  )}

                  {activeModule === 'employee-experience' && availableModules.includes('employee-experience') && (
                    <>
                      <ModuleAnalysisTab
                        moduleTitle="Employee Experience"
                        summaryMetrics={{
                          positiveAverage: overallAverages.employeeExperience,
                          totalQuestions: 16,
                          responseCount: filteredData.employeeExperienceData.length,
                          trend: -0.5
                        }}
                        questionScores={employeeByCategory.map(category => ({
                          question: category.driver,
                          score: category.positivePercentage,
                          section: 'Employee Experience'
                        }))}
                        sectionData={employeeByCategory.map(category => ({
                          section: category.driver,
                          score: category.positivePercentage,
                          questionCount: category.totalCount
                        }))}
                        surveyResponses={surveyResponses}
                        moduleId={'employee-experience'}
                        backendAggregates={apiAggregates}
                      />

                      {/* Also render the dedicated Employee Experience section below for parity with other modules */}
                      {/* Import lazy to avoid bundle bloat if needed */}
                      <div className="mt-6">
                        {/* EmployeeExperienceSection shows category/driver breakdown and distributions */}
                        {/* We pass calculated values from the utils above */}
                        <EmployeeExperienceSection
                          categoryData={employeeByCategory}
                          driverData={employeeByDriver}
                          overallPercentage={overallAverages.employeeExperience}
                          distribution={employeeDistribution}
                          surveyResponses={surveyResponses}
                            moduleId={'employee-experience'}
                            backendAggregates={apiAggregates}
                        />
                      </div>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}