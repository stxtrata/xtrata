# Wizard test wallets

**These are disposable throwaway mainnet wallets holding small floats of real STX.**

Three of them. They generate small text files, inscribe them on the production core, list them,
buy from each other and cancel, so that the question "does the marketplace actually work right
now?" has an answer other than "nobody is sure". Every transaction they sign is real, on mainnet,
with real money, and none of it is reversible.

They hold nothing of value beyond their float and the throwaway inscriptions they mint. If a key
leaks you lose a few STX and some inscriptions, and you generate three new wallets. That is the
whole security model, and it only works if the wallets stay disposable.

Full design: [`docs/plans/WIZARD-TEST-WALLETS-PLAN.md`](../../docs/plans/WIZARD-TEST-WALLETS-PLAN.md).
Stages 1 and 2 of that plan are what lives here: provisioning, and one wizard doing
generate plus inscribe plus verify.

## Keys never go in git

- Real keys are **never written to disk by any script here**. `make-wizards.mjs` prints them once
  to stdout and forgets them.
- Put them in `scripts/wizard/.env.wizards`, which is in `.gitignore`, or in your OS keychain.
- `scripts/wizard/.env.wizards.example` is placeholders only. It is committed. Never put a real
  key in it. A test asserts it contains nothing that looks like a key or an address.
- Never reuse a personal seed, the deployer wallet, or the sponsor hot wallet for a wizard.
- Never paste a wizard key into a chat, an issue, a log line, or a screenshot.

## The three wizards

| Wizard | Voice | Concern |
|---|---|---|
| Wizard-1, the Archivist | Declarative | What is being preserved, and what permanence means when the substrate is a chain |
| Wizard-2, the Skeptic | Interrogative | What this costs, what it omits, what a hash cannot hold |
| Wizard-3, the Builder | Mechanical | Chunks, hash chains, escrow, fees, the machinery under the claim |

They do not emit filler. They answer each other. A thread runs six entries, two rotations of the
three voices, each entry citing the one before it by inscription id and by quoted fragment, and a
seventh inscription closes the thread with a manifest listing every member. Per the plan's section
4.5 the corpus is public and unfiltered: it appears in galleries alongside everything else, because
three processes transacting on Bitcoin-anchored storage and writing about the act as they perform
it is part of this network's history.

Every entry states its wizard, its thread, its position, the block it was written at and its own
cost in microSTX, so a reader in ten years can check every claim it makes about itself against the
chain it lives on.

### On "parents"

The plan describes a reply as a child inscription with `parents: [opening]`. The core's `parents`
argument means **supersession** and requires the sender to already own every parent id, which is
impossible when the parent belongs to a different wizard's wallet. So a thread link is carried
on-chain as a core **dependency** edge, via `mint-single-tx-recursive`. It is still a real on-chain
relationship that a reader walks, and it says "answers" rather than "replaces", which is the more
accurate claim anyway.

## Provisioning

**Run this before any wizard wallet is funded. It is the required first step.**

```bash
npm run wizards:provision
```

which is `node scripts/wizard/provision.mjs`.

Funding is the one irreversible step in the whole system. Everything else here is a dry run by
default, refuses without a live quote, and is bounded by a spend cap. Funding is none of those
things: STX sent to a wrong address is gone, there is no contract-level escape hatch, and a phrase
written down wrong is silent until the day the wallet is needed. So funding is gated.

Seven stages, in order, each one gated on the one before. The run halts at the first failure rather
than carrying a bad address forward:

