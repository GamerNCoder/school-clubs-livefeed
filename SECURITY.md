# Security — Arnav portfolio repos

## Secrets

- Never commit `.env`, `.env.local`, API keys, or `*.pem`.
- Use `.env.example` only for variable **names**, not real values.
- Rotate any key that was ever committed or pasted into chat.

## Production

- Set `CORS_ALLOW_ORIGINS` to your real web origin(s), not `*`.
- Do not embed Gemini/OpenAI keys in Vite/Next **client** bundles; use a backend proxy.
- Internet Archive scraper output (`manifest.jsonl`, HTML) stays local — not in git.

## Audit (2026-05)

- FastAPI apps: CORS defaults to localhost; override via `CORS_ALLOW_ORIGINS`.
- `thekoresec`: Gemini key not injected into production Vite builds.
- All repos: `.gitignore` blocks env files and credentials.
