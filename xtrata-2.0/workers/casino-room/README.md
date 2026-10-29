# Casino room (P0 spike, P1 on /casino, plus Talk)

The live part of "people in the casino": who is signed in, which seat or bar stool each person is at, and (Talk) a list of the
people in the room that signed-in players can click to send a private message, plus a public room chat. Plan and reasoning:
`docs/plans/CASINO-PRESENCE-PLAN.md`. This is a throwaway test of the risky parts (a free wallet signature, a Durable Object,
WebSockets through Cloudflare Pages, reconnecting). The test page `/casino-room-spike/` is where the risky parts are tried first; P1 (below) brings people and seats into `/casino`, and the Talk screen exists only on the test page so far.

The room never handles money. A seat in the room does not give a seat at a contract table.

## P1: people in /casino

`/casino` now loads `room.js` (source `src/casino-room/`, build `npm run build:casino-room`, committed bundle `public/casino/room.js`,
loaded as a module so a failure there cannot stop the page). It looks the room up on load; if the room answers "offline" or cannot be
reached it does nothing at all (no button, no figures), which is why **production is unchanged until its binding is switched on**.
When the room is on, a **Room** button joins the top-right buttons: a guest watches, one free signature joins, and sitting at a table
or standing at a machine puts that person's Adrian (with a BNS-or-short-address name tag) there for everybody.

| Piece | Where |
| --- | --- |
| Client: sign-in, WebSocket, button and panel, BNS names | `src/casino-room/main.ts`, `src/casino-room/wallet.ts` |
| Page side (figures, name tags, seat detection, "take another seat if this one is taken") | one block in `public/casino/index.html` just before `window.__casino =` (search `PXRoomHost`), plus two one-line hooks (`steer` in `setFocus`, `freezeBeyond` in the Adrian update loop) |
| The contract between them | `window.PXRoomHost`: `currentSpot()`, `setPeople(list)`, `steer(station, seat)`, `mount()`, `debug()` |
| Spot ids (14 seats, 10 cabinets, 4 reserved bar stools) | `SPOTS` in `functions/lib/casino-room.ts`; `functions/lib/__tests__/casino-room-spots.test.ts` reads the page and fails if the two disagree |

**Changing `SPOTS` means redeploying the room Worker** (`npx wrangler deploy --config workers/casino-room/wrangler.toml`), then the Pages
build. Until the Worker is redeployed an older Worker refuses the new ids (`no-such-spot`) and nobody is drawn at those places.

Numbers: at most 16 people drawn on desktop and 6 on phones (the rest are counted but not drawn); figures are built one every 120 ms; people
more than 12 m away stand still; a person is never drawn in the seat the visitor is in.

## What is in it

| Piece | Where |
| --- | --- |
| The room (Durable Object, its own Worker `xtrata-casino-room`) | `workers/casino-room/index.ts` |
| Room rules (seats, limits, messages); no Cloudflare code | `functions/lib/casino-room.ts` |
| Sign-in proof (SIP-018 signature, 4 h cookie) | `functions/lib/casino-room-proof.ts` |
| Three Pages Functions: challenge, session, ws | `functions/casino/room/` |
| Test page and its committed bundle | `public/casino-room-spike/`, source `src/casino-room-spike/` (`npm run build:casino-room-spike`) |
| Tests | `functions/lib/__tests__/casino-room*.test.ts`, `functions/__tests__/casino-room-*.test.ts` |

The Worker has **no public address** (`workers_dev = false`, no routes). Only the Pages project can reach it, through its
binding, and `functions/casino/room/ws.ts` is the only place that sets the trusted `x-px-addr` header, after checking the
visitor's signed cookie. Never add a route or a workers.dev address to it.

## Talk: people list, public chat, private messages

Built on the same room and the same sign-in. Only the test page `/casino-room-spike/` has the Talk screen; `/casino` (P1) is unchanged by it. `/casino` still receives the extra messages and fields Talk adds (`players`, `join`, `leave`, ...) and ignores them, and `public/casino/room.js` does not need rebuilding for Talk.

