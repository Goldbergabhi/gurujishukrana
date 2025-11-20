// Generate unique survey ID
export function generateSurveyId(companyName, surveyType, primaryModule) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const cleanCompany = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const moduleShort = primaryModule.split('-')[0]; // ai, leadership, employee
    return `${cleanCompany}-${moduleShort}-${surveyType}-${timestamp}-${random}`;
}
// Create survey configuration
export function createSurveyConfig(companyName, surveyType, modules, primaryModule) {
    return {
        id: generateSurveyId(companyName, surveyType, primaryModule),
        companyName,
        surveyType,
        createdDate: new Date().toISOString(),
        status: 'active',
        responseCount: 0,
        targetAudience: surveyType === 'managers' ? 'Leadership Team' :
            surveyType === 'employees' ? 'General Employees' : 'Mixed Audience',
        modules,
        primaryModule
    };
}
// Generate survey URLs
export function generateSurveyUrls(surveyConfig, baseUrl = window.location.origin) {
    const moduleParams = surveyConfig.modules.join(',');
    return {
        surveyUrl: `${baseUrl}?mode=survey&id=${surveyConfig.id}&type=${surveyConfig.surveyType}&modules=${moduleParams}`,
        dashboardUrl: `${baseUrl}?survey=${surveyConfig.id}&modules=${moduleParams}&primary=${surveyConfig.primaryModule}`
    };
}
// Generate standalone module survey URL (for selling single modules)
export function generateStandaloneModuleUrl(module, surveyId, baseUrl = window.location.origin) {
    return `${baseUrl}?module=${module}&surveyId=${surveyId}`;
}
// Parse URL parameters
export function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const surveyId = urlParams.get('survey') || urlParams.get('id');
    const surveyType = urlParams.get('type');
    const modulesParam = urlParams.get('modules');
    const moduleParam = urlParams.get('module'); // Single module parameter
    const primaryModule = urlParams.get('primary');
    const mode = urlParams.get('mode');
    // If single module is specified, use it; otherwise parse modules list
    let modules = [];
    if (moduleParam) {
        modules = [moduleParam];
    }
    else if (modulesParam) {
        modules = modulesParam.split(',');
    }
    return {
        surveyId: surveyId || undefined,
        surveyType: surveyType || undefined,
        modules,
        primaryModule: (moduleParam || primaryModule),
        mode: mode || (moduleParam ? 'survey' : undefined), // Auto-set mode to survey if module is specified
        isAdmin: !surveyId && !modules.length && !moduleParam // If no survey ID, modules, or module, assume admin view
    };
}
// Mock survey configurations for demo
export const mockSurveyConfigs = [
    {
        id: 'techcorp-ai-managers-2024-abc123',
        companyName: 'TechCorp Inc',
        surveyType: 'managers',
        createdDate: '2024-01-15T10:00:00Z',
        status: 'completed',
        responseCount: 24,
        targetAudience: 'Leadership Team',
        modules: ['ai-readiness'],
        primaryModule: 'ai-readiness'
    },
    {
        id: 'innovate-leadership-employees-2024-def456',
        companyName: 'Innovate Ltd',
        surveyType: 'employees',
        createdDate: '2024-01-15T10:00:00Z',
        status: 'completed',
        responseCount: 156,
        targetAudience: 'General Employees',
        modules: ['leadership'],
        primaryModule: 'leadership'
    },
    {
        id: 'startupco-employee-mixed-2024-ghi789',
        companyName: 'StartupCo',
        surveyType: 'mixed',
        createdDate: '2024-02-01T09:00:00Z',
        status: 'active',
        responseCount: 32,
        targetAudience: 'All Team Members',
        modules: ['employee-experience'],
        primaryModule: 'employee-experience'
    },
    {
        id: 'megacorp-ai-managers-2024-jkl012',
        companyName: 'MegaCorp Global',
        surveyType: 'managers',
        createdDate: '2024-02-10T14:00:00Z',
        status: 'active',
        responseCount: 8,
        targetAudience: 'Senior Leadership',
        modules: ['ai-readiness', 'leadership'],
        primaryModule: 'ai-readiness'
    },
    {
        id: 'retailco-employee-employees-2024-mno345',
        companyName: 'RetailCo',
        surveyType: 'employees',
        createdDate: '2024-02-12T11:00:00Z',
        status: 'active',
        responseCount: 67,
        targetAudience: 'Store Teams',
        modules: ['employee-experience'],
        primaryModule: 'employee-experience'
    }
];
// Get survey config by ID
export function getSurveyConfig(surveyId) {
    return mockSurveyConfigs.find(config => config.id === surveyId);
}
// Filter data by survey ID
export function filterDataBySurvey(data, surveyId) {
    if (!surveyId) {
        return data; // Return all data for admin view
    }
    return data.filter(item => item.surveyId === surveyId);
}
