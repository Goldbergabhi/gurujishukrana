import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Progress } from "./ui/progress";
import { Users, FileText, Clock, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LineChart, Line } from 'recharts';
import { MyResponsesResults } from './MyResponsesResults';
import type { DriverResult } from '../utils/calculations';

interface EmployeeExperienceSectionProps {
  categoryData: DriverResult[];
  driverData: DriverResult[];
  overallPercentage: number;
  distribution: { '0-10': Record<number, number>; '1-5': Record<number, number> };
  backendAggregates?: any | null;
}

export function EmployeeExperienceSection({ 
  categoryData, 
  driverData, 
  overallPercentage,
  distribution,
  surveyResponses,
  moduleId,
  backendAggregates = null
}: EmployeeExperienceSectionProps & { surveyResponses?: Record<string,string>, moduleId?: string }) {
  const server = backendAggregates?.['employee-experience'] || backendAggregates?.['leadership'] || backendAggregates?.['ai-readiness'] || null;
  const serverSummary = server?.summaryMetrics || null;
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-green-600">
            Positive Responses: {data.positivePercentage.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">
            {data.positiveCount} of {data.totalCount} responses
          </p>
        </div>
      );
    }
    return null;
  };

  // Prefer server-driven lists when available, otherwise show empty lists to avoid mock values
  const sortedCategoryData = server && Array.isArray(server.demographics) && server.demographics.length > 0
    ? server.demographics.map((d: any) => ({ driver: d.group || d.key || d.name || 'Group', positivePercentage: Math.round(d.average || d.positivePercentage || 0), positiveCount: d.positiveCount || d.count || 0, totalCount: d.count || d.total || 0 }))
    : [];

  const sortedDriverData = server && Array.isArray(server.questionScores) && server.questionScores.length > 0
    ? server.questionScores.map((q: any) => ({ driver: q.questionText || q.question || q.id, positivePercentage: typeof q.average === 'number' ? q.average : Math.round(q.positivePercentage || 0) }))
    : [];

  // Prepare distribution data for charts
  const distribution1to5 = Object.entries(distribution['1-5']).map(([score, count]) => ({
    score: `${score}`,
    count,
    isPositive: parseInt(score) >= 4
  }));

  const distribution0to10 = Object.entries(distribution['0-10']).map(([score, count]) => ({
    score: `${score}`,
    count,
    isPositive: parseInt(score) >= 7
  }));

  const COLORS = {
    positive: '#16a34a',
    neutral: '#6b7280'
  };

  // Daily responses: prefer backend timeSeries when available, otherwise show empty
  const dailyResponses = (() => {
    try {
      if (server && Array.isArray(server.timeSeries) && server.timeSeries.length > 0) {
        return server.timeSeries.map((t: any) => ({ day: t.label || t.date || 'day', responses: t.count || t.value || 0 }));
      }
    } catch (e) {}
    return [];
  })();

  // Demographic distribution: prefer backend-provided demographics when available
  const demographicData = (() => {
    try {
      if (server && Array.isArray(server.demographics) && server.demographics.length > 0) {
        return server.demographics.slice(0,5).map((d: any, i: number) => ({ name: d.group || d.key || `Group ${i+1}`, value: d.count || d.value || 0, color: ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6'][i % 5] }));
      }
    } catch (e) {}
    return [];
  })();

  return (
    <div className="space-y-6">
      {/* Top summary KPI row to match Leadership layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-gray-600">Average Positive Score</CardTitle>
            </div>
            <div>
              <Target className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{typeof serverSummary?.positiveAverage === 'number' ? `${serverSummary.positiveAverage.toFixed(1)}%` : '—'}</div>
            <p className="text-xs text-gray-600 mt-1">Responses scoring positive on the scale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
            </div>
            <div>
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            {/* Derive a rough completion rate from distribution counts if available */}
            <div className="text-2xl font-bold">{typeof serverSummary?.completionRate === 'number' ? `${serverSummary.completionRate}%` : '—'}</div>
            <p className="text-xs text-gray-600 mt-1">Based on available responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-gray-600">Median Question Score</CardTitle>
            </div>
            <div>
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typeof serverSummary?.medianQuestionScore === 'number' ? `${serverSummary.medianQuestionScore.toFixed(1)}%` : '—'}</div>
            <p className="text-xs text-gray-600 mt-1">Middle score across all questions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <div>
              <CardTitle className="text-sm font-medium text-gray-600">Top Demographic</CardTitle>
            </div>
            <div>
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            {/* Pick top category by positivePercentage */}
            <div className="text-lg font-semibold">{serverSummary?.topDemographic ? `${serverSummary.topDemographic.group} ${serverSummary.topDemographic.pct}%` : '—'}</div>
            <p className="text-xs text-gray-600 mt-1">Highest scoring group</p>
          </CardContent>
        </Card>
      </div>

      {/* Small metrics row similar to Leadership screenshot */}
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typeof serverSummary?.participantCount === 'number' ? serverSummary.participantCount : '—'}</div>
            <p className="text-xs text-gray-600 mt-1">Invited to this survey</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Surveys Completed</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typeof serverSummary?.responseCount === 'number' ? serverSummary.responseCount : '—'}</div>
            <p className="text-xs text-gray-600 mt-1">Successfully submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Respondents</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{typeof serverSummary?.activeRespondents === 'number' ? serverSummary.activeRespondents : '—'}</div>
            <p className="text-xs text-gray-600 mt-1">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Time to Complete</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverSummary?.averageCompletionTime ? `${serverSummary.averageCompletionTime} min` : '—'}</div>
            <p className="text-xs text-gray-600 mt-1">Average completion time</p>
          </CardContent>
        </Card>
      </div>

      {/* Existing overall gauge kept but moved down to align with Leadership visuals */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Experience Overview</CardTitle>
          <CardDescription>Overall driver and category breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-center space-x-0 md:space-x-8 space-y-4 md:space-y-0">
            <div className="text-center w-full md:w-auto">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {overallPercentage.toFixed(1)}%
              </div>
              <div className="text-lg font-medium text-gray-700">
                Overall Positive Experience
              </div>
              <div className="mt-4 w-full sm:w-64 mx-auto">
                <Progress value={overallPercentage} className="h-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Category</CardTitle>
          <p className="text-sm text-muted-foreground">
            Positive response rates across employee experience categories
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedCategoryData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="driver" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  domain={[0, 100]}
                  label={{ value: 'Positive %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="positivePercentage" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {sortedCategoryData.length > 0 ? sortedCategoryData.map((category) => (
                <div key={category.driver} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {category.positivePercentage.toFixed(1)}%
                  </div>
                  <div className="text-sm font-medium text-gray-700">{category.driver}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {category.positiveCount}/{category.totalCount} positive
                  </div>
                </div>
              )) : (
                <div className="p-6 text-sm text-gray-600">Waiting for server category data for Employee Experience.</div>
              )}
            </div>
        </CardContent>
      </Card>

      {/* Drivers Detailed View (unchanged) */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Driver Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4 text-green-700">Top Performing Drivers</h4>
              <div className="space-y-3">
                {sortedDriverData.slice(0, 6).map((driver) => (
                  <div key={driver.driver} className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-800 flex-1 pr-2">
                        {driver.driver}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {driver.positivePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${driver.positivePercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-orange-700">Areas for Improvement</h4>
              <div className="space-y-3">
                {sortedDriverData.slice(-6).reverse().map((driver) => (
                  <div key={driver.driver} className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-800 flex-1 pr-2">
                        {driver.driver}
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        {driver.positivePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${driver.positivePercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Responses + Response Distribution (to match Leadership layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Responses</CardTitle>
            <CardDescription>Response activity over the survey period</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyResponses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="responses" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Distribution by Department</CardTitle>
            <CardDescription>Participation across organizational units</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={demographicData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={4}>
                    {demographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}`, 'Responses']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {demographicData.map((item) => (
                <div key={item.name} className="text-xs inline-flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal responses summary (render inline like Leadership screenshot) */}
      {surveyResponses && moduleId && (
        <div className="mt-6">
          <MyResponsesResults surveyResponses={surveyResponses} module={moduleId} />
        </div>
      )}

      {/* Response Distribution (unchanged) */}
      <Card>
        <CardHeader>
          <CardTitle>Response Distribution Context</CardTitle>
          <p className="text-sm text-muted-foreground">
            Distribution of responses across different scales
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">1-5 Scale Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={distribution1to5}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="score" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill={(entry: any) => entry?.isPositive ? COLORS.positive : COLORS.neutral}
                  >
                    {distribution1to5.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isPositive ? COLORS.positive : COLORS.neutral} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">0-10 Scale Distribution (NPS)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={distribution0to10}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="score" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill={(entry: any) => entry?.isPositive ? COLORS.positive : COLORS.neutral}
                  >
                    {distribution0to10.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isPositive ? COLORS.positive : COLORS.neutral} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}