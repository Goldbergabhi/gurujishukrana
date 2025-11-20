import { useState } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Settings, Send, Lock, Unlock } from "lucide-react";
import { SurveyCampaign } from "../types/survey";

interface ControlStripProps {
  campaign?: SurveyCampaign;
  onCampaignUpdate: (campaign: SurveyCampaign) => void;
}

export function ControlStrip({ campaign, onCampaignUpdate }: ControlStripProps) {
  const [adminNotes, setAdminNotes] = useState('');
  const [isFinalized, setIsFinalized] = useState(campaign?.status === 'closed');

  const handleFinalizeToggle = (checked: boolean) => {
    setIsFinalized(checked);
    if (campaign && onCampaignUpdate) {
      onCampaignUpdate({
        ...campaign,
        status: checked ? 'closed' : 'live'
      });
    }
  };

  const handlePushToLeadership = () => {
    // Placeholder for pushing insights to leadership dashboard
    console.log('Pushing insights to leadership board...');
  };

  if (!campaign) return null;

  return (
    <Card className="bg-white border-gray-200 sticky bottom-4 shadow-lg">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Survey Status Control */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isFinalized ? (
                <Lock className="h-4 w-4 text-gray-600" />
              ) : (
                <Unlock className="h-4 w-4 text-green-600" />
              )}
              <span className="text-sm font-medium text-gray-700">
                Survey Status:
              </span>
            </div>
            <Badge 
              variant="outline" 
              className={isFinalized ? 
                'bg-gray-100 text-gray-800 border-gray-300' : 
                'bg-green-100 text-green-800 border-green-300'}
            >
              {isFinalized ? 'Finalized' : 'Active'}
            </Badge>
            <Switch
              checked={isFinalized}
              onCheckedChange={handleFinalizeToggle}
            />
          </div>

          {/* Push to Leadership */}
          <Button 
            onClick={handlePushToLeadership}
            variant="outline"
            className="gap-2"
            disabled={!isFinalized}
          >
            <Send className="h-4 w-4" />
            Push Insights to Leadership Board
          </Button>

          {/* Admin Notes */}
          <div className="flex-1 min-w-0">
            <Textarea
              placeholder="Add admin notes or observations about this survey..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Advanced Settings
          </Button>
        </div>

        {/* Status Messages */}
        {isFinalized && (
          <div className="mt-3 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Survey finalized:</span> No new responses will be accepted. 
              Results are ready for leadership review.
            </p>
          </div>
        )}

        {!isFinalized && (
          <div className="mt-3 p-2 bg-green-50 rounded-lg">
            <p className="text-xs text-green-700">
              <span className="font-medium">Survey active:</span> Participants can still submit responses. 
              Finalize when ready to lock results.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}