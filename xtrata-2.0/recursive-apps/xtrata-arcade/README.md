# Xtrata Arcade Hall

The 3D hall of 21 cabinets. v1.0–v1.3 were inscribed as single ~3.9 MB files
(#3076, #3077, #3078). From v1.4 the hall is built from **parts**, grouped into
five **packs**, and assembled on-chain by a small **parent**, so a release only
inscribes what changed.

## Layout

```
src/parts/           one file per part: the source of truth (edit these)
src/skeleton.html    the single-file layout with @@part:NAME@@ slots
build/hall-parts.cjs shared split / pack logic (also inlined into the parent)
build/modular.mjs    split | check | build
parent/              parent.template.html + ids.json (inscription ids)
tests/               hall-parent.test.cjs: boots the real hall from a mocked chain
release/             the inscribed single-file versions (v1.3 = #3078)
dist/                build output: packs/, parent, single-file build, manifest.json
```

## Packs

| Pack | Parts | Size | Changes |
|---|---|---|---|
| `assets` | fonts, cabinet art, logo, sprite sheet | ~1.6 MB | rarely: new art only |
| `three` | Three.js | ~590 KB | never |
| `engine` | room CSS, kit, music, score client, replay, room, boot | ~150 KB | wallet / scoring fixes |
| `games` | the 21 cartridges | ~1.3 MB | game updates (or override one game) |
| `hall` | hall CSS, markup, 3D hall code | ~190 KB | most often |

The parent (~19 KB) takes each part from, in order:
1. its own inscription (`parts` in `parent/ids.json`, e.g. one updated game),
2. its pack (`packs`),
3. the single-file release in `bundleId` (#3078).

So packs that did not change never need inscribing: they come out of #3078.

## Releasing

The launch canary does all of this on chain, in order and checked: see
`canaries/arcade-launch/README.md` (`npm run build:canary:arcade-launch`). By hand:

1. Edit `src/parts/*`.
2. `node build/modular.mjs build`: it prints which packs changed since #3078.
3. Inscribe only the changed packs from `dist/packs/` (and/or single parts).
4. Put their ids in `parent/ids.json`, run the build again, inscribe
   `dist/xtrata-arcade-parent.html`.
5. `node tests/hall-parent.test.cjs` before inscribing (see below).

`node build/modular.mjs check` proves the split still rebuilds #3078 byte for byte.

## v1.4

- **Top 10 on idle cabinets.** Each idle screen cycles: its attract loop, then
  the Top 10 over the still-running attract, then any timed-variant Top 10.
  The #1 name stays in a strip along the top during the attract loop.
  Empty or unreadable boards are skipped. Timings: `SCREEN_BOARD` in `hall.js`.
- **Connect before you sit down.** A run is bound to the wallet it starts with,
  so a practice run can't be posted afterwards. When not connected, the ready
  card now leads with **Connect wallet** (Enter/Space), practice is secondary and
  labelled as unpostable, and connecting reopens the machine as a ranked run.
  The hall's START prompt shows RANKED / PRACTICE before you walk up.
- **Leather fix.** Post-conditions and args go to wallets as bare hex (Leather
  rejects `0x`: "Not a serialized post condition"). The parent also strips `0x`
  for Leather, which fixes older engine packs too.

This release inscribes only `engine` (~150 KB) + `hall` (~190 KB) + the parent.

## Tests

```bash
# needs playwright + @stacks/transactions on NODE_PATH, Chromium with SwiftShader
node build/modular.mjs check
node build/modular.mjs build
CHROME_PATH=/path/to/chromium node tests/hall-parent.test.cjs [shotsDir]
```
