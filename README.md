# Logo Studio AI

AI-powered logo generator built with React and Google's Generative AI models. Create professional logos instantly using Gemini and Imagen models.

![Logo Studio AI](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.1-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

## Features

- **Multiple AI Models** - Support for Gemini (Nano Banana, Nano Banana Pro) and Imagen (3.0, 4.0, 4.0 Ultra) models
- **Reference Image Support** - Use existing images as inspiration with Gemini models
- **Logo Presets** - 8 built-in styles: Modern Minimal, 3D Glossy, Gradient Mesh, Line Art, Mascot, Lettermark, Emblem, Tech Futuristic
- **Customization Options**:
  - Color palettes (Vibrant, Pastel, Monochrome, Dark Mode, Earth Tones, Corporate, Neon)
  - Style variations (Professional, Playful, Luxury, Bold, Organic, Geometric)
  - Complexity levels (Simple, Moderate, Detailed)
  - Aspect ratios (1:1, 4:3, 16:9, 9:16, 3:4)
- **Generation History** - Save and manage up to 30 generated logos
- **Favorites** - Mark logos as favorites for quick access
- **Remix** - Use any generated logo as a reference for new variations
- **Responsive Design** - Works on desktop and mobile devices
- **Local Storage** - API key and settings persist across sessions

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Google AI API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd logo-studio-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables (Optional)

Create a `.env.local` file to pre-configure your API key:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

## Usage

1. **Enter API Key** - On first launch, enter your Google AI API key
2. **Describe Your Logo** - Enter a concept description (e.g., "A phoenix rising from flames")
3. **Choose a Preset** - Select a logo style that matches your vision
4. **Customize** - Adjust color palette, style, complexity, and aspect ratio
5. **Generate** - Click "Generate Logo" and wait for the AI to create your design
6. **Iterate** - Use the remix feature to refine your logo with reference images

### Supported Models

| Model | Description | Reference Images |
|-------|-------------|------------------|
| Nano Banana Pro | Best quality, multimodal | ✅ |
| Nano Banana | Fast generation, multimodal | ✅ |
| Imagen 4 Ultra | Highest quality text-to-image | ❌ |
| Imagen 4 | High quality text-to-image | ❌ |
| Imagen 3 | Stable, reliable | ❌ |
| Imagen 3 Fast | Fastest generation | ❌ |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Type check with TypeScript
```

## Project Structure

```
logo-studio-ai/
├── components/
│   ├── ApiKeyInput.tsx    # API key modal
│   ├── Button.tsx         # Reusable button component
│   ├── Canvas.tsx         # Image canvas with pan/zoom
│   ├── Header.tsx         # App header
│   ├── LogoControls.tsx   # Generation settings panel
│   ├── LogoGenerator.tsx  # Main app component
│   ├── LogoPreview.tsx    # Preview and history display
│   ├── MobileSidebar.tsx  # Mobile navigation
│   └── SettingsModal.tsx  # App settings
├── hooks/
│   ├── useCanvas.ts       # Canvas interaction logic
│   └── useLocalStorage.ts # Persistent storage hook
├── services/
│   └── geminiService.ts   # Google AI API integration
├── App.tsx                # Root component
├── constants.ts           # Presets and configuration
├── types.ts               # TypeScript definitions
└── index.tsx              # Entry point
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Google Generative AI** - Image generation

## Deployment

### Vercel (Recommended)

The project is optimized for Vercel with proper caching, security headers, and SPA routing:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Environment Variables

For production, set these in your Vercel dashboard (optional):

| Variable | Description |
|----------|-------------|
| `VITE_GEMINI_API_KEY` | Pre-configured API key (users can still override) |

### Other Platforms

Build and serve the `dist` folder:

```bash
npm run build
# Serve dist/ with any static hosting (Netlify, Cloudflare Pages, etc.)
```

## SEO & PWA

The app includes:
- Open Graph and Twitter Card meta tags
- JSON-LD structured data (WebApplication schema)
- Web App Manifest for PWA support
- Sitemap and robots.txt
- Optimized font loading with preconnect

### Customizing for Your Domain

Update these files with your domain:
- `index.html` - Update `og:url`, `twitter:url`, `canonical`, and image URLs
- `public/sitemap.xml` - Update the `<loc>` URL
- `public/site.webmanifest` - Update if needed

### OG Image

Replace `public/og-image.png` with a 1200x630px image for social sharing. An SVG template is provided at `public/og-image.svg`.

## License

MIT

## Acknowledgments

- Powered by [Google Generative AI](https://ai.google.dev/)
- Icons by [Lucide](https://lucide.dev/)
