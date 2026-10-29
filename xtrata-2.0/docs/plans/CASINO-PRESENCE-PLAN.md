# ParallaX Casino: people in the room (presence plan)

Status: plan only, written 2026-10-29. Nothing is built, deployed or signed. Request came from Steve via Jim: players should be able to connect so that they are actually *seen* in the room, as an Adrian sitting where they signed in (a table, the bar, a machine) with a name tag, and other players can click them and send messages. Aim: people feel they are in a shared space.

Pages this applies to: `/casino` and `/casino-b` (both already contain the room, Adrian, the bar, the tables and the machines). Related plans: `CASINO-ONCHAIN-LAYR-PLAN.md` (chips and sessions), `CASINO-ROUND-LOG.md` (the logger, a separate thing), `casino-pvp-design.md` in the Project docs (the two player-versus-player tables).

---

## 1. The short answer

**Use a wallet signature, not a transaction.** A signature is made by the wallet in a few seconds, costs nothing, and does not wait for a block. The 10 to 30 seconds you describe is the cost of a *transaction* (wallet approval, broadcast, inclusion in a block); a signature skips all of it. The server checks the signature, learns which Stacks address is really behind the browser, and puts that person's Adrian at the spot they picked.

**What stays on chain:** who you are (your address and BNS name, which the signature proves), what you hold, and anything that moves money (chips, PvP table stakes, tips). **What does not go on chain:** where you are sitting right now. Writing a seat to the chain would cost a fee and a wallet prompt every time someone sat down or stood up, would leave "ghosts" (nobody pays a fee to leave), and would publish every visit permanently. That is the clunky version, and there is no benefit to the player.

**Recommended shape:**
1. Everyone can walk the room and *see* the people sitting in it without signing (guests are invisible to others).
2. A visible "Join the room" button asks for **one signature per visit**. After that, sitting down, standing up, moving to another seat and messaging are free clicks with no further wallet prompts.
3. A small live service (a Cloudflare Durable Object, already chosen for messaging) holds who sits where and relays messages. State is tiny (about 20 to 30 spots, not 30-times-a-second positions), so it is cheap and simple.
4. Each seated person is an Adrian, static (seated or standing pose, no movement needed), with a name tag. If they move seat, the figure simply appears at the new spot (optionally walks there from the door).
5. Click a person: a small card with their name, **Message**, and later **Buy a drink** and **Send LAYR**.

---

## 2. What exists today (read from the code, 2026-10-29)

| Thing | Where | Why it matters |
|---|---|---|
| Adrian, the one character | `XA_HOSTS` in both pages (`window.XA_HOSTS = {...}`); `ONE_CHARACTER = 'm1'` (a switch back to six personas exists); skeleton-aware clones; 15 baked clips | Remote players reuse this. Seat pose `seat:{h:0.57}`, `person` (persona) and `wear:{shirt,trousers}` already exist, so a player's colours can be set per person. `XA_HOSTS.add(spec)` takes `group, x, z, yaw, person, wear, seat, fig, showWhen`. The part I read exposes `add`, `cue`, `update`, `hosts`, `ready`; **I did not confirm a remove, move or re-tint call**, so those are P1 work (or use a fixed pool of spare figures whose `showWhen` and position are changed). |
| Seats | `SEATS` in `/casino` (about line 7469): `blackjack` 2, `baccarat` 2, `holdem` 2, `roulette` 1 pad, `videopoker` 1 pad, `pvpholdem` 3, `liars` 3, plus one standing pad per machine (`FM.list`: the five fruit machines and the LAYR Exchange) | This is almost exactly the "spots" list. Each has a world position (`seatWorld`, `standWorld`) and a facing. `/casino-b` has its own layout and its own SEATS table; the spot list is per page. |
| NPC people | In `/casino`: dealers, a greeter, a bartender (`room.barPos`) and NPC players seated at the Hold'em table; the standing-patron list (`patrons`) is **empty** in this build. `/casino-b` has its own cast, including an NPC guest at one machine. `showWhen` can hide a figure | A real person who takes a spot an NPC occupies hides the NPC. The room is quite empty of "customers" today, which is part of why shared presence would help; NPC patrons could also be brought back as filler when few real people are online (decision for Jim, not in this plan's phases). |
| Bar | bartender and bar are dressing; **there are no bar-stool spots yet** | Bar seats are new work (a few stool positions). |
| Opponent chairs at the PvP tables | `group.userData.oppSeated` already shows an opponent figure from match state | For the player-versus-player tables the seated person can come **from the chain** (the contract knows both principals), no signature or server needed. See section 6. |
| Wallet | `/casino` reads addresses with `stx_getAddresses` and takes payment with `stx_transferStx`; **it has no signing code**. `/casino-b` bundles `@stacks/connect` (which includes `stx_signMessage` and `stx_signStructuredMessage`). | The signing step is new for `/casino`. The repo already has a tested helper for it (`src/lib/wallet/structured-sign.ts`) and `docs/WALLET-PLAYBOOK.md` section on SIP-018: legacy bridge first, RPC only when the wallet removed it. |
| Server-side signature check | `functions/lib/creator-proof.ts` (`verifyCreatorProof`: SIP-018 hash, recover public key, compare address) and `functions/lib/creator-auth.ts` (sign once, get an HttpOnly session cookie) | Proven pattern for exactly this, already tested. The casino version must use a **different SIP-018 domain** so a casino signature can never be replayed as a Studio login (or the reverse). |
| Cloudflare | Pages project (`wrangler.toml`: D1 `DB`, R2 buckets); separate Workers already live in `workers/` (`audionaut-royalties`, `collection-storage`, `radio-gift-sweep`); subdomains `radio.` and `wallet.xtrata.xyz` are in use | A Durable Object class cannot live in a Pages project: it needs its own Worker (`workers/casino-room/`), bound to Pages. That matches how the repo already does Workers. |
| Decision already made | Jim chose Cloudflare Durable Objects (not D1/R2) for in-room messaging | This plan follows that. |

