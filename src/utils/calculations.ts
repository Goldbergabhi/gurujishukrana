import type { AIReadinessResponse, LeadershipResponse, EmployeeExperienceResponse } from './mockData';

export interface PositivePercentageResult {
  positiveCount: number;
  totalCount: number;
  positivePercentage: number;
}

export interface SectionResult extends PositivePercentageResult {
  section: string;
}

export interface DriverResult extends PositivePercentageResult {
  driver: string;
  lens?: string;
  configuration?: string;
}

export interface LeadershipAverageResult {
  category: string;
  lens?: string;
  configuration?: string;
  averageScore: number;
}

export function calculateAIReadinessPositives(
  data: AIReadinessResponse[],
  section?: string
): PositivePercentageResult {
  const filteredData = section ? data.filter(d => d.section === section) : data;
  const totalCount = filteredData.length;
  const positiveCount = filteredData.filter(d => d.response === 4 || d.response === 5).length;
  
  return {
    positiveCount,
    totalCount,
    positivePercentage: totalCount > 0 ? (positiveCount / totalCount) * 100 : 0
  };
}

export function calculateAIReadinessBySection(data: AIReadinessResponse[]): SectionResult[] {
  const sections = [...new Set(data.map(d => d.section))];
  
  return sections.map(section => ({
    section,
    ...calculateAIReadinessPositives(data, section)
  }));
}

export function calculateLeadershipPositives(
  data: LeadershipResponse[],
  filters?: { lens?: string; configuration?: string; driver?: string }
): PositivePercentageResult {
  let filteredData = data;
  
  if (filters?.lens) filteredData = filteredData.filter(d => d.lens === filters.lens);
  if (filters?.configuration) filteredData = filteredData.filter(d => d.configuration === filters.configuration);
  if (filters?.driver) filteredData = filteredData.filter(d => d.driver === filters.driver);
  
  const totalCount = filteredData.length;
  
  if (totalCount === 0) {
    return {
      positiveCount: 0,
      totalCount: 0,
      positivePercentage: 0
    };
  }
  
  const sumOfResponses = filteredData.reduce((sum, response) => sum + response.response, 0);
  const averageScore = sumOfResponses / totalCount;
  const percentageScore = (averageScore / 5) * 100;
  
  return {
    positiveCount: sumOfResponses,
    totalCount,
    positivePercentage: percentageScore
  };
}

export function calculateLeadershipByLens(data: LeadershipResponse[]): DriverResult[] {
  const lenses = [...new Set(data.map(d => d.lens))];
  
  return lenses.map(lens => ({
    driver: lens,
    lens,
    ...calculateLeadershipPositives(data, { lens })
  }));
}

export function calculateLeadershipByConfiguration(data: LeadershipResponse[]): DriverResult[] {
  const configurations = [...new Set(data.map(d => d.configuration))];
  
  return configurations.map(configuration => ({
    driver: configuration,
    configuration,
    ...calculateLeadershipPositives(data, { configuration })
  }));
}

export function calculateLeadershipByDriver(data: LeadershipResponse[]): DriverResult[] {
  const drivers = [...new Set(data.map(d => d.driver))];
  
  return drivers.map(driver => {
    const driverData = data.filter(d => d.driver === driver);
    const lens = driverData[0]?.lens;
    const configuration = driverData[0]?.configuration;
    
    return {
      driver,
      lens,
      configuration,
      ...calculateLeadershipPositives(data, { driver })
    };
  });
}

function calculateLeadershipAverage(
  data: LeadershipResponse[],
  filters?: { lens?: string; configuration?: string; driver?: string }
): number {
  let filtered = data;

  if (filters?.lens) filtered = filtered.filter(d => d.lens === filters.lens);
  if (filters?.configuration) filtered = filtered.filter(d => d.configuration === filters.configuration);
  if (filters?.driver) filtered = filtered.filter(d => d.driver === filters.driver);

  const total = filtered.length;
  if (total === 0) return 0;

  const sum = filtered.reduce((acc, r) => acc + r.response, 0);
  return sum / total;
}

export function calculateLeadershipAverageByLens(data: LeadershipResponse[]): LeadershipAverageResult[] {
  const lenses = [...new Set(data.map(d => d.lens))];

  return lenses.map(lens => ({
    category: lens,
    lens,
    averageScore: calculateLeadershipAverage(data, { lens })
  }));
}

export function calculateLeadershipAverageByConfiguration(data: LeadershipResponse[]): LeadershipAverageResult[] {
  const configurations = [...new Set(data.map(d => d.configuration))];

  return configurations.map(configuration => ({
    category: configuration,
    configuration,
    averageScore: calculateLeadershipAverage(data, { configuration })
  }));
}

export function calculateLeadershipAverageByDriver(data: LeadershipResponse[]): LeadershipAverageResult[] {
  const drivers = [...new Set(data.map(d => d.driver))];

  return drivers.map(driver => {
    const sample = data.find(d => d.driver === driver);
    return {
      category: driver,
      lens: sample?.lens,
      configuration: sample?.configuration,
      averageScore: calculateLeadershipAverage(data, { driver })
    };
  });
}

export function calculateEmployeeExperiencePositives(
  data: EmployeeExperienceResponse[],
  filters?: { category?: string; driver?: string }
): PositivePercentageResult {
  let filteredData = data;
  
  if (filters?.category) filteredData = filteredData.filter(d => d.category === filters.category);
  if (filters?.driver) filteredData = filteredData.filter(d => d.driver === filters.driver);
  
  const totalCount = filteredData.length;
  const positiveCount = filteredData.filter(d => {
    if (d.scale === '0-10') return d.response >= 7 && d.response <= 10;
    return d.response >= 4;
  }).length;
  
  return {
    positiveCount,
    totalCount,
    positivePercentage: totalCount > 0 ? (positiveCount / totalCount) * 100 : 0
  };
}

export function calculateEmployeeExperienceByCategory(data: EmployeeExperienceResponse[]): DriverResult[] {
  const categories = [...new Set(data.map(d => d.category))];
  
  return categories.map(category => ({
    driver: category,
    ...calculateEmployeeExperiencePositives(data, { category })
  }));
}

export function calculateEmployeeExperienceByDriver(data: EmployeeExperienceResponse[]): DriverResult[] {
  const drivers = [...new Set(data.map(d => d.driver))];
  
  return drivers.map(driver => ({
    driver,
    ...calculateEmployeeExperiencePositives(data, { driver })
  }));
}

export function calculateOverallAverages(
  aiData: AIReadinessResponse[],
  leadershipData: LeadershipResponse[],
  employeeData: EmployeeExperienceResponse[]
) {
  const aiPositive = calculateAIReadinessPositives(aiData);
  const leadershipPositive = calculateLeadershipPositives(leadershipData);
  const employeePositive = calculateEmployeeExperiencePositives(employeeData);
  
  return {
    aiReadiness: aiPositive.positivePercentage,
    leadership: leadershipPositive.positivePercentage,
    employeeExperience: employeePositive.positivePercentage
  };
}

export function getEmployeeExperienceDistribution(data: EmployeeExperienceResponse[]) {
  const distribution = { '0-10': {}, '1-5': {} } as any;
  
  for (let i = 0; i <= 10; i++) distribution['0-10'][i] = 0;
  for (let i = 1; i <= 5; i++) distribution['1-5'][i] = 0;
  
  data.forEach(response => {
    distribution[response.scale][response.response]++;
  });
  
  return distribution;
}
