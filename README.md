# Azzam Abdul Khadar — Portfolio

A modern, responsive personal portfolio website showcasing my skills, experience, projects, and more.

🌐 **Live:** [azzamabdulkhadar.github.io](https://azzamabdulkhadar.github.io/)

## ✨ Features

- **Multi-language support** — English, Hindi, Kannada, Urdu (via react-i18next)
- **Three themes** — Default, Dark, Light (persisted in localStorage)
- **Animated UI** — Framer Motion page transitions and scroll animations
- **AI Chat Assistant** — Ask questions about my skills, projects, or experience (powered by Groq)
- **Mini Games** — Dino Runner, Flappy Bird, Skill Quiz (lazy-loaded for performance)
- **Project Showcase** — Detailed modal with image carousel, highlights, tech stack, and live app / GitHub links
- **Contact Form** — EmailJS-powered form with real-time validation
- **Feedback System** — Star rating + optional comment, sent via email
- **Start a Project** — Multi-step project inquiry form
- **SEO optimized** — Open Graph, Twitter Cards, structured data, sitemap, robots.txt
- **Accessible** — aria-labels on all icon buttons, focus-visible outlines, semantic HTML
- **Responsive** — Works across desktop, tablet, and mobile screens
- **Design system** — CSS custom properties for spacing, radius, and typography scales

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| Frontend | React 18, Vite, Framer Motion |
| Styling | CSS custom properties, inline styles |
| i18n | react-i18next (4 languages) |
| Email | EmailJS |
| AI | Groq API (LLaMA 3.3) |
| Deployment | GitHub Pages (GitHub Actions) |

## 📁 Project Structure

```
src/
├── assets/          # Images, profile photo, certificates
├── components/      # All UI sections (Hero, About, Skills, etc.)
│   └── games/       # DinoGame, FlappyBird, QuizGame, GamesModal
├── data/            # Project metadata (projects.js)
├── locales/         # Translation files (en, hi, kn, ur)
├── services/        # Quiz generator
├── App.jsx          # Root layout
├── main.jsx         # Entry point
├── index.css        # Global styles + design tokens
├── i18n.jsx         # i18next config
└── ThemeContext.jsx  # Theme provider
public/
├── azzamIcon.png    # Favicon
├── azzamResume/     # Resume PDF
├── robots.txt       # SEO
└── sitemap.xml      # SEO
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

# Build for production
npm run build
```

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_GROQ_API_KEY=your_groq_api_key
```

## 📦 Deployment

Deployed automatically via GitHub Actions on push to `main`. The workflow builds the project and deploys the `dist/` folder to GitHub Pages.

## 📄 License

MIT License

---

Built with ❤️ by [Azzam Abdul Khadar](https://azzamabdulkhadar.github.io/)