---

## 3. What the player sees

1. **Arrive.** Walk in as today. You can see seated Adrians with name tags. Nobody sees you. A small badge in a corner: "You are watching. Join the room".
2. **Join.** Click it. The wallet asks for one signature. The prompt shows the app name ("ParallaX Casino"), what it is for ("room entry") and an expiry. No fee, no transaction.
3. **Sit.** Walk up to any free spot and press the usual SIT/PLAY (or click a glowing ring, as today). Your Adrian appears there (fade in, or walk in from the door), with your tag. Others see you appear.
4. **Be seen.** Your tag floats over your head: BNS name if you have one, otherwise a short address like `SP3J…X743`. Until you pick your own look (section 4.4), your clothes and hair come from your address (stable, so people learn to recognise you).
5. **Talk.** Anyone clicks you: a card with your name and **Message**. Messages open a small chat window. They are temporary (see section 7).
6. **Leave.** Stand up, close the tab, or go quiet for a minute: your Adrian disappears. Come back within the session window and you are signed in again with no prompt.

Optional later: a wave or raise-glass emote (the 15 baked clips already include gestures), drinks, tips, a profile picture badge.

---

## 4. The decisions and the options

### 4.1 What "signing in" means (the main choice)

| Option | How it works | Wallet prompts | Seen by others after | Trust | Notes |
|---|---|---|---|---|---|
| **A. One signature per visit (recommended)** | Sign a challenge once; the server gives a 4-hour session; seat moves are free | 1 per visit | about 1 second | Server vouches for who sits where | Same pattern as the Studio login. Simplest to build and to explain. |
| B. Signature per seat | Every sit or move needs a signature | 1 per seat change | seconds | Server | This is the "clunky" version. Only worth it if the seat itself must be proven (not needed: stakes are bound by contracts). |
| C. Signature that authorises a session key | Wallet signs "this temporary key speaks for me for 4 hours"; the page signs every seat claim and message with the temporary key; clients can verify the whole chain themselves | 1 per visit | about 1 second | Server can only drop or delay, not invent | Stronger: other players (and replays) can verify that a message really came from that address even through our server. More code (a small signature library on the page). A good P5 hardening step on top of A. |
| D. On-chain check-in transaction | A contract call `sit(spot)` | 1 per change, plus fee | 10 to 30 s | Chain | Public, permanent, costs fees, leaves ghosts. Not recommended for presence. Fine for an *optional* souvenir ("visited the casino" stamp) later. |

**Recommendation: A now, C later if wanted.** A and C use the same first signature, so moving to C later does not change the player experience.

### 4.2 Where the live room runs

