import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SectionResult } from '../utils/calculations';

interface AIReadinessSectionProps {
  data: SectionResult[];
}

export function AIReadinessSection({ data }: AIReadinessSectionProps) {
  // Sort by positive percentage descending
  const sortedData = [...data].sort((a, b) => b.positivePercentage - a.positivePercentage);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Readiness by Section</CardTitle>
        <p className="text-sm text-muted-foreground">
          Percentage of "Often" and "Almost always" responses by section
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 40, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="section" 
                angle={-45}
                textAnchor="end"
                height={120}
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]}
                label={{ value: 'Positive %', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="positivePercentage" 
                fill="#16a34a"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-3">Top Performing Sections</h4>
          <div className="space-y-2">
            {sortedData.slice(0, 5).map((section, index) => (
              <div key={section.section} className="flex justify-between items-center text-sm">
                <span className="flex-1 truncate pr-2">{section.section}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${section.positivePercentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-medium">
                    {section.positivePercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}