import { ModuleConfig } from "../types/survey";

interface ModuleSelectorProps {
  modules: ModuleConfig[];
  selectedModule: string;
  onModuleChange: (moduleId: string) => void;
}

export function ModuleSelector({ modules, selectedModule, onModuleChange }: ModuleSelectorProps) {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Module
      </label>
      <div className="grid grid-cols-3 gap-2">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => onModuleChange(module.id)}
            className={`
              flex items-center gap-2 p-3 rounded-lg border transition-all text-left
              ${selectedModule === module.id
                ? `${module.bgColor} ${module.borderColor} ${module.color} border-2`
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {module.icon}
            <span className="font-medium text-sm">{module.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}