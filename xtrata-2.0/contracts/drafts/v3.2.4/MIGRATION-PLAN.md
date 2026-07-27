# Xtrata v3.2.4 migration plan

**Status: draft. Nothing here has been deployed.**

This directory holds the v3.2.4 candidate core, its tests, and a deployment canary
that walks the migration in order.

| File | What it is |
|---|---|
| `xtrata-v3.2.4-candidate.clar` | The deployable contract. Mainnet trait active. |
| `xtrata-v3.2.4-sponsored.test.mjs` | Tests for the payer/recipient split. |
| `steps.json` | **Single source of truth** for the migration steps. |
| `canary.html` | Generated. Run it in a browser during deployment. |
| `build-canary.mjs` | Regenerates `canary.html` and the table below from `steps.json`. |

```bash
node contracts/drafts/v3.2.4/build-canary.mjs
```

Edit `steps.json`, then run that. Never hand-edit `canary.html` or the generated
block below. `--check` fails if they have drifted, so it can go in CI.

---

## Why 3.2.4 exists

Two changes, both additive.

**1. Sponsored mints (payer is not the owner).** The reason this came up: a
publisher wants to pay for a writer's inscription so the writer never needs a
funded wallet, while the writer still owns and is credited for the piece.

In v3.2.3 that is impossible. The fee comes from `tx-sender`:

```clarity
(stx-transfer? amount tx-sender (var-get royalty-recipient))
```

and the token mints to the same principal:

```clarity
(try! (nft-mint? xtrata-inscription new-id tx-sender))
```

Payer and owner are welded together. Stacks sponsored transactions do not help,
because sponsorship only covers the miner fee, never a transfer inside contract
execution.

Today we fake it in Agent One by minting from a temporary wallet and transferring
on. That works, but it costs an extra transaction per piece and it records the
temporary wallet as `creator`, which is wrong for author-owned publishing.

3.2.4 adds three functions that take a recipient:

```clarity
(mint-single-tx-to recipient hash mime size chunks uri)
(mint-single-tx-recursive-to recipient hash mime size chunks uri deps)
(mint-single-tx-with-relationships-to recipient hash mime size chunks uri deps parents)
```

The signer pays. The recipient owns **and** is recorded as creator. The
`inscription-sealed` event gains a `payer` field so the funding wallet is still
attributable.

The change is contained because `commit-inscription` is a single choke point that
already took `creator` as a separate argument. It gains one `recipient` parameter.
Every pre-existing caller passes `tx-sender`, which reproduces v3.2.3 exactly.

The staged (`begin` / `add-chunk-batch` / `seal`) path is deliberately **not**
sponsored in 3.2.4. Demand is on the single-transaction route and keeping the
staged path untouched keeps the diff small.

**2. The 128 MiB cap**, already drafted: `MAX-TOTAL-CHUNKS` goes from `u2048` to
`u8192`. Carried over from the existing draft.

### Verification so far

- `clarinet check`: 51 contracts checked, no errors.
- Existing draft core suite: **18 passed, 0 failed**.
- New sponsored suite: **11 passed, 0 failed**, covering: recipient owns, payer
  does not; recipient recorded as creator; payer charged and recipient charged
  nothing; a zero-balance recipient can be published to; plain `mint-single-tx`
  still mints to the signer; a contract principal is a valid recipient.

---

## What this migration actually costs

Much less than a core swap usually does, because most of the ecosystem was built
against traits rather than a hardcoded core.

| Contract | Coupling to the core | Action |
|---|---|---|
| `xtrata-market-sponsored-stx-v1-1` | `PRIMARY-NFT-CONTRACT` read by a getter only, enforcement via allow-list | **Admin call** |
| `xtrata-market-sponsored-sbtc-v1-1` | same | **Admin call** |
| `xtrata-market-sponsored-usdcx-v1-1` | same | **Admin call** |
| `xtrata-drops-v1-2` | trait-based, except `create-campaign-drop` | **Admin call**, redeploy only for campaigns |
| `xtrata-market-stx-v1-0`, `usdc`, `sbtc` | `<nft-trait>` parameter | **Nothing** |
| `xtrata-collection-mint-v1-4` | no core reference | **Nothing** |
| `xtrata-preinscribed-collection-sale-v1-0` | no core reference | **Nothing** |
| `xtrata-commerce`, `xtrata-vault` | no core reference | **Nothing** |
| `xtrata-v3-2-3-gateway` | three hardcoded calls, named after the core | **Redeploy** |

Out of scope by decision: `xtrata-arcade-duels-v1`, `xtrata-duels-claims-v1`,
`xtrata-arcade-scores-*`. These are experimental, they hardcode the core, and they
can stay on 3.2.3 indefinitely.

**Do existing 3.2.3 inscriptions need to migrate? No.** They stay valid, owned and
viewable. `migrate-from-v3-2-3` is opt-in per token and costs a begin fee. The app
keeps reading them through the existing `legacyContractId` mechanism, which today
points 3.2.3 at v2-1-0 and would be repointed.

### The one thing that is genuinely permanent

A new NFT contract is a new collection as far as wallets and marketplaces are
concerned. Inscriptions will be split across 3.2.3 and 3.2.4, and nothing we
control fixes that. It is the strongest argument for batching every worthwhile
core change into this one deploy rather than doing it twice.

### The safety property this plan leans on

The core **deploys paused**. It exists but cannot mint until step `C3`. That makes
everything up to the cutover reversible, and it is why the ordering below never
unpauses before setting `next-id`.

---

## Steps

The canary enforces this order and relocks later steps if you uncheck an earlier
one.

<!-- BEGIN GENERATED STEPS -->
_Generated from `steps.json` by `build-canary.mjs`. Do not edit by hand._

### P. Prepare (local, no chain)

