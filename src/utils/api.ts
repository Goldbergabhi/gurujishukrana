// API Service Layer for MongoDB Backend Communication
import { API_ENDPOINTS } from '../config/database';
import type { SurveyCampaign } from '../types/survey';
import type { 
  AIReadinessResponse, 
  LeadershipResponse, 
  EmployeeExperienceResponse 
} from './mockData';

// API Error Handler
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    } as Record<string, string>;
    // attach bearer token if configured
    if (_authToken) headers['Authorization'] = `Bearer ${_authToken}`;

    const response = await fetch(url, {
      ...options,
      // send credentials so HTTP-only auth cookies are included in same-origin/dev setups
      credentials: 'include',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        response.status, 
        errorData.message || `HTTP Error ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    console.error('API Request failed:', error);
    throw new Error('Network error - please check your connection');
  }
}

// Simple auth token helper: store a bearer token to be sent on subsequent requests.
// Call `setAuthToken(token)` from your login flow (dev token or real auth).
let _authToken: string | null = null;
export function setAuthToken(token: string | null) {
  _authToken = token;
}

// ============================================
// SURVEY CAMPAIGN APIs
// ============================================

export interface CreateCampaignRequest {
  companyName: string;
  targetAudience: string;
  modules: Array<'ai-readiness' | 'leadership' | 'employee-experience'>;
  primaryModule: 'ai-readiness' | 'leadership' | 'employee-experience';
  startDate: string;
  endDate: string;
}

export const campaignAPI = {
  // Get all campaigns
  async getAll(): Promise<SurveyCampaign[]> {
    const res = await fetchAPI<any>(API_ENDPOINTS.campaigns.list);
    return res?.campaigns || [];
  },

  // Get campaign by ID
  async getById(id: string): Promise<SurveyCampaign> {
    const res = await fetchAPI<any>(API_ENDPOINTS.campaigns.getById(id));
    return res?.campaign;
  },

  // Create new campaign
  async create(data: CreateCampaignRequest): Promise<SurveyCampaign> {
    const res = await fetchAPI<any>(API_ENDPOINTS.campaigns.create, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res?.campaign || (data as any);
  },

  // Update campaign
  async update(id: string, data: Partial<SurveyCampaign>): Promise<SurveyCampaign> {
    return fetchAPI<SurveyCampaign>(API_ENDPOINTS.campaigns.update(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete campaign
  async delete(id: string): Promise<void> {
    return fetchAPI<void>(API_ENDPOINTS.campaigns.delete(id), {
      method: 'DELETE',
    });
  },
};

// ============================================
// SURVEY RESPONSE APIs
// ============================================

export interface SubmitSurveyRequest {
  surveyId: string;
  module: 'ai-readiness' | 'leadership' | 'employee-experience';
  responses: Record<string, number>;
  metadata?: {
    userId?: string;
    department?: string;
    role?: string;
    tenure?: string;
  };
}

export interface SurveyResponseData {
  aiReadiness: AIReadinessResponse[];
  leadership: LeadershipResponse[];
  employeeExperience: EmployeeExperienceResponse[];
}

export const responseAPI = {
  // Submit survey responses
  async submit(data: SubmitSurveyRequest): Promise<{ success: boolean; responseId: string }> {
    return fetchAPI(API_ENDPOINTS.responses.submit, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all responses for a survey
  async getBySurvey(surveyId: string): Promise<SurveyResponseData> {
    return fetchAPI<SurveyResponseData>(
      API_ENDPOINTS.responses.getBySurvey(surveyId)
    );
  },

  // Get user's responses
  async getByUser(userId: string): Promise<SurveyResponseData> {
    return fetchAPI<SurveyResponseData>(
      API_ENDPOINTS.responses.getByUser(userId)
    );
  },
};

// ============================================
// ANALYTICS APIs
// ============================================

export interface OverviewAnalytics {
  aiReadiness: number;
  leadership: number;
  employeeExperience: number;
  totalResponses: number;
  lastUpdated: string;
}

export interface ModuleAnalytics {
  positiveScore: number;
  totalResponses: number;
  sectionBreakdown: Array<{
    section: string;
    positivePercentage: number;
    positiveCount: number;
    totalCount: number;
  }>;
  demographics: Array<{
    department: string;
    score: number;
    count: number;
  }>;
  trends: Array<{
    date: string;
    score: number;
  }>;
  questionScores: Array<{
    questionId: string;
    question: string;
    positivePercentage: number;
    responseDistribution: Record<number, number>;
  }>;
}

export const analyticsAPI = {
  // Get overview analytics
  async getOverview(opts?: { companyId?: string; surveyId?: string }): Promise<OverviewAnalytics> {
    const base = API_ENDPOINTS.analytics.overview(opts?.surveyId);
    const url = opts && opts.companyId ? `${base}${base.includes('?') ? '&' : '?'}companyId=${encodeURIComponent(opts.companyId)}` : base;
    return fetchAPI<OverviewAnalytics>(url);
  },

  // Get AI Readiness analytics
  async getAIReadiness(opts?: { companyId?: string; surveyId?: string }): Promise<ModuleAnalytics> {
    const base = API_ENDPOINTS.analytics.aiReadiness(opts?.surveyId);
    const url = opts && opts.companyId ? `${base}${base.includes('?') ? '&' : '?'}companyId=${encodeURIComponent(opts.companyId)}` : base;
    return fetchAPI<ModuleAnalytics>(url);
  },

  // Get Leadership analytics
  async getLeadership(opts?: { companyId?: string; surveyId?: string }): Promise<ModuleAnalytics> {
    const base = API_ENDPOINTS.analytics.leadership(opts?.surveyId);
    const url = opts && opts.companyId ? `${base}${base.includes('?') ? '&' : '?'}companyId=${encodeURIComponent(opts.companyId)}` : base;
    return fetchAPI<ModuleAnalytics>(url);
  },

  // Get Employee Experience analytics
  async getEmployeeExperience(opts?: { companyId?: string; surveyId?: string }): Promise<ModuleAnalytics> {
    const base = API_ENDPOINTS.analytics.employeeExperience(opts?.surveyId);
    const url = opts && opts.companyId ? `${base}${base.includes('?') ? '&' : '?'}companyId=${encodeURIComponent(opts.companyId)}` : base;
    return fetchAPI<ModuleAnalytics>(url);
  },
};

// ============================================
// REAL-TIME DATA APIs
// ============================================

export interface RealtimeStats {
  activeResponses: number;
  todayResponses: number;
  averageCompletionTime: number;
  completionRate: number;
}

export const realtimeAPI = {
  // Get real-time statistics
  async getStats(surveyId?: string): Promise<RealtimeStats> {
    const url = surveyId 
      ? `${API_ENDPOINTS.realtime.stats}?surveyId=${surveyId}`
      : API_ENDPOINTS.realtime.stats;
    return fetchAPI<RealtimeStats>(url);
  },

  // Get recent responses (for live feed)
  async getRecentResponses(limit: number = 10): Promise<any[]> {
    return fetchAPI(`${API_ENDPOINTS.realtime.responses}?limit=${limit}`);
  },
};

// ============================================
// DATA FETCHING HOOKS HELPERS
// ============================================

export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function createInitialState<T>(): DataState<T> {
  return {
    data: null,
    loading: true,
    error: null,
  };
}

export function setLoading<T>(state: DataState<T>): DataState<T> {
  return { ...state, loading: true, error: null };
}

export function setData<T>(state: DataState<T>, data: T): DataState<T> {
  return { data, loading: false, error: null };
}

export function setError<T>(state: DataState<T>, error: string): DataState<T> {
  return { ...state, loading: false, error };
}

// ============================================
// EXPORT ALL APIs
// ============================================

export const api = {
  campaigns: campaignAPI,
  responses: responseAPI,
  analytics: analyticsAPI,
  realtime: realtimeAPI,
};

export default api;
