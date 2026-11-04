# DOG Army art + data contract (shared by the art, cabinet and game streams)

Folder: /home/claude/dog-army  (final home: xtrata-2.0/public/casino-machines/dog-army/ on Jim's Mac)
GAME_ID / slug: `dog-army`. Pack name: `DOG Army`. Pack `color` #0c0a09, `accent` #e7e5e4. Global art var in the game page: `window.DOGARMY_ART`.

## Rule zero: nothing invented
Every number, hash, id, amount and image in `art/dog/` is either read from a real source (record the URL and fetch time) or marked
`"status":"unavailable"` with `null` values and a reason. Do not guess, round up, "remember" or fabricate chain data. A value taken
from Jim's brief (prompt part 4) but not confirmed on a source is `"status":"brief-only"`, and the game labels it so.
`status` is one of: `verified` (read from a primary source), `brief-only` (stated in Jim's treatment, not independently read), `unconfirmed` (sources disagree),
`unavailable` (could not be fetched).

## Files the ART stream writes (all under art/dog/ unless noted)
`data.json`:
```
{ "fetchedAt": ISO,
  "halving":   {height:840000, hash, time(ISO), source, status},
  "rune":      {id:"840000:3", number:3, name, spacedName, symbol, divisibility, supply, premine, etchingTx, etchedBlock, holders|null, source, status},
  "snapshot":  {height|null, status, candidates:[840249,840269], blockHash|null, time|null, notes, sources:[]},
  "runestone": {perHolderDOG:889806, recipients:112383, firstDayWallets:74000, sources:[], status},
  "stacks":    {alex:{contract, name, symbol, decimals, supply, image:"img/alex-runes-dog.png"|null, status, source},
                pontis:{contract, name, symbol, decimals, supply, image|null, status, source}},
  "transfers": [{txid, block, time, amount(decimal string, DOG), from(short), to(short), source, status}]   // >= 24 real DOG transfers, spread over time, none duplicated
  "milestones":[{id, label, value, detail, source, status}]                                                // >= 9 distinct real DOG holder / supply / airdrop milestones (dog tags)
  "runestones":[{inscriptionId, number, img:"img/runestone/<n>.jpg", source}]                              // >= 18 real Runestone inscriptions, thumbnails <= 256 px, <= 20 KB each
  "logos":     {dogBlack:"img/dog-logo-black.png"|null, dogWhite:"img/dog-logo-white.png"|null, status, source, needsPermission:true}
}
```
`img/` holds only the small images the game bundles. `art/sources.json` lists EVERY image and record (kind, source URL, fetched, method, status)
plus a `needsPermission` list (the $DOG logo, the ALEX and Pontis token images, Leonidas's PFP = none supplied, Runestone artwork).
Leonidas: his PFP was supplied by Jim and lives in `art/supplied/leonidas-pfp.jpg` (not in the ART stream's tree). The wild draws it; the name card with a crest is only the fallback. Needs his OK before public use.
The art stream writes `art/dog/DATA-DONE` (a text file listing what is verified / unavailable) when finished.

## Interface between cabinet and game
Named parts (cabinet): `screenMesh`, `crest` (the turning moon topper), `spinPhysical`, `lever`, deck buttons with userData.action in
spin, betUp, betDown, auto, pays. Light rows `px-tag0` .. `px-tag7` (bottom to top; every row is TWO meshes, left and right side columns,
both named `px-tag<i>`, each with its OWN cloned emissive material). Brass button rows and the marquee may be anything.
The game's `api.mechanics()` returns `tags` (array of 8 numbers 0..1, glow per tag row) in place of Mooneeb's `ladder`, plus `lights`, `jackpot`, `scene`.
The cabinet stream writes `build/CABINET-DONE` when build/model.json is final. build/model.json currently holds Mooneeb's cabinet as a
PLACEHOLDER so the game stream can build; it is replaced when the cabinet is done.

## Ownership (do not edit files another stream owns)
ART stream: art/** (not art/brand), art/sources.json, tools/fetch-*.mjs (new ones allowed).
CABINET stream: src/cabinet.js, tools/cabinet-build.html, tools/build-cabinet.py, build/**.
GAME stream: everything else (src/game.*.js, src/game.css, src/game-body.html, index.html, tools/build-pack.mjs, checks/**, README.md, INTEGRATION.md).
src/engine.js, engine.sha256, layr.js, compat.js, software.js, xlogo.js, canvasengine.js are UNCHANGED copies: nobody edits them.
