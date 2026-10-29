# Casino room (P0 spike)

The live part of "people in the casino": who is signed in and which seat or bar stool each person is at. Plan and reasoning:
`docs/plans/CASINO-PRESENCE-PLAN.md`. This is a throwaway test of the risky parts (a free wallet signature, a Durable Object,
WebSockets through Cloudflare Pages, reconnecting). It adds **no page to the casino itself**; the only page is `/casino-room-spike/`.

The room never handles money. A seat in the room does not give a seat at a contract table.

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
6. **Real wallets** (what no script can check). On the test page: Connect wallet, Sign in, take a seat, and watch from a second
   browser. Do it with Leather and Xverse on desktop and Xverse on a phone. Leave the wallet on its normal mainnet setting.
   Your wallet should show "ParallaX Casino" and "Casino room entry; no spending permission", with no fee. Then press
   "Make report" and paste the text back.
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

Not shown, and why the preview test matters: whether **production Pages** forwards a WebSocket through a Function to the
Durable Object (Cloudflare's documentation only shows this for Workers), and real Leather and Xverse signing on desktop and phone.
