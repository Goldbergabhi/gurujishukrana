// Custom hooks for fetching analytics data from MongoDB
import { useState, useEffect, useCallback } from 'react';
import { 
  api, 
  type OverviewAnalytics, 
  type ModuleAnalytics,
  type DataState,
  createInitialState,
  setLoading,
  setData,
  setError
} from '../utils/api';

// Hook for overview analytics
export function useOverviewAnalytics(surveyId?: string) {
  const [state, setState] = useState<DataState<OverviewAnalytics>>(createInitialState());

  const fetchData = useCallback(async () => {
    setState(prev => setLoading(prev));
    try {
      const data = await api.analytics.getOverview(surveyId);
      setState(prev => setData(prev, data));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch overview analytics';
      setState(prev => setError(prev, message));
      console.error('Error fetching overview analytics:', error);
    }
  }, [surveyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Hook for AI Readiness analytics
export function useAIReadinessAnalytics(surveyId?: string) {
  const [state, setState] = useState<DataState<ModuleAnalytics>>(createInitialState());

  const fetchData = useCallback(async () => {
    setState(prev => setLoading(prev));
    try {
      const data = await api.analytics.getAIReadiness(surveyId);
      setState(prev => setData(prev, data));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch AI Readiness analytics';
      setState(prev => setError(prev, message));
      console.error('Error fetching AI Readiness analytics:', error);
    }
  }, [surveyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Hook for Leadership analytics
export function useLeadershipAnalytics(surveyId?: string) {
  const [state, setState] = useState<DataState<ModuleAnalytics>>(createInitialState());

  const fetchData = useCallback(async () => {
    setState(prev => setLoading(prev));
    try {
      const data = await api.analytics.getLeadership(surveyId);
      setState(prev => setData(prev, data));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch Leadership analytics';
      setState(prev => setError(prev, message));
      console.error('Error fetching Leadership analytics:', error);
    }
  }, [surveyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Hook for Employee Experience analytics
export function useEmployeeExperienceAnalytics(surveyId?: string) {
  const [state, setState] = useState<DataState<ModuleAnalytics>>(createInitialState());

  const fetchData = useCallback(async () => {
    setState(prev => setLoading(prev));
    try {
      const data = await api.analytics.getEmployeeExperience(surveyId);
      setState(prev => setData(prev, data));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch Employee Experience analytics';
      setState(prev => setError(prev, message));
      console.error('Error fetching Employee Experience analytics:', error);
    }
  }, [surveyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

// Hook for all module analytics (when needed together)
export function useAllModuleAnalytics(surveyId?: string) {
  const aiReadiness = useAIReadinessAnalytics(surveyId);
  const leadership = useLeadershipAnalytics(surveyId);
  const employeeExperience = useEmployeeExperienceAnalytics(surveyId);

  return {
    aiReadiness,
    leadership,
    employeeExperience,
    loading: aiReadiness.loading || leadership.loading || employeeExperience.loading,
    error: aiReadiness.error || leadership.error || employeeExperience.error,
    refetchAll: () => {
      aiReadiness.refetch();
      leadership.refetch();
      employeeExperience.refetch();
    }
  };
}
