import React, { useState } from "react";
import { Download, AlertCircle, Image as ImageIcon, Wand2, History, Trash2, Copy, Heart, Key, X } from "lucide-react";
import { Button } from "./Button";
import { Canvas } from "./Canvas";
import { HistoryItem } from "../types";

interface LogoPreviewProps {
  activeItem?: HistoryItem;
  history: HistoryItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelectHistory: (id: string) => void;
  onDeleteHistory: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onRemix: (item: HistoryItem) => void;
  onOpenApiKey: () => void;
  hasApiKey: boolean;
}

export const LogoPreview: React.FC<LogoPreviewProps> = ({
  activeItem,
  history,
  loading,
  error,
  onRetry,
  onSelectHistory,
  onDeleteHistory,
  onToggleFavorite,
  onRemix,
  onOpenApiKey,
  hasApiKey,
}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `logo-${Date.now()}.png`;
    link.click();
  };

  const handleCopy = async (imageUrl: string) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Main Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* API Status */}
        <button
          onClick={onOpenApiKey}
          className={`absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            hasApiKey
              ? "bg-emerald-900/30 border border-emerald-800 text-emerald-400"
              : "bg-amber-900/30 border border-amber-800 text-amber-400"
          }`}
        >
          <Key className="w-3 h-3" />
          <span className="hidden sm:inline">{hasApiKey ? "Ready" : "Set Key"}</span>
        </button>

        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
                <Wand2 className="absolute inset-0 m-auto text-indigo-400 w-6 h-6" />
              </div>
              <p className="text-slate-400 text-sm">Generating...</p>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950 p-4">
            <div className="max-w-md w-full text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h3 className="text-slate-200 font-medium mb-2">Error</h3>
              <div className="text-slate-400 text-sm mb-4 bg-slate-900/50 p-3 rounded-lg border border-slate-800 max-h-32 overflow-y-auto text-left break-words">
                {error}
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="secondary" size="sm" onClick={onOpenApiKey}>Check Key</Button>
                <Button size="sm" onClick={onRetry}>Retry</Button>
              </div>
            </div>
          </div>
        ) : activeItem ? (
          <>
            <Canvas activeItem={activeItem} />
            
            {/* Action Bar */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-slate-900/95 backdrop-blur p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => handleDownload(activeItem.imageUrl)}
                className="flex items-center gap-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-2 rounded-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button
                onClick={() => handleCopy(activeItem.imageUrl)}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
              </button>
              <button
                onClick={() => onRemix(activeItem)}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remix</span>
              </button>
              <div className="w-px h-5 bg-slate-700 mx-0.5" />
              <button
                onClick={() => onToggleFavorite(activeItem.id)}
                className={`p-2 rounded-md ${activeItem.favorite ? "text-red-400" : "text-slate-400 hover:text-red-400"}`}
              >
                <Heart className={`w-3.5 h-3.5 ${activeItem.favorite ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={() => onDeleteHistory(activeItem.id)}
                className="text-slate-400 hover:text-red-400 p-2 rounded-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <Canvas>
            <div className="text-center opacity-40">
              <ImageIcon className="w-14 h-14 mx-auto mb-3 text-slate-600" />
              <p className="text-slate-500 text-sm">Describe your logo to begin</p>
            </div>
          </Canvas>
        )}
      </div>

      {/* History Strip */}
      {history.length > 0 && (
        <div className="h-[72px] bg-slate-900 border-t border-slate-800 flex items-center px-3 gap-2 overflow-x-auto shrink-0">
          <div className="text-[10px] font-medium text-slate-500 uppercase shrink-0 flex flex-col items-center pr-2 border-r border-slate-800">
            <History className="w-3.5 h-3.5 mb-0.5" />
            {history.length}
          </div>
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectHistory(item.id)}
              className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                activeItem?.id === item.id
                  ? "border-indigo-500 ring-2 ring-indigo-500/30"
                  : "border-slate-700 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={item.imageUrl} className="w-full h-full object-cover" alt="" draggable={false} />
              {item.favorite && <div className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full" />}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen */}
      {fullscreen && activeItem && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setFullscreen(false)}>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white p-2">
            <X className="w-6 h-6" />
          </button>
          <img src={activeItem.imageUrl} alt="Full size" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};
