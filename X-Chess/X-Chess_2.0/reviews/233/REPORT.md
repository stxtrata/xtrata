# 2.3.3 regression report — 2026-09-09

The user reported that registered peer game 2 on #3039 saved White’s e4 only on
the laptop, while Black’s phone remained at the starting position. Registration
was being presented as ready to play without an established transport. Local
clocks compounded the confusion. The phone also rendered both pawn sets as
black emoji. The changes and existing-game recovery instructions are in
[PEER-2.3.3.md](../../ops/PEER-2.3.3.md).

Validation: 1,763 passing regressions, 17 deliberate skips; 190 passing focused
checks (overlapping); 68 contract tests; 44 legacy/captured-runtime browser checks;
16 peer browser checks. TypeScript, documentation and serverlessness audits pass.
Clarity analysis passes with 12 existing warnings. The original #3038 archive
still verifies offline. Source rebuild, release checksums, ZIP integrity and the
unchanged #3039 release payload were checked. Evidence is in
[the release](../../releases/2.3.3/VALIDATION.json).

The nine new UI tests exercise joined registration without transport, e4/e5
manual handoff, empty/truncated input preservation, matching-history readiness,
disconnect pause/fallback, recovery of a pre-fix locally saved move, joined-row
reload preserving that move, winner completion without a receipt, chosen board
orientation and keyless public viewing. Some tests cover multiple behaviours.

Native peer tests use separate browser profiles and an actual 390px iframe
viewport. This was corrected after screenshot inspection revealed that requesting
a narrow desktop Chrome window alone can leave a wider minimum layout viewport.
The repeated suite passed at a measured 390px width. The local-only screenshot
mobile-390.png was inspected: controls fit, all eight files are visible, white
pawns are filled white and Black’s are dark. Screenshots remain ignored media
and are not included in the release source or ZIP.

This is still desktop Chrome, not iOS WebKit or the Xverse application. Actual
phone rendering, wallet-extension integration and cross-network WebRTC routing
remain device checks. No actual user game was modified, transaction submitted,
STX spent, deployment performed or inscription created. Existing #3039 cannot
receive these changes automatically. Known unrelated explorer/game-47 findings
from the earlier report are not declared fixed by this patch.
