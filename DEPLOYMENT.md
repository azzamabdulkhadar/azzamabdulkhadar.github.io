# Deployment Guide

## Your Setup

| Repo | Purpose | URL |
|------|---------|-----|
| `azzam-abdul-khadar-portfolio` | Source code | https://github.com/azzamabdulkhadar/azzam-abdul-khadar-portfolio |
| `azzamabdulkhadar.github.io` | Live site | https://azzamabdulkhadar.github.io |

---

## Quick Deploy (After Making Changes)

### Step 1: Commit your changes
```bash
git add .
git commit -m "Your commit message"
```

### Step 2: Push to source code repo
```bash
git push origin azzam/resume
```

### Step 3: Deploy to live site
```bash
npm run deploy
```

That's it! Your site will be live in 1-2 minutes at https://azzamabdulkhadar.github.io

---

## What `npm run deploy` Does

1. Runs `npm run build` (creates optimized files in `dist/` folder)
2. Pushes the `dist/` folder to `azzamabdulkhadar.github.io` repo's `main` branch
3. GitHub Pages serves those files as your live website

---

## Full Workflow Example

```bash
# 1. Make your code changes in VS Code / Kiro

# 2. Stage and commit
git add .
git commit -m "Added new feature"

# 3. Push source code (keeps your code safe)
git push origin azzam/resume

# 4. Deploy live site (builds + publishes)
npm run deploy
```

---

## First Time Setup (Already Done)

If setting up on a new machine:

1. Clone the repo:
   ```bash
   git clone https://github.com/azzamabdulkhadar/azzam-abdul-khadar-portfolio.git
   cd azzam-abdul-khadar-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your keys:
   ```
   VITE_GROQ_API_KEY=your_key_here
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. Add the live remote:
   ```bash
   git remote add live https://github.com/azzamabdulkhadar/azzamabdulkhadar.github.io.git
   ```

5. Run locally:
   ```bash
   npm run dev
   ```

---

## Troubleshooting

### "Permission denied" error on push
Your Git credentials are wrong. Go to:
- Control Panel → Credential Manager → Windows Credentials
- Remove `git:https://github.com`
- Try pushing again (it will ask you to login)

### "Push cannot contain secrets" error
GitHub blocked the push because it detected an API key.
- Go to the URL shown in the error message
- Click "Allow secret" → select "I'll fix it later"
- Try pushing again

### Site not updating after deploy
- Wait 2-3 minutes (GitHub Pages has a cache)
- Hard refresh: `Ctrl + Shift + R`
- Check https://github.com/azzamabdulkhadar/azzamabdulkhadar.github.io to confirm files are there

### Build fails
```bash
npm install    # reinstall dependencies
npm run build  # try building again
```

---

## Important Notes

- Never commit `.env` file (it's in `.gitignore`)
- The `.env` file stays only on your local machine
- If you regenerate API keys, update your local `.env` and redeploy
- The Groq API key is visible in the built JS (this is normal for client-side apps)
