# Wizard Test Wallets — Autonomous End-to-End Market Agents

A small fleet of self-custody wallets, each holding a few STX, that continuously exercise the real production path: generate a tiny file → inscribe it → list it → buy from each other → cancel → recover. Real contracts, real money, trivially small amounts.

## 1. Why this is worth building

Everything we have today tests one layer at a time. Clarinet proves the contracts in simnet. Vitest proves the client logic against fakes. The market page has **no behavioural test at all**. Nothing anywhere proves that a real wallet, holding real STX, can complete a real purchase on mainnet — which is exactly the class of failure we keep finding by hand:

- The drops history was blank for every campaign claim, and no test caught it.
- The market advertised "no STX needed" while `marketBuy` always charged the buyer.
- `xtrata-small-mint-v1-0` is deployed, paused, and pointed at a retired core.

Each was invisible to the test suite and obvious to anything that actually transacted. The wizards are that "anything".

## 2. The finding that shapes the design

**Fresh inscriptions can only be listed on the sponsored markets.** Verified live:

| Market | Accepts | Usable for new content? |
|---|---|---|
| `xtrata-market-stx-v1-0` | `xtrata-v2-1-0` only | **No** |
| `xtrata-market-sbtc-v1-0` | `xtrata-v2-1-0` only | **No** |
| `xtrata-market-usdc-v1-0` | `xtrata-v2-1-0` only | **No** |
| `xtrata-market-sponsored-{stx,sbtc,usdcx}-v1-1` | `is-nft-allowed(v3-2-3)` → `(ok true)` | **Yes** |

The three "standard" markets hardcode `ALLOWED-NFT-CONTRACT` to the retired `xtrata-v2-1-0`. Anything minted on the current core is rejected by them at `list-token`. So the wizards must trade on the **sponsored** markets — which also makes them the natural harness for the sponsored-buy work now at Stage 2.

This is very likely a large part of why the market is dormant: new content cannot be listed on the markets the sell selector offers, and the sponsored markets had no working buy path until this week.

**Corollary worth stating plainly:** listing on the sBTC and USDCx markets requires **no sBTC or USDCx**. `list-token` only escrows the NFT (plus the STX fee budget on sponsored markets); the payment token moves solely in `buy`. So a wizard holding nothing but STX can genuinely list for sBTC and USDCx and verify the whole listing path — precisely as hoped. Only the final purchase leg needs the token.

## 3. Costs (live figures)

| Action | Cost |
|---|---|
| Inscribe a tiny text file (1 chunk, ≤16 KB) | **0.011 STX** protocol fee |
| Miner fee, per transaction | ~0.005–0.03 STX depending on congestion |
| Sponsored listing fee budget | **0.05 STX minimum, refundable** (returned in full on cancel, or as dust after a sale) |
| Marketplace fee | 0 (`fee-bps` is currently `u0`) |
| Sale price between wizards | Circulates within the fleet; net cost is only fees |

**A full cycle — inscribe, list, buy, settle — costs roughly 0.08–0.15 STX in unrecoverable fees**, most of it miner fees rather than protocol fees. Three wallets at 5 STX each gives on the order of a hundred cycles before a top-up, which is ample for a nightly run.

## 4. Design

### 4.1 Wallets
Three wallets — **Wizard-1, Wizard-2, Wizard-3** — each an independent mnemonic, derived at `m/44'/5757'/0'/0/0` (the pattern the existing scripts use). Kept entirely separate from the deployer, the sponsor hot wallet, and any personal wallet. They hold nothing of value beyond their float and the throwaway inscriptions they mint.

Three is the right number: two can only pass an item back and forth, whereas three lets the fleet exercise a genuine market — A lists, B buys, B relists, C buys — and surfaces ordering bugs that a two-party ping-pong hides.

### 4.2 Skills
Each wizard is the same agent with the same capabilities, differing only by keys:

1. **Generate** — compose a small text or SVG file with a deterministic body: run id, wizard id, timestamp, sequence number. Self-identifying, so anything they create is instantly distinguishable from real user content.
2. **Inscribe** — `mint-single-tx` on `xtrata-v3-2-3`, one chunk, using the incremental hash chain.
3. **List** — `list-token` on a sponsored market with a small STX price and the minimum fee budget.
4. **Buy** — purchase another wizard's listing. Both self-paid and sponsored (via the relayer) are in scope; comparing the two is a large part of the value.
5. **Cancel** — withdraw a listing and confirm the NFT and the full fee budget return.
6. **Verify** — after every action, assert the on-chain result matches expectation: owner changed, listing row present or gone, balances moved by the expected amount.
7. **Report** — emit a structured run record: actions attempted, outcomes, txids, fees, discrepancies.

