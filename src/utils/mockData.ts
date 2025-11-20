// Mock data generator for LEAP Survey Dashboard

export interface AIReadinessResponse {
  section: string;
  question: string;
  response: number; // 1-5 scale
  respondentId: string;
  date: string;
  surveyId?: string; // Added for survey filtering
  participantType?: 'manager' | 'employee';
}

export interface LeadershipResponse {
  lens: string;
  configuration: string;
  driver: string;
  question: string;
  response: number; // 1-5 scale
  respondentId: string;
  date: string;
  surveyId?: string; // Added for survey filtering
  participantType?: 'manager' | 'employee';
}

export interface EmployeeExperienceResponse {
  category: string;
  driver: string;
  question: string;
  response: number; // 0-10 for NPS, 1-5 for others
  scale: '0-10' | '1-5';
  respondentId: string;
  date: string;
  surveyId?: string; // Added for survey filtering
  participantType?: 'manager' | 'employee';
}

// AI Readiness module - exactly 6 questions as specified
const aiReadinessQuestions = [
  'The organization clearly explains how AI supports its long-term business strategy',
  'Senior leaders invest in AI projects that push the business in new directions', 
  'The organization has the necessary technology infrastructure to support AI adoption',
  'Our teams have the skills and training needed to work effectively with AI',
  'The organization has clear data governance policies and quality data for AI use',
  'Our organizational culture embraces change and innovation needed for AI success'
];

// Group questions into logical sections for display purposes (6 total)
const aiReadinessSections = {
  'Strategy & Leadership': [
    'The organization clearly explains how AI supports its long-term business strategy',
    'Senior leaders invest in AI projects that push the business in new directions'
  ],
  'Infrastructure & Skills': [
    'The organization has the necessary technology infrastructure to support AI adoption',
    'Our teams have the skills and training needed to work effectively with AI'
  ],
  'Data & Culture': [
    'The organization has clear data governance policies and quality data for AI use',
    'Our organizational culture embraces change and innovation needed for AI success'
  ]
};

// Leadership module structure - Contains Drivers and Lens categories, each with 4 questions
const leadershipStructure = {
  'Lens': {
    'Strategic Vision': [
      'Leaders communicate a clear strategic direction',
      'Leaders align team goals with organizational objectives',
      'Leaders anticipate future challenges and opportunities',
      'Leaders adapt strategy based on changing circumstances'
    ],
    'Team Development': [
      'Leaders invest in team member growth and development',
      'Leaders provide constructive feedback and coaching',
      'Leaders recognize and leverage individual strengths',
      'Leaders create opportunities for skill building'
    ]
  },
  'Driver': {
    'Communication Excellence': [
      'Leaders communicate clearly and effectively',
      'Leaders listen actively to team input',
      'Leaders facilitate open dialogue and discussion',
      'Leaders ensure information flows efficiently'
    ],
    'Decision Making': [
      'Leaders make timely and well-informed decisions',
      'Leaders involve appropriate stakeholders in decisions',
      'Leaders take accountability for decision outcomes',
      'Leaders learn from both successful and unsuccessful decisions'
    ]
  }
};

// Employee Experience module structure - uses 0-10 scale (7-10 favorable)
const employeeExperienceStructure = {
  'Work Environment': [
    'How satisfied are you with your physical workspace?',
    'How satisfied are you with the company culture?',
    'How satisfied are you with work flexibility options?',
    'How satisfied are you with available resources and tools?'
  ],
  'Career Growth': [
    'How satisfied are you with career advancement opportunities?',
    'How satisfied are you with professional development support?',
    'How satisfied are you with mentoring and guidance?',
    'How satisfied are you with skill-building opportunities?'
  ],
  'Recognition & Rewards': [
    'How satisfied are you with compensation and benefits?',
    'How satisfied are you with recognition for good work?',
    'How satisfied are you with performance evaluation process?',
    'How satisfied are you with reward systems?'
  ],
  'Work-Life Balance': [
    'How satisfied are you with your work-life balance?',
    'How satisfied are you with workload management?',
    'How satisfied are you with time-off policies?',
    'How satisfied are you with stress management support?'
  ]
};

