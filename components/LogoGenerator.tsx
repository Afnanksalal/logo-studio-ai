import React, { useState, useEffect, useCallback } from "react";
import { DEFAULT_CONFIG, DEFAULT_SETTINGS } from "../constants";
import { generateLogo } from "../services/geminiService";
import { LogoConfig, HistoryItem, AppSettings, STORAGE_KEYS } from "../types";
import { LogoControls } from "./LogoControls";
import { LogoPreview } from "./LogoPreview";
import { ApiKeyInput } from "./ApiKeyInput";
import { SettingsModal } from "./SettingsModal";
import { Header } from "./Header";
import { MobileSidebar } from "./MobileSidebar";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const LogoGenerator: React.FC = () => {
  const [apiKey, setApiKey] = useLocalStorage<string>(STORAGE_KEYS.API_KEY, "");
  const [config, setConfig] = useLocalStorage<LogoConfig>(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>(STORAGE_KEYS.HISTORY, []);
  const [settings, setSettings] = useLocalStorage<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) setShowApiKeyModal(true);
  }, []);

  useEffect(() => {
    if (history.length > 0 && !activeHistoryId) {
      setActiveHistoryId(history[0].id);
    }
  }, [history, activeHistoryId]);

  const handleGenerate = useCallback(async () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    if (!config.prompt.trim()) {
      setError("Please describe your logo concept.");
      return;
    }

    setLoading(true);
    setError(null);
    setShowMobileSidebar(false);

    const result = await generateLogo({
      ...config,
      apiKey,
      model: settings.model,
    });

    if (result.success && result.imageUrl) {
      const newItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: Date.now(),
        imageUrl: result.imageUrl,
        config: { ...config },
        favorite: false,
      };

      setHistory((prev) => [newItem, ...prev].slice(0, settings.maxHistoryItems));
      setActiveHistoryId(newItem.id);
      setError(null);
    } else {
      setError(result.error || "Generation failed.");
    }

    setLoading(false);
  }, [apiKey, config, settings, setHistory]);

  const handleRemix = useCallback((item: HistoryItem) => {
    setConfig({ ...item.config, referenceImage: item.imageUrl });
    setShowMobileSidebar(true);
  }, [setConfig]);

  const handleDeleteHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((i) => i.id !== id));
    if (activeHistoryId === id) setActiveHistoryId(null);
  }, [activeHistoryId, setHistory]);

  const handleToggleFavorite = useCallback((id: string) => {
    setHistory((prev) => prev.map((item) =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ));
  }, [setHistory]);

  const handleClearHistory = useCallback(() => {
    if (confirm("Clear all history?")) {
      setHistory([]);
      setActiveHistoryId(null);
    }
  }, [setHistory]);

  const activeItem = history.find((item) => item.id === activeHistoryId);

  const controlsContent = (
    <LogoControls
      config={config}
      setConfig={setConfig}
      settings={settings}
      onGenerate={handleGenerate}
      isLoading={loading}
    />
  );

  return (
    <div className="h-dvh flex flex-col bg-slate-950 text-slate-100">
      <Header
        onOpenSettings={() => setShowSettingsModal(true)}
        onToggleSidebar={() => setShowMobileSidebar(true)}
      />

      <ApiKeyInput
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        setSettings={setSettings}
        onClearHistory={handleClearHistory}
        historyCount={history.length}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={showMobileSidebar} onClose={() => setShowMobileSidebar(false)}>
        {controlsContent}
      </MobileSidebar>

      <main className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 xl:w-96 bg-slate-900 border-r border-slate-800 overflow-y-auto shrink-0">
          {controlsContent}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-hidden">
          <LogoPreview
            activeItem={activeItem}
            history={history}
            loading={loading}
            error={error}
            onRetry={handleGenerate}
            onSelectHistory={setActiveHistoryId}
            onDeleteHistory={handleDeleteHistory}
            onToggleFavorite={handleToggleFavorite}
            onRemix={handleRemix}
            onOpenApiKey={() => setShowApiKeyModal(true)}
            hasApiKey={!!apiKey}
          />
        </div>
      </main>
    </div>
  );
};
