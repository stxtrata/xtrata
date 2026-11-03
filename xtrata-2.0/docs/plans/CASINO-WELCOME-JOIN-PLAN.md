# ParallaX Casino: one welcome card that also signs you in

Status: plan with mockups, 2026-11-03. Not built. Page `/casino` (`public/casino/index.html`), room client
`src/casino-room/main.ts` (`room.js`).

**The ask.** The welcome card ("The night is yours.") and the room sign-in are two separate windows. Make it one process.

## 1. What happens today

- The welcome card opens bottom left, with ENTER THE CASINO, the table shortcuts and the Afterglow / Get LAYR / Machines links.
- Two seconds later room.js opens the Room panel top right on its own (`arrivalPrompt`, `ARRIVAL_WAIT_MS` 2000), asking you to
  join with the casino wallet, Leather or Xverse.
- So a new visitor sees two windows at once, in opposite corners, each with its own big buttons, and no clue which comes first.
  Closing one leaves the other. (Mockup 0.)
- Separately, the Room button keeps showing the short address (`SP10W…9TM7`) until something repaints it, even after the BNS name
  has arrived: the name cache's refresh callback updates the tags and chat but never repaints the button. One line to fix.

## 2. The proposal: one card, two steps

The welcome card stays where it is and looks the same; it gains the sign-in as step 1. The Room panel no longer pops up by itself.

**Step 1, Join the room.** One line on why (others can see you, chat, play the shared tables) with the live head count; a wide
**Casino wallet** button (Face ID or fingerprint, free, 1,000,000 LAYR to start) and **Leather** / **Xverse** below it; the
"One free signature. No transaction, no fee, no permission to spend anything." line; and a small link "Or look around first,
without signing in". (Mockup 1.)

**Step 2, Step in.** ENTER THE CASINO, the six table shortcuts, then The Afterglow, Get LAYR and Fruit machines. Before you sign
in, ENTER is outlined (it still works); once you are in, it turns solid gold, so the eye moves down the card.

The card changes state in place:

| State | What the card shows | Mockup |
|---|---|---|
| New visitor | Step 1 with the three wallets, step 2 below | 1 |
| Waiting for the wallet | "Check Leather: approve the free sign-in message. No transaction. Nothing to pay." with a spinner, wallet buttons greyed, Cancel | 2 |
| Wallet error (no extension, rejected, timed out) | The same message box in red with what to do ("Leather is not installed. Get it, or use the casino wallet"), buttons live again | — |
| Signed in | "✓ You are in the room": green box with your BNS name (or short address), wallet, and Switch; "Here now: bob.btc at Deep Strata · carol.btc at Sic Bo · +2 more"; ENTER solid gold | 3 |
| Returning (session still valid, up to 4 hours) | "Welcome back. You are still signed in from earlier, so you are already in the room." Name box with "Not you?"; ENTER and the shortcuts; no wallet buttons | 4 |
| Phone | The same card, full width along the bottom, scrolling; the shortcuts three across | 5, 6 |

After the card closes (ENTER, a shortcut, or the guest link), everything works as now: the Room button top right shows your name and
the count, and its panel still has Connected as, Here now, Switch and Leave. A guest who later wants to join uses the Room button,
or sits at a shared table, which already asks them to sign in.

## 3. How it is built

1. **room.js renders the join block into the card.** The page gets an empty slot in the welcome card
   (`<div id="introJoin"></div>`). room.js fills it using the same join code the Room panel uses (`joinOrder`, `join(kind)`, the busy
   and error states, the casino-wallet passkey flow), and repaints it whenever its state changes, just as it repaints the panel.
   One sign-in implementation, two places to show it.
2. **No more auto-opening panel.** `arrivalPrompt` is skipped when the slot exists (the welcome card is showing); older cached pages
   without the slot keep today's behaviour.
3. **Page** (`public/casino/index.html`): the card markup becomes the two steps (kicker, title, short lead, `#introJoin`, step 2
   with ENTER, shortcuts and links); CSS for the step headings, wallet buttons, message box, name box and phone layout; ENTER gets a
   `signed` style. The table shortcuts keep their current station mapping.
4. **The name fix:** the name cache's refresh callback calls `paint()`, so the Room button and the card switch to jim.btc as soon
   as the name arrives.
5. Rebuild `room.js`, bump `?v=` (p5.4 to p5.5). No Worker change, so no Worker deploy this time.
6. **Tests in a real browser:** a new visitor sees one window, never the auto panel; signing in with a stand-in wallet goes
   waiting → signed in, with the name on the card and the button; a refused signature shows the error and the buttons come back;
   a returning visitor gets "Welcome back"; Not you? signs out and shows step 1; the guest link closes the card and leaves you
   signed out; the phone layout fits 390 px; no console errors.

**Files:** `public/casino/index.html`, `src/casino-room/main.ts`, `public/casino/room.js` (built). All three are shared with the
chess session, so the order is agreed through Jim before writing, as last time. Nothing is committed until Jim says.

## 4. Decisions for Jim

1. **ENTER before signing in:** keep it working (outlined, recommended, so nobody is forced to sign in to look around), or grey it
   out until they sign in or pick the guest link?
2. **The guest link** "Or look around first, without signing in": keep it (recommended), or drop it since ENTER already does that?
3. **Table shortcuts before sign-in:** show them under ENTER as in the mockups (recommended; the card scrolls on short screens),
   or show them only once signed in, for a shorter first card?
4. **Returning visitors:** show the short "Welcome back" card (recommended), or skip the card and drop them straight into the room?
