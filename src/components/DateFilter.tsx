import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";

interface DateFilterProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export function DateFilter({ selectedPeriod, onPeriodChange }: DateFilterProps) {
  const periods = [
    { value: 'current-quarter', label: 'Current Quarter' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'current-year', label: 'Current Year' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'all-time', label: 'All Time' }
  ];

  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <span className="text-sm font-medium text-gray-700">Time Period:</span>
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-48 bg-white">
          <SelectValue placeholder="Select time period" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}