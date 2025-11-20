// Survey question definitions for LEAP Survey

import type { SurveyQuestionData } from '../components/SurveySection';

// AI Readiness Questions
export const aiReadinessQuestions: SurveyQuestionData[] = [
  // Section 1 – Vision & Strategy
  {
    id: 'ai-vision-1',
    question: 'The organization clearly explains how AI supports its long-term business strategy',
    section: 'Vision & Strategy',
    scale: '1-5'
  },
  {
    id: 'ai-vision-2',
    question: 'The organization communicates a clear vision for how AI supports long-term business success',
    section: 'Vision & Strategy',
    scale: '1-5'
  },
  {
    id: 'ai-vision-3',
    question: 'Leaders share how AI connects to the organization\'s broader vision and strategy',
    section: 'Vision & Strategy',
    scale: '1-5'
  },
  {
    id: 'ai-vision-4',
    question: 'Leaders describe how AI will help the organization achieve its strategic goals',
    section: 'Vision & Strategy',
    scale: '1-5'
  },
  {
    id: 'ai-vision-5',
    question: 'Leaders make a compelling case for why AI matters to the organization\'s success',
    section: 'Vision & Strategy',
    scale: '1-5'
  },

  // Section 2 – Planning & Communication
  {
    id: 'ai-planning-1',
    question: 'The organization shares specific plans for where and how AI will be used across the business',
    section: 'Planning & Communication',
    scale: '1-5'
  },
  {
    id: 'ai-planning-2',
    question: 'The organization communicates upcoming changes to systems, tools, or workflows as AI adoption expands',
    section: 'Planning & Communication',
    scale: '1-5'
  },
  {
    id: 'ai-planning-3',
    question: 'The organization outlines how different parts of the business will use AI to create value',
    section: 'Planning & Communication',
    scale: '1-5'
  },
  {
    id: 'ai-planning-4',
    question: 'The organization shares plans for building the systems and infrastructure needed to support AI',
    section: 'Planning & Communication',
    scale: '1-5'
  },

  // Section 3 – Leadership & Commitment
  {
    id: 'ai-leadership-commitment-1',
    question: 'Senior leaders invest in AI projects that push the business in new directions',
    section: 'Leadership & Commitment',
    scale: '1-5'
  },
  {
    id: 'ai-leadership-commitment-2',
    question: 'Senior leaders set ambitious goals for using AI in the business',
    section: 'Leadership & Commitment',
    scale: '1-5'
  },
  {
    id: 'ai-leadership-commitment-3',
    question: 'Leaders shift resources to AI priorities (e.g., time, money, teams)',
    section: 'Leadership & Commitment',
    scale: '1-5'
  },
  {
    id: 'ai-leadership-commitment-4',
    question: 'Leaders help employees build confidence using AI in their work',
    section: 'Leadership & Commitment',
    scale: '1-5'
  },
  {
    id: 'ai-leadership-commitment-5',
    question: 'Leaders talk about AI in ways that are clear and easy to understand',
    section: 'Leadership & Commitment',
    scale: '1-5'
  },

  // Section 4 – Leadership in Action
  {
    id: 'ai-leadership-action-1',
    question: 'Senior leaders from different parts of the organization are changing how work gets done with AI',
    section: 'Leadership in Action',
    scale: '1-5'
  },
  {
    id: 'ai-leadership-action-2',
    question: 'Leaders share examples of how they are integrating AI into their work',
    section: 'Leadership in Action',
    scale: '1-5'
  },
  {
    id: 'ai-leadership-action-3',
    question: 'Leaders help teams evolve how work is done to take advantage of AI',
    section: 'Leadership in Action',
    scale: '1-5'
  },
  {
    id: 'ai-leadership-action-4',
    question: 'Leaders guide teams in evolving their ways of working to take full advantage of AI',
    section: 'Leadership in Action',
    scale: '1-5'
  },
  {
    id: 'ai-leadership-action-5',
    question: 'Teams change how they plan, collaborate, or deliver work to integrate AI',
    section: 'Leadership in Action',
    scale: '1-5'
  },
  {
    id: 'ai-leadership-action-6',
    question: 'Leaders challenge teams to rethink how work gets done with AI',
    section: 'Leadership in Action',
    scale: '1-5'
  },

  // Section 5 – Guidance & Accountability
  {
    id: 'ai-guidance-1',
    question: 'The organization shares real examples of how jobs or tasks are changing with AI',
    section: 'Guidance & Accountability',
    scale: '1-5'
  },
  {
    id: 'ai-guidance-2',
    question: 'The organization gives clear guidance on how to integrate AI in daily work',
    section: 'Guidance & Accountability',
    scale: '1-5'
  },
  {
    id: 'ai-guidance-3',
    question: 'The organization communicates who is accountable for results when AI is involved',
    section: 'Guidance & Accountability',
    scale: '1-5'
  },
  {
    id: 'ai-guidance-4',
    question: 'The organization clearly defines which tasks should be done by people and which by AI',
    section: 'Guidance & Accountability',
    scale: '1-5'
  },
  {
    id: 'ai-guidance-5',
    question: 'The organization expects employees to check and improve AI-generated work before using it',
    section: 'Guidance & Accountability',
    scale: '1-5'
  },

  // Section 6 – Ownership & Governance
  {
    id: 'ai-ownership-1',
    question: 'The organization has a designated employee or team responsible for the AI strategy',
    section: 'Ownership & Governance',
    scale: '1-5'
  },
  {
    id: 'ai-ownership-2',
    question: 'The organization has a designated employee or team responsible for the success of AI initiatives',
    section: 'Ownership & Governance',
    scale: '1-5'
  },
  {
    id: 'ai-ownership-3',
    question: 'The organization holds employees or teams accountable for the success of AI initiatives',
    section: 'Ownership & Governance',
    scale: '1-5'
  },
  {
    id: 'ai-ownership-4',
    question: 'The organization assigns clear owners for AI initiatives',
    section: 'Ownership & Governance',
    scale: '1-5'
  },

  // Section 7 – Policies & Risk Management
  {
    id: 'ai-policies-1',
    question: 'The organization sets clear rules for how AI can and cannot be used at work',
    section: 'Policies & Risk Management',
    scale: '1-5'
  },
  {
    id: 'ai-policies-2',
    question: 'Leaders review AI-generated outputs before they are used in high-stakes or external work',
    section: 'Policies & Risk Management',
    scale: '1-5'
  },
  {
    id: 'ai-policies-3',
    question: 'The organization addresses inappropriate use of AI at work',
    section: 'Policies & Risk Management',
    scale: '1-5'
  },
  {
    id: 'ai-policies-4',
    question: 'There are clear consequences for using AI in ways that break rules or bypass reviews',
    section: 'Policies & Risk Management',
    scale: '1-5'
  },
  {
    id: 'ai-policies-5',
    question: 'The organization reviews AI systems for risk, compliance, or ethical concerns',
    section: 'Policies & Risk Management',
    scale: '1-5'
  },
  {
    id: 'ai-policies-6',
    question: 'The organization updates its AI practices based on regulatory or industry guidance',
    section: 'Policies & Risk Management',
    scale: '1-5'
  },
  {
    id: 'ai-policies-7',
    question: 'The organization mitigates AI risks before they become major problems',
    section: 'Policies & Risk Management',
    scale: '1-5'
  },
  {
    id: 'ai-policies-8',
    question: 'The organization proactively handles AI risks before they become major problems',
    section: 'Policies & Risk Management',
    scale: '1-5'
  },
  {
    id: 'ai-policies-9',
    question: 'The organization addresses the risks of integrating AI into daily work before they become major problems',
    section: 'Policies & Risk Management',
    scale: '1-5'
  },

  // Section 8 – Skills & Talent
  {
    id: 'ai-skills-1',
    question: 'Leaders coach teams on how to use AI effectively',
    section: 'Skills & Talent',
    scale: '1-5'
  },
  {
    id: 'ai-skills-2',
    question: 'The organization provides training to help people use AI in their roles',
    section: 'Skills & Talent',
    scale: '1-5'
  },
  {
    id: 'ai-skills-3',
    question: 'The organization supports non-technical employees in understanding how AI creates value',
    section: 'Skills & Talent',
    scale: '1-5'
  },
  {
    id: 'ai-skills-4',
    question: 'The organization hires technical talent with the skills to build and manage AI systems (e.g., data scientists, ML engineers)',
    section: 'Skills & Talent',
    scale: '1-5'
  },
  {
    id: 'ai-skills-5',
    question: 'Leaders give AI talent the tools, data access, and decision rights they need to succeed',
    section: 'Skills & Talent',
    scale: '1-5'
  },
  {
    id: 'ai-skills-6',
    question: 'The organization includes AI experts in business teams to deliver impact',
    section: 'Skills & Talent',
    scale: '1-5'
  },
  {
    id: 'ai-skills-7',
    question: 'The organization adjusts hiring and retention practices to compete for AI talent',
    section: 'Skills & Talent',
    scale: '1-5'
  },

  // Section 9 – Infrastructure & Tools
  {
    id: 'ai-infrastructure-1',
    question: 'The organization integrates AI into the systems and tools employees use every day',
    section: 'Infrastructure & Tools',
    scale: '1-5'
  },
  {
    id: 'ai-infrastructure-2',
    question: 'Employees can access the AI tools they need to do their work effectively',
    section: 'Infrastructure & Tools',
    scale: '1-5'
  },
  {
    id: 'ai-infrastructure-3',
    question: 'Employees have access to the data they need to get value from AI tools',
    section: 'Infrastructure & Tools',
    scale: '1-5'
  },
  {
    id: 'ai-infrastructure-4',
    question: 'The organization works with external partners to strengthen AI systems and infrastructure',
    section: 'Infrastructure & Tools',
    scale: '1-5'
  },
  {
    id: 'ai-infrastructure-5',
    question: 'The organization updates workflows or responsibilities when AI changes how work gets done',
    section: 'Infrastructure & Tools',
    scale: '1-5'
  },

  // Section 10 – Investment & Innovation
  {
    id: 'ai-investment-1',
    question: 'The organization invests in AI efforts that show strong results or potential',
    section: 'Investment & Innovation',
    scale: '1-5'
  },
  {
    id: 'ai-investment-2',
    question: 'Leaders prioritize funding, staffing, or visibility for high-impact AI use cases',
    section: 'Investment & Innovation',
    scale: '1-5'
  },
  {
    id: 'ai-investment-3',
    question: 'The organization recognizes teams that use AI in effective or creative ways',
    section: 'Investment & Innovation',
    scale: '1-5'
  },
  {
    id: 'ai-investment-4',
    question: 'Leaders encourage teams to experiment with new ways of using AI',
    section: 'Investment & Innovation',
    scale: '1-5'
  },
  {
    id: 'ai-investment-5',
    question: 'Leaders adjust how AI is used based on what works and what doesn\'t in practice',
    section: 'Investment & Innovation',
    scale: '1-5'
  },
  {
    id: 'ai-investment-6',
    question: 'Employee feedback leads to changes in AI tools or workflows',
    section: 'Investment & Innovation',
    scale: '1-5'
  },
  {
    id: 'ai-investment-7',
    question: 'The organization updates its AI approach based on new trends or insights',
    section: 'Investment & Innovation',
    scale: '1-5'
  },

  // Section 11 – Customers & Ecosystem
  {
    id: 'ai-customers-1',
    question: 'Leaders encourage teams to share how they use AI to solve real work problems',
    section: 'Customers & Ecosystem',
    scale: '1-5'
  },
  {
    id: 'ai-customers-2',
    question: 'Leaders use AI to change how customers interact with the organization',
    section: 'Customers & Ecosystem',
    scale: '1-5'
  },
  {
    id: 'ai-customers-3',
    question: 'The organization replaces manual customer interactions with automated or AI-led experiences',
    section: 'Customers & Ecosystem',
    scale: '1-5'
  },
  {
    id: 'ai-customers-4',
    question: 'Employees use AI tools to predict or respond to customer needs in real time',
    section: 'Customers & Ecosystem',
    scale: '1-5'
  },
  {
    id: 'ai-customers-5',
    question: 'Teams use AI to create personalized or adaptive products, services, or experiences',
    section: 'Customers & Ecosystem',
    scale: '1-5'
  },
  {
    id: 'ai-customers-6',
    question: 'The organization works with specialized talent or vendors to accelerate AI innovation',
    section: 'Customers & Ecosystem',
    scale: '1-5'
  },
  {
    id: 'ai-customers-7',
    question: 'Leaders bring in external experts to support AI use across teams',
    section: 'Customers & Ecosystem',
    scale: '1-5'
  },
  {
    id: 'ai-customers-8',
    question: 'The organization works with external partners to build or scale AI solutions',
    section: 'Customers & Ecosystem',
    scale: '1-5'
  },
  {
    id: 'ai-customers-9',
    question: 'The organization learns from external partners to stay current on AI practices and trends',
    section: 'Customers & Ecosystem',
    scale: '1-5'
  },

  // Section 12 – Norms
  {
    id: 'ai-norms-1',
    question: 'Teams I work on establish clear expectations and norms for how to apply AI in our daily work',
    section: 'Norms',
    scale: '1-5'
  },

  // Section 13 – Self-Efficacy
  {
    id: 'ai-self-efficacy-1',
    question: 'I have the skills to confidently work with AI',
    section: 'Self-Efficacy',
    scale: '1-5'
  },

  // Section 14 – Employee Attitudes
  {
    id: 'ai-attitudes-1',
    question: 'I can trust AI to help me complete my tasks',
    section: 'Employee Attitudes',
    scale: '1-5'
  },

  // Section 15 – Roadblocks to Adoption
  {
    id: 'ai-roadblocks-1',
    question: 'What stops you from using AI more at work? Select primary reason',
    section: 'Roadblocks to Adoption',
    scale: 'roadblocks'
  }
];

