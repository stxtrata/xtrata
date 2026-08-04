# Wizard Round 3 — Audio Samples and the Staged Upload Path

Round 1 wrote text. Round 2 trades it. Round 3 is the first round that exercises **large files**, and it needs a capability the fleet does not have: staged multi-transaction inscription.

## 1. The capability gap

`scripts/wizard/inscribe.mjs` only calls `mint-single-tx` / `mint-single-tx-recursive`. That path is capped at **32 chunks = 512 KiB**. Anything larger needs the staged path — `begin-inscription` → `add-chunk-batch` × N → `seal-inscription` / `seal-recursive` — which the wizard has never used. Building that is the substance of this round.

The staged path is not a bigger version of the same thing. It is a **resumable multi-transaction session with server-side state**, and it introduces failure modes single-tx does not have: a session begun but never sealed, a chunk batch that lands out of order, an upload that expires (`UPLOAD-EXPIRY-BLOCKS` 4320, ~30 days), and a seal that runs against a running hash that does not match. The core's `get-upload-state` is the read that makes all of it recoverable.

## 2. Costs, measured live

| Size | Chunks | Mode | Protocol fee | Transactions | Est. total with miner fees |
|---|---|---|---|---|---|
| 300 KB | 19 | single-tx | 0.029 STX | 1 | ~0.06 STX |
| **512 KB** | **32** | single-tx | **0.042 STX** | 1 | ~0.07 STX |
| **528 KB** | **33** | **staged** | ~0.33 STX | 4 | ~0.45 STX |
| 1 MB | 64 | staged | 0.332 STX | 4 | ~0.45 STX |
| 2 MB | 128 | staged | 0.532 STX | 6 | ~0.71 STX |
| 5 MB | 320 | staged | 1.132 STX | 12 | ~1.49 STX |

**The 32/33-chunk boundary is a cliff, not a slope.** One chunk more than 512 KiB costs roughly **8× as much** — 0.042 → 0.33 STX — because staged charges a begin fee, a fee per upload batch, and a seal fee, where single-tx charges one. A 528 KB sample and a 1 MB sample cost the same.

That single fact should drive how the sample library is built: **anything that can be trimmed under 512 KiB should be**, and crossing the line should be a deliberate choice, not an accident of encoding.

## 3. Budget

Round 2's 0.5 STX cap does not fit here. A single 1 MB staged inscription is ~0.45 STX on its own.

| Guard | Round 3 value | Why |
|---|---|---|
| Per-round cap | **1.5 STX** | Enough for the boundary pair plus one staged file plus headroom. Still ~10% of the float. |
| Session cap | **3.0 STX** | Two rounds. |
| Wallet floor | 4 STX unattended | Unchanged. |
| Largest test file | **1 MB** | 2 MB and 5 MB are provably the same code path at 1.6× and 3.3× the price. Prove the path, not the patience. |

Anything above 1 MB should be a one-off, deliberately approved, not part of a repeatable round.

## 4. The sample library — measured

Source: `/Users/melophonic/Documents/Xtrata/Audio Samples`, 119 files, 741 MB, in two sets (`XTRATA_BASS_32bar`, `Xtrata 8-bar bass samples`) as MP3/WAV pairs of bass loops.

| | Files | Min | Median | Max | Fit single-tx (≤512 KiB) |
|---|---|---|---|---|---|
| **MP3** | 59 | 197 KB | 959 KB | 5.0 MB | **11 of 59** |
| **WAV** | 57 | 1.7 MB | 10.3 MB | 37.3 MB | **0 of 57** |

Costs at current fees, live-quoted:

| Representative file | Chunks | Protocol | Txs | ≈ Total |
|---|---|---|---|---|
| Small MP3 (under 512 KiB) | ≤32 | 0.042 STX | 1 | **~0.07 STX** |
| Median MP3, 959 KB | 60 | 0.332 STX | 4 | **~0.45 STX** |
| Largest MP3, 5.0 MB | 320 | 1.132 STX | 12 | **~1.49 STX** |
| Median WAV, 10.3 MB | 643 | 2.232 STX | 23 | **~2.92 STX** |

### Two findings that constrain everything

**Two WAVs cannot be inscribed at all.** The core caps an inscription at `MAX-TOTAL-CHUNKS` 2048 = 32 MiB. `XTRATA 8BAR 18 - Liquid DnB Glide 174 (Bass).wav` is 37.3 MB / 2386 chunks and `XTRATA 8BAR 05 - Sub Dungeon 140 (Bass).wav` is 32.5 MB / 2082 chunks. `quote-inscription-fee` refuses both. They need trimming, resampling, or splitting before they are inscribable on any budget.

