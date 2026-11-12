# Xtrata Music handbook

The one current map of the music system: what exists, where it lives, what must never change, and where the
overhaul stands. Written 2026-11-12 on branch `xtrata-music-fable` as package 0 of the Music Overhaul plan.
When this file and an older doc in `docs/radio/` or `docs/plans/` disagree, this file is meant to win: fix it here.

## 1. The system in one page

| Part | Where it runs | Code | Holds a key? |
| --- | --- | --- | --- |
| Paid radio (the app) | radio.xtrata.xyz/radio | `public/radio.html`, `src/radio-ppp/` (built to `public/radio/ppp.js`), `src/home/radio.js` (the radio engine) | No |
| Wallet box | wallet.xtrata.xyz, in an iframe | `src/listening-wallet/frame/`, `src/lib/listening-wallet/`, `src/lib/wallet/passkey/bridge/` | Yes, in memory only |
| Gifts, albums, batches | Pages functions | `functions/lib/radio-gifts.ts`, `functions/radio/gift/`, `workers/radio-gift-sweep` | Treasury key (Cloudflare secret) |
| Links, likes, counts, stats | Pages functions | `functions/radio/listening-wallet/`, `functions/radio/*.ts`, `functions/lib/music-stats.ts` | No |
| Free radio | xtrata.xyz/radio | `src/home/radio.js`, `src/radio-likes/` | No (Xverse / Leather) |
| Album maker | xtrata.xyz/music | `music/index.html` + `xtrata-agent-one/wizard/music-*.js`, `agent-one.js` | One-shot deposit wallet per job (server side) |
| Artist portal | xtrata.xyz/music/artist | `music/artist/`, `src/music-artist/`, `functions/api/music/artist/` | No |
| Music Heroes, profile | xtrata.xyz/music/heroes, /profile | `music/heroes.html`, `music/profile.html` | No |
| Desktop app | Mac 1.0.6, Windows 1.0.9 preview | `desktop/music` | Local key (safeStorage / DPAPI) |
| Browser lounge + companion | /radio/browser-lounge, localhost:8798 | `scripts/wizard/music-lounge.*`, `extensions/music-support` | Local AES vault |
| Old extension prototype | not used | `extensions/music-wallet` | — |

