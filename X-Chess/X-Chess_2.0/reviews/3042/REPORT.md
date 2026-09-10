# Inscription #3042 — post-inscription verification

Tested 2026-09-09. Board version **2.3.3**. The sealed release bytes, captured-runtime tests and the exercised live paths passed. This round submitted **zero transactions and spent zero STX**. The immutable application was not rebuilt or altered.

## Identity and on-chain evidence

All 20 chunks were read directly from chain and reconstructed into the original 319,980-byte HTML. It matches `releases/2.3.3/xchess.html` exactly:

`0fe8c2b1515f6e80c234d84ef2f244c6e781d182181323a0e2d38c844ce104d0`

The served 319,988-byte HTML differs only by the expected Xtrata runtime transformation. Its SHA-256 is `eead23582b7e2d8cd0cf593db8a166ffe862743a09ac178b9a5812e5850921a9`.

Evidence: [chain verification](chain-verification.json), [runtime identity](identity.json), [read-back script](verify.mjs).

## Executed coverage

| Area | Result | Scope |
|---|---|---|
| Runtime and legacy browser suite | 44/44 passed | Captured #3042 bytes; direct/framed provider paths, refused/accepted connection fixtures, board loading, keyboard flip, mobile layout, storage and error checks |
| Native peer browser suite | 16/16 passed | Separate Chrome profiles, real WebRTC, reconnect/sync, explicit transport choice, manual complete game, duplicate/tampered imports, recovery, no-receipt winner completion, offline archive verification and SVG pawn colours |
| Existing legacy game 137 | Passed live | Committed rules recovered; all four accepted moves replay to Black checkmate; replay controls and board flip exercised |
| Existing registered game 2 | Passed live, viewer only | Confirmed players/settings/public keys read from chain. Fresh browser correctly has no matching private game key and shows paused clocks |
| Direct signed play | Passed and recorded locally | e4/e5 delivered between isolated browser contexts using the verified #3042 application code |
| Manual fallback | Passed and recorded locally | Disconnect; Nf3/Nc6 exchanged manually; incomplete input rejected while accepted root is preserved |
| Encrypted recovery | Passed and recorded locally | Disposable White game key and four-move history restored into a fresh browser |
| Winner without loser approval | Passed and recorded locally | Losing browser closed before Black signed Qh4 checkmate. Review & Inscribe enabled without a terminal receipt |
| Existing published archive 3038 | Passed live and direct chain read | Sealed archive bytes, signatures, checkmate and registered opening verified again in #3042 |
| 390px live viewport | Passed | Eight white and eight dark SVG pawns; no horizontal page overflow in Chrome |

Reports: [44 runtime checks](browser-report.json), [16 peer checks](peer-browser-report.json). The local demo harness serves the captured application with fixture chain responses and test coordination; the application exchanges real signed moves through WebRTC or explicit manual import. These demo captures are not mainnet game creation or publication.

The actual #3038 archive has SHA-256 `ef37a120bd4cefc26bdfa39bd8f534f9acf0bb6eefb9404544b57d6b2ff60c5f`. Its registered opening is game 1; result is 0–1 by checkmate. Opening a public archive offline and checking its registered opening against the chain remain distinct verification steps.

## Remaining limits and observations

- **Actual iPhone Xverse testing remains outstanding.** A 390px Chrome viewport checks layout and SVG fill, not iOS rendering, wallet webview storage or background networking.
- No fresh wallet-extension signing, paid legacy game, registration or result inscription was submitted in this round. Earlier real wizard transactions are documented in [the #3037 report](../3037/REPORT.md).
- We did not recover the user's original game 2 private key or the e4 saved on their laptop. Loading that game's public opening in a fresh browser cannot fetch off-chain moves or confer signing rights.
- A keyless registered viewer correctly disables transport/player actions, but the general readiness prompt could explain recovery more clearly instead of inviting an unavailable transport choice. This is a wording follow-up, not a changed inscription.
- Direct local connectivity does not establish that every home/mobile network has a usable peer route. Manual exchange is the service-free fallback.
- Advisory clocks do not prove timeout wins. A signed archive authenticates the supplied line and final board; it cannot prove that no other signed branch exists.
- Historical launch gates, actual extension-wallet coverage, and previously documented explorer endpoint/count-label limitations are not marked complete by these tests. There was no exhaustive new live tournament/leaderboard walk in this round.

## Tutorial production evidence

The user then requested the existing Presenter Video Pack production method. Six two-minute chapters were scripted around genuine live read-only captures and clearly labelled local demos. Local production root:

`media/xchess-tutorials/3042-r1/` (relative to the X-Chess workspace).

It contains named Playwright/Chrome WebM takes, PNG screenshots, source/action notes, timed scripts, British generic synthetic narration, external captions, editorial diagrams and separate silent/live/narrated presenter variants. The capture report distinguishes sources and paid actions (none). Initial cropped framing was preserved and replaced with full-board retakes in the edit.

All tutorial media, scripts and notes remain local and ignored. Raw peer setup recordings include temporary connection descriptions and must be redacted before any public use; finished cuts exclude those fields. Private encrypted demo recovery files are excluded from presenter ZIPs. No media was staged or pushed.
