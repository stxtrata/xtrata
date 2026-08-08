# Autonomous wallet agents — a working pattern for letting software spend real money

*A single self-contained brief. Hand this to another project or agent.*

---

You are being asked to build, or to reuse, a system in which autonomous processes hold their own private keys and broadcast real, irreversible blockchain transactions without a human approving each one.

This document is the distilled result of building exactly that and running it on Stacks mainnet: three agents ("wizards"), 35 permanent inscriptions, 24 marketplace listings, five sales across two settlement currencies, ~3.4 STX committed. The cost model predicted the spend to the microSTX. Nothing was lost. Several things went wrong and every one was caught by machinery rather than luck.

The chain here is Stacks. **Almost none of the value is Stacks-specific.** The parts that transfer are the architecture, the refusal order, the journal doctrine, and the failure modes. Read the whole thing before writing code; the expensive mistakes are all in the last third.

---

## 1. The core premise

**An autonomous agent that can spend money is a program whose bugs cost money.** Every normal defence — code review, tests, staging — remains necessary and stops being sufficient, because the failure mode is not "the program crashed", it is "the program did something irreversible and correct-looking".

So the design goal is not *"make it work"*. It is:

> **Make every way it can fail either impossible, cheap, or loud.**

Three consequences that shape everything below:

1. **Fail closed.** Any check that cannot be completed is a check that failed. "I could not read the balance" must refuse, not proceed.
2. **Never retry a spend on a guess.** The default response to ambiguity is to stop and report, never to try again. A duplicate transaction is as permanent as the first.
3. **Verify by reading the chain back, not by trusting a receipt.** A successful transaction proves *something* happened. It does not prove the right thing happened.

---

## 2. Threat model — what actually goes wrong

Ranked by what we actually hit, not by what sounds scary.

| Risk | Reality |
|---|---|
| **Key leaks into git** | The single most likely catastrophic event. We had a near-miss: a `git add -A` staged the real key file. Only a manual unstage prevented a commit. |
| **Agent spends more than intended** | A loop with no cap will spend until the wallet is empty. Ours tried to: a spend cap caught it mid-run. |
| **Duplicate/double broadcast** | Crash between signing and recording leaves you unable to tell "sent" from "not sent". Retrying doubles the spend. |
| **Correct transaction, wrong content** | Transaction succeeds; the thing it wrote is wrong. Irreversible and invisible to any receipt check. |
| **Rate limiting mid-run** | An API saying "slow down" halted a half-built permanent structure. Not a security issue; still stopped everything. |
| Key theft by an attacker | Real, but *lowest* on this list — because the wallets hold a small float by design. |

**The mitigation that dominates all others: these wallets are disposable and hold almost nothing.** If one leaks you lose the float and regenerate. Never derive agent wallets from a seed that controls anything else.

---

## 3. Wallet setup

### Generate fresh, never derive from your own seed

```
Standard Stacks account path: m/44'/5757'/0'/0/0
Stacks compressed key = 32-byte private key + 0x01 suffix
```

Use a standard path so the phrase can be imported into a normal wallet to inspect or rescue funds by hand. That escape hatch matters more than it sounds.

The generator script must:

- print keys and addresses **to stdout once**, never to disk
- write only a `.example` file containing placeholders
- never touch the real env file — that is the operator's to create
- never contact the network

```bash
node scripts/wizard/make-wizards.mjs
```

### The env file

```
WIZARD_KEY_ARCHIVIST=<hex, 33 bytes, compressed, ending 01>
WIZARD_ADDRESS_ARCHIVIST=<mainnet address>
… one pair per agent
```

Storing the **address alongside the key** is not redundant. It lets every run assert that the key still derives the wallet you funded. A restored-from-backup key that derives a different address is otherwise silent until it fails confusingly mid-run.

```js
// Run this at the start of every session that will sign anything.
const wallets = walletsFor({ env, broadcast: true });
assert(wallets.archivist.address === EXPECTED_ARCHIVIST_ADDRESS);
```

---

## 4. Key security — the part people get wrong

### Gitignore is a safety rail, and it is load-bearing

```gitignore
.env.wizards
scripts/wizard/.env.wizards
scripts/wizard/KILL
scripts/wizard/.run-*.json
scripts/wizard/.market-*.json
scripts/wizard/.collection-*.json
scripts/wizard/.pipeline-*.json
```

