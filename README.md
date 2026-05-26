# School Clubs Livefeed

Club announcements + optional video links with a **moderation queue** before anything appears on the public feed.

## Status (May 2026)

- **Demo-ready**: runs fully in-browser with `localStorage`.
- **PWA-ready**: mobile-friendly UI + manifest.
- **Not multi-user yet**: needs real auth + backend before school deployment.

## MVP scope

- `localStorage` persistence (good for demos; **not** multi-user safe).
- “Moderator view” toggle = stand-in for authenticated staff role.

## Before real school use

- Real auth (Google Workspace / Clever).
- Report button, audit log, retention policy, COPPA/FERPA review with your district.

## Run

```bash
npm install && npm run dev
```

**PWA manifest** + responsive feed UI. **`MOBILE.md`** — backend + Expo notes.

MIT — portfolio.
