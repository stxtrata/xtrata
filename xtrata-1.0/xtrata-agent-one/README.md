# Xtrata Agent One

Inscription-as-a-service for Stacks: hand it a file (large or recursive with a
dependency graph), it quotes the cost, spins up a one-shot deposit wallet, the
user funds it, the agent inscribes, delivers the inscription, refunds the change,
and wipes the key. Targets the live core **`xtrata-v3-2-3`**.

## Layout

```
xtrata-agent-one/
  README.md                  ← you are here
  PROGRESSIVE_HARDENING.md    ← agentic-first → deterministic principle (build guide)
  svc/
    SERVICE_SPEC.md           ← the deposit-wallet model, trust model, lifecycle
    core.mjs                  ← shared logic (createJob/statusJob/runJob/deliverJob) + MOCK
    deposit-service.mjs       ← CLI over core (SVC_STEP=create|status|run|deliver)
    intake.mjs                ← deterministic multiple-choice intake (normalizeIntent)
    job-state/                ← one JSON per job (created at runtime; HOLDS KEYS in live mode)
  server/
    server.mjs                ← localhost API + serves the wizard same-origin
  wizard/
    index.html                ← the Inscription Wizard (single-file static app)
```

The upload+seal engine is the existing, tested `../agent-large-inscribe.mjs`
(in the AIBTC root); Agent One drives it from the per-job deposit wallet.

## Quick start — offline demo (MOCK, no chain, no spend)

```bash
cd /Users/melophonic/Documents/Claude/Projects/AIBTC/xtrata-agent-one
XTRATA_MOCK=1 node server/server.mjs
# open http://127.0.0.1:8787/
```

In MOCK the quote, funding, token-id, and txids are faked, so you can click the
whole flow — Estimate → Create → (auto-funded) → Run → Deliver — and build
dependency graphs without touching mainnet.

## Live (mainnet, real inscriptions)

```bash
cd /Users/melophonic/Documents/Claude/Projects/AIBTC/xtrata-agent-one
HIRO_API_KEY=xxxxxxxx node server/server.mjs
# open http://127.0.0.1:8787/
```

### Dependencies

This folder ships a `package.json` — install once on the host that runs the backend:

```bash
npm install
```

That pulls the Stacks/crypto libs and **`ffmpeg-static`** (used to optimise audio and
build SUNO players). A system `ffmpeg` on `PATH` is preferred if present (set
`FFMPEG_PATH` to pin one). The audio + SUNO-player pipeline is documented in
[`AUDIO_OPTIMIZATION.md`](AUDIO_OPTIMIZATION.md). (Running from inside the AIBTC
project still works too — its `node_modules` resolves the same deps.)

> `svc/job-state/` (ephemeral deposit-wallet keys), `svc/uploads/`, and
> `svc/receipts/` are git-ignored — never commit them.

Flow in the wizard:

1. **New inscription** — pick content type, give the server-side file path, hit
   *Estimate* to see the fee breakdown + required deposit.
2. Enter the **delivery address** (and any **dependency** token ids — or build
   them in the Graph tab), then *Create deposit job*. You get a one-shot deposit
   address + exact amount.
3. Fund that address from any wallet (this is the user's action — the agent never
   asks for the user's keys).
4. **Jobs** tab → select the job → *Run inscription* (enabled once funded) →
   *Deliver + refund + wipe key*.

## Configuration (env)

| var | default | meaning |
|-----|---------|---------|
| `XAO_PORT` | `8787` | server port (binds 127.0.0.1 only) |
| `XTRATA_CORE` | `xtrata-v3-2-3` | target core contract |
| `XTRATA_NETWORK` | `mainnet` | `mainnet` / `testnet` |
| `XTRATA_MOCK` | `0` | `1` = offline demo |
| `HIRO_API_KEY` | — | recommended in live mode (rate limits) |
| `JOB_DIR` | `svc/job-state` | per-job state files |
| `ENGINE` | `../agent-large-inscribe.mjs` | upload+seal runway |

## Security model

- **Localhost only.** The server binds `127.0.0.1`; it is a personal/agent tool,
  not a public endpoint. Don't expose it without auth + TLS.
- **Ephemeral keys.** In live mode each job's deposit key lives in
  `svc/job-state/<job>.json` only until delivery, then it is wiped. The API never
  returns the key (`publicJob` strips it; responses carry a `hasKey` flag only).
  **Git-ignore `svc/job-state/`.**
- **Custody window.** Between deposit and refund the agent controls the deposit
  key — custodial for that window. Mitigations and the non-custodial endgame
  (sponsored tx / x402) are in `svc/SERVICE_SPEC.md`.
- **Deterministic core.** Every money/sign step is code, not model output; intake
  is the only agentic surface and is railroaded into validated choices
  (`PROGRESSIVE_HARDENING.md`).
- **File handling.** Drag-and-drop or "Open local folder…" uploads the file to the
  server (`POST /api/upload`, capped at `MAX_UPLOAD_BYTES`, default 40 MiB) which
  saves it to `svc/uploads/` and inscribes from there — browsers can't expose a
  dropped file's real path, so the bytes are uploaded. You can also paste a path to
  a file already on the server machine. **Git-ignore `svc/uploads/`.**

## Serving it from the Xtrata site

`wizard/index.html` is a single self-contained file. To serve it from
`xtrata-v15-1` alongside the other static apps (`opus-file-generator/`, etc.):

1. Copy `wizard/index.html` into a static-app folder in the site (picked up by
   `scripts/copy-static-apps.mjs`).
2. Run the Agent One server somewhere reachable and either serve the wizard from
   it (same-origin, simplest) or set the `API` constant at the top of the page's
   script to the server's URL.

The page already falls back to `http://127.0.0.1:8787` when opened from `file://`.
