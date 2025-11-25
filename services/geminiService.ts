import { GenerationConfig, GenerationResult, ModelType, ModelInfo } from "../types";
import {
  PRESETS,
  COLOR_PALETTES,
  STYLE_OPTIONS,
  COMPLEXITY_OPTIONS,
  QUALITY_PROMPT,
  MODEL_OPTIONS,
} from "../constants";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

// Retry configuration for transient errors
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Don't retry client errors (4xx) except 429
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return response;
      }
      
      // Retry on 429 (rate limit) or 5xx (server errors)
      if (response.status === 429 || response.status >= 500) {
        if (attempt < retries) {
          const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
          await sleep(delay);
          continue;
        }
      }
      
      return response;
    } catch (err) {
      lastError = err as Error;
      if (attempt < retries) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }
  
  throw lastError || new Error("Request failed after retries");
}

function getModelInfo(model: ModelType): ModelInfo {
  return MODEL_OPTIONS.find((m) => m.id === model) || MODEL_OPTIONS[0];
}

function buildPrompt(config: GenerationConfig): string {
  const preset = PRESETS.find((p) => p.id === config.presetId) || PRESETS[0];
  const color = COLOR_PALETTES.find((c) => c.id === config.colorPaletteId) || COLOR_PALETTES[0];
  const style = STYLE_OPTIONS.find((s) => s.id === config.styleId) || STYLE_OPTIONS[0];
  const complexity = COMPLEXITY_OPTIONS.find((c) => c.id === config.complexityId) || COMPLEXITY_OPTIONS[0];

  const parts = [
    "Create a professional logo design.",
    "",
    config.brandName ? `Brand: ${config.brandName}` : "",
    `Concept: ${config.prompt}`,
    "",
    "Style specifications:",
    `- ${preset.promptModifier}`,
    `- ${color.promptModifier}`,
    `- ${style.promptModifier}`,
    `- ${complexity.promptModifier}`,
    "",
    QUALITY_PROMPT,
  ];

  if (config.negativePrompt?.trim()) {
    parts.push("", `AVOID: ${config.negativePrompt}`);
  }

  return parts.filter(Boolean).join("\n");
}

/**
 * Generate using Gemini models (gemini-2.0-flash-preview-image-generation, gemini-3-pro-image-preview)
 * These support multimodal input (text + image) and can output images
 */
