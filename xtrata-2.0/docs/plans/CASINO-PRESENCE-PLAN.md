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
| 10 | **Wear an NFT** | an NFT you own, printed on the back, the front, or both, of your shirt (section 4.5) | a decal on the torso, new but small |

Players do not get the staff waistcoats (house liveries), so a player never looks like a dealer or the bartender.

**Where it is stored:** off chain, in the room service, against the player's address, as a handful of small numbers (for example `{p:2, s:7, t:3, h:1, k:4, i:6, g:1, d:2}`, under 40 bytes). The server only accepts values from the fixed lists above, so nobody can send odd colours or text. Changing look is a free message, no wallet prompt. Until a player chooses, their look comes from a hash of their address, so everyone looks different from the first visit. An optional "make my look permanent" step on chain (a small contract write) could come later if Jim wants it to follow players across apps; it is not needed for the room.

**A real picture:** Jim wants players to *wear* an NFT image on their Adrian's clothes, like a PFP printed on the shirt. That is option 10 and has its own section (4.5).

**Recommendation:** ship options 1 to 6 with the first version of the room (they are almost all colour and list work), add 7 to 10 next.

### 4.5 Wearing an NFT on your shirt (Jim, 2026-10-29)

**Idea:** a player picks an NFT they own; its image appears printed on the front, the back, or both, of their Adrian's shirt, like a PFP worn as clothing. Other players see it from across the room.

**Why the back matters most:** seated players face their table, so anyone walking up behind sees their back. A back print is what people will actually see; the front is seen by the dealer, the opposite seat and anyone looking across the table.

**Is it feasible with the Adrian model? Yes, with a decal, not by editing the shirt.** What I checked in `adrian.glb` (read from the copy embedded in `/casino`): the shirt is its own skinned mesh (`Tailored_shirt`) with the material "Ivory cotton", which is **a flat colour with no texture image**, so there is no print area to paint into without redoing the shirt's texture layout. The skeleton has torso bones (`spine01` to `spine05`, `clavicle_L/R`). A **decal** is a thin, slightly curved square attached to a torso bone, a few millimetres in front of (or behind) the shirt surface; it follows the pose, and one extra small draw per worn print. Its position is found automatically (a ray from in front or behind hits the shirt in the bind pose, and the decal is parented to the bone at that point), so no hand-tuned numbers per body shape. The model also has a hidden chest "Xtrata woven insignia" badge mesh for staff; that stays hidden for players. **Not yet tried:** fitting on all six personas, how the decal looks while seated, and what it costs on a weak GPU (a 128 x 128 picture per worn print is small).