**Verify it bites, don't assume:**

```bash
git check-ignore -v scripts/wizard/.env.wizards   # must print a match
```

Make this a precondition in your runbook. We learned it twice: once from the near-miss, and once when a new journal file type appeared that no existing rule covered and sat there untracked next to a `git add -A`.

⚠️ **Caveat worth knowing:** `git check-ignore` reports *no match* for a path already staged in the index. If you have just staged something by accident, unstage it first, *then* re-check — otherwise you will misdiagnose a working rule as a broken one.

### Never let a key reach a journal

Every write of run state passes through an assertion:

```js
export function assertJournalSecretFree(journal, keys = []) {
  const text = JSON.stringify(journal ?? {});
  for (const key of keys) {
    const value = String(key ?? '').trim();
    if (value.length >= 32 && text.includes(value)) {
      throw new WizardSafetyError(
        'refusing to write the run journal: it contains something that looks like a private key'
      );
    }
  }
  return journal;
}
```

Crude and effective. It has never fired, which is the point.

### Other rules

- **Never log a key**, even truncated. Report *presence and count*, never value.
- **Never let the agent choose which wallet signs.** Bind the signer to the work: "a collection is minted by the wizard that conceived it, out of that wizard's wallet, or not at all." Removes a whole class of confused-deputy bug.
- **Test fixtures use structurally-valid-but-real-looking-fake keys** (`'11'.repeat(32) + '01'`) so anything that escapes into a log is unmistakably synthetic.

---

## 5. Funding — gate the one irreversible step

STX sent to a wrong address is gone. No contract escape hatch. A phrase written down wrong is silent until the day you need it.

So funding gets its own gated canary — seven stages, each gated on the one before:

1. **Generate** three fresh wallets, then type two words of each phrase back from the paper you just wrote
2. **Record** a paste-ready env block, saved by the operator
3. **Verify derivation** — recorded address == key-derived == phrase-derived
4. **Pre-funding checks** — mainnet, distinct, not a project wallet, zero balance
5. **Funding** — print the targets, then *watch* until money lands (a human sends; the script never moves a microSTX)
6. **Baseline** — confirmed balances, chain tip, timestamp
7. **Dry-run gate** — the normal dry run must pass before anything real

```bash
node scripts/wizard/provision.mjs              # the real gated run
node scripts/wizard/provision.mjs --dry        # fakes, no network, no prompts (CI)
node scripts/wizard/provision.mjs --verify-only  # stage 3 alone, as a health check
```

**Stage 1's memory check is the highest-value stage.** It catches a mis-transcribed phrase at the only moment it is still free.

### How much to fund

Fund per wallet against that wallet's own committed cost, **never against the fleet total**. Load is uneven — in our run one agent held two shared artefacts and needed materially more than the others. A fleet that can afford the run in aggregate can still have one agent unable to pay for its share.

Keep a **balance floor** (ours: 1 STX) that no run may spend below. Not a reserve for its own sake: if you spend the last of the float, recovery transactions stop being affordable.

---

## 6. The safety architecture

### Layer 1 — Refusal order

One function, checked in a fixed order so the first failure is the most informative. Ours, exactly:

1. Kill switch engaged
2. **No key** → refuse
3. Key is not hex → refuse
4. Payload not exactly one chunk → refuse
5. Contract says not single-transaction eligible → refuse
6. Fee is an estimate, not a live quote → refuse
7. A quoted reference could not be verified against its own on-chain bytes → refuse
8. Core contract paused, *or unreadable* → refuse
9. Balance unknown → refuse
10. Balance below floor → refuse
11. Planned spend exceeds per-transaction cap → refuse
12. Spend would leave balance below floor → refuse

Ordering is deliberate: cheap local checks first, chain-truth checks next, money checks last. An offline plan gets turned away for *being an estimate*, not for a chain check it was never allowed to run.

Note 8: **"could not read whether the core is paused" refuses.** A paused core reverts the mint and burns the miner fee anyway.

### Layer 2 — Spend caps, two levels

```js
DEFAULT_SPEND_CAP_USTX      = 500_000n    // one transaction
DEFAULT_RUN_SPEND_CAP_USTX  = 1_000_000n  // whole run
DEFAULT_BALANCE_FLOOR_USTX  = 1_000_000n
DEFAULT_MAX_TX_FEE_USTX     = 30_000n
```

