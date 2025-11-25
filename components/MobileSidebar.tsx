import React from "react";
import { X } from "lucide-react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-slate-900 border-r border-slate-800 lg:hidden animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <span className="text-sm font-medium text-slate-200">Controls</span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-[calc(100%-57px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};
