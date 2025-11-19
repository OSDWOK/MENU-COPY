
import React from 'react';

interface ThinkingSwitchProps {
  isThinkingMode: boolean;
  onToggle: () => void;
}

const ThinkingSwitch: React.FC<ThinkingSwitchProps> = ({ isThinkingMode, onToggle }) => {
  return (
    <div className="flex items-center space-x-3">
      <span className={`text-sm font-medium ${!isThinkingMode ? 'text-white' : 'text-gray-400'}`}>
        Rápido
      </span>
      <label htmlFor="thinking-toggle" className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" id="thinking-toggle" className="sr-only peer" checked={isThinkingMode} onChange={onToggle} />
        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
      </label>
      <div className="flex flex-col items-start">
        <span className={`text-sm font-medium ${isThinkingMode ? 'text-white' : 'text-gray-400'}`}>
          Modo Pensador
        </span>
        <span className="text-xs text-gray-400 -mt-1">Para tarefas complexas</span>
      </div>
    </div>
  );
};

export default ThinkingSwitch;
