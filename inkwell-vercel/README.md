# illegal-whale — orca-inspired DeepSeek chat app

A Vercel-ready AI chat web app. The complete UI and backend live in `api/index.js`; `vercel.json` routes `/` and `/chat` to that single function.

## What this version fixes

- Long DeepSeek responses no longer reveal reasoning/thinking text.
- The backend sends small status heartbeat events while DeepSeek is thinking, so the browser and Vercel connection do not sit idle.
- Streaming now uses NDJSON events: `status`, `content`, `error`, and `done`.
- If a long stream is interrupted after some text has already arrived, the app keeps the partial answer instead of replacing everything with an error bubble.
- `vercel.json` sets `maxDuration` for the function to help longer generations.

## Deploy

1. Upload this folder to GitHub.
2. Import the repo in Vercel.
3. Add an environment variable:
   - `DEEPSEEK_API_KEY=your_key_here`
4. Deploy.

If your repo root contains this folder, set Vercel **Root Directory** to:

```text
inkwell-vercel
```

## Local dev

Install Vercel CLI, then run:

```bash
vercel dev
```

Open the local URL shown by Vercel.
