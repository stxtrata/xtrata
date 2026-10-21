# Reputation and abuse: ongoing admin runbook

Read `REPUTATION-INCIDENT-2026-10.md` first for background. This file is the recurring checklist.

## Weekly check (about 10 minutes, also run by the weekly scheduled task)

1. VirusTotal: open https://www.virustotal.com/gui/domain/xtrata.xyz. Click Reanalyze. Expect "No security
   vendors flagged this domain as malicious". Note any vendor that is not Clean.
2. Sandbox headers (from any terminal):
   ```bash
   curl -sI https://xtrata.xyz/i/3111 | grep -i x-xtrata-content-isolation        # exempt
   curl -sI https://xtrata.xyz/i/3094 | grep -iE "content-security-policy|x-xtrata-content-isolation"   # sandboxed
   ```
   If the sandboxed one has no `content-security-policy: sandbox`, the `INSCRIPTION_SANDBOX` secret was lost
   or a deploy dropped it.
3. Published files: `https://xtrata.xyz/abuse` and `https://xtrata.xyz/.well-known/security.txt` return 200.
4. Inbox: search `jimdotbtc@gmail.com` for replies from Webroot (`notify@bcti.opentext.com`), Forcepoint
   (`suggest@forcepoint.com`), alphaMountain (`alphamountain.freshdesk.com`) and any abuse reports sent
   through X DMs to @XtrataLayers.

## If a vendor flags the domain again

1. Note the vendor, verdict and category from VirusTotal.
2. Check for a cause before requesting a review: open the most recently inscribed HTML and SVG tokens
   (`/i/<id>`) and look for phishing forms, seed-phrase prompts or redirects. Until the blocklist exists
   (`STEP-4` plan), the fast action is to add the token to a Cloudflare WAF custom rule for that path.
3. Submit a re-review with the vendor. Reference the earlier tickets below and say what changed
   (sandbox, abuse page, security.txt). Vendors used:
   - Webroot / BrightCloud: URL lookup and change request form. Earlier tickets 1288380 and 1288391.
   - Forcepoint: Site Lookup Tool (category and reputation). Earlier case 01086274.
   - alphaMountain: support portal at alphamountain.freshdesk.com (account under jimdotbtc@gmail.com).
     Earlier ticket 141181.
4. Re-run VirusTotal after the vendor confirms. VirusTotal can lag by a few hours to a day.
5. Only then ask Vodafone (or any ISP filter) to reclassify.

## Managing the exempt list

Exempt tokens run as xtrata.xyz when opened directly. Keep the list to Xtrata's own apps that need a wallet
or saved state on a direct link.

```bash
# set (replaces the whole list; commas or spaces both work)
echo "3111,3075,3072,394,3047" | npx wrangler pages secret put INSCRIPTION_SANDBOX_EXEMPT --project-name xtrata --env production
echo "3111,3075,3072,394,3047" | npx wrangler pages secret put INSCRIPTION_SANDBOX_EXEMPT --project-name xtrata --env preview
```

A changed secret only applies to a NEW deployment: retry the latest deployment in Cloudflare (Workers and
Pages, xtrata, Deployments) afterwards. Verify with the curl loop in the weekly check.

To switch the whole sandbox off in an emergency, delete the `INSCRIPTION_SANDBOX` secret and redeploy.

Candidates that were scanned as wallet or storage users but are not exempt (test their direct links before
adding): Arcade Hall 3076 to 3078 and 3081, Astro Blaster 3073 and 3074, X Chess versions other than 3072,
XBoard 346, 392, 393, Timeloop 3040 and 3043, Signal Runner 3094, Xtrata Boards 1075, AIBTC Bulletin Board
1068 and 1073.

## Renewals

- `public/.well-known/security.txt` expires 2027-10-20. A test (`security-contact.test.ts`) starts failing
  once the date passes, so renew it before then: change `Expires` to a date up to a year ahead.
- Add a real monitored email to security.txt and `abuse.html` when one exists (currently X DM only).

## Monitoring ideas not yet in place

- Google Search Console for xtrata.xyz (shows Safe Browsing and security issues).
- Re-scan new HTML and SVG inscriptions: the original scan script is described in the incident doc; the
  pattern list is phishing forms, seed-phrase wording, telegram or webhook exfiltration, obfuscation,
  external form posts, top-level redirects.
