import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { CheckCircle, Brain, Users, Heart, Award } from 'lucide-react';
import { SurveySection } from './SurveySection';
import { aiReadinessQuestions, leadershipQuestions, employeeExperienceQuestions } from '../utils/surveyData';

interface SurveyModeProps {
  onComplete: (responses: Record<string, string>) => void;
}

export function SurveyMode({ onComplete }: SurveyModeProps) {
  const [currentSection, setCurrentSection] = useState<'intro' | 'ai-readiness' | 'leadership' | 'employee-experience' | 'complete'>('intro');
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSectionComplete = (sectionName: string) => {
    setCompletedSections(prev => new Set([...prev, sectionName]));
    
    // Auto-advance to next section
    if (sectionName === 'ai-readiness') {
      setCurrentSection('leadership');
    } else if (sectionName === 'leadership') {
      setCurrentSection('employee-experience');
    } else if (sectionName === 'employee-experience') {
      setCurrentSection('complete');
    }
  };

  const getSectionProgress = (questions: any[]) => {
    const answered = questions.filter(q => responses[q.id]).length;
    return (answered / questions.length) * 100;
  };

  const totalQuestions = aiReadinessQuestions.length + leadershipQuestions.length + employeeExperienceQuestions.length;
  const totalAnswered = Object.keys(responses).length;
  const overallProgress = (totalAnswered / totalQuestions) * 100;

  if (currentSection === 'intro') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome to the LEAP Survey</CardTitle>
            <p className="text-lg text-gray-600">
              Leadership Excellence • AI Readiness • Employee Experience
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 max-w-2xl mx-auto">
              This comprehensive survey will help us understand your organization's readiness for AI, 
              leadership effectiveness, and employee experience. Your responses will contribute to valuable insights 
              and help drive organizational improvements.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="p-6 bg-blue-50 rounded-lg">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-blue-900 mb-2">AI Readiness</h3>
                <p className="text-sm text-blue-700">{aiReadinessQuestions.length} questions</p>
                <p className="text-xs text-blue-600 mt-2">≈ 15-20 minutes</p>
              </div>
              
              <div className="p-6 bg-green-50 rounded-lg">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-900 mb-2">Leadership</h3>
                <p className="text-sm text-green-700">{leadershipQuestions.length} questions</p>
                <p className="text-xs text-green-600 mt-2">≈ 10-15 minutes</p>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-lg">
                <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-purple-900 mb-2">Employee Experience</h3>
                <p className="text-sm text-purple-700">{employeeExperienceQuestions.length} questions</p>
                <p className="text-xs text-purple-600 mt-2">≈ 5-10 minutes</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg max-w-2xl mx-auto">
              <h4 className="font-medium mb-2">Important Notes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your responses are confidential and will be aggregated with others</li>
                <li>• You can save your progress and return later</li>
                <li>• Complete all sections to contribute to the dashboard insights</li>
                <li>• Estimated total time: 30-45 minutes</li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setCurrentSection('ai-readiness')}
              size="lg"
              className="px-8"
            >
              Start Survey
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentSection === 'complete') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="text-center p-8">
          <div className="flex flex-col items-center space-y-6">
            <Award className="h-20 w-20 text-green-600" />
            <h2 className="text-3xl font-bold text-green-700">Survey Complete!</h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Thank you for taking the time to complete the LEAP Survey. Your responses have been recorded 
              and will contribute to valuable organizational insights.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">
                  {aiReadinessQuestions.filter(q => responses[q.id]).length}
                </div>
                <div className="text-sm text-green-600">AI Readiness</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">
                  {leadershipQuestions.filter(q => responses[q.id]).length}
                </div>
                <div className="text-sm text-green-600">Leadership</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">
                  {employeeExperienceQuestions.filter(q => responses[q.id]).length}
                </div>
                <div className="text-sm text-green-600">Employee Experience</div>
              </div>
            </div>
            
            <Button 
              onClick={() => onComplete(responses)}
              size="lg"
              className="px-8"
            >
              View Dashboard Results
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Progress header for all survey sections
  const progressHeader = (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">LEAP Survey Progress</h2>
          <span className="text-sm text-gray-600">
            {totalAnswered} of {totalQuestions} questions answered
          </span>
        </div>
        <Progress value={overallProgress} className="h-2 mb-3" />
        
        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${completedSections.has('ai-readiness') ? 'bg-green-500' : currentSection === 'ai-readiness' ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <span>AI Readiness</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${completedSections.has('leadership') ? 'bg-green-500' : currentSection === 'leadership' ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <span>Leadership</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${completedSections.has('employee-experience') ? 'bg-green-500' : currentSection === 'employee-experience' ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <span>Employee Experience</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {progressHeader}
      
      {currentSection === 'ai-readiness' && (
        <SurveySection
          title="AI Readiness Assessment"
          description="These questions help us understand your organization's preparedness and approach to artificial intelligence adoption."
          questions={aiReadinessQuestions}
          responses={responses}
          onResponseChange={handleResponseChange}
          onComplete={() => handleSectionComplete('ai-readiness')}
          isCompleted={completedSections.has('ai-readiness')}
        />
      )}
      
      {currentSection === 'leadership' && (
        <SurveySection
          title="Leadership Module"
          description="These questions assess leadership effectiveness across different dimensions of team performance."
          questions={leadershipQuestions}
          responses={responses}
          onResponseChange={handleResponseChange}
          onComplete={() => handleSectionComplete('leadership')}
          isCompleted={completedSections.has('leadership')}
        />
      )}
      
      {currentSection === 'employee-experience' && (
        <SurveySection
          title="Employee Experience"
          description="These questions explore your experience as an employee and your relationship with the organization."
          questions={employeeExperienceQuestions}
          responses={responses}
          onResponseChange={handleResponseChange}
          onComplete={() => handleSectionComplete('employee-experience')}
          isCompleted={completedSections.has('employee-experience')}
        />
      )}
    </div>
  );
}