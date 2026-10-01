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
node canaries/audionauts-replacement/serve.mjs            # open http://localhost:8787 and try them yourself (live inscriptions via xtrata.xyz)
node canaries/audionauts-replacement/make-revisions.mjs   # (re)builds _claude_scratch/audionauts-v1-recursive-revisions/
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
   (or an Xtrata admin), connect the owner (audionals.btc) or operator admin
   (xtrata.btc) wallet, and open Audionauts 1.0.
2. Artwork & metadata → **Replace unminted files** → *Replace automatically*: choose
   the revised `084.html` and `090.html` together. They are matched to 84 and 90 by name.
3. The studio uploads them and stops. Open **Preview new file** next to each: that is
   the uploaded file served by the live server, loading #3060 recursively. Open the star
   and check LIQUIDEZ · Χ₮¡₪¢₮ plays. Nothing is on-chain yet; Cancel is still available.
4. Press **Continue automatically** and approve the wallet prompts as they appear: one to
   register the new files, then one per old file to remove its registration. The studio
   waits for each to confirm. No STX moves.
5. When it says **Done … all registered on the contract**, the collection still has 111
   files and the registration check has been carried over, so the launch checks pass.
   (If the earlier check was out of date, it asks you to press *Check registration* instead.)
6. Open minting yourself when ready. Nothing in this flow unpauses.

If anything is interrupted, reopen the panel and press **Continue automatically**: it
re-reads the chain and resumes at the right step (a submitted transaction is waited on again). Cancel is only offered
before anything changed on-chain.
