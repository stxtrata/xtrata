# Proof of Free — engine v3 inscription notes

## What changed from the inscribed engine (`/i/2838`)

**Bug fixes** (all three were confirmed by reproduction, not inspection):

1. `mulberry32(META.seed)` was fed a *string* for every edition ≥ 34, so the render RNG
   returned `0` forever — the particle field collapsed to one stacked point and
   `ctx.rotate(NaN)` silently dropped the glyph rotation. Now driven by `RNG_SEED`,
   which is numeric on both the released and future paths.
2. The seed-value selector alias (`337919` → `#1`) was unbounded, so genuine editions
   `330000 + 7919k` aliased onto 1–33. Now bounded to the released range.
3. Wrapper padding: editions 34–99 were 2-padded in the wrapper title while the engine
   displayed 4-padded. Both are 4-padded past 33 now.

**Restyle** — one aperture system replaces the three disconnected renderers
(`drawThresholdPortal` / `drawIris` / `drawPassage`). Every edition now draws the same
curve at different depths; family only weights the layers:

| layer | what it is | Thresholds | Signals | Names |
|---|---|---|---|---|
| depth | receding copies of the aperture | 17 rigid | 13 soft | 9 wide |
| blades | iris that never fully closes | — | full | partial |
| flow | light released *through* the aperture | 0.60 | 1.00 | 0.72 |
| ring | the zero / front frame | 1.00 | 0.86 | 1.10 |
| mark | base-36 edition glyph + corona | — | — | yes |

Motion cycle is charge → open → release → seal. Tapping fires a seal flash plus the tone.

**Cover** — the no-selector view is now the engine itself running behind a canvas
wordmark that morphs `PoF` → `Proof of Free`, with the `o` landing on the aperture's
vanishing point. The CSS keyframe letter animation is gone.

**Also**: `traits[]` array for marketplace surfacing, `lineage{}` block naming 2838 as
parent, `hashchange` re-init so fragment-only navigation re-resolves the edition, and
`.tap` is a real `<button>` (the old `role="img"` + `tabindex` combination was invalid).

## Engine facts

```
file          artifacts/proof-of-free-recursive-engine-v3.html
size          27,388 bytes   (was 31,036 — smaller despite doing more)
chunks        2              (16,384 + 11,004)
expected-hash 0xe7a35c737e6b34137d2f81b318e56519e10d54b51fbbee9a1538ab33c033bae8
```

`expected-hash` is the contract's incremental chain — `sha256(running || chunk)` starting
from 32 zero bytes — not a plain file digest. Recompute it if you touch the file at all.

## Inscribing as a child of 2838

Live contract is `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`.

Two lineage primitives exist and they are **not** the same thing:

- `parents` — `validate-parent` requires `tx-sender` to *own* the parent NFT. This is
  ownership-backed genealogy.
- `dependencies` — existence check only. It means "my content references that inscription".

The v3 engine is self-contained (it never fetches 2838 at runtime — that is the whole
point of an inscribed engine), so the honest encoding is:

```
parents      = [u2838]
dependencies = []
```

**Inscription 2838 is owned by `SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7`.** The parent
check compares against `tx-sender`, so the seal must be sent from that wallet or it fails
with `ERR-NOT-AUTHORIZED`. This is not the deployer (`SP3JNSEXAZ…743X`) and not the agent
wallet (`SP15T1W26…A9EJ`).

At 2 chunks it fits inside `MAX-SINGLE-TX-CHUNKS` (u32), so the whole thing can go in one
transaction via `mint-single-tx-with-relationships(expected-hash, mime, total-size, chunks,
token-uri, dependencies, parents)`. The staged route is
`begin-or-get` → `add-chunk-batch` → `seal-with-relationships(hash, uri, deps, parents)`.

Use the Stacks SDK directly, not the aibtc `call_contract` MCP tool — it sends empty
buffers for nested list+buffer arguments.

## Order of operations

```bash
npm install
node scripts/inscribe-engine.cjs                 # dry run — verifies, sends nothing
SENDER_KEY=<hex> node scripts/inscribe-engine.cjs --broadcast
```

`scripts/inscribe-engine.cjs` uses `mint-single-tx-with-relationships` (12,000 uSTX
protocol fee vs 202,000 for the staged route) and refuses to broadcast unless:

