# Cutover addendum: Forever Twins continuity and three ordering defects

**Status: planning. Nothing here has been deployed or merged into `steps.json`.**

**Target confirmed: v3.2.4.** It is already the correct spec, so the v3.4.1
question in `V3.4.1-MERGE-PLAN.md` is not a blocker for this cutover.

**Scope note:** Bitcoin Pepes is fully preserved, so it needs no successor
helper. Phase F covers **two** collections, LEO Cats and Miami Degens, plus
Rapha's `xtrata-inscribe` extension (section 5b).

Companion to `MIGRATION-PLAN.md`. That plan has 26 steps and is sound on the
core itself. This addendum covers what it does not: three ordering defects that
would fork the id space or fail mid-cutover, and the Forever Twins successor
sequence.

Steps below are written in the `steps.json` schema so they merge mechanically.
Merging is a deliberate act, not done yet.

---

## 1. Hard constraints

These are properties of the deployed code, not preferences. Every step ordering
below follows from one of them.

| | Constraint | Source |
|---|---|---|
| HC1 | `set-next-id` asserts `next-id` is still `u0`. Callable exactly once, and **any** mint or migration advances `next-id`. | v3.2.4 L783 |
| HC2 | A paused core still mints for allow-listed callers. Reading `next-id` before the old core is fully stopped gives a stale number. | v3.2.3 L200-207 |
| HC3 | `AllowedCallers` is a Clarity map with no enumeration. There is no way to ask the contract who is on it. | v3.2.3 L157, L1592 |
| HC4 | `dep-exists?` checks **this contract's** `InscriptionMeta`. A dependency on a token that lives on the old core fails with `ERR-DEPENDENCY-MISSING`. | v3.2.4 L303-305 |
| HC5 | `migrate-from-v3-2-3` transfers from `tx-sender`, so only the current owner can migrate. Escrowed twins can never be migrated. | v3.2.4 L933 |
| HC6 | `migrate-from-v3-2-3` calls `assert-inscription-allowed`. On a paused core the migrating wallet must be allow-listed. | v3.2.4 L930 |
| HC7 | Twin helpers pin `MASTER` as `define-constant`. They can only be authored once the new core's address is final. | all six helpers |
| HC8 | Transfers are never paused on either core. | v3.2.3 L621 |

HC8 is the one piece of good news: existing holders can always swap out, whatever
else happens.

---

## 2. Defect one: C1 and C2 are in the wrong order

Current plan:

```
C1  Read the current next-id from v3.2.3
C2  Pause v3.2.3
C3  Set next-id on v3.2.4 and unpause it
```

Reading before pausing is a race. Any inscription confirming between C1 and C2
makes the number stale, and by HC1 there is no second chance to correct it. The
window is at least one block and in practice several, because a transaction
already in the mempool at C1 still lands after C2.

**Corrected order: pause, settle, then read.**

```
C1  Pause v3.2.3
C1b Wait for the pause tx to confirm, then wait a further settling window
C1c Read next-id, twice, N blocks apart. The two reads must agree.
C2  Set next-id on v3.2.4
C3  Unpause v3.2.4
```

The two-reads-must-agree check is the cheap proof that nothing is still landing.
If they disagree, wait and read again. Do not proceed on a single read.

---

## 3. Defect two: the old allow-list, and why it turns out to be empty

The risk: by HC2 a paused core still mints for allow-listed callers. If any
entry survived the pause, the old core would keep issuing ids from its own
counter while the new core issues the same ids from the handover point. That is
the id fork, and it is silent. No transaction errors, nothing reverts,
`xtrata.xyz/i/5000` just stops resolving to one thing.

By HC3 the contract cannot tell you who is on the list, so it has to be
reconstructed from transaction history.

### Verified on chain, 2026-08-10

All 1,281 transactions against
`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3` were scanned:

