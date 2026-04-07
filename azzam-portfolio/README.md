# Azzam Abdul Khadar Portfolio

Professional personal portfolio website built with React and Vite.

## 🚀 Project Overview

- Modern responsive portfolio UI for displaying skills, experience, education, projects, and contact info.
- Built using React (JSX) and Vite for fast startup + HMR.
- Clean component-based architecture under `src/components`.
- Mobile-first design with responsive layout and modern styling.

## 📁 Project Structure

- `src/main.jsx` — React app bootstrap
- `src/App.jsx` — main page layout and section composition
- `src/components/*` — individual sections (Hero, Navbar, About, Skills,
  Experience, Education, Projects, Contact, Footer)
- `src/assets/*` — static images/icons
- `src/App.css`, `src/index.css` — global and application styles
- `public/` — static files served at root
- `vite.config.js` — Vite configuration

## ✅ Features Included

- Responsive Hero and Navbar with smooth section scrolling
- About section with summary and personal profile
- Skills visualization section (frontend, backend, tools)
- Experience and education timeline cards
- Projects showcase with links to demo/repo
- Contact form + social links
- Clean and minimal UI with accessible text and color contrast

## 🛠️ Setup & Run Locally

1. Clone repository
```bash
git clone https://github.com/Azzam-Abdul-Khadar/azzam-portfolio.git
cd azzam-portfolio
```
2. Install dependencies
```bash
npm install
```
3. Start dev server
```bash
npm run dev
```
4. Open browser on `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

- Production build output in `dist/`.
- Preview production build (locally) with:
```bash
npm run preview
```

## 🔧 Deployment

This project is suitable for deployment on GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.

### GitHub Pages example
1. Build: `npm run build`
2. Push `dist/` to `gh-pages` branch (or use GitHub Pages deploy action)

## 💡 Customize

- Update content in `src/components/*` and style in `src/App.css`
- Add new portfolio items to `src/components/Projects.jsx`
- Add SEO and meta tags in `index.html`

## 📄 License

MIT License

---

Made with ❤️ by Azzam Abdul Khadar.