The run cap must be **checked before the run starts, not only before each transaction.** Per-transaction checks stop overspend. An up-front check stops something worse: a run that gets three stages into building a permanent structure, trips the cap, and strands you halfway.

> **Halfway through a permanent, irreversible structure is the one place not to stop.**

⚠️ **The subtle bug here:** if your orchestrator delegates to sub-runners that each apply "the cap", you get N × cap, not cap. Pass each sub-runner *the fleet budget minus what everything else has committed*, so the halves sum to the real ceiling. We shipped this wrong and the cap was blind to 27 of 35 transactions.

### Layer 3 — Kill switch

```js
export function killSwitchEngaged(env = process.env, fileExists = existsSync) {
  const flag = String(env.WIZARD_KILL_SWITCH ?? '').trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(flag)) return 'WIZARD_KILL_SWITCH is set';
  if (fileExists(KILL_FILE)) return `${KILL_FILE} exists`;
  return null;
}
```

A **file** as well as an env var, because `touch scripts/wizard/KILL` works from another terminal on a run already in flight. Checked between steps, never mid-transaction.

### Layer 4 — The journal, and intent before broadcast

This is the heart of it. **Write the intent to disk *before* signing:**

```
record(key, { status: 'broadcasting', txid: null, finalHashHex, intendedNonce, senderAddress, … })
   ↓  (crash window)
submit()  →  txid
   ↓
record(key, { status: 'broadcast', txid })
   ↓
poll → record(key, { status: 'confirmed', inscriptionId })
```

Deliberately **no kill-switch check between the intent write and the submit** — a check there could leave an intent standing for a transaction provably never sent.

### Layer 5 — Resolving the crash window

A crash between intent and txid leaves the one genuinely hard question: *did it send?*

Resolve in this order, and **never guess**:

```
1. Content hash    → is something with these exact bytes already on chain?
                     The only POSITIVE proof available. Ask first, ask often.
2. Nonce           → decides only what a MISSING hash means.
3. Wait            → mempool, bounded.
4. Halt            → nothing proved anything. A human looks.
```

**The nonce asymmetry, which is the single most useful idea in this document:**

> `last_executed_tx_nonce` **below** the intended nonce **proves** the transaction never confirmed — safe to compose again.
> At or above the intended nonce **proves nothing** — it may have been yours, it may have been another transaction.

Outcomes: `landed` (adopt it), `absent` (proved never sent — safe to redo), `pending` (still in mempool — not a failure, not a loss), `ambiguous` (halt).

### Layer 6 — Determinism as a safety property

**This is the design decision that makes the crash window decidable, and it is easy to miss.**

If the thing you broadcast is a **pure function of its inputs**, you can regenerate the exact bytes after a crash and ask the chain "does this already exist?" — and get a true answer *forever*.

The moment you embed a timestamp, a block height, a fee, or a run id in the payload, that stops being true: a retry hashes to something different, and an orphaned intent can never afterwards be matched. You have traded a decidable crash window for one that needs a human forever.

We enforced this deliberately:

```
Do not add a date, a version stamp, a run id or a price to these documents.
Any of them would trade a decidable crash window for an undecidable one.
```

The one payload that *couldn't* be deterministic (it embedded IDs only known after earlier stages) got a specific mitigation: **write the ID map to the journal before composing**, so a crash between composing and confirming can still recompose identical bytes and probe for them.

### Layer 7 — Verify by reading back

Between every stage, re-read from the chain — **even for transactions this same process broadcast ten seconds ago.**

The failure being defended against is not "the runner lied". It is *"the runner was right about a transaction and wrong about what it did."*

Distinguish three outcomes, never two:

| Result | Meaning | Response |
|---|---|---|
| `verified` | read back and matched | proceed |
| `failed` | read back and did **not** match | halt |
| `unavailable` | **could not read** | halt — but do not blame the data |

Collapsing `unavailable` into `failed` teaches an operator to override real failures. Keeping them apart is what made a rate-limit incident diagnosable in one look.

---

## 7. Testability — inject everything

Every side effect is a port:

