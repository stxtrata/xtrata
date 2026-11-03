# CONTENT-ORIGIN-SPLIT-PLAN

Status: Phase 1 implemented on branch `fix/content-origin-isolation`, OFF by default (2026-10-19). Phases 2 to 4 not started.

## Why

On 2026-10-19 Vodafone Secure Net blocked xtrata.xyz as malicious. VirusTotal showed 1 of 92 vendors
flagging it (Webroot: Malicious; alphaMountain and Forcepoint: Suspicious). Webroot rates the domain
"Phishing and Other Frauds", High Risk (10/100), with "1 infection in the past 12 months", low
popularity and a young domain. Vendor reviews were requested the same day:

- Webroot (OpenText/BrightCloud): category change ticket 1288380, reputation change ticket 1288391
- Forcepoint: case 01086274 (currently "Extended Protection: Elevated Exposure")
- alphaMountain: ticket 141181

Vodafone staff need every vendor on VirusTotal clear before they will reclassify.

## Finding

An audit of the current core contract (xtrata-v3-2-3, 3,529 tokens) fetched all 359 HTML and SVG
inscriptions from `https://xtrata.xyz/i/<id>`. None looked malicious (no phishing forms, no
exfiltration endpoints, no seed-phrase lures; the "seed phrase" matches are wallet-connect library
strings). But every one was served with NO Content-Security-Policy, so each runs as the xtrata.xyz
origin when opened directly. The protocol is permissionless, so anyone can inscribe an HTML page that
then lives at an xtrata.xyz URL. That is the structural risk scanners react to.

Facts from the code:

- The app already frames inscriptions with `sandbox="allow-scripts"` and no `allow-same-origin`
  (opaque origin). Embedded views are isolated. The exposure is direct top-level loads of
  `/i/<id>`, `/inscription/<id>` and `/runtime/content`.
- `functions/lib/radio-host.ts` documents that the runtime and gallery "deliberately run
  inscriptions AS xtrata.xyz" so wallet extensions work (arcade, X-Board). The `/runtime/` launcher
  is a trusted, wallet-capable page (see docs/WALLET-PLAYBOOK.md; do not touch wallet code).
- Many inscriptions hard-code `https://xtrata.xyz/...` on-chain. Those URLs must never break.
- One Pages project (`xtrata`) serves everything. `radio.xtrata.xyz` is already gated by a host
  guard that serves content routes sandboxed. This plan reuses that pattern.
- Nothing in the repo can hide or block a reported inscription.

## Phase 1: sandbox the direct routes (about half a day, no new infrastructure)

1. In the shared content response (`functions/runtime/content.ts`), add
   `Content-Security-Policy: sandbox allow-scripts allow-pointer-lock allow-downloads` to
   `/i/`, `/inscription/` and `/runtime/content`. This matches what the app already does in iframes.
2. Add an allowlist of token IDs that must keep running unsandboxed as xtrata.xyz. Candidates from
   the audit: arcade (`/x/3111`), X-Board, and the wallet-connect app inscriptions 3037, 3039, 3042,
   3051, 3068, 3069, 3072, 3075. Confirm each by testing, not by guesswork.
3. Verify the `/runtime/` launcher still works. A response CSP sandbox cannot be loosened by iframe
   attributes, so any flow that loads `/runtime/content` as a same-origin document needs the
   allowlist or a bypass.
4. Tests in `functions/runtime/__tests__/`: header present, allowlisted ID exempt, non-content
   routes unaffected, radio host behaviour unchanged.
5. Deploy to a preview branch first (previews mirror production bindings). Manual canary: arcade,
   X-Board, wizard previews, collection covers, radio, `/x/<id>` viewer.

### Phase 1 implementation notes (done, dark behind a flag)

- Code: `functions/lib/content-isolation.ts`, wired into `functions/{runtime,i,inscription}/_middleware.ts`
  as `[radioHostGuard, contentIsolationGuard]`. Tests: `functions/lib/__tests__/content-isolation.test.ts`.
- Off unless the dashboard variable `INSCRIPTION_SANDBOX` is exactly `1`. Merging changes nothing by itself.
- `INSCRIPTION_SANDBOX_EXEMPT` takes token ids or `<contractId>:<tokenId>`. Matching fails closed: an
  unparseable id is never exempt.
- Only document-capable types (HTML, XHTML, SVG, XML) get the CSP. Media, JSON, JS modules and raw
  source are untouched. Responses carry `X-Xtrata-Content-Isolation: sandboxed|exempt` for checking.
- The `/runtime/` launcher `fetch`es `/runtime/content` and `document.write`s it (public/runtime/index.html),
  so the sandbox does not affect it. Arcade and X-Board launched through the launcher should be unaffected;
  confirm in the canary below.
- Known pre-existing failures, unrelated: the two Clarinet simnet integration tests
  (`collection-storage-integration`, `collection-v15-client-integration`) need `contracts/clarinet` installed.

Rollout checklist:

1. Merge with the flag unset (no behaviour change).
2. Set `INSCRIPTION_SANDBOX=1` on the Preview environment only. Check
   `curl -sI https://<preview>/i/<html-token>` shows the `content-security-policy: sandbox ...` header.
3. Canary on the preview: arcade (`/x/3111`), X-Board, wizard previews, collection covers, radio,
   `/x/<id>` viewer, a wallet-connect app inscription opened via the launcher and opened directly.
4. Add any inscription that breaks to `INSCRIPTION_SANDBOX_EXEMPT`, then set the flag on Production.
5. Re-run the lookups on VirusTotal, Forcepoint and Webroot over the following days.

## Phase 2: content host on pages.dev (about a day)

1. Create a second Pages project `xtrata-content` from the same repo and `wrangler.toml`
   (same D1, R2 cache and secrets bindings). Address: `xtrata-content.pages.dev`.
2. Generalise `radio-host.ts` into a `CONTENT_HOST` guard. On that host serve only `/i/`,
   `/inscription/`, `/runtime/content`, `/runtime/modules`, `/hiro/`, `/thumb/`; redirect
   everything else to `https://xtrata.xyz`.
3. Do not sandbox on this host: it is a different site, so scripts cannot reach xtrata.xyz state.
   Check CORS headers on every route inscriptions call.

## Phase 3: redirect from the main domain (about half a day)

1. On xtrata.xyz, redirect top-level loads (`Sec-Fetch-Dest: document`) of `/i/` and
   `/inscription/` to the content host.
2. Keep the Phase 1 sandbox on every non-redirected response (crawlers may not send that header).
   Allowlisted IDs stay on xtrata.xyz.
3. Update `public/llms.txt`, `llms-full.txt` and docs so public links use the content host.

## Phase 4: hygiene (ongoing)

- D1 table of blocked inscription IDs checked by the content route (410/451), so a report can be
  handled in minutes.
- Abuse contact page and `security.txt`.
- Re-check VirusTotal, Forcepoint and Webroot after Phase 1 and again after Phase 3; then ask
  Vodafone to reclassify.

## Open questions

- Which inscriptions truly need the xtrata.xyz origin? The allowlist above is a starting point.
- Do any inscriptions fetch root-relative paths the content host would not allow?
- Is a pages.dev address acceptable for public inscription links, or buy a short dedicated domain
  later (about 1 to 10 GBP a year, fully separate reputation)?
- Webroot's "1 infection" detail is private to them; their ticket replies may say what it was.

## Branch

Work on `fix/content-origin-isolation`. Do not mix with other working-tree changes.