- the engine hashes to `0xe7a35c73…bae8` and is exactly 27,388 bytes
- parent 2838 exists and is sealed
- **the derived sender equals the on-chain owner of 2838**

The key comes from `SENDER_KEY` or `POF_MNEMONIC` only. There is deliberately no default
mnemonic in the file — this signs from the wallet that owns 2838, not from Agent 27.

Then:

1. Read the new inscription id `N` from the confirmed transaction.
2. `node scripts/build-collection.mjs https://xtrata.xyz/i/N --engine-id N` — rewrites all
   33 wrappers, the gallery and the manifest against the real URL. It refuses to run if
   the engine artifact and the genome have drifted apart.
3. Inscribe the 33 wrappers (~368 bytes each). Optionally give each `parents:[uN]` so the
   collection forms one tree: 2838 -> engine v3 -> 33 editions.
4. Paste the same URL into `apps/wrapper-generator/` for editions 34+.

The engine URL in wrappers **must** be absolute or root-relative — the gateway injects
`<base href="null">`, which breaks bare relative paths. The `file:` branch in each wrapper
is only so the same file still opens from disk; it is inert once served over https.

## Files

```
artifacts/proof-of-free-recursive-engine-v3.html   the engine — this is what gets inscribed
packages/collection-genome/genome.js               tables + metaFor(n), builder's truth
scripts/build-collection.mjs                       builder + genome/engine drift verifier
scripts/inscribe-engine.cjs                        guarded single-tx inscription broadcaster
wrappers/                                          33 seed files (placeholder URL until built)
apps/gallery/index.html                            local viewer for all 33
apps/wrapper-generator/index.html                  ZIP generator for editions 34+
manifests/collection-v6.json                       hashes, per-edition traits, trait counts
```

## Browser canary

`apps/canary/canary.html` inscribes from a wallet extension instead of a private key.
Serve the project (`npm run serve`) and open `/apps/canary/canary.html`. Six steps:
connect, verify parent 2838, verify the engine payload, inscribe the engine, inscribe
the 33 editions, rebuild locally. The wallet layer is ported verbatim from the Living
Synth v5 canary (originally the main Xtrata app's `src/lib/wallet/connect.ts`) — every
branch in it is a diagnosed Leather or Xverse quirk, so do not simplify it.

Auto-run signs the editions back to back: the wallet prompts for each one and the next
request fires once the previous transaction confirms. Declining, a failed transaction,
a missing txid or a 20-minute confirmation timeout all stop the run before the next
signature is requested.

### Duplicate prevention

**Edition 16 was inscribed twice — #2855 and #2856.** #2856 is a permanent orphan; the
canonical 16 is #2855, which is what `get-id-by-hash` returns and what the manifest
records. Exclude #2856 from the drop and from any holder tooling.

Cause: `nextEdition()` originally consulted only *confirmed* local progress, and the
only writer was the confirmation poll. A lost poll — a reload, a sleeping tab, a failed
fetch — left an edition looking un-inscribed while its transaction landed on chain, so
the next signature targeted it again.

Four guards now, in order of authority:

1. **`get-id-by-hash` before every signature.** The core contract keeps a `HashToId`
   map, so the chain can answer "is this exact content already inscribed?". If it is,
   the canary records the real id and moves on instead of signing a second copy. Reads
   retry with backoff and a final failure *stops the run* — a failed read is never
   treated as "not on chain".
2. **Chain sync** on page load, before every auto-run, and on demand. Rebuilds progress
   from all 33 content hashes.
3. **`nextEdition()` skips broadcast-but-unconfirmed editions**, not just confirmed ones.
4. **Single in-flight lock** on signature requests.

Note the core contract records first-seen hashes but does **not** reject duplicates —
`mint-single-tx-internal` mints regardless and returns `{token-id, existed}`. The guard
has to live in the client.

### Wallet fees

Neither wallet accepts a `fee` parameter for `stx_callContract` — Xverse takes only
`contract`, `functionName`, `functionArgs`, `postConditions`, `postConditionMode`, and
Leather only the first three. Xverse rejects out-of-spec fields before showing any UI
(the same reason `network` and `address` are omitted on that path), so sending a fee
would turn a high-fee prompt into a hard rejection. Adjust the fee in the wallet UI, or
use `scripts/inscribe-engine.cjs`, where `TX_FEE` is a parameter.
