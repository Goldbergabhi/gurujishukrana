import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TrendingUp, AlertTriangle, BarChart3, Users, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { SurveyCampaign } from "../types/survey";
import { MyResponsesResults } from "./MyResponsesResults";

interface PostSurveyResultsPanelProps {
  module: string;
  campaign?: SurveyCampaign;
  surveyResponses: Record<string, string>;
  mockData: any;
}

export function PostSurveyResultsPanel({ module, campaign, surveyResponses, mockData }: PostSurveyResultsPanelProps) {
  // Mock question scores data
  const questionScores = useMemo(() => {
    if (module === 'ai-readiness') {
      return [
        { question: 'Technology Infrastructure', positive: 78, neutral: 15, negative: 7 },
        { question: 'Data Management', positive: 71, neutral: 22, negative: 7 },
        { question: 'Skills & Training', positive: 69, neutral: 18, negative: 13 },
        { question: 'Strategy & Culture', positive: 82, neutral: 12, negative: 6 }
      ];
    } else if (module === 'leadership') {
      return [
        { question: 'Strategic Vision', positive: 85, neutral: 10, negative: 5 },
        { question: 'Team Development', positive: 79, neutral: 16, negative: 5 },
        { question: 'Decision Making', positive: 73, neutral: 19, negative: 8 },
        { question: 'Change Leadership', positive: 77, neutral: 15, negative: 8 }
      ];
    } else {
      return [
        { question: 'Work Environment', positive: 74, neutral: 18, negative: 8 },
        { question: 'Career Growth', positive: 68, neutral: 22, negative: 10 },
        { question: 'Recognition & Rewards', positive: 71, neutral: 20, negative: 9 },
        { question: 'Work-Life Balance', positive: 76, neutral: 16, negative: 8 },
        { question: 'Communication', positive: 69, neutral: 23, negative: 8 }
      ];
    }
  }, [module]);

  // Mock demographic comparison data
  const demographicScores = useMemo(() => [
    { department: 'Engineering', score: 79 },
    { department: 'Product', score: 82 },
    { department: 'Design', score: 74 },
    { department: 'Marketing', score: 77 },
    { department: 'Sales', score: 71 }
  ], []);

  // Mock trend data
  const trendData = useMemo(() => [
    { month: 'Jun', score: 72 },
    { month: 'Jul', score: 74 },
    { month: 'Aug', score: 71 },
    { month: 'Sep', score: 76 },
    { month: 'Oct', score: 78 }
  ], []);

  // Questions flagged as needing attention (below 70%)
  const flaggedQuestions = questionScores.filter(q => q.positive < 70);

  const modulePositiveAvg = questionScores.reduce((sum, q) => sum + q.positive, 0) / questionScores.length;

  return (
    <Tabs defaultValue="my-responses" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="my-responses" className="gap-2">
          <FileText className="h-4 w-4" />
          My Responses
        </TabsTrigger>
        <TabsTrigger value="benchmarks" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Benchmarks & Insights
        </TabsTrigger>
      </TabsList>

      <TabsContent value="my-responses" className="mt-6">
        <MyResponsesResults surveyResponses={surveyResponses} module={module} />
      </TabsContent>

      <TabsContent value="benchmarks" className="mt-6">
        <div className="space-y-6">
          {/* Module Score Hero Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-blue-900">
                {module === 'ai-readiness' ? 'AI Readiness' :
                 module === 'leadership' ? 'Leadership' :
                 'Employee Experience'} Score
              </CardTitle>
              <CardDescription className="text-blue-700">
                Average positive response rate for this module
              </CardDescription>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-4xl font-bold text-blue-900">
              {modulePositiveAvg.toFixed(1)}%
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-blue-700">Trend (last 5 months)</span>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  +6% vs last cycle
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={trendData}>
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Score Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Question Score Breakdown
            </CardTitle>
            <CardDescription>Response distribution by section</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questionScores.map((question, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {question.question}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {question.positive}%
                    </span>
                  </div>
                  <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full"
                      style={{ width: `${question.positive}%` }}
                    />
                    <div 
                      className="bg-yellow-400 h-full"
                      style={{ width: `${question.neutral}%` }}
                    />
                    <div 
                      className="bg-red-500 h-full"
                      style={{ width: `${question.negative}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Positive: {question.positive}%</span>
                    <span>Neutral: {question.neutral}%</span>
                    <span>Negative: {question.negative}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demographic Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Demographic Scores
            </CardTitle>
            <CardDescription>Performance comparison across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={demographicScores} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="department" 
                  fontSize={12}
                  width={80}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Score']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="score" 
                  fill="#8B5CF6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Question Flags */}
      {flaggedQuestions.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Questions Needing Attention
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Areas scoring below 70% positive responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {flaggedQuestions.map((question, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{question.question}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress 
                        value={question.positive} 
                        className="h-2 flex-1 max-w-32"
                      />
                      <span className="text-sm text-yellow-700">
                        {question.positive}% positive
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Needs focus
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA Section */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready for deeper insights?
            </h3>
            <p className="text-gray-600 mb-4">
              Explore detailed question-by-question analysis and demographic breakdowns.
            </p>
            <Button className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Drill into Question Breakdown
            </Button>
          </div>
        </CardContent>
      </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}