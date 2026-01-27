# xtrata v15.1 (rebuild)

***Read contract-inventory.md before making any updates to the code for full context for all update types***

Contract-driven rebuild of the xtrata UI using Vite + React + TypeScript.

## Release notes
- `docs/release-notes-xtrata-v1.1.0.md`

## Requirements
- Node.js 18+

## Setup
```bash
npm install
npm run dev
```

## Tests
```bash
npm test
```

Clarinet contract tests live in `contracts/clarinet` and can be run directly:
```bash
npm run test:clarinet
```

Contract trait variants are synced/validated before tests. You can run them directly:
```bash
npm run contracts:sync
npm run contracts:verify
```

## Lint / Format
```bash
npm run lint
npm run format
```

## Notes
- Contract inventory and the contract registry will live in this repo.
- Network alignment will follow the connected Stacks wallet network.
- Viewer reads on-chain content in batches when supported, with adaptive fallback
  to per-chunk reads if cost limits are hit.
- Large audio/video previews buffer initial data for faster playback and load the
  remainder on demand.
- The Viewer panel includes a "Clear cache" action for IndexedDB inscription data
  (settings and contract selection are preserved).

## Local dev API proxy (CORS)
- Vite proxies `/hiro/testnet` and `/hiro/mainnet` to Hiro APIs to avoid CORS.
- To reduce 429 rate limits, set `HIRO_API_KEY` in `.env.local` (not committed).
- The UI warns on 429s when the dev proxy has no API key configured.
- Override with env vars if needed:
  - `VITE_STACKS_API_TESTNET`
  - `VITE_STACKS_API_MAINNET`

## Debug logging
Tagged logs can be enabled to trace chunk loading, previews, streaming, cache,
and multi-tab behavior.
- Enable in the browser console:
  - `localStorage.setItem('xtrata.log.level', 'debug')`
  - `localStorage.setItem('xtrata.log.tags', 'chunk,preview,token-uri,stream,cache,tab,mint')`
  - `localStorage.setItem('xtrata.log.enabled', 'true')`
- Or via env vars:
  - `VITE_LOG_LEVEL=debug`
  - `VITE_LOG_TAGS=chunk,preview,token-uri,stream,cache,tab,mint`
  - `VITE_LOG_ENABLED=true`