| Option | Pros | Cons |
|---|---|---|
| **Durable Object with WebSockets (recommended; already chosen)** | Push messages instantly; one object holds the whole room; "hibernation" means an idle room costs almost nothing | New Worker to deploy; a deploy disconnects everyone for a moment (clients reconnect and re-sit) |
| D1 plus polling every 5 to 10 s | No new Worker; the avatars are static anyway | Messages feel slow; heartbeat writes; stale-row cleanup; Jim already chose not to use D1 for this |
| On chain | See 4.1 D | See 4.1 D |

### 4.3 Name tag

- **Default:** BNS name of the signing address if it has one, otherwise short address. Both come from the chain, so nobody can pretend to be "Xtrata Admin" or someone else.
- Free-text nicknames are **not** in v1 (impersonation and abuse). Possible later: a nickname that is always shown with the address suffix.
- Players can choose **"Show as Guest 4821"** (no name, no address in the room list) and still sit and chat.

### 4.4 Player look ("PFP") and customisation

Jim wants good, simple, cheap options. "Cheap" here means: uses what the Adrian code already supports, needs no new 3D models, nothing to upload, nothing to moderate, and costs the player nothing. What the code supports today (read in `public/casino/index.html`): six body/hair personas (`m1 m2 m3 f1 f2 f3`; the page currently locks everybody to `m1` through `ONE_CHARACTER`, so remote players need that switch made per person), own-clothes tint (`wear: {shirt, trousers}`), hair colour and hair-do per persona, skin tint, and the existing gestures (`greet`, `nod`, `win`, `lose`, `deal`, `reveal`). **Not supported:** hats, glasses, jewellery or any accessory; those would need new modelled parts and are not cheap.

**The menu (a "Look" panel, free, instant, changeable any time):**

| # | Option | Choices | Built on |
|---|---|---|---|
| 1 | Body and hair style | 6 personas | existing personas |
| 2 | Shirt colour | about 16 swatches | `dressCivilian` |
| 3 | Trousers colour | about 8 swatches | `dressCivilian` |
| 4 | Hair colour | about 8 | persona `hairColor` |
| 5 | Skin tone | about 6 | persona `look` tint |
| 6 | Name tag style | frame colour (about 8) plus a small icon (suits, chip, star, bolt, and similar, about 12) | tag sprite, new but tiny |
| 7 | Arrival gesture | none, nod, wave/greet | existing gestures |
| 8 | A drink on your table | none, whisky, cocktail, water | a small glass prop like the bar's bottles and glasses |
| 9 | Holder badges | automatic, from the chain (for example Forever Twins holder), shown as a tiny badge on the tag | chain read, no player choice, nothing to fake |

Players do not get the staff waistcoats (house liveries), so a player never looks like a dealer or the bartender.

**Where it is stored:** off chain, in the room service, against the player's address, as a handful of small numbers (for example `{p:2, s:7, t:3, h:1, k:4, i:6, g:1, d:2}`, under 40 bytes). The server only accepts values from the fixed lists above, so nobody can send odd colours or text. Changing look is a free message, no wallet prompt. Until a player chooses, their look comes from a hash of their address, so everyone looks different from the first visit. An optional "make my look permanent" step on chain (a small contract write) could come later if Jim wants it to follow players across apps; it is not needed for the room.

**Later, a real picture (not in v1):** a small round picture next to the tag, taken from an Xtrata inscription the signer owns (checked against the chain) and shown as a thumbnail (the repo already has `functions/lib/thumbnails.ts`). Inscription content is arbitrary, so this needs an allowlist of collections (for example Forever Twins and the other forevered collections already used on the machines) or a report-and-hide tool.

**Recommendation:** ship options 1 to 6 with the first version of the room (they are almost all colour and list work), add 7 to 9 next, and keep the picture badge as a separate decision.

### 4.5 Who can be seen and who can talk

- Guests (no signature): see everything, are invisible, cannot message.
- Joined players: visible (unless Guest mode), can message other joined players.
- A player can **mute** or **block** anyone. Blocking hides that person's messages and also hides you from them.

---

## 5. How it works (recommended design)

```
Browser (/casino or /casino-b)            Pages Functions                  Worker: casino-room
   |  1. GET  /casino/room/challenge  --->  makes a nonce (60 s) ...
   |  2. wallet signs (SIP-018)
   |  3. POST /casino/room/session   --->   verifies signature, sets HttpOnly cookie px_room (4 h, HMAC-signed)
   |  4. WS   /casino/room/ws        --->   checks cookie + Origin, adds header x-px-addr  --->  Durable Object "main"
   |                                                                                             spots, messages
   |  5. {t:'sit', spot:'blackjack.1'}  ---------------------------------------------------->   updates the spot map
   |  <---------------- {t:'sat', spot, who:{...}} to everyone -----------------------------
```

