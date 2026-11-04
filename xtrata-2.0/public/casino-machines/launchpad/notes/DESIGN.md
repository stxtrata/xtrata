# Launchpad design decisions

Build date: **3 November 2026**. Treatment: Series Bible 2.1, machine 22, “from curve to pool.” This edition adapts the existing standalone Launchpad cabinet and art to the engine and room interfaces supplied in Appendix A.

## Cabinet and views

The cabinet uses pale mission-control metal, dark navy instruments, orange caution accents and mint confirmation lights. The rocket topper rotates independently; large wins lift it, with a larger Graduation Day launch. A guarded right-hand lever opens its cover and pulls through a bottom dwell and spring return. Deck labels read **CURVE / −STX / LAUNCH / +STX / AUTO-APE**, with a small Lab control. The lower door carries the exact supplied Xtrata vector and a souvenir ticket slot.

The packed model faces +z and uses +y as up. Its inclined deck moves each cap along the deck's local z, with the label attached. `src/cabinet-meta.json` records dimensions, named parts and chart provenance. The standalone uses Three r128, ACES filmic tone mapping at exposure 1.15 and linear output; a Canvas software fallback remains available.

Cabinet view permits orbit and zoom. Screen view uses pitch 0.16 and a 40-iteration fit after resize, reserving top-bar and bottom-controls space. Fullscreen puts the game frame in a full-viewport layer with its own wrapping controls and panels. The view solver and input behavior are checked separately from visual approval; measured outcomes belong in `RESULTS.md`.

## Outcome and presentation

The engine is immutable. A pending result, round ID and jackpot flag are saved before reel art is selected or motion begins. Image variation uses its own `Math.random` calls. Reload resumes the saved result; settlement is idempotent. Presentation never writes fabricated grids or prizes.

| Scene | Treatment |
| --- | --- |
| Launch Window | Countdown, launch sequence, eight free spins with 2× wins and visible retriggers |
| Pre-launch Seats | Nine capsule choices; three reveals, using historical BLOCKS provenance |
| Graduation | Bonding-curve control display; buys lock and reset three respins |
| Graduation Day | Rocket launch, Casino Jackpot amount and the largest light/fanfare sequence |
| APE or FADE | One even gamble, choice animation and result summary |

Features use trigger, intro, play and summary stages. Skip/turbo advances presentation while completing engine actions. Reduced motion suppresses the cabinet steam and calms celebrations. The Bonus preview and test Lab use a separate practice state and pristine engine functions, disable saving, and cancel queued work on exit/reconnect. Twelve scenario choices include retriggers, full-grid and centre-row jackpots, gamble outcomes, scatter counts and fund information.

## Authenticity and limits

Reels use original metadata artwork and on-chain records. Exact STX and Xtrata vectors are retained. Raster runtime derivatives preserve the full composition and aspect ratio; originals, source URLs and hashes remain bundled. No generic fruit, invented token art or fabricated market history fills source gaps. See `../ART_REVIEW.md` and `../art/sources.json`.

The four launch tiers are selected active STX.City candidates, ranked only within that selection. Teiko is the highest reported-volume graduate in the eligible retrieved STX.City snapshot; Faktory's comparative listing was unavailable. Volume units and period are unconfirmed. The side chart uses seven actual historic Capy buy prices including fees, labelled as a partial historical sample. BLOCKS seats refer to a past launch, not available inventory or prizes of real tokens.

Nine original reel-art files provide one logo per token and two Graduate variants. Jim's shortlist review and all listed project permissions remain outstanding; this does not meet the suggested approximately 18 images per symbol. There is no twin art on these reels, so the untwinned-NFT treatment is inapplicable; unknown eligible counts display “checking.”

The Casino Jackpot adapter preserves existing local engine behavior until the shared service exists. The type-W Machine Fund display represents 1% of paid wagers from the house share; snapshots and claims are unconnected. Neither service introduces a wallet or token gate. Sound is synthesized with WebAudio as the recording fallback: countdown, clicks, locks, rocket noise, fanfare and gamble cues. No mission-control voice recording is bundled; listening sign-off remains owed.