| # | Stage | What has to hold |
|---|---|---|
| 1 | Generate | Three fresh wallets, printed once. Then a **transcription check**: for each wizard you type back two words of its phrase, by position, off the paper you just wrote. Positions are derived from a challenge seed printed alongside, so the challenge is reproducible from the report afterwards but cannot be anticipated. |
| 2 | Record | A paste-ready `.env.wizards` block with **both** keys and addresses. You save it. This script never writes that file. |
| 3 | Verify derivation | Recorded address == key-derived address == phrase-derived address, for all three. |
| 4 | Pre-funding check | All three well-formed mainnet c32, mutually distinct, **currently zero balance**, and not the deployer or the sponsor wallet. |
| 5 | Funding | Prints each address with its intended amount, then **polls** until every one arrives. Flags anything short or suspiciously large. |
| 6 | Baseline | Confirmed starting balances, chain tip and timestamp, so a later run reconciles spend against a known start. |
| 7 | Dry-run gate | Shells out to `inscribe.mjs` with no `--broadcast`. Provisioning is not complete until it passes. |

Stage 5 **never moves funds**. It prints addresses and watches balances. You send the STX yourself,
from a wallet you control. If you mistype an address into that wallet the money is gone and the only
symptom you will get is stage 5 never completing.

Stage 1 exists because a phrase transcribed wrong fails silently. Nothing detects it at generation
time, nothing detects it at funding time, and you find out when you reach for the phrase to rescue a
wallet and it restores a different one. Read the words off the paper, not off the screen.

Stage 3 is the check `.env.wizards.example` implies by printing addresses next to keys and that
nothing previously performed. It catches the paste error where a key lands under the wrong wizard:
every value is real, the file looks correct, and the address the Archivist is about to be funded at
belongs to the Skeptic's key.

Useful flags:

```bash
# every stage against injected fakes: no network, no prompts, no funds. For CI.
npm run wizards:provision -- --dry

# stage 3 alone, read-only, as a health check on a fleet provisioned months ago
npm run wizards:provision -- --verify-only

# a different float per wizard, and a shorter watch before it offers to re-poll
npm run wizards:provision -- --fund-ustx 2000000 --timeout-minutes 5 --poll-seconds 10

# write the JSON report (it contains no keys and no phrases, by assertion)
npm run wizards:provision -- --report /tmp/wizard-provisioning.json
```

The report carries per-stage status, the addresses, what arrived where, the baseline balances, the
chain tip, the timestamp and the challenge seed. It never contains a key or a phrase, and a test
asserts that against the actual generated values.

The kill switch halts provisioning the same way it halts a broadcast: provisioning ends in funding a
mainnet wallet, so it does not run while the fleet is halted.

Generating the wallets without the gate, if you know why you want that:

```bash
node scripts/wizard/make-wizards.mjs
```

Prints three fresh keys and their mainnet addresses **once**, plus a paste-ready `.env.wizards`
block, and refreshes the placeholder `.env.wizards.example`. It writes no key material anywhere. It
performs none of the seven checks above, so anything it produces still has to go through
`provision.mjs` before it is funded.

Fund each wizard with about **5 STX**, which is roughly a hundred full inscribe-list-buy-settle
cycles before a top-up. Never fund them with more than you would shrug at losing.

## Dry run

Dry run is the default. No key is read, nothing is signed, nothing is broadcast.

```bash
npm run wizards:dry
```

which is

```bash
node scripts/wizard/inscribe.mjs
```

It composes the entry, chunks it, computes the core final hash, builds the exact Clarity call, and
**quotes the fee live** from `quote-inscription-fee` on the core in mode `u2` (single transaction),
so the cost it prints is the cost you would actually pay. That quote is a read-only call and moves
no funds.

Useful flags:

```bash
# a specific wizard, subject, thread and position
node scripts/wizard/inscribe.mjs --wizard skeptic --subject chunk-size \
  --thread t-2026-07-30-a --position 2 \
  --parents 1234 --parent-quote "the claim being answered" \
  --parent-wizard "Wizard-1, the Archivist"

# compose and print a whole six-entry thread plus its closing manifest
npm run wizards:preview
node scripts/wizard/inscribe.mjs --preview-thread --subject what-was-retired

# no network at all: falls back to a labelled fee estimate, never a quote
node scripts/wizard/inscribe.mjs --offline

# write the composed body somewhere for inspection
node scripts/wizard/inscribe.mjs --out /tmp/entry.md

# what wizards and subjects exist
node scripts/wizard/inscribe.mjs --help
```

