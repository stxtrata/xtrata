# Step 3 plan: separate content host and redirect (PLANNING ONLY, not started)

Status: PROPOSED 2026-10-21. Nothing in this document is implemented.
Parent doc: `CONTENT-ORIGIN-SPLIT-PLAN.md` (Phases 2 and 3). Incident background:
`docs/security/REPUTATION-INCIDENT-2026-10.md`.

## 1. Goal

Make it impossible for a user-made inscription to run as `xtrata.xyz`, so that reputation vendors scoring the
main domain never see arbitrary user code on it, without breaking games, wallets or links already inscribed
on-chain.

Phase 1 (sandbox header, live) covers every direct load that is NOT exempt. Two things remain:

1. Exempt tokens (3111, 3075, 3072, 394, 3047) run as xtrata.xyz.
2. The `/runtime/` launcher writes inscription HTML into its own page, so that HTML runs as xtrata.xyz.

Step 3 removes both by serving inscription documents from a different site.

## 2. What the code does today (verified 2026-10-21)

- Routes that return raw inscription bytes: `/i/<id>`, `/inscription/<id>` (and the long form
  `/inscription/<network>/<address>/<name>/<id>`), `/runtime/content`. Responses are CORS `*`, nosniff,
  `Cache-Control: public, max-age=31536000, immutable`.
- `public/runtime/index.html` (the launcher): reads `contractId`, `tokenId`, `network`, `moduleBase`, `source`
  and `walletBridgeToken` from its query string, `fetch`es `/runtime/content` as text, injects
  `<base href=moduleBase>`, `/runtime/url-support.js`, `/runtime/module-bootstrap.js`,
  `/runtime/wallet-shim.js`, then `document.open(); document.write(...)`. The inscription therefore runs in
  the launcher's own origin.
- `public/runtime/wallet-shim.js`: a wallet bridge. It posts requests to `window.opener`, `window.parent` or
  `window.top` with `targetOrigin = window.location.origin`, and ignores replies unless
  `event.origin === window.location.origin`. It also keeps a session in `localStorage`
  (`xtrata.runtime.wallet.session.v1`) and falls back to loading `@stacks/connect` from esm.sh.
  Same origin is a hard requirement of this design.
- The host app builds launcher links in `src/lib/viewer/runtime-open.ts` (`/runtime/?contractId=...`) and
  stores bridge tokens in `localStorage` (`xtrata.runtime-wallet-bridge.tokens.v1`, 6 hour TTL). The token and
  its storage are same-origin too.
- In-app previews use `<iframe sandbox="allow-scripts" src="/inscription/<id>">` or `/i/<id>`
  (TokenContentPreview, TokenCardMedia, CollectionCoverImage, MintScreen, CollectionMintLivePage,
  AssetStagingPanel, ContractStudioPage). These are already opaque-origin and are unaffected by Phase 1.
- `radio.xtrata.xyz` is a precedent: `functions/lib/radio-host.ts` is a host guard that serves content routes
  sandboxed and redirects everything else.
- Many on-chain inscriptions hard-code `https://xtrata.xyz/...` URLs for assets and APIs. Those URLs must keep
  working for the life of the chain.
- Scan of 359 HTML and SVG inscriptions (2026-10-20): 39 reference a wallet API, 34 use browser storage, 11
  use pop-ups or dialogs, about 76 reference `xtrata.xyz` routes or relative `/api`, `/runtime`, `/i/`.

## 3. Options for where the content lives

| Option | Example | Reputation effect | Cost | Notes |
|---|---|---|---|---|
| A. pages.dev project | `xtrata-content.pages.dev` | Separate site (pages.dev is on the Public Suffix List). Shares the neighbourhood reputation of pages.dev, which some corporate filters block wholesale. | Free | Fastest. Same repo, same bindings. |
| B. Dedicated domain | e.g. `xtrata-content.com` | Fully separate reputation. A newly registered domain can itself be flagged "newly observed domain", so register early and pre-submit it to vendors. | About 1 to 10 GBP per year | Cleanest long term. Avoid `.xyz` and avoid names that look like xtrata.xyz for phishing heuristics only if they are deceptive (a clear, honest name is fine). |
| C. Subdomain of xtrata.xyz | `content.xtrata.xyz` | None: vendors score the registrable domain. Separate origin only. | Free | Does not help the problem we have. Not recommended. Useful only as a stepping stone to test routing. |

Recommendation: build for A first because it is free and reversible, keep the host name in a single
environment variable (`CONTENT_HOST_ORIGIN`) so moving to B is a config change, and decide on B after the
first wallet test (see section 7, spike).

## 4. The hard part: wallets and the launcher

Moving inscription documents to another site changes what the browser considers "same origin" for three
things:

1. Wallet extensions (Xverse, Leather) inject into any https page, so a game opened directly on the content
   host can still connect a wallet. Differences: the wallet prompt shows the content host as the requesting
   site, previously approved sites do not carry over, and users may think the unfamiliar domain is suspicious.
