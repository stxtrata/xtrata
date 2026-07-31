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
Stages 1 to 7 of that plan are what lives here: provisioning, inscribing a whole thread, and
the market half — list, buy, cancel, relist, settle, and fail legibly where a wizard holds
none of the payment token.

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

# settle one position the chain cannot settle. Writes one journal record, sends nothing.
npm run wizards:run -- --thread t-permanence-001 --resolve 5 abandoned

# really do it
npm run wizards:run -- --thread t-permanence-001 --subject cost-of-permanence \
  --from 5 --ids 2922,2923,2924,2925 --broadcast
```

Per entry the loop does exactly this, in this order:

1. check the kill switch
2. compose the entry and run the **full existing preflight** from `inscribe.mjs`, including
   `verifyParentQuote` against the real parent's on-chain bytes
3. check the run-level spend cap, then `assertBroadcastAllowed`
4. read the wallet's `possible_next_nonce`, then write the **intent** — the hash of the bytes about
   to be signed, the wallet, and that nonce — to the run journal, before anything is signed
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
status, txid, inscription id, block, the content hash of what was signed, the wallet and the nonce it
was signed with, and what it cost.

It is written **before** each broadcast, not after. That ordering is the whole point: the dangerous
crash is the one between signing and recording, because a runner that forgets it broadcast will
broadcast again, and the second mint is just as permanent and just as expensive as the first.

| What the journal says | What a resumed run does |
|---|---|
| `confirmed` | Skips it. Re-reads the entry off chain for the next citation. |
| `broadcast` or `timeout` (has a txid) | **Polls that txid.** Never re-sends. |
| `broadcasting` (intent written, no txid) | The crash window, decided by hash and nonce. See below. |
| `abandoned` | Something proved it was never minted. Composes it again from scratch. |
| `failed` | Halts. A human decides what happened. |

A dry run keeps its journal in memory and writes nothing, so the invented ids and txids of a
rehearsal can never be mistaken for a real run's.

Recording the nonce did not change the journal version. A journal written before that field existed
loads unchanged and falls back to the hash-only behaviour, which is the halt in the last row below.

### The crash window

An intent with no transaction id is the one state the journal cannot answer on its own. Two
independent questions decide it, and **they are not symmetric**.

**The content hash** is positive proof, and the only positive proof there is. The bytes are
deterministic, so if the mint landed `get-id-by-hash` finds it. It is asked first, and asked again
every few seconds while waiting.

**The sender's nonce**, recorded with the intent as the `possible_next_nonce` read immediately before
signing, decides what a *missing* hash means:

| Reading | What it proves | What the run does |
|---|---|---|
| `get-id-by-hash` finds those exact bytes | The mint **landed** | Adopts that inscription. Never re-broadcasts. |
| a mempool nonce **at or above** the intended one | It is **still in flight** | Waits up to `--mempool-wait-minutes` (default 3) with a countdown, re-checking the hash. If it lands in the window the run carries on; if it does not, it halts, says the transaction is still pending, and names the nonce. |
| `last_executed_tx_nonce` **below** the intended one | It **never landed, and cannot** | Clears the orphaned intent, keeps it under `previousIntents`, composes the entry again and carries on. No wait: waiting on a transaction that provably does not exist buys nothing. |
| `last_executed_tx_nonce` **at or above** the intended one | **Nothing** | Halts. |
| no nonce recorded, or the endpoint unreadable | **Nothing** | Halts, exactly as it did before nonces were recorded. |

The last two rows are the point. A nonce **below** the intended one is proof of absence: that nonce
has never confirmed, a nonce cannot confirm out of order, so this transaction did not confirm. A
nonce **at or above** it proves only that *some* transaction consumed it, and that transaction may
have been the operator moving funds out of the same wallet, or a mint done by hand. Only the content
hash can say that this mint landed.

Before the nonce was recorded, an ambiguous position halted permanently. An entry states the block it
was written at, so composing it again produces different bytes under a different hash, which means
the orphaned intent could never afterwards be matched, cleared, or told apart from a mint that
landed.

### Settling a position by hand

For what is left — a nonce consumed by something unidentifiable, or a transaction that sat in the
mempool until it was garbage collected — `--resolve` writes a human's verdict into the journal, with
a timestamp and a note recording that a human settled it.

```bash
# it was minted as #2926 — checked against #2926's own front matter before it is believed
npm run wizards:run -- --thread t-permanence-001 --resolve 5 landed:2926

