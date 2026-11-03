#!/usr/bin/env python3
"""Adds the lounge chess tables (public/casino/chess.js, powered by XChess #3049) to public/casino/index.html.

Anchor-based and idempotent: every change finds one exact piece of the page and fails loudly if it is missing or not unique,
so it can be re-run on the latest page after other edits. Running it twice changes nothing the second time.
Usage: patch_casino_chess.py <index.html> [--check]
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


# Step 4 (2026-11-03): the sofas move back (chess.js says where), seated figures sit at their seat's height, and free look at
# every table: drag to look around while seated or standing (not in the overhead view), never stealing a chess piece or a tap.
LOOK_MARK = 'seatLookReset'
LOOK_PATCHES = [
    ("sofa(-8.1,8.1,.25);sofa(8.1,8.1,-.25);",
     "(window.PXChess && PXChess.sofas ? PXChess.sofas : [[-8.1,8.1,.25],[8.1,8.1,-.25]]).forEach((a) => sofa(a[0], a[1], a[2]));   // the lounge sofas (chess.js moves them back to make room)"),
    # a seat can say how high it is (the sofa is higher than a stool): the figure sitting there is raised to it
    ("return { x: w.x, z: w.z, yaw: s.group.rotation.y + Math.atan2(-seat.x, -seat.z), stand: !!seat.pad };",
     "return { x: w.x, z: w.z, yaw: s.group.rotation.y + Math.atan2(-seat.x, -seat.z), stand: !!seat.pad, h: seat.h || 0 };"),
    ("const w = wearOf(p.key), s = e.spec; s.x = pl.x; s.z = pl.z; s.yaw = pl.yaw; s.wear = w;\n      const c = s.ctrl; if (c) { c.object.position.set(pl.x, 0, pl.z);",
     "const w = wearOf(p.key), s = e.spec, lift = !pl.stand && pl.h ? pl.h - 0.57 : 0; s.x = pl.x; s.z = pl.z; s.y = lift; s.yaw = pl.yaw; s.wear = w;   // seated figures are built for a 0.57 m stool\n      const c = s.ctrl; if (c) { c.object.position.set(pl.x, lift, pl.z);"),
    ("e.tag.sp.position.set(pl.x, pl.stand ? 2.02 : 1.6, pl.z);",
     "e.tag.sp.position.set(pl.x, pl.stand ? 2.02 : 1.6 + lift, pl.z);"),
    ("c.object.position.set(h.x, 0, h.z); c.object.rotation.y = h.yaw || 0;",
     "c.object.position.set(h.x, h.y || 0, h.z); c.object.rotation.y = h.yaw || 0;"),
    ("function mePose(spec, x, z, yaw) { spec.x = x; spec.z = z; spec.yaw = yaw; const c = spec.ctrl; if (c) { c.object.position.set(x, 0, z);",
     "function mePose(spec, x, z, yaw, y) { spec.x = x; spec.z = z; spec.yaw = yaw; spec.y = y || 0; const c = spec.ctrl; if (c) { c.object.position.set(x, y || 0, z);"),
    ("else { sit = true; mePose(me.sit, pl.x, pl.z, pl.yaw); }",
     "else { sit = true; mePose(me.sit, pl.x, pl.z, pl.yaw, pl.h ? pl.h - 0.57 : 0); }"),
    # free look: the state, the drag, and a drag never also counting as a click
    ("canvas.addEventListener('pointerleave',()=>setPvpHover(null));",
     "canvas.addEventListener('pointerleave',()=>setPvpHover(null));\n"
     "  // ---- looking around at a table (Jim, 2026-11-03): seated or standing, a drag turns your view; the overhead view stays put.\n"
     "  // A drag that starts on one of your chess pieces moves the piece instead (focus.holding), and a drag is never also a tap.\n"
     "  var seatLook = { yaw: 0, pitch: 0, ty: 0, tp: 0, drag: null, swallow: 0 };\n"
     "  function seatLookReset() { if (!seatLook) return; seatLook.ty = 0; seatLook.tp = 0; seatLook.drag = null; }\n"
     "  canvas.addEventListener('pointerdown', (ev) => { if (!focus || tableView === 'overhead' || (ev.button || 0) > 0 || barUI?.isOpen || machineOpen) return; seatLook.drag = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, on: false, mouse: ev.pointerType === 'mouse' }; }, true);\n"
     "  window.addEventListener('pointermove', (ev) => {\n"
     "    const d = seatLook.drag; if (!d || ev.pointerId !== d.id) return;\n"
     "    if (!focus || tableView === 'overhead' || (focus.holding && focus.holding())) { seatLook.drag = null; return; }\n"
     "    const dx = ev.clientX - d.x, dy = ev.clientY - d.y;\n"
     "    if (!d.on) { if (Math.hypot(dx, dy) < 9) return; d.on = true; if (focus.lookStart) focus.lookStart(); }\n"
     "    d.x = ev.clientX; d.y = ev.clientY; const k = d.mouse ? 0.0028 : 0.0045;\n"
     "    seatLook.ty += dx * k; seatLook.tp = Math.max(-1.1, Math.min(1.1, seatLook.tp + dy * k));\n"
     "  });\n"
     "  const endLook = (ev) => { const d = seatLook.drag; if (!d || ev.pointerId !== d.id) return; if (d.on) seatLook.swallow = performance.now(); seatLook.drag = null; };\n"
     "  window.addEventListener('pointerup', endLook); window.addEventListener('pointercancel', endLook);"),
    ("canvas.addEventListener('click', (ev) => {if(reviewPickServing(ev))return;",
     "canvas.addEventListener('click', (ev) => {if(seatLook&&performance.now()-seatLook.swallow<350)return; if(reviewPickServing(ev))return;"),
    # the camera turns by the look, easing; the picture is not shifted to the felt while you look away
    ("camera.position.set(camPos.x + (par ? px * 0.9 : 0), camPos.y + (par ? -py * 0.3 : 0), camPos.z); camera.lookAt(look);",
     "camera.position.set(camPos.x + (par ? px * 0.9 : 0), camPos.y + (par ? -py * 0.3 : 0), camPos.z);\n"
     "      if (seatLook) { const e = Math.min(1, dt * 12); seatLook.yaw += (seatLook.ty - seatLook.yaw) * e; seatLook.pitch += (seatLook.tp - seatLook.pitch) * e; }\n"
     "      if (seatLook && focus && (Math.abs(seatLook.yaw) > 1e-4 || Math.abs(seatLook.pitch) > 1e-4)) {\n"
     "        const d = look.clone().sub(camera.position), r = d.length() || 1, yw = Math.atan2(d.x, d.z) + seatLook.yaw;\n"
     "        const pt = Math.max(-1.35, Math.min(1.25, Math.asin(Math.max(-1, Math.min(1, d.y / r))) + seatLook.pitch));\n"
     "        camera.lookAt(camera.position.x + Math.sin(yw) * Math.cos(pt) * r, camera.position.y + Math.sin(pt) * r, camera.position.z + Math.cos(yw) * Math.cos(pt) * r);\n"
     "      } else camera.lookAt(look);"),
    ("if (!focus || machineOpen || !p.classList.contains('on') || !W || !H) return;",
     "if (!focus || machineOpen || !p.classList.contains('on') || !W || !H || (seatLook && (Math.abs(seatLook.ty) > 0.05 || Math.abs(seatLook.tp) > 0.05))) return;"),
    # back to centre when you sit somewhere else or choose a view (choosing the current view again re-centres it); a tip, once
    ("const prev = focus; focus = s; if (prev !== s) { tableView = 'table'; miniPick = null; }",
     "const prev = focus; focus = s; if (prev !== s) { tableView = 'table'; miniPick = null; seatLookReset(); if (s && !store.get('parallax.lookhint.v1')) { store.set('parallax.lookhint.v1', 1); setTimeout(() => { if (focus === s) toast('Tip: drag the view to look around'); }, 2600); } }"),
    ("tableView = view;\n    const [p, l] = camTargets(focus, curSeat);",
     "tableView = view; seatLookReset();\n    const [p, l] = camTargets(focus, curSeat);"),
    # seated anywhere, a drag on the room is yours (no page pan, zoom or press menu); the page decides this now, not chess.js
    ("if (focus) camera.layers.disable(2); else camera.layers.enable(2);",
     "if (focus) camera.layers.disable(2); else camera.layers.enable(2);\n    { const ta = focus ? 'none' : ''; if (canvas.style.touchAction !== ta) { canvas.style.touchAction = ta; canvas.style.webkitTouchCallout = focus ? 'none' : ''; } }"),
    ("roomSend: (m) => shared.send(m), roomHas: (f) => shared.feat.has(f), roomMe: () => shared.me,",
     "roomSend: (m) => shared.send(m), roomHas: (f) => shared.feat.has(f), roomMe: () => shared.me, ownsTouch: true,"),
    ('chess.js?v=c3"', 'chess.js?v=c4"'),
    # the test hook that settles the camera settles the look too
    ("snap: () => { camPos.copy(tgtPos); look.copy(tgtLook); returning = false;",
     "snap: () => { camPos.copy(tgtPos); look.copy(tgtLook); returning = false; if (seatLook) { seatLook.yaw = seatLook.ty; seatLook.pitch = seatLook.tp; }"),
]


# Step 5 (2026-11-03): looking around at a table now turns the same way as walking (drag right looks right, drag up looks up), and
# at a chess table on a computer a click into the room captures the mouse: the mouse looks around, a dot marks the middle, and a
# click picks up (or moves to) whatever the dot is on. Esc gives the cursor back for the panel (and only a second Esc leaves).
AIM_MARK = 'seatLook.lockable'
AIM_PATCHES = [
    ("    d.x = ev.clientX; d.y = ev.clientY; const k = d.mouse ? 0.0028 : 0.0045;\n"
     "    seatLook.ty += dx * k; seatLook.tp = Math.max(-1.1, Math.min(1.1, seatLook.tp + dy * k));\n",
     "    d.x = ev.clientX; d.y = ev.clientY; const k = d.mouse ? WALK.drag : WALK.touchLook;   // the same feel and the same direction as walking\n"
     "    seatLook.ty -= dx * k; seatLook.tp = Math.max(-1.1, Math.min(1.1, seatLook.tp - dy * k));\n"),
    ("  window.addEventListener('pointerup', endLook); window.addEventListener('pointercancel', endLook);",
     "  window.addEventListener('pointerup', endLook); window.addEventListener('pointercancel', endLook);\n"
     "  // ---- a computer at a chess table: a click into the room captures the mouse (as when walking). The mouse then looks around, a dot\n"
     "  // marks the middle, and a click picks up or moves to whatever the dot is on (chess.js). Esc gives the cursor back for the panel.\n"
     "  seatLook.lockable = () => !isTouch && !!focus && !!focus.aim && tableView !== 'overhead' && !barUI?.isOpen && !machineOpen;\n"
     "  seatLook.locked = () => !!focus && document.pointerLockElement === canvas;\n"
     "  seatLook.unlockAt = -1e9; seatLook.told = false;\n"
     "  document.addEventListener('pointerlockchange', () => {\n"
     "    if (document.pointerLockElement !== canvas) { seatLook.unlockAt = performance.now(); return; }\n"
     "    if (focus && focus.aim && !seatLook.told) { seatLook.told = true; toast('Mouse look: click whatever the dot is on · Esc for the cursor'); }\n"
     "  });\n"
     "  window.addEventListener('mousemove', (ev) => { if (!seatLook.locked() || tableView === 'overhead') return; seatLook.ty -= (ev.movementX || 0) * WALK.look; seatLook.tp = Math.max(-1.1, Math.min(1.1, seatLook.tp - (ev.movementY || 0) * WALK.look)); });"),
    # with the mouse captured every click is at the dot (chess.js knows); otherwise a click on nothing at a chess table captures it
    ("canvas.addEventListener('click', (ev) => {if(seatLook&&performance.now()-seatLook.swallow<350)return; if(reviewPickServing(ev))return;",
     "canvas.addEventListener('click', (ev) => {if(seatLook&&performance.now()-seatLook.swallow<350)return; if(seatLook&&seatLook.locked&&seatLook.locked()){if(focus.pickClick)focus.pickClick(ev);return;} if(reviewPickServing(ev))return;"),
    ("if(machineOpen){machineSurfaceClick(ev);return;}audio(); if (!focus && mode === 'overview')",
     "if(machineOpen){machineSurfaceClick(ev);return;}if(seatLook&&seatLook.lockable&&seatLook.lockable()){try{const lp=canvas.requestPointerLock();if(lp&&lp.catch)lp.catch(()=>{});}catch(e){}return;}audio(); if (!focus && mode === 'overview')"),
    # Esc first gives back a captured mouse; the same press does not also leave the table
    ("if (e.code === 'Escape') { if (focus) requestReviewLeave(); return; }",
     "if (e.code === 'Escape') { if (document.pointerLockElement) { freeMouse(); return; } if (focus && !(seatLook && performance.now() - seatLook.unlockAt < 500)) requestReviewLeave(); return; }"),
    # the dot: shown while the mouse is captured at a table, ringed when it is on something you can pick up or move to
    ("$('cross').hidden = !walking || behind(); $('cross').classList.toggle('on', !!cand);",
     "const aimAt = !walking && typeof seatLook !== 'undefined' && !!seatLook && !!seatLook.locked && seatLook.locked(); $('cross').hidden = aimAt ? false : (!walking || behind()); $('cross').classList.toggle('on', aimAt ? !!(focus.aim && focus.aim()) : !!cand);"),
    ("      if (seatLook) { const e = Math.min(1, dt * 12); seatLook.yaw += (seatLook.ty - seatLook.yaw) * e; seatLook.pitch += (seatLook.tp - seatLook.pitch) * e; }\n",
     "      if (seatLook) { const e = Math.min(1, dt * 12); seatLook.yaw += (seatLook.ty - seatLook.yaw) * e; seatLook.pitch += (seatLook.tp - seatLook.pitch) * e; }\n"
     "      if (seatLook && seatLook.locked && seatLook.locked()) { const c = $('cross'), on = !!(focus.aim && focus.aim()); if (c.hidden) c.hidden = false; if (c.classList.contains('on') !== on) c.classList.toggle('on', on); }\n"),
    # leaving: standing up into walking keeps the captured mouse (walking uses it); anywhere else it is given back. A tip, once.
    ("const prev = focus; focus = s; if (prev !== s) { tableView = 'table'; miniPick = null; seatLookReset();",
     "const prev = focus; focus = s; if (prev !== s) { tableView = 'table'; miniPick = null; seatLookReset(); if (document.pointerLockElement === canvas && (s ? !s.aim : (prev && mode !== 'walk'))) freeMouse();"
     " if (s && s.aim && !isTouch && !store.get('parallax.aimhint.v1')) { store.set('parallax.aimhint.v1', 1); setTimeout(() => { if (focus === s && !seatLook.locked()) toast('Tip: click the room to look with the mouse, then click the piece under the dot'); }, 6500); }"),
    ("tableView = view; seatLookReset();\n    const [p, l] = camTargets(focus, curSeat);",
     "tableView = view; seatLookReset(); if (view === 'overhead' && document.pointerLockElement === canvas) freeMouse();\n    const [p, l] = camTargets(focus, curSeat);"),
    # with the mouse captured the picture holds still (the felt is not re-fitted beside the panel), so what is under the dot stays there
    ("(seatLook && (Math.abs(seatLook.ty) > 0.05 || Math.abs(seatLook.tp) > 0.05))) return;",
     "(seatLook && (Math.abs(seatLook.ty) > 0.05 || Math.abs(seatLook.tp) > 0.05 || (seatLook.locked && seatLook.locked())))) return;"),
    ('chess.js?v=c4"', 'chess.js?v=c5"'),
]


# Step 6 (2026-11-03): the X-Chess view (a flat 2D board, CASINO-CHESS-NEXT-PLAN section 4). A station may add views of its own
# (focus.extraViews): the button shows only at chess tables; in it the room does not look around or capture the mouse (as overhead);
# Esc asks the table first (it closes the X-Chess view, or leaves move review); chess.js can read and set the view.
XVIEW_MARK = 'focus.extraViews'
XVIEW_PATCHES = [
    ('<button type="button" data-view="overhead" aria-pressed="false">Top down</button>',
     '<button type="button" data-view="overhead" aria-pressed="false">Top down</button><button type="button" data-view="xchess" aria-pressed="false" hidden>X-Chess</button>'),
    ("b.hidden = video ? (b.dataset.view === 'seat' || b.dataset.view === 'overhead') : b.dataset.view === 'screen';",
     "b.hidden = video ? (b.dataset.view === 'seat' || b.dataset.view === 'overhead' || b.dataset.view === 'xchess') : (b.dataset.view === 'screen' || (b.dataset.view === 'xchess' && !(focus && focus.extraViews && focus.extraViews.includes('xchess'))));"),
    ("const allowed = focus.id === 'videopoker' ? ['table', 'screen'] : ['table', 'seat', 'overhead'];",
     "const allowed = focus.id === 'videopoker' ? ['table', 'screen'] : ['table', 'seat', 'overhead'].concat(focus.extraViews || []);"),
    ("tableView = view; seatLookReset(); if (view === 'overhead' && document.pointerLockElement === canvas) freeMouse();",
     "tableView = view; seatLookReset(); if ((view === 'overhead' || view === 'xchess') && document.pointerLockElement === canvas) freeMouse(); if (focus.onView) focus.onView(view);"),
    ("canvas.addEventListener('pointerdown', (ev) => { if (!focus || tableView === 'overhead' || (ev.button || 0) > 0",
     "canvas.addEventListener('pointerdown', (ev) => { if (!focus || tableView === 'overhead' || tableView === 'xchess' || (ev.button || 0) > 0"),
    ("    if (!focus || tableView === 'overhead' || (focus.holding && focus.holding())) { seatLook.drag = null; return; }",
     "    if (!focus || tableView === 'overhead' || tableView === 'xchess' || (focus.holding && focus.holding())) { seatLook.drag = null; return; }"),
    ("seatLook.lockable = () => !isTouch && !!focus && !!focus.aim && tableView !== 'overhead' &&",
     "seatLook.lockable = () => !isTouch && !!focus && !!focus.aim && tableView !== 'overhead' && tableView !== 'xchess' &&"),
    ("window.addEventListener('mousemove', (ev) => { if (!seatLook.locked() || tableView === 'overhead') return;",
     "window.addEventListener('mousemove', (ev) => { if (!seatLook.locked() || tableView === 'overhead' || tableView === 'xchess') return;"),
    ("if (e.code === 'Escape') { if (document.pointerLockElement) { freeMouse(); return; } if (focus &&",
     "if (e.code === 'Escape') { if (document.pointerLockElement) { freeMouse(); return; } if (focus && focus.escape && focus.escape()) { render(); return; } if (focus &&"),
    ("roomMe: () => shared.me, ownsTouch: true,",
     "roomMe: () => shared.me, ownsTouch: true, tableView: () => tableView, setView: (v) => setTableView(v),"),
    ('chess.js?v=c5"', 'chess.js?v=c6"'),
]


def chess_version(s):
    import re
    m = re.search(r'chess\.js\?v=c(\d+)"', s)
    return int(m.group(1)) if m else 0


def apply(s):
    done = []
    if 'chess.js?v=' not in s:
        s = run(s, PATCHES); done.append('chess tables')
    if WATCH_MARK not in s:
        s = run(s, WATCH_PATCHES); done.append('watching')
    if chess_version(s) < 3:
        s = run(s, INPUT_PATCHES); done.append('touch and drag')
    if LOOK_MARK not in s:
        s = run(s, LOOK_PATCHES); done.append('sofas, seat heights, free look')
    if AIM_MARK not in s:
        s = run(s, AIM_PATCHES); done.append('look direction, mouse aim at chess')
    if XVIEW_MARK not in s:
        s = run(s, XVIEW_PATCHES); done.append('the X-Chess view')
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
