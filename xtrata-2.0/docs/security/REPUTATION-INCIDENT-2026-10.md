# Reputation incident: xtrata.xyz flagged as malicious (October 2026)

Status: vendor flags cleared 2026-10-21. Vodafone reclassification still to be requested.
Owner: Jim. Ongoing checks: see `REPUTATION-ADMIN-RUNBOOK.md`.

## What happened

- 2026-10-19: a friend's Vodafone Secure Net blocked xtrata.xyz ("known for malicious activity").
- VirusTotal showed 1 of 92 vendors flagging the domain (Webroot: Malicious) plus Forcepoint ThreatSeeker
  and alphaMountain as Suspicious. Vodafone staff need every vendor clear before they reclassify.
- Webroot rated the domain "Phishing and Other Frauds", High Risk, with "1 infection in the past 12 months",
  low popularity and a young domain. The detail behind the infection is private to Webroot.
- The domain was registered about 9 months ago. VirusTotal's first record is from 2026-01-27, so the flag
  predates the 2026-10 code changes.

## Diagnosis

All 359 HTML and SVG inscriptions in the core contract (xtrata-v3-2-3) were fetched from
`https://xtrata.xyz/i/<id>` and scanned for phishing forms, wallet-drain lures, exfiltration endpoints,
seed-phrase prompts and redirects. None looked malicious. The "seed phrase" matches were wallet-connect
library strings.

The structural finding: every inscription route served user-made HTML as a top-level page on xtrata.xyz
with no Content-Security-Policy, so any inscribed page ran AS xtrata.xyz when opened directly. The protocol
is permissionless, so that is what a reputation scanner reacts to. This is the most likely trigger, but no
vendor has confirmed it.

## Vendor actions and outcomes

| Vendor | Submitted | Reference | Outcome |
|---|---|---|---|
| Webroot / BrightCloud (OpenText) | 2026-10-19 | tickets 1288380 (category), 1288391 (reputation) | 2026-10-19 17:59 UTC: recategorised to Computer and Internet Info, published. VirusTotal clean by 2026-10-20. |
| alphaMountain | 2026-10-19 | ticket 141181 (support portal account created by Jim) | 2026-10-19 12:22 UTC: rescanned and reclassified. |
| Forcepoint | 2026-10-19 | case 01086274 (Site Lookup Tool) | 2026-10-20 13:48 UTC: categorised as Cryptocurrency. |
| VirusTotal | 2026-10-21 check | domain page | "No security vendors flagged this domain as malicious". Tagged cryptocurrency. |

## Changes made in the repo

- `functions/lib/content-isolation.ts` (PR from `fix/content-origin-isolation`): optional CSP sandbox on
  `/i/`, `/inscription/` and `/runtime/content` for HTML, SVG and XML responses. Off unless the Cloudflare
  secret `INSCRIPTION_SANDBOX` is `1`. Opaque origin, never `allow-same-origin`.
- `INSCRIPTION_SANDBOX_EXEMPT` (secret): token ids that must keep running as xtrata.xyz, because they connect
  a wallet or keep state when opened directly. Currently `3111,3075,3072,394,3047` (Arcade Hall, Astro
  Blaster 3, X Chess, XBoard, Timeloop Detective). Production and Preview both set.
- `public/.well-known/security.txt` and `public/abuse.html` (`/abuse`): published contact and report page.
- Tests: `content-isolation.test.ts`, `security-contact.test.ts`.

## Known gaps still open

1. Exempt tokens run as xtrata.xyz when opened directly. They are Xtrata's own apps. Do not exempt anyone
   else's inscription.
2. The `/runtime/` launcher fetches content and writes it into its own page, so that content still runs as
   xtrata.xyz. The sandbox cannot touch it. Closing this gap needs the content host in
   `docs/plans/STEP-3-CONTENT-HOST-PLAN.md`.
3. No way to block a single reported inscription. Plan: `docs/plans/STEP-4-BLOCKLIST-AND-ABUSE-PLAN.md`.
4. Inscriptions created after 2026-10-19 were not in the scan. Re-scan before each major review.

## Evidence for Vodafone

- Vendor confirmation emails (Webroot x2, alphaMountain, Forcepoint) in the jimdotbtc@gmail.com inbox.
- VirusTotal domain page showing no vendor flags.
- Published abuse page and security.txt.

## Vodafone request

Post from Jim's own Vodafone account (Community or support). Draft text lives in the conversation that
created this doc and is reproduced here for the record.

> Subject: Please review xtrata.xyz, blocked by Secure Net as malicious (false positive)
>
> Hi, Secure Net is blocking xtrata.xyz as "known for malicious activity". It is a false positive. Xtrata is
> an on-chain data protocol on Stacks (Bitcoin L2), and people use it to store and display files and generative
> art.
>
> What I have done so far:
> - Webroot / BrightCloud reviewed the site and recategorised it to Computer and Internet Info (tickets 1288380 and 1288391).
> - Forcepoint reviewed it and categorised it as Cryptocurrency (case 01086274).
> - alphaMountain rescanned and reclassified it (ticket 141181).
> - VirusTotal now shows 0 of 92 vendors flagging xtrata.xyz: https://www.virustotal.com/gui/domain/xtrata.xyz
> - I have published a report page (https://xtrata.xyz/abuse) and https://xtrata.xyz/.well-known/security.txt, and
>   turned on a content sandbox for user-made pages.
>
> Could you please reclassify xtrata.xyz, and tell me which vendor feed Secure Net uses for this domain so I can
> chase it if it is still stale? Thanks, Jim