- **Who can do what.** Signed-in players can read and post. A guest (no sign-in) sees the list of people and the seats, nothing
  else: a guest who tries to say, message or report gets `sign-in-first`, and public chat and private messages are never sent to
  guests at all.
- **People list.** Every `room` message now carries `players` (one entry per signed-in address: `{a, n, spot}`). `join` and
  `leave` are broadcast when a person's first connection opens and their last one closes, so a second tab of the same person
  causes neither.
- **Messages the client sends.** `say {text}` to the room, `dm {to, text}` to one person, `blocks {list}` (the full list, which
  replaces the old one), `report {who, why, lines}`. Replies: `say`, `dm`, `join`, `leave`, `blocks`, `reported`, or `err {code}`.
- **A private message goes to every open tab of the recipient**, and an echo goes to every tab of the sender, so a person with
  two tabs sees the whole conversation in both.
- **Limits** (all in `functions/lib/casino-room.ts`, with tests): 280 characters (counted as characters, not bytes); one chat
  message every 2 seconds and 20 a minute; 2048-byte frames; 40 blocked people; no links (`://`, `www.`, and bare domains on
  the usual scam TLDs); hidden and direction-changing characters and line breaks are stripped before anything else is checked.
  The refusal codes are `empty`, `too-long`, `no-links`, `slow-down`, `no-such-player`, `not-you`, `not-here`, `blocked`,
  `too-many-blocks`, `sign-in-first`, `gone`.
- **Blocking is two-way.** If Alice blocks Bob, she stops hearing him and he stops reaching her. Bob is not told: he still sees
  his own message echoed, as if it went through. (If you block someone yourself and then message them, you are told: `blocked`.) The block list lives with the connection, so it survives the room hibernating;
  the test page also saves it in the browser (`px_room_blocks_v1`) and sends it again on every connect, so it survives a
  reconnect or a deploy as well.
- **Nothing is stored.** Public chat and private messages are passed on and forgotten: someone who joins sees only what is said
  after they arrive, and a message to a person who just left is refused with `not-here`. Reports are the only thing the room
  writes down.
- **Reports.** A report is `{at, by, who, why, lines}`: `why` is one of `spam`, `abuse`, `scam`, `other`, and `lines` (up to 5, 200
  characters each) is what the reporter's own browser chose to attach, so treat it as the reporter's account, not proof. The
  room keeps the newest 200 in its storage and writes each one to the Worker log as `[casino-room] report {...}`. **There is no
  page to read them yet**: watch with `npx wrangler tail xtrata-casino-room --format pretty` (or the Logs tab on the Worker in
  the dashboard). If the room is ever opened up beyond the test page, an admin view is the next thing to build.
- **A lost connection is not an empty room.** While the page is disconnected it keeps the last known list on screen, dimmed and
  marked out of date, says "Reconnecting...", and disables the message box. It only says nobody is signed in when the room
  itself said so.
- **The room still never handles money.** Drinks and tokens between players are a later phase and must be real on-chain
  transfers; nothing in Talk moves a token.

## Switching it on (preview first)

Run these from `xtrata-2.0` after `git fetch && git checkout claude/casino-room-spike && npm install`.

1. **Deploy the room Worker first.**
   `npx wrangler deploy --config workers/casino-room/wrangler.toml`
   It should report `xtrata-casino-room` with the `CasinoRoom` Durable Object. It prints no web address; that is correct.
   (A Pages deployment that points at a Worker which does not exist yet fails its checks, so this comes before anything else.)
2. **Add the secret** in the dashboard: Workers & Pages -> xtrata -> Settings -> Variables and Secrets. Add a **Secret** named
   `CASINO_ROOM_SECRET` for **Preview** (and later Production). Any random string of 32 or more characters, for example the
   output of `openssl rand -base64 48`. Changing it later signs everyone out; nothing else depends on it.