- **The Durable Object trusts only the Pages Function.** The Worker exposes no public route (workers.dev route off), so the `x-px-addr` header cannot be forged from outside. Signature checking happens in the Pages Function, reusing the Studio login code with a casino-specific domain.
- **Challenge and signature.** SIP-018 structured message. Domain: `{ name: "ParallaX Casino", version: "1", chain-id }` (chain id of the network the casino runs on). Message: `{ purpose: "room-entry", room: "casino", nonce, expires }`. The nonce is single use and lasts 60 seconds. The domain differs from the Studio login so one can never be replayed as the other.
- **One address, one seat.** A second tab for the same address takes over; the first is told "you moved".
- **No timers in the object.** Idle cleanup is done lazily (on each message and on socket close), because timers and alarms keep a Durable Object awake and defeat hibernation.
- **Fail open.** If the room service is down or disabled (`CASINO_ROOM_DISABLED=1`), the casino plays exactly as today; the room badge says "room offline".
- **A failed connection is not an empty room.** (The repo's recurring bug class: a read that failed must not be shown as "nothing there".) If the socket cannot be opened or drops, the client keeps showing the last known people greyed out for a few seconds, then shows "room offline / reconnecting". It never shows "nobody is here" unless the server actually said the room is empty.
- **Not a game referee.** Presence never decides money. A seat in the room does not give a seat at a contract table.

### 5.1 Messages (version 1, JSON)

Client to server:
`{t:'hello',v:1,page}` · `{t:'sit',spot}` · `{t:'stand'}` · `{t:'dm',to,text}` · `{t:'mute',who}` · `{t:'block',who}` · `{t:'report',who,why}` · `{t:'ping'}`

Server to client:
`{t:'room',you,spots:{<spotId>:{a,n,c,since}},count}` (on join) · `{t:'sat',spot,who}` · `{t:'stood',spot}` · `{t:'dm',from,text,at}` · `{t:'err',code}`

### 5.2 Spots

A fixed list per page (`blackjack.1`, `blackjack.2`, `holdem.1`, `pvpholdem.1`, `liars.2`, `roulette.pad`, `bf.pad`, `bar.1` and so on), taken from `SEATS` plus new bar stools. The server accepts only ids in its list. First come first served; a taken spot is refused with `err:'taken'`. Spots expire when the owner leaves or goes quiet for 60 seconds.

### 5.3 Limits and safety (v1 numbers, adjustable)

- Text messages only, 280 characters, **no links** (a wallet app should not become a phishing channel; "send me LAYR" scams are the obvious abuse).
- 1 message per 2 seconds, 20 per minute; 6 seat changes per minute; 2 sockets per address; 6 per IP; 300 per room.
- Messages are **not stored**: they live in the object's memory for delivery and disappear when the room restarts. The operator can see them in transit, so the UI says "messages here are not private". There is no end-to-end encryption in this plan.
- Server-side ban list by address (kept in the object's storage, edited by an admin route).
- Report button sends a short record (who, why, last 5 messages) to the admin.
- Kill switch and a per-address mute for the whole room.

---

## 6. Where the chain really comes in

1. **Identity.** The signature proves control of an address, and the address gives BNS name and holdings (a badge for Forever Twins holders is easy and free).
2. **Player-versus-player tables.** The contracts know both principals. The opponent figure and the name tag at those tables should come straight from the contract's game state, no server or signature needed. A signature-based seat at those tables would be redundant and confusing.
3. **Giving things.** Drinks, tips and "hand chips to a player" must be real `layr` transfers (a wallet transaction with post-conditions). They depend on the chip token in the on-chain LAYR plan (phase P1 there). Until then LAYR is browser-only play money and cannot be sent between people. Cosmetic-only drinks (a glass appears) could ship earlier.
4. **Optional stamp later.** A one-off "I was here" souvenir (a cheap mint or contract call) is a fun extra, separate from presence and entirely opt-in.
5. **Later hardening (option C).** Session-key signing so that anybody can verify that a message or seat really came from an address, without trusting our server.

---

## 7. Work inside the two pages

- **Remote figures:** a pool of at most N Adrian clones (suggest 16 on desktop, 6 on phones), each given the spot's position, the person's colours and a `showWhen`. People beyond the cap show as a name tag and a simple marker. Static people need no animation updates (frozen pose), which keeps cost near the cost of drawing them.
- **Name tags:** a sprite with a canvas texture above the head (the pages already use sprites for glows). Hidden beyond a distance; clamped size.
- **Click a person:** raycast against the figure; open the card. Needs to coexist with pointer lock and touch (the pages already handle both for seats).
- **Message window:** one small panel; unread dot; mute/block menu.
- **Both pages:** `/casino` is produced by my assemble script (kept outside the repo, like the round-log client) and `/casino-b` by a patch script run over the GPT build. The presence module should be one shared piece of JavaScript inserted into both builds, like the round-log client, with a tiny per-page adapter (spot list, `XA_HOSTS`, wallet call).
- **Wallet in `/casino`:** add the signing call using the same rules as the playbook (providers on the top window; legacy first, RPC when it is gone). If the casino is later shown inside a sandboxed frame in the arcade hall, signing must go through the hall's bridge (open question already in the PvP notes).

---

## 8. Phases (each shippable, testnet only until Jim says otherwise)

| Phase | What ships | Gate to pass |
|---|---|---|
| **P0. Spike** | Read `docs/WALLET-PLAYBOOK.md` in full first (its section 10 is the ship checklist for any wallet change). Then a throwaway Worker with the Durable Object, a Pages Function that forwards a WebSocket to it, and a sign-in button on `/casino`. | (a) WebSocket forwarding from a Pages Function works (the Cloudflare pages I read do not say either way; if not, put the Worker on a subdomain like `room.xtrata.xyz`, as `radio.` and `wallet.` already are). (b) Leather and Xverse, desktop **and** mobile, return a signature the server accepts. (c) Hibernation works and a deploy reconnects cleanly. |
| **P1. Seen** | Sign-in, spot map, static Adrians with name tags on both pages; guests can watch; NPC patrons yield to real people. | Two real browsers see each other; refresh keeps you seated; closing the tab clears you within about a minute; fail-open verified by killing the service; frame time with 16 figures checked on the slow headless renderer and on a real GPU/phone. |
| **P2. Talk** | Click-a-person card, private messages, mute/block/report, rate limits. | Abuse tests (spam, links, oversize, replayed challenge, forged header, second tab). |
| **P3. Look** | The Look panel (section 4.4: options 1 to 6 first, then 7 to 9), bar stools, walk-in animation. The picture badge from an owned inscription (allowlist) is a separate, later decision. | Visual review with Jim; badge fetch cannot block rendering. |
| **P4. Give** | Drinks, tips, hand LAYR via `layr` transfers. | Depends on the on-chain LAYR plan P1; real post-conditions; conservation checks. |
| **P5. Prove** | Session-key signing (option C), verifiable messages, moderation console, mainnet review. | Independent review of the signing scheme; Jim's explicit go for mainnet. |

**P0 in plain words.** A small throwaway test, not a feature. Three pieces: (1) a tiny Worker holding the Durable Object, which only counts connections and says who is here; (2) a Pages Function that forwards a browser's WebSocket to it and checks the wallet signature (the Studio login code with a new casino domain); (3) a hidden test page, not linked from `/casino`, with a Sign in button that shows "connected as SP…" and the other open tabs. It answers three questions: does Pages forward the WebSocket, do Leather and Xverse (desktop and phone) sign and does our server accept it, does the room survive hibernation and a deploy. It does not touch `/casino`, `/casino-b`, any contract, or any chips or STX; the signature is free and nothing is written to a chain. I build and test it locally with `wrangler dev`; deploying the Worker, binding it to the Pages project and adding one secret need Jim's Cloudflare account (three or four commands, given to him ready to paste), and the real-wallet checks need Jim's wallets. Undo: delete the Worker and the binding.

Tests, in the style of the rest of the repo: the room logic (spots, limits, bans) is a plain module with unit tests; the Durable Object is a thin shell around it; the Pages Functions get request/response tests like `casino-log.test.ts`; the browser side is tested with several headless browsers at once against `wrangler dev`, using the fake-wallet approach from the existing wallet tests. Real wallets are tested by hand on the final gate.

---

## 9. Cost and scale (estimate)

Cloudflare's published Durable Object terms (checked 2026-10-29): only SQLite-backed objects on the Workers Free plan, with 100,000 requests a day free; on the paid plan 1 million requests a month included then $0.15 per million; **incoming** WebSocket messages count at a 20-to-1 ratio (100 messages = 5 requests), outgoing messages are free; an idle object that can hibernate is not billed for time.

At this design's traffic (a seat change or message is a few events per player per hour), 100 players online four hours a day is on the order of tens of thousands of requests a month: very likely inside the free or included allowance. I cannot see which Cloudflare plan the account is on. Continuous walking positions at several updates a second would multiply traffic by 100 to 1,000 times; that is deliberately **not** in this plan, and it is the point at which cost and complexity change.

---

## 10. Risks and things I have not verified

- **Pages to Durable Object WebSocket forwarding** is not confirmed in the docs I could read (they show it for Workers). P0 tests it; the subdomain fallback is straightforward.
- **Wallet signing in each environment** (Xverse and Leather, desktop, mobile, in-app browsers) is the main unknown; the playbook says wallet behaviour has surprised the team before. `/casino` has never asked for a signature.
- **Testnet versus mainnet addresses.** The casino is on testnet; the same key gives an `ST…` and an `SP…` address. Decide which one identifies a player and how BNS (mainnet) is looked up for a testnet address. Needs a rule before P1.
- **Deploys restart the object** and drop everyone for a moment. Clients must reconnect and re-sit automatically.
- **`XA_HOSTS` changes:** a remove / reposition / re-tint call is probably needed (see section 2).
- **Performance** of many skinned Adrians (each has a 163-bone skeleton) is not measured. The cap and static poses are the mitigation; P1 measures it.
- **Privacy:** addresses and BNS names are public data, but listing "who is in the casino now" is still a new disclosure. Guest mode and a clear sign-in prompt are the answer; Jim to confirm the wording.
- **Abuse:** any open chat will be tested. Links are off, rate limits are on, but moderation takes someone's time.

---

## 11. Decisions for Jim

1. Signing method: **A** (one signature per visit), with C later? (Recommended.)
2. Name tag: BNS name or short address only (recommended), or allow nicknames?
3. PFP: Adrian colours only, or also an owned-inscription badge from an allowlist?
4. Can guests (not signed in) see the room's people? (Recommended: yes, invisibly.)
5. Cap on figures drawn (16 desktop, 6 phone suggested) and total room size (300 suggested).
6. Messages: private one-to-one only, or also a public bar chat? (Recommended: private first.)
7. Which Cloudflare route for the live service: Pages function forwarding if the spike confirms it, else a `room.` subdomain?
8. OK to start with the P0 spike on testnet?

## 12. Decisions so far (Jim, 2026-10-29)

1. **One signature per visit: yes** (option A; option C may be added later on top of the same signature).
2. **Name tag: on-chain details only for now** (BNS name, otherwise short address). No nicknames.
3. **Look: wants good, simple, cheap customisation**, not only address-derived colours. Answered by the Look menu in section 4.4 (recolour and list work, no new 3D parts, free, off chain). Jim to say which of options 1 to 9 he wants first and whether the picture badge is wanted at all.
4. **Guests can see the room's people** without signing in (and are invisible to others): yes.
5. Cap on figures drawn (16 desktop, 6 phone) and room size (300): defaults stand unless Jim says otherwise.
6. Messages private one-to-one first, and the choice of route for the live service, still open.
7. **P0 spike:** Jim asked for an explanation before deciding; it is the "P0 in plain words" paragraph in section 8. Go / no-go still to come.

---

## Sources

- Cloudflare, [Pages Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/): a Durable Object cannot be created inside a Pages project; it needs its own Worker bound to Pages.
- Cloudflare, [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing): free and paid allowances, WebSocket 20:1 billing, hibernation.
- Cloudflare, [Durable Objects WebSocket Hibernation API](https://developers.cloudflare.com/durable-objects/api/websockets): hibernating sockets, 16 KiB attachment limit, deploys disconnect clients, timers and alarms prevent hibernation.
- Repo: `docs/WALLET-PLAYBOOK.md`, `src/lib/wallet/structured-sign.ts`, `functions/lib/creator-proof.ts`, `functions/lib/creator-auth.ts`, `public/casino/index.html` (`XA_HOSTS`, `SEATS`, patrons), `workers/`.
