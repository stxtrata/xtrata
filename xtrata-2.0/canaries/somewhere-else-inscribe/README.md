# Somewhere Else inscriber

One self-contained page that takes the frozen article all the way onto Stacks through Xtrata, with **no wallet prompts**:

1. **Your wallet.** You type the address that should end up owning everything, twice.
2. **Preflight.** Verifies the 24 WebP images, the article source and the reader template against the pins, checks the core is
   open, finds anything already on chain from an earlier run, and prints the exact amount to fund.
3. **Temporary wallet.** Created in this browser; its key file is downloaded and you confirm it is saved.
4. **Fund.** You send that amount (from any wallet or exchange) to the temporary address shown. The page watches for it.
5. **Images.** The 24 WebPs are inscribed one at a time, looked up by hash first so nothing already on chain is re-sent. An image flagged `inArticle: false` in `manifest.json` (slot 9, cut from the text after it was inscribed) is still inscribed and handed over, but the article does not reference it, so the article carries 23 images.
6. **Article.** `buildArticle` writes each image's new inscription ID and hash into the article HTML, then it is inscribed.
7. **Reader.** `buildLoader` pins the reader to the article's ID and hash, then it is inscribed. This is the shared link.
8. **Verify.** All 26 are read back through the contract and every hash and byte is recomputed.
9. **Hand over.** The 26 inscriptions are transferred to your wallet, one transaction each.
10. **Sweep.** Every remaining micro-STX goes to your wallet, leaving the temporary wallet empty.
11. **Report.** IDs, reader link, `ids.json`, and the edits still to make in the documents.

## Build

```bash
npm run build:canary:somewhere-else                       # verify against pins.json and build
npm run build:canary:somewhere-else -- --owner SP...      # a copy that can only ever pay to that address
npm run build:canary:somewhere-else -- --pin              # re-pin after an intended change to the assets
```

Output: `canaries/build/somewhere-else-inscribe-canary.html` (about 4 MB, everything embedded). Open it over `http://`
(`python3 -m http.server 8080`) or straight from disk in a normal, non-private window. Options: `--resolver https://xtrata.xyz/inscription/{id}`
(how an ID becomes a link inside the article and in the report), `--token-uri https://...`, `--fee-mult 1.5`.

`assets/` holds the frozen inputs: `webp/01..24.webp`, `manifest.json` (alt text, size, sha256, rolling hash per image),
`source-article.html` (the article as exported from the document) and `loader.template.html`. To change the article text,
replace `source-article.html` and re-pin; to change an image, replace the file and its manifest entry (the Python kit in
`Somewhere-Else-chain-kit.zip` regenerates the manifest) and re-pin. `article.ts` is a byte-for-byte port of the kit's
`build_article.py` / `build_loader.py`.

## Cost

About **5.1 STX** all in at the default settings: miner fees about 4.4 STX (the 26 transactions carry about 3 MB in total, priced at
the network floor of 1 micro-STX per byte x 1.5, since live uploads have run between 1.0x and 2.9x the floor), about 0.46 STX of
Xtrata protocol fees, and about 0.26 STX for the 26 hand-over transfers and the sweep. The page asks you to fund about **6.0 STX**,
which includes a 15% margin; whatever is unspent is swept back to you. The figure is recomputed live from the contract's quotes
and the multiplier field, and again for what is left after a stop, so trust the number on the page. If the miner fee runs
above the multiplier the page says how much more to send and waits.

## What gets recorded

- The inscriptions are **owned** by your wallet after step 9.
- The on-chain **creator** of each inscription is the temporary wallet, because the creator is whoever minted it. The
  article itself says "By Jim Crane"; the chain's creator field will show the temporary address.
- Each inscription carries a token URI (an https address, required to be non-empty by the contract). The default is Xtrata's
  standard placeholder; change it in the field at the top before step 3 if you want something else.

## If something stops

Everything is re-read from the chain, so re-running a step only does what is missing. Reloading the page keeps progress and
the key; a transaction that was already broadcast is waited on, not re-sent.

- **Send everything to my wallet now** transfers whatever the temporary wallet owns to your wallet and sweeps its STX.
- **Save the temporary key again** / **Restore a key I saved** if the browser storage was cleared.
- **Forget pending transactions** if a broadcast transaction was dropped by the network (the chain is re-checked first).
- **Forget local progress** clears the page's memory only; the key is kept.

Keep the key file until the report says every inscription is in your wallet and the temporary wallet holds 0 STX.

## Test

```bash
NODE_PATH=<dir with playwright, @stacks/transactions v6, c32check> node canaries/somewhere-else-inscribe/mock-chain-test.cjs
```

Runs the whole flow against a strict in-memory mock of the core and the Hiro API: funding in two stages, a second run after
"Forget local progress" that sends nothing, a rejected broadcast, a transaction left pending across a reload, rescue after an
interruption, a corrupted chunk on read-back, a file already inscribed by someone else, address validation, and a tampered
image refused at build time.

## Re-pinning after a text change
Edit `assets/source-article.html` (and `manifest.json` if images change), run `node scripts/build-somewhere-else-canary.mjs --pin`, review the diff, rebuild. Images already on chain are found by hash and skipped, so a later build only inscribes what is new (article, reader). If the browser that ran an earlier build still holds the temporary wallet, the new build picks up where it stopped; otherwise use "Restore key" with the downloaded key file.
