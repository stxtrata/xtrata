/* ParallaX Casino · YOUR CHARACTER  (docs/plans/CASINO-CHARACTER-PLAN.md)
 *
 * The panel where a player chooses how they are seen in the room: the classic human figure, the humanoid cube or the floating cube,
 * and (for the cubes) the frame, the accent colour, the screens' finish, the face and the walk. A small live preview shows the choice.
 *
 * Where a look lives:
 *   - in this browser (localStorage `parallax.look.v1`), so it is there before anyone signs in and a guest sees it on themselves;
 *   - in the player's room profile, once they are signed in (one `look` message; functions/lib/casino-look.ts), so it follows them to
 *     another device and everyone else in the room is told. The room's copy wins on arrival, unless this browser holds a change the
 *     room has not confirmed yet (`parallax.look.unsent.v1`), which is sent first.
 *
 * It draws nothing in the room itself: the page's presence code does that (index.html, "Cube characters"), through
 * window.PXRoomHost.looks. With cube-avatars.js or the room missing, the panel still opens and the choice is still kept.
 *
 * window.PXCharacter: open(), close(), code (the current look), onRoom(message), onSelf(info)   [the last two are called by the page]
 */
(function () {
  'use strict';
  var KEY = 'parallax.look.v1', UNSENT = 'parallax.look.unsent.v1', DEFAULT = 'p000n-4ed5bd';
  var PX = function () { return window.PXCubes; };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { } } };
  var valid = function (c) { return PX() && PX().parseLook(c) ? c : null; };

  var code = DEFAULT, unsent = false, signed = false, address = null, canSend = false, panel = null, draft = null, preview = null, note = '';

  function toRoom() { var h = window.PXRoomHost && window.PXRoomHost.looks; if (h) h.setSelf(code); }
  function send() {
    if (!signed || !canSend) return false;
    window.dispatchEvent(new CustomEvent('px-room-send', { detail: { t: 'look', v: code[0] === 'p' ? null : code } }));
    return true;
  }
  function adopt(next, fromRoom) {
    code = valid(next) || DEFAULT; store.set(KEY, code);
    if (fromRoom) { unsent = false; store.set(UNSENT, null); }
    toRoom(); paint();
  }
  // The look kept in this browser is read at once; the page's presence code is told as soon as it exists.
  code = valid(store.get(KEY)) || DEFAULT; unsent = store.get(UNSENT) === '1';
  if (window.PXRoomHost) toRoom(); else window.addEventListener('px-room-host', toRoom, { once: true });

  // ------------------------------------------------------------------ the room

  function onRoom(m) {
    if (!m) return;
    if (m.t === 'room') {
      var you = m.you || {}; signed = !!(you.a && !you.guest); address = signed ? you.a : null;
      canSend = Array.isArray(m.features) && m.features.indexOf('look') >= 0;
      if (signed && canSend) {
        var theirs = (m.looks && m.looks[address]) || null;
        if (unsent) send();                                   // a choice made before signing in (or while the room was away)
        else if ((theirs || DEFAULT) !== code && (theirs || code[0] !== 'p')) adopt(theirs || DEFAULT, true);   // the room's copy: another device changed it
      }
      paint();
    } else if (m.t === 'look' && address && m.a === address) {
      if (m.mine) { unsent = false; store.set(UNSENT, null); note = 'Saved. Everyone in the room sees you this way.'; paint(); }
      else adopt(m.v || DEFAULT, true);                       // another tab or device of this player
    } else if (m.t === 'err' && typeof m.code === 'string' && m.code.indexOf('look') === 0) {
      note = m.code === 'look-too-fast' ? 'That was a lot of changes at once. It is saved here; press Save again in a moment to show the room.' : 'The room did not take that look. It is saved in this browser.';
      paint();
    }
  }
  function onSelf(info) { signed = !!(info && info.signed); address = signed ? info.address : null; if (!signed) canSend = false; toRoom(); paint(); }

  // ------------------------------------------------------------------ the panel

  var CSS = '#pxCharacter{position:fixed;inset:0;z-index:60;display:grid;place-items:center;background:rgba(3,7,12,.62);backdrop-filter:blur(3px);font:13px/1.5 Arial,Helvetica,sans-serif;color:#dfe6ee}' +
    '#pxCharacter[hidden]{display:none}' +
    '#pxCharacter .card{position:relative;display:grid;grid-template-columns:300px minmax(0,1fr);grid-template-rows:minmax(0,1fr);width:min(860px,calc(100vw - 32px));height:min(680px,calc(100dvh - 32px));background:linear-gradient(135deg,#0c1622,#070d15);border:1px solid rgba(227,184,74,.38);border-radius:6px;box-shadow:0 20px 80px #000b;overflow:hidden}' +
    '#pxCharacter .stage{position:relative;background:radial-gradient(circle at 50% 38%,#1b2a3a,#070c13 72%);min-height:300px;display:grid;place-items:center;touch-action:none}' +
    '#pxCharacter .stage canvas{width:100%;height:100%;display:block;cursor:grab}' +
    '#pxCharacter .stage .human{padding:26px;text-align:center;color:#aab4c2;font-size:12px;line-height:1.7}' +
    '#pxCharacter .stage .human svg{display:block;margin:0 auto 14px;width:92px;height:150px}' +
    '#pxCharacter .stage .hint{position:absolute;left:0;right:0;bottom:10px;text-align:center;font-size:10px;letter-spacing:.14em;color:#7f8c9c;pointer-events:none}' +
    '#pxCharacter .opts{display:flex;flex-direction:column;min-height:0}' +
    '#pxCharacter .scroll{overflow:auto;padding:22px 24px 8px;min-height:0;overscroll-behavior:contain}' +
    '#pxCharacter h2{margin:0 0 4px;font:400 26px/1.1 Georgia,serif;color:#f3e7d1;text-wrap:balance}' +
    '#pxCharacter .sub{margin:0 0 16px;color:#9eacc0;font-size:12px}' +
    '#pxCharacter h3{margin:16px 0 7px;font:700 9px Arial,sans-serif;letter-spacing:.2em;color:#e3b84a;text-transform:uppercase}' +
    '#pxCharacter button{font:inherit;color:inherit;cursor:pointer}' +
    '#pxCharacter .bodies{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}' +
    '#pxCharacter .bodies button{padding:10px 9px;text-align:left;background:#ffffff06;border:1px solid #d9b47733;border-radius:4px;min-height:62px}' +
    '#pxCharacter .bodies b{display:block;font-size:13px;font-weight:600;color:#f3e7d1}' +
    '#pxCharacter .bodies small{display:block;font-size:10px;color:#8997a9;line-height:1.35;margin-top:3px}' +
    '#pxCharacter .bodies [aria-pressed=true],#pxCharacter .chips [aria-pressed=true]{border-color:#e3b84a;background:#e3b84a1f;box-shadow:inset 0 0 0 1px #e3b84a}' +
    '#pxCharacter .sw{display:flex;flex-wrap:wrap;gap:7px;align-items:center}' +
    '#pxCharacter .sw button{width:34px;height:34px;border-radius:50%;border:2px solid #ffffff2e;padding:0}' +
    '#pxCharacter .sw button[aria-pressed=true]{box-shadow:0 0 0 2px #0a121c,0 0 0 4px #e3b84a}' +
    '#pxCharacter .sw label{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:#9eacc0;margin-left:4px}' +
    '#pxCharacter .sw input[type=color]{width:34px;height:34px;padding:0;border:2px solid #ffffff2e;border-radius:50%;background:none;cursor:pointer}' +
    '#pxCharacter .chips{display:flex;flex-wrap:wrap;gap:6px}' +
    '#pxCharacter .chips button{padding:8px 12px;min-height:36px;background:#ffffff06;border:1px solid #d9b47733;border-radius:18px;font-size:12px}' +
    '#pxCharacter .cubeonly[hidden]{display:none}' +
    '#pxCharacter details{margin:16px 0 4px;border-top:1px solid #ffffff14;padding-top:10px}' +
    '#pxCharacter summary{cursor:pointer;color:#d7bf91;font-size:12px}' +
    '#pxCharacter textarea{width:100%;height:74px;margin-top:8px;background:#060b12;color:#dfe6ee;border:1px solid #d9b47733;border-radius:4px;padding:8px;font:11px/1.4 ui-monospace,Menlo,monospace;resize:vertical}' +
    '#pxCharacter .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px}' +
    '#pxCharacter .ghost{padding:8px 12px;background:none;border:1px solid #d9b47755;border-radius:4px;font-size:12px;color:#e6d3ac}' +
    '#pxCharacter code{font:11px ui-monospace,Menlo,monospace;color:#9fe3d5;user-select:all}' +
    '#pxCharacter .foot{display:flex;gap:10px;align-items:center;padding:12px 24px;border-top:1px solid #ffffff14;background:#060b12cc}' +
    '#pxCharacter .foot p{flex:1;margin:0;font-size:11px;line-height:1.45;color:#9eacc0}' +
    '#pxCharacter .foot .save{padding:11px 20px;background:linear-gradient(#e3b84a,#b98a22);color:#1a1006;border:1px solid #ffe08a;border-radius:4px;font-weight:700;white-space:nowrap}' +
    '#pxCharacter .x{position:absolute;top:8px;right:8px;width:36px;height:36px;border-radius:50%;background:#0009;border:1px solid #ffffff26;font-size:18px;line-height:1;z-index:2}' +
    '#pxCharacter button:focus-visible,#pxCharacter input:focus-visible,#pxCharacter summary:focus-visible{outline:2px solid #9fe3d5;outline-offset:2px}' +
    '@media (max-width:720px){#pxCharacter{place-items:end center}#pxCharacter .card{grid-template-columns:1fr;grid-template-rows:minmax(150px,26dvh) minmax(0,1fr);width:100vw;height:calc(100dvh - 12px);border-radius:10px 10px 0 0;border-bottom:0}#pxCharacter .stage{min-height:0}#pxCharacter .stage .human svg{display:none}#pxCharacter .stage .human{padding:14px 50px}#pxCharacter .scroll{padding:14px 16px 6px}#pxCharacter h2{font-size:22px}#pxCharacter .foot{padding:10px 16px calc(10px + env(safe-area-inset-bottom))}#pxCharacter .bodies small{display:none}#pxCharacter .bodies button{min-height:44px}}';

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function look() { return PX() ? PX().parseLook(draft) || PX().parseLook(DEFAULT) : { body: 'p' }; }
  function setDraft(change) { if (!PX()) return; var l = look(); for (var k in change) l[k] = change[k]; draft = PX().encodeLook(l); note = ''; paint(); }

  function build() {
    if (panel) return;
    var st = el('style'); st.id = 'pxCharacterStyle'; st.textContent = CSS; document.head.appendChild(st);
    panel = el('section'); panel.id = 'pxCharacter'; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Your character');
    panel.innerHTML = '<div class="card"><button class="x" type="button" aria-label="Close">×</button><div class="stage"></div><div class="opts"><div class="scroll"></div><div class="foot"></div></div></div>';
    document.body.appendChild(panel);
    panel.querySelector('.x').onclick = close;
    panel.addEventListener('pointerdown', function (e) { if (e.target === panel) close(); });
    // the casino's own keys (walking, E, Escape, 1-7...) must not act on the room while this is open
    ['keydown', 'keyup', 'keypress'].forEach(function (t) { panel.addEventListener(t, function (e) { if (t === 'keydown' && e.key === 'Escape') close(); e.stopPropagation(); }); });
    window.addEventListener('keydown', function (e) { if (panel && !panel.hidden && e.key === 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); close(); } }, true);
  }

  function paint() {
    cardLink();
    if (!panel || panel.hidden) return;
    var P = PX(), l = look(), cube = l.body !== 'p', box = panel.querySelector('.scroll'), keep = box.scrollTop;
    var parts = [el('h2', null, 'Your character'), el('p', 'sub', 'How everyone in the room sees you. Change it whenever you like.')];
    var pick = function (list, key, cls) {
      var row = el('div', cls);
      list.forEach(function (o) {
        var b = el('button'); b.type = 'button'; b.setAttribute('aria-pressed', String(l[key] === o.id));
        if (cls === 'bodies') { b.append(el('b', null, o.label), el('small', null, o.note)); } else b.textContent = o.label;
        b.onclick = function () { var c = {}; c[key] = o.id; setDraft(c); };
        row.append(b);
      });
      return row;
    };
    var swatches = function (colours, current, onPick, customLabel, customOn) {
      var row = el('div', 'sw');
      colours.forEach(function (c) {
        var b = el('button'); b.type = 'button'; b.style.background = c.color; b.title = c.label || c.color; b.setAttribute('aria-label', c.label || c.color);
        b.setAttribute('aria-pressed', String(!customOn && current.toLowerCase() === c.color.toLowerCase())); b.onclick = function () { onPick(c, false); }; row.append(b);
      });
      var lab = el('label'), inp = el('input'); inp.type = 'color'; inp.value = current; inp.setAttribute('aria-label', customLabel);
      inp.oninput = function () { onPick({ color: inp.value }, true); };
      lab.append(inp, document.createTextNode(customLabel)); row.append(lab);
      return row;
    };
    if (P) {
      parts.push(el('h3', null, 'Body'), pick(P.BODIES, 'body', 'bodies'));
      var only = el('div', 'cubeonly'); only.hidden = !cube;
      only.append(el('h3', null, 'Frame'), swatches(P.FRAMES, l.frameColor, function (c, custom) { setDraft(custom ? { frame: 'x', frameColor: c.color } : { frame: c.id, frameColor: c.color }); }, 'Your own colour', l.frame === 'x'));
      only.append(el('h3', null, 'Screens and lights'), swatches(P.ACCENTS.map(function (c) { return { color: c }; }), l.accent, function (c) { setDraft({ accent: c.color }); }, 'Your own colour', false));
      only.append(el('h3', null, 'Face'), pick(P.FACES, 'face', 'chips'));
      only.append(el('h3', null, 'Screen finish'), pick(P.FINISHES, 'finish', 'chips'));
      only.append(el('h3', null, 'Walk'), pick(P.GAITS, 'gait', 'chips'));
      var row = el('div', 'row'), rnd = el('button', 'ghost', 'Surprise me'); rnd.type = 'button';
      rnd.onclick = function () { var r = function (n) { return Math.floor(Math.random() * n); }; setDraft({ frame: P.FRAMES[r(8)].id, accent: P.ACCENTS[r(P.ACCENTS.length)], face: P.FACES[r(6)].id, finish: P.FINISHES[r(6)].id }); };
      row.append(rnd); only.append(row);
      var det = el('details'); det.open = !!paint.labOpen; det.ontoggle = function () { paint.labOpen = det.open; };
      det.append(el('summary', null, 'Bring a look from the Xtrata Cube Lab'));
      var ta = el('textarea'); ta.placeholder = 'Paste the lab’s "Material settings / JSON" here'; ta.setAttribute('aria-label', 'Cube Lab material settings (JSON)'); ta.value = paint.labText || ''; ta.oninput = function () { paint.labText = ta.value; };
      var r2 = el('div', 'row'), use = el('button', 'ghost', 'Use this look'); use.type = 'button';
      use.onclick = function () { var got = P.fromLabLook(ta.value); if (got) { setDraft(got); note = 'Frame and finish taken from the lab look. Screens and body are chosen here.'; } else note = 'That does not look like a Cube Lab look. Copy the whole "Material settings / JSON" box.'; paint(); };
      var mine = el('span'); mine.append(document.createTextNode('Your look code: '), el('code', null, draft));
      r2.append(use, mine); det.append(ta, r2); only.append(det);
      parts.push(only);
    } else parts.push(el('p', 'sub', 'The cube characters could not be loaded just now. You are seen as the classic figure.'));
    box.replaceChildren.apply(box, parts); box.scrollTop = keep;

    var foot = panel.querySelector('.foot'), changed = draft !== code;
    var status = note || (!signed ? 'Kept in this browser. Join the room and everyone there sees you this way.'
      : unsent && !changed ? 'Saved here. The room will be told as soon as it is reachable.'
        : changed ? 'Not saved yet.' : 'This is how everyone in the room sees you.');
    var save = el('button', 'save', changed ? (signed ? 'Save and show the room' : 'Save') : 'Done'); save.type = 'button';
    save.onclick = function () {
      if (!changed) return close();
      code = valid(draft) || DEFAULT; store.set(KEY, code); unsent = true; store.set(UNSENT, '1'); toRoom();
      note = send() ? 'Saving…' : (signed ? 'Saved here. The room will be told as soon as it is reachable.' : '');
      paint(); if (!signed) close();
    };
    var p = el('p', null, status); p.setAttribute('role', 'status');
    foot.replaceChildren(p, save);
    stage(l);
  }

  // ------------------------------------------------------------------ the preview (its own small renderer, only while the panel is open)

  var HUMAN = '<div class="human"><svg viewBox="0 0 92 150" aria-hidden="true"><circle cx="46" cy="22" r="15" fill="#c9a98a"/><path d="M22 52q24-14 48 0l6 44H60l-2 50H34l-2-50H16z" fill="#3a5a8a"/><path d="M34 96h24l-1 50H35z" fill="#23262c"/></svg>The human figure, in a shirt whose colour comes from your address, so you look the same to everyone, every visit.</div>';
  function stage(l) {
    var box = panel.querySelector('.stage');
    if (l.body === 'p' || !PX() || !window.THREE) { stopPreview(); if (!box.querySelector('.human')) box.innerHTML = HUMAN; return; }
    if (!preview) startPreview(box);
    if (!preview) { if (!box.querySelector('.human')) box.innerHTML = '<div class="human">The preview needs 3D graphics, which this browser is not offering right now. Your choices are still saved.</div>'; return; }
    if (!preview.who) { preview.who = preview.kit.make(draft, 'you'); preview.scene.add(preview.who.group); }
    else if (preview.code !== draft) preview.who.setLook(draft);
    preview.code = draft;
  }
  function startPreview(box) {
    var T = window.THREE;
    try {
      box.innerHTML = '<canvas aria-label="Preview of your character"></canvas><div class="hint">DRAG TO TURN</div>';
      var canvas = box.querySelector('canvas'), renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      var scene = new T.Scene(), camera = new T.PerspectiveCamera(32, 1, 0.1, 30);
      scene.add(new T.HemisphereLight(0xdfe9ff, 0x2a2018, 0.95)); var sun = new T.DirectionalLight(0xfff1d6, 0.85); sun.position.set(2.5, 4, 3.5); scene.add(sun); var rim = new T.DirectionalLight(0x7fd8ff, 0.35); rim.position.set(-3, 2, -3); scene.add(rim);
      var floor = new T.Mesh(new T.CircleGeometry(0.95, 40), new T.MeshBasicMaterial({ color: 0x0d1722, transparent: true, opacity: 0.85 })); floor.rotation.x = -Math.PI / 2; scene.add(floor);
      preview = { renderer: renderer, scene: scene, camera: camera, kit: PX().kit(T, { lite: false }), who: null, code: null, yaw: 0.5, drag: null, raf: 0, t0: performance.now(), last: performance.now() };
      var p = preview;
      canvas.addEventListener('pointerdown', function (e) { p.drag = { x: e.clientX, yaw: p.yaw }; try { canvas.setPointerCapture(e.pointerId); } catch (_) { } });
      canvas.addEventListener('pointermove', function (e) { if (p.drag) p.yaw = p.drag.yaw + (e.clientX - p.drag.x) * 0.012; });
      var end = function () { p.drag = null; }; canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
      var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      (function frame(now) {
        if (preview !== p) return;
        p.raf = requestAnimationFrame(frame);
        var w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
        if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) { renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
        var dt = Math.min(0.05, (now - p.last) / 1000); p.last = now;
        if (p.who) {
          if (!p.drag && !still) p.yaw += dt * 0.25;
          p.who.group.rotation.y = p.yaw;
          // a few seconds standing, a few walking on the spot, so the walk shows too
          var cycle = ((now - p.t0) / 1000) % 9; p.who.update(dt, { speed: !still && cycle > 4.5 ? 3 : 0 });
          var tall = p.who.height(false), wide = camera.aspect < 0.9; camera.position.set(0, tall * 0.62, (wide ? 5.6 : 4.3) * (tall / 1.92) + 0.6); camera.lookAt(0, tall * 0.52, 0);
        }
        renderer.render(scene, camera);
      })(performance.now());
    } catch (e) { preview = null; console.warn('[character] no preview:', e); }
  }
  function stopPreview() {
    var p = preview; if (!p) return; preview = null;
    try { cancelAnimationFrame(p.raf); p.kit.dispose(); p.renderer.dispose(); if (p.renderer.forceContextLoss) p.renderer.forceContextLoss(); } catch (e) { }
    var box = panel && panel.querySelector('.stage'); if (box) box.innerHTML = '';
  }

  // The welcome card's own way in: a line under ENTER THE CASINO that says what you are seen as, and opens the panel.
  function cardLink() {
    var enter = document.getElementById('walkin'); if (!enter) return;
    var b = document.getElementById('introLook');
    if (!b) {
      b = el('button', 'introLook'); b.id = 'introLook'; b.type = 'button';
      b.onclick = function (e) { e.stopPropagation(); open(); };      // not a way into the room: the card's join step stays as it is
      enter.insertAdjacentElement('afterend', b);
    }
    var l = PX() && PX().parseLook(code), name = !l || l.body === 'p' ? 'the classic figure' : l.body === 'h' ? 'a humanoid cube' : 'a floating cube';
    b.replaceChildren(document.createTextNode('Your character'), el('small', null, 'you are ' + name + ' \u00b7 change'));
  }
  cardLink();

  function open() {
    build(); draft = code; note = '';
    try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) { }
    panel.hidden = false; document.body.classList.add('px-character-open'); paint();
    var first = panel.querySelector('.bodies button[aria-pressed=true]') || panel.querySelector('.x'); if (first) try { first.focus({ preventScroll: true }); } catch (e) { }
  }
  function close() { if (!panel || panel.hidden) return; panel.hidden = true; document.body.classList.remove('px-character-open'); stopPreview(); }

  window.PXCharacter = { open: open, close: close, onRoom: onRoom, onSelf: onSelf, get code() { return code; }, get unsent() { return unsent; }, get isOpen() { return !!panel && !panel.hidden; },
    /** For tests and the lab link: set the look without the panel. */
    set: function (next) { var c = valid(next); if (!c) return false; code = c; store.set(KEY, code); unsent = true; store.set(UNSENT, '1'); toRoom(); send(); return true; } };
})();