**Where the picture comes from (the hard part is trust, not drawing):**
1. **Xtrata inscriptions the player owns.** Ownership is a chain read by the room service when the look is saved (and again when the player joins), using the checked-read style the repo requires (a failed read is not "doesn't own it"). The picture is the inscription's thumbnail from the existing `/thumb` pipeline (cached WebP), which is same-origin, so no cross-site image problems.
2. **Other SIP-009 NFTs** point at arbitrary web addresses. Fetching those is a security and moderation risk (huge files, slow hosts, tracking, rude images). Not in the first version; possible later through the same thumbnail pipeline, fetched and shrunk by our server, never by the viewers' browsers.
3. **Moderation, because a shirt in a shared room is public:** only collections on an allowlist (starting with the Forever Twins collections, Bitcoin Pepes and Bitcoin Birds already used on the machines, and Jim's own), a block list for single tokens, and a Report button that hides a print for everyone at once.
4. **Worn only while owned:** if the player no longer holds it when they next join, the print disappears and they are told.

**What others receive:** just `{contract, token id, side}`, a few dozen bytes. Each viewer's browser loads the same cached thumbnail itself. A cap on how many distinct prints are drawn at once (for example 12 desktop, 4 phone) falls back to a plain shirt beyond that.

**Choices for the player:** which NFT (a picker listing what they own from the allowlisted collections), front, back or both, and a size (small / medium). Free, instant, off chain.

**Phase:** the first version of the Look panel (P3) ships options 1 to 6; the NFT shirt print is its own step right after, because it needs the ownership check, the allowlist and the decal work. It does not change P0 or P1.

### 4.6 Who can be seen and who can talk

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
| **P0. Spike** | Read `docs/WALLET-PLAYBOOK.md` in full first (its section 10 is the ship checklist for any wallet change). Then a throwaway Worker with the Durable Object, Pages Functions that forward a WebSocket to it, and a hidden test page `/casino-room-spike/` (nothing is added to `/casino`). **Built; see 8.1.** | (a) WebSocket forwarding from a Pages Function works (the Cloudflare pages I read do not say either way; if not, put the Worker on a subdomain like `room.xtrata.xyz`, as `radio.` and `wallet.` already are). (b) Leather and Xverse, desktop **and** mobile, return a signature the server accepts. (c) Hibernation works and a deploy reconnects cleanly. |
| **P1. Seen** | Sign-in, spot map, static Adrians with name tags on both pages; guests can watch; NPC patrons yield to real people. **Built on `/casino` only (branch `claude/casino-presence-p1`); see 8.2.** | Two real browsers see each other; refresh keeps you seated; closing the tab clears you within about a minute; fail-open verified by killing the service; frame time with 16 figures checked on the slow headless renderer and on a real GPU/phone. |
| **P2. Talk** | Click-a-person card, private messages, mute/block/report, rate limits. | Abuse tests (spam, links, oversize, replayed challenge, forged header, second tab). |
| **P3. Look** | The Look panel (section 4.4: options 1 to 6 first, then 7 to 9), bar stools, walk-in animation. The picture badge from an owned inscription (allowlist) is a separate, later decision. | Visual review with Jim; badge fetch cannot block rendering. |
| **P4. Give** | Drinks, tips, hand LAYR via `layr` transfers. | Depends on the on-chain LAYR plan P1; real post-conditions; conservation checks. |
| **P5. Prove** | Session-key signing (option C), verifiable messages, moderation console, mainnet review. | Independent review of the signing scheme; Jim's explicit go for mainnet. |

**P0 in plain words.** A small throwaway test, not a feature. Three pieces: (1) a tiny Worker holding the Durable Object, which only counts connections and says who is here; (2) a Pages Function that forwards a browser's WebSocket to it and checks the wallet signature (the Studio login code with a new casino domain); (3) a hidden test page, not linked from `/casino`, with a Sign in button that shows "connected as SP…" and the other open tabs. It answers three questions: does Pages forward the WebSocket, do Leather and Xverse (desktop and phone) sign and does our server accept it, does the room survive hibernation and a deploy. It does not touch `/casino`, `/casino-b`, any contract, or any chips or STX; the signature is free and nothing is written to a chain. I build and test it locally with `wrangler dev`; deploying the Worker and adding one secret need Jim's Cloudflare account (one command and one dashboard field, in `workers/casino-room/README.md`; the binding itself is in `wrangler.toml`), and the real-wallet checks need Jim's wallets. Undo: delete the Worker and the binding.

### 8.1 P0 results (branch `claude/casino-room-spike`, 2026-10-29)

Built: the room Worker (`workers/casino-room/`), room rules as a plain tested module, a free SIP-018 sign-in (one signature, 4 hour cookie, single-use challenge), three Pages Functions (`/casino/room/challenge`, `/session`, `/ws`) and the test page. Deploy steps are in `workers/casino-room/README.md`.

| Gate | Result |
|---|---|
| (a) Pages Function forwards a WebSocket to the Durable Object | **Confirmed on Cloudflare** (2026-10-29, branch preview `claude-casino-room-spike.xtrata.pages.dev`): all 7 end-to-end checks pass against the deployed preview, so no `room.` subdomain is needed. |
| (b) Leather and Xverse, desktop and phone, sign and the server accepts | **Xverse desktop: works** (Jim, 2026-10-29): connected through `BitcoinProvider.wallet_connect`, a sign-in had already been accepted by the server and the room showed him seated, on a mainnet `SP…` address. **Leather desktop: could not connect through the app's standard adapter** (see below); the page now connects the way `/casino` does and needs a retest. Xverse phone and Leather phone not yet tried. |
| (c) Hibernation and deploy | **Hibernation confirmed on Cloudflare**: after 20 s idle the room's in-memory instance had been replaced (it slept and woke), every seat was intact and the first message after the idle came back in about 47 ms. **Deploy reconnect confirmed locally**: stopping and restarting the Worker disconnected everyone; both pages said "Disconnected. Reconnecting…" rather than showing an empty room, reconnected on their own about 8 s after the Worker came back, and the signed-in player was sat back down without clicking. Not yet watched live on Cloudflare (a new Worker version deploy). |

Local checks that passed: 30 unit tests; 7 end-to-end tests against the running server (guests cannot sit; sign-in works once and a replay gets 409; seats first come first served; forged `x-px-*` headers and bad cookies become guests; other origins get 403; a second tab takes over the seat and a third closes the oldest connection; slow-down at 12 messages per 10 s; hibernation); 26 checks in a real headless browser with a Leather player on testnet, an Xverse player on mainnet and a guest (one signature only, second tab needs none, seats seen live, sign-out frees the seat, no page errors, phone width).

Found while testing, all fixed:
- **Browser sign-in challenge was refused.** A same-site `GET` carries no `Origin` header (only POST and WebSocket do), so the origin gate rejected the page's own request while scripted tests that add the header passed. The gate now also accepts `Sec-Fetch-Site: same-origin` on a GET (unit tested).
- **The app's standard wallet adapter only accepts mainnet accounts** (`src/lib/wallet/session.ts`), but the casino runs on testnet and `/casino` has its own wallet code that connects with the casino's network (and tells the player "Switch your wallet to testnet"). A Leather set up for the casino answered `getAddresses` with an address the adapter would not accept, so every connect method looked empty and the legacy fallback failed ("This legacy method is no longer supported"). The test page now connects the way `/casino` does and accepts either network (real signing still uses the app's `requestStructuredSignature`). My earlier advice to keep wallets on mainnet was wrong for this casino.
- **The sign-in message was hard to read in Xverse.** It was a record of fields, which Xverse shows collapsed ("Message" row, plus a hash). It is now one plain sentence ("ParallaX Casino room sign-in. This is free: it sends no transaction, costs no fees and gives no permission to spend anything. Account ... Valid until ... Request code ..."), so what is visible when the row is opened reads as text. Xverse still shows the row collapsed by default; nothing we send changes that.
- **`wrangler.toml` is the source of truth for Pages bindings** (it sets `pages_build_output_dir`), so the Durable Object binding is declared there, preview only for now, and cannot be added in the dashboard. The room Worker must be deployed before a Pages deployment that names it.
- Local wrangler 4.106 supports compatibility dates only up to 2026-07-07, so the Worker pins `2026-07-01`.

Tests, in the style of the rest of the repo: the room logic (spots, limits, bans) is a plain module with unit tests; the Durable Object is a thin shell around it; the Pages Functions get request/response tests like `casino-log.test.ts`; the browser side is tested with several headless browsers at once against `wrangler dev`, using the fake-wallet approach from the existing wallet tests. Real wallets are tested by hand on the final gate.


### 8.2 P1 results (branch `claude/casino-presence-p1`, 2026-10-29, `/casino` only)

**What it does.** `/casino` loads `room.js` (source `src/casino-room/`). A **Room** button joins the top-right buttons. A guest watches; one free signature joins (Leather or Xverse, either network); then sitting at a table or standing at a cabinet puts that person's Adrian there for everyone, with a name tag (BNS name if the key has one, otherwise a short address) and clothes chosen from the address, so a person looks the same to everybody. Fourteen table seats and ten cabinets are places; the bar is not yet (its four ids are reserved). If somebody already has the seat you walk up to, you are given a free seat at the same table; if every seat is taken you keep yours and nobody is drawn on top of you. The room never touches chips, STX or the casino's game state, and **production is unchanged** until its binding is switched on: with the room off (503) or unreachable `room.js` draws nothing and adds no button.

**Where it lives.** Client `src/casino-room/main.ts` and `wallet.ts` (bundle `public/casino/room.js`, `npm run build:casino-room`). Page side: one block in `public/casino/index.html` just before `window.__casino =`, wrapped in try/catch so it can never stop the casino, plus two one-line hooks (`steer` in `setFocus`, a far-away freeze in the Adrian update loop). The two halves meet at `window.PXRoomHost` (`currentSpot`, `setPeople`, `steer`, `mount`, `debug`). The server seat list is `SPOTS`; a unit test reads the page and fails if the two disagree. Changing `SPOTS` means redeploying the room Worker.

| Gate | Result |
|---|---|
| Two browsers see each other | **Passes locally** in a real headless browser with throwaway keys: a Leather player on testnet and an Xverse player on mainnet plus a guest, one signature each, B asked for the table A was at and was given the free seat, both and the guest saw the right figures, a figure at a cabinet is a standing one, leaving the room or standing up removes the figure. Real wallets still to try (Jim). |
| Refresh | A refresh keeps you **signed in** (the cookie; no new signature) but the casino starts again at the floor, so you are not seated until you sit; the casino itself has never restored a seat either. |
| Closing the tab clears you | The seat is freed at once on a light page (0.3 s) and about 20 s after closing the heavy casino page in the software renderer (the browser takes that long to let go of the socket). **Not covered:** a phone that loses signal without closing the socket. The room has no timers by design, so that seat could stay until the connection is dropped. The fix is a client ping every 30 s and the room dropping anyone silent for 90 s, checked when the next message arrives; about 30 lines, one more Worker deploy, a small amount of extra wake-ups. Not built; decision for Jim. |
| Fail-open | **Passes.** Room off (503) or unreachable: no button, no figures, no errors, casino runs. Room Worker stopped while people are watching (what a deploy does): the page drops everyone it was drawing (no stale people), keeps playing, and reconnects by itself 7 to 35 s after the Worker is back, and the seated player is back in their seat without clicking. |
| Frame time with 16 figures | **Cost measured, GPU speed not.** One Adrian is 15 skinned meshes, 44,543 triangles and 163 bones, so 16 is about 710,000 triangles on top of the roughly sixteen the room already draws. The JavaScript cost of animating them is small (about 3 ms a frame in the headless run). The headless renderer is software and takes 4 to 5 seconds a frame with or without them, so it cannot say what a GPU does. `https://<preview>/casino/?roomdemo=16` draws 16 made-up people and prints frames per second; compare with `?roomdemo=0` on a laptop and a phone. Phones are capped at 6 figures, desktops at 16, figures are built one every 120 ms, and anyone 12 m away stands still. If a phone struggles the cap drops or far figures are hidden. |

**Found while building.**
- The first browser test that clicked buttons the usual way timed out, because the software renderer delivers frames seconds apart and Playwright waits for the button to stop moving. The tests now click through the page. Nothing in the product changed for that.
- Sign-in buttons are disabled until the room is reached; a test that clicked early saw nothing happen. That is intended (the panel says "Connecting to the room…").
- BNS names are looked up on the **mainnet address of the same key** (an `ST…` address and its `SP…` form share one key), so a tester whose wallet has a primary BNS name will show it even on the testnet casino. This was Jim's request (BNS or short address); it does mean a testnet player's mainnet name becomes visible to others in the room. Decision for Jim: keep, or show the short address on testnet.
- A room Worker that has not been redeployed refuses the new cabinet ids (`no-such-spot`); the client notes this and stops asking instead of retrying.

**Not in P1.** `/casino-b` (it is identical to `/casino` today; the same patch applies when wanted), bar stools, clicking a person and messages (P2), the Look panel (P3), a ping so lost-signal seats expire (above), and a sound or small effect when somebody sits.

---

## 9. Cost and scale (estimate)

Cloudflare's published Durable Object terms (checked 2026-10-29): only SQLite-backed objects on the Workers Free plan, with 100,000 requests a day free; on the paid plan 1 million requests a month included then $0.15 per million; **incoming** WebSocket messages count at a 20-to-1 ratio (100 messages = 5 requests), outgoing messages are free; an idle object that can hibernate is not billed for time.

At this design's traffic (a seat change or message is a few events per player per hour), 100 players online four hours a day is on the order of tens of thousands of requests a month: very likely inside the free or included allowance. I cannot see which Cloudflare plan the account is on. Continuous walking positions at several updates a second would multiply traffic by 100 to 1,000 times; that is deliberately **not** in this plan, and it is the point at which cost and complexity change.

---

## 10. Risks and things I have not verified

- **Pages to Durable Object WebSocket forwarding** is not confirmed in the docs I could read (they show it for Workers). P0 tests it; the subdomain fallback is straightforward.
- **Wallet signing in each environment** (Xverse and Leather, desktop, mobile, in-app browsers) is the main unknown; the playbook says wallet behaviour has surprised the team before. `/casino` has never asked for a signature.
- **Testnet versus mainnet addresses: answered by P0.** A player's identity is the address their wallet returns for the casino's network (`ST…` while the casino is on testnet, `SP…` once it is on mainnet). The room accepts both, with the SIP-018 chain id following the address, and also stores the public-key hash, which is identical for the `SP…` and `ST…` form of one key (unit tested). The room page must use the casino's own wallet connect, not the app's mainnet-only adapter. BNS names are a mainnet lookup, so on testnet the tag is the short address.
- **Deploys restart the object** and drop everyone for a moment. Clients must reconnect and re-sit automatically.
- **`XA_HOSTS` changes:** a remove / reposition / re-tint call is probably needed (see section 2).
- **Performance** of many skinned Adrians: measured in P1 (section 8.2): 44,543 triangles each, small JavaScript cost, GPU speed still to be read on a real laptop and phone with `?roomdemo=16`. The cap (16 desktop, 6 phone), far-away freeze and one-at-a-time building are the mitigation.
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

0. **Wear an NFT on the shirt (front and/or back): wanted.** See section 4.5. Open questions: which collections go on the allowlist first, and whether non-Xtrata NFTs are ever wanted.

1. **One signature per visit: yes** (option A; option C may be added later on top of the same signature).
2. **Name tag: on-chain details only for now** (BNS name, otherwise short address). No nicknames.
3. **Look: wants good, simple, cheap customisation**, not only address-derived colours. Answered by the Look menu in section 4.4 (recolour and list work, no new 3D parts, free, off chain). Jim to say which of options 1 to 9 he wants first and whether the picture badge is wanted at all.
4. **Guests can see the room's people** without signing in (and are invisible to others): yes.
5. Cap on figures drawn (16 desktop, 6 phone) and room size (300): defaults stand unless Jim says otherwise.
6. Messages private one-to-one first, and the choice of route for the live service, still open.
7. **P0 spike: go given (Jim, 10:43).** Built and tested locally (section 8.1). Next: Jim deploys the room Worker, adds the secret, opens the preview test page and tries real wallets; then decide whether to start P1.

---

## Sources

- Cloudflare, [Pages Functions bindings](https://developers.cloudflare.com/pages/functions/bindings/): a Durable Object cannot be created inside a Pages project; it needs its own Worker bound to Pages.
- Cloudflare, [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing): free and paid allowances, WebSocket 20:1 billing, hibernation.
- Cloudflare, [Durable Objects WebSocket Hibernation API](https://developers.cloudflare.com/durable-objects/api/websockets): hibernating sockets, 16 KiB attachment limit, deploys disconnect clients, timers and alarms prevent hibernation.
- Repo: `docs/WALLET-PLAYBOOK.md`, `src/lib/wallet/structured-sign.ts`, `functions/lib/creator-proof.ts`, `functions/lib/creator-auth.ts`, `public/casino/index.html` (`XA_HOSTS`, `SEATS`, patrons), `workers/`.
