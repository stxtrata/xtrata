# A second player for people who made theirs before the giveaway

Built 16 Nov 2026. Needs a wallet box deploy (new feature flag `another`); until then the page does not offer it.

## The rule

One player per device is the norm and stays the norm. The only way to add a second passkey-only player is all of:

1. a live free-player link is waiting on this device (a starter gift: the wall, or a starter copy);
2. this device already has a player, and that player was **never a gift itself** (the server's gift record for its
   address is read and says none; if that cannot be read, nothing is offered);
3. no Stacks wallet is connected (a connected wallet has its own player, which is the one in play);
4. the wallet box supports it.

Then the gift line, and the welcome-back screen, offer **Claim it as a new player**. The wallet box makes a new
passkey beside the old one ("Xtrata player · A1B2"), says plainly that it is a second player and that the first is
untouched, and the free player is claimed into it. The old player still opens with "Use a different listening wallet".

Someone whose player was a gift has had their free one: they see "pass it on", as before. Albums are unaffected: they
go into numbered album wallets under the same passkey and never needed a new player.

## Why it is safe

- Nothing is loosened by default: without `another` a passkey-only create still excludes the device's existing
  passkeys, exactly as before (tested).
- `another` is honoured only with no main wallet and only when the device already has a player; it changes two things:
  nothing is excluded, and the passkey gets a tagged name. The address shown, the PRF proof and everything after are
  the ordinary create path.
- A page asking for it gains nothing: the listener still has to confirm in the box and make a passkey, and an empty
  new wallet holds nothing. The server still only pays a starter gift into a brand-new wallet.
- Checked in a real browser (Chromium virtual authenticator with PRF): creating while an existing credential is
  excluded is refused (InvalidStateError); with nothing excluded a second passkey is made with its own id and its own
  PRF secret, and the first one's secret is unchanged.

## Limits

This is a guide rail, not an anti-farming measure: someone who clears their browser's data looks like a new device, as
they always did. Per-connection pick limits and the brand-new-wallet rule are what bound that.

## Replace my old player (built 16 Nov 2026)

The same people are offered **Replace my old player** first and **Keep both players** second, when the wallet box
supports removing a player (feature `forget`). Replace leaves them with one player that has backup words. The steps
(`src/radio-ppp/replace.ts`) are all the listener's own taps on things that already exist:

1. **Empty it.** Unlock the old player; "Send everything back" is the ordinary return (the wallet box shows where it
   goes and asks). There is no way on to step 2 while the balance is above the network fee to move it, while anything
   is on its way in or out, or while the balance cannot be read.
2. **Remove it from this device.** The wallet box's own panel (`listening.forget`): only an open player, and it says
   to empty it first. The controller refuses as well if the player is not empty. Only this device's note of the player
   goes. **The passkey is never deleted by us** (a page cannot, and the box never asks the phone to), so the old player
   can always be opened again with "I already have a listening wallet": nothing is lost if someone stops halfway.
3. **Claim the new one.** The ordinary free-player claim. Its passkey gets a tagged name ("Xtrata player · A1B2"), so
   it cannot be mistaken for the older "Xtrata listening wallet" passkey still on the phone.

Afterwards: write down the new player's 24 words first; then, if they want, delete the old passkey themselves, told
by name which one to keep. Leaving it does no harm.

It refuses, and points to "Keep both players", when the old player has albums of its own (they hang off that passkey
and would be left behind), holds a Music Hero record, or the album check cannot be read. What stays with the old
player is said before step 2: its likes, play history and any progress toward an award.

Not done on purpose: the browser's "this passkey is no longer used" signal. It can make a phone delete the passkey,
and the wallet box cannot see balances, so a wrong call could destroy an old player that still held money.
