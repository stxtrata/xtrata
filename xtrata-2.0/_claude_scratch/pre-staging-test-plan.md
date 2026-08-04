# Pre-staging test plan

**Branch:** `release/staging-candidate-20260804` -> `main-staging`
**22 commits, 36 files, +6533 / -114**

---

## 1. Only one group of changes can break anything

| Group | What | Runtime risk |
|---|---|---|
| **A. App and SDK code** | `fees.ts`, `post-conditions.ts`, `MintScreen.tsx`, `CollectionMintScreen.tsx`, `home/main.js`, `xtrata-sdk/mint.ts`, `workflows.ts` | **This is the whole risk.** Users hit this |
| B. v3.2.4 contract work | candidate `.clar`, clarinet project, mock-builder, 5 test suites | **None.** Not deployed. Cannot affect the running app |
| C. Docs and drafts | merge plan, integration guide, `_claude_scratch/*` | None |
| D. New tooling | `xtrata-state-snapshot.mjs`, `state/*.json` | None unless run, and it is read-only |

**So test group A. Everything else is inert with respect to staging.**

Group A is really one thing: the fee work. The client used to read the legacy aggregate
`get-fee-unit` and apply it to everything. It now transcribes the contract's five granular
units, and the single-tx post-condition cap dropped from 300,000 microSTX to 2x the real
fee, a 27x tightening.

**A cap that is too tight aborts the mint and burns the miner fee.** That is the failure
mode to hunt. DeOrganized burned 54,730 microSTX on an aborted mint this week, for a
different reason, so it is not hypothetical.

---

## 2. Automated gate: run, all green

| Check | Result |
|---|---|
| App suite | **2209 passed**, 230 files |
| SDK suite | **116 passed**, 17 files |
| SDK typecheck | Clean |
| Production build (`npm run build`) | **Succeeds**, all static apps emitted |
| Clarinet suite | **322 passed**, 35 skipped |
| Contract variants sync/verify | Clean |
| `npm run test:v3.2.4` | 6 contracts checked, **79 checks** across 5 suites |
| Live fee parity vs mainnet | **14/14** at 1, 2, 8, 31, 32, 33, 64, 65, 100 chunks |

That last one is the strongest evidence the arithmetic is right. It calls
`quote-inscription-fee` on the live core and compares it to the client formula at every
chunk count including both sides of the 32/33 batch boundary.

**Known pre-existing failure:** `npm run lint` reports 4 errors, all in
`build-canary.mjs` and `build-demo-v3.mjs`. Both files are already in `main-staging` and
neither is touched by this branch. Not a regression, but if CI runs lint, main-staging is
already red.

---

## 3. What automated tests cannot prove

The formulas are verified against the chain. What is **not** verified is that the app wires
the right formula into the right transaction. That needs a real mint.

### Test 1: single-tx mint. Do this one.

The highest-risk path. `MintScreen` now branches on `shouldUseNativeSingleTx` and applies
`feeCaps.singleTxMicroStx` instead of the old flat estimate.

Inscribe one small file (under 16 KiB, so one chunk) through the UI on mainnet.

| Check | Expected |
|---|---|
| Fee shown on screen | **11,000 microSTX** (0.011 STX) |
| Spend cap in the wallet prompt | **22,000 microSTX** |
| Transaction | Confirms. Does not abort |
| Actual protocol fee in the tx events | 11,000 |

If the wallet shows 300,000 you are on old code. If it aborts with `u103` the hash is
wrong, not the fee. A fee-cap abort shows as a post-condition failure, not an err code.

### Test 2: staged mint. Do this one too.

Different code path, different caps, and the expensive failure mode: a seal cap that is too
low aborts **after** the begin fee and every upload batch have already been paid.

Inscribe something over 512 KiB so it cannot use single-tx.

| Check | Expected |
|---|---|
| Fee shown | 201,000 for 1 chunk, 232,000 at 32, 332,000 at 33+ |
| Begin cap | 100,000 |
| Seal cap | 200,000 up to 32 chunks, 300,000 above |
| All three transactions | begin, upload, seal all confirm |

### Test 3: the 32/33 boundary. Worth it if you have five minutes.

The batch-divisor commit changed arithmetic exactly here, and the fee jumps 100,000
microSTX crossing it.

Quote a 33-chunk item in the collection flow and confirm the displayed staged total reads
**332,000**, not 232,000.

### Test 4: displayed numbers on the other screens

`CollectionMintScreen` and `home/main.js` both changed. No transaction needed, just look.

Any fee shown should read as 0.011 STX for a typical article, not 0.1 or 0.3. If any screen
still shows a number derived from the old flat aggregate, it will look roughly 10x too big.

### Test 5: sponsored market claims. Only if it is on your critical path.

`market-sponsored-claims.test.ts` changed and is covered by the suite. One manual click
through a sponsored buy if you rely on it, otherwise skip.

---

## 4. Reference: every number, so you can check at a glance

Computed from the current branch at the fee units live on mainnet today.

| Chunks | Single-tx shown | Single-tx CAP | Staged shown | Staged caps begin/seal/total |
|---|---|---|---|---|
| 1 | 11,000 | 22,000 | 201,000 | 100,000 / 200,000 / 300,000 |
| 2 | 12,000 | 24,000 | 202,000 | 100,000 / 200,000 / 300,000 |
| 8 | 18,000 | 36,000 | 208,000 | 100,000 / 200,000 / 300,000 |
| 32 | 42,000 | 84,000 | 232,000 | 100,000 / 200,000 / 300,000 |
| 33 | 43,000 | 86,000 | 332,000 | 100,000 / 300,000 / 400,000 |
| 64 | 74,000 | 148,000 | 332,000 | 100,000 / 300,000 / 400,000 |

**One reassuring property worth knowing.** The single-tx cap is exactly 2x the real fee,
and the contract's own `assert-valid-fee-update` caps any single fee change at 2x. So even
a worst-case admin fee change landing between your quote and your broadcast is absorbed
exactly, with the `<=` passing on the boundary. The cap is tight but not fragile.

---

## 5. What not to bother testing

| | Why |
|---|---|
| Anything in `contracts/drafts/v3.2.4/` | Not deployed. It cannot run |
| The clarinet v3.2.4 project and its 5 suites | Already run, 79 checks green, and inert either way |
| `xtrata-state-snapshot.mjs` | Read-only, no key, no broadcast. Already run against mainnet |
| The docs and the reply drafts | Text |
| v3.2.4's burn-block expiry, delegation, migration | Covered by the clarinet suites and nothing on mainnet uses them |

---

## 6. Verdict

Automated coverage is strong and the arithmetic is verified against the live chain. **Tests
1 and 2 are the ones I would not skip**, because they are the only way to prove the app
wires the verified formulas into the actual transactions. Both need a real mint on mainnet,
and both are cheap: 0.011 STX and about 0.2 STX respectively, plus miner fees.

Tests 3 to 5 are worth doing but would not stop me merging.

The merge itself is a fast-forward with no conflicts, and `main-staging` is already merged
in, so there are no surprises left in the merge mechanics.
