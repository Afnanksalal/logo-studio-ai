import React from "react";
import { Palette, Settings, Menu } from "lucide-react";

interface HeaderProps {
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  showMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onToggleSidebar, showMenuButton = true }) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
      <div className="px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-3">
            {showMenuButton && (
              <button
                onClick={onToggleSidebar}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <Palette className="h-6 w-6 text-indigo-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">Logo Studio</h1>
              <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-medium">
                AI
              </span>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
