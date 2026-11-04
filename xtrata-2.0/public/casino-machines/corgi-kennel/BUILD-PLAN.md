# Corgi Kennel — build plan and design specification

Machine 21 · `corgi-kennel` · Series Bible 2.1 · 3 November 2026

## Intended deliverable

A complete standalone fruit machine in its own `corgi-kennel/` folder, with a working 3D cabinet, physical lead lever and deck buttons, the unchanged Block Fortune v2 game, finished themed bonus scenes, a safe Bonus preview/Lab, and an independently decodable pack ready for later casino integration. No casino file is edited. Jackpot and fund services remain explicitly labelled test adapters until the shared service exists.

Authoritative inputs are `21-corgi-kennel-prompt.md`, parts 1–5, and the shared sections of `Series-Bible-2.1.md`. This is a plan, not a record of completed checks. The accompanying acceptance matrix distinguishes required evidence from results not yet obtained.

## Resolve the version conflicts before implementation

1. **Preserve BF v2 exactly.** The machine prompt's hard rule expressly takes priority: copy DOG Army's `src/engine.js`, keep `STATE_VERSION` 2, and verify both the source hash and the 11,429-character packed `const BF` block whose SHA256 starts `203f873500`. The bible's v3/Kit migration is a roadmap; neither its source nor an agreed v3 hash is supplied. Do not invent a substitute engine or describe a recreation as the series engine.
2. **Prepare service boundaries without changing the engine.** Keep the original jackpot behaviour; place meter access behind `casinoJackpot.get(level)`, `.contribute(level, bet)` and `.settle(level)`. Add `{level, hit}` metadata to the committed round outside the immutable engine. Avoid contributing twice if BF already increments its meter. The wrapper must adapt BF's actual behaviour after inspection.
3. **Standardise fullscreen deliberately.** The bible reports DOG Army using `fullscreen(on)`, while the new standard and prompt require `fullscreenHost`. Preserve the reference's tested behaviour but expose the requested unified API. Do not claim that simply copying an older implementation meets this new interface.
4. **Preview safety improves on a plain DOG Army copy.** The prompt requires a pristine engine copy, practice state, disabled persistence, no wallet/round-log/jackpot/fund/spectator effects, and no global forcing hook. Audit the copied Lab against that exact list.
5. **Follow the explicit no-cameo rule.** Happy Welsh is the required wild, and future Happy Welsh twins can join the floor-wide fund when a helper becomes live. This machine nevertheless records no cameo royalties, as the treatment expressly specifies.

## Dependency gates and honest fallbacks

| Dependency | Why it matters | Allowed response if unavailable |
| --- | --- | --- |
| DOG Army `src/`, tools, checks, host and room notes | Exact engine, packed schema, renderer subset, controls API, anchoring and mechanics | Obtain authoritative files. Design work can continue, but a new engine/host is not proof of compatibility. |
| Reference engine hash and original block | Mathematical identity and packing verification | Mark blocked; never report 94.38% as measured for an unverified substitute. |
| Original room HTML | Exact patch anchors, pack loading and future hand-over | Document integration as unverified until inspected; do not edit room files. |
| Official token files tied to exact contract IDs | Copycat protection and artwork authenticity | Names in project-colour tiles marked `LOGO PENDING` are expressly allowed by the prompt's background rule. Do not draw replacement logos. |
| Happy Welsh collection contract and actual NFT images | Correct wild artwork and Forever status | Mark art unavailable. Do not invent a collection contract or corgi illustrations. |
| WELSH deployment read | Day One block height and date | Tile states `LAUNCH DATA UNAVAILABLE`; do not invent a block or transaction. A dated prior snapshot may be used only if its source is retained. |
| At least 15 valid Welsh-family token records and logos | Pedigree cards need distinct real descendants | Record exact shortfall; repeated logos are not 15 verified tokens. |
| Forever Twins registry/helpers | Live collection status and floor-wide eligibility | Unknown/read failure displays `checking`, never zero. |
| ParallaX outlined wordmark | Brand fidelity | It is optional in the build brief: omit until original file is available. Do not typeset an imitation. |
| Shared jackpot/fund/claims services | Real shared balances and payments | Clearly named display-only local test adapters and TODOs; no real payout or wallet-link claims. |

## Visual direction

