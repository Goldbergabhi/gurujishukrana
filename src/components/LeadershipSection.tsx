import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DriverResult } from '../utils/calculations';

interface LeadershipSectionProps {
  lensData: DriverResult[];
  configurationData: DriverResult[];
  driverData: DriverResult[];
}

export function LeadershipSection({ lensData, configurationData, driverData }: LeadershipSectionProps) {
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

  // Sort data by positive percentage
  const sortedLensData = [...lensData].sort((a, b) => b.positivePercentage - a.positivePercentage);
  const sortedConfigData = [...configurationData].sort((a, b) => b.positivePercentage - a.positivePercentage);
  const sortedDriverData = [...driverData].sort((a, b) => b.positivePercentage - a.positivePercentage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leadership Module</CardTitle>
        <p className="text-sm text-muted-foreground">
          Percentage of "Often" and "Almost always" responses across leadership dimensions
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="lens" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lens">By Lens</TabsTrigger>
            <TabsTrigger value="configuration">By Configuration</TabsTrigger>
            <TabsTrigger value="drivers">By Driver</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lens" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedLensData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sortedLensData.map((lens) => (
                <div key={lens.driver} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {lens.positivePercentage.toFixed(1)}%
                  </div>
                  <div className="text-sm font-medium text-gray-700">{lens.driver}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {lens.positiveCount}/{lens.totalCount} positive
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="configuration" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedConfigData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                  <Bar dataKey="positivePercentage" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {sortedConfigData.map((config) => (
                <div key={config.driver} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{config.driver}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${config.positivePercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-green-600 w-16 text-right">
                      {config.positivePercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="drivers" className="space-y-4">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={sortedDriverData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="driver" 
                    angle={-45}
                    textAnchor="end"
                    height={140}
                    fontSize={11}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    label={{ value: 'Positive %', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="positivePercentage" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-3 text-green-700">Top Performing Drivers</h4>
                <div className="space-y-2">
                  {sortedDriverData.slice(0, 8).map((driver, index) => (
                    <div key={driver.driver} className="flex justify-between items-center text-sm">
                      <span className="flex-1 truncate pr-2">{driver.driver}</span>
                      <span className="font-bold text-green-600 w-16 text-right">
                        {driver.positivePercentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 text-orange-700">Areas for Improvement</h4>
                <div className="space-y-2">
                  {sortedDriverData.slice(-8).reverse().map((driver, index) => (
                    <div key={driver.driver} className="flex justify-between items-center text-sm">
                      <span className="flex-1 truncate pr-2">{driver.driver}</span>
                      <span className="font-bold text-orange-600 w-16 text-right">
                        {driver.positivePercentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}