import React, { useRef } from "react";
import { Sparkles, Upload, X, Wand2, Lightbulb, ChevronDown, AlertTriangle, Ban } from "lucide-react";
import { LogoConfig, AspectRatio, AppSettings } from "../types";
import {
  PRESETS,
  COLOR_PALETTES,
  STYLE_OPTIONS,
  COMPLEXITY_OPTIONS,
  ASPECT_RATIOS,
  PROMPT_SUGGESTIONS,
  MODEL_OPTIONS,
} from "../constants";
import { Button } from "./Button";

interface LogoControlsProps {
  config: LogoConfig;
  setConfig: React.Dispatch<React.SetStateAction<LogoConfig>>;
  settings: AppSettings;
  onGenerate: () => void;
  isLoading: boolean;
}

export const LogoControls: React.FC<LogoControlsProps> = ({
  config,
  setConfig,
  settings,
  onGenerate,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateConfig = <K extends keyof LogoConfig>(key: K, value: LogoConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Image must be under 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => updateConfig("referenceImage", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSuggestion = () => {
    const suggestion = PROMPT_SUGGESTIONS[Math.floor(Math.random() * PROMPT_SUGGESTIONS.length)];
    updateConfig("prompt", suggestion);
  };

  const canGenerate = config.prompt.trim().length > 0;
  const currentModel = MODEL_OPTIONS.find((m) => m.id === settings.model);
  const hasReferenceWithoutSupport = config.referenceImage && !currentModel?.supportsReference;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Brand Name */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Brand Name (optional)</label>
          <input
            type="text"
            value={config.brandName}
            onChange={(e) => updateConfig("brandName", e.target.value)}
            placeholder="Acme Inc"
            className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Concept */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Logo Concept
            </label>
            <button
              onClick={handleSuggestion}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3" />
              Inspire
            </button>
          </div>
          <textarea
            value={config.prompt}
            onChange={(e) => updateConfig("prompt", e.target.value)}
            rows={3}
            placeholder="Describe your logo idea..."
            className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
          />
        </div>

        {/* Negative Prompt */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
            <Ban className="w-3 h-3 text-red-400" />
            Negative Prompt (avoid)
          </label>
          <input
            type="text"
            value={config.negativePrompt}
            onChange={(e) => updateConfig("negativePrompt", e.target.value)}
            placeholder="blurry, low quality, text errors, watermark..."
            className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Presets */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Style Preset</label>
          <div className="grid grid-cols-2 gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => updateConfig("presetId", preset.id)}
                className={`text-left p-2 rounded-lg border text-xs transition-all ${
                  config.presetId === preset.id
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                }`}
              >
                <div className={`font-medium ${config.presetId === preset.id ? "text-indigo-300" : "text-slate-300"}`}>
                  {preset.label}
                </div>
                <div className="text-slate-500 truncate">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Colors" value={config.colorPaletteId} onChange={(v) => updateConfig("colorPaletteId", v)} options={COLOR_PALETTES} />
          <SelectField label="Style" value={config.styleId} onChange={(v) => updateConfig("styleId", v)} options={STYLE_OPTIONS} />
          <SelectField label="Complexity" value={config.complexityId} onChange={(v) => updateConfig("complexityId", v)} options={COMPLEXITY_OPTIONS} />
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Ratio</label>
            <div className="relative">
              <select
                value={config.aspectRatio}
                onChange={(e) => updateConfig("aspectRatio", e.target.value as AspectRatio)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 pr-8 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
              >
                {ASPECT_RATIOS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Reference Image */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-slate-400">Reference Image</label>
            {currentModel && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                currentModel.supportsReference
                  ? "bg-emerald-900/30 text-emerald-400 border border-emerald-800"
                  : "bg-slate-800 text-slate-500 border border-slate-700"
              }`}>
                {currentModel.supportsReference ? "Supported" : "Not supported"}
              </span>
            )}
          </div>

          {hasReferenceWithoutSupport && (
            <div className="flex items-center gap-2 p-2 mb-2 rounded-lg bg-amber-900/20 border border-amber-800 text-amber-300 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Switch to Nano Banana Pro for reference images.</span>
            </div>
          )}

          {!config.referenceImage ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={!currentModel?.supportsReference}
              className={`w-full border border-dashed rounded-lg p-3 flex items-center justify-center gap-2 transition-colors ${
                currentModel?.supportsReference
                  ? "border-slate-700 bg-slate-800/30 text-slate-500 hover:text-slate-300 hover:border-slate-600"
                  : "border-slate-800 bg-slate-900/30 text-slate-600 cursor-not-allowed"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span className="text-xs">Upload image</span>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </button>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-slate-700">
              <img src={config.referenceImage} alt="Reference" className="w-full h-20 object-cover" />
              <button
                onClick={() => updateConfig("referenceImage", undefined)}
                className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90">
        <Button
          onClick={onGenerate}
          isLoading={isLoading}
          disabled={!canGenerate || !!hasReferenceWithoutSupport}
          className="w-full py-2.5"
        >
          {!isLoading && <Wand2 className="w-4 h-4 mr-2" />}
          {isLoading ? "Generating..." : "Generate"}
        </Button>
        {currentModel && (
          <p className="text-[10px] text-slate-500 text-center mt-2">Using {currentModel.label}</p>
        )}
      </div>
    </div>
  );
};

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { id: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 pr-8 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
        >
          {options.map((o) => (<option key={o.id} value={o.id}>{o.label}</option>))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}