2. The `wallet-shim.js` bridge requires `event.origin === window.location.origin`. If the launcher moves, the
   bridge between the xtrata.xyz app and the launcher stops working.
3. `localStorage` values (bridge tokens, saved game state, wallet session) are per origin. Anything an exempt
   or launched app saved on xtrata.xyz would not be visible on the content host. Existing saved progress for
   Timeloop, Astro Blaster and X Chess would appear lost for direct-link users.

Three designs for the launcher, in order of preference:

- L1. Leave the launcher on xtrata.xyz but stop it running inscription code in its own origin. It becomes a
  thin shell that creates `<iframe sandbox="allow-scripts allow-pointer-lock allow-downloads allow-popups
  src="CONTENT_HOST/runtime/content?...">`. Wallet requests go over `postMessage` to the shell, which holds
  the extension connection (top window, as WALLET-PLAYBOOK requires). The shim needs a change: the frame
  origin is the content host (or opaque), so the origin checks must become an explicit allowlist of
  `[xtrata.xyz]` for replies and `targetOrigin = xtrata.xyz` for requests. Saved state moves to the content
  host origin. Biggest security win, medium wallet-code change.
- L2. Move the whole launcher to the content host. Wallet requests need a cross-origin bridge back to the
  xtrata.xyz app. Requires the same shim change plus a new opener/handshake flow. More moving parts.
- L3. Keep the launcher exactly as it is and accept the gap. Zero risk to wallets, but the biggest remaining
  exposure stays. Acceptable only as the interim state.

Any change to `wallet-shim.js` or the bridge is wallet code: read `docs/WALLET-PLAYBOOK.md` first, keep the
fallback-order tests green, and run its section 10 desktop and mobile canary before shipping.

## 5. Work breakdown

### 5.0 Spike (no production change, about half a day)

1. Stand up a preview-only content host (option A) and load three inscriptions through it: Arcade Hall 3111,
   Astro Blaster 3075 and a storage-only app (Signal Runner 3094).
2. Wallet matrix: Xverse desktop, Xverse mobile in-app browser, Leather, the Xtrata passkey wallet, each
   connecting and signing a test call from the content host. Record the prompt text each wallet shows.
3. Origin audit: list every inscription that fetches an absolute `https://xtrata.xyz/...` URL, and for each
   route called confirm the response carries `Access-Control-Allow-Origin: *` (the runtime routes do; check
   `/hiro/`, `/api/`, `/thumb/`, `/g/`, `/rpc`, collection and market routes).
4. Storage audit: list the `localStorage` keys used by the 34 storage inscriptions and decide per app whether
   losing them on first visit matters.
5. Output: a short decision note (host choice, launcher design L1/L2/L3, which exemptions can be dropped).

### 5.1 Content host (about 1 day)

1. Second Pages project from the same repo and `wrangler.toml` bindings (same D1, R2 cache, thumbnails). Add
   the project name and host to `wrangler.toml` comments; keep per-environment values as dashboard secrets
   like `INSCRIPTION_SANDBOX`.
