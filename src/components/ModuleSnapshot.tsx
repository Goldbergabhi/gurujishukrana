import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Users, Target, Clock, Award } from "lucide-react";
import { SurveyCampaign } from "../types/survey";

interface ModuleSnapshotProps {
  module: string;
  campaign?: SurveyCampaign;
  surveyResponses: Record<string, string>;
  mockData: any;
  serverSummary?: any;
}

export function ModuleSnapshot({ module, campaign, surveyResponses, mockData, serverSummary }: ModuleSnapshotProps) {
  const moduleData = useMemo(() => {
    // Calculate module-specific metrics
    const getModuleResponses = (prefix: string) => 
      Object.keys(surveyResponses).filter(key => key.startsWith(prefix)).length;

    const responseCount = getModuleResponses(module === 'ai-readiness' ? 'ai-' : 
                                          module === 'leadership' ? 'leadership-' : 'ee-');

    // Prefer server-provided summary metrics when available. If missing, return nulls so UI shows placeholders.
    const positiveScore = typeof serverSummary?.positiveAverage === 'number' ? serverSummary.positiveAverage : null;
    const previousScore = typeof serverSummary?.previousScore === 'number' ? serverSummary.previousScore : null;

    // Compute completionRate using server responseCount and campaign participantCount when available
    let completionRate: number | null = null;
    if (serverSummary && typeof serverSummary.responseCount === 'number' && campaign && typeof campaign.participantCount === 'number' && campaign.participantCount > 0) {
      completionRate = Math.round((Number(serverSummary.responseCount) / Number(campaign.participantCount)) * 100);
    }
    const medianScore = typeof serverSummary?.medianQuestionScore === 'number' ? serverSummary.medianQuestionScore : null;
    const topDemographic = serverSummary?.topDemographic ? `${serverSummary.topDemographic.group} ${serverSummary.topDemographic.pct}%` : null;

    return {
      positiveScore,
      previousScore,
      delta: (positiveScore !== null && previousScore !== null) ? positiveScore - previousScore : null,
      completionRate,
      medianScore,
      topDemographic,
      responseCount
    };
  }, [module, campaign, surveyResponses]);

  const cards = [
    {
      title: "Average Positive Score",
      value: moduleData.positiveScore !== null ? `${moduleData.positiveScore.toFixed(1)}%` : '—',
      delta: moduleData.delta,
      icon: <Target className="h-5 w-5 text-blue-600" />,
      description: "Responses scoring 4-5 (or 7-10 for EX)"
    },
    {
      title: "Completion Rate",
      value: moduleData.completionRate !== null ? `${moduleData.completionRate}%` : '—',
      delta: null,
      icon: <Users className="h-5 w-5 text-green-600" />,
      description: campaign?.participantCount ? `${campaign.participantCount} participants invited` : 'Participant count not available'
    },
    {
      title: "Median Question Score",
      value: moduleData.medianScore !== null ? `${moduleData.medianScore.toFixed(1)}%` : '—',
      delta: null,
      icon: <Award className="h-5 w-5 text-purple-600" />,
      description: "Middle score across all questions"
    },
    {
      title: "Top Demographic",
      value: moduleData.topDemographic || '—',
      delta: null,
      icon: <Clock className="h-5 w-5 text-orange-600" />,
      description: "Highest scoring group"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {card.value}
            </div>
            {card.delta !== null && (
              <div className="flex items-center gap-1">
                {card.delta > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs ${
                  card.delta > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.delta > 0 ? '+' : ''}{card.delta.toFixed(1)}% vs previous
                </span>
              </div>
            )}
            <p className="text-xs text-gray-600 mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}