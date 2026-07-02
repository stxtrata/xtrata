# Agent One — deploying to the website

## What's wired now (frontend)
- `scripts/copy-static-apps.mjs` now publishes `xtrata-agent-one/wizard` → `dist/agent-one`.
- `prebuild` runs `build:agent-one-wallet` (Vite library build of `src/agent-one/agent-one-wallet.ts`
  → `xtrata-agent-one/wizard/agent-one-wallet.js`), so the bundled wallet ships with the page.
- Result of `npm run build`: the wizard is served at **`/agent-one/`** (e.g. `https://<your-domain>/agent-one/`),
  matching `/opus-file-generator/` etc.

> Build runs on your Mac / CI, not here (the sandbox's esbuild binary is for macOS).
> `npm run build` → check `dist/agent-one/index.html` + `dist/agent-one/agent-one-wallet.js` exist.

## The page needs a backend URL
The wizard calls the Agent One API (`/api/jobs`, `/api/estimate`, `/api/upload`, …). Served from the
site it defaults to same-origin (`''`), where those routes don't exist — so it shows "server offline"
until you point it at the hosted backend. Set it once in the deployed page:

```html
<!-- add near the top of dist/agent-one/index.html (or ship a config.js the page loads) -->
<script>window.XAO_API = 'https://agent-api.your-domain';</script>
```

## The backend is the real work (it is a custodial service)
The server in `server/server.mjs` generates per-job deposit wallets, **holds their keys until delivery**,
and can **move STX**. It's deliberately bound to `127.0.0.1` today. Exposing it publicly = running a
money-moving service. Do NOT expose it as-is. Hardening checklist before go-live:

1. **Transport**: run behind a reverse proxy (nginx/Caddy) with **TLS/HTTPS**. Never plain HTTP.
2. **CORS**: it currently sends `Access-Control-Allow-Origin: *`. Lock it to your site origin only.
3. **Auth + abuse control**: the API is **unauthenticated** — anyone who can reach it can create jobs,
   trigger run/deliver, and list jobs (deposit addresses + amounts; keys are never exposed). Add an
   auth token / per-session scoping and **rate limiting** before public exposure.
4. **Secrets via env, never in the bundle**: `HIRO_API_KEY`, `AGENT_FEE_ADDRESS`. `.env`/`.env.local`
   are already excluded from the static copy.
5. **Job-state is sensitive**: `svc/job-state/*.json` holds the ephemeral keys until a wallet is
   confirmed empty (the never-wipe guard keeps keys whenever STX/inscriptions remain). Put it on a
   persistent, access-controlled, **encrypted-at-rest** volume; back it up; never serve it statically;
   git-ignore `svc/job-state/` and `svc/uploads/`.
6. **Funds safety**: deposits are exact + capped; `svc/recover-deposit.mjs` and `svc/recover-all.mjs`
   sweep any wallet back. Monitor `ERROR`/stuck jobs and sweep abandoned deposits.
7. **Process/host sizing**: each large (staged) job spawns a `node` engine that runs for minutes;
   the run is async (won't block the API), but size the host and consider a concurrency cap.
8. **Uploads**: capped at `MAX_UPLOAD_BYTES` (40 MiB default) — adjust per your limits; validate types.

## The non-custodial endgame (removes most of the above risk)
The deposit-wallet model is the pragmatic v1, but it means the agent briefly custodies user funds.
The target architecture removes that window entirely:
- **Stacks sponsored transactions**, or
- the **AIBTC x402 relay** — the user signs, the relay/agent pays fees.
With sponsored/x402 the user keeps custody throughout; the "fresh wallet + deposit + sweep" dance and
its key-handling risk disappear. Prioritise this before a wide public launch.

## Go-live order
1. `npm run build`, confirm `dist/agent-one/` is produced → wizard live at `/agent-one/` (frontend only).
2. Stand up the backend on a host with TLS, locked CORS, auth, encrypted job-state, env secrets.
3. Set `window.XAO_API` on the deployed page to the backend URL.
4. Smoke-test connect → estimate → small single-tx job end-to-end on mainnet.
5. Plan the sponsored-tx / x402 migration to go non-custodial for the public.
