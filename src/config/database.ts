// MongoDB Configuration
// Replace these with your actual MongoDB credentials

export const MONGODB_CONFIG = {
  // MongoDB Connection String
  // Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
  connectionString: import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/leap-survey',
  
  // Database name
  databaseName: import.meta.env.VITE_MONGODB_DATABASE || 'leap-survey',
  
  // Collections
  collections: {
    surveys: 'surveys',
    campaigns: 'campaigns',
    aiReadinessResponses: 'ai_readiness_responses',
    leadershipResponses: 'leadership_responses',
    employeeExperienceResponses: 'employee_experience_responses',
    users: 'users',
    analytics: 'analytics'
  }
};

// API Base URL - Your backend server
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Survey Campaigns
  campaigns: {
    list: `${API_BASE_URL}/campaigns`,
    create: `${API_BASE_URL}/campaigns`,
    getById: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
    update: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
    delete: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
  },
  
  // Survey Responses
  responses: {
    submit: `${API_BASE_URL}/responses/submit`,
    getBySurvey: (surveyId: string) => `${API_BASE_URL}/responses/survey/${surveyId}`,
    getByUser: (userId: string) => `${API_BASE_URL}/responses/user/${userId}`,
  },
  
  // Analytics
  analytics: {
    overview: (surveyId?: string) => 
      `${API_BASE_URL}/analytics/overview${surveyId ? `?surveyId=${surveyId}` : ''}`,
    aiReadiness: (surveyId?: string) => 
      `${API_BASE_URL}/analytics/ai-readiness${surveyId ? `?surveyId=${surveyId}` : ''}`,
    leadership: (surveyId?: string) => 
      `${API_BASE_URL}/analytics/leadership${surveyId ? `?surveyId=${surveyId}` : ''}`,
    employeeExperience: (surveyId?: string) => 
      `${API_BASE_URL}/analytics/employee-experience${surveyId ? `?surveyId=${surveyId}` : ''}`,
  },
  
  // Real-time data
  realtime: {
    stats: `${API_BASE_URL}/realtime/stats`,
    responses: `${API_BASE_URL}/realtime/responses`,
  }
};
