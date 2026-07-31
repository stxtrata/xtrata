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
WIZARD_KEY_ARCHIVIST=<hex private key> node scripts/wizard/inscribe.mjs \
  --thread t-2026-07-30-a --broadcast
```

`--thread` is mandatory for a broadcast. The placeholder `t-demo-0001` is refused, because the
thread id is written into the entry and quoted by the manifest and cannot be changed afterwards.
If the fleet is provisioned, the key is already loaded from `.env.wizards` and the env var above is
not needed. A dry run prints the exact command to re-run.

Before anything is signed, **every one** of these must hold, checked in this order:

1. the kill switch is off
2. `WIZARD_KEY_<WIZARD>` is set and looks like a hex private key
3. the payload is exactly **one chunk** (16,384 bytes), the cheap single-transaction path
4. the contract itself says the mint is single-transaction eligible
5. the fee came from a **live quote**, not an offline estimate
6. every quoted parent fragment is present in that parent's own on-chain bytes, and the credited
   wizard really created it
7. the core contract is not paused
8. the wallet balance is at or above the floor
9. protocol fee plus miner fee is at or under the per-run spend cap
10. spending would not drop the wallet below the floor

Any failure throws a `WizardSafetyError` and nothing is sent. The transaction is built with
`PostConditionMode.Deny` and a `LessEqual` STX post-condition on the quoted protocol fee. It is
never `Equal`: an exact-match post-condition aborts the transaction and burns the miner fee if the
fee schedule moves underneath you. The dry run now prints that post-condition as a line of its own,
so the spend bound can be confirmed without reading the source.

Rails 6 and 7 **fail closed**. If the parent chunk or the pause state cannot be read, the broadcast
is refused rather than attempted: you cannot verify a quote you could not fetch, and a paused core
reverts the mint while the miner fee is still spent.

### Preflight checks

Every check below is a read. None of them can sign or send anything, and `--offline` skips the ones
that need the network and says which ones it skipped.

| Check | Contract read | Blocks a broadcast? |
|---|---|---|
| Parent quote and author | `get-chunk(id, u0)`, `get-inscription-creator(id)` | **Yes**, fails closed |
| Core paused | `is-paused()` | **Yes**, fails closed |
| Whole-thread affordability | none, uses the balance already read | No, warns |
| Duplicate content | `get-id-by-hash(final-hash)` | No, v3.2.3 permits duplicates |
| Pending or stuck nonce | `GET /extended/v1/address/<addr>/nonces` | No, warns |

The parent quote check is the one that guards something no later transaction can fix. The closing
manifest tells readers that every claim an entry makes about itself is checkable, and
`--parent-quote` was the one string in the design that a human typed and nothing verified. A typo,
a paraphrase, or the right words pasted under the wrong id would be signed, minted and permanent,
and it would attribute words to another wizard's inscription.

## Running a whole thread

`inscribe.mjs` mints one entry. A thread is six of them plus a manifest, and every entry after the
first quotes the inscription id **and the claim** of the one before it — neither of which exists
until the previous transaction confirms. Driving that by hand means an hour in front of an explorer
copying ids and claims between commands, with a chance to paste the wrong one at every step.

```bash
# rehearse the remaining entries and the manifest against a fake chain (default)
npm run wizards:run -- --thread t-permanence-001 --subject cost-of-permanence --from 5 --dry

# what is confirmed, pending or missing. Reads only. Runs nothing.
npm run wizards:status -- t-permanence-001 --ids 2922,2923,2924,2925

# really do it
npm run wizards:run -- --thread t-permanence-001 --subject cost-of-permanence \
  --from 5 --ids 2922,2923,2924,2925 --broadcast
```

Per entry the loop does exactly this, in this order:

1. check the kill switch
2. compose the entry and run the **full existing preflight** from `inscribe.mjs`, including
   `verifyParentQuote` against the real parent's on-chain bytes
3. check the run-level spend cap, then `assertBroadcastAllowed`
4. write the **intent** to the run journal — before anything is signed
5. broadcast
6. record the txid, then poll to a terminal transaction status
7. on success, parse `token-id` out of the mint's own `(ok (tuple (existed bool) (token-id uint)))`
8. read that inscription's bytes back off chain and take its `## Claim` as the next entry's quote