| Function | Calls |
|---|---|
| `add-chunk-batch` | 429 |
| `migrate-from-v2-1-0` | 229 |
| `transfer` | 182 |
| `mint-single-tx` | 147 |
| `mint-single-tx-with-relationships` | 72 |
| `mint-single-tx-recursive` | 56 |
| `begin-or-get` | 47 |
| `seal-with-relationships` | 35 |
| `migrate-from-v1` | 33 |
| `seal-inscription` | 23 |
| `begin-inscription` | 20 |
| `set-single-tx-fee-unit` | 3 |
| `set-upload-chunk-fee-unit` | 1 |
| `set-paused` | 1 (to `false`, 2026-06-08) |
| `set-next-id` | 1 |
| **`set-allowed-caller`** | **0** |

**`set-allowed-caller` has never been called on v3.2.3. The allow-list is
empty.** Other owner-only admin calls do appear in this feed, so a zero count is
trustworthy rather than an artefact of the query.

### What that changes

**The remediation step is not needed. It becomes an assertion.** Pausing v3.2.3
genuinely stops all minting, with nothing to reconstruct and nothing to unwind.

Three consequences to carry forward:

1. Every contract that inscribes through v3.2.3 does so only because the core is
   unpaused. **Pausing it stops all of them the moment it lands**: the three
   Forever Twins helpers and Rapha's `xtrata-inscribe` extension (section 6).
   This confirms the successor plan is required rather than optional.
2. **Keep the step in the runbook as a pre-flight check.** Re-run the scan
   immediately before C1 and require the count to still be zero. It is cheap,
   and someone could add an entry between now and cutover.
3. Do not "solve" a broken satellite by allow-listing it on v3.2.3 after the
   pause. That is the id fork, dressed up as a fix.

### Precedent worth noting

`migrate-from-v2-1-0` ran 229 times and `migrate-from-v1` 33 times. The
migration path in defect three is not novel machinery. It has been exercised at
scale on this core already.

---

## 4. Defect three: recursive dependencies do not survive the boundary

By HC4, `dep-exists?` looks in the local `InscriptionMeta` map:

```clarity
(define-private (dep-exists? (id uint))
  (is-some (map-get? InscriptionMeta id))
)
```

The comment above it says "dep-id < next-id at the time of sealing", which is
what the old rule was. The code does something stricter. On a fresh core,
`InscriptionMeta` is empty regardless of what `next-id` was set to.

So **every `seal-recursive` or `mint-single-tx-recursive` on the new core that
depends on a token minted under v3.2.3 will be rejected** with
`ERR-DEPENDENCY-MISSING`. This includes the agent journal, which chains every
entry to genesis token #107.

It fails loudly rather than writing a dangling pointer, which is the right
behaviour, but it means dependency roots need moving before anything can depend
on them.

**The fix is `migrate-from-v3-2-3`, and it has a strict position in the order.**
Migration writes `InscriptionMeta` for that id on the new core, which is exactly
what makes it a valid dependency there. But migration also calls
`advance-next-id-if-needed`, so by HC1 **every migration must happen after
`set-next-id`, never before.** Migrating a single token first would set
`next-id` non-zero and permanently lock out the continuity call.

Ordering that follows:

```
C2   set-next-id on the new core          <- must be first
D1   enumerate every token that is a dependency root
D2   allow-list the migrating wallets (HC6, core still paused)
D3   migrate each dependency root, lowest id first
D4   verify each migrated id resolves on the new core
C3   unpause
```

D1 is real work. It means walking `InscriptionDependencies` and
`InscriptionParents` on v3.2.3 to find every id referenced by something that
will continue on the new core. Anything missed surfaces later as a failed seal.

---

## 5. Forever Twins successor sequence

Per the decision in `forever-twins/GRANT-DECISIONS.md` section 0: existing twins
stay on v3.2.3 permanently, the old helpers are untouched, and each collection
gets a successor helper on the new core.

By HC5 the escrowed twins cannot be migrated by anyone, so the D-phase migration
above deliberately does **not** include them. They are not dependency roots and
they do not need to move.

### Contract design for the successors

Confirmed decisions: payouts stay 50/50 between Xtrata and Rapha, hardcoded. Fee
level still to be set.