```js
export const NULL_PORTS = {
  fetchImpl:    async () => { throw new Error('no fetch port supplied'); },
  submit:       async () => { throw new Error('no submit port: nothing signed, nothing sent'); },
  readJournal:  () => null,
  writeJournal: () => {},
  killSwitch:   () => null,
  now:          () => Date.now(),
  sleep:        async () => {},
  say:          () => {},
  presentPlan:  () => {}
};
```

Defaults **read nothing and refuse to broadcast**, so a caller that forgets a port gets a run that spends nothing rather than one that quietly uses the real network.

### Dry run is not enough. Build a rehearsal.

**The most important lesson in this document.**

A dry run composes transactions and signs none. It proves bodies render, fees quote, arithmetic works. It proves **nothing** about the part that is actually dangerous: the verification gates. A dry run creates nothing, so there are no IDs, so there is nothing to read back, so **every gate is skipped**. The one mechanism protecting you is the one a dry run never executes.

So: run the **real loop** — intent, journal, submit, poll, verify, gate — against a **chain that lives in a JavaScript object**.

```js
const chain = makeFakeChain();     // in-memory ledger, assigns ids like the real core
const journal = makeMemoryJournal(); // never touches disk
const clock = makeFastClock();     // no real waiting
```

Two properties make it worth the effort:

**1. The fake throws on any URL it doesn't recognise.** That makes "nothing was broadcast" a *checkable property*, not an assurance.

**2. It can lie on purpose.** A gate that has only ever seen correct input has not been tested — it has been *watched*. Corrupt the fake in the specific ways the real world can go wrong:

```js
inject('flip-byte',          id);  // one byte differs
inject('vanish',             id);  // record disappears
inject('drop-dependency',    id);  // an edge is missing
inject('extra-dependency',   id);  // an edge that shouldn't exist
inject('wrong-dependency',   id);  // edge points at the wrong thing
inject('wrong-creator',      id);  // made by the wrong wallet
```

…then assert the matching gate **halts the run**.

**Prove your controls work by breaking the code deliberately.** Disable each gate in turn and confirm tests fail:

```
dependency check disabled  → 3 tests fail
byte comparison disabled   → 2 tests fail
creator check disabled     → 1 test fails
resume bug reintroduced    → 16 tests fail
```

> **A gate whose removal breaks nothing was never being tested.**

⚠️ And check your controls actually *do* something. Ours didn't, at first: `flip-byte` used the regex `/.$/`, which without the `m` flag requires a non-newline final character. Every payload ended in a newline, so it matched nothing — and **three negative controls passed while corrupting nothing at all.** A control that silently does nothing is worse than not having one.

⚠️ **The rehearsal must use the same port set as the real run.** Ours omitted one presenter port; the first real broadcast crashed instantly on it. *A port the rehearsal does not supply is a port the rehearsal does not test.*

---

## 8. Rate limiting — boring, and it will stop you

Verification is read-heavy: checking 24 items was 48 calls in a burst, and the public API cut in around call 40. Every read after that failed, and the run halted with 24 perfectly good permanent records on chain and nothing wrong with any of them.

**The halt was correct** — an unread record is not a verified one. But halting a half-built permanent structure because an API said "slow down" is a bad trade when the answer is to slow down.

```js
const RETRYABLE = new Set([429, 502, 503, 504]);  // NOT 404, NOT 400
```