After the last position it composes the manifest from every member's **on-chain** bytes — id, block,
cost, claim, wizard — and mints it with all six as dependencies.

`--dry` is the default and runs the whole loop against a fake chain inside the process: no key is
read, nothing is signed, and any request to an endpoint the fake does not serve throws rather than
reaching mainnet. Ids for entries minted before the run are synthetic unless `--ids` supplies the
real ones, and the output says which it used.

### The run journal

`scripts/wizard/.run-<threadId>.json`, gitignored, one file per thread. It records per position the
status, txid, inscription id, block, the content hash of what was signed and what it cost.

It is written **before** each broadcast, not after. That ordering is the whole point: the dangerous
crash is the one between signing and recording, because a runner that forgets it broadcast will
broadcast again, and the second mint is just as permanent and just as expensive as the first.

| What the journal says | What a resumed run does |
|---|---|
| `confirmed` | Skips it. Re-reads the entry off chain for the next citation. |
| `broadcast` or `timeout` (has a txid) | **Polls that txid.** Never re-sends. |
| `broadcasting` (intent written, no txid) | Resolves it against the chain by content hash — the bytes are deterministic, so if the mint landed `get-id-by-hash` finds it. If it does not, **halts**: "not indexed yet" and "never sent" look identical from here and only one of them is safe to act on. |
| `failed` | Halts. A human decides what happened. |

A dry run keeps its journal in memory and writes nothing, so the invented ids and txids of a
rehearsal can never be mistaken for a real run's.

### Failure semantics

- **Stop on the first failure. Never retry a broadcast.** Any terminal status other than `success`
  halts the run. There is no backoff and no second attempt: a retry loop with a private key and a
  mempool is how you mint six copies of the same entry.
- **A timeout is not a failure.** A transaction that has not confirmed inside the window may still
  confirm. The runner says so in as many words, keeps the txid in the journal, and tells you not to
  re-broadcast. Re-run with the same `--from` once it lands, or watch it with `--status`.
- **The kill switch is checked between every step**, not only at the start. Engaged while a
  transaction is in flight, the run stops and reports that the broadcast may still confirm — nothing
  is undone, because nothing can be.
- **`--from <n>` refuses to start when the predecessor is not confirmed on chain**, and refuses an id
  whose own front matter says it belongs to a different thread or a different position.

Useful flags:

```bash
--to <n>                      stop before the end of the thread
--no-manifest                 mint the entries, do not close the thread
--manifest-wizard <id>        who signs the manifest (default the opening wizard)
--run-spend-cap-ustx <n>      cap across the whole run
--confirm-timeout-minutes <n> how long to wait for one transaction (default 30)
--poll-seconds <n>            gap between transaction lookups (default 20)
```

## Spend caps

| Rail | Env var | Default | What it does |
|---|---|---|---|
| Whole-run spend cap | `--run-spend-cap-ustx` | `1000000` (1 STX) | Ceiling across **every remaining broadcast** in a thread run, checked before each one. A per-entry cap cannot see a loop. |
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

A thread run checks it between every step, so engaging it mid-run stops the loop at the next
boundary rather than at the end. If a transaction is already in flight when it is engaged, the run
stops and says that transaction may still confirm: nothing is undone, because nothing can be.

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
| `run-thread.mjs` | The thread runner. Dry run by default. Terminal, the fake chain for `--dry`, and the one port that signs. |
| `run-thread-core.mjs` | The loop as pure logic with every port injected: fetch, submit, clock, sleep, journal, kill switch. |
| `__tests__/` | Vitest. Picked up by the repo's normal `npx vitest run` sweep. |

```bash
npx vitest run scripts/wizard
```

## What this does not do yet

Stages 3 and up of the plan: listing, cancelling, multi-wizard trade, sponsored buy, cross-currency
listings, orchestration and reporting. Nothing here lists or buys anything. It generates, inscribes,
verifies and threads, which is the plan's stage 2 end to end.

The manifest is the thing the plan wants listed for sale. Nothing here lists it.