**An elegant British kennel-club show machine:** deep green enamel, warm brass, cream scoreboards and amber illumination. It should feel like a beautifully made amusement cabinet with actual materials and restrained showground decoration. All reel artwork remains authentic project material.

| Surface | Treatment |
| --- | --- |
| Main body | Deep kennel green (`#123d31` suggested); softly rounded edges, darker inset panels, subtle material roughness. |
| Accent and floor glow | Exact treatment accent `#f59e0b`. Warm light reflected across the dark studio floor. |
| Hardware | Brushed brass edges, ring and ticket mouth; readable engraved labels. |
| Screen surround | Show-ring rails and cream sight-line markers; slim brass bezel with enough lintel allowance for the view solver. |
| Side panels | Judges' scoreboards with machine identity and genuine game rules, not invented token statistics. |
| Typography | Classic serif display lettering for CORGI KENNEL; clean sans for controls; tabular digits for meters. Bundle fonts or use offline-safe system stacks. |
| Lower door | Required `WELSH · THE FIRST MEMECOIN ON STACKS` line and the supplied Xtrata mark in its original proportions and colours. |
| Small details | Souvenir-ticket slot, ventilation, credible joins, warm indicator lamps and a discreet `STANDALONE · PLAY CHIPS` identifier. |

### Cabinet anatomy and motion

- Topper `crest`: a large gold/cream Best in Show rosette, centred on the official WELSH artwork when available. Slow rotation has an independent clock; ribbon sections flutter gently. Decorative rosette geometry is permitted; it is not a recreated project logo.
- Marquee: CORGI KENNEL remains the strongest identity. Beneath it, `CASINO JACKPOT` with the current bet's meter; a quieter fund line reports current fund, next period end and actual last-period pay per twin, or `checking` / `not available`.
- Deck, from player left to right: **−TREATS**, **+TREATS**, **AUTO-WALK**, **PEDIGREE**, and a larger amber **FETCH** cap. Keep the reference's action mapping and named `spinPhysical`. Buttons have clear raised rims, visible downward travel along the deck's own z axis and label motion with the cap.
- Lever `lever`/`armPivot`: leather dog lead through a brass ring, with a graspable loop. Follow DOG Army's ease-down → bottom dwell → spring return → one top bounce. A tug and happy bark accompany a pull; bonus lighting can add a warm flash. The user can click or pull the lever.
- `mechanics()` exposes lever timing and cap spring values to either host, so the pack does not rely on standalone-only animation.
- Cabinet view supports drag-to-orbit; screen view uses the required 40-step, 0.16-pitch screen-and-deck solver; fullscreen presents the game and a separate controls bar. The dark strip hides all cabinet below the deck in screen view.

### Reel treatment

Five reels by three rows, within a warmly lit show-ring frame. Official logos sit on clean cream entry cards with distinct accent treatments and clear symbol names. The WELSH high symbol has a rosette frame. Happy Welsh images are desaturated and stamped `NOT YET FOREVER` when verified untwinned. `Day One` is an honest contract/deployment record. Pedigree cards show real descendant names, symbols and logos, with build-time provenance recorded separately.

Exact symbol mapping: `cherry` BABYWELSH; `lemon` gWELSH; `chip` PWEL; `block` sWELSH; `artifact` CVLT; `bitcoin` WELSH; `wild` Happy Welsh; `scatter` Day One; `vault` LEO-WELSH; `chain` Pedigree card. Internal generic engine names never appear in player-facing copy.

## Fully themed feature scenes

Every feature has four deliberately implemented states: trigger, intro, play and summary. The engine's already committed result drives all reveals; visual randomness has its own generator. Skip and turbo reveal the same result and settle it once.

