// API Service Layer for MongoDB Backend Communication
import { API_ENDPOINTS } from '../config/database';
// API Error Handler
class APIError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'APIError';
    }
}
// Generic fetch wrapper with error handling
async function fetchAPI(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new APIError(response.status, errorData.message || `HTTP Error ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        console.error('API Request failed:', error);
        throw new Error('Network error - please check your connection');
    }
}
export const campaignAPI = {
    // Get all campaigns
    async getAll() {
        return fetchAPI(API_ENDPOINTS.campaigns.list);
    },
    // Get campaign by ID
    async getById(id) {
        return fetchAPI(API_ENDPOINTS.campaigns.getById(id));
    },
    // Create new campaign
    async create(data) {
        return fetchAPI(API_ENDPOINTS.campaigns.create, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    // Update campaign
    async update(id, data) {
        return fetchAPI(API_ENDPOINTS.campaigns.update(id), {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    // Delete campaign
    async delete(id) {
        return fetchAPI(API_ENDPOINTS.campaigns.delete(id), {
            method: 'DELETE',
        });
    },
};
export const responseAPI = {
    // Submit survey responses
    async submit(data) {
        return fetchAPI(API_ENDPOINTS.responses.submit, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    // Get all responses for a survey
    async getBySurvey(surveyId) {
        return fetchAPI(API_ENDPOINTS.responses.getBySurvey(surveyId));
    },
    // Get user's responses
    async getByUser(userId) {
        return fetchAPI(API_ENDPOINTS.responses.getByUser(userId));
    },
};
export const analyticsAPI = {
    // Get overview analytics
    async getOverview(surveyId) {
        return fetchAPI(API_ENDPOINTS.analytics.overview(surveyId));
    },
    // Get AI Readiness analytics
    async getAIReadiness(surveyId) {
        return fetchAPI(API_ENDPOINTS.analytics.aiReadiness(surveyId));
    },
    // Get Leadership analytics
    async getLeadership(surveyId) {
        return fetchAPI(API_ENDPOINTS.analytics.leadership(surveyId));
    },
    // Get Employee Experience analytics
    async getEmployeeExperience(surveyId) {
        return fetchAPI(API_ENDPOINTS.analytics.employeeExperience(surveyId));
    },
};
export const realtimeAPI = {
    // Get real-time statistics
    async getStats(surveyId) {
        const url = surveyId
            ? `${API_ENDPOINTS.realtime.stats}?surveyId=${surveyId}`
            : API_ENDPOINTS.realtime.stats;
        return fetchAPI(url);
    },
    // Get recent responses (for live feed)
    async getRecentResponses(limit = 10) {
        return fetchAPI(`${API_ENDPOINTS.realtime.responses}?limit=${limit}`);
    },
};
export function createInitialState() {
    return {
        data: null,
        loading: true,
        error: null,
    };
}
export function setLoading(state) {
    return { ...state, loading: true, error: null };
}
export function setData(state, data) {
    return { data, loading: false, error: null };
}
export function setError(state, error) {
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