Recommendation: make **both** the split and the payout principals `define-constant`
rather than `define-data-var`, and make the fee a constant too. Rapha's originals
use data-vars with `set-fee`, `set-payouts` and `set-free-threshold`. Constants
are the better choice here for two reasons.

First, the grant's public template needs a hardcoded fee anyway, because the
registry verifies a deployed contract by hashing its source against the official
template, and a data-var can be changed after deploy without changing the source.
One template, one rule, is simpler to explain and to trust.

Second, hardcoding is safe here in a way it usually is not, because **the
prior-binding guard makes helpers chainable**. If a fee turns out wrong, deploy a
v3 helper that guards against both v1 and v2 bindings. Nothing is orphaned and no
holder is affected. The successor pattern is itself the upgrade path, so the
usual argument for keeping fees mutable does not apply.

The guard, generalised to a chain:

```clarity
(define-constant PRIOR-A 'SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.leo-fakfun-xtrata)

(asserts! (is-none (contract-call? PRIOR-A get-binding token-id)) ERR-ALREADY-INSCRIBED)
```

`get-binding` is read-only at line 255 in all three existing helpers, so this is
available and cheap.

### Proposed phase F steps

```json
{ "id": "F1", "phase": "F",
  "title": "Harvest and hash LEO Cats and Miami Degens",
  "why": "Canonical hashes are per-contract. Successor helpers need the full set re-seeded, and the harvester is grant milestone 1 work regardless. Bitcoin Pepes is fully preserved and needs no successor.",
  "verify": "Harvester run against Bitcoin Pepes reproduces its already-seeded on-chain canonical set exactly, byte for byte. Pepes is the correctness oracle even though it needs no new contract.",
  "rollback": "None needed. Offline." }

{ "id": "F2", "phase": "F",
  "title": "Confirm remaining supply for the two collections",
  "why": "Sizes the seed batches. Only ~100 LEO Cats and one Miami Degen are done, so nearly the full supply needs seeding.",
  "verify": "get-inscribed-count on each old helper, against source collection total supply." }

{ "id": "F3", "phase": "F",
  "title": "Agree fee level and confirm the 50/50 split with Rapha",
  "why": "Fee and payouts are constants in the successor. Wrong value means a redeploy.",
  "verify": "Written confirmation from Rapha of the payout principal and split." }

{ "id": "F4", "phase": "F",
  "title": "Author the successor template with the prior-binding guard",
  "why": "HC7: MASTER is a constant, so this cannot be finalised until the new core address is known.",
  "verify": "clarinet check passes; test proves a token bound in the prior helper is rejected." }

{ "id": "F5", "phase": "F",
  "title": "Testnet rehearsal of the full successor lifecycle",
  "why": "Seed, finalize, inscribe, and both swap directions, plus the prior-guard rejection path.",
  "verify": "All six paths pass against a testnet core and a mock prior helper." }

{ "id": "F5b", "phase": "F",
  "title": "Deploy xtrata-inscribe-v2 and confirm the wallet whitelist path",
  "why": "Section 5b. Rapha's passkey-wallet extension is pinned to v3-2-3 and dies at C1. Jim can deploy the replacement, but only the wallet can whitelist it.",
  "verify": "Extension deployed against v3.2.4; Rapha has confirmed in writing whether already-onboarded wallets can add it post-onboard.",
  "blocking": "Rapha must know before C1, not after. Existing passkey wallets may lose inscribing until they migrate." }

{ "id": "F6", "phase": "F",
  "title": "Deploy the two successor helpers to mainnet",
  "why": "Must follow M2, since the core address is baked in as a constant.",
  "verify": "Deployed source matches the template hash exactly.",
  "rollback": "Do not seed. An unseeded helper cannot inscribe anything." }

{ "id": "F7", "phase": "F",
  "title": "Allow-list the three successors on the new core",
  "why": "The new core ships paused. Only needed before F11, not before seeding.",
  "verify": "is-allowed-caller returns true for each." }

{ "id": "F8", "phase": "F",
  "title": "Seed canonical hashes in batches of 200",
  "why": "Per-contract map, must be populated before any inscribe.",
  "verify": "get-canonical-hash spot-checks against the F1 harvest for a random sample plus the first and last id." }

{ "id": "F9", "phase": "F",
  "title": "Full seeded-set verification before freezing",
  "why": "finalize-canonical is irreversible. A wrong hash freezes a token out of preservation permanently.",
  "verify": "Every seeded id read back and compared to the harvest. Zero mismatches. Not a sample." }

{ "id": "F10", "phase": "F",
  "title": "finalize-canonical on each successor",
  "why": "Closes seeding so non-canonical art becomes impossible.",
  "verify": "is-finalized returns true.",
  "rollback": "NONE. This is irreversible. F9 must be complete and clean first." }

{ "id": "F11", "phase": "F",
  "title": "Register old and new helpers together in the app registry",
  "why": "Two helpers per collection. The resolver is registry-driven and handles this, but both must be present or the viewer breaks for existing twins.",
  "verify": "An existing escrowed twin and a new twin both resolve to the correct real owner." }

{ "id": "F12", "phase": "F",
  "title": "Publish the do-not-migrate notice",
  "why": "Once the new core is unpaused, migrate-from-v3-2-3 is callable by anyone. A holder who migrates a twin out of escrow can never swap it back.",
  "verify": "Notice live on the claim pages and pinned in the collection channels.",
  "blocking": "MUST land before C3 unpause." }

{ "id": "F13", "phase": "F",
  "title": "First live inscribe on each successor",
  "why": "Proves the whole chain end to end on mainnet.",
  "verify": "Three twins minted, one per collection, each hash-verified and correctly escrowed." }
```

