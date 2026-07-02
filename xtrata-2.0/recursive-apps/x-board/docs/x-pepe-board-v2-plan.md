# Bitcoin Pepe Twins Board — v2 Plan

**Auction → lifetime ownership → rental delegation, with operator fees.**

This supersedes the free-claim economics of v1 while keeping the same board
(329 mixed-size squares), the same Pepe gating principle, and the same Xtrata
inscription rendering. v1 stays as a simple baseline; v2 is a new contract
(`xpepe-board-v2.clar`) and a new app (`x-pepe-board-v2.html`).

## What changes

Instead of claiming an open square for free, a Pepe holder **wins** a square in a
one-week auction. The winner owns it **for life** and can then **rent it out**:
sell timed, delegated control to any wallet, who during the rental may display
**any** inscription they like (Pepe gating is waived for renters). The operator
earns a cut of every rental and a flat **0.1 STX** fee each time the displayed
inscription reference is changed.

## Per-slot lifecycle (state machine)

Each of the 329 slots moves through these phases independently:

```
  AUCTION ──(settle, has bids)──► OWNED ──(list)──► LISTED ──(rent)──► RENTED
     │                              ▲   ▲                                 │
     └──(settle, no bids)──► OPEN ──┘   └─────────(rental expires)────────┘
```

- **AUCTION** — bids accepted until the slot's auction end height.
- **OPEN** — auction closed with no bids; can be re-opened by the operator.
- **OWNED** — a Pepe holder owns it for life; displays one of their Pepes.
- **LISTED** — owner has published a rental offer (price + duration).
- **RENTED** — a renter holds delegated display control until expiry; can show
  any inscription. On expiry it reverts to OWNED and the owner's display.

## Auction design

The cleanest model is **per-slot rolling auctions** rather than one global
board-wide window: each slot has its own `auction-end` height, the operator can
open auctions in waves, and a quiet slot doesn't hold up the rest. (A single
global one-week launch window is the alternative — see *Decisions needed*.)

Mechanics:

- **Eligibility** — only wallets holding a Pepe twin may bid (same on-chain
  ownership check as v1; the bid records which Pepe will display on win).
- **Escrow** — each bid transfers STX into the contract. The current high bid is
  held; when outbid, the prior bidder's escrow is immediately refundable (pull
  pattern) or auto-refunded (push). Pull is safer against failed transfers.
- **Minimum + increment** — `MIN-BID` (e.g. 0.1 STX) and a `MIN-INCREMENT-BPS`
  (e.g. +5%) over the standing high bid.
- **Anti-snipe** — a bid within the last `SNIPE-WINDOW` blocks extends
  `auction-end` by `SNIPE-EXTENSION`, so auctions can't be stolen at the buzzer.
- **Settlement** — after `auction-end`, anyone can call `settle`. The high bid is
  paid out (see *proceeds*), the winner is written as lifetime owner with their
  chosen Pepe as the initial display, and losing escrows become withdrawable.
- **Proceeds destination** — winning bid goes to the operator treasury by
  default (a `DECISION`: treasury vs split with a community/burn address).

The one-week duration is `AUCTION-DURATION` (blocks ≈ 7 days; Stacks ≈ 144
blocks/day → ~1008 blocks). Time is measured in `stacks-block-height` (or
`burn-block-height` for wall-clock robustness — a `DECISION`).

## Lifetime ownership

The winner owns the slot permanently. Recommended: make ownership a **SIP-009
NFT** (one token per slot id) so it is transferable and tradeable on Stacks
marketplaces — "own the square for life" becomes a real, liquid asset, and
secondary sales need no bespoke code. Ownership confers the right to set the
display (subject to the update fee) and to create rentals. (If you'd rather keep
ownership non-transferable, we drop the SIP-009 surface — a `DECISION`.)

Note: lifetime owners must still display a **Pepe** they own when *they* control
the slot. Renters are the only parties allowed to display arbitrary inscriptions.

## Rental delegation

The owner publishes a rental **listing**: a price and a duration (in blocks).
A renter calls `rent`, paying the price; the contract splits it
`operator-cut` / `owner-remainder` and records an active rental with
`rental-end = now + duration`. While the rental is active:

- the **renter** controls the display and may set **any** inscription id
  (no Pepe gating) — each change still costs the 0.1 STX update fee;
- the owner cannot change the display (but retains ownership and can queue what
  shows after expiry);
- on expiry the slot reverts to OWNED and the owner's last Pepe display, with no
  on-chain action required (the display resolver simply ignores expired rentals;
  a permissionless `expire` can also clear state for tidiness).

Concurrency: **one active rental per slot at a time** to start (simplest, safe).
A forward-booking calendar is a possible later extension but adds real
complexity (overlap checks, cancellations, refunds) — out of scope for v2.

Operator cut: `RENTAL-FEE-BPS` (e.g. 500 = 5%) taken from each rental payment.
The exact percentage is a `DECISION`.

## Update fee (0.1 STX)

Every time the controlling party changes the displayed inscription reference,
the contract charges `UPDATE-FEE = u100000` (0.1 STX) to the operator treasury.
Applies to both the lifetime owner and an active renter. Recommended: the
**initial** display set at auction settlement (owner) and at rent time (renter)
is free; only subsequent `update-display` calls pay the fee. (Whether the first
renter display is free is a small `DECISION`.)

## Display resolver (what actually shows)

Priority, evaluated by both the contract read and the front-end:

1. **Active rental** display (`rental-end > now`) — renter's chosen inscription.
2. **Owner** display — the owner's Pepe.
3. **Auction/open** placeholder — board art / "bidding open".

## Contract data model (`xpepe-board-v2.clar`)

