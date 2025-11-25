import React, { useState, useEffect } from "react";
import { Key, ExternalLink, X, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import { validateApiKey } from "../services/geminiService";

interface ApiKeyInputProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
}) => {
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState<{ valid: boolean; error?: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(apiKey);
      setValidation(null);
    }
  }, [apiKey, isOpen]);

  const handleValidate = async () => {
    if (!inputValue.trim()) return;
    setValidating(true);
    setValidation(null);
    const result = await validateApiKey(inputValue.trim());
    setValidation(result);
    setValidating(false);
  };

  const handleSave = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      setApiKey(trimmed);
      onClose();
    }
  };

  const handleClear = () => {
    setInputValue("");
    setApiKey("");
    setValidation(null);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && apiKey && onClose()}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">API Configuration</h2>
          </div>
          {apiKey && (
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Google Gemini API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setValidation(null);
                }}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-sm pr-10"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {validation && (
            <div className={`flex items-center gap-2 p-2.5 rounded-lg text-sm ${
              validation.valid
                ? "bg-emerald-900/20 border border-emerald-800 text-emerald-300"
                : "bg-red-900/20 border border-red-800 text-red-300"
            }`}>
              {validation.valid ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{validation.valid ? "API key is valid" : validation.error}</span>
            </div>
          )}

          <p className="text-xs text-slate-500">
            Your API key is stored locally and never sent to our servers.
          </p>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 p-2 rounded-lg hover:bg-indigo-950/30 transition-colors"
          >
            Get API Key from Google AI Studio
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-between gap-3">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleClear}>Clear</Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleValidate}
              disabled={!inputValue.trim() || validating}
              isLoading={validating}
            >
              Test
            </Button>
          </div>
          <Button onClick={handleSave} disabled={!inputValue.trim()} size="sm">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