// Leadership Module Questions
export const leadershipQuestions: SurveyQuestionData[] = [
  // Configuration - Diverse Perspectives
  {
    id: 'leadership-diverse-1',
    question: 'We utilize the unique perspectives of all team members',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Configuration',
    configuration: 'Diverse Perspectives',
    driver: 'Diverse Perspectives'
  },
  {
    id: 'leadership-diverse-2',
    question: 'We seek input from people outside the team',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Configuration',
    configuration: 'Diverse Perspectives',
    driver: 'Diverse Perspectives'
  },
  {
    id: 'leadership-diverse-3',
    question: 'We balance our team with members from various backgrounds and with different expertise',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Configuration',
    configuration: 'Diverse Perspectives',
    driver: 'Diverse Perspectives'
  },
  {
    id: 'leadership-diverse-4',
    question: 'We bring in new team members when needed to ensure we have a mix of perspectives',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Configuration',
    configuration: 'Diverse Perspectives',
    driver: 'Diverse Perspectives'
  },

  // Configuration - External Orientation
  {
    id: 'leadership-external-1',
    question: 'We invite ideas from people outside of the team',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Configuration',
    configuration: 'External Orientation',
    driver: 'External Orientation'
  },
  {
    id: 'leadership-external-2',
    question: 'We bring in outside perspectives (e.g., stakeholders beyond the team, experts outside our organization)',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Configuration',
    configuration: 'External Orientation',
    driver: 'External Orientation'
  },
  {
    id: 'leadership-external-3',
    question: 'We work with outside experts to explore new ways to solve problems',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Configuration',
    configuration: 'External Orientation',
    driver: 'External Orientation'
  },

  // Configuration - Role Definition
  {
    id: 'leadership-role-1',
    question: 'We ensure we have the right people in the right roles',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Configuration',
    configuration: 'Role Definition',
    driver: 'Role Definition'
  },
  {
    id: 'leadership-role-2',
    question: 'We clarify who is doing what on the team',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Configuration',
    configuration: 'Role Definition',
    driver: 'Role Definition'
  },
  {
    id: 'leadership-role-3',
    question: 'We discuss the team structure and how we operate',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Configuration',
    configuration: 'Role Definition',
    driver: 'Role Definition'
  },

  // Alignment - Commitment
  {
    id: 'leadership-commitment-1',
    question: 'We demonstrate equal commitment to the team\'s success',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Alignment',
    configuration: 'Commitment',
    driver: 'Commitment'
  },
  {
    id: 'leadership-commitment-2',
    question: 'We put in extra effort when necessary to support the team\'s objectives',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Alignment',
    configuration: 'Commitment',
    driver: 'Commitment'
  },
  {
    id: 'leadership-commitment-3',
    question: 'We dedicate extra time and effort when the team needs additional support',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Alignment',
    configuration: 'Commitment',
    driver: 'Commitment'
  },
  {
    id: 'leadership-commitment-4',
    question: 'We assist other team members to help them achieve team goals',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Alignment',
    configuration: 'Commitment',
    driver: 'Commitment'
  },

  // Alignment - Goals
  {
    id: 'leadership-goals-1',
    question: 'We set goals in line with the work to be done (whether individual- and/or team-level goals)',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Alignment',
    configuration: 'Goals',
    driver: 'Goals'
  },
  {
    id: 'leadership-goals-2',
    question: 'We agree on what the most important tasks are',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Alignment',
    configuration: 'Goals',
    driver: 'Goals'
  },
  {
    id: 'leadership-goals-3',
    question: 'We understand how team goals contribute to the organization\'s mission',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Alignment',
    configuration: 'Goals',
    driver: 'Goals'
  },

  // Alignment - Purpose
  {
    id: 'leadership-purpose-1',
    question: 'We spend time to ensure all team members are aligned on what the team is meant to accomplish',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Alignment',
    configuration: 'Purpose',
    driver: 'Purpose'
  },
  {
    id: 'leadership-purpose-2',
    question: 'We clarify what the team is supposed to accomplish',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Alignment',
    configuration: 'Purpose',
    driver: 'Purpose'
  },
  {
    id: 'leadership-purpose-3',
    question: 'We make sure the team\'s purpose is in line with the organization\'s purpose',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Alignment',
    configuration: 'Purpose',
    driver: 'Purpose'
  },

  // Execution - Collaboration
  {
    id: 'leadership-collaboration-1',
    question: 'We follow agreed-upon team norms to guide how we collaborate',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Collaboration',
    driver: 'Collaboration'
  },
  {
    id: 'leadership-collaboration-2',
    question: 'We put aside our egos to increase collaboration',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Collaboration',
    driver: 'Collaboration'
  },
  {
    id: 'leadership-collaboration-3',
    question: 'We use setbacks to discuss how to work together better',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Collaboration',
    driver: 'Collaboration'
  },
  {
    id: 'leadership-collaboration-4',
    question: 'We help each other on team tasks',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Collaboration',
    driver: 'Collaboration'
  },

  // Execution - Communication
  {
    id: 'leadership-communication-1',
    question: 'We communicate as often as needed to get work done well',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Communication',
    driver: 'Communication'
  },
  {
    id: 'leadership-communication-2',
    question: 'We choose the right communication method (e.g., meetings versus emails) for each task',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Communication',
    driver: 'Communication'
  },
  {
    id: 'leadership-communication-3',
    question: 'We say what we mean',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Communication',
    driver: 'Communication'
  },

  // Execution - Decision Making
  {
    id: 'leadership-decision-1',
    question: 'We clarify everyone\'s roles when making decisions (i.e., who has final say versus providing input)',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Decision Making',
    driver: 'Decision Making'
  },
  {
    id: 'leadership-decision-2',
    question: 'We identify root causes of wrong decisions we\'ve made',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Decision Making',
    driver: 'Decision Making'
  },
  {
    id: 'leadership-decision-3',
    question: 'We quickly align on decisions',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Decision Making',
    driver: 'Decision Making'
  },

  // Execution - Feedback
  {
    id: 'leadership-feedback-1',
    question: 'We accept feedback, even when the delivery is poor',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Feedback',
    driver: 'Feedback'
  },
  {
    id: 'leadership-feedback-2',
    question: 'We give each other honest feedback without holding back',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Feedback',
    driver: 'Feedback'
  },
  {
    id: 'leadership-feedback-3',
    question: 'We invite direct feedback without getting defensive',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Feedback',
    driver: 'Feedback'
  },

  // Execution - Meeting Effectiveness
  {
    id: 'leadership-meetings-1',
    question: 'We end meetings with clear next steps (e.g., decisions made, task owners, timelines)',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Meeting Effectiveness',
    driver: 'Meeting Effectiveness'
  },
  {
    id: 'leadership-meetings-2',
    question: 'We involve the right people in our meetings',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Meeting Effectiveness',
    driver: 'Meeting Effectiveness'
  },
  {
    id: 'leadership-meetings-3',
    question: 'We use meeting time to discuss our toughest problems versus information-sharing',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Meeting Effectiveness',
    driver: 'Meeting Effectiveness'
  },
  {
    id: 'leadership-meetings-4',
    question: 'We meet frequently enough to achieve outcomes',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Meeting Effectiveness',
    driver: 'Meeting Effectiveness'
  },
  {
    id: 'leadership-meetings-5',
    question: 'We actively participate during meetings',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Execution',
    configuration: 'Meeting Effectiveness',
    driver: 'Meeting Effectiveness'
  },

  // Renewal - Belonging
  {
    id: 'leadership-belonging-1',
    question: 'We treat all team members as part of the team (i.e., no cliques/sub-groups)',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Belonging',
    driver: 'Belonging'
  },
  {
    id: 'leadership-belonging-2',
    question: 'We create a sense of belonging on the team',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Belonging',
    driver: 'Belonging'
  },
  {
    id: 'leadership-belonging-3',
    question: 'We develop meaningful work relationships with each other',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Belonging',
    driver: 'Belonging'
  },

  // Renewal - Conflict Management
  {
    id: 'leadership-conflict-1',
    question: 'We engage in conflict without letting negative feelings build',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Conflict Management',
    driver: 'Conflict Management'
  },
  {
    id: 'leadership-conflict-2',
    question: 'We use disagreements as creative input',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Conflict Management',
    driver: 'Conflict Management'
  },
  {
    id: 'leadership-conflict-3',
    question: 'We challenge the task at hand, not the person doing the work',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Conflict Management',
    driver: 'Conflict Management'
  },

  // Renewal - Innovative Thinking
  {
    id: 'leadership-innovation-1',
    question: 'We let go of ways of working that do not serve us anymore',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Innovative Thinking',
    driver: 'Innovative Thinking'
  },
  {
    id: 'leadership-innovation-2',
    question: 'We seek out opposing perspectives to come up with new solutions',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Innovative Thinking',
    driver: 'Innovative Thinking'
  },
  {
    id: 'leadership-innovation-3',
    question: 'We are each empowered to test new ideas',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Innovative Thinking',
    driver: 'Innovative Thinking'
  },

  // Renewal - Psychological Safety
  {
    id: 'leadership-psych-safety-1',
    question: 'We disagree with one another without fear of negative consequences',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Psychological Safety',
    driver: 'Psychological Safety'
  },
  {
    id: 'leadership-psych-safety-2',
    question: 'We confront each other\'s mistakes with kindness',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Psychological Safety',
    driver: 'Psychological Safety'
  },
  {
    id: 'leadership-psych-safety-3',
    question: 'We admit when we don\'t know something without concern for being judged',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Psychological Safety',
    driver: 'Psychological Safety'
  },
  {
    id: 'leadership-psych-safety-4',
    question: 'We engage all voices on the team (i.e., no dominating or silent voices)',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Psychological Safety',
    driver: 'Psychological Safety'
  },

  // Renewal - Recognition
  {
    id: 'leadership-recognition-1',
    question: 'We are recognized for good work',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Recognition',
    driver: 'Recognition'
  },
  {
    id: 'leadership-recognition-2',
    question: 'We are provided recognition for our contributions',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Recognition',
    driver: 'Recognition'
  },
  {
    id: 'leadership-recognition-3',
    question: 'We recognize team members for their achievements',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Recognition',
    driver: 'Recognition'
  },

  // Renewal - Trust
  {
    id: 'leadership-trust-1',
    question: 'We can rely on each other to deliver work with the highest standards',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Trust',
    driver: 'Trust'
  },
  {
    id: 'leadership-trust-2',
    question: 'We each demonstrate good judgment',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Trust',
    driver: 'Trust'
  },
  {
    id: 'leadership-trust-3',
    question: 'We can depend on each other to deliver on our commitments',
    section: 'Leadership Module',
    scale: '1-5',
    lens: 'Renewal',
    configuration: 'Trust',
    driver: 'Trust'
  }
];

