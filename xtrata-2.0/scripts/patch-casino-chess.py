#!/usr/bin/env python3
"""Adds the lounge chess tables (public/casino/chess.js, powered by XChess #3049) to public/casino/index.html.

Anchor-based and idempotent: every change finds one exact piece of the page and fails loudly if it is missing or not unique,
so it can be re-run on the latest page after other edits. Running it twice changes nothing the second time.
Usage: scripts/patch-casino-chess.py <index.html> [--check]
"""
import sys

MARK = 'PXChess'
PATCHES = [
    # 1. load chess.js before the casino's main script
    ("<script>(function(){'use strict';\nconst categories=",
     "<script src=\"chess.js?v=c1\"></script>\n<script>(function(){'use strict';\nconst categories="),
    # 2. the coffee table moves a little closer to the sofa (room for the armchair across it) and the glasses move off the board
    ("const t=cyl(.6,.6,.06,pxStone,0,.51,1.65,g,48);cyl(.09,.13,.48,gold,0,.25,1.65,g,20);cyl(.34,.34,.035,gold,0,.025,1.65,g,32);",
     "const TZ=window.PXChess?PXChess.TABLE_Z:1.65,TR=window.PXChess?PXChess.TABLE_R:.6;   // the lounge chess tables (chess.js)\n      const t=cyl(TR,TR,.06,pxStone,0,.51,TZ,g,48);cyl(.09,.13,.48,gold,0,.25,TZ,g,20);cyl(.34,.34,.035,gold,0,.025,TZ,g,32);"),
    ("glass.position.set(-.18+i*.36,.62,1.65)",
     "glass.position.set(window.PXChess?.37:-.18+i*.36,.62,window.PXChess?TZ-.1+i*.2:1.65)"),
    # 3. the two chess stations join the others
    ("stations = [makeBlackjack(), makeRoulette(), makeSicBo(), makeBaccarat(), makeVideoPoker(), makePvpHoldem(), makeLiarsDice()];",
     "stations = [makeBlackjack(), makeRoulette(), makeSicBo(), makeBaccarat(), makeVideoPoker(), makePvpHoldem(), makeLiarsDice()];\n"
     "  // ---- chess at the two lounge sofas, powered by XChess (public/casino/chess.js, docs/plans/CASINO-CHESS-PLAN.md) ----\n"
     "  if (window.PXChess) try {\n"
     "    const chessRay = new THREE.Raycaster(), chessPtr = new THREE.Vector2();\n"
     "    stations.push(...PXChess.makeStations({ THREE, M, GOLDM, box, cyl, money, toast, setBank, outcome,\n"
     "      envTex: () => envTex, velvet: () => { const v = leatherMat(0x0a244c, 2, false); v.roughness = .86; return v; },\n"
     "      lobby: (o) => makeSalonLobby(o), seat: () => curSeat, focus: () => focus, bank: () => bank, render: () => render(), audio: () => audio(),\n"
     "      sfx: (k) => { try { if (k === 'win') sfx.win(); else if (k === 'lose') sfx.lose(); else if (k === 'capture') sfx.chip(2); else if (k === 'select') sfx.flip(); else sfx.card(); } catch (_) { } },\n"
     "      ray: (ev) => { const r = canvas.getBoundingClientRect(); chessPtr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1); chessRay.setFromCamera(chessPtr, camera); return chessRay; } }));\n"
     "  } catch (e) { console.error('[chess] the chess tables failed to build', e); }"),
    # 4. where they stand, and their signs
    ("const TAGS = {", None),   # placeholder, see LINE_AFTER below
    # 5. no stools at the lounge tables (a sofa and an armchair)
    ("if (['roulette', 'videopoker', 'pvpholdem', 'liars'].includes(s.id)) return;",
     "if (s.noStools || ['roulette', 'videopoker', 'pvpholdem', 'liars'].includes(s.id)) return;"),
    # 6. a station without dressing
    ("try { dressers[s.id](s); }", "try { if (dressers[s.id]) dressers[s.id](s); }"),
    # 7. seats and the walk-up verb
    ("const VERB = {", None),
    # 8. the house player across the board, while you play one
    ("// the opponents at the Salon tables (real players, shown during a match)",
     "if (window.PXChess) PXChess.addHosts(XA_HOSTS);   // the XChess house player across the lounge table, during a house game\n    // the opponents at the Salon tables (real players, shown during a match)"),
    # 9. clicks on a focused table's own surface (the chess board)
    ("canvas.addEventListener('click', (ev) => {if(reviewPickServing(ev))return;",
     "canvas.addEventListener('click', (ev) => {if(reviewPickServing(ev))return; if(focus&&focus.pickClick&&!barUI?.isOpen&&focus.pickClick(ev))return;"),
    # 10. cameras: a station can frame itself from either side (the chess armchair faces the sofa)
    ("function camTargets(s, seat) {",
     "function camTargets(s, seat) {\n    if (s && s.camFor) return camTargetsFirst(s, seat);"),
    ("function camTargetsFirst(s, seat) {",
     "function camTargetsFirst(s, seat) {\n    if (s.camFor) { const r = s.camFor(seat, tableView, camera.aspect); if (r) return [s.group.localToWorld(r[0]), s.group.localToWorld(r[1])]; }"),
    ("if (!focus || tableView !== 'overhead') return baseFov;",
     "if (!focus || tableView !== 'overhead' || focus.camFor) return baseFov;"),
    # 11. keep the board (not a felt at dining-table height) in the free part of the screen
    ("const sub = focus.id === 'videopoker' ? look.clone() :",
     "const sub = focus.id === 'videopoker' ? look.clone() : focus.frameCentre ? focus.group.localToWorld(focus.frameCentre.clone()) :"),
    # 12. the rules sheet
    ("const rules=REVIEW_RULES[station?.id];", "const rules=REVIEW_RULES[station?.id]||station?.rules;"),
    # 13. the Salon lobby makes chess sessions too, on quicker blocks
    ("const session = kind === 'dice' ? PvpCore.DiceSession(chain, opts) : PvpCore.HoldemSession(chain, opts);",
     "const session = kind === 'chess' ? PXChess.makeSession(chain, opts) : kind === 'dice' ? PvpCore.DiceSession(chain, opts) : PvpCore.HoldemSession(chain, opts);"),
    ("const chain = PvpCore.makeRelayChain({ host, me: me(), other, send: (d) => tell(other, d) });",
     "const chain = PvpCore.makeRelayChain({ host, me: me(), other, send: (d) => tell(other, d), blockMs: kind === 'chess' ? 1500 : undefined });"),
]
# Lines that get a statement appended after the end of the line that starts with the anchor.
LINE_AFTER = {
    "const TAGS = {": "\n  if (window.PXChess) { Object.assign(placement, PXChess.placement); Object.assign(TAGS, PXChess.TAGS); }",
    "const VERB = {": "\n  if (window.PXChess) { Object.assign(SEATS, PXChess.SEATS); Object.assign(VERB, PXChess.VERB); }",
}