Subjects available: `cost-of-permanence`, `chunk-size`, `ordinals-and-xtrata`, `agent-as-author`,
`why-markets-escrow`, `what-was-retired`.

## Broadcast (later, deliberately)

```bash
WIZARD_KEY_ARCHIVIST=<hex private key> node scripts/wizard/inscribe.mjs --broadcast
```

Before anything is signed, **every one** of these must hold, checked in this order:

1. the kill switch is off
2. `WIZARD_KEY_<WIZARD>` is set and looks like a hex private key
3. the payload is exactly **one chunk** (16,384 bytes), the cheap single-transaction path
4. the contract itself says the mint is single-transaction eligible
5. the fee came from a **live quote**, not an offline estimate
6. the wallet balance is at or above the floor
7. protocol fee plus miner fee is at or under the per-run spend cap
8. spending would not drop the wallet below the floor

Any failure throws a `WizardSafetyError` and nothing is sent. The transaction is built with
`PostConditionMode.Deny` and a `LessEqual` STX post-condition on the quoted protocol fee. It is
never `Equal`: an exact-match post-condition aborts the transaction and burns the miner fee if the
fee schedule moves underneath you.

## Spend caps

| Rail | Env var | Default | What it does |
|---|---|---|---|
| Per-run spend cap | `WIZARD_SPEND_CAP_USTX` | `500000` (0.5 STX) | Hard ceiling on protocol plus miner fee for one run. Plan section 4.4. |
| Balance floor | `WIZARD_BALANCE_FLOOR_USTX` | `1000000` (1 STX) | Refuse to start, or to spend down past, this balance. Recovery transactions have to stay affordable. |
| Max miner fee | `WIZARD_MAX_TX_FEE_USTX` | `30000` (0.03 STX) | The bid on any one transaction. Miner fees are not refundable. |

Each is also settable per run with `--spend-cap-ustx`, `--balance-floor-ustx`, `--max-tx-fee-ustx`.

Live costs for reference: one-chunk inscription is **11,000 microSTX** protocol fee, miner fee is
roughly 5,000 to 30,000 depending on congestion, and a sponsored listing escrows a refundable
50,000 microSTX fee budget. A full inscribe-list-buy-settle cycle is around 0.08 to 0.15 STX in
unrecoverable fees, nearly all of it miner fees.

## Kill switch

Either of these halts every broadcast, immediately, with no other change:

```bash
export WIZARD_KILL_SWITCH=1        # env var
touch scripts/wizard/KILL          # or a file next to the scripts
```

Dry runs still work while the kill switch is on, and print `KILL SWITCH : ENGAGED` in the plan.
`provision.mjs` refuses to run at all, in every mode including `--dry`, because provisioning ends in
funding a mainnet wallet. `--verify-only` is read-only and unaffected. Remove both to re-enable
spending.

## Files

| File | What it is |
|---|---|
| `provision.mjs` | The gated provisioning canary. Required before any funding. Terminal only: prompts, printing, child processes. |
| `provision-core.mjs` | The seven stages as pure logic with all I/O injected. No terminal, no network, no writes. |
| `make-wizards.mjs` | Generates the three wallets. Prints keys to stdout only, never to disk. |
| `personas.mjs` | The three voices and the subject bank. Pure data plus small pure functions. |
| `compose.mjs` | The corpus engine. Pure, deterministic, no network. Enforces the 16 KiB cap. |
| `inscribe.mjs` | The inscribe skill. Dry run by default. Live fee quote. All the safety rails. |
| `__tests__/` | Vitest. Picked up by the repo's normal `npx vitest run` sweep. |

```bash
npx vitest run scripts/wizard
```

## What this does not do yet

Stages 3 and up of the plan: listing, cancelling, multi-wizard trade, sponsored buy, cross-currency
listings, orchestration and reporting. Nothing here lists or buys anything. It generates, inscribes
and verifies, which is the plan's stage 2.
