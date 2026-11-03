# ParallaX Casino: the Salon is for players with a BNS name

Status: plan, written 2026-11-01 for Jim; decisions made the same day (section 6); being built. Page: `/casino` (`public/casino/index.html`).

**The ask.** The Salon (the room behind the arch, with the player-versus-player Hold'em and Liar's Dice tables) gets one extra
rule: you need a BNS name to go in and play. New wallets with no name (a fresh Leather or Xverse account, a new casino wallet)
can use the rest of the casino as now, but cannot walk through the Salon's door: there is an invisible wall in the arch and a
message saying why. The tables on the main floor (blackjack, roulette and the rest) are unchanged.

## 1. What "has a BNS name" means

**Recommended: a primary BNS name on mainnet for the player's key.** The casino runs on testnet (`ST…` addresses), and BNS names
live on mainnet. A Leather or Xverse account has the same key on both networks, so its `ST…` address has a mainnet twin
(`SP…`). The room already looks up that twin's primary name for name tags (`src/casino-room/main.ts`, `mainnetOf`), so the rule
is: **the name that would appear on your tag must be a BNS name, not a short address.**

- Jim's own wallet (jim.btc) passes. A brand-new account, or a casino wallet made in the browser, has no name and does not.
- "Primary" is the one name a wallet shows as itself (BNS-V2 `get-primary`), read the same way as
  `src/lib/bns/primary.ts`. A wallet that owns names but has not set a primary would be told to set one (decision 1).

## 2. Where the rule is enforced

A wall drawn by the page stops honest players walking in, but anyone can change their own page. So there are three layers:

| Layer | What it does | Stops |
| --- | --- | --- |
| **1. The room service (server)** | Looks the name up when you sign in, and refuses Salon actions from anyone without one | A modified page playing in the Salon |
| **2. The page** | The invisible wall in the arch, the message, and the same check on every other way into the Salon tables | Everyone else, with a clear explanation |
| **3. The contracts (later, mainnet)** | When the Salon games move on chain, the game contracts check the name themselves | Anyone, without trusting our server |

### Layer 1: the room service

- **Look it up once, at sign-in.** When a wallet signs in to the room (`POST /casino/room/session`), the Pages Function looks up
  the primary name of the mainnet twin, with a 3 s limit and a 10-minute cache. Same lookup as `primary.ts` (BNS-V2
  `get-primary` through the Hiro API), server side.
- **Three answers, never two.** The lookup gives a name, "no name", or "could not check" (the API failed or timed out). These
  are kept apart, as `CLAUDE.md` asks: a failed read is never treated as "no name". The pattern exists already in
  `functions/lib/creator-auth.ts` (`{ allowed, checked }`).
- **Carried in the session.** The signed session cookie gains the name (or none) and whether it was checked. `ws.ts` passes it to
  the room as a header only it can set (as it does the address); the room keeps it on the connection.
- **Check again.** A new `POST /casino/room/session/bns` re-reads the name for the signed-in address and renews the cookie, for
  someone who has just registered or set a name, or whose check failed. No new wallet signature.
- **The room refuses, without a name:**
  - `seek` ("Find a player") and `pvp` (the match relay), sent by or to someone without a name (`salon-bns-required`);
  - sitting at a Salon spot (`pvpholdem.*`, `liars.*`), so nobody is drawn seated in there without a name;
  - `move` positions inside the Salon, so a modified page cannot walk a figure in.
- **Tells the page.** The `room` message's `you` gains `bns: name | null` and `bnsChecked: true | false`; `features` gains
  `salon-bns`, so a newer page only applies the rule to a room that enforces it.

### Layer 2: the page

- **The invisible wall.** The arch is at x = -6, 2.3 m wide, in the back wall (z = -11). One more wall segment across the opening,
  switched on whenever the player may not enter (`active: () => !salonAllowed()`). The page's walls already support this.
  Leaving is never blocked: someone inside who signs out can still walk out.
- **A visible cue.** A velvet rope on two brass posts across the arch while it is closed to you, gone when you are allowed in,
  and a small sign above the arch: "THE SALON · BNS NAMES ONLY". Cheap (a few simple shapes) and fits the room.
- **The message**, shown when you walk into the rope, with buttons:
  - Not signed in: "The Salon is for players with a BNS name. Join the room so we can check yours." [Join the room]
  - No name: "The Salon is for players with a BNS name. ST1AB…9XYZ doesn't have one yet." [Get a BNS name at bns.one ↗] [I have one now: check again]
  - Owns names but none is primary (if we can tell, decision 1): "Set one of your names as primary to come in." [How ↗] [Check again]
  - Could not check: "We couldn't check your BNS name just now." [Try again]
  - Room offline: "The Salon needs the room to check names, and it's offline right now."
  - Allowed: no message; the rope is gone and your tag shows your name.
