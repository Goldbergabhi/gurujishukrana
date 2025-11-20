import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { SurveyCampaign } from "../types/survey";
import { Play, Square, FileEdit } from "lucide-react";

interface SurveyCampaignSelectorProps {
  campaigns: SurveyCampaign[];
  selectedCampaign: string;
  onCampaignChange: (campaignId: string) => void;
}

export function SurveyCampaignSelector({ 
  campaigns, 
  selectedCampaign, 
  onCampaignChange 
}: SurveyCampaignSelectorProps) {
  const activeCampaign = campaigns.find(c => c.id === selectedCampaign);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <Play className="h-3 w-3" />;
      case 'closed':
        return <Square className="h-3 w-3" />;
      case 'draft':
        return <FileEdit className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Survey Campaign
      </label>
      <div className="flex gap-2">
        <Select value={selectedCampaign} onValueChange={onCampaignChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a survey campaign..." />
          </SelectTrigger>
          <SelectContent>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{campaign.title}</span>
                  <Badge 
                    variant="outline" 
                    className={`ml-2 text-xs ${getStatusColor(campaign.status)}`}
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(campaign.status)}
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </div>
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {activeCampaign && !activeCampaign.isActive && (
          <Button variant="outline" size="sm">
            Set as Active
          </Button>
        )}
      </div>
      
      {activeCampaign && (
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
          <span>{activeCampaign.participantCount} participants</span>
          <span>{activeCampaign.completionRate}% completion rate</span>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(activeCampaign.status)} text-xs`}
          >
            <div className="flex items-center gap-1">
              {getStatusIcon(activeCampaign.status)}
              {activeCampaign.status.charAt(0).toUpperCase() + activeCampaign.status.slice(1)}
            </div>
          </Badge>
        </div>
      )}
    </div>
  );
}