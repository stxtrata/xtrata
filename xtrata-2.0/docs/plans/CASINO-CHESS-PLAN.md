# ParallaX Casino: chess at the lounge sofas, powered by XChess

Status: BUILT 2026-11-02, not deployed. Page: `/casino` (`public/casino/index.html` + `public/casino/chess.js`). Room Worker
change needed for player-against-player only (house games work without it).

**The ask (Jim, 2026-11-02).** Playable XChess-powered chessboards on the tables by each sofa: challenge one of the built-in house
players, or another player in the room. Use XChess or parts of it if simple enough, otherwise a dedicated casino engine.

## 1. Decision: XChess's own engine, not a new one

XChess's house engine is inscription **#3049** on Xtrata (`XChessHouseEngine`, `xchess-house-engine-1.1.0`, 25,170 bytes,
SHA-256 `10622134e974b4c3505d2ed935d009647fba0d7c14a72acae6d913036af814ec`). It is one self-contained script with no DOM:

| Part of #3049 | Used for |
| --- | --- |
| `Position` (FEN, legal moves, SAN, check, mate, stalemate, repetition, fifty moves, insufficient material, PGN) | every rule at the table, both kinds of game |
| `PROFILES` (Gambit, Ledger, Mason, Wager, Plumb, Oblique, Fathom, Cadence, Bulwark, Canon) | the ten house players |
| `choose(profile, history, seed, startFen, 'replay-v3')` | the house players' moves (deterministic for a seed; a capped 6,000-node search) |
| `verifyArchive(xchess-house-archive-v1)` | after every house game, the whole game is replayed and each house move compared |
| the events `resgn`, `draw?`, `draw!` | resign and draw offers between players |

The XChess *match contract* (`xchess-browser-house-v2`: mainnet STX deposits, executors, leases) is not used: far too heavy for a
coffee table. Nothing in chess.js re-implements chess.

**Loading.** chess.js fetches `/i/3049` (the inscription, same origin, immutable cache) and checks its SHA-256 against the pinned
hash before running it; if that fails it loads the byte-identical copy `public/casino/xchess-engine-3049.js` (same check). The
search runs in a Web Worker made from the engine's own source, so the room never stutters; without Workers it runs on the page.

## 2. What is in the room

- **Two chess tables**, `chess1` (west lounge, sofa at -8.1, 8.1) and `chess2` (east lounge, 8.1, 8.1). The round coffee table moves
  0.4 m closer to the sofa (centre 1.25 m in front, radius 0.5) to make room for a **velvet armchair** across it; the two glasses move
  to the table's edge. Board: 0.45 m, ivory and navy squares in a gold frame, coordinates on the frame; Staunton-style pieces in ivory
  and obsidian with gold collars; knights turned three-quarters so they read from the seat.
- **Seats** (room spots): `.1` the sofa, `.2` the armchair. Sitting works from the floor (walk up, PLAY) and from the guide.
  The board turns so your colour is on your side, whichever seat you take.
- **Playing:** tap a piece, then a glowing square (blue dot = move, orange ring = capture). The selected piece lifts. Last move in
  gold, a king in check in red. Promotion asks Q / R / B / N. Captured pieces line up beside the board.
- **Cameras:** Table (over your shoulder), Seated (eyes), Top down, from whichever side you sit. On a phone held upright the camera
  comes in steep so the board spans the screen (about 38 px a square at your end).

### House games (free)

Pick a house player (shown weakest to strongest, with their XChess style and your W/D/L against them in this browser) and a colour
(White, Black, Random), then Play. The house player sits in the armchair (or on the sofa, if you took the armchair) while you play.
Hint asks Canon for a move and shows it for five seconds. An unfinished game carries on after a reload or a walk round the room.
At the end the panel shows the XChess check, e.g. "✓ every move Wager made (7) matches engine #3049 for this game's seed", and
"Copy game" puts the PGN (with the engine and seed) on the clipboard.

