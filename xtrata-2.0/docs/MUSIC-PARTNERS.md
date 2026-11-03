# Music referral partners: onboarding runbook

One wizard serves every partner. A partner is an entry in `public/music-partners.json`: a short name (slug) and a
payout address. Their link is `https://xtrata.xyz/music/?ref=<slug>` (short form `/m/<slug>`). When a referred
inscription completes, the partner's share of the wizard's 10% fee is sent to their address with the memo
`xtrata-ref:<slug>`. The price the user pays does not change.

## Standard terms and negotiated deals

| | Standard | Negotiated (e.g. fak.fun) |
|---|---|---|
| Share of the wizard fee | 25% (when the entry has no `share`) | written into the entry, e.g. `"share": 0.5` |
| Self-referral rebate | off (when the entry has no `selfReferral`) | written into the entry, `"selfReferral": true` |
| Minimum payout | 0.01 STX; below it Xtrata keeps the amount | `minPayoutUstx` |

Anything better than standard has to be written into the entry, so the file itself always shows who has what deal.
"Self-referral off" means a partner paying through their own link with their own wallet is paid like any other
referral (no rebate as change). It cannot stop a partner using a second wallet; it only means we do not build a
discount mechanism for it.

## Adding a partner (one at a time)

1. Get the payout address from the partner and **confirm it in a second channel** (a different app from the one it
   arrived in). A wrong address loses their money and we cannot recover it.
2. Run:
   ```
   npx vite-node scripts/music-partner.ts add <slug> "<Name>" <SP address>                     # standard terms
   npx vite-node scripts/music-partner.ts add fak-fun "fak.fun" <SP address> --share 0.5 --self-referral   # a deal
   ```
   It refuses: reserved names (`xtrata`, `admin`, ...), look-alikes of a reserved name or an existing partner
   (`fakfun`, `f4k-fun`), invalid or testnet addresses, the Xtrata fee address, and an address already in use.
3. Check `npx vite-node scripts/music-partner.ts list`, review the diff, open a pull request containing only the
   registry change. Merge and deploy (Cloudflare Pages). The wizard reads the registry at runtime, so no bundle
   rebuild is needed.
4. Send the partner their link and test it once with `?mock=1` (`/music/?mock=1&ref=<slug>` shows the referral line
   on the receipt without spending anything).

## Pausing a partner

`npx vite-node scripts/music-partner.ts deactivate <slug>`, then PR and deploy. Links keep working for visitors but
no longer earn or show a referral. Jobs already started keep the terms they were created with.

## Checking what a partner earned

Their payments are ordinary STX transfers with the memo `xtrata-ref:<slug>` from the wizard's temporary wallets to
their address. Check that address on the explorer weekly. A job where the payout failed carries `referralOwed`
and the receipt says "to be settled by Xtrata": pay those by hand.

## Not built yet

Self-serve sign-up (connect wallet, sign, choose a name, get a link) is deliberately deferred until a few
hand-added partners have run for a while. See `claude/referral-program-status.md` in the Xtrata Music project.