| Step | What | Verify | Reversible |
|---|---|---|---|
| `P1` | Register the candidate in the Clarinet project | clarinet check runs without a NoSuchContract error. | Yes |
| `P2` | Swap the NFT trait to the local one for checking | clarinet check reports all contracts checked with no errors. | Yes |
| `P3` | Run both contract test suites | Core suite 18 passed / 0 failed. Sponsored suite 11 passed / 0 failed. | Yes |
| `P4` | Decide the campaign-drops question | Decision recorded in this file under decisions.campaignDrops. | Yes |

### T. Testnet rehearsal

| Step | What | Verify | Reversible |
|---|---|---|---|
| `T1` | Deploy the core to testnet | The contract interface is retrievable from the testnet API. | Yes |
| `T2` | Set testnet fee units to the mainnet values | quote-single-tx-fee(u16384, u1) returns single-tx-fee u11000. | Yes |
| `T3` | Unpause and run the mint flows on testnet | The sponsored mint leaves the recipient owning the token with a zero STX balance change, and the payer charged 11000 microSTX. | Yes |
| `T4` | Point a staging build at the testnet core and mint through the app | A file inscribes from the UI, and the signing screen shows a LessEqual condition at the quoted fee, not an exact match. | Yes |

### M. Mainnet core deploy

| Step | What | Verify | Reversible |
|---|---|---|---|
| `M1` | Deploy the core to mainnet | The contract interface is retrievable and is-paused returns true. | **No** |
| `M2` | Verify the deployed interface before touching anything else | All four functions appear in the interface. | Yes |
| `M3` | Set the mainnet fee units | quote-single-tx-fee(u16384, u1) returns single-tx-fee u11000 and total-fee u11000. | Yes |

### C. Cutover and continuity

| Step | What | Verify | Reversible |
|---|---|---|---|
| `C1` | Read the current next-id from v3.2.3 | You have the number. | Yes |
| `C2` | Pause v3.2.3 | is-paused on v3.2.3 returns true, and a transfer of an existing token still succeeds. | Yes |
| `C3` | Set next-id on v3.2.4 and unpause it | get-next-token-id on 3.2.4 matches C1, and a real mint produces the next id in sequence with no collision against 3.2.3. | Yes |

### S. Satellite contracts

| Step | What | Verify | Reversible |
|---|---|---|---|
| `S1` | Allow-list 3.2.4 on the three sponsored markets | is-nft-allowed returns true for 3.2.4 on each, and a 3.2.4 token can be listed and bought. | Yes |
| `S2` | Allow-list 3.2.4 on drops | A 3.2.4 token can be dropped and claimed end to end. | Yes |
| `S3` | Confirm the no-change contracts really need no change | Both succeed with no admin action taken. | Yes |
| `S4` | Redeploy drops for campaign support (ONLY if P4 said yes) *(conditional)* | A campaign drop can be created against a 3.2.4 token. | Yes |
| `S5` | Redeploy the gateway | Whatever depends on the gateway still resolves. | Yes |

### A. App pivot

| Step | What | Verify | Reversible |
|---|---|---|---|
| `A1` | Add the 3.2.4 capabilities entry | The app resolves capabilities for 3.2.4 without falling through to a default. | Yes |
| `A2` | Swap the registry entry, do not append | A 3.2.3 inscription still renders in the viewer, and new mints go to 3.2.4. | Yes |
| `A3` | Fix the fee model before shipping the pivot | A mint's signing screen caps at the quoted fee with LessEqual. | Yes |
| `A4` | Triage the remaining 3.2.3 references in source | Full app test suite passes. | Yes |

### V. Verify and monitor

| Step | What | Verify | Reversible |
|---|---|---|---|
| `V1` | Inscribe through the live app and check the fee actually charged | Transfer is 11000 microSTX and the post-condition is not an exact match. | Yes |
| `V2` | Run one sponsored mint in anger | Recipient owns and is creator. Recipient STX balance unchanged. | Yes |
| `V3` | Watch for post-condition aborts for 48 hours | Zero post-condition aborts. | Yes |

<!-- END GENERATED STEPS -->

---

## Known traps

Each of these cost time already.

- **`epoch = 'latest'`, not `3.1`.** A numeric epoch schedules the contract ahead
  of its own dependencies and `clarinet check` fails with an unhelpful
  `NoSuchContract("...xtrata-v1-1-1")`.
- **The trait line differs between the deployable file and the Clarinet copy.**
  Deployable uses the mainnet nft-trait principal; Clarinet needs the local one.
  Swapping is expected. Committing the swap into the deployable file is not.
- **Cores deploy paused.** Every call returns `ERR-PAUSED` (`u109`) until
  `set-paused false`. Both test suites do this first.
- **Fee updates are bounded.** A new fee must be at most double and at least a
  tenth of the current one, so moving from the `u100000` default down to `u10000`
  takes two calls.
- **Deploy via the SDK pinned to Clarity 3.** A wallet UI forces Clarity 4, under
  which `as-contract` in the migration path does not resolve.
- **Pausing 3.2.3 does not block transfers.** The contract says so explicitly
  (`;; IMPORTANT: transfers are NOT paused`), which is what lets the market, drops
  and `migrate-from-v3-2-3` keep working through the cutover.
- **Do not ship the pivot on the current fee model.** `src/lib/contract/fees.ts`
  still returns `300000` for a single-tx mint that costs `11000`. Step `A3`.

## Open decisions

- `decisions.campaignDrops` in `steps.json` is unset. It gates step `S4` and is
  the only thing that changes the size of this migration. Decide it in phase `P`.
- Whether the gateway is still consumed by anything. If not, `S5` can be dropped.
- Whether to bundle any other core change now, given the collection split above
  makes a second core deploy expensive.
