# Pool Party design and implementation plan

## Aim

Deliver ParallaX Casino machine23 as a self-contained, playable rooftop pool cabinet. Keep the supplied DOG Army build structure and canonical v2 economics, while changing the cabinet, art, sound, player-facing language and every bonus environment. Build and test independently; leave room integration as a documented follow-up.

## Visual direction

Use the material contrast of a bright pool against a dark arcade studio: glazed white ceramic, turquoise water and trim, cream canvas, polished chrome and coral controls. The cabinet silhouette has a substantial tiled body, angled control deck, canopy and a tall STX swim-ring crest. Real protocol artwork supplies the color accents; it remains intact.

The game screen is an underwater pool window. Distinctive but restrained typography leaves room for real token art and readable data cards. Values, preview status and missing-data labels take priority over decoration. The warm coral spin control and action buttons separate interaction from the cyan environment.

## Build sequence, completed

1. Read the supplied brief/Bible and DOG Army source. Identify exact patch anchors, engine hashes, model roles, account interfaces and pre-existing camera/fullscreen patterns.
2. Verify exact token contracts and publisher images; collect real dated LP, swap and pair records; retain unavailable APR without substitution. Bundle evidence and hashes.
3. Copy the canonical engine and shared helpers unchanged. Build the theme as an independent layer with separate cosmetic randomness.
4. Construct the packed cabinet and all physical actions. Preserve the screen/deck coordinate contract, add the live marquee texture and water-jet flourish, and fit it with the numerical camera solver.
5. Create each bonus's trigger, intro, play and summary; connect them to already committed engine outcomes. Keep Skip and resumed play on that same state.
6. Add the isolated public preview and test Lab using the pristine engine copy. Keep test diagnostics read-only and developer controls behind the one explicit flag.
7. Move fullscreen into the packed game, with host ownership of native fullscreen, one bottom bar, visible same-frame panels, responsive wrapping and fixed-layer fallback.
8. Verify pure engine/data invariants, two return simulations, all required viewports/actions, bonus previews, Skip, reload, offline fallback, production safety, source mechanics and final visual refinements.
9. Package the standalone page, room pack, sources, integration instructions and compact results. Put full visual review evidence in a separate compressed gallery archive.

## Experience map

| Moment | Visual and interaction treatment | Integrity boundary |
| --- | --- | --- |
| Idle | Day pool, official token/data cards, slowly turning ring, live meters | Display only; no live-data dependency |
| Spin | Hand-like lever stroke, cap spring, water stops | Commit and save before the first reel moves |
| Happy Hour | Sunset, pool lights and floating rings | Canonical8/+4/cap24; line/scatter2× |
| Yield Farm | Nine sealed loungers; three animated reveals | Nine independent predealt prizes; real APR is informational |
| Deep Liquidity | Fifteen lanes; values arrive on water waves; visible respin reset | Predealt hold frames; no presentation RNG in outcomes |
| Cannonball | Water eruption, soak on the glass and counting meter | Actual centre-row STX or full grid; reduced motion stays calm |
| Stake or Swap | Turning pool buoy and hash-parity reveal | One canonical even gamble |
| Preview | Persistent top ribbon, practice balance, Lab-marked history | Pristine engine/state; saving and real services excluded |
| Fullscreen | Screen with one bottom control bar; all panels inside | Host owns the frame and native fullscreen |

## Decisions and limits

The Bible's future engine/service discussion does not replace the prompt's byte-identical v2 rule. The source remains unchanged. Service adapters acknowledge the core's existing meter writes so they cannot contribute twice. The Fund is an honest local display until its backend exists.

Real publisher artwork and raw API evidence were available. Verified APR was not, so the design says APR UNAVAILABLE rather than inventing or renaming a rate. No NFT/cameo artwork or outside-holder hook is used.

The free-spin treatment's phrase “all wins2×” is implemented according to the higher-priority canonical engine: line/scatter wins double; independently resolved picks/hold prizes do not. Panels say this explicitly.

The source package retains reproducibility and evidence without carrying the reference archive's old builds or the122MB raw Lab screenshots. The separate gallery uses proportionally resized images and records original hashes. Real-GPU Safari/Chrome and listening checks remain the final device sign-offs.