# it was never minted — checked against the chain before it is believed
npm run wizards:run -- --thread t-permanence-001 --resolve 5 abandoned
```

Neither is a way to skip a check:

- **`landed:<id>`** reads that inscription's own front matter and refuses unless the thread, the
  position and the subject are this run's. Pasting the id of a neighbouring entry would otherwise
  write a permanent citation of the wrong inscription into the manifest. `manifest` is verified as a
  `record: thread-manifest` for this thread instead, since a manifest has no position and no claim.
- **`abandoned`** refuses if the chain shows the position confirmed — by recorded id, by content
  hash, or by a transaction that succeeded — and refuses while a recorded transaction is still
  pending and might yet confirm. You cannot abandon something that landed.
- Both refuse a position that is already cleanly resolved, and both leave the journal untouched when
  they refuse.

`<position>` is a position number or `manifest`, and `--thread` is required. Both broadcast nothing,
sign nothing and need no key: they read the chain and write one journal record.

### Failure semantics

- **Stop on the first failure. Never retry a broadcast.** Any terminal status other than `success`
  halts the run. There is no backoff and no second attempt: a retry loop with a private key and a
  mempool is how you mint six copies of the same entry.
- **A timeout is not a failure.** A transaction that has not confirmed inside the window may still
  confirm. The runner says so in as many words, keeps the txid in the journal, and tells you not to
  re-broadcast. Re-run with the same `--from` once it lands, or watch it with `--status`.
- **The kill switch is checked between every step**, not only at the start — including between looks
  while waiting on the mempool. Engaged while a transaction is in flight, the run stops and reports
  that the broadcast may still confirm: nothing is undone, because nothing can be.
- **A pending transaction is not a lost one.** An intent whose nonce is still in the mempool halts
  saying so, and names the nonce to watch. Once that nonce clears, a re-run resolves the position
  without anyone deciding anything: it either finds the bytes on chain, or the nonce proves they
  never got there.
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
--mempool-wait-minutes <n>    how long to wait on a lost txid whose nonce is pending (default 3)
--mempool-poll-seconds <n>    gap between those lookups (default 15)
--resolve <pos> <decision>    settle one position by hand: abandoned, or landed:<id>
```

## Running the market scenarios

`run-thread.mjs` proves the fleet can write. `market-run.mjs` proves it can trade: scenarios 2
to 10 of the plan, each independently pass, fail or skip, and each runnable on its own by name.

```bash
# every scenario against a fake market, with a pass/fail/skip table (the default)
npm run wizards:market:dry

# one scenario, by name
npm run wizards:market -- --scenario cancel --market usdcx --listing-id 12 --dry

# really do it
npm run wizards:market -- --all --run m-2026-07-31 --tokens 2922,2923,2924,2925 --broadcast
```

| # | Scenario | What it proves |
|---|---|---|
| 2 | `list-stx` | Listing, NFT escrow, and the STX fee budget leaving the seller |
| 3 | `list-sbtc` | A cross-currency listing needs **no sBTC** — asserted, by reading the balance first |
| 4 | `list-usdcx` | The same on the second cross-currency market |
| 5 | `buy-stx` | A self-paid purchase: ownership moves, STX moves seller-ward, the row is marked sold |
| 6 | `buy-sponsored` | Quote, a fee-0 signature, submit, poll — the relayer end to end |
| 7 | `cancel` | Escrow recovery and a **full** budget refund |
| 8 | `buy-sbtc-expected-failure` | The failure is clean and legible, not a silent hang |
| 9 | `relist` | Cancel-then-list, the only price change the contracts support |
| 10 | `settlement` | Escrowed budget minus claimed equals what comes back |

