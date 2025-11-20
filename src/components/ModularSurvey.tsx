import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  Brain, 
  Users, 
  Heart, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  Award,
  ArrowLeft
} from 'lucide-react';
import { SurveyQuestion } from './SurveyQuestion';
import { aiReadinessQuestions, leadershipQuestions, employeeExperienceQuestions } from '../utils/surveyData';

interface ModularSurveyProps {
  onComplete: (responses: Record<string, string>) => void;
  specificModule?: 'ai-readiness' | 'leadership' | 'employee-experience';
}

type SurveyModule = 'ai-readiness' | 'leadership' | 'employee-experience';

interface ModuleInfo {
  id: SurveyModule;
  title: string;
  description: string;
  icon: React.ReactNode;
  questions: any[];
  estimatedTime: string;
  color: string;
}

export function ModularSurvey({ onComplete, specificModule }: ModularSurveyProps) {
  // If specificModule is provided, start directly in module view
  const [currentView, setCurrentView] = useState<'overview' | 'module' | 'complete'>(
    specificModule ? 'module' : 'overview'
  );
  const [activeModule, setActiveModule] = useState<SurveyModule | null>(specificModule || null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [completedModules, setCompletedModules] = useState<Set<SurveyModule>>(new Set());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const allModules: ModuleInfo[] = [
    {
      id: 'ai-readiness',
      title: 'AI Readiness Assessment',
      description: 'Evaluate your organization\'s preparedness for AI adoption.',
      icon: <Brain className="h-6 w-6" />,
      questions: aiReadinessQuestions,
      estimatedTime: '15-20 min',
      color: 'blue'
    },
    {
      id: 'leadership',
      title: 'Leadership Excellence Module',
      description: 'Assess leadership effectiveness across key dimensions.',
      icon: <Users className="h-6 w-6" />,
      questions: leadershipQuestions,
      estimatedTime: '12-15 min',
      color: 'green'
    },
    {
      id: 'employee-experience',
      title: 'Employee Experience Module',
      description: 'Measure employee satisfaction and engagement.',
      icon: <Heart className="h-6 w-6" />,
      questions: employeeExperienceQuestions,
      estimatedTime: '8-10 min',
      color: 'purple'
    }
  ];

  // Filter to only show the specific module if provided
  const modules = specificModule 
    ? allModules.filter(m => m.id === specificModule)
    : allModules;

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleModuleStart = (moduleId: SurveyModule) => {
    setActiveModule(moduleId);
    setCurrentView('module');
    setCurrentQuestionIndex(0);
  };

  const handleModuleComplete = () => {
    if (activeModule) {
      setCompletedModules(prev => new Set([...prev, activeModule]));
      
      // If this is a standalone survey (specificModule), complete immediately
      if (specificModule) {
        onComplete(responses);
      } else {
        setActiveModule(null);
        setCurrentView('overview');
        setCurrentQuestionIndex(0);
      }
    }
  };

  const handleSurveyComplete = () => {
    // For multi-module surveys
    if (!specificModule) {
      setCurrentView('complete');
    } else {
      // For standalone, this shouldn't be reached
      onComplete(responses);
    }
  };

  const handleNextQuestion = () => {
    const currentModule = modules.find(m => m.id === activeModule);
    if (currentModule && currentQuestionIndex < currentModule.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getModuleProgress = (module: ModuleInfo) => {
    const answered = module.questions.filter(q => responses[q.id]).length;
    return (answered / module.questions.length) * 100;
  };

  const getTotalProgress = () => {
    const totalQuestions = modules.reduce((acc, module) => acc + module.questions.length, 0);
    const totalAnswered = Object.keys(responses).length;
    return (totalAnswered / totalQuestions) * 100;
  };

  const allModulesCompleted = completedModules.size === modules.length;

  if (currentView === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center space-y-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="h-12 w-12 text-green-600" />
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-headline text-gray-900">
                    Survey Completed Successfully!
                  </h1>
                  <p className="text-subheading max-w-2xl">
                    Thank you for your participation in the LEAP Survey. Your insights are valuable for organizational growth.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                  {modules.map((module) => (
                    <div key={module.id} className="p-6 bg-gray-50 rounded-lg border">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 bg-white rounded-lg">
                          {module.icon}
                        </div>
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-gray-900">
                            {module.questions.filter(q => responses[q.id]).length}
                          </div>
                          <div className="text-sm font-medium text-gray-600">
                            {module.title.split(' ')[0]} {module.title.split(' ')[1]}
                          </div>
                          <div className="text-xs text-gray-500">
                            {module.questions.length} questions
                          </div>
                        </div>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => onComplete(responses)}
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  View Dashboard Results
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === 'module' && activeModule) {
    const currentModule = modules.find(m => m.id === activeModule)!;
    const currentQuestion = currentModule.questions[currentQuestionIndex];
    const moduleProgress = ((currentQuestionIndex + 1) / currentModule.questions.length) * 100;
    const isLastQuestion = currentQuestionIndex === currentModule.questions.length - 1;
    const canProceed = responses[currentQuestion.id];

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView('overview')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Overview
                </Button>
                <Badge variant="secondary">
                  Question {currentQuestionIndex + 1} of {currentModule.questions.length}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {currentModule.icon}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">{currentModule.title}</h1>
                    <p className="text-subheading">{currentModule.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Module Progress</span>
                    <span>{Math.round(moduleProgress)}% Complete</span>
                  </div>
                  <Progress value={moduleProgress} className="h-3" />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Question */}
          <Card>
            <CardContent className="p-8">
              <SurveyQuestion
                question={currentQuestion.question}
                questionId={currentQuestion.id}
                scale={currentQuestion.scale}
                value={responses[currentQuestion.id]}
                onChange={handleResponseChange}
                section={currentQuestion.section}
              />
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="text-center">
                  <div className="text-sm text-gray-500">
                    {currentQuestionIndex + 1} of {currentModule.questions.length} questions
                  </div>
                </div>

                {isLastQuestion ? (
                  <Button
                    onClick={handleModuleComplete}
                    disabled={!canProceed}
                  >
                    Complete Module
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!canProceed}
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Overview
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-display bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              LEAP Survey Platform
            </h1>
            <p className="text-subheading max-w-3xl mx-auto">
              A comprehensive assessment platform measuring AI Readiness, Leadership Excellence, and Employee Experience.
            </p>
          </div>

          {/* Progress Overview */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Overall Progress</span>
                  <span className="text-lg font-bold text-blue-600">{Math.round(getTotalProgress())}%</span>
                </div>
                <Progress value={getTotalProgress()} className="h-4" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{Object.keys(responses).length} responses completed</span>
                  <span>{modules.reduce((acc, m) => acc + m.questions.length, 0)} total questions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {modules.map((module) => {
            const progress = getModuleProgress(module);
            const isCompleted = completedModules.has(module.id);
            const answeredQuestions = module.questions.filter(q => responses[q.id]).length;

            return (
              <Card key={module.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white rounded-lg">
                      {module.icon}
                    </div>
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-6 w-6" />
                        <span className="font-medium">Complete</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight">{module.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{module.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">{module.questions.length}</div>
                      <div className="text-xs text-gray-600">Questions</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">{module.estimatedTime}</span>
                      </div>
                      <div className="text-xs text-gray-600">Duration</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{answeredQuestions}/{module.questions.length}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleModuleStart(module.id)}
                    className="w-full py-3"
                    disabled={isCompleted && progress === 100}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Review Responses
                      </>
                    ) : progress > 0 ? (
                      <>
                        Continue Module
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        Start Module
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Complete Survey Button */}
        {allModulesCompleted && (
          <div className="text-center">
            <Card className="max-w-2xl mx-auto bg-green-50 border-green-200">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <h3 className="text-2xl font-bold">All Modules Completed!</h3>
                  </div>
                  <p className="text-gray-600">
                    Congratulations! You've successfully completed all survey modules. 
                    Click below to submit your responses and view the dashboard.
                  </p>
                  <Button
                    onClick={handleSurveyComplete}
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    Complete Survey & View Results
                    <Award className="ml-2 h-6 w-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}