| Feature | Trigger and intro | Animated play | Summary |
| --- | --- | --- | --- |
| **Community Takeover** | Day One records rise from reels; judges' scoreboard folds away; crowd flags lift around the ring. `8 free spins. Every win pays 2×.` | Each spin is a lap of honour; highlighted boundary lights advance around the ring, real logo cards spin and stop, spins-left and total counters update, retriggers add the actual extra spins visibly. | Rosette podium; spins played, retriggers, paid total. |
| **Fetch!** | LEO-WELSH tiles pulse; nine numbered balls bounce into the show ring. `Pick three balls. Each returns a prize.` | Chosen ball travels out and returns with authentic token art and its committed value; three physical reveals, clear remaining-picks count. | Three returned balls arranged on the podium, individual values and summed total. |
| **Pedigree** | Five or more pedigree cards stamp into place; a family-tree board unfolds. `Three respins. Every new lock resets the counter.` | Empty slots animate through actual token cards on every respin; locked cards stay fixed, new branches light, new descendants stamp in with values; reset-to-three is explicit. | Tree count, individual values and total; complete tree leads into Best in Show. |
| **Best in Show** | Exact five WELSH centre-row result, or full tree; stage opens and the large rosette turns. | Gold beams and controlled confetti; shared jackpot value counts to the committed amount; topper, cabinet lights and brass sting peak together. | Jackpot amount and qualifying event, then one settlement/return. |
| **Sit or Stay** | Small show-ring judges' card with two equal choices. | A brief animated reveal determined by the engine's even bet, not player timing. | Clear double or loss result and return; no additional gamble beyond the permitted one. |

Reduced motion uses crossfades, restrained rosette movement and no more than three particles in an entire jackpot. This must be counted across the scene, not three particles per frame. Audio combines a short original brass motif with licensed barks/applause where obtainable; each source is recorded. Sound off and volume work in every view. Listening sign-off remains owed unless someone actually listens.

## Functional architecture

1. **Host:** DOG Army-derived 3D studio and marked `ParallaxLAYRAccount` test stub. Uses the same pack model, Three r128, ACES exposure 1.15, linear output, SoftwareRenderer fallback and canvas-controls API as the room.
2. **Immutable engine:** original BF block and checksum file, unmodified.
3. **Machine skin:** names, authentic art, canvas drawing, sound, themed feature presentation, fund explanations and controls. Preserve the exact room patch anchors.
4. **Transaction boundary:** commit the full round/bonus result with a round ID before animation. Reload resumes/settles that same committed round exactly once. No art call consumes the result RNG.
5. **Service adapters:** explicit local test jackpot/fund block; paid-bet contributions only. One account balance; no secondary game wallet, outside-token holdings or invented closed-period payout figures.
6. **Preview module:** pristine `PX_PURE`, separate practice state and meter, no saving or external effects; restore real state byte-for-byte on exit. Public preview via Pays/fullscreen and `action('lab')`; developer extras only behind `PX_STANDALONE_TEST`.
7. **Build chain:** source files build the cabinet, single-file host and gzip/base64 `pack.json`; never edit bundles by hand. Set a 2 MiB pack target, report actual size, and explain any excess rather than silently degrading authentic art.

## Delivery sequence and gates

1. Acquire and inspect DOG Army plus room notes. Capture hashes, adapter/API behaviour and read-only baseline of any accessible casino files.
2. Fetch authentic art and registry/API snapshots; record date, exact contract, result and permission state. Report gaps before code work.
3. Copy source/build chain; establish one build that passes engine and decode checks before any re-theme.
4. Implement cabinet, complete game skin and all four-stage features; keep exact engine intact.
5. Implement/verify the standard preview, fullscreen, account settling and read-only fund displays.
6. Run reference-based engine simulation, safety checks and browser interaction checks. Record actual results and any unavailable checks; never substitute screenshots for geometry/action assertions.
7. Package `index.html`, `pack.json`, source/build scripts, art and sound provenance, `fund.json`, README, integration notes, and results. Leave casino integration for later.

## Verification risks to handle explicitly

- A 5,000,000-spin simulation can differ from the design estimate through sampling, especially jackpot variance. Report both seeds and actual outputs; investigate a failure, never tune the engine to force the requested percentage.
- Mobile projected deck controls may become small in cabinet view. Check actual hit targets and overlap; fullscreen controls must be at least 44 px. A large invisible area is not a solution if it steals its neighbour's action.
- Measure screen and deck only after `updateMatrixWorld(true)`; leave the lever out. Test all five required window sizes numerically after every resize and in both render paths where available.
- Preview `Run all` must finish real bonuses first, preserve state between items correctly and never leak into the live ledger.
- The 59.7/1.5/8.5/11.9/10.3/2.4 component figures are rounded; use the mandated 94.38% overall estimate, not the sum of rounded display figures as a different engine target.
- Source copies, software-rendered checks and GPU checks are distinct evidence. Do not report Safari/Chrome GPU or listening sign-off without performing them.