---

## 5b. The fourth Rapha contract: `xtrata-inscribe`

Found on chain, not in this repo:
`SPV9K21TBFAK4KNRJXF5DFP8N7W46G4V9RCJDC22.xtrata-inscribe`. Twenty-nine lines.
It is not a Forever Twins helper and it is not an NFT collection. It is a
**smart-wallet extension** that lets a passkey wallet inscribe.

```clarity
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.extension-trait.extension-trait)

(define-public (call (payload (buff 2048)))
  (let ((args (unwrap! (from-consensus-buff?
        { expected-hash: (buff 32), mime: (string-ascii 64), total-size: uint,
          chunks: (list 32 (buff 16384)), token-uri-string: (string-ascii 256) }
        payload) err-bad-payload)))
    (try! (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3
      mint-single-tx ...))
    (ok true)))
```

It is whitelisted inside `fakfun-wallet-v16`'s `onboard` function, alongside a
`register-wallet` call to `fakfun-wallet-core`.

### What it does and what it cannot do

- The wallet invokes the extension, so `tx-sender` at the core is the **wallet
  contract**. The inscription is owned by the passkey wallet, which is the
  correct result: a user with a device passkey and no seed phrase can inscribe.
- **The payload is capped at `(buff 2048)`.** The chunk list type allows 512 KiB,
  but the whole serialised tuple has to fit in 2 KiB, so after the mime string,
  token uri and length prefixes the usable content is roughly 1.6 KiB. That is
  why it is a text inscriber. It is a hard type-level ceiling, not a policy.
- It discards the token id, returning `(ok true)`. Callers have to read the id
  from the core's print event.

### It breaks at cutover, and it is pinned like the others

`xtrata-v3-2-3` is a literal in the `contract-call?`. Per section 3 it has never
been allow-listed, so it works only while the core is unpaused. **At C1 it stops,
and there is no fix available on the v3.2.3 side** that does not fork the id
space.

### The plan, minimising work for Rapha

The replacement is a near-verbatim redeploy with one changed principal. The
question is only who deploys it and what has to change on the wallet side.

**Recommendation: Jim deploys `xtrata-inscribe-v2` himself.** Nothing in the
extension is Rapha-specific. It implements a public trait and calls a public
core function. Deploying it costs Rapha nothing.

