import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { SurveyQuestion } from './SurveyQuestion';

export interface SurveyQuestionData {
  id: string;
  question: string;
  section: string;
  scale: '1-5' | '0-10' | 'roadblocks';
  lens?: string;
  configuration?: string;
  driver?: string;
  category?: string;
}

interface SurveySectionProps {
  title: string;
  description: string;
  questions: SurveyQuestionData[];
  responses: Record<string, string>;
  onResponseChange: (questionId: string, value: string) => void;
  onComplete: () => void;
  isCompleted: boolean;
}

export function SurveySection({ 
  title, 
  description, 
  questions, 
  responses, 
  onResponseChange, 
  onComplete,
  isCompleted 
}: SurveySectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );
  
  const answeredQuestions = questions.filter(q => responses[q.id]).length;
  const progressPercentage = (answeredQuestions / questions.length) * 100;
  
  const canGoNext = currentPage < totalPages - 1;
  const canGoPrev = currentPage > 0;
  
  const handleNext = () => {
    if (canGoNext) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleComplete = () => {
    if (answeredQuestions === questions.length) {
      onComplete();
    }
  };

  if (isCompleted) {
    return (
      <Card className="text-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
          <h3 className="text-xl font-semibold text-green-700">{title} - Completed!</h3>
          <p className="text-gray-600">Thank you for completing this section.</p>
          <div className="text-sm text-gray-500">
            {answeredQuestions} of {questions.length} questions answered
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <span className="text-sm font-normal text-gray-500">
              Page {currentPage + 1} of {totalPages}
            </span>
          </CardTitle>
          <p className="text-sm text-gray-600">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progress: {answeredQuestions} of {questions.length} questions</span>
              <span>{progressPercentage.toFixed(0)}% complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {currentQuestions.map((question) => (
          <SurveyQuestion
            key={question.id}
            question={question.question}
            questionId={question.id}
            scale={question.scale}
            value={responses[question.id]}
            onChange={onResponseChange}
            section={question.section !== title ? question.section : undefined}
          />
        ))}
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="flex justify-between items-center p-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="text-sm text-gray-600">
            Questions {currentPage * questionsPerPage + 1} - {Math.min((currentPage + 1) * questionsPerPage, questions.length)} of {questions.length}
          </div>
          
          {canGoNext ? (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={answeredQuestions < questions.length}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4" />
              Complete Section
            </Button>
          )}
        </CardContent>
      </Card>
      
      {/* Completion Status */}
      {answeredQuestions < questions.length && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800">
              Please answer all questions to complete this section. 
              {questions.length - answeredQuestions} questions remaining.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}