async function generateWithGemini(
  apiKey: string,
  model: string,
  prompt: string,
  aspectRatio: string,
  referenceImage?: string
): Promise<GenerationResult> {
  const url = `${API_BASE}/models/${model}:generateContent?key=${apiKey}`;

  // Build parts array
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  // Add reference image first if provided
  if (referenceImage) {
    const base64Data = referenceImage.includes("base64,")
      ? referenceImage.split("base64,")[1]
      : referenceImage;

    const mimeType = referenceImage.includes("data:")
      ? referenceImage.split(";")[0].split(":")[1]
      : "image/png";

    parts.push({
      inlineData: { mimeType, data: base64Data },
    });
    parts.push({
      text: `Using this reference image as inspiration, create a new logo design:\n\n${prompt}`,
    });
  } else {
    parts.push({ text: prompt });
  }

  // Gemini 2.0 Flash uses responseModalities, Gemini 3 Pro may differ
  // Include aspect ratio in the prompt since imageSizeConfig isn't supported
  const aspectPrompt = `\n\nGenerate the image with ${aspectRatio} aspect ratio.`;
  
  // Update the text part to include aspect ratio
  if (parts.length > 0 && "text" in parts[parts.length - 1]) {
    (parts[parts.length - 1] as { text: string }).text += aspectPrompt;
  }

  const requestBody = {
    contents: [
      {
        parts,
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  };

  const response = await fetchWithRetry(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  const data = await response.json();

  // Extract image from response
  if (data.candidates?.[0]?.content?.parts) {
    for (const part of data.candidates[0].content.parts) {
      if (part.inlineData?.data) {
        const mimeType = part.inlineData.mimeType || "image/png";
        return {
          success: true,
          imageUrl: `data:${mimeType};base64,${part.inlineData.data}`,
        };
      }
    }

    // Check if only text was returned
    const textPart = data.candidates[0].content.parts.find((p: { text?: string }) => p.text);
    if (textPart?.text) {
      return {
        success: false,
        error: `Model returned text instead of image: "${textPart.text.substring(0, 100)}..."`,
      };
    }
  }

  // Check for blocked content
  if (data.candidates?.[0]?.finishReason === "SAFETY") {
    return {
      success: false,
      error: "Content blocked by safety filters. Try adjusting your prompt.",
    };
  }

  return { success: false, error: "No image in response" };
}

/**
 * Generate using Imagen models (imagen-3.0-*, imagen-4.0-*)
 * These use the predict endpoint and only support text-to-image
 */
async function generateWithImagen(
  apiKey: string,
  model: string,
  prompt: string,
  aspectRatio: string,
  negativePrompt?: string
): Promise<GenerationResult> {
  const url = `${API_BASE}/models/${model}:predict?key=${apiKey}`;

  const requestBody: {
    instances: Array<{ prompt: string }>;
    parameters: {
      sampleCount: number;
      aspectRatio: string;
      negativePrompt?: string;
    };
  } = {
    instances: [{ prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio,
    },
  };

  // Imagen supports negative prompt natively
  if (negativePrompt?.trim()) {
    requestBody.parameters.negativePrompt = negativePrompt;
  }

  const response = await fetchWithRetry(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  const data = await response.json();

  // Imagen returns predictions array with bytesBase64Encoded
  if (data.predictions?.[0]?.bytesBase64Encoded) {
    return {
      success: true,
      imageUrl: `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`,
    };
  }

  // Check for RAI filtered content
  if (data.predictions?.[0]?.raiFilteredReason) {
    return {
      success: false,
      error: `Content filtered: ${data.predictions[0].raiFilteredReason}`,
    };
  }

  return { success: false, error: "No image in response" };
}

/**
 * Main generation function - routes to appropriate API based on model type
 */
export async function generateLogo(config: GenerationConfig): Promise<GenerationResult> {
  if (!config.apiKey?.trim()) {
    return { success: false, error: "API Key is required." };
  }

  if (!config.prompt?.trim()) {
    return { success: false, error: "Please describe your logo concept." };
  }

  const modelInfo = getModelInfo(config.model);
  const prompt = buildPrompt(config);

  // Check reference image compatibility
  if (config.referenceImage && !modelInfo.supportsReference) {
    return {
      success: false,
      error: `${modelInfo.label} doesn't support reference images. Use Nano Banana or Nano Banana Pro.`,
    };
  }

  try {
    if (modelInfo.apiType === "gemini") {
      return await generateWithGemini(
        config.apiKey.trim(),
        config.model,
        prompt,
        config.aspectRatio,
        config.referenceImage
      );
    } else {
      // For Imagen, we pass negative prompt separately (it's handled natively)
      // But we still include it in the main prompt for Gemini
      return await generateWithImagen(
        config.apiKey.trim(),
        config.model,
        prompt,
        config.aspectRatio,
        config.negativePrompt
      );
    }
  } catch (err: unknown) {
    const error = err as Error;
    const msg = error.message || "Unknown error";

    // Parse common error patterns and return user-friendly messages
    if (msg.includes("403") || msg.includes("PERMISSION_DENIED")) {
      return { success: false, error: "Invalid API key or no access to this model." };
    }
    if (msg.includes("404") || msg.includes("not found")) {
      return { success: false, error: "Model not found. You may not have access to this model." };
    }
    if (msg.includes("quota") || msg.includes("exceeded") || msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
      // Extract retry time if present
      const retryMatch = msg.match(/retry in (\d+\.?\d*)/i);
      const retryTime = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : null;
      const retryMsg = retryTime ? ` Try again in ~${retryTime}s.` : " Please wait and try again.";
      return { success: false, error: `API quota exceeded.${retryMsg}` };
    }
    if (msg.includes("SAFETY") || msg.includes("blocked")) {
      return { success: false, error: "Content blocked by safety filters. Adjust your prompt." };
    }
    if (msg.includes("INVALID_ARGUMENT")) {
      return { success: false, error: "Invalid request. Check your prompt and settings." };
    }
    if (msg.includes("500") || msg.includes("503") || msg.includes("INTERNAL")) {
      return { success: false, error: "AI service temporarily unavailable. Please try again." };
    }
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("network")) {
      return { success: false, error: "Network error. Check your connection and try again." };
    }
    if (msg.includes("timeout") || msg.includes("DEADLINE_EXCEEDED")) {
      return { success: false, error: "Request timed out. Try a simpler prompt or try again." };
    }

    return { success: false, error: msg };
  }
}

/**
 * Validate API key by listing available models
 */
export async function validateApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  if (!apiKey?.trim()) {
    return { valid: false, error: "API key is required" };
  }

  try {
    const url = `${API_BASE}/models?key=${apiKey.trim()}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        valid: false,
        error: errorData.error?.message || "Invalid API key",
      };
    }

    return { valid: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { valid: false, error: error.message || "Validation failed" };
  }
}
