# Handoff — run the Agent One Inscription Wizard inside the Xtrata site

## Why this handoff
The wizard is a finished single-file app (`wizard/index.html`) that talks to the
Agent One backend (`server/server.mjs` + `svc/`). Its **only** missing piece when
run standalone is wallet connect: `@stacks/connect` must be **bundled** (CDN loads
are blocked / unreliable in this environment, and current Xverse rejects the legacy
popup that un-bundled connect uses).

The Xtrata app already has working, bundled wallet connect in `src/lib/wallet/`.
The cleanest fix is a tiny shim that re-exposes that logic to the wizard as
`window.XtrataWallet`. The wizard already delegates to it — no UI rewrite needed.

## What's been prepared for you
- `wizard/index.html` — the wizard. Already calls `window.XtrataWallet.{connect,disconnect,getAddress,pay}` and reads an optional `window.XAO_API` for the backend base URL.
- `site-integration/agent-one-wallet.ts` — the shim (uses `createStacksWalletAdapter` + `showStxTransfer` from `src/lib/wallet`).

## Prompt to give the Xtrata Agent

> Add an "Agent One Inscription Wizard" satellite page to the Xtrata site that
> reuses our existing wallet connect.
>
> 1. Copy `site-integration/agent-one-wallet.ts` to `src/agent-one/agent-one-wallet.ts`
>    (the relative imports `../lib/wallet/adapter` and `../lib/wallet/connect` should
>    resolve as-is). It sets `window.XtrataWallet` = { connect, disconnect, getAddress, pay }.
> 2. Build it to a self-contained IIFE/UMD `agent-one-wallet.js` (Vite library mode,
>    `formats: ['iife']`, name `XtrataWalletBundle`, single file, no externals) so it
>    runs from a plain `<script src>`. Bundle `@stacks/connect`/`@stacks/auth` in.
> 3. Place `wizard/index.html` (from the Agent One project) + the built
>    `agent-one-wallet.js` together as a static app (the `scripts/copy-static-apps.mjs`
>    pipeline, alongside `opus-file-generator/`), e.g. `public/agent-one/` →
>    served at `/agent-one/`.
> 4. The wizard talks to the Agent One backend API (`/api/health`, `/api/estimate`,
>    `/api/jobs`, `/api/jobs/:id`, `/api/jobs/:id/run|deliver|receipt`, `/api/upload`).
>    Run that server (`node server/server.mjs` from the Agent One project; it binds
>    127.0.0.1:8787, CORS `*`) and set the wizard's base URL by adding
>    `<script>window.XAO_API='http://localhost:8787'</script>` **before**
>    `agent-one-wallet.js` in `index.html`. (Long term, port the backend into the
>    site's server and use same-origin `''`.)
> 5. Test: open `/agent-one/`, click **Connect wallet**, approve in Xverse — the
>    header should show your `SP…`. Then drop a small file, **Create deposit job**
>    (Fast-track on by default), **Open wallet to pay**, and confirm the job runs to
>    COMPLETE with the inscription + receipt + change returned.
>
> Notes: the wizard expects `window.XtrataWallet.connect()` to return the mainnet
> `SP…` string (our `WalletSession.address`). `pay({recipient, amount, network})`
> takes microSTX as `amount`. Keep everything mainnet.

## Files to send the Xtrata Agent
Send the whole `xtrata-agent-one/` folder (it's self-contained):
- `wizard/index.html` — the UI (required)
- `site-integration/agent-one-wallet.ts` — the shim (required)
- `server/server.mjs` + `svc/*.mjs` — the backend (required to run jobs)
- `svc/SERVICE_SPEC.md`, `README.md`, `PROGRESSIVE_HARDENING.md` — context
- `agent1-identity/agent1-parent.svg`, `demo/` — assets/examples (optional)

## Vite build hint for the shim (library mode)
A minimal standalone config (so it doesn't disturb the main app build):
```js
// vite.agent-one-wallet.config.ts
import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    lib: { entry: 'src/agent-one/agent-one-wallet.ts', name: 'XtrataWalletBundle', formats: ['iife'], fileName: () => 'agent-one-wallet.js' },
    outDir: 'public/agent-one', emptyOutDir: false,
  },
});
```
`npx vite build -c vite.agent-one-wallet.config.ts` → `public/agent-one/agent-one-wallet.js`.
Then drop `wizard/index.html` in `public/agent-one/` as `index.html`.

## Fallback option (full React port)
If you'd rather make it a first-class React screen instead of a static satellite,
reuse `createStacksWalletAdapter` for connect and port `wizard/index.html`'s markup
+ logic into a screen/route. More work; the shim route above is faster and reuses
the wizard verbatim.