- **Every other way into the Salon tables** goes through one check in `setFocus()`, so none of them gets round the door:
  - the ⛓ Strata Club button in the top bar;
  - the "Salon Hold'em" and "Salon Liar's Dice" buttons on the welcome panel;
  - clicking a Salon table in the overview;
  - `?meet=pvpholdem` and `?meet=liars` invite links;
  - the no-WebGL table list.
  The "Private salon" camera view stays: looking in is fine; sitting and playing is not (decision 2).
- **Which answer counts.** The page asks the room client (`room.js`), which takes the answer from the room, never from the page
  itself. With an older room (no `salon-bns` feature) the page keeps today's behaviour until the room is deployed.

### Layer 3: the contracts (mainnet, later)

The Salon's play-money matches run through the room today. When they move to the `casino-holdem` and `casino-liars-dice` contracts
with real stakes on mainnet, those contracts should check the name too: in `create-game` and `join-game`, a read-only call to
BNS-V2 `get-primary` for `tx-sender` must return a name. That cannot work on testnet (no mainnet names there), so it belongs with
the mainnet move and its review, not now.

## 3. Build steps

1. **Server lookup** (`functions/lib/casino-room-bns.ts`): `primaryNameOf(address)` → `{ name, checked }`, mainnet twin, 3 s
   timeout, both Hiro API bases, 10-minute cache. Unit tests with a mocked fetch: name, none, failed, unparseable, timeout.
2. **Session** (`functions/lib/casino-room-proof.ts`, `functions/casino/room/session.ts`, `ws.ts`): cookie fields `bn`, `bc`; the
   `/session/bns` re-check; headers `x-px-bns`, `x-px-bnsc`. A cookie issued before this change reads as "not checked", and the
   page offers "check again".
3. **Room rules** (`functions/lib/casino-room.ts`, `casino-social.ts`, `workers/casino-room/index.ts`): `Peer.bn`, `Peer.bc`;
   refusals for `seek`, `pvp`, Salon seats and Salon moves; `you.bns`, `you.bnsChecked`; feature `salon-bns`. Unit tests, and an
   end-to-end case against a local room (a throwaway key has no name, so it is refused; the "has a name" case is covered by unit
   tests and by Jim's own wallet).
4. **Room client** (`src/casino-room/main.ts`): pass `{ address, bns, checked }` to the page (`PXRoomHost.identity`); a
   `checkBns()` for the button. Rebuild `room.js`, bump `?v=`.
5. **Page**: `salonAllowed()`; the arch wall; rope and sign; the message panel and its buttons; the `setFocus` check. Browser test
   on the real page with a stand-in room: blocked without a name (the wall holds, the message shows, every entry point is
   refused), allowed with one (walk through, sit, Find a player), leaving always works, no errors.
6. **Docs**: the presence plan, the room README, the changelog.

Deploy order as before: the room Worker, then the site.

## 4. Cost

One BNS read per sign-in (4-hour sessions), cached for 10 minutes, plus one per "check again". Nothing per frame or per message.

## 5. Things to know

- **Names are mainnet, the casino is testnet.** The check uses the mainnet twin of a testnet key, as the name tags do. A
  testnet-only wallet (including the new casino wallets) can never pass until it is the same key as a mainnet wallet with a name.
  That fits the aim, but the "No name" message should say plainly that it means a mainnet BNS name.
- **Selling a name.** The name is read at sign-in; someone who sells or changes it keeps access until their 4-hour session ends.
  A re-check on every Salon match would close that gap at one read per match (decision 4).
- **A failed lookup closes the door with "try again"**, it does not let people in. The other choice would be to let people in
  when the check fails (decision 5).

## 6. Decisions (Jim, 2026-11-01)

1. **Primary name only.** Owning names without a primary does not count; the message says to set one as primary.
2. **The whole Salon is closed without a name**, practice against the bot included.
3. **The "Private salon" camera view stays open to everyone**, with a visual cue explaining the rule when someone without a name
   tries to go further (click a table, sit, use a Salon button): the rope and sign at the arch, and the same message as at the door.
4. **The name is checked at sign-in** (plus "check again" on request), not before every match.
5. **A failed lookup keeps the door closed**, with "We couldn't check your BNS name just now" and a Try again button.
6. **"Get a BNS name" links to https://bns.one.**