**The WAV library is economically out of reach.** At ~2.9 STX for a median WAV, all 57 would cost roughly **165 STX** — eleven times the fleet's entire float. Even one is six times a full round-2 budget.

So the WAVs are not a test target. They are the reason the cliff matters, and at most one should ever be inscribed, deliberately, as the documented expensive case.

**MP3 is the library format.** The 11 small MP3s are cheap enough to inscribe freely; the 48 larger ones are the staged-path test material at ~0.45 STX each. Worth noting that re-encoding the median MP3 at a lower bitrate would very likely bring it under 512 KiB and cut its cost by **8×** — which is a real recommendation for the library, not just the test fleet.

## 4a. The library parent — #2909, and why ownership matters

`#2909` is the parent for **Suno Bass Sample Library 1**. Read off chain:

| | |
|---|---|
| mime | `text/plain`, 27 bytes, 1 chunk |
| creator / owner | `SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX` |
| its own parent | `#2908` — so the library root already sits in a lineage |
| token-uri | an ArDrive URL |

**A real `parents` link requires the minting wallet to own the parent.** The core is explicit — `validate-parent` compares `nft-get-owner?` against `tx-sender` and fails `ERR-NOT-AUTHORIZED (u100)` if they differ, and `ERR-DEPENDENCY-MISSING (u111)` if the id does not exist. So citing #2909 as a parent is only possible from the wallet that holds it.

This is exactly why transferring #2909 to the inscribing wizard is the right move, and it unlocks something round 1 could not do: **true lineage rather than dependency edges.** Round 1's thread used dependencies because three wallets cannot own each other's entries. Here one wizard owns the root, so every sample can declare `parents: [2909]` and appear as a genuine **child** of the library in the explorer's lineage view — which is what a library wants, and what a dependency edge does not give.

Two consequences to plan around:

1. **One wizard does all the inscribing** for this library, because only the holder of #2909 can cite it. Nominate it explicitly rather than letting the rotation pick. The Archivist is the natural choice — it already mints the manifests.
2. **Transfer #2909 before the round starts**, and have the runner verify ownership as a preflight. Minting with `parents: [2909]` from the wrong wallet aborts and burns a miner fee, so it should refuse before signing — the same discipline as the parent-quote check.

Worth noting #2909 has its own parent (#2908), so the samples will sit three deep: #2908 → #2909 → sample. That is real provenance and worth keeping intact.

## 5. Parent relationships

The samples are a library, not a thread, so the edge shape differs from round 1:

- **A library root** — a manifest inscription describing the collection, minted first.
- **Each sample** declares the root as a dependency, so a reader walking from a sample reaches the library.
- **Derived samples** (a trimmed version, a pitched variant, a stem) declare the sample they came from, which is the real provenance claim and the thing worth having on chain.

Same constraint as round 1: the core's `parents` means supersession and requires the sender to own each id, so cross-wallet links are **dependency** edges. Within a single wizard's wallet, real `parents` becomes available — worth testing at least once, since round 1 never could.

Edges point backwards only and there is no reverse index, so the library root cannot enumerate its members. The root manifest must list them, exactly as the thread manifest does, and it must therefore be minted **last** or updated by a superseding version.

## 6. Scenarios

| # | Scenario | Proves |
|---|---|---|
| 11 | inscribe a compressed sample well under the limit | audio MIME round-trips, plays back in the viewer |
| 12 | inscribe at exactly **32 chunks** | the single-tx boundary from below |
| 13 | attempt **33 chunks** as single-tx → must be refused | the cliff is enforced, not stumbled over |
| 14 | inscribe the same 33-chunk file **staged** | begin → batches → seal, the new capability |
| 15 | staged upload **interrupted after one batch**, then resumed | `get-upload-state` recovery; the failure mode single-tx cannot have |
| 16 | staged upload **sealed with a wrong expected hash** → must be refused | the core verifies the fold rather than trusting us |
| 17 | a derived sample declaring its source as a parent | provenance, and real `parents` within one wallet |
| 18 | library root manifest citing every sample | the collection is walkable |
| 19 | list a sample on a sponsored market | reuses round 2, on a large-file inscription |

Scenario 15 is the one worth the money. A resumable multi-transaction upload that survives interruption is the whole reason the staged path exists, and nothing in the fleet has ever tested it.