2. `functions/lib/content-host.ts`, modelled on `radio-host.ts`. Host-gated by `CONTENT_HOST` (the content
   host's hostname). On that host serve only: `/i/`, `/inscription/`, `/runtime/content`, `/runtime/modules`,
   `/hiro/`, `/thumb/`, the runtime support scripts the launcher needs, and a `/healthz`. Everything else:
   302 to `https://xtrata.xyz` + path. On xtrata.xyz the guard is a no-op.
3. Response policy on the content host: no cookies, `X-Content-Type-Options: nosniff`,
   `Referrer-Policy: no-referrer`, `Cross-Origin-Resource-Policy: cross-origin`, `X-Robots-Tag: noindex`,
   and keep CORS `*` on every route inscriptions call.
4. Do NOT apply the sandbox CSP on the content host: it is a different site, so scripts cannot reach
   xtrata.xyz state, and sandboxing would break storage and wallet connect for direct links.
5. Tests: guard routing matrix (allowed paths, redirected paths, no-op on main host), header assertions,
   that the content host cannot serve `/` or any app page.

### 5.2 Redirect from the main domain (about half a day)

1. New guard `contentHostRedirectGuard` in the `/i`, `/inscription` middleware chain, after `radioHostGuard`
   and before `contentIsolationGuard`. Feature flag `CONTENT_HOST_ORIGIN` (unset = off).
2. Redirect only when `Sec-Fetch-Dest: document` (a person navigating) and the token is not on
   `INSCRIPTION_REDIRECT_EXEMPT` (default: the same tokens as `INSCRIPTION_SANDBOX_EXEMPT` until step 5.4).
   Never redirect `iframe`, `image`, `audio`, `video`, `script`, `empty` (fetch) destinations, so in-app
   previews, `<img src=/i/...>`, recursive inscriptions and `fetch('/i/...')` keep working.
3. Crawlers and link unfurlers send no `Sec-Fetch-Dest`; they keep getting the sandboxed 200 from Phase 1.
4. Use 302, `Cache-Control: no-store` on the redirect, and add `Vary: Sec-Fetch-Dest` to the existing 200
   responses so a cached immutable 200 is never confused with a navigation. Browsers may still replay a cached
   200 for a document load; that response is sandboxed, which is acceptable.
5. Preserve the path and query. Long-form `/inscription/<network>/<address>/<name>/<id>` redirects too.
6. Tests: header matrix (document/iframe/image/fetch/none), exempt ids, query preserved, flag off = no
   redirect, redirect never loops (content host never redirects back).

### 5.3 Launcher (depends on the spike, about 1 to 2 days)

Implement L1 (preferred) or keep L3. For L1: change `public/runtime/index.html` to build a sandboxed iframe at
`CONTENT_HOST/runtime/content`, change `wallet-shim.js` origin checks to an explicit allowlist, migrate bridge
token handling, and update `src/lib/viewer/runtime-open.ts` and its test. Re-run the arcade, X-Board and wallet
canary on a preview before any production flag change.

### 5.4 Retire exemptions (after 5.1 to 5.3 are stable)

Drop tokens from `INSCRIPTION_SANDBOX_EXEMPT` one at a time once their direct links work on the content host.
The goal is an empty exempt list.

### 5.5 Links and docs (about half a day)

1. Public link builders that print `/i/<id>` or `/inscription/<id>` (viewer share links, homepage content,
   `public/radio.html`, `xtrata-radio.js`, `src/home/radio.js`, audionaut sell and royalties, bounty tracker,
   wizard `index.html`) should use the content host once it is stable, via one helper so there is a single
   place to change.
2. Update `public/llms.txt` and `public/llms-full.txt` (the latter has one `/i/` reference).
3. Update `docs/app-reference.md`, `docs/WALLET-PLAYBOOK.md` (new bridge origin rules) and the incident doc.

### 5.6 Vendor and Vodafone follow-up

Before public links point at the content host, submit it to Webroot/BrightCloud, Forcepoint and alphaMountain
(category: Computer and Internet Info or Cryptocurrency) and run it through VirusTotal, so the new host is
not the next thing a filter blocks. For option B, do this the day the domain is registered.

## 6. Rollout and rollback

1. Merge everything dark (no `CONTENT_HOST_ORIGIN`, no content project traffic).
2. Preview: set `CONTENT_HOST_ORIGIN` on Preview only, run the canary and wallet matrix.
3. Production: create the content project, set the flag, watch for an hour (error rate, support DMs).
4. Rollback: delete `CONTENT_HOST_ORIGIN` and redeploy. The main host immediately returns to serving the
   sandboxed 200. The content host can stay up harmlessly.
5. Never remove the Phase 1 sandbox until the content host has run cleanly for at least a month.

## 7. Canary and acceptance checks

- Header checks: `curl -sI -H 'Sec-Fetch-Dest: document' https://xtrata.xyz/i/3094` is a 302 to the content
  host; the same request with `Sec-Fetch-Dest: iframe` is a 200 with the sandbox header; exempt ids are not
  redirected.
- Functional: arcade (`/arcade`, `/x/3111`, `/i/3111`), X-Board, Astro Blaster 3, X Chess, Timeloop,
  wizard previews, collection covers, radio, the explorer grid thumbnails.
- Wallets: Xverse desktop and mobile, Leather and the passkey wallet connect and sign from a direct link and
  from the launcher.
- Saved state: record what players lose and communicate it before enabling.
- Reputation: VirusTotal, Forcepoint, Webroot and alphaMountain show the main domain clean, and the content
  host is categorised before it is public.

## 8. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Wallet bridge breaks | Games cannot connect wallets or submit scores | Spike first, L1 only with the WALLET-PLAYBOOK canary, flag off by default, exempt list kept until proven |
| Saved game progress "disappears" | Player support load | Audit keys in the spike; communicate; consider a one-time export/import for the three big games |
| pages.dev blocked by corporate filters | Direct links fail for some users | Option B later; the main site and in-app views are unaffected |
| New content domain flagged as newly registered | Direct links blocked | Register early, pre-submit to vendors |
| Hard-coded on-chain URLs | Old inscriptions break | Redirect only for `Sec-Fetch-Dest: document`; keep all routes on the main host |
| Wallet prompt shows unfamiliar domain | Users distrust it | Clear host name, explain on the abuse and help pages, prefer the launcher shell (L1) so the connect prompt shows xtrata.xyz |
| Caching confusion | Wrong redirect behaviour | `Vary: Sec-Fetch-Dest`, no-store on redirects, tests |

## 9. Decisions needed from Jim

1. Option A (pages.dev) first, then reassess, or buy a dedicated domain now?
2. Preferred launcher design after the spike (L1 recommended).
3. Is it acceptable that saved state on direct links resets once for users who relied on it?
4. Is a monitored email address available for the abuse page and security.txt?

## 10. Estimate

Spike half a day, content host and redirect about 1.5 days, launcher 1 to 2 days, links and docs half a day,
canary and vendor follow-up a day. About a working week with testing, without touching wallet code unless
L1 is chosen.