What cannot be avoided: the wallet has to whitelist the new extension. In
`fakfun-wallet-v16` the whitelist is written inside `onboard`, so **already
onboarded wallets have only the old extension**. Two paths, and which applies
needs confirming against the wallet's admin surface:

- If the wallet exposes a post-onboard function to add an extension, each
  existing wallet needs one call. Rapha's work is authorising it, not writing
  code.
- If it does not, new wallets pick up the change at the next wallet version and
  **existing passkey wallets lose the ability to inscribe** until they migrate.
  That is a user-facing regression and Rapha needs to know before C1, not after.

### Worth doing anyway, for the grant

Two reasons this matters beyond keeping it alive:

1. It is the accessibility story the grant's payment-rails line was reaching
   for. `GRANT-DECISIONS.md` section 5 concludes that multi-asset payment does
   not widen access much because the core fee is STX either way. A passkey
   wallet that inscribes without a seed phrase is a much better answer, and it
   already exists.
2. DeOrganized won a passkey wallet grant in the same cohort, and this repo
   already has `DEORGANIZED-COLLAB-PLAN.md`. Preserve-your-art-with-a-passkey is
   a natural joint demo between two Cohort 4 projects.

**Also worth raising with Rapha:** a 2 KiB payload cap is generous for text and
useless for images. If `xtrata-inscribe-v2` is being deployed anyway, widening
the payload buffer costs nothing and makes the extension useful for small
artwork. Confirm the wallet's own payload plumbing can carry a larger buff
before assuming it.

---

## 6. The order everything has to run in

Dependencies only. Anything not linked can run in parallel.

```
P1..P4  prepare
   |
T1..T4  testnet rehearsal ........................ F5 rehearses here too
   |
M1  deploy core (ships paused)
M2  verify interface
M3  set fee units
   |
   +--> F4  finalise successor template (needs core address, HC7)
   |         |
C1  PAUSE v3.2.3            <- pause BEFORE reading (defect 1)
C1b wait for settle
C1c read next-id twice, must agree
   |
X1  ASSERT the v3.2.3 allow-list is still empty  <- verified zero, re-check (defect 2)
   |
C2  set-next-id on new core      <- HC1, one shot, before ANY mint or migrate
   |
D1  enumerate dependency roots
D2  allow-list migrating wallets (HC6)
D3  migrate dependency roots, lowest id first (defect 3)
D4  verify each resolves
   |
   +--> F6 deploy successors --> F7 allow-list --> F8 seed --> F9 verify --> F10 finalize
   +--> F5b deploy xtrata-inscribe-v2, Rapha confirms wallet whitelist path
   |
S1..S5  satellite allow-listing
A1..A4  app pivot
F11 register both helper generations
F12 publish do-not-migrate notice   <- BLOCKING on C3
   |
C3  UNPAUSE the new core
   |
F13 first live inscribe per collection
V1..V3  verify and monitor
```

Three edges in that graph are the ones that actually matter:

- **C1 before C1c.** Pause before read, or the number is stale.
- **X1 before C2.** Empty the old allow-list before handing the counter over, or
  both cores mint the same ids.
- **C2 before D3.** Set the counter before any migration, or `set-next-id` is
  locked out forever.

---

## 7. Before this gets merged into steps.json

- [x] Target confirmed as v3.2.4.
- [x] v3.2.3 allow-list verified empty on chain (section 3). X1 becomes a
      pre-flight assertion rather than a remediation step.
- [ ] Re-run the allow-list scan immediately before C1 and confirm still zero.
- [ ] Enumerate the dependency roots for D1 and count them, since each migration
      costs `begin-fee-unit` (100,000 uSTX at the planned fee targets).
- [ ] Confirm the fee level for F3, and the payout principal for Rapha's half.
- [ ] Confirm with Rapha whether `fakfun-wallet-v16` can whitelist a new
      extension post-onboard (section 5b). This determines whether existing
      passkey wallets keep working through the cutover.
- [ ] Re-run `node contracts/drafts/v3.2.4/build-canary.mjs` after merging, or
      `--check` will fail on drift.
