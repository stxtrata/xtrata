# ParallaX Casino: who you are, who is here, and leaving when you have gone

Status: plan, written 2026-11-03 for Jim. Nothing built yet. Page `/casino`, room client `src/casino-room/main.ts` (`room.js`),
room Worker `workers/casino-room/index.ts`.

**The ask.** (1) Show the address or BNS name you are connected as. (2) List everyone connected to the room. (3) Disconnect people
automatically when they leave without pressing Leave.

## 1. What is there today (read from the code)

- **You.** The Room button says "In the room · 4" (on a phone just the dot and the 4). Your name only appears inside the Room
  panel ("Others see you at your seat as jim.btc"), so you have to open it to see which wallet is connected.
- **Everyone else.** The room already sends the full list of signed-in people (`players`: address, name, spot) and announces
  arrivals and departures. The page draws them as avatars, and the chat column has a "Here now (3)" list. Nothing on the main
  screen lists them, and the Room panel only gives counts ("4 signed in, 2 watching").
- **Leaving.** The room tidies up only when a connection closes. Closing a tab or navigating away closes it properly, so that
  person goes at once. But the connection is not always closed:
  - a phone that locks, or a browser moved to the background, can keep the connection open, or drop it without telling the room;
  - Wi-Fi or mobile data dropping leaves a half-open connection that the room cannot see is dead;
  - someone who leaves the tab open and walks away stays in the room, at their seat, indefinitely.
  There is no heartbeat, and (by design, so the room can sleep) no timer on the room's side, so in all three cases the person
  stays listed and drawn until something else closes the connection: their 4-hour session ending, or a much later network timeout.

## 2. What to build

### 2.1 You

- **The Room button shows who you are:** "● jim.btc · 4" when signed in (BNS name, or the short address `ST1AB…9XYZ`). On a phone,
  where the button is an icon, the name goes in the Room panel's heading and on a small chip under the balance.
- **The panel's heading** becomes "Connected as jim.btc" with the full address underneath (tap to copy), the wallet it came from
  (Leather, Xverse, casino wallet), and Leave the room.

### 2.2 Everyone here

A "Here now" list at the top of the Room panel, for signed-in players:

| Name | Where | |
|---|---|---|
| jim.btc (you) | Sic Bo | |
| bob.btc | Deep Strata | Message |
| ST2CD…71QA | walking | Message |
| 2 watching (not signed in) | | |

- Names are the BNS name or short address, as on the name tags; levels and badges show beside them when the room has them.
- Where: the table or machine (from the spot), "walking" for someone on the floor, "Salon" inside the Salon, "away" (see 2.3).
- Tapping a name does what it does in the chat list (message, block, report); the two lists share one source.
- Guests are counted, not listed (they are anonymous by design).
- Sorted: you first, then friends, then by name. Capped at 50 rows with "and 12 more".

### 2.3 Leaving when you have gone

Three cases, three fixes:

1. **The connection died without telling the room** (phone locked, network dropped, browser killed). The client sends a tiny
   heartbeat every 30 seconds. The room answers it automatically without waking (Cloudflare's WebSocket auto-response, so it costs
   nothing), and notes the time. Whenever the room is awake it closes any connection not heard from for 90 seconds; a check once a
   minute (an alarm, only while someone is connected) makes sure this also happens in a quiet room. Result: a vanished player
   disappears from everyone's room within about 1½ minutes, and their seat or machine is free again.
2. **The tab is in the background** (another app, another tab, a locked phone that still runs). *Changed 2026-11-04 (Jim: someone
   standing in the room with the tab open should stay seen and be messageable).* A signed-in player is marked "away" after 5 minutes
   hidden (dimmed tag, stood up so no seat is held) and stays in the room; coming back clears it. A guest (nobody sees them) still
   leaves the room after 5 minutes hidden. Before 2026-11-04 every tab left after 5 minutes hidden.
3. **The tab is open but nobody is using it.** After 20 minutes with no touch, click, key or walking, a signed-in player is marked
   "away" (shown in the list, name tag dimmed) and stood up from any seat or machine, and stays visible. They leave the room only
   after **4 hours** with no activity at all (about the length of the sign-in session, so coming back may ask them to sign in
   again), with a "You were away. Rejoin" message waiting. A guest leaves after 30 minutes idle. (Before 2026-11-04 everyone left
   after 30 minutes.) Playing a machine on autoplay counts as using it.

The player's own Leave button and closing the tab work exactly as now (immediately).

## 3. Build steps

1. **Room Worker** (`workers/casino-room/index.ts`, `functions/lib/casino-room.ts`): the auto-response pair (`ping`/`pong`); a
   last-heard time per connection (any message, or the auto-response time); a sweep that closes connections quiet for 90 s; a
   60-second alarm set while any connection is open and not set when the room is empty; an `away` flag per person (`{t:'away',
   on}`), carried in `players` and broadcast, cleared by any play or move. Unit tests for the sweep and the flag; an end-to-end
   test that a connection which stops answering is removed and its seat freed.
2. **Room client** (`src/casino-room/main.ts`): the heartbeat; the hidden-tab and idle timers (reset by input, walking, spins);
   leave and silent rejoin; the "Connected as" heading, the button label and the Here now list; rebuild `room.js`, bump `?v=`.
3. **Page** (`public/casino/index.html`): dim the name tag of someone away; report activity (walking, spins, table actions) to
   room.js so playing counts as being there.
4. **Tests in a real browser:** two players; one hides the tab (5 minutes shortened to seconds by a test switch) and goes, then
   comes back and is rejoined; one stops answering (connection cut without closing) and goes within 90 s; the list and the name
   on the button are right; no errors. Then the docs and the changelog.

Deploy order as before: the room Worker first, then the site.

## 4. Cost

The heartbeat is answered without waking the room, so it is free. The once-a-minute check, only while people are connected,
wakes the room for a few milliseconds: about 1,440 short wakes a day at most. Nothing else changes.

## 5. Decisions for Jim

1. **Timings:** gone after 90 s without a heartbeat; away after **5 minutes** in the background or **20 minutes** idle; leave
   after **4 hours** without activity (signed in; guests 5 minutes hidden / 30 idle). Decided by Jim 2026-11-04. Open: raise the 90 s
   heartbeat limit (about 3 minutes) so a long-hidden tab whose timers the browser slows is not dropped by mistake (a worker change).
2. **Your name on the Room button** (recommended), or only inside the panel?
3. **Here now in the Room panel** (recommended), or a separate always-visible list down the side of the screen (busier, and on a
   phone it would cover the room)?
4. **Away players:** stand them up from their seat (recommended, so seats do not stay taken), or leave them seated until they go?
