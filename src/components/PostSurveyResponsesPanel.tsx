import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Users, FileText, Clock, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { SurveyCampaign } from "../types/survey";

interface PostSurveyResponsesPanelProps {
  module: string;
  campaign?: SurveyCampaign;
  mockData: any;
}

export function PostSurveyResponsesPanel({ module, campaign, mockData }: PostSurveyResponsesPanelProps) {
  // Mock data for daily responses
  const dailyResponsesData = useMemo(() => [
    { date: 'Oct 1', responses: 12 },
    { date: 'Oct 2', responses: 18 },
    { date: 'Oct 3', responses: 15 },
    { date: 'Oct 4', responses: 22 },
    { date: 'Oct 5', responses: 19 },
    { date: 'Oct 6', responses: 8 },
    { date: 'Oct 7', responses: 25 },
    { date: 'Oct 8', responses: 31 },
    { date: 'Oct 9', responses: 16 },
    { date: 'Oct 10', responses: 28 }
  ], []);

  // Mock demographic distribution data
  const demographicData = useMemo(() => [
    { department: 'Engineering', responses: 45, color: '#3B82F6' },
    { department: 'Product', responses: 32, color: '#10B981' },
    { department: 'Design', responses: 18, color: '#F59E0B' },
    { department: 'Marketing', responses: 24, color: '#EF4444' },
    { department: 'Sales', responses: 16, color: '#8B5CF6' }
  ], []);

  const kpiData = [
    {
      title: "Total Participants",
      value: campaign?.participantCount || 127,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      description: "Invited to this survey"
    },
    {
      title: "Surveys Completed",
      value: Math.round((campaign?.participantCount || 127) * (campaign?.completionRate || 89) / 100),
      icon: <FileText className="h-5 w-5 text-green-600" />,
      description: "Successfully submitted"
    },
    {
      title: "Active Respondents",
      value: 12,
      icon: <Activity className="h-5 w-5 text-orange-600" />,
      description: "Currently in progress"
    },
    {
      title: "Avg Time to Complete",
      value: module === 'ai-readiness' ? '8.2 min' : 
             module === 'leadership' ? '11.4 min' : '13.7 min',
      icon: <Clock className="h-5 w-5 text-purple-600" />,
      description: "Average completion time"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <Select defaultValue="last-30-days">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7-days">Last 7 days</SelectItem>
            <SelectItem value="last-30-days">Last 30 days</SelectItem>
            <SelectItem value="last-90-days">Last 90 days</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-departments">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-departments">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-locations">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-locations">All Locations</SelectItem>
            <SelectItem value="san-francisco">San Francisco</SelectItem>
            <SelectItem value="new-york">New York</SelectItem>
            <SelectItem value="london">London</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Responses Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Responses</CardTitle>
            <CardDescription>Response activity over the survey period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyResponsesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Distribution by Department */}
        <Card>
          <CardHeader>
            <CardTitle>Response Distribution by Department</CardTitle>
            <CardDescription>Participation across organizational units</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demographicData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="department" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="responses" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {demographicData.map((item) => (
                <Badge key={item.department} variant="outline" className="text-xs">
                  <div 
                    className="w-2 h-2 rounded-full mr-1" 
                    style={{ backgroundColor: item.color }}
                  />
                  {item.department} ({item.responses})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}