- attach an API key when configured (raises limits by orders of magnitude)
- space requests (~120ms) — the cheap half of the fix; a burst that never trips the limiter needs no backoff
- back off exponentially on 429, honour `Retry-After`, **full jitter** (so N agents don't retry in lockstep)
- **never retry a 404 or a 400.** An answer is not a failure; retrying an answer is how a bug becomes a hang.
- **return the failed response, don't throw.** The caller already turns unreadable into `unavailable`, which is a *different thing* from having read something wrong. Throwing collapses the distinction the gates depend on.

Result: 24 verified in 15 seconds, no retries needed.

---

## 9. Costs

Model the cost before running, per wallet, and split **spent** from **escrowed**:

| | |
|---|---|
| Spent | gone, unrecoverable |
| Escrowed | returns on cancel or settle |

Reporting one combined number lets an operator size the fleet against a total that overstates the loss. Ours: 3.355 committed, of which 1.200 was refundable escrow and only 2.155 truly spent.

**Measure fees live; never trust a documented constant.** Our model carried a stale figure and overstated the run by 40%. A quick pre-flight quote against the real contract corrected it — and incidentally answered an open question for free (every payload type cost the same flat fee).

Prediction matched reality to the microSTX on the real run. That is achievable and worth aiming for; it is also how you notice when something is wrong.

---

## 10. Ordering, when work has dependencies

If your outputs reference each other, **the dependency graph forces the order** — nothing can reference something that doesn't exist yet. Make that explicit as gated stages rather than leaving it implicit in call order:

```
roots (reference nothing)
  → items
  → indexes (reference their items + their root)
  → aggregate (references everything)
```

Each stage: **preflight → act, bounded → verify on chain → gate.** A failed gate halts; it never skips ahead.

Resume must be free: re-running a completed stage should adopt existing work by content hash and spend nothing. Test it explicitly — *"running the whole pipeline twice broadcasts 35 times, not 70."*

---

## 11. The bugs, so you can skip them

Every one of these was in code that passed its tests.

| Bug | Lesson |
|---|---|
| Sub-runner omitted a collection id on its **resume** path, comparing item A against item B's expected bytes | Failed closed, but blocked resume for 2 of 3 collections — *exactly the path a crash leads to*. **Test the resume path, not just the happy path.** |
| A generic execution leg shipped **without the safety rails** the specific leg had | When you add a second code path, audit it against the first's rails |
| Narrowing a range made a sub-runner **silently do nothing** and return success | A no-op that reports success is worse than an error |
| Spend cap blind to 27 of 35 transactions; then double-counted | Delegated budgets must sum to the real ceiling |
| Plan formatter from a *different* subsystem crashed on the first real broadcast | Rehearse with the real port set |
| `Cl.parse(repr)` threw on every event, and the throw was swallowed as `null` | **A silent catch turned a total failure into "no data".** The feature had never worked and nothing surfaced it, because the failure path and the empty path look identical |
| Page-walk stopped on *parsed* count rather than *raw* count | Real feeds contain records your parser ignores |
| Rendered a contract's constant placeholder as if it were real content | *A confident wrong answer is worse than a visible absence* |

Two of these share a root cause worth naming: **`catch { return null }` around parsing turns "broken" into "empty", and nothing ever tells you.** If you swallow an error, count it and surface the count.

---

## 12. Adapting this to your chain

Ask these, in order:

1. **Is the payload deterministic?** If not, your crash window needs a human. Fix this first — it is cheaper than any mitigation.
2. **Is there a positive-proof probe?** (content hash → id). Without one you cannot resolve "did it send?" and must rely on nonce + waiting alone.
3. **Does your chain expose a nonce with the same asymmetry?** Most account-based chains do. UTXO chains need a different answer.
4. **Can you read your own output back?** If not, you cannot gate, and you should not automate irreversible writes.
5. **What is genuinely irreversible?** Fund that step with a canary; gate everything downstream.

---

## 13. Checklist

**Setup**
- [ ] Fresh wallets, standard path, never derived from a seed controlling anything else
- [ ] Address stored alongside key; derivation asserted every session
- [ ] Key file gitignored; `git check-ignore -v` verified (and re-verified whenever a new state-file type appears)
- [ ] Journal secret assertion on every write
- [ ] Funding canary passed, including the phrase memory check
- [ ] Balance floor set; per-wallet funding against per-wallet cost

**Before automating**
- [ ] Every side effect is an injected port; defaults refuse
- [ ] In-memory rehearsal runs the *real* loop with the *real* port set
- [ ] Fake environment throws on unrecognised URLs
- [ ] Injected-failure tests for every gate
- [ ] Each gate deliberately broken to confirm its tests fail
- [ ] Resume tested: running twice does the work once
- [ ] Rate-limit backoff with jitter; 4xx not retried
- [ ] Run cap checked **up front** and delegated budgets sum correctly
- [ ] Kill switch is a file, checked between steps

**Running**
- [ ] One stage at a time on the first real run
- [ ] Verify on chain between stages, never from receipts
- [ ] `unavailable` distinguished from `failed`
- [ ] Never re-broadcast on a guess

---

## 14. The three sentences

If you remember nothing else:

> **A successful transaction proves something happened, not that the right thing happened.**
>
> **A dry run never executes the gates, which are the only thing protecting you — build an in-memory rehearsal that runs the real loop and can lie on purpose.**
>
> **A last-executed nonce below the intended one proves absence; at or above it proves nothing.**
