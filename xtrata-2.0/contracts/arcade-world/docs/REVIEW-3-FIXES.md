# Third independent review: what was changed, and what was decided not to change (24 Oct 2026)

Two fresh reviewers read `xtrata-screen-v1` and `xtrata-games-v1` (written after the earlier world-v2 reviews). No critical findings; no way to steal or strand buyer funds. Jim chose which hardening to build before the immutable mainnet deploy.

## Built

| Finding | Change | Tests |
|---|---|---|
| Screen M1: a price rise between click and confirmation would be charged | `buy-slot` takes a final `max-price`; a price above it returns `err u415` and takes nothing | `tests/screen-hardening.test.mjs` H1 |
| Screen M2: buy and cancel are cheap spam and bump the version every hall re-reads | `buy-slot`, `cancel`, `reject`, `sweep` and `settle` report the version but do not move it (private `quiet`); posting, approving, hiding, retiring and settings still do | H2 |
| Screen L1: a whole day was charged one block after approval | Paid runs are earned per block: earned = price x blocks run / blocks bought, rounded down; the rounding goes to the buyer and earned + unearned = price | H3, `screen*.test.mjs` updated |
| Screen/Games L2, F8: no way to cancel a pending admin hand-over | `cancel-admin-proposal` on both contracts | H4, `games.test.mjs` |
| Games F4: a new id could be confused with a built-in game's extra score boards | An id may not BEGIN with a built-in id (exact match included). `ops/games-check.mjs` says the same | `games.test.mjs` |
| Games F7/F10: a typo could be locked in; pending admin not readable | `lock-delay (expected)` must equal the current delay; `get-pending-admin` read | `games.test.mjs` |
| Hall: testnet wallets were refused by the replay wallet check | `pilotFor` accepts `ST`/`SN` as well as `SP`/`SM` (same key bytes). No effect on mainnet | `hall-*` suites |

The canary's `lock-delay` call passes the launch delay, the pins are refreshed, and the testnet mock test's expectations were brought up to date (SIP-009 trait deploy first; `boards26` and `testgames`).

## Decided not to build (Jim, 24 Oct)

- **Guardian key / multisig for the games admin (F1).** One admin only. Jim will move the arcade and casino owner addresses to a Ledger device later; the admin role can be handed over with `propose-admin` / `accept-admin` at any time. Until then the protections against a stolen key are the one-day delay and `set-hidden`, and a thief with the key can also take the admin role.
- **A floor on the delay (F2).** No contract floor. Jim, 29 Oct 2026: mainnet launches with a 1-hour wait for new games (6 burn blocks) and locks it straight away (`set-delay 6`, then `lock-delay 6`; the canary refuses to continue if the delay is not the launch value). Testnet uses 6 and leaves it unlocked. The wait is the window to notice a bad add; `set-hidden` is the kill switch. The mainnet launch is now 30 signatures.
- **Freezing the hall's objects before running a cartridge (F3).** Not built, pending Jim's confirmation (his reply to that item referred to keys, which it does not involve). Cartridges run in the hall's page and are trusted as long as the admin key is.
- **Buyer "stop my run" and a sweep for STX sent to the contract by mistake (screen L2, L3).** Skipped for now: more code in the contract that holds money.
- Not changed: free review-lane items have no sweep (L4); a picture is bound to its creator, not its owner (L5); the hall does not read the games successor pointer (F7); the hard-wired core in both contracts (F6).

## Known limits to remember

- Slots and ids in the games contract are permanent (64 at most).
- A day in the screen contract is 144 burn blocks, not 24 hours.
- `head` and `body` of a screen item are free text; the hall must render them as text.
