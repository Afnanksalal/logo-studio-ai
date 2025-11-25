import { LogoPreset, SelectOption, LogoConfig, AppSettings, ModelInfo } from "./types";

export const QUALITY_PROMPT = `
Professional logo design requirements:
- Clean, crisp edges with no blur or artifacts
- Scalable vector-style appearance
- Balanced composition with clear focal point
- High contrast and readability
- Production-ready quality
- No watermarks or text artifacts
`;

export const MODEL_OPTIONS: ModelInfo[] = [
  // Gemini models (support image input/output)
  {
    id: "gemini-3-pro-image-preview",
    label: "Nano Banana Pro",
    description: "Best quality, supports reference images",
    supportsReference: true,
    apiType: "gemini",
  },
  {
    id: "gemini-2.0-flash-preview-image-generation",
    label: "Nano Banana",
    description: "Fast, supports reference images",
    supportsReference: true,
    apiType: "gemini",
  },
  // Imagen models (text-to-image only)
  {
    id: "imagen-4.0-ultra-generate-001",
    label: "Imagen 4 Ultra",
    description: "Highest quality",
    supportsReference: false,
    apiType: "imagen",
  },
  {
    id: "imagen-4.0-generate-001",
    label: "Imagen 4",
    description: "High quality",
    supportsReference: false,
    apiType: "imagen",
  },
  {
    id: "imagen-3.0-generate-002",
    label: "Imagen 3",
    description: "Stable, reliable",
    supportsReference: false,
    apiType: "imagen",
  },
  {
    id: "imagen-3.0-fast-generate-001",
    label: "Imagen 3 Fast",
    description: "Fastest generation",
    supportsReference: false,
    apiType: "imagen",
  },
];

export const PRESETS: LogoPreset[] = [
  {
    id: "modern-minimal",
    label: "Modern Minimal",
    description: "Clean geometric shapes",
    promptModifier: "Minimalist design, geometric shapes, clean lines, negative space, modern aesthetic, flat design",
  },
  {
    id: "3d-glossy",
    label: "3D Glossy",
    description: "Dimensional with shine",
    promptModifier: "3D rendered logo, glossy finish, soft shadows, dimensional depth, professional lighting",
  },
  {
    id: "gradient-mesh",
    label: "Gradient Mesh",
    description: "Smooth color transitions",
    promptModifier: "Gradient mesh design, smooth color transitions, modern gradient style, vibrant flowing colors",
  },
  {
    id: "line-art",
    label: "Line Art",
    description: "Single stroke elegance",
    promptModifier: "Single line art, continuous stroke, elegant simplicity, outline style, artistic linework",
  },
  {
    id: "mascot",
    label: "Character Mascot",
    description: "Friendly brand character",
    promptModifier: "Mascot character design, friendly expression, memorable character, cartoon style",
  },
  {
    id: "lettermark",
    label: "Lettermark",
    description: "Typography focused",
    promptModifier: "Lettermark logo, typographic design, creative letter arrangement, monogram style",
  },
  {
    id: "emblem",
    label: "Badge Emblem",
    description: "Classic crest style",
    promptModifier: "Emblem badge design, crest style, contained shape, vintage modern fusion",
  },
  {
    id: "tech-futuristic",
    label: "Tech Futuristic",
    description: "Sci-fi inspired",
    promptModifier: "Futuristic tech design, sci-fi aesthetic, digital elements, cyber style",
  },
];

export const COLOR_PALETTES: SelectOption[] = [
  { id: "auto", label: "AI Suggested", promptModifier: "Use colors that best match the concept" },
  { id: "vibrant", label: "Vibrant", promptModifier: "Bright, saturated, eye-catching colors" },
  { id: "pastel", label: "Pastel", promptModifier: "Soft, muted pastel tones" },
  { id: "monochrome", label: "Monochrome", promptModifier: "Single color with tonal variations" },
  { id: "dark-mode", label: "Dark Mode", promptModifier: "Dark background with light accents" },
  { id: "earth-tones", label: "Earth Tones", promptModifier: "Natural browns, greens, warm neutrals" },
  { id: "corporate", label: "Corporate Blue", promptModifier: "Professional blues and grays" },
  { id: "neon", label: "Neon Glow", promptModifier: "Bright neon colors with glow effects" },
];

export const STYLE_OPTIONS: SelectOption[] = [
  { id: "professional", label: "Professional", promptModifier: "Corporate, polished, business-appropriate" },
  { id: "playful", label: "Playful", promptModifier: "Fun, whimsical, approachable" },
  { id: "luxury", label: "Luxury", promptModifier: "Premium, elegant, sophisticated" },
  { id: "bold", label: "Bold", promptModifier: "Strong, impactful, attention-grabbing" },
  { id: "organic", label: "Organic", promptModifier: "Natural, flowing, hand-crafted feel" },
  { id: "geometric", label: "Geometric", promptModifier: "Mathematical precision, angular shapes" },
];

export const COMPLEXITY_OPTIONS: SelectOption[] = [
  { id: "simple", label: "Simple", promptModifier: "Minimal elements, highly simplified, iconic" },
  { id: "moderate", label: "Moderate", promptModifier: "Balanced complexity, clear hierarchy" },
  { id: "detailed", label: "Detailed", promptModifier: "Rich details, intricate design" },
];

export const ASPECT_RATIOS = [
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "3:4", label: "3:4" },
] as const;

export const DEFAULT_CONFIG: LogoConfig = {
  prompt: "",
  negativePrompt: "",
  brandName: "",
  presetId: "modern-minimal",
  colorPaletteId: "auto",
  styleId: "professional",
  complexityId: "moderate",
  aspectRatio: "1:1",
  referenceImage: undefined,
};

export const DEFAULT_SETTINGS: AppSettings = {
  model: "gemini-3-pro-image-preview",
  maxHistoryItems: 30,
};

export const PROMPT_SUGGESTIONS = [
  "A phoenix rising from flames",
  "Abstract mountain peaks at sunset",
  "Interconnected nodes forming a brain",
  "Stylized coffee cup with steam",
  "Rocket launching into space",
  "Tree with roots forming a circle",
  "Lightning bolt through a shield",
  "Geometric lion head",
];