3. **The binding is already in `wrangler.toml`** (preview only). That file is the source of truth for this Pages project, so the
   dashboard shows the binding read-only; do not try to add it there.
4. **Let Cloudflare build the branch.** Pushing `claude/casino-room-spike` gives a preview deployment. Open
   `<that preview address>/casino-room-spike/`. The room line should say "Connected to the room".
5. **Automated check against the preview** (about 30 seconds, uses throwaway keys, no wallet):
   `ROOM_E2E_URL=https://<preview address> npx vitest run functions/__tests__/casino-room-e2e.test.ts`
   Add `ROOM_E2E_IDLE_MS=60000` for a longer idle test.
6. **Real wallets** (what no script can check). On the test page press Connect Leather or Connect Xverse, then Sign in, take a
   seat, and watch from a second browser. Do it with Leather and Xverse on desktop and Xverse on a phone. Use the same wallet
   setup you use for the casino (testnet is fine; mainnet works too) and a throwaway account. The wallet should say it signs a
   message, with no fee: in Xverse tap the "Message" row to read it. It is one sentence starting "ParallaX Casino room sign-in.
   This is free...". Then press "Make report" and paste the text back.
7. **Production** only after 4 to 6 pass: uncomment the production block at the bottom of `wrangler.toml`, add the secret for
   Production, redeploy.

## Switching it off

- Quick: add a Secret `CASINO_ROOM_DISABLED` = `1` for the environment and redeploy it. Every room route then answers "room
  offline" and nothing else changes. (Use a Secret, not a `[vars]` entry; a var and a secret cannot share a name.)
- Complete: delete the binding blocks from `wrangler.toml`, then `npx wrangler delete --name xtrata-casino-room` (this also
  deletes the room's small stored data, which is only the single-use sign-in markers).

## Running it locally

```
npx wrangler dev --config workers/casino-room/wrangler.toml --port 8787 --persist-to .wrangler/room-worker
npx wrangler pages dev public --port 8788 --do CASINO_ROOM=CasinoRoom@xtrata-casino-room \
  --binding CASINO_ROOM_SECRET=<any 32+ characters> --persist-to .wrangler/room-pages
ROOM_E2E_URL=http://localhost:8788 npx vitest run functions/__tests__/casino-room-e2e.test.ts
```

Local wrangler 4.106 supports compatibility dates up to 2026-07-07, which is why the Worker pins `2026-07-01`.

## What the local runs showed, and what they cannot

Shown locally (Cloudflare's local runtime, the same code that runs in production): a signature signs one visitor in once and
cannot be replayed; seats are first come first served and one address holds one seat; a forged identity header or bad cookie
gives a guest; other websites are refused; an idle room hibernates and wakes with every seat intact; stopping and restarting the
Worker (what a deploy does) disconnects everyone, the pages say so, then reconnect on their own and sit back down; the test page
works at phone width.

Talk, locally: 14 end-to-end checks (the 7 above plus 7 for Talk, including that block lists and the people list survive a
hibernation) and a two-browser check of the test page (guest, public chat, private messages with an unread dot, a link being
refused and the words handed back, hostile HTML shown as plain text, block, report, leave, no sideways scroll at 390 px wide, and
the Worker being stopped and restarted underneath open pages). Talk has not yet been run on the deployed preview.

Confirmed on the deployed Cloudflare preview (2026-10-29), before Talk: the same 7 end-to-end checks pass, so a Pages Function does forward a
WebSocket to the Durable Object, and the room hibernates and wakes with every seat intact (about 47 ms for the first message after
a 20 s idle).

Still to check by hand: Talk on the deployed preview (`ROOM_E2E_URL=https://<preview address>`, now 14 checks), real Leather and
Xverse signing on desktop and phone with two accounts talking to each other, and watching a real Worker deploy reconnect everyone
on Cloudflare (it was observed locally).
