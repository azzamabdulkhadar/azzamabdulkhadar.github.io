# Azzam Abdul Khadar — Portfolio

A modern, fully responsive personal portfolio showcasing my skills, experience, projects, and certifications.

🌐 **Live:** [azzamabdulkhadar.github.io](https://azzamabdulkhadar.github.io/)

## ✨ Features

- **Multi-language support** — English, Hindi, Kannada, Urdu (via react-i18next)
- **Four themes** — Dark, Light, Avocet, Avocet Light. Avocet Light is the default; the choice persists in `localStorage`
- **Animated UI** — Framer Motion scroll and page transitions, with `prefers-reduced-motion` respected
- **AI Chat Assistant** — Ask about my skills, projects, or experience. Falls back across multiple providers so a single rate limit doesn't break the chat
- **Mini Games** — Skill Quiz, Dino Runner, Flappy Bird in a fullscreen modal (lazy-loaded, so they add nothing to the initial bundle)
- **Project Showcase** — Detail modal with image carousel, swipe support, highlights, tech stack, and live/GitHub links
- **Experience detail view** — On phones each role collapses to a tappable card that opens a bottom sheet, instead of rendering every bullet inline
- **Contact Form** — EmailJS-powered with real-time validation
- **Feedback System** — Star rating plus optional comment, delivered by email
- **Start a Project** — Multi-step project inquiry form
- **SEO** — Open Graph, Twitter Cards, structured data, sitemap, robots.txt
- **Accessible** — aria-labels on icon buttons, focus-visible outlines, semantic HTML, keyboard-operable cards and modals

## 📱 Responsive design

The layout is driven by fluid design tokens rather than a stack of breakpoint overrides:

- **Fluid spacing and type** — `clamp()`-based tokens (`--space-*`, `--gutter`, `--h2`) scale continuously, so there are no sudden jumps between sizes
- **Adaptive content width** — `--container` widens from 1100px through 2100px on large displays, so 1440p and 4K screens don't render a narrow strip
- **Root font-size scaling** — steps up at 1500/1800/2400/3200px, which scales every `rem`-based value at once
- **Safe grid floors** — grids use `minmax(min(100%, Npx), 1fr)` so tracks collapse instead of overflowing on narrow screens
- **Mobile viewport units** — `dvh`/`svh` for the hero and modals, so browser chrome showing and hiding doesn't clip content
- **Capped reading measure** — `ch`-based limits keep line lengths readable on wide screens
- **16px form inputs** on small screens, which prevents iOS Safari from auto-zooming on focus

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| Frontend | React 19, Vite 8, Framer Motion 12 |
| Styling | CSS custom properties, inline styles, scoped `<style>` blocks |
| Icons | lucide-react, plus inlined GitHub/LinkedIn brand marks |
| i18n | react-i18next (4 languages) |
| Email | EmailJS |
| AI | Groq → Gemini → OpenRouter fallback chain |
| Deployment | GitHub Pages (GitHub Actions) |

### AI provider fallback

`src/services/aiProvider.js` tries providers in order and moves to the next on failure or rate limit. Keys are detected by prefix, and any provider without a key is skipped:

| Order | Provider | Model |
|-------|----------|-------|
| 1 | Groq (up to 3 keys) | `qwen/qwen3.6-27b` |
| 2 | Google Gemini | `gemini-3.5-flash-lite` |
| 3 | OpenRouter | `meta-llama/llama-4-scout:free` |

## 📁 Project Structure

```
src/
├── assets/            # Profile photo, certificates, project images
├── components/        # UI sections (Hero, About, Skills, …)
│   ├── games/         # GamesModal, QuizGame, DinoGame, FlappyBird
│   └── icons/         # BrandIcons.jsx (GitHub / LinkedIn marks)
├── data/              # projects.js — project metadata
├── hooks/             # useMediaQuery.js
├── locales/           # en, hi, kn, ur
├── services/          # aiProvider.js, quizGenerator.js
├── App.jsx            # Root layout
├── main.jsx           # Entry point
├── index.css          # Design tokens, themes, responsive foundation
├── i18n.jsx           # i18next config
├── theme.json         # Design-system colour reference (not imported at runtime)
└── ThemeContext.jsx   # Theme provider + localStorage persistence
public/
├── azzamIcon.png      # Favicon
├── azzamResume/       # Resume PDF
├── robots.txt
└── sitemap.xml
```

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/azzamabdulkhadar/azzamabdulkhadar.github.io.git
cd azzamabdulkhadar.github.io

# Install
npm install

# Dev server
npm run dev

# Production build
npm run build

# Preview the production build
npm run preview

# Lint
npm run lint
```

## 🔑 Environment Variables

Copy `.env.example` to `.env` and fill in your own keys. Never commit real keys.

```env
# AI chat — at least one is required for the assistant to respond.
# Providers are tried in this order; extra Groq keys spread out rate limits.
VITE_GROQ_API_KEY=
VITE_GROQ_API_KEY_2=
VITE_GROQ_API_KEY_3=
VITE_GEMINI_API_KEY=
VITE_OPENROUTER_API_KEY=

# Contact, feedback and project-inquiry forms
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

> **Note:** Vite inlines any `VITE_`-prefixed variable into the client bundle, so these keys are visible to anyone who views the deployed site. Use keys that are rate-limited and disposable, and rotate them if abused. Anything requiring real secrecy belongs behind a backend proxy.

## 🎨 Adding a theme

1. Add a `[data-theme="your-theme"]` block in `src/index.css`, defining the same custom properties as the existing themes.
2. Add an entry to `themeOptions` in `src/components/Navbar.jsx`.

## 📦 Deployment

Deployed automatically by GitHub Actions on push to `main`. The workflow builds the project and publishes `dist/` to GitHub Pages.

## 📄 License

MIT License

---

Built with ❤️ by [Azzam Abdul Khadar](https://azzamabdulkhadar.github.io/)