// Employee Experience Questions
export const employeeExperienceQuestions: SurveyQuestionData[] = [
  // Fulfillment - Satisfaction & Meaning
  {
    id: 'ee-satisfaction-1',
    question: 'I feel satisfied with my role at the organization',
    section: 'Employee Experience',
    scale: '0-10',
    category: 'Fulfillment',
    driver: 'Satisfaction & Meaning'
  },
  {
    id: 'ee-satisfaction-2',
    question: 'My work provides me with a sense of meaning',
    section: 'Employee Experience',
    scale: '0-10',
    category: 'Fulfillment',
    driver: 'Satisfaction & Meaning'
  },

  // Fulfillment - Energy & Wellbeing
  {
    id: 'ee-energy-1',
    question: 'My work leaves me feeling energized',
    section: 'Employee Experience',
    scale: '0-10',
    category: 'Fulfillment',
    driver: 'Energy & Wellbeing'
  },
  {
    id: 'ee-energy-2',
    question: 'I am able to manage my workload without feeling burnt out',
    section: 'Employee Experience',
    scale: '0-10',
    category: 'Fulfillment',
    driver: 'Energy & Wellbeing'
  },

  // Development - Professional Growth
  {
    id: 'ee-growth-1',
    question: 'I am growing professionally at the organization',
    section: 'Employee Experience',
    scale: '0-10',
    category: 'Development',
    driver: 'Professional Growth'
  },
  {
    id: 'ee-growth-2',
    question: 'I have the same opportunities for growth and success as others here',
    section: 'Employee Experience',
    scale: '0-10',
    category: 'Development',
    driver: 'Professional Growth'
  },

  // Development - Career Flexibility
  {
    id: 'ee-flexibility-1',
    question: 'My career path at this organization can adjust as my interests or goals evolve',
    section: 'Employee Experience',
    scale: '0-10',
    category: 'Development',
    driver: 'Career Flexibility'
  },

  // Voice & Safety - Psychological Safety
  {
    id: 'ee-voice-safety-1',
    question: 'I can make mistakes without fearing retaliation or criticism',
    section: 'Employee Experience',
    scale: '0-10',
    category: 'Voice & Safety',
    driver: 'Psychological Safety'
  },
  {
    id: 'ee-voice-safety-2',
    question: 'I can share ideas or suggestions, even when others might disagree',
    section: 'Employee Experience',
    scale: '0-10',
    category: 'Voice & Safety',
    driver: 'Psychological Safety'
  },

  // Retention - Commitment Outlook
  {
    id: 'ee-retention-1',
    question: 'I do not expect to leave the organization within the next six months',
    section: 'Employee Experience',
    scale: '0-10',
    category: 'Retention',
    driver: 'Commitment Outlook'
  },

  // Advocacy - Employee Net Promoter
  {
    id: 'ee-advocacy-1',
    question: 'I would recommend working at this organization to friends and relatives',
    section: 'Employee Experience',
    scale: '0-10',
    category: 'Advocacy',
    driver: 'Employee Net Promoter'
  }
];