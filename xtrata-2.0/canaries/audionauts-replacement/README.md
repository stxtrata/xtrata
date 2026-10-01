# Replacing unminted files in a published collection — Audionauts 84 & 90

Collection `3c855746-4a78-4064-b4cf-e7487d671469`, contract
`SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX.xtrata-collection-audionauts-1-3c855746` (v1.7).

Editions 84 and 90 play LIQUIDEZ (#2983) as their featured secret song. Engine
#3060 prints `title · artist`, and LIQUIDEZ has no artist in its catalogue, so the
revised files add a small override that appends ` · Χ₮¡₪¢₮` when the title reads
`LIQUIDEZ`. Seeds, editions, artwork, song assignments and the engine reference
are unchanged.

| File | Old hash | New hash |
|---|---|---|
| 084.html | `f08c4e8995d12b7e0c40646dff18d9b43cf8f32b3b729a6a036a63fec1177613` | `0d840ffc009e4f42bf3c4040a99431228c982b645679b813f7c3691765da2b39` |
| 090.html | `5f17c06dd2cff405296a12dec6f14ec812b91a3dde76d611242fa0c4c0346f41` | `d02edc2b59579e6d1fb6508db5fd6e567f10d69cea70855a508c3396657cca48` |

Collection files stay out of Git: originals are read from and revisions written to
`_claude_scratch/` (ignored).

## Local checks (no wallet, nothing on mainnet)

From `xtrata-2.0`:

```bash
node canaries/audionauts-replacement/make-revisions.mjs   # writes _claude_scratch/audionauts-v1-recursive-revisions/
node canaries/audionauts-replacement/canary.mjs           # renders and plays original + revised 084/090 in headless Chromium
cd contracts/clarinet && \
  AUDIONAUTS_DIR=../../_claude_scratch/audionauts-v1-recursive \
  AUDIONAUTS_REVISED_DIR=../../_claude_scratch/audionauts-v1-recursive-revisions \
  npx vitest run tests/xtrata-collection-mint-v1.7-replacement.test.ts
```

The canary fetches #3060, #3059 and #2983 once from xtrata.xyz and serves them
locally; the Bitcoin-hosted original transmission is not loaded. The simnet test
runs on synthetic stand-ins when the two variables are unset.

## Operator steps (after this code is deployed)

1. Keep the collection **paused**. Sign in to `/manage` as the collection's creator
   (or an Xtrata admin) and open Audionauts 1.0.
2. Artwork & metadata → **Replace unminted files**. Find `84` and `90`, tick both,
   press **Replace 2 files**. (Refused if either is minted or reserved, or minting is open.)
3. Upload the revised `084.html` for 84 and `090.html` for 90. Check the shown hashes
   start `0d840ffc…` and `d02edc2b…`.
4. **Register 2 new files** — one wallet approval, no STX moves. Sign with the
   contract owner (audionals.btc) or operator admin (xtrata.btc). The panel waits for
   confirmation.
5. **Remove 2 old registrations** — one approval per file, each confirmed before the next.
6. **Finish replacement**. The collection still has 111 files; the originals are kept.
7. Prepare contract → *Register your files on the contract* → **Check registration**
   until all 111 show as registered. Open minting stays disabled until this passes.
8. Open minting yourself when ready. Nothing in this flow unpauses.

If anything is interrupted, reopen the panel: it re-reads the chain and resumes at
the right step (a submitted transaction is waited on again). Cancel is only offered
before anything changed on-chain.
