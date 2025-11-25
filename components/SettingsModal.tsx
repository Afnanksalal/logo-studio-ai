import React from "react";
import { X, Sliders, Trash2, Image as ImageIcon } from "lucide-react";
import { AppSettings, ModelType } from "../types";
import { MODEL_OPTIONS } from "../constants";
import { Button } from "./Button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  onClearHistory: () => void;
  historyCount: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
  onClearHistory,
  historyCount,
}) => {
  if (!isOpen) return null;

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings({ ...settings, [key]: value });
  };

  // Group models by type
  const geminiModels = MODEL_OPTIONS.filter((m) => m.apiType === "gemini");
  const imagenModels = MODEL_OPTIONS.filter((m) => m.apiType === "imagen");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-300" />
            <h2 className="text-base font-semibold text-white">Settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Gemini Models */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Gemini (supports reference images)
            </label>
            <div className="grid gap-2">
              {geminiModels.map((model) => (
                <ModelButton
                  key={model.id}
                  model={model}
                  isSelected={settings.model === model.id}
                  onSelect={() => updateSetting("model", model.id as ModelType)}
                />
              ))}
            </div>
          </div>

          {/* Imagen Models */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Imagen (text-to-image only)
            </label>
            <div className="grid gap-2">
              {imagenModels.map((model) => (
                <ModelButton
                  key={model.id}
                  model={model}
                  isSelected={settings.model === model.id}
                  onSelect={() => updateSetting("model", model.id as ModelType)}
                />
              ))}
            </div>
          </div>

          {/* History */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-800/50">
              <div>
                <div className="text-sm text-slate-200">History</div>
                <div className="text-xs text-slate-500">{historyCount} items</div>
              </div>
              <Button variant="danger" size="sm" onClick={onClearHistory} disabled={historyCount === 0}>
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-800/30">
          <Button onClick={onClose} className="w-full">Done</Button>
        </div>
      </div>
    </div>
  );
};

function ModelButton({
  model,
  isSelected,
  onSelect,
}: {
  model: { id: string; label: string; description: string; supportsReference: boolean };
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
        isSelected
          ? "border-indigo-500 bg-indigo-500/10"
          : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isSelected ? "text-indigo-300" : "text-slate-200"}`}>
            {model.label}
          </span>
          {model.supportsReference && (
            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-800">
              <ImageIcon className="w-2.5 h-2.5" />
              Ref
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500">{model.description}</div>
      </div>
      {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
    </button>
  );
}
