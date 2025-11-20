import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Brain, Users, Heart, ExternalLink, Eye, ArrowRight } from "lucide-react";

export function SurveyTypesDemo() {
  const surveyTypes = [
    {
      id: 'ai-readiness',
      title: 'AI Readiness Assessment',
      description: 'Evaluate organizational preparedness for AI adoption and implementation',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      features: [
        'Technology Infrastructure Assessment',
        'Data Management Readiness',
        'Skills & Training Gap Analysis',
        'Organizational Culture Evaluation'
      ],
      sampleUrl: '?survey=techcorp-ai-managers-2024-abc123&modules=ai-readiness&primary=ai-readiness',
      surveyUrl: '?mode=survey&modules=ai-readiness&primary=ai-readiness',
      audience: 'Technical Leaders, CTOs, IT Managers',
      duration: '8-10 minutes'
    },
    {
      id: 'leadership',
      title: 'Leadership Effectiveness',
      description: 'Comprehensive assessment of leadership capabilities and team dynamics',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      features: [
        'Strategic Vision & Communication',
        'Team Development & Growth',
        'Decision Making Quality',
        'Change Leadership Skills'
      ],
      sampleUrl: '?survey=innovate-leadership-employees-2024-def456&modules=leadership&primary=leadership',
      surveyUrl: '?mode=survey&modules=leadership&primary=leadership',
      audience: 'Managers, Team Leaders, Executives',
      duration: '10-12 minutes'
    },
    {
      id: 'employee-experience',
      title: 'Employee Experience Survey',
      description: 'Measure workplace satisfaction and engagement across key experience drivers',
      icon: Heart,
      color: 'from-green-500 to-emerald-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      features: [
        'Work Environment & Culture',
        'Career Growth Opportunities',
        'Recognition & Rewards',
        'Work-Life Balance Assessment'
      ],
      sampleUrl: '?survey=startupco-employee-mixed-2024-ghi789&modules=employee-experience&primary=employee-experience',
      surveyUrl: '?mode=survey&modules=employee-experience&primary=employee-experience',
      audience: 'All Employees, HR Teams',
      duration: '12-15 minutes'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">LEAP Survey Platform</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose from our specialized survey modules or explore sample dashboards to see how LEAP can transform your organizational insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {surveyTypes.map((survey) => {
          const IconComponent = survey.icon;
          
          return (
            <Card key={survey.id} className={`${survey.borderColor} hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${survey.bgColor} mb-4`}>
                    <IconComponent className={`h-6 w-6 ${survey.textColor}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {survey.duration}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{survey.title}</CardTitle>
                <CardDescription className="text-sm">
                  {survey.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Assessment Areas:</h4>
                  <ul className="space-y-1">
                    {survey.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${survey.bgColor} ${survey.textColor}`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-3 rounded-lg ${survey.bgColor}`}>
                  <p className="text-xs font-medium text-gray-700 mb-1">Target Audience</p>
                  <p className="text-sm text-gray-900">{survey.audience}</p>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => window.location.href = survey.surveyUrl}
                  >
                    Take Survey
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = survey.sampleUrl}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Sample Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">
            Custom Multi-Module Surveys
          </CardTitle>
          <CardDescription>
            Need a comprehensive assessment? Combine multiple modules for a complete organizational evaluation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              onClick={() => window.location.href = '?survey=megacorp-ai-managers-2024-jkl012&modules=ai-readiness,leadership&primary=ai-readiness'}
            >
              <Eye className="h-4 w-4 mr-2" />
              AI + Leadership Sample
            </Button>
            <div className="text-sm text-gray-600">
              See how multiple modules work together for comprehensive insights
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}