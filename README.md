# Voice AI — Triage & Ops-review prototype

A standalone, clickable prototype of the Voice AI **triage** and **ops-review**
flows, carved out of the `offsite-automation` dashboard so it can run and be
shared without the backend. **All data is mocked** — no server, no PHI.

## What's in it

- **Triage** (`/triage-prototype`) — the triage queue with a **Disagreements**
  tab, structured filters (reason, AI mistake, provider frustrated, call type,
  date), a call detail with work-item filing, and a disagreement-review screen.
- **Ops review** (`/ops-review-prototype`) — the reviewer's per-call screen:
  recording player, blind transcript, and outcome capture.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

> The repo ships a `.npmrc` pointing at the public npm registry so `npm install`
> works even if your global npm is set to Datavant CodeArtifact. On a
> Zscaler/corp machine you still need your usual `cafile` in `~/.npmrc`.

## Build the static site

```bash
npm run build    # outputs static HTML/JS to ./out
```

The build is a fully static export (`output: "export"`), so `out/` can be hosted
anywhere. The `gh-pages` branch holds a pre-built copy.

> **Hosting note:** GitHub Pages on a free account only serves *public* repos, so
> there's no Pages URL while this repo is private. To get a clickable link, host
> `out/` somewhere else (e.g. Vercel/Netlify) or make the repo public.
