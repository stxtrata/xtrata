# Radio: Album First

A listener who was sent an album sees a player, not the pay-per-play panel: the cover, the artist, the songs and how many plays are left. Nothing else is removed. The radio, the wallet, history and sending music stay in the page and open as sheets.

## When it shows (`albumState` in `src/radio-ppp/page.ts`)
- **open**: an album wallet is open (`slot > 0` with a gift player).
- **arrive**: a live gift link with an album is waiting on this device. One button: "Open album" (`ppp.create()` for a new listener, `ppp.unlock()` for a locked one). The claim runs exactly as before; only its progress lines are shown (`gifts.banner(s, { bare: true })`).
- **locked**: the page is locked and this device last had an album open (`xtrata.radio.album.last.v1`). "Continue listening" unlocks, and on the same passkey goes straight back into that album.
- Anything else: the ordinary radio page.

`html[data-view="album"]` hides the receiver, the panel, the likes and the top bar (`public/radio.html`). Nothing moves in the DOM, so the wallet box never reloads.

## Sheets
- **More** (the view's own sheet): add plays (+100 / +250 / +500, from My player), My music, Xtrata Radio, Send music to a friend, This device, How plays work.
- **My music / This device / Send music**: the panel's existing folds (`.ppp-shelf`; `.ppp-wallets`, `.ppp-recent`, `.ppp-more`; `.ppp-gifts`), shown as a bottom sheet via `html[data-sheet]`.
- **The wallet box**: whenever it asks for a tap (`busy` or `armed`), it opens as a sheet (`html[data-asking]`) and the view says "Continue in the box below."

## Plays, not STX
- Album top-ups are counted in plays (`TOP_UP_PLAYS`). The controller works out the STX from the play cost of the day (`topUpCost`), so the album gets exactly that many plays.
- The view shows no STX, wallet or "pay" wording. The classic panel's headline wording also changed: "XTRATA MUSIC", "Start listening", "N plays left", "Add plays", "This device", "Send music to a friend".
- The wallet box's first glance (create and unlock panels) no longer shows prices: "Make your player", "Kept on this device with your passkey", "Create and start listening", "Unlock and keep listening". The costs and the 1 STX rule are still under Details. This part needs the wallet box redeployed.