### Only the sponsored markets will take a v3 inscription

`xtrata-market-{stx,sbtc,usdc}-v1-0` and `xtrata-market-v1-1` hardcode `ALLOWED-NFT-CONTRACT` to
the retired `xtrata-v2-1-0` and reject anything minted on the current core at `list-token`. The
three usable markets are:

| Key | Contract |
|---|---|
| `stx` | `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-sponsored-stx-v1-1` |
| `sbtc` | `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-sponsored-sbtc-v1-1` |
| `usdcx` | `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-market-sponsored-usdcx-v1-1` |

That is checked live against `is-nft-allowed(core)` before anything is signed, and a market that
answers `false` — or that cannot be read at all — refuses the broadcast rather than paying a
miner fee to find out.

**`list-token` escrows the NFT and a fee budget, and the budget is always STX**, on the sBTC and
USDCx markets exactly as much as on the STX one. So listing for sBTC needs no sBTC; only the buy
leg needs the token. Scenarios 3 and 4 exist to prove that, so they read the seller's token
balance first and **fail if it is not zero** — a listing made from a wallet that holds the token
proves nothing about the claim.

### Scenario 8 costs one miner fee, on purpose

The free half comes first: read the buyer's sBTC balance and the listing, and establish that the
payment leg cannot succeed. That needs no transaction. But "aborts cleanly with a legible error,
moves nothing, leaves the listing unsold" is a statement about a transaction, and only a
transaction can make it — a hang and a clean abort look identical from a balance read. So the
scenario broadcasts, and says so before it does.

It passes only on a *specific* failure: the status has to start with `abort`, the result has to
carry a readable `(err uN)`, that `N` must **not** be one of the market's own `u100`–`u109`
codes (which would mean the buy never reached the token transfer), the escrow must still hold
the token, and the listing must still be unsold. A silent success is reported as a market bug
rather than a test failure, in those words.

`--no-onchain-failure-proof` stops after the free half; the report records whether the proof was
`read-only` or `broadcast`.

### Settlement is usually a skip, and that is correct

`claim-fee` and `settle-refund` are sponsor-only, and the wizards are not the sponsor. The half
they can reach is the seller's self-settle, which the contract locks for `REFUND-DELAY` — 144
blocks, roughly a day — after the sale. Before that, scenario 10 skips and names the number of
blocks remaining. A run that went red on a block height would be red every night and would mean
nothing.

`--blocks-per-tx <n>` widens the fake chain's step so a **dry** rehearsal can reach the far side
of the delay and exercise the settle path. It is refused under `--broadcast`, because there is no
such thing on mainnet.

### The market journal

`scripts/wizard/.market-<runId>.json`, gitignored, one file per run. Same crash discipline as the
thread runner's journal, and it imports that runner's nonce logic rather than restating it:

- The **intent** — sender, intended nonce, and a hash of the exact contract call and arguments —
  is written **before** the broadcast, not after.
- A step with a transaction id is **polled**, never re-sent.
- A step with an intent and no transaction id is the crash window, and is decided the same way,
  with the same asymmetry. What differs is the positive proof. A mint can be found again by
  content hash; a market call cannot, so every step carries a **probe** — a read-only question
  whose answer is yes only if that step already landed. `get-listing-id-by-token` for a listing,
  `get-owner` for a purchase, the absence of a listing row for a cancel.

| Reading | What it proves | What the run does |
|---|---|---|
| the probe finds the state the step produces | it **landed** | Adopts it. Never re-broadcasts. |
| a mempool nonce **at or above** the intended one | still **in flight** | Waits, re-probing; then halts and names the nonce. |
| `last_executed_tx_nonce` **below** the intended one | it **never landed, and cannot** | Clears the intent into `previousIntents` and sends again. |
| `last_executed_tx_nonce` **at or above** it | **nothing** | Halts. |

