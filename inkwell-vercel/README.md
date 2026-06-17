# Inkwell — Gemini-inspired DeepSeek chat app

A Vercel-ready AI chat web app. The complete UI and backend live in `api/index.js`; `vercel.json` only routes `/` and `/chat` to that single function.

## Deploy

1. Upload this folder to GitHub.
2. Import the repo in Vercel.
3. Add an environment variable:
   - `DEEPSEEK_API_KEY=your_key_here`
4. Deploy.

## Local dev

Install Vercel CLI, then run:

```bash
vercel dev
```

Open the local URL shown by Vercel.