House games carry **no LAYR stake**: the house players are deterministic and only search 2–3 plies, so a paying bot table would be
farmed. They are play for practice and fun.

### Player against player

Uses the Salon's lobby and relay unchanged (`makeSalonLobby`, `PvpCore.makeRelayChain`): "Find a player" puts you on the room's
waiting list; anyone else at that table sees "Play jim.btc · friendly" (or the stake) and can take you on. The one who waited hosts
the blocks (1.5 s for chess, 3 s at the Salon); each move is an `act` call both pages apply to their own copy (`makeRelayTable` in
chess.js), so they stay identical. Colours are drawn by the host. **10 minutes each plus 3 seconds a move**, kept from the host's
block times; the host calls the flag. Resign, offer a draw, accept a draw. **Friendly, 1,000 or 10,000 LAYR**; the winner takes both
stakes, a draw returns them. Leaving or a broken connection voids the game and returns stakes (the lobby's existing rule).

## 3. Files

| File | Change |
| --- | --- |
| `public/casino/chess.js` | new: engine loader and worker, relay table and session, board and pieces, the two stations |
| `public/casino/xchess-engine-3049.js` | new: byte-identical copy of inscription #3049 (fallback) |
| `public/casino/index.html` | 18 small hooks, applied by anchor (see section 5): loads chess.js; coffee table and glasses; adds the two stations, their placement, signs, seats, verb; no stools at them; a station without dressing; the house player figures; clicks on a focused table's board; a station's own camera framing (`camFor`) and frame centre; the station's own rules sheet; the lobby makes chess sessions on 1.5 s blocks |
| `functions/lib/casino-room.ts` | `SPOTS`: `chess1.1`, `chess1.2`, `chess2.1`, `chess2.2` |
| `functions/lib/casino-social.ts` | `CHESS_TABLES`; chess tables in `TABLES` (table chat, watching); `seek` accepts chess tables and stake 0 there; at chess tables signing in is enough (no BNS name) for waiting, the waiting list and the relay. The Salon's rule is unchanged: a relay message is only exempt when it names a chess table, and the Salon tables ignore messages not addressed to them |
| `functions/lib/__tests__/casino-room-chess.test.ts` | new: the rules above |
| `functions/lib/__tests__/casino-room-spots.test.ts` | also reads chess.js's seats |

## 4. Checks done (2026-11-02, headless Chrome on the real page)

- Engine loads from `/i/3049`, hash verified, runs in the Worker.
- A house game played by clicking the 3D board (desktop 1440×900) and by tapping (phone 390×844): each move answered by the house
  player; reload resumes the same game; resignation; the XChess check passes ("engineCompliant").
- Two players in two browsers through a fake room: wait, join, colours drawn, Fool's Mate played by clicks on both boards; both pages
  identical and both see checkmate; a second game drawn by agreement. Black's page shows the board from black's side.
- Relay table rules (node): wrong player, out of turn, illegal move, promotion needs a piece, draw offer withdrawn by a move, cannot
  accept your own offer, time runs out, resignation.
- Every other table still opens and plays; no page errors.
- Not checked: a real iPad (frame rate with two boards), real wallets and the live room (needs the Worker deployed).

## 5. Applying to a newer page

`index.html` is edited by other work all the time, so the hooks are applied by anchor: `scripts/patch-casino-chess.py
public/casino/index.html` (idempotent; it stops if any anchor is missing or appears twice). Deploy order for player against player:
the room Worker first, then the site.

## 6. Decisions for Jim

1. **No BNS name for chess** (main room, signing in is enough), as built. Or keep the Salon's rule for chess too?
2. **House games are free.** A paying bot table would be beaten by anyone who learns the house players' lines.
3. **Stakes for player against player:** friendly, 1,000 or 10,000 LAYR. Other amounts?
4. **Watching:** people standing by see the players seated, not the moves. Spectating could relay moves to watchers later.
5. **Missions:** chess does not count towards "Play 5 hands at any table". Should a finished game count?
