# Collection helper v1.7 canary

Single-file page that deploys and exercises `contracts/live/xtrata-collection-mint-v1.7.clar`
from a web wallet (Xverse or Leather). Wallet logic (`wallet.ts`) is a port of the
X Chess v2 canary (build v6-2026-09-26) and follows docs/WALLET-PLAYBOOK.md.

Build: `npm run build:canary:collection-v17` → `canaries/build/collection-v17-canary.html`
(refuses to build unless the helper source matches the pinned SHA-256).

Run: serve the folder (`cd canaries/build && python3 -m http.server 8080`) and open
`http://localhost:8080/collection-v17-canary.html`. Wallet extensions do not inject into `file://`.

Steps: connect → preflight (source SHA, live core fees, name free) → deploy (Clarity 4) →
verify → configure (supply 1, register file, price, splits, unpause) → fund throwaway collector →
collector mints with a post-condition of exactly the price → sweep back → pause.

Tests: `npx vitest run canaries/collection-v17/wallet.test.ts`.
