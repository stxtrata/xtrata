# Sat Hunter: theme spec (shared by every file in this build)

Sat Hunter is a re-theme of **The Halving** (`tools/the-halving`, copied here) onto the Block Fortune v2 engine.
`src/bf-engine.js` and `src/layr-adapter.js` are byte-identical to Forever Twins' and MUST NOT be edited. Maths never changes.
Everything below is names, art, sound, copy, scenes and cabinet. Keep the Halving's function and variable names wherever you
can (the files call each other); change what they draw and say. GAME_ID = `'sat-hunter'`. Records global = `window.SAT_RECORDS`
(built from `art/records.json` by `build_records.py`; schema below). Accent colour `#00a6fb`.

## Rules that never bend
- Every symbol is a real sat from `SAT_RECORDS` (number, block, rarity, degree, name, check link) or a real fact (the pizza
  transaction, the genesis block). No invented numbers, dates or stories. Never imitate a project's logo. No NFTs, no twins,
  no "NOT YET FOREVER" (this machine has none). The only logos are the Xtrata mark and the ParallaX wordmark, used as given.
- The engine deals every result first; scenes only reveal. Picking which record shows in a cell uses Math.random / permFor, never
  the engine rng. A reload never re-rolls or double-credits (the Halving's flow already does this: keep it).
- No network is needed. Delete the live chain reads (mempool.space / Hiro). Nothing may fetch at runtime.
- Every bonus, jackpot and the gamble has four designed, animated stages (trigger, intro, play, summary), Skip, and a calmer
  reduced-motion version. Nothing is a placeholder: no plain boxes, no default text.
- Touch targets >= 44 px. Safe-area insets respected. Phone width works.

## Palette and type (use these names; p1_head defines them, every file uses them)
ACCENT `#00a6fb`, ACCENT2 `#6fd3ff`, ACCENT3 `#05689c` (glass blue: floor glow, trim, focus). BRASS `#d9a441`, BRASS2 `#f3cf7a`,
BRASS3 `#8a6224`, BRASS4 `#4d3612`. OAK `#2a1a10`, OAK2 `#3d2616`, OAK3 `#5a3a22`. INK `#07090c`, PAPER `#f1e9d6`, GLASS `#0b1a24`.
RED `#d6312a`, GREEN `#46c37b`. Fonts: COND (condensed), MONO, SANS as in the Halving; add SERIF
(`Georgia,"Times New Roman",serif`) for brass-tag engraving. Surfaces are procedural: oak grain, brushed brass, felt, specimen glass
with a faint reflection, rivets. A Victorian assay lab: warm oak and brass, one cold blue glass light.

## Rarity table (RAR, defined in p3_art; key = `rec.rarity`, or a tag for the community kinds)
| key | name on the brass tag | colour | engraving on the coin |
| mythic | MYTHIC | #ffffff / #bfe9ff, pulsing | eight-ray star, double rim |
| legendary | LEGENDARY | #ff9bd2 | rays + ring of dots |
| epic | EPIC | #ffd23f | sunburst, gold |
| rare | RARE | #5fd0ff | diamond lattice |
| uncommon | UNCOMMON | #8be28b | single ring, fine tick marks |
| black | BLACK (rec.blackName on the tag) | #1c1f24 with a bright edge | cut corner, matte |
| palindrome | PALINDROME | #c79bff | centre mirror line, digits mirrored |
| vintage | VINTAGE | #d8b07a | sepia, crackle |
| nakamoto | NAKAMOTO | #e8e3d3 | quill-cut rim |
| pizza | PIZZA | #ff8a3d | slice wedges |
| block9 | BLOCK 9 | #7fe3d0 | nine dots |
| range | SAT RANGE | #00a6fb | ruler ticks |
A record can carry several tags (`rec.tags`): the coin takes the colour of its slot's own type, and a small second tag (e.g. BLACK,
PALINDROME) shows when `tags` has more. The tile for each slot is drawn from that slot's pool in `SAT_RECORDS.types[slot]`.

## Slot to symbol (engine ids never appear on screen)
| slot | symbol | tile content |
| cherry | Uncommon sat | coin, sat number round the rim, block + "first sat of block N", UNCOMMON tag |
| lemon | Black sat | last sat of a block; BLACK tag (rec.blackName) |
| chip | Palindrome sat | digits shown mirrored about a centre line |
| block | Vintage sat | sepia coin, block < 1,000 |
| artifact | Pizza sat | rec has `label` + `fact` (verified transaction facts); `satStatus:'pending'` means no sat number yet: the rim engraves the transaction id and the number line reads `SAT RANGE: PENDING INDEX`. If `satStatus:'indexed'` it has a real sat number like the others |
| bitcoin | Epic sat (jackpot symbol) | gold sunburst; `rec.mined:false` shows a "NOT YET MINED · due about 2028" ribbon |
| wild | Rare sat | RARE, diamond lattice; used as the wild: show WILD on the tag |
| scatter | Nakamoto sat | quill rim; the scatter that starts free spins |
| vault | Block 9 sat | nine dots; starts the pick bonus |
| chain | Sat range | a real block range (first to last sat) under a small loupe; starts hold and respin |
Records per slot are in `SAT_RECORDS.types[slot]` (8 to 26 each). Also in the file: `hunts[]` (19 real block ranges, each with 19 `finds`: the
first sat, the last sat, and palindromes inside it), `mythic` (sat 0 with the genesis block data), `gamble[]` (68 real sat numbers with
`parity`), `exotic[]` (11 story sats for the vault tubes), `timeline[]` (early blocks for the Stash), `notes` (definitions).

