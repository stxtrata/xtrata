# Step 4 plan: blocklist and abuse handling (PLANNING ONLY, not started)

Status: PROPOSED 2026-10-21. Nothing in this document is implemented.
Parent doc: `CONTENT-ORIGIN-SPLIT-PLAN.md` (Phase 4). Related: `docs/security/REPUTATION-ADMIN-RUNBOOK.md`.

## 1. Goal

When someone reports a harmful inscription (phishing page, wallet drainer, malware, scam, impersonation,
illegal content), Jim can stop xtrata.xyz serving it within minutes, keep a record of why, and reverse it.
Inscriptions are permanent on-chain and cannot be deleted. This plan only controls what Xtrata's own site
serves and displays.

## 2. Scope

In scope: a D1 table of blocked inscriptions, a guard that checks it on every route that returns raw
inscription bytes, thumbnail and cache cleanup, an admin way to add and remove entries, an audit log, a
report intake, a visible "blocked" page, and a nightly scan of new HTML and SVG inscriptions.
Out of scope: changing the contracts, deleting chain data, automatic takedown without a human decision.

## 3. Data model (new migration in `functions/migrations/`)

`blocked_inscriptions`
- `id` integer primary key
- `contract_id` text not null (full principal and name, so other contract versions are distinct)
- `token_id` text not null
- `action` text not null: `block` (410 page), `sandbox_only` (serve with sandbox, never exempt),
  `interstitial` (warning page with click-through)
- `reason` text not null (category: phishing, malware, scam, impersonation, illegal, other)
- `note` text (free text, no personal data)
- `source` text (x_dm, email, scan, vendor)
- `created_at`, `created_by`, `expires_at` (nullable, for temporary holds)
- unique index on (`contract_id`, `token_id`)

`abuse_reports` (optional phase 4b): `id`, `contract_id`, `token_id`, `url`, `category`, `message`,
`created_at`, `status` (new, reviewing, actioned, dismissed), `ip_hash` for rate limiting only.

`moderation_log`: append-only record of every block, unblock and report decision.

## 4. Enforcement

1. `functions/lib/blocklist.ts`: `blocklistGuard({request, env, next})`. Resolves the inscription ref with the
   existing `inscriptionRefFromUrl` from `content-isolation.ts`, looks the id up in D1 (with a short in-memory
   or Cache API cache, about 30 to 60 seconds, so a block takes effect quickly but D1 is not hit per request).
2. Chain order on `/i`, `/inscription`, `/runtime`: `radioHostGuard`, `blocklistGuard`,
   `contentIsolationGuard`. Blocked items never reach the content handler or the R2 cache.
3. `block`: respond 410 (or 451 for legal reasons) with a plain page: "This inscription is not shown on
   xtrata.xyz. It still exists on the Stacks blockchain." plus a link to `/abuse`. No script, no external
   resources. `Cache-Control: no-store`.
4. `sandbox_only`: forces the sandbox CSP and ignores the exempt list.
5. `interstitial`: a static warning page for documents, passes through for non-document requests.
6. Also enforce on: the `/runtime/` launcher (it fetches `/runtime/content`, which is guarded, so it shows its
   failure state), `/thumb/`, `/g/`, collection and explorer routes that render previews, and the home page
   cards. Each should show a neutral "hidden" tile.
7. Fail open or closed? If D1 is unreachable, fail OPEN (serve normally with the Phase 1 sandbox) and log;
   a D1 outage must not take the site down.

## 5. Cleanup when a block is added

- Delete the R2 runtime-content cache entry (`functions/runtime/cache.ts`, `cache-purge.ts` already exist and
  take an admin token) and the thumbnail object (`THUMBNAILS` bucket, `functions/lib/thumbnails.ts`).
- Purge the Cloudflare edge cache for `/i/<id>`, `/inscription/<id>` and thumbnail URLs.
- Note: responses are `immutable` for a year, so browsers that already cached the page keep it. Mitigation:
  blocked pages are served `no-store` from now on, and the edge purge stops new fetches.

## 6. Admin interface

1. Script `scripts/block-inscription.mjs` wrapping `wrangler d1 execute` for `add`, `remove`, `list`, so the
   first version needs no new auth surface.
2. Optional later: `/manage/moderation` page behind the same auth as other manage routes (or the existing
   `DEBUG_VIEW_KEY` pattern in `functions/lib/debug-auth.ts`), listing entries, with one-click unblock.
3. Every change writes `moderation_log`.

## 7. Report intake

1. Phase 4a (cheap): keep the abuse page as is, add a real monitored email when available.
2. Phase 4b: a small form on `/abuse` posting to `functions/abuse/report.ts` (D1 insert, honeypot field,
   per-IP rate limit via hashed IP, size limits, no accounts). Jim reviews reports in the admin list.
3. Response targets (internal, not published unless Jim wants them): acknowledge within 1 working day, decide
   within 2.

## 8. Automated scan of new inscriptions

Reuse the scan patterns from the 2026-10 audit (phishing forms, seed-phrase wording, wallet lures,
telegram/webhook exfiltration, obfuscation, external form posts, top-level redirects) as a scheduled job:

- Nightly: list HTML and SVG tokens newer than the last run, fetch each, apply patterns, and write hits to a
  `scan_findings` table or a markdown report. No auto-blocking.
- Notify Jim by push notification or email when anything matches, with the token link and the matching rule.
- Tune false positives: wallet-connect library strings and the Xtrata wallet shim legitimately match
  `seed_phrase` and `fake_brand` patterns.

## 9. Moderation policy (write before enabling)

A one-page policy Jim signs off: what counts as harmful (phishing, wallet drains, malware, scams,
impersonation, illegal content), what is NOT moderated (art, opinion, offensive-but-legal), who decides, how
long a hold lasts, how a creator appeals (DM and a decision within a stated time), and that the chain copy is
unaffected. Link it from `/abuse`. Do not promise outcomes on the page until this exists and the blocklist is
live (the 2026-10-21 abuse page deliberately promises nothing).

## 10. Tests

- Guard: blocked id returns 410 and never calls `next`; unblocked passes through; expired hold passes;
  contract-scoped entries do not leak to other contracts; D1 failure fails open.
- Routes: all three content routes plus thumbnails respect the list; exempt list does not override a block.
- Migration applies on an empty and a populated database.
- Script: add, list, remove round trip against a local D1.

## 11. Rollout

1. Merge migration, guard and script with an empty table (no behaviour change).
2. Apply the migration to Preview, add a test token, verify 410 and cleanup, remove it.
3. Apply to Production. Keep the script and runbook handy.
4. Add the report form and admin page as separate follow-ups.

## 12. Estimate

Migration, guard, tests and script: about 1 day. Cache and thumbnail cleanup: half a day. Report form and
admin page: 1 day. Nightly scan: half a day. Policy text: Jim, about an hour.

## 13. Decisions needed from Jim

1. Who decides on a block, and is a second reviewer wanted?
2. 410 versus 451 wording for each category.
3. Monitored email address for reports.
4. Is the nightly scan wanted, and how should alerts reach Jim (push, email)?
