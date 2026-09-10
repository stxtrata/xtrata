# X Chess 2.3.3 — peer handoff and iOS pawn fixes

This candidate addresses the reported game 2 failure on inscription **3039**.
It is a new standalone board; the immutable 2.3.2 inscription cannot be edited.
No new registry contract, setup fee, service, deployment or inscription is needed
to continue an existing game. This release has not been inscribed.

## What happened

The laptop screenshot contains White's signed `1.e4`; the phone screenshot still
contains the initial position and identifies its player as Black. Registration
binds identities and game keys but does not connect browsers or carry moves.
Version 2.3.2 enabled moves immediately after registration, silently retained a
move when no channel was open, and ran separate local clocks. Its connection and
manual exchange controls were below the board, particularly hard to find on a
phone. These observations explain the symptoms; the screenshots alone do not
establish whether a connection was attempted or why any attempted route failed.
The desktop JSON error is consistent with an empty/truncated pasted input; its
precise triggering action was not captured.

Both colours used the filled Unicode pawn, painted with CSS. The mobile screenshot
shows iOS substituting a black emoji, which ignores that paint. Board pawns now
use a small inline SVG silhouette with explicit side colours and outline styling.
There is no image or font download. Text-only move labels request text presentation.

## Changes

| Update | Behaviour |
|---|---|
| Visible transport choice | Above-board status separates confirmed registration, disconnected devices, synchronization and manual exchange. Moves require matching history on a direct channel or an explicit manual choice. |
| Guided connection | Offer → answer → accept instructions explain the full handoff. Buttons above the board take players to the connection and message panels. Both players must keep their views open. |
| Receipt feedback | The receiver returns newly saved signed history. Matching history marks synchronization; a local save or queued send alone cannot claim delivery. Equal receipts do not create an echo loop. |
| Manual fallback | Players can select manual exchange at any point, including after a disconnect. Each signed move must be copied and sent; a valid manual import enables continued manual play. No opponent approval is required to select it. |
| Advisory clocks | Clocks wait for a synchronized direct channel and pause on disconnection, pending synchronization, closed views and manual play. They are local estimates, reset on reload and never verify a timeout win. |
| Useful input errors | Empty and incomplete JSON inputs give paste/copy guidance and preserve the saved game. Copy feedback explicitly says that the message still needs sending. |
| Recovery clarity | Reloading history explicitly reads this device, not the other player's browser. Reloading a registered opening retains its saved moves. |
| Mobile pawns and orientation | Embedded SVG pawns keep their intended colour on any font stack, including legacy pending-move outlines. Incoming history and refresh preserve a player's chosen board orientation. |

This does not introduce automatic signaling, a relay service, chain move polling,
a new proof format or a verified clock. Direct WebRTC without connection aids
may not find a route across some networks. Manual exchange remains the fallback.
The winner can still sign a final mating move in manual mode after the loser
closes their browser and publish without a receipt or countersignature.

## Continue existing game 2 on #3039

1. Keep both browsers' saved data. Do not create a replacement game.
2. On the laptop, select **Export signed message**, then **Copy message**.
3. Transfer the entire text to the phone using your chosen messaging channel.
4. On the phone's loaded game 2, paste it into **Manual exchange** and choose
   **Import signed message**. The board should show `e4` and allow Black to move.
5. After Black moves, export/copy that full signed message and import it on the
   laptop. Repeat for each turn, or exchange fresh connection offer/answer messages.
6. Save encrypted private recoveries on both devices. Public signed messages do
   not contain the private game keys and cannot restore those keys by themselves.

The new board retains the same journal namespace and signed formats. Browser
storage availability depends on the viewer origin/partition; if a new viewer
cannot see an old save, use encrypted recovery rather than a new game key.
A restored registered game must verify its opening again before play.

## Validation and inscription

Use only `releases/2.3.3/xchess.html` for the board inscription. The accompanying
manifest records exact byte length, SHA-256, rolling hash and chunk count. The
packager independently rebuilds the HTML from its included source. Previous
release directories remain unchanged.

`VALIDATION.json` and `evidence/` contain the automated results. Coverage includes
registered setup with no transport, the e4/e5 manual handoff, recovery of a move
saved before this fix, disconnected winner publication, native WebRTC receipts,
manual fallback, offline archives, mobile-size SVG colours, legacy UI/runtime
behaviour, chess rules and contract tests. Existing result archive #3038 remains
verifiable. No mainnet transaction was sent for this update.

The browser tests use isolated desktop Chrome profiles, including narrow layouts;
they do **not** run inside an actual iPhone Xverse webview. The final iPhone check
should confirm both pawn colours, connect the two loaded game views, observe the
same e4/e5 history on each, then repeat using manual exchange. No new inscription
read-back or real wallet-extension signing is claimed for this candidate.

Unrelated observations from the #3039 report (initial explorer count on a failed
read and unresolved rule recovery for legacy game 47) are outside this patch.
