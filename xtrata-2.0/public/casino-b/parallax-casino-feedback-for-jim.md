# ParallaX Casino: Early Walkthrough Feedback

**For:** Jim / Xtrata
**From:** Steve (DeOrganized)
**Build:** xtrata.xyz/casino-b (testnet, play money)
**Tested:** Oct 27, 2026, laptop, Chrome, Leather wallet extension

Jim, thanks for letting me in early. This is just my own read from a walkthrough, offered as a user and a fan of the build. Take what's useful and drop the rest.

---

## The headline

This is a really cool concept. The strongest part is that it feels like a real **place**, not a menu of games. You walk in, there's a bar, there are tables, there are other characters around. That "metaverse room" feel is what separates it from an ordinary online casino, and I'd lean into it.

Everything I tried **worked**: chip exchange, video poker, roulette, the Afterglow bar, blackjack, and two of the slots. The notes below are polish, not bug reports.

**Favorites:** The Drop and Forever Twins slots were very cool and very fun, the standout of the walkthrough.

---

## Quick wins

These are small changes that I think would make the biggest difference for a first-time player.

### 1. Show balances in the exchange panel
When you're buying LAYR chips, the panel should show:
- your **wallet STX balance**, so you know what you can afford before you click
- your **current LAYR balance**, so you don't have to leave the panel to check

### 2. Make the "waiting for confirmation" state obvious
The exchange stays on screen until the transaction confirms, which is good. But right now it just sits there, and it can feel stuck. Something like:
- *"Waiting for confirmation…"* with a spinner, ideally with a link to the transaction in the explorer
- then *"Done, +10 LAYR"* with the updated balance

On testnet especially, the wait is long enough that a silent screen reads as broken.

### 3. Put the exit inside the game
At roulette, the Stand Up / leave-table button is on the main page, not inside the game UI. When you're focused on play it's hard to find, and it can feel like being stuck in the screen. A visible exit inside each game panel (Esc would be a nice shortcut too) lets players leave when they want to. A player who knows they can leave is more likely to sit back down. I'd check this across all the tables.

### 4. Rules pop-ups for each game
A short "how to play" for each game, shown automatically on a player's first visit and available from a "?" button after that. For video poker, keeping the paytable on screen also teaches the game and builds trust.

### 5. Blackjack: the dealer's cards are hard to see on the table
The dealer's hand shows clearly in the game interface but is hard to read on the 3D table. Rendering it larger, angling it toward the camera, or bringing the in-game card display onto the table view would mean the player isn't looking in two places.

### 6. Let players bring the welcome panel back
The "The night is yours" welcome panel is great: a clear list of everything there is to do. I walked into the room and interacted with something before I'd read it, and once it was gone I wasn't sure how to get it back. The "?" button could reopen it, or a small "Guide" button could stay in a corner.
*(Low confidence: I came in as a tester, not as a player expecting a casino, but people arriving from a shared link may land the same way.)*

---

## Things worth a sentence of explanation

- **LAYR-01 Grand Entrance vs. LAYR-02 The Lounge.** All four amounts (1, 2, 5, 10 STX) worked on both exchanges. My guess is they share the same wiring and are placed in different spots on purpose. If that's right, one line saying so (and that chips are shared between them) would stop new players wondering which one to pick.
- **"Saved on this device."** The footer says the LAYR balance is shared across all tables and machines and "saved on this device." If players switch between laptop and phone, it's worth being clear about where their chips live.
- **"Local simulation" games.** Salon Hold'em and Salon Liar's Dice are labeled local simulation. A quick note on how they differ from the other tables would help.
- **Testnet faucet.** A faucet link or button in the exchange panel would make testing much easier. On mainnet, the same spot could hold a fiat on-ramp.

---

## Bigger ideas (take or leave)

### Early-win boost as onboarding
Consider paying new players a little more generously in their first sessions, for example boosted payouts on the first X hands or a welcome-chip bonus. Funded as an onboarding/marketing budget rather than by loosening the base odds, it means early players win more often and come back, while the house edge stays intact.

### Payout-bonus subscription *(might be too much, but worth considering)*
Players pay a recurring STX subscription for a percentage bonus on their winnings. If it's priced so subscription revenue covers the bonus payouts plus a margin, the surplus could fund prize pools.

### Give the Afterglow drinks a purpose
The bar is a great touch, and it's where the "real place" feel shows most. With real STX on mainnet, though, I'm not sure people will buy drinks that don't do anything. Some ideas:
- **Social:** buy a round, or send a drink to another player
- **Small perk:** a drink comes with free spins, chips, or a small bonus on your next hand
- **Status:** your avatar holds your drink, or the bar keeps a "regulars" board

### See and talk to who else is in the room
Probably out of scope for now, but the natural next step: show which other players are in the casino with you (avatars or a presence list), and eventually some way to interact, such as chat, emotes, or the send-a-drink idea above. That's what turns a beautiful room into a place people come back to.

---

## What I tested

| Area | Result | Notes |
|---|---|---|
| LAYR exchange: Grand Entrance (LAYR-01) | ✅ Worked | 1, 2, 5, 10 STX all tested; casino balance updated correctly |
| LAYR exchange: The Lounge (LAYR-02) | ✅ Worked | Same as above |
| Video Poker | ✅ Worked | Fun, fairly basic; rules + paytable would help |
| Roulette | ✅ Worked | Fun; exit button hard to find |
| The Afterglow bar | ✅ Worked | Fun touch; drinks could use a purpose |
| Slots: The Drop | ✅ Worked | Very fun |
| Slots: Forever Twins | ✅ Worked | Very fun |
| Blackjack | ✅ Worked | Dealer cards hard to see on the 3D table |

Not tested: the other tables, the other slots, Texas Hold'em, Baccarat, the Salon games.

---

Great work on this. Happy to walk through any of it live, or test again when there's a new build.

— Steve