## Bonuses (Halving analogue in brackets: re-theme that code)
1. **Satoshi's Stash** (free spins, 3+ Nakamoto sats; all wins 2x) [Halving Cycle]. The lab lights dim; a 2009 timeline across the top
   (`timeline[]`) lights one early-block sat per spin; a loupe sweeps. Counters: spins left, running total.
2. **Block 9 Vault** (pick, 3+ Block 9 sats) [Coinbase Messages]. Nine sealed sample tubes in a rack (cork, brass collar). Open three:
   a tube unseals, the sat inside rises into a loupe, showing its real number, block, name, rarity and one story line (from
   `exotic[]` and `types.vault[]`), plus the prize. After three, the other six unseal in turn (no value shown change).
3. **The Hunt** (hold and respin, 5+ sat ranges) [Hashrate]. One real range from `hunts[]` (chosen by roundId with permFor) scrolls
   under a big loupe (sat numbers streaming). Each lock pins a real sat from that hunt's `finds` with its rarity and value (value 10:
   the first sat; 5: the last sat; others: palindromes; never repeat a sat in one round). Respin = the empty cells scan, a miss shows
   NOT IN RANGE, a hit stamps FOUND and the sat is engraved on a plate. All 15 found = the Mythic jackpot too.
4. **Jackpot: Mythic** (five Epic sats on the centre row) [21 Million]. Full-screen: the loupe settles on sat 0 (`SAT_RECORDS.mythic`):
   its name `nvtdijuwxlp`, `0°0′0″0‴`, block 0, the genesis headline, and the line "THE MYTHIC SAT. IT CAN NEVER BE SPENT." Meter
   counts up, topper and cabinet light show, a choir.
5. **Gamble: Odd Sat or Even Sat** [Halve or Double]. Engine decides the outcome (50/50). The reveal shows a real sat number from
   `gamble[]` whose parity matches what the engine decided (so the player sees an honest real number); the player's call is odd or even.
6. Lab-only machine events: **Rare find** (the side counter pauses and glows as a rare sat passes; no LAYR) and **Period snapshot**
   (the Holder Pot closes and is divided among linked wallets: display only, stubbed) [Halving Day, Epoch snapshot].
Bonus names, one-line rules and button text come from these names: "Open three. Each tube holds a sat." and so on.

## Holder layer (version 1: meters and display only)
Period = one UTC week (Monday 00:00 UTC to Monday 00:00 UTC); no chain read. Holder Pot = 1% of every paid bet (house edge), in state.pot.
Display: "HOLDER POT n LAYR · PERIOD ENDS IN 3d 4h". Linked wallets holding uncommon or rarer sats share it one share per wallet; wallet
linking and the sat index read need a server: leave named stubs (`linkBitcoinWallet`, `readWalletSats`) with a TODO line; the UI says
"WALLET LINKING: NOT LIVE YET" and "SHARE PER WALLET: UNKNOWN" (never "0 wallets"). Cameo royalty: none (no NFTs): `recordCameos()` returns [].
The Test panel has a "linked wallets" sample (none / some / many) that only changes the displayed share, so the display can be checked.

## Cabinet (model/build_model.py; named parts the room expects)
Victorian assay bench: dark oak (#2a1a10) with brass corner plates, drawers of labelled sample tubes down each side, a sheet of glass
over the screen like a specimen case. Parts: `screenMesh` (once), `crest` (big brass jeweller's loupe turning slowly over a glowing sat:
the topper, turns on its own clock), `topperPlate` (small plate under the loupe that shows the game's live `topper` canvas, 1024x320,
baked texture without it), `counterL` and `counterR` (the two side tapes that show the game's `counter` canvas, 256x1024), `spinPhysical`,
`lever` (brass gold-panning rocker handle, rotates on rotation.x; also carries action spin), `leds` (blue glass lamps), deck buttons
with actions: `spin` HUNT, `betUp` +SATS, `betDown` -SATS, `auto` AUTO-HUNT, `pays` RARITY. Lower door: "EVERY SAT HAS A STORY" plus the
Xtrata mark drawn from `model/assets/xtrata.svg` (never redrawn or recoloured). The ParallaX wordmark small on the marquee foot only.
Marquee reads SAT HUNTER. Souvenir ticket slot as in the other cabinets. Floor glow colour #00a6fb.
Optional extras the game exposes on PX_CASINO_ENGINE (the room may ignore them): `topper` + `topperRevision()`, and `counter` + `counterRevision()`.

## Sound (procedural, p2_ui)
Fine metallic chimes on reel stops (sine/triangle, high, rising with the reel index), a magnifier "zoom" (a quick upward filtered sweep
and click) on every rare find, a glass clink on tube unseals, a stamp thud on locks, a choir (stacked detuned vowel-ish formant tones)
on Mythic, an assay-lab hum ambient. Respect mute and volume as the Halving does.

## Names (use exactly)
Machine SAT HUNTER; spin HUNT; bet +SATS / -SATS (total bet label "SATS · TOTAL BET"); auto AUTO-HUNT; pays RARITY (button label RARITY, "pays & rules");
panels RARITY, FAIR PLAY, SATS (the records panel: every symbol's real sats with check links), HOLDER POT, LOG, LAYR, SETTINGS.
Gamble buttons: ODD SAT / EVEN SAT. Loading text "WARMING THE LAMPS". Tagline "EVERY SAT HAS A STORY".
Fair Play panel: same figures as the Halving (94.38%: lines 59.7, scatters 1.5, free spins 8.5, pick 11.9, hold and respin 10.3, jackpot 2.4;
1 in 140 / 140 / 290; jackpot about 1 in 113,000; the gamble is an even bet; design estimate, not a certified RTP).