# Step 2 (2026-11-02, plan section 7): watching other people's chess games. Applied after step 1, only once.
WATCH_MARK = 'PXChess.onSpec'
WATCH_PATCHES = [
    # the room hooks chess.js uses to send and receive game snapshots
    ("lobby: (o) => makeSalonLobby(o), seat: () => curSeat,",
     "lobby: (o) => makeSalonLobby(o), seat: () => curSeat,\n"
     "      roomSend: (m) => shared.send(m), roomHas: (f) => shared.feat.has(f), roomMe: () => shared.me,\n"
     "      watching: () => (window.PXRoomHost && PXRoomHost.table ? PXRoomHost.table() : null), taken: () => (window.PXRoomHost && PXRoomHost.taken ? PXRoomHost.taken() : []),"),
    # the room's chess snapshots go to the chess tables
    ("case 'seek': case 'pvp': salon.on(m); return;",
     "case 'seek': case 'pvp': salon.on(m); return;\n          case 'spec': if (window.PXChess) PXChess.onSpec(m); return;   // a chess game being watched (chess.js)"),
    # which seats other people have (so a chess table where two others play is watched from beside it, not sat on)
    ("table: () => { try { return social.tableNow(); } catch (e) { return null; } },",
     "table: () => { try { return social.tableNow(); } catch (e) { return null; } },\n      taken: () => [...remote],   // spots other people have (the lounge chess tables)"),
    ("if (window.PXRoomHost && PXRoomHost.steer) seat = PXRoomHost.steer(s, seat);   // a seat somebody in the room already has: take a free one at the same table",
     "if (window.PXRoomHost && PXRoomHost.steer) seat = PXRoomHost.steer(s, seat);   // a seat somebody in the room already has: take a free one at the same table\n      if (s.watchSeat) { const ws = s.watchSeat(); if (ws) seat = ws; }   // two other people are playing chess here: watch from beside the table"),
    ('chess.js?v=c1"', 'chess.js?v=c2"'),
    ('room.js?v=p5.2"', 'room.js?v=p5.3"'),
]


def run(s, patches):
    for old, new in patches:
        n = s.count(old)
        if n != 1:
            raise SystemExit(f'anchor found {n} times (want 1): {old[:80]!r}')
        if new is None:
            i = s.index(old); e = s.index('\n', i)
            s = s[:e] + LINE_AFTER[old] + s[e:]
        else:
            s = s.replace(old, new)
    return s


# Step 3 (2026-11-03): touch, pen and mouse on the board (tap or drag the pieces) is all in chess.js; the page only loads the new version.
INPUT_MARK = 'chess.js?v=c3'
INPUT_PATCHES = [('chess.js?v=c2"', 'chess.js?v=c3"')]


def apply(s):
    done = []
    if 'chess.js?v=' not in s:
        s = run(s, PATCHES); done.append('chess tables')
    if WATCH_MARK not in s:
        s = run(s, WATCH_PATCHES); done.append('watching')
    if INPUT_MARK not in s:
        s = run(s, INPUT_PATCHES); done.append('touch and drag')
    return s, done


if __name__ == '__main__':
    path = sys.argv[1]
    s = open(path, encoding='utf-8').read()
    out, done = apply(s)
    if not done:
        print('already patched'); sys.exit(0)
    if '--check' in sys.argv:
        print('all anchors found; not written'); sys.exit(0)
    open(path, 'w', encoding='utf-8').write(out)
    print('patched', path, '(' + ', '.join(done) + ')', len(s), '->', len(out))
