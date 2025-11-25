export type AspectRatio = "1:1" | "16:9" | "4:3" | "9:16" | "3:4";

export type ModelType =
  | "gemini-3-pro-image-preview"
  | "imagen-4.0-ultra-generate-001"
  | "imagen-4.0-generate-001";

export interface ModelInfo {
  id: ModelType;
  label: string;
  description: string;
  supportsReference: boolean;
  apiType: "gemini" | "imagen";
}

export interface LogoPreset {
  id: string;
  label: string;
  description: string;
  promptModifier: string;
}

export interface SelectOption {
  id: string;
  label: string;
  promptModifier: string;
}

export interface LogoConfig {
  prompt: string;
  negativePrompt: string;
  brandName: string;
  presetId: string;
  colorPaletteId: string;
  styleId: string;
  complexityId: string;
  aspectRatio: AspectRatio;
  referenceImage?: string;
}

export interface GenerationConfig extends LogoConfig {
  apiKey: string;
  model: ModelType;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageUrl: string;
  config: LogoConfig;
  favorite: boolean;
}

export interface AppSettings {
  model: ModelType;
  maxHistoryItems: number;
}

export interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface CanvasState {
  x: number;
  y: number;
  scale: number;
}

export const STORAGE_KEYS = {
  API_KEY: "logo_studio_api_key",
  CONFIG: "logo_studio_config",
  HISTORY: "logo_studio_history",
  SETTINGS: "logo_studio_settings",
} as const;
