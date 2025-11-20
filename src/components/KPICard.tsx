import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface KPICardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  trend?: number;
}

export function KPICard({ title, value, icon, trend }: KPICardProps) {
  const trendColor = trend && trend > 0 ? 'text-green-600' : trend && trend < 0 ? 'text-red-500' : 'text-gray-500';
  const trendIcon = trend && trend > 0 ? '↗' : trend && trend < 0 ? '↘' : '→';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</h3>
        {icon && <div className="opacity-80">{icon}</div>}
      </div>
      
      <div className="space-y-2">
        <div className="text-4xl font-bold text-gray-900">
          {value.toFixed(1)}%
        </div>
        
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
            <span className="text-lg">{trendIcon}</span>
            <span>{Math.abs(trend).toFixed(1)}% from last period</span>
          </div>
        )}
      </div>
      
      {/* Progress bar visual */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}