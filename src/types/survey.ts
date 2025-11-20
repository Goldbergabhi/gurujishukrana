export interface ModuleConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface SurveyCampaign {
  id: string;
  title: string;
  status: 'live' | 'closed' | 'draft';
  moduleId: string;
  startDate: string;
  endDate?: string;
  participantCount: number;
  completionRate: number;
  isActive: boolean;
}