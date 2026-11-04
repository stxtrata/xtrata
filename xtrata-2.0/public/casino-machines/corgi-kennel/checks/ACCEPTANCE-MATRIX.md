# Corgi Kennel — acceptance matrix

Plan prepared 3 November 2026 from `21-corgi-kennel-prompt.md` and the shared Series Bible 2.1 sections. **All rows below are requirements awaiting implementation or evidence, not passed tests.** Source-dependent gates must remain blocked until authoritative DOG Army files are obtained.

| ID | Area | Required evidence | Initial status |
| --- | --- | --- | --- |
| R01 | Reference | Read DOG Army README, INTEGRATION, `src/`, `tools/`, `checks/`, room/rendering notes; record source location. | Awaiting reference |
| R02 | Scope | Standalone `corgi-kennel/`; no casino-file mutations. Record reference checksums if those files are accessible. | Planned |
| E01 | Engine source | `tools/check-engine.mjs` passes against original `src/engine.sha256`. | Blocked on source |
| E02 | Packed engine | Extract `const BF = (() => {` through first newline `})();`: 11,429 characters and SHA256 prefix `203f873500`; retain full hash. | Blocked on source |
| E03 | Maths | Original strips, pays, 20 lines, bets 20/40/100/200/500 and all bonus/jackpot/gamble values unchanged. | Blocked on source |
| E04 | Simulation | Two independently seeded 5,000,000-spin runs, raw outputs and observed RTP; investigate deviations from 94.38% ± about 0.3 points. | Planned |
| E05 | Presentation RNG | Art uses `Math.random` or a separate generator; instrumentation proves result RNG consumption is unchanged. | Planned |
| E06 | Committed results | Round ID and full result stored before animation; reload during spin/feature preserves ID and credits once. | Planned |
| A01 | Token art | Six named FT logos and LEO-WELSH verified against exact supplied contracts; no name-only token matches. | Awaiting research |
| A02 | Happy Welsh | Gamma collection contract, metadata/art provenance, registry/helper check and desaturated NOT YET FOREVER state where applicable. | Awaiting research |
| A03 | Day One | Deployment transaction/block/date verified, or tile explicitly declares unavailable/snapshot with date. | Awaiting research |
| A04 | Pedigree | At least 15 distinct valid Welsh-family tokens with real logo, name, symbol and source; offensive entries excluded. | Awaiting research |
| A05 | Sources | Every image and sound has source/date/licence or permission state; missing logos are clearly marked pending. | Planned |
| A06 | Brand | Exact Xtrata geometry/colour/proportions on lower door; only use optional ParallaX wordmark if original file obtained. | Planned |
| C01 | Geometry | Packed root/geometries/materials/textures decode in reference host. | Blocked on reference |
| C02 | Anatomy | `screenMesh`, `crest`, `spinPhysical`, `lever`/`armPivot`; all deck meshes have correct `pxMachineAction` and action data. | Planned |
| C03 | Identity | Green/gold kennel body, rosette, ribbons, show-ring rails, side scoreboards, lead/brass-ring lever, souvenir slot, required lower-door wording. | Planned |
| C04 | Mechanics | Deck z-axis spring and moving labels; correct lever curve; `mechanics()` returns both cap and lever data. | Planned |
| C05 | Render | Three r128, ACES 1.15, linear output, ~30-fps idle cap; drawing still works without WebGL. | Planned |
| V01 | Cabinet | Drag orbit; lever and every physical deck action work. Cabinet screenshot retained as test evidence. | Planned |
| V02 | Screen solver | `SV_PITCH=0.16`; 40-step screen-and-deck solver, 10-px top clearance, 4% sides; excluded lever and bezel allowance. | Planned |
| V03 | 1440×900 | Assert screen top, deck bounds above strip, every deck action by click. | Planned |
| V04 | 1366×768 | Same geometry and action assertions. | Planned |
| V05 | 1024×768 | Same geometry and action assertions. | Planned |
| V06 | 390×844 | Same assertions; no horizontal overflow; all required UI targets ≥44 px, listed individually. | Planned |
| V07 | 844×390 | Same geometry and action assertions. | Planned |
| U01 | Player controls | FETCH, ±TREATS, AUTO-WALK, PEDIGREE; Turbo, Sound/volume, Fair Play, History, Fund, balance, Sit/Stay choices. | Planned |
| U02 | Auto | Stops for bonus, low balance, panel opening, document/tab leave. | Planned |
| U03 | Keyboard | Space spin, F fullscreen, Esc close/exit, L Lab in standalone test; typing into inputs does not trigger play. | Planned |
| U04 | Fullscreen API | In-game `fullscreenHost`; native API and fixed-layer fallback; correct room hand-over documented. | Planned |
| U05 | Fullscreen bar | All controls except lever, themed labels/plain-action subtitles, current bet/balance, bonus action, preview, test extras, exit. | Planned |
| U06 | Fullscreen layouts | Desktop one row where feasible, phone wrapping, safe areas, ≥44-px targets; no obscured readouts or menus. | Planned |
| U07 | Fullscreen session | Whole desktop and phone sessions entirely via bar, every panel, gamble, every bonus, exit and focus return. | Planned |
| B01 | Community Takeover | Four stages; actual eight free spins at 2×, correct +4 retriggers/cap, counters and animated laps/reels. | Planned |
| B02 | Fetch! | Four stages; nine animated balls, exactly three picks, actual engine prizes and authentic reveal art. | Planned |
| B03 | Pedigree | Four stages; animated empty cells on each respin, real descendant locks/values, reset-to-three, full-grid jackpot. | Planned |
| B04 | Best in Show | Largest themed sequence, official WELSH artwork, committed shared meter amount, rosette/cabinet/audio celebration. | Planned |
| B05 | Sit or Stay | Both outcomes through animated reveal; exact even bet and permitted one-gamble limit. | Planned |
| B06 | Skip/turbo | Concrete paired seeded tests prove same totals and one settlement whether fully played, skipped or turbo. | Planned |
| B07 | Reduced motion | All scenes calmer; cumulative jackpot particle creation ≤3; no expensive unbounded blur loops. | Planned |
| B08 | Layout | Scene buttons inside reel window, clear of room strips at y780–872 and y890; work in all three views and phone width. | Planned |
| L01 | Public preview | Open from Pays/fullscreen and `action('lab')`; practice-chips warning remains visible. | Planned |
| L02 | Isolation | Pristine `PX_PURE`, separate state, saving off; balance, meters, fund and spin count unchanged after every exit path. | Planned |
| L03 | Force safety | Scripted RNG passed into original `start`; no duplicated/bypassed engine, forcing refused outside preview, no global force hook. | Planned |
| L04 | Item coverage | Free spins; retrigger; pick; hold; full hold grid; centre jackpot; gamble win/loss; scatter 3/4/5; fund info. | Planned |
| L05 | Lab controls | Bet choice; seeded/random mode; seed; Replay last; Run all; history marked LAB. | Planned |
| L06 | Lifecycle | Leaving machine/reconnecting exits preview; real bonus finishes before next Lab item. | Planned |
| L07 | Four-stage evidence | Every item played; screenshots/stage records for trigger, intro, play and summary; re-read live scene between captures. | Planned |
| L08 | Developer flag | Only `PX_STANDALONE_TEST` enables reset/twin switch/RTP developer extras; production public preview remains. | Planned |
| J01 | Jackpot adapters | Exactly five bet meters; local stub visibly labelled; `.get/.contribute/.settle` boundary and service TODO; no double contribution. | Planned |
| J02 | Round metadata | `{jackpot:{level,hit}}` committed before visuals; paid rounds only contribute. | Planned |
| F01 | Fund config | Exact W / all-live / weekly / Monday 00:00 UTC / split null `fund.json`. | Planned |
| F02 | Fund display | 1% of paid bets from house; topper balance, period end, actual last-period pay or unavailable; unknown twin reads say checking. | Planned |
| F03 | Fund rules | Any live-collection twin, period eligibility and pull claims explained; no token minimum/wallet link/cameos; no requirement to play. | Planned |
| F04 | Server boundary | Claims/snapshots/shared service/refunds remain explicit TODOs, display-only testnet. No invented paid-period figures. | Planned |
| P01 | Fair Play | Exact 94.38% estimate, six rounded components, frequencies, even gamble, shared jackpot, house-funded rewards; not certified. | Planned |
| P02 | Pack | One `{name,description,color,accent,model,game,css}` entry; gzip/base64 content decodes and preserves patch anchors. | Planned |
| P03 | Offline | Self-contained test page opens without external fonts/art/CDN dependencies; bundled assets remain visible. | Planned |
| P04 | Budget | State target (~2 MiB), report measured pack and standalone sizes, explain outliers. | Planned |
| P05 | Documentation | README, complete symbol table, build/run keys, INTEGRATION, art/sound sources, checks/results, RESULTS; no `_to_delete`. | Planned |
| P06 | Integration only | Document PX_MACHINE_PACKS, MACH list, `buildSlots` glow, machine panel text and fullscreen hand-over; carry out none. | Planned |
| P07 | Release limits | Record software renderer coverage, real-GPU Safari/Chrome outstanding if not run, listening sign-off owed if not heard, permissions unresolved. | Planned |

