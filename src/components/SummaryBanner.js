import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle, Eye, Share, FileDown } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
export function SummaryBanner({ moduleName, moduleColor }) {
    return (_jsxs(Alert, { className: "border-green-200 bg-green-50", children: [_jsx(CheckCircle, { className: "h-5 w-5 text-green-600" }), _jsxs(AlertDescription, { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("span", { className: "font-semibold text-green-800", children: [moduleName, " Survey completed \u2014 analysis ready!"] }), _jsx("p", { className: "text-green-700 text-sm mt-1", children: "Your team's responses have been processed and insights are now available for review." })] }), _jsxs("div", { className: "flex items-center gap-2 ml-4", children: [_jsxs(Button, { size: "sm", variant: "outline", className: "gap-2", children: [_jsx(Eye, { className: "h-4 w-4" }), "View Question Review"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "gap-2", children: [_jsx(Share, { className: "h-4 w-4" }), "Share Report"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "gap-2", children: [_jsx(FileDown, { className: "h-4 w-4" }), "Export Results"] })] })] })] }));
}
