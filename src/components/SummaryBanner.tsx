import { CheckCircle, Eye, Share, FileDown } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";

interface SummaryBannerProps {
  moduleName: string;
  moduleColor: string;
}

export function SummaryBanner({ moduleName, moduleColor }: SummaryBannerProps) {
  return (
    <Alert className="border-green-200 bg-green-50">
      <CheckCircle className="h-5 w-5 text-green-600" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-semibold text-green-800">
            {moduleName} Survey completed — analysis ready!
          </span>
          <p className="text-green-700 text-sm mt-1">
            Your team's responses have been processed and insights are now available for review.
          </p>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button size="sm" variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            View Question Review
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <Share className="h-4 w-4" />
            Share Report
          </Button>
          <Button size="sm" variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export Results
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}