```
;; vars
admin / treasury principal, paused bool, counters
fee constants: MIN-BID, MIN-INCREMENT-BPS, AUCTION-DURATION,
               SNIPE-WINDOW, SNIPE-EXTENSION, RENTAL-FEE-BPS,
               UPDATE-FEE (u100000)

;; maps
auctions   slot-id -> { high-bid, high-bidder, bidder-pepe, end-height, settled }
escrow     { slot-id, bidder } -> uint            ;; refundable losing bids
owners     slot-id -> { owner, pepe-id }          ;; lifetime owner + Pepe display
listings   slot-id -> { price, duration, active } ;; rental offer
rentals    slot-id -> { renter, display-id, end-height }
pepe-allow inscription-id -> bool                 ;; admitted Pepe twins
;; (SIP-009 NFT 'pepe-slot' if ownership is tokenized)
```

Public API (direct-wallet calls only):

| Function | Who | Effect |
|---|---|---|
| `open-auction (slot dur)` | admin | start/extend a slot auction |
| `place-bid (slot pepe-id)` | Pepe holder | escrow STX, become high bid (+anti-snipe) |
| `withdraw-bid (slot)` | outbid bidder | reclaim escrow |
| `settle (slot)` | anyone | pay winner→treasury, assign lifetime owner |
| `update-display (slot insc)` | owner or active renter | set display, charge 0.1 STX |
| `list-rental (slot price dur)` | owner | publish/replace rental offer |
| `unlist-rental (slot)` | owner | remove offer |
| `rent (slot)` | anyone | pay, split fee, start active rental |
| `expire (slot)` | anyone | clear an expired rental |
| `transfer (slot to)` | owner | SIP-009 transfer (if tokenized) |
| `set-pepe / set-pepe-batch / set-paused / set-admin / set-treasury / withdraw-fees` | admin | configuration & treasury |

Reads: `get-effective-display`, `get-auction`, `get-owner`, `get-listing`,
`get-rental`, `get-stats`, `is-pepe-id`, plus a bounded paged reader for the
front-end to load all 329 slots.

## Economic flows

| Event | STX movement |
|---|---|
| Place bid | bidder → contract escrow |
| Outbid | prior bid becomes withdrawable; new bid escrowed |
| Settle | winning escrow → **treasury** (or split); losing escrows withdrawable |
| Update display | controller → **treasury** (0.1 STX) |
| Rent | renter → split: `RENTAL-FEE-BPS` to **treasury**, remainder to **owner** |
| Secondary sale (if NFT) | handled by marketplace; no contract STX logic |

Every successful claim/bid/rental/update prints a structured event for the
indexer and the board UI.

## Security properties

Direct-wallet guard on all mutations (`tx-sender == contract-caller`); pull-based
refunds so a single failed transfer can't brick settlement; escrow accounting
kept separate from treasury fees; deny-mode post-conditions sized exactly to each
call in the client; no display control for expired rentals; no double-settle;
rental cut + remainder must equal the rental price (no rounding leakage — round
the fee down, owner gets the rest); pause blocks bids/rentals/updates but never
blocks escrow withdrawal or fee withdrawal.

## Front-end (`x-pepe-board-v2.html`)

A fresh standalone file building on v1's renderer, with a per-slot panel that
adapts to the slot's phase:

- **Auction** — live countdown to `auction-end`, current high bid + bidder,
  "Place bid" (choose your Pepe, set amount ≥ min), your active/refundable bids.
- **Open** — "no winner — awaiting re-auction".
- **Owned (yours)** — change Pepe display (0.1 STX), "List for rent" (price +
  duration), transfer (if NFT).
- **Owned (someone else's)** — owner + current display; "Rent this square" if a
  listing exists.
- **Rented** — renter, time remaining, and (if you're the renter) "Set display
  to any inscription" with the 0.1 STX update fee shown.

A board-wide header surfaces total volume, active auctions, rentals live, and
fees accrued. The same demo/explore mode lets you walk every phase before the
contract is deployed.

## Decisions (locked)

1. **Lifetime ownership = transferable SIP-009 NFT** — one `pepe-slot` token per
   slot id, resellable on Stacks marketplaces.
2. **Auction scope = per-slot rolling** — each square has its own 1-week window;
   the operator opens them in waves.
3. **Winning-bid proceeds = split** — settlement divides the winning bid between
   the operator treasury and a second recipient. *Still to confirm:* the split
   ratio and the second address (community / creator / burn).
4. **Operator rental cut = 2.5%** — `RENTAL-FEE-BPS = u250`.
5. **Update fee = 0.1 STX** (`UPDATE-FEE = u100000`) on every `update-display`
   by owner or active renter; the first display set at win/rent is free.
6. **Rental concurrency = single active rental** per slot in v2; calendar
   bookings are a later extension.

### Still to confirm before coding

- Bid-proceeds **split ratio** and the **second recipient address**.
- Auction params: **min bid**, **min increment %**, **anti-snipe** window +
  extension, and **time base** (Stacks block height vs burn-block height).

## Build sequence (once decisions land)

1. Write `xpepe-board-v2.clar` with the data model above; Clarinet suite covering
   bid/outbid/refund, anti-snipe extension, settlement payout, rental split
   rounding, update-fee accounting, expiry, direct-call guard, and (if tokenized)
   SIP-009 transfer.
2. Build `x-pepe-board-v2.html` with the phase-aware panel and the display
   resolver, packaging bid/settle/rent/update wallet calls with exact
   post-conditions.
3. Testnet sessions across Leather + Xverse: holder/non-holder bidding, sniping,
   settlement, rentals by non-holders, arbitrary-inscription renter display,
   update-fee charges, expiry revert.
4. Independent contract review, then mainnet — matching the main board's gate.
