#!/usr/bin/env python3
"""Who is that? (Jim, 2026-11-03) Anchored, idempotent patches to public/casino/index.html; run after scripts/patch-casino-chess.py.

A click or tap on another player in the casino (their figure, or their name tag) opens their menu in chat: their BNS name and their
full address, testnet and mainnet, each with a Copy button (src/casino-room/address-card.ts, in room.js). Works walking (mouse, captured
mouse and touch), seated at a table, and from the overview (name tags only there, so a click on a table still sits you at it).
Your own address is in the Room panel. The LAYR dispenser's short wallet address copies the full one when tapped.

  python3 scripts/patch-casino-people.py public/casino/index.html [--check]
"""
import sys

MARK = 'function personHit('
PATCHES = [
    # the room's side: which player (if any) a ray from the camera meets, by their figure (an upright cylinder) or their name tag
    ("    function retag(key) {",
     "    // ---- who is that: the player a ray meets, by their name tag or their figure (an upright cylinder). House regulars have no\n"
     "    // address and are not players, so they are skipped. The nearest wins. tagsOnly: the overview, where a click on a table sits you.\n"
     "    const isPlayerKey = (k) => typeof k === 'string' && /^S[PTMN][0-9A-Z]{37,41}$/.test(k);\n"
     "    function personAt(ray, tagsOnly) {\n"
     "      let best = null, bd = 1e9; const o = ray.ray.origin, d = ray.ray.direction;\n"
     "      const one = (key, at, y0, h, sp) => {\n"
     "        if (!isPlayerKey(key) || !at) return;\n"
     "        if (sp && sp.visible) { const hit = ray.intersectObject(sp, false)[0]; if (hit && hit.distance < bd) { bd = hit.distance; best = key; } }\n"
     "        if (tagsOnly) return;\n"
     "        const q = d.x * d.x + d.z * d.z; if (q < 1e-6) return;\n"
     "        const t = -((o.x - at.x) * d.x + (o.z - at.z) * d.z) / q; if (t <= 0 || t >= bd) return;\n"
     "        const px = o.x + d.x * t - at.x, pz = o.z + d.z * t - at.z, py = o.y + d.y * t;\n"
     "        if (px * px + pz * pz < 0.09 && py > y0 && py < y0 + h) { bd = t; best = key; }\n"
     "      };\n"
     "      for (const e of pool) if (e.on && e.key) { const c = e.spec.ctrl; one(e.key, c ? c.object.position : e.spec, e.spec.y || 0, e.stand ? 1.85 : 1.4, e.tag && e.tag.sp); }\n"
     "      for (const w of walkers.values()) if (w.e && w.e.key && w.e.spec.on) { const c = w.e.spec.ctrl; one(w.key, c ? c.object.position : w.e.spec, 0, 1.85, w.e.tag && w.e.tag.sp); }\n"
     "      return best;\n"
     "    }\n"
     "    function retag(key) {"),
    ("      currentSpot: mySpot,\n      setPeople,\n",
     "      currentSpot: mySpot,\n      setPeople,\n      personAt,   // (ray, tagsOnly) -> the address of the player it meets, or null\n"),
    # the page's side: a ray from a point on the screen, and opening the person's menu (room.js answers; without it, copy and say so)
    ("canvas.addEventListener('click', (ev) => {if(seatLook",
     "// ---- tapping another player (their figure or name tag) opens their menu in chat: their name, and their address to copy\n"
     "  function personHit(cx, cy, tagsOnly) {\n"
     "    if (!window.PXRoomHost || !PXRoomHost.personAt) return null; const r = canvas.getBoundingClientRect(); if (!r.width || !r.height) return null;\n"
     "    ray.setFromCamera(new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1), camera);\n"
     "    try { return PXRoomHost.personAt(ray, !!tagsOnly); } catch (e) { return null; }\n"
     "  }\n"
     "  function personAtCentre() { const r = canvas.getBoundingClientRect(); return personHit(r.left + r.width / 2, r.top + r.height / 2); }\n"
     "  function showPerson(a) {\n"
     "    freeMouse(); const d = { a, handled: false }; window.dispatchEvent(new CustomEvent('px-room-person', { detail: d }));\n"
     "    if (!d.handled) { const said = () => toast('Copied their address: ' + a); try { navigator.clipboard.writeText(a).then(said, () => toast(a)); } catch (_) { toast(a); } }\n"
     "  }\n"
     "  // a touch while seated after walking: the room cancels the click a tap would make (endTouch), so a tap on a player is seen here\n"
     "  { let td = null;\n"
     "    canvas.addEventListener('pointerdown', (ev) => { td = ev.pointerType === 'mouse' ? null : { id: ev.pointerId, x: ev.clientX, y: ev.clientY, t: performance.now() }; });\n"
     "    canvas.addEventListener('pointerup', (ev) => {\n"
     "      const d = td; td = null;\n"
     "      if (!d || ev.pointerId !== d.id || !focus || mode !== 'walk' || barUI?.isOpen || machineOpen || Math.hypot(ev.clientX - d.x, ev.clientY - d.y) > 10 || performance.now() - d.t > 700) return;\n"
     "      const x = ev.clientX, y = ev.clientY;\n"
     "      setTimeout(() => { if (!focus || (focus.holding && focus.holding())) return; if (focus.aim && focus.pickClick && focus.pickClick({ clientX: x, clientY: y })) return; const pa = personHit(x, y); if (pa) showPerson(pa); }, 0);\n"
     "    });\n"
     "  }\n"
     "  canvas.addEventListener('click', (ev) => {if(seatLook"),
    # mouse captured at a chess table: a click that is not on the board, on a player, opens theirs
    ("if(seatLook&&seatLook.locked&&seatLook.locked()){if(focus.pickClick)focus.pickClick(ev);return;}",
     "if(seatLook&&seatLook.locked&&seatLook.locked()){if(focus.pickClick&&focus.pickClick(ev))return;const pa=personAtCentre();if(pa)showPerson(pa);return;}"),
    # seated, or the overview (name tags only): a click nothing else took, on a player. Walking has its own (below).
    ("if(label){label.userData.nameOpenUntil=performance.now()+3000;return;}}const bh=pickParallaxBar(ev);",
     "if(label){label.userData.nameOpenUntil=performance.now()+3000;return;}}if(!(mode==='walk'&&!focus)&&!machineOpen&&!barUI?.isOpen){const pa=personHit(ev.clientX,ev.clientY,!focus&&mode==='overview');if(pa){showPerson(pa);return;}}const bh=pickParallaxBar(ev);"),
    # walking: a click or tap on a player (before tables and machines); with the mouse captured, the player under the dot
    ("  function clickCand(cx, cy) {\n    const r = canvasEl.getBoundingClientRect(); ray.setFromCamera(new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1), camera);\n",
     "  function clickCand(cx, cy) {\n    if (!machineOpen) { const pa = personHit(cx, cy); if (pa) return { person: pa, seat: null }; }   // another player: their menu\n"
     "    const r = canvasEl.getBoundingClientRect(); ray.setFromCamera(new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1), camera);\n"),
    ("    if (locked) { if (cand) sit(cand); return; }",
     "    if (locked) { if (cand) sit(cand); else { const pa = personAtCentre(); if (pa) showPerson(pa); } return; }"),
    ("    if(c?.bar){openParallaxBar();return;}",
     "    if(c?.person){showPerson(c.person);return;}\n    if(c?.bar){openParallaxBar();return;}"),
    # the dispenser's short address: tap it to copy the whole one
    ("w.textContent=a?a.slice(0,5)+'…'+a.slice(-4):'';w.title=a;",
     "w.textContent=a?a.slice(0,5)+'…'+a.slice(-4):'';w.title=a?a+' (tap to copy)':'';w.style.cursor=a?'copy':'';w.onclick=a?()=>{try{navigator.clipboard.writeText(a).then(()=>toast('Wallet address copied: '+a),()=>toast(a));}catch(_){toast(a);}}:null;"),
    # (room.js?v= is bumped by whoever rebuilds room.js next, with both sessions' room-client changes)
]


def apply(s):
    if MARK in s:
        return s, False
    for old, new in PATCHES:
        n = s.count(old)
        if n != 1:
            raise SystemExit(f'anchor found {n} times (want 1): {old[:80]!r}')
        s = s.replace(old, new)
    return s, True


if __name__ == '__main__':
    path = sys.argv[1]
    s = open(path, encoding='utf-8').read()
    out, done = apply(s)
    if not done:
        print('already patched'); sys.exit(0)
    if '--check' in sys.argv:
        print('all anchors found; not written'); sys.exit(0)
    open(path, 'w', encoding='utf-8').write(out)
    print('patched', path, len(s), '->', len(out))
