# XTRATA DUELS v1 — token-stake auto-battler

Status 2026-07-16: contract + tests written and green (9/9 duels tests, full
clarinet suite 252 passed); client page built; NOT yet deployed or dropped.

## Concept

1v1 duels where players stake real Xtrata inscriptions from a free airdrop:
one FIGHTER (PFP) + one WEAPON each, **winner takes all four**. A Forever Twin
must stand in the player's corner: the entrant must hold the Xtrata twin in
the same wallet; it blesses the loadout but is **never escrowed, never at
stake**. All stats derive deterministically from on-chain inscription content
hashes; randomness is a Stacks block header hash fixed at accept time.

## Files

- `contracts/clarinet/contracts/xtrata-arcade-duels-v1.clar` — simnet variant
  (targets `.mock-xtrata-core` / `.mock-twin-helper`).
- `contracts/live/xtrata-arcade-duels-v1.clar` — mainnet variant. ONLY the 7
  `;; @principal` contract-call target lines differ from the sim variant
  (core = `SP3JN...X743X.xtrata-v3-2-3`; helpers = pepe-4ever-fakfun,
  leo-fakfun-xtrata, miami-degens-fakfun-xtrata).
- `contracts/clarinet/contracts/mock-xtrata-core.clar`, `mock-twin-helper.clar`
  — simnet stand-ins with signature-identical entry points.
- `contracts/clarinet/tests/xtrata-arcade-duels-v1.test.ts` — 9 tests incl.
  full lifecycle, JS<->Clarity stat parity, twin custody rules, targeted
  duels, cancel/timeout, admin gating.
- `public/duels/index.html` — single-file client at xtrata.xyz/duels/
  (armory cards, twin verification, challenge board, deterministic fight
  replay with on-chain parity check). Set `CONFIG.duelsContract` after deploy.

## Stat formula (parity-locked, do not change one side only)

```
base    = u16be(fighter-hash[0..2]) % 100        // 0..99
weapon  = u16be(weapon-hash[0..2]) % 60          // 0..59
twin    = u16be(twin-hash[0..2]) % 40            // 0..39
synergy = 20 if (fighter-hash[3] ^ weapon-hash[3]) % 4 == 0 else 0
luck    = u16be(sha256(seed || side)[0..2]) % 120 // 0..119
total   = base + weapon + twin + synergy + luck
seed    = sha256(id-header-hash(seed-height) || consensus-buff(duel-id))
side    = 0x01 challenger, 0x02 acceptor; tie byte 0x03 (even => challenger)
```

Max stats 219 vs max luck 119: strong loadouts usually win, big mismatches
always win, mid-range fights stay spicy. Twin hashes come from the helper
binding tuple, fighter/weapon hashes from `get-inscription-hash` on the core.

## Duel lifecycle

challenge(fighter, weapon, twin-collection, twin-local-id, opponent?) ->
escrows both tokens, twin verified+snapshotted. accept(...) -> escrows the
acceptor's pair, records seed-height = next block. resolve(duel-id) -> anyone,
after the seed block exists; computes totals, pays ALL FOUR tokens to the
winner. cancel(duel-id) -> challenger anytime while open; anyone after
open-ttl (default 1008 blocks) sweeps the stake back to the challenger.

## Custody notes

- Twins that are still escrowed with the helper (player holds the ORIGINAL
  Pepe/Leo/Degen) do NOT qualify in v1 — the player must swap the original in
  to hold the Xtrata twin. This drives Forever Twin engagement; supporting
  original-holders directly is a possible v1.1 (needs source-contract
  get-owner calls).
- The duels contract holds escrow; `transfer` on the core requires
  tx-sender==sender, satisfied via as-contract for payouts.

## Distribution: claim, not airdrop (xtrata-duels-claims-v1)

No airdrop transactions. A second small contract holds the drop pools and
deals them out one claim per Forever Twin:

- Owner inscribes fighters + weapons to their own wallet, then
  `deposit-fighters` / `deposit-weapons` (batches of <=100 ids; the call
  transfers the tokens into the contract so pool state always matches
  custody), then `set-claims-open true`.
- `claim(twin-collection, twin-local-id)`: claimer must HOLD the Xtrata twin
  (same liquidity rule as the arena). One claim per twin FOREVER, keyed by
  (collection, local-id) - trading the twin does not reset it. The contract
  deals one random fighter + one random weapon (block-hash seed mixed with
  twin id; swap-with-last keeps pools dense; no duplicates possible).
- You get what you get. Everything is tradable afterwards.
- `withdraw-remaining` recovers undealt tokens, but ONLY while claims are
  closed, and it is a decommissioning action (it does not rewrite the pool
  index - do not reopen claims after withdrawing).

Files: `contracts/clarinet/contracts/xtrata-duels-claims-v1.clar` (sim),
`contracts/live/xtrata-duels-claims-v1.clar` (mainnet; 6 `;; @principal`
lines differ), tests in `tests/xtrata-duels-claims-v1.test.ts` (7 tests:
deal + record, twin-follows-claim, custody/binding gates, open flag,
no-duplicate deals, pool exhaustion, admin gating).

## Launch runbook

1. Generate + inscribe the two free drop collections on xtrata-v3-2-3
   (fighters, weapons) to the deployer wallet. Record the id ranges.
2. Deploy `contracts/live/xtrata-duels-claims-v1.clar` and
   `contracts/live/xtrata-arcade-duels-v1.clar` (deployer = owner of both).
3. Deposit the pools: `deposit-fighters` / `deposit-weapons` in <=100-id
   batches, then `set-claims-open true`.
4. On the duels contract, call `set-eligible-ranges` with the fighter range
   (role u0) and weapon range (role u1).
5. Set `CONFIG.duelsContract` + `CONFIG.claimsContract` in
   `public/duels/index.html`; deploy site (live at /duels/).
6. Smoke on mainnet with two wallets: verify twin -> claim -> armory shows
   the dealt pair -> challenge -> accept -> resolve -> custody + Watch Fight
   parity banner shows no mismatch.

## Known v1 limits / follow-ups

- Board scans duels by id (last 200) via call-read; fine for launch, index
  via print events later.
- Client wallet flow uses @stacks/connect from CDN; align with the site's
  Xverse BitcoinProvider-first connect module if quirks appear.
- Stance commit-reveal (rock-paper-scissors layer), original-NFT twin
  custody, seasonal leaderboards (plug into xtrata-arcade-scores-v1-3) are
  natural v1.1+.