// Generate realistic survey responses
function generateRandomResponse(scale: '1-5' | '0-10'): number {
  if (scale === '1-5') {
    // Generate responses with bias toward positive (4-5)
    const random = Math.random();
    if (random < 0.4) return Math.random() < 0.6 ? 4 : 5; // 40% chance of 4-5
    if (random < 0.7) return 3; // 30% chance of 3
    return Math.random() < 0.5 ? 1 : 2; // 30% chance of 1-2
  } else {
    // 0-10 scale with bias toward favorable (7-10)
    const random = Math.random();
    if (random < 0.45) return Math.floor(Math.random() * 4) + 7; // 45% chance of 7-10
    if (random < 0.7) return Math.floor(Math.random() * 2) + 5; // 25% chance of 5-6
    return Math.floor(Math.random() * 5); // 30% chance of 0-4
  }
}

// Generate participant IDs
function generateParticipantIds(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `participant-${String(i + 1).padStart(3, '0')}`);
}

// Generate survey dates
function generateSurveyDates(count: number): string[] {
  const dates = [];
  const startDate = new Date('2024-01-15');
  const endDate = new Date('2024-02-15');
  
  for (let i = 0; i < count; i++) {
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    dates.push(new Date(randomTime).toISOString().split('T')[0]);
  }
  
  return dates;
}

// Generate mock data
export function generateMockData(surveyId?: string) {
  const participantCount = surveyId ? 50 : 150; // Smaller dataset for specific surveys
  const participantIds = generateParticipantIds(participantCount);
  const dates = generateSurveyDates(participantCount);

  // Generate AI Readiness data (6 questions total)
  const aiReadinessData: AIReadinessResponse[] = [];
  aiReadinessQuestions.forEach((question, qIndex) => {
    // Determine section for this question
    let section = '';
    if (qIndex < 2) section = 'Strategy & Leadership';
    else if (qIndex < 4) section = 'Infrastructure & Skills';
    else section = 'Data & Culture';

    participantIds.forEach((participantId, pIndex) => {
      aiReadinessData.push({
        section,
        question,
        response: generateRandomResponse('1-5'),
        respondentId: participantId,
        date: dates[pIndex],
        surveyId: surveyId || `general-survey-${Math.floor(pIndex / 10)}`,
        participantType: Math.random() < 0.3 ? 'manager' : 'employee'
      });
    });
  });

  // Generate Leadership data (8 questions total - 4 per lens/driver category)
  const leadershipData: LeadershipResponse[] = [];
  Object.entries(leadershipStructure).forEach(([type, categories]) => {
    Object.entries(categories).forEach(([categoryName, questions]) => {
      questions.forEach(question => {
        participantIds.forEach((participantId, pIndex) => {
          leadershipData.push({
            lens: type === 'Lens' ? categoryName : '',
            configuration: type === 'Driver' ? categoryName : '',
            driver: categoryName,
            question,
            response: generateRandomResponse('1-5'),
            respondentId: participantId,
            date: dates[pIndex],
            surveyId: surveyId || `general-survey-${Math.floor(pIndex / 10)}`,
            participantType: Math.random() < 0.3 ? 'manager' : 'employee'
          });
        });
      });
    });
  });

  // Generate Employee Experience data (16 questions total, 0-10 scale)
  const employeeExperienceData: EmployeeExperienceResponse[] = [];
  Object.entries(employeeExperienceStructure).forEach(([category, questions]) => {
    questions.forEach(question => {
      participantIds.forEach((participantId, pIndex) => {
        employeeExperienceData.push({
          category,
          driver: category,
          question,
          response: generateRandomResponse('0-10'),
          scale: '0-10',
          respondentId: participantId,
          date: dates[pIndex],
          surveyId: surveyId || `general-survey-${Math.floor(pIndex / 10)}`,
          participantType: Math.random() < 0.3 ? 'manager' : 'employee'
        });
      });
    });
  });

  return {
    aiReadinessData,
    leadershipData,
    employeeExperienceData
  };
}

// Export survey structure for components
export { aiReadinessQuestions, aiReadinessSections, leadershipStructure, employeeExperienceStructure };