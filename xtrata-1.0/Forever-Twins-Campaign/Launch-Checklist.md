# Launch Checklist

Live-campaign push checklist. Treat unchecked items as blockers for broad publication.

## Immediate Fixes

| Task | Owner | Status | Dependency | Done Criteria |
|---|---|---|---|---|
| Confirm public promo wording: first 87 free, then 3 STX | Rapha / Fak.fun | TBC | Live contract or Fak.fun docs | Promo appears consistently in all public copy |
| Confirm old promo language has been removed from active docs | Codex | Drafted | Promo confirmation | No active public docs use old promo numbers unless contract proves them |
| Confirm final campaign name | Rapha / Fak.fun | TBC | Partner signoff | One approved name used in public assets |
| Confirm exact claim URL | Rapha / Fak.fun | TBC | Live site | Claim buttons point to correct URL |
| Confirm Xtrata explorer URL format | Jim / Xtrata | Partial | Xtrata docs | Use `/inscription/{id}` for human docs and `/i/{id}` for compact references |

## Rapha Confirmations

| Task | Owner | Status | Dependency | Done Criteria |
|---|---|---|---|---|
| Confirm helper contract address | Rapha / Fak.fun | TBC | Deployed contract | Address added to `data/contracts.json` |
| Confirm claim count | Rapha / Fak.fun | TBC | Helper read-only call | Current count appears in launch posts |
| Confirm listed-token behavior | Rapha / Fak.fun | TBC | Contract/site logic | FAQ gives clear holder instruction |
| Confirm sale/transfer behavior after twin creation | Rapha / Fak.fun | TBC | Helper contract | FAQ can say what happens on transfer |
| Confirm whether both sides can ever circulate freely | Rapha / Fak.fun | TBC | Helper contract | FAQ answer is definitive |

## Contract / Verifier Confirmations

| Task | Owner | Status | Dependency | Done Criteria |
|---|---|---|---|---|
| Locate helper contract source or ABI | Codex | TBC | Repo or explorer | Script TODOs replaced with real function names |
| Confirm promo threshold read-only | Codex | TBC | Helper ABI | `get-inscription-count.mjs` can read live state |
| Confirm pair mapping read-only | Codex | TBC | Helper ABI | `verify-pepe-twin.mjs` can resolve token ID |
| Confirm canonical hash/finalization functions | Codex | TBC | Helper ABI | Verification guide includes exact calls |
| Confirm fee behavior during free promo | Rapha / Fak.fun | TBC | Contract or UI | FAQ says whether network fees still apply |

## Site / UI Confirmations

| Task | Owner | Status | Dependency | Done Criteria |
|---|---|---|---|---|
| Confirm Leather and Xverse support | Rapha / Fak.fun | TBC | Site QA | Claim guide lists supported wallets |
| Confirm token ID checker | Rapha / Fak.fun | TBC | Site QA | Verification guide links checker or marks unavailable |
| Confirm Xtrata viewer route for minted twins | Jim / Xtrata | Partial | Xtrata docs | Public copy links to working viewer |
| Confirm marketplace visibility | Rapha / Fak.fun | TBC | Marketplace integration | FAQ states marketplace caveats |

## Content To Publish This Week

| Task | Owner | Status | Dependency | Done Criteria |
|---|---|---|---|---|
| Landing page copy | Codex | Drafted | Promo/name confirmation | Ready for web implementation |
| Pain-first master X thread | Jim / Xtrata | Drafted | Claim URL | Ready to post |
| Invisible failure thread | Jim / Xtrata | Drafted | None | Ready to post |
| First 87 urgency thread | Fak.fun / Rapha | Drafted | Claim count | Ready to post |
| Hero video script | Codex | Drafted | UI capture | Ready for production |

## Community Activation

| Task | Owner | Status | Dependency | Done Criteria |
|---|---|---|---|---|
| First 87 Discord role | Rapha / Fak.fun | TBC | Claim ledger | Role name and assignment process approved |
| Holder shoutout format | Rapha / Fak.fun | Drafted | Claim ledger | Shoutouts can be posted daily |
| Leaderboard rules | Rapha / Fak.fun | TBC | Export script | Public leaderboard does not expose private info unnecessarily |
| Moderator FAQ | Rapha / Fak.fun | Drafted | FAQ approval | Mods can explain two-token model cleanly |

## Media / Outreach

| Task | Owner | Status | Dependency | Done Criteria |
|---|---|---|---|---|
| Press pitch | Jim / Xtrata | Drafted | Jim/Rapha quotes | Ready for newsletters and crypto media |
| KOL/media tracker | Jim / Xtrata | Created | Contacts | Outreach rows filled |
| Quote placeholders filled | Jim / Rapha | TBC | Partner approval | Press copy has approved quotes |

## Founder Outreach

| Task | Owner | Status | Dependency | Done Criteria |
|---|---|---|---|---|
| Founder sequence approved | Jim / Xtrata | Drafted | Commercial model | Ready for Stacks-first outreach |
| Free permanence audit approved | Jim / Rapha | TBC | Service capacity | Outreach can include offer |
| Prospect tracker filled | Jim / Xtrata | Created | Research | 10-20 internal targets listed |

## Post-Claim / Case Study

| Task | Owner | Status | Dependency | Done Criteria |
|---|---|---|---|---|
| Claims ledger maintained | Rapha / Fak.fun | Created | Export path | First 87 data captured |
| Case study screenshots collected | Jim / Rapha | TBC | Claims and UI | Publish doc has real proof |
| Finalization event scheduled | Jim / Rapha | TBC | Manifest/finalization plan | Runbook has date and operator |

## Done Criteria

- Public FAQ has no unresolved critical TBCs.
- Claim URL, promo, wallet support, and transfer/listing behavior are confirmed.
- Verification guide includes real explorer links and read-only functions.
- Source claim register marks every hard stat as sourced or not public.
- Launch threads and landing copy use first 87, unless contract proves otherwise.