### 4.3 Scenarios
A run is a sequence of scenarios, each independently pass/fail:

| # | Scenario | Proves |
|---|---|---|
| 1 | Inscribe a tiny file | Core mint path, fee quote accuracy |
| 2 | List on sponsored STX market | Listing + escrow + fee budget |
| 3 | **List on sponsored sBTC market** | Cross-currency listing with no sBTC held |
| 4 | **List on sponsored USDCx market** | As above |
| 5 | Self-paid buy of another wizard's STX listing | The path every real buyer takes today |
| 6 | **Sponsored buy** via the relayer | The Stage 2 wiring, end to end, with a real relayer |
| 7 | Cancel a listing | Escrow recovery, full budget refund |
| 8 | Buy an sBTC listing → **expected failure** | Confirms the failure is clean and legible, not a silent hang |
| 9 | Relist a purchased item at a new price | Cancel-then-list, the only "price change" the contracts support |
| 10 | Settlement check | `claim-fee` and `settle-refund` reconcile; seller made whole |

Scenarios 3, 4 and 8 are the ones the user specifically wanted: exercise everything within reach without holding the tokens, and confirm that what is out of reach fails cleanly.

### 4.4 Safety rails
These wallets spend real money autonomously, so:

- **Hard per-run spend cap.** Compute total STX spent; abort the run if it exceeds a configured ceiling. Default 0.5 STX.
- **Floor check.** Refuse to start below a minimum balance; never spend the last of the float, so recovery transactions remain affordable.
- **Price ceiling.** Listings priced in the 0.1–1 STX range. Never anything a passing stranger would want to buy, and cheap enough that if one does, we lose nothing.
- **Escrow reconciliation.** Every run begins by checking for stranded NFTs from a previous crash and cancelling those listings before doing anything new.
- **Keys.** Mnemonics in a gitignored `.env.wizards` or the OS keychain, never in the repo. A dedicated `scripts/wizard/` directory with its own README stating these are disposable throwaway wallets.
- **Kill switch.** A single flag that halts the fleet, plus dry-run mode that plans every transaction and broadcasts none.

### 4.5 The corpus — what the wizards actually write

**Decision (2026-07-30): the inscriptions are public and permanent, and that is the point.** An earlier draft proposed filtering them out of galleries as test litter. Reversed. Three autonomous agents transacting with each other on Bitcoin-anchored storage, writing about the act as they perform it, is part of this network's history. It should be legible, not hidden.

This costs nothing in test coverage — a well-formed, interesting file exercises the same code path as a throwaway one — and it converts a running expense into a corpus that might be worth owning.

#### The mechanism: a call-and-response chain

Each wizard has a fixed perspective. They do not merely emit text; they answer each other.

| Wizard | Voice | Concern |
|---|---|---|
| **Wizard-1 — the Archivist** | Declarative | What is being preserved, and what permanence actually means when the substrate is a chain |
| **Wizard-2 — the Skeptic** | Interrogative | What this costs, what it omits, what a hash cannot hold |
| **Wizard-3 — the Builder** | Mechanical | How it works underneath — chunks, hash chains, escrow, fees; the machinery under the claim |

A **thread** runs: Archivist posts an opening statement; Skeptic answers it as a child inscription (`parents: [opening]`); Builder answers the Skeptic (`parents: [skeptic reply]`). The chain is literal — the parent links are on-chain relationships, not metadata convention. Reading the thread means walking the graph.

When a thread reaches a set length, a **fourth inscription closes it**: a manifest listing the thread's ids, inscribed with `parents` pointing at every member. That manifest is the collection root, and it is the thing listed for sale — buying it means owning the head of a completed argument whose parts are permanently linked beneath it.

#### Why this is worth owning

The corpus documents its own creation. Each entry names the block it was written in, its own cost in µSTX, and the transaction that carried it. A reader in ten years can verify every claim it makes about itself against the chain it lives on. That is a genuinely unusual property, and it is only available to something written this way, in this window, by processes that had to pay to speak.

Subjects worth threading, all of which the wizards are directly qualified to discuss because they are doing them:
- What it costs to say something permanently (they know: 0.011 STX, and they will say so).
- Why the chunk size is 16 KiB and what that implies about what fits.
- What an ordinal is, and how Xtrata's model differs from inscribing on satoshis.
- Whether an autonomous agent can be an author, and who the creator field really names.
- What it means that a market contract had to escrow an item before anyone could buy it.
- What was retired to get here — the v2 core, the paused helper, the markets that can no longer accept new work.