On-chain: `xtrata-radio-plays-v1-0` (a play pays the song's holder) and `xtrata-radio-likes-v1-0`. Neither changes
in the overhaul.

## 2. How a listener gets from a link to music (as built)

The controller (`src/radio-ppp/controller.ts`, `step()`) puts every visitor in exactly one step:

`off` → `elsewhere` → `connect` / `not-invited` → `loading` → `unsupported` / `intro` → `locked` → `link` → `fund` / `over` → `ready`

- **Passkey-only ("solo") already exists.** When the server gate says `passkeyOnly` and no invited Stacks wallet is
  connected, `connect` and `link` are skipped: intro → fund → ready (`SOLO_STAGES` in `stages.ts`).
- **A wallet is one passkey tap.** `ppp.create()` opens the wallet box; the same confirm switches paying on.
  The key is `HKDF(passkey PRF, label)`, re-derived at every unlock and never stored (`derive.ts`).
- **Albums are numbered wallets ("slots")** from the same passkey (`docs/radio/DERIVED-WALLETS.md`). A gift link
  with an album is claimed into the next free slot; the album then plays only its own songs.
- **The paid radio never plays for free.** `giftStop()` in the controller names why playback is refused and the page
  hands that text to the radio (`setGiftStop`). Commit 8b8afa412 (2026-11-10) made this strict on radio.xtrata.xyz.
- **Returns.** A linked wallet returns only to its main wallet. A solo wallet returns to the address that funded it
  or one the listener types in (`setReturnAddress`), always confirmed inside the wallet box. A gifted wallet returns
  each part to whoever it came from (`ledger.ts`).
- **Phones.** WebKit cannot create a passkey inside the frame, so it is made on `wallet.xtrata.xyz/create` in a new
  tab. In-app browsers (Instagram, X, TikTok…) get "Open in Safari / Chrome" first (`in-app.ts`).

## 3. Invariants (never change without Jim's explicit decision)

Locked by `src/lib/listening-wallet/__tests__/music-invariants.test.ts` and the known-answer vectors in
`listening-wallet.test.ts`. A failing test here means the code is wrong, never the test.

1. `LISTENING_PRF_SALT` (`xtrata.radio.listening-wallet.v1`), `LISTENING_HKDF_INFO`
   (`xtrata-radio-listening-key-v1`) and the slot rule `<info>/slot/<n>`. Changing any of them moves every listener's
   wallet to an address nobody can reach.
2. A play: 30 seconds of audible listening (half the length under a minute), 50 microSTX to the holder, 300 microSTX
   default fee, exact post-condition, Deny mode.
3. The wallet box: its CSP (`default-src 'none'`, `connect-src 'none'`), `frame-ancestors` (built from the same
   list as the bridge allowlist in `vite.listening-wallet.config.ts`), the 0.8 s arming delay, the visibility
   checks, and the rule that the page can ask but only the box approves.
4. The wallet box never trusts `xtrata.xyz`: inscriptions run on that origin.
5. No contract edits. One version of each contract (see `CLAUDE.md`, "Contract versions: newest only").
6. Wallet connect and signing rules in `docs/WALLET-PLAYBOOK.md`.
7. Never test with personal, deployer, sponsor or treasury wallets (`AGENTS.md`).

## 4. Novice mode (new in this branch, off by default)

`src/radio-ppp/novice.ts` + a few guarded lines in `page.ts`. It changes wording and layout only: no money logic,
no controller change, no wallet box change.

| Switch | What it does |
| --- | --- |
| `?novice=1` | For a listener with no Stacks wallet in play: the main path (everything outside a fold) never says STX, wallet, address, seed or sign. Lines and buttons that do are moved into "How plays work" and "This device", not removed. No setup track. The radio's own stop texts are plain. The album page is on, so anyone arriving with an album sees the album view. |
| `?novice=preview` | The same, plus **one unpaid first song** from a shared album before the player is made. |
| `?novice=0` | Back to the classic page. |

The choice is remembered per device (`localStorage` `xtrata.radio.novice`). Plain wording applies only to
passkey-only ("solo") listeners; a listener whose connected Stacks wallet is in play keeps the classic page.

**The free first song, exactly.** With a live album link, at step `intro`, the page hands the album to the radio,
clears the stop and locks the radio to that album (`setGiftLock`). The preview ends at the first of: the radio moving
to a second song, a second 30-second listen, or 6 minutes. It is offered once per album per device
(`xtrata.radio.novice.previewed.v1`, set when the song starts). Then the radio stops and the album view asks for
the player. "Once" lives in the device's own storage: it is a courtesy of the page, not enforcement.

Two things to know before switching preview on anywhere public:

- **It is unpaid.** No wallet exists yet, so nothing can be paid on-chain and the holder gets nothing for that
  song. The plan called these "starter plays paid by whoever made the link"; paying for a play before the
  listener has a wallet would need the treasury to sign plays, which is a new server signing path and was not built.
  This is a deliberate exception to "the paid radio never plays for free" and is Jim's call.
- **It has only been tested against a faked radio** (`page-novice.test.ts`). It needs a real browser run on
  desktop and iPhone before use: check that the song starts from the album view, that FM cannot be reached during
  the preview, and that playback stops when the second song begins.

Known gaps in plain wording (not yet covered): the top bar's connect button (`src/radio-likes/wallet.ts`), tooltips
(`title` attributes), messages raised by the controller mid-action (`.ppp-msg`), the gift banner on the classic
panel for a gift without an album, and the wallet box's own screens (a separate deploy).

## 4a. Starter players, the welcome screens and "Add plays" (branch `starter-players`)

- **Starter player** = a prefunded gift with no album. It is claimed into the passkey's own first wallet, so it plays
  any song and pays for its own likes. Nothing about claiming changed; one starter per new listener is still enforced
  by the server, and someone who already has a player is now asked to pass the link on (with a copy button).
- **Welcome screens** (`welcome.ts`, novice mode only): checking → gift / new / back → arriving → landed, and `empty`
  for a player with no plays. One button each.
- **Add plays** (`restock-sheet.ts`): opened from every out-of-plays or running-low state for a passkey-only
  listener. Packs are in plays; STX is the live method.
- **Restock methods** (`src/lib/listening-wallet/restock.ts`): `stx` on; `card` and `sbtc` are written (quotes,
  order shape, one-way order states, tests) but OFF. They switch on per deployment through `gate.restock`
  (`/radio/listening-wallet/config`), which nothing sets yet, and they need a restock service that takes the payment
  and sends STX from a float. That service is not built: no route, no treasury code.
- **Giveaway page** (`public/giveaway.html`): one page for both kinds of drop. `GET /radio/giveaway` now also returns
  `kind` (`album` | `player`) and `plays`; the page words itself from them and sends a starter claim to
  `radio.html?novice=1#gift=…`. Still one link on show at a time. A tap-to-hold wall is not built.
- **Player classes** (`src/lib/listening-wallet/tiers.ts`): Diamond 1,000+ plays, Gold 500+, Silver 250+, Bronze 100+,
  Classic below. Worked out from a starter gift's amount each time, never stored on a server; looks only. Shown as a
  badge on the panel, a coloured record on the welcome screens (the reveal when plays land, and on every return) and
  remembered on the device while locked. Suggested drop of 1,000, none under 50 plays: 5 / 10 / 20 / 100 / 865, which
  is 29.8875 STX including the 0.003 STX fee per player (locked by `tiers.test.ts`).
- **Albums every player comes loaded with**: `RADIO_FEATURED_PLAYERS` (gift player ids) → `GET /radio/gift/featured`.
  They are playlists, not wallets: opened from "Albums in your player" (or the "You're in" screen), played from the
  listener's own plays, never locked, never shown over an album wallet's own album. Unset: nothing shows.
- **Find music** (`find.ts`, the 🔎 box above Your Station): search by song, artist or number and browse by artist,
  over `/radio/counts` with `artist-credits.mjs` corrections applied. The catalogue feed has no album field, so
  "by album" today means the featured albums.
- **Lottery drop**: make one batch per class, then `add` them all with `"shuffle": true`. When the list holds players
  of different sizes, `GET /radio/giveaway` omits `plays` and returns `lottery` (range, what is left of each class,
  the class of each player already claimed). The page keeps the live one a mystery, colours claimed discs by class,
  and sends the claim with `&mystery=1` so the radio reveals the class only when the plays land.
- **Make it yours** (panel fold, passkey-only listeners): what a .btc name is with a link to BNS One, linking to a
  Stacks wallet they already have, bringing a friend. Each item closed until opened. Note: the wallet box cannot buy
  or register a name itself; a name has to be sent to the player's address from another wallet.
- **Radio controls**: hover text on every control and a "What do these do?" fold under the stations.

## 5. Where the Music Overhaul plan stands

The plan was written from the docs and a file survey. Reading the code closely changed several of its assumptions;
the table is the corrected position.

| # | Package | State on this branch | Notes |
| --- | --- | --- | --- |
| 0 | Baseline, handbook, invariants | **Done** | This file; `music-invariants.test.ts`. A browser journey for the wallet box already exists: `scripts/test-listening-wallet-browser.mjs` (Chrome virtual authenticator with PRF). A full link-to-first-song browser journey is still to write. |
| 1 | Album-first for everyone, plain wording | **Done behind `?novice=1`** | The album page already existed behind `?albumpage=1` and was deliberately off by default; novice mode turns it on. Banned-words test: `page-novice.test.ts`. |
| 2 | Play before setup | **Done behind `?novice=preview`, unpaid, not browser-tested** | See section 4. |
| 3 | Passkey-only by default | **Mostly existed already** | Solo mode is the server gate's `passkeyOnly`. Novice mode hides the setup track and moves the Stacks wallet door into "This device". |
| 4 | Card top-ups | **Not started** | Blocked on Jim choosing how a novice pays. Until then a novice with no plays is told plays come with shared music. |
| 5 | Wallet box: artist slot, send out | **Not started** | "Send out" already exists for solo wallets (return to a typed address). The artist slot needs wallet box and server changes plus a security review. |
| 6 | One album maker | **Plan was wrong: there is already one** | `music/index.html` loads Agent One's `music-*.js`. What remains is passkey sign-in and a quote in pounds, both of which depend on 4 and 5. |
| 7 | Artist sharing | **Not started** | `createBatch` in `radio-gifts.ts` is admin-only with no size cap *because* it is admin-only; the code comment already names the next step ("later the same check can be the album's owner"). Opening it needs per-artist caps and rate limits against the treasury escrow. |
| 8 | One app shell | **Not started** | Depends on 4 to 7. |
| 9 | Retire old surfaces | **Not started** | Nothing removed. Desktop and companion wallets may hold balances: offer returns first. |

## 6. Tests to run

```
npx vitest run src/radio-ppp src/lib/listening-wallet src/listening-wallet   # panel, policy, wallet box
npx vitest run functions                                                      # gifts, links, stats
npm run test:app                                                              # everything (vitest)
node scripts/test-listening-wallet-browser.mjs                                # wallet box in a real Chrome
```

`public/radio/ppp.js` is a build output (`npm run build:radio-ppp`). Source changes on this branch have **not** been
rebuilt into it, so nothing here reaches a deployed page until that build is run and reviewed.
