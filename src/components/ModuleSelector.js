import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ModuleSelector({ modules, selectedModule, onModuleChange }) {
    return (_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Module" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: modules.map((module) => (_jsxs("button", { onClick: () => onModuleChange(module.id), className: `
              flex items-center gap-2 p-3 rounded-lg border transition-all text-left
              ${selectedModule === module.id
                        ? `${module.bgColor} ${module.borderColor} ${module.color} border-2`
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}
            `, children: [module.icon, _jsx("span", { className: "font-medium text-sm", children: module.name })] }, module.id))) })] }));
}