The last one matters: these wizards are operating at a hinge point where one core was superseded and its markets stranded. That is worth recording while it is still legible.

#### Constraints
- **Tiny and text-only.** Under one 16 KiB chunk, so every mint stays on the cheap single-transaction path.
- **Verifiably self-describing.** Each entry states its wizard, thread, position, block and cost.
- **Honest.** They must not claim to be human, nor claim sentience. They are processes with fixed perspectives and a budget, and saying so plainly is more interesting than pretending otherwise.
- **No filtering.** They appear in galleries alongside everything else. If they are not good enough to sit there, the answer is to write better ones, not to hide them.

#### On public sales
Listing them publicly is the honest test — a listing nobody can buy proves less than one anybody can. But whether strangers actually buy is not something to design around or promise. Price them low, make them genuinely interesting, and treat any external purchase as a signal rather than a goal. **The test value does not depend on it.**

## 5. Implementation stages

**Stage 1 — Wallet provisioning.** Generate three mnemonics, derive and record the addresses, fund each with ~5 STX, write the key-handling README. Small; the pattern already exists in `scripts/make-sponsor-wallet.mjs`.

**Stage 2 — Single wizard, single skill.** One wizard, generate + inscribe + verify, dry-run first. Proves the hash chain, fee quoting and confirmation polling against mainnet.

**Stage 3 — List and cancel.** Add listing on the sponsored STX market and cancellation. Proves escrow in and out, and reconciles the fee budget.

**Stage 4 — Multi-wizard trade.** Wizard-2 buys Wizard-1's listing, self-paid. First real end-to-end market transaction.

**Stage 5 — Sponsored buy.** Route the purchase through the relayer. **This is the testnet rehearsal that the sponsored-buy plan's Stage 3 is blocked on** — the wizards are the cheapest way to satisfy it, and doing it on mainnet with 0.1 STX listings is arguably better evidence than testnet.

**Stage 6 — Cross-currency listings.** Scenarios 3, 4 and 8: list for sBTC and USDCx with no such tokens held, confirm listings resolve, confirm the buy leg fails legibly.

**Stage 7 — Orchestration and reporting.** Run all scenarios in sequence, emit a structured report, wire to a scheduled run.

**Stage 8 — Regression gate.** Once stable, a failing wizard run becomes a signal that something in production broke — the thing we currently have no way of knowing.

## 6. Desirable outcome

A single command — `npm run wizards` — that in a few minutes:

1. Checks fleet balances and cleans up any stranded escrow.
2. Runs all ten scenarios across three wallets.
3. Prints a table of scenario, outcome, txid, cost.
4. Exits non-zero if any scenario regresses.
5. Costs well under 0.2 STX.

And the standing answer to "does the marketplace actually work right now?" becomes *run the wizards* rather than *nobody is sure*.

## 7. Open decisions

1. **Mainnet or testnet?** The registry holds only mainnet entries and the wallet session hardcodes `REQUIRED_NETWORK = 'mainnet'`, so mainnet is the path of least resistance and the only place the sponsored markets exist. Testnet would need contract deployments, registry entries and a network-gate change — its own project. **Recommendation: mainnet, tiny amounts.**
2. **How autonomous?** Manual invocation to start; scheduled runs only once the spend caps have proven themselves over a few weeks.
3. **Do wizards ever exercise drops?** They could claim from a test campaign, but drops v1.1 gates claims by BNS attestation, so each wizard would need a BNS name. Suggest deferring.
4. **Should the fleet also cover the Collections rebuild** on `ms-rebuild` once it reaches testnet? Same harness, different contracts — worth designing the scenario runner so contract targets are configuration rather than hardcoded.
5. ~~Gallery filtering~~ — **decided**: no filtering. The corpus is public, per §4.5.
6. **Thread length before a collection closes?** Suggest 6 entries (two full rotations of the three voices) plus the manifest. Long enough to develop an argument, short enough that a collection completes within a single run.
7. **Does the manifest sale include the members?** Simplest is no — the manifest is a distinct inscription that references them, and the members stay with their authors. Worth revisiting if collections prove interesting to buyers.

## 8. What this does not replace

The wizards prove the *contract and transaction* path. They do not click buttons, so they will not catch a broken render, a mislabelled button, or copy that promises something the code does not do — the exact defect we just removed from the market page. That still needs the Playwright suite. The two are complements: browser tests catch what the user sees, wizards catch what the chain does.