A resumed run also relaxes the preconditions that only make sense before a first attempt. "The
seller still owns it" and "nothing is listed yet" are both false after a crash *because the step
worked*, and a runner that refused on them would leave the NFT in escrow and report a skip. Past
that point the probe and the nonce decide. Balance-delta checks are skipped on a recovered step,
since their baseline is gone; the on-chain state checks still run.

### Post-conditions

Every call is `PostConditionMode.Deny` with one condition per asset that moves, mirroring the
recipe the shipped market page uses:

| Call | Conditions |
|---|---|
| `list-token` | NFT sent by the seller; STX from the seller `<=` the fee budget |
| `buy` | payment token from the buyer `<=` the price; NFT sent by the market contract |
| `cancel` | NFT sent back by the market contract; STX from the contract `<=` the remaining budget |
| `settle-refund` | STX from the contract `<=` the unclaimed budget, or none when nothing moves |

The STX bounds are `LessEqual`, never `Equal`. An exact-match condition aborts and burns the
miner fee the moment the contract moves a microSTX less than predicted, and `LessEqual` bounds
the spend just as tightly in the only direction that can cost a wizard anything.

### Cleanup

Every run ends by asking the chain what it is leaving behind — open listings, NFTs in escrow, and
sold listings whose budget has not been settled — and prints the exact command that recovers each
one. It reads the chain rather than the journal, so a listing a previous crashed run left is
reported too.

Useful flags:

```bash
--seller <wizard>            who lists (default archivist)
--buyer <wizard>             who buys (default skeptic)
--tokens <a,b,c,d>           inscriptions for list-stx, list-sbtc, list-usdcx, buy-sponsored
--listing-id <n>             act on this listing, which makes any scenario runnable alone
--market <key>               stx, sbtc or usdcx, for a single-scenario run
--price-ustx <n>             listing price in microSTX, scaled into each market's own unit
--fee-budget-ustx <n>        sponsorship deposit, always STX (default 50,000, the minimum)
--no-sponsor                 skip the relayer entirely
--sponsor-api <url>          relayer base (default https://xtrata.xyz)
--no-onchain-failure-proof   scenario 8 stops at the free read-only proof
--blocks-per-tx <n>          dry only: how far the fake tip moves per transaction
--run-spend-cap-ustx <n>     cap across the whole run (default 1,000,000)
```

## Spend caps

| Rail | Env var | Default | What it does |
|---|---|---|---|
| Whole-run spend cap | `--run-spend-cap-ustx` | `1000000` (1 STX) | Ceiling across **every remaining broadcast** in a thread or market run, checked before each one. A per-entry cap cannot see a loop. In a market run it counts the miner fee plus every microSTX that leaves a wizard's wallet, escrowed fee budgets and purchase prices included, even though both are recoverable: the number exists to stop a loop, not to balance the books. |
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
| `market-run.mjs` | The market runner, scenarios 2 to 10. Dry run by default. Terminal, the fake market for `--dry`, the port that signs, and the relayer client. |
| `market-run-core.mjs` | The scenarios as pure logic with every port injected, including the sponsor relayer. Imports the thread runner's nonce logic rather than restating it. |
| `__tests__/` | Vitest. Picked up by the repo's normal `npx vitest run` sweep. |

```bash
npx vitest run scripts/wizard
```

## What this does not do yet

The wizards are not the market's **sponsor**, so `claim-fee` and the sponsor's half of
`settle-refund` are out of reach from here. Scenario 10 covers the seller's half, which is the
half that guarantees a seller can always recover their own escrow.

Nothing here claims from a drop: drops v1.1 gates claims by BNS attestation, and each wizard
would need a name first. Plan section 7, open decision 3.

Nothing here clicks a button, so a broken render, a mislabelled control or copy that promises
something the code does not do is still invisible to it. That needs the Playwright suite. The two
are complements: browser tests catch what the user sees, wizards catch what the chain does.