## 7. What must be built

1. **`stagedInscribe` in the wizard** — begin, batch, seal, with the same discipline as the rest of the fleet: intent journalled before each transaction, nonce-based crash resolution, never re-broadcast, stop on first failure.
2. **`get-upload-state` reconciliation** — before any batch, read what the chain already has and send only what is missing. This is the staged equivalent of the parent-quote check: it makes resumption correct rather than hopeful.
3. **A sample generator** producing files at exact chunk counts, so 32 and 33 are testable rather than approximate.
4. **A library manifest builder**, reusing the thread-manifest shape.
5. **Cost preflight that names the cliff.** If a file is 33 chunks, the plan should say plainly that trimming 16 KB saves ~0.29 STX, before anything is signed.

## 7a. Operating constraints (set 2026-07-31)

- **One sample of each kind per full round.** Not the library. More samples get created when a round needs them, so the runner reads whatever is staged rather than assuming a fixed set.
- **Opus is the format.** All samples are converted before they reach the wizard. This materially improves the economics: Opus at a usable bitrate puts a bass loop in the low hundreds of KB, so most samples should land **under the 512 KiB single-transaction line** — the cheap side of the cliff — where the MP3 median did not.
- **Nothing above 12 MB.** Files larger than 12 MB are discounted entirely, which also disposes of the two WAVs that exceed the core's 32 MiB hard cap. 12 MB is ~750 chunks, so the worst permitted case is still ~2.6 STX and remains a deliberate one-off rather than round material.
- **Funds can be topped up** for the inscribing wizard, so the budget below is a starting point rather than a ceiling. The caps stay in force regardless: a raised float should not silently raise what an unattended round may spend.

## 8. Recommended round 3 selection

Not the whole library. A round that proves the path and costs under the cap:

| Scenario | File | ≈ Cost |
|---|---|---|
| 11 — audio round-trips | smallest MP3 (197 KB, 13 chunks) | 0.05 STX |
| 12 — at the boundary | an MP3 trimmed to exactly 32 chunks | 0.07 STX |
| 13 — refused above it | the same file at 33 chunks, single-tx | 0 (refused before signing) |
| 14 — staged works | that 33-chunk file, staged | 0.45 STX |
| 15 — **interrupted and resumed** | the same upload, killed after one batch | included in 14 |
| 16 — wrong hash refused | a deliberately mismatched seal | ~0.03 STX (one aborted tx) |
| 17 — derived sample | a trimmed variant citing its source | 0.05 STX |
| 18 — library root | manifest citing the above | 0.05 STX |
| **Total** | | **~0.75 STX** |

Comfortably inside the 1.5 STX round cap, and it exercises every mechanism. The median-MP3 and WAV cases are provably the same code path at 1× and 6× the price, so they prove nothing extra.

Scenarios 12 and 13 need a file at an exact chunk count, which no library file happens to hit — so a small preparation step trims one MP3 to precisely 32 chunks and pads a copy to 33. That is the only generated content, and it exists because the cliff is the thing most worth testing.

## 9. Staging shape

Samples arrive in advance, so the runner reads a directory rather than being handed files inline:

```
scripts/wizard/samples/            (gitignored — audio is large and not source)
  manifest.json                    what to inscribe, and as what
  <name>.opus                      the samples themselves
```

`manifest.json` per entry: the file, its intended mime (`audio/opus`), a human title, the parent it belongs under (default `2909`), and optionally a `derivedFrom` naming another entry in the same batch for a variant. The runner resolves `derivedFrom` to a real inscription id once that entry mints, the same way the thread runner resolves a citation.

Preflight refuses, before signing, on: a file over 12 MB, a mime that is not `audio/*`, a parent the inscribing wizard does not own, and any file whose chunk count exceeds the core cap. Each of those otherwise costs a miner fee to discover.

## 10. Remaining questions

1. **Is this library meant to be permanent and public?** At 0.05–0.45 STX per sample these are publishing decisions rather than disposable test data, and unlike the round-1 text corpus they are not self-describing — a sample cannot explain itself. Worth deciding whether each carries a small companion text inscription, or whether the library root alone documents the set.
2. **Which wizard holds #2909?** I would nominate the Archivist and have the runner verify ownership as a hard preflight. Needs to be one wallet, because only the holder can cite it.
3. **Do the two oversized WAVs get fixed at source?** Now moot for this round under the 12 MB rule, but they still cannot be inscribed as they stand, on any budget.
