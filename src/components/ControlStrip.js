import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Settings, Send, Lock, Unlock } from "lucide-react";
export function ControlStrip({ campaign, onCampaignUpdate }) {
    const [adminNotes, setAdminNotes] = useState('');
    const [isFinalized, setIsFinalized] = useState(campaign?.status === 'closed');
    const handleFinalizeToggle = (checked) => {
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
    if (!campaign)
        return null;
    return (_jsx(Card, { className: "bg-white border-gray-200 sticky bottom-4 shadow-lg", children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex flex-col lg:flex-row gap-4 items-start lg:items-center", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [isFinalized ? (_jsx(Lock, { className: "h-4 w-4 text-gray-600" })) : (_jsx(Unlock, { className: "h-4 w-4 text-green-600" })), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Survey Status:" })] }), _jsx(Badge, { variant: "outline", className: isFinalized ?
                                        'bg-gray-100 text-gray-800 border-gray-300' :
                                        'bg-green-100 text-green-800 border-green-300', children: isFinalized ? 'Finalized' : 'Active' }), _jsx(Switch, { checked: isFinalized, onCheckedChange: handleFinalizeToggle })] }), _jsxs(Button, { onClick: handlePushToLeadership, variant: "outline", className: "gap-2", disabled: !isFinalized, children: [_jsx(Send, { className: "h-4 w-4" }), "Push Insights to Leadership Board"] }), _jsx("div", { className: "flex-1 min-w-0", children: _jsx(Textarea, { placeholder: "Add admin notes or observations about this survey...", value: adminNotes, onChange: (e) => setAdminNotes(e.target.value), className: "min-h-[60px] resize-none" }) }), _jsxs(Button, { variant: "ghost", size: "sm", className: "gap-2", children: [_jsx(Settings, { className: "h-4 w-4" }), "Advanced Settings"] })] }), isFinalized && (_jsx("div", { className: "mt-3 p-2 bg-gray-50 rounded-lg", children: _jsxs("p", { className: "text-xs text-gray-600", children: [_jsx("span", { className: "font-medium", children: "Survey finalized:" }), " No new responses will be accepted. Results are ready for leadership review."] }) })), !isFinalized && (_jsx("div", { className: "mt-3 p-2 bg-green-50 rounded-lg", children: _jsxs("p", { className: "text-xs text-green-700", children: [_jsx("span", { className: "font-medium", children: "Survey active:" }), " Participants can still submit responses. Finalize when ready to lock results."] }) }))] }) }));
}
