import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Play, Square, FileEdit } from "lucide-react";
export function SurveyCampaignSelector({ campaigns, selectedCampaign, onCampaignChange }) {
    const activeCampaign = campaigns.find(c => c.id === selectedCampaign);
    const getStatusIcon = (status) => {
        switch (status) {
            case 'live':
                return _jsx(Play, { className: "h-3 w-3" });
            case 'closed':
                return _jsx(Square, { className: "h-3 w-3" });
            case 'draft':
                return _jsx(FileEdit, { className: "h-3 w-3" });
            default:
                return null;
        }
    };
    const getStatusColor = (status) => {
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
    return (_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Survey Campaign" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Select, { value: selectedCampaign, onValueChange: onCampaignChange, children: [_jsx(SelectTrigger, { className: "flex-1", children: _jsx(SelectValue, { placeholder: "Select a survey campaign..." }) }), _jsx(SelectContent, { children: campaigns.map((campaign) => (_jsx(SelectItem, { value: campaign.id, children: _jsxs("div", { className: "flex items-center justify-between w-full", children: [_jsx("span", { children: campaign.title }), _jsx(Badge, { variant: "outline", className: `ml-2 text-xs ${getStatusColor(campaign.status)}`, children: _jsxs("div", { className: "flex items-center gap-1", children: [getStatusIcon(campaign.status), campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)] }) })] }) }, campaign.id))) })] }), activeCampaign && !activeCampaign.isActive && (_jsx(Button, { variant: "outline", size: "sm", children: "Set as Active" }))] }), activeCampaign && (_jsxs("div", { className: "mt-2 flex items-center gap-4 text-xs text-gray-600", children: [_jsxs("span", { children: [activeCampaign.participantCount, " participants"] }), _jsxs("span", { children: [activeCampaign.completionRate, "% completion rate"] }), _jsx(Badge, { variant: "outline", className: `${getStatusColor(activeCampaign.status)} text-xs`, children: _jsxs("div", { className: "flex items-center gap-1", children: [getStatusIcon(activeCampaign.status), activeCampaign.status.charAt(0).toUpperCase() + activeCampaign.status.slice(1)] }) })] }))] }));
}
