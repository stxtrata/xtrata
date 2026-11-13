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
 * Inscriptions on the screens (cubes only; functions/lib/casino-screens.ts): a signed-in player may put Xtrata inscriptions their wallet
 * holds on any of the cube's six screens (on the front it takes the place of the face). The panel lists the wallet's inscriptions (the mainnet address of the same key), and Save posts the
 * choice to /casino/room/screens, which checks the chain before the room is told. What is kept here (`parallax.screens.v1`) is only
 * ever a set the server has confirmed; the room's copy wins on arrival, and is checked again about once a day while the player visits.
 *
 * It draws nothing in the room itself: the page's presence code does that (index.html, "Cube characters"), through
 * window.PXRoomHost.looks. With cube-avatars.js or the room missing, the panel still opens and the choice is still kept.
 *
 * window.PXCharacter: open(), close(), code (the current look), screens, onRoom(message), onSelf(info)   [the last two are called by the page]
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
  // ------------------------------------------------------------------ inscriptions on the screens

  var SKEY = 'parallax.screens.v1', RECHECK_MS = 20 * 60 * 60 * 1000;
  var FACE_NAMES = { f: 'Front', b: 'Back', l: 'Left side', r: 'Right side', t: 'Top', u: 'Underneath' };
  // the picker fills the back and sides first: the front is the face, so it is only replaced when the player picks that screen
  var FILL_ORDER = ['b', 'l', 'r', 't', 'u', 'f'];
  // shots: the set the server last confirmed · shotsDraft: the panel's · ins: { contract, asset, holder } from the room · held: the wallet's inscriptions
  var shots = '', shotsDraft = '', ins = null, canShots = false, held = { state: 'idle', list: [] }, slot = 'b', shotBox = null, saving = false, shotNote = '', checkedAt = 0;
  var okShots = function (t) { var P = PX(); return P && P.parseScreens && typeof t === 'string' && P.parseScreens(t) ? P.encodeScreens(P.parseScreens(t)) : ''; };
  function shotsToRoom() { var h = window.PXRoomHost && window.PXRoomHost.looks; if (h && h.setSelfScreens) h.setSelfScreens(shots); }
  function adoptShots(text) { shots = okShots(text); store.set(SKEY, shots || null); shotsToRoom(); }
  /**
   * Ask the server to check the chain and tell the room. `quiet` is the daily re-check: it says nothing unless an inscription has left
   * the wallet, and then it takes that one off. A failed check changes nothing (it is not the same as "not held").
   */
  function postShots(text, quiet) {
    if (!signed || !canShots) return Promise.resolve(false);
    if (!quiet) saving = true;
    return fetch('/casino/room/screens', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sc: text }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, j: j || {} }; }); })
      .then(function (res) {
        var j = res.j, P = PX();
        if (res.status === 200 && j.ok) {
          adoptShots(j.sc || ''); checkedAt = Date.now(); if (!quiet || !panel || panel.hidden) shotsDraft = shots;
          if (!quiet) shotNote = shots ? 'Saved. Your inscriptions are on your screens for everyone in the room.' : 'Saved. Your screens show the cube\u2019s own graphics.';
          return true;
        }
        if (j.error === 'screens-not-yours' && P) {
          var gone = Array.isArray(j.ids) ? j.ids : [], map = P.parseScreens(text) || {};
          P.SCREEN_FACES.forEach(function (f) { if (gone.indexOf(map[f]) >= 0) delete map[f]; });
          var rest = P.encodeScreens(map), names = gone.map(function (n) { return '#' + n; }).join(', ');
          // one has left the wallet: the room is told the rest (a moment later: the server takes one ask every 3 seconds)
          if (quiet) { if (rest === text) return false; return new Promise(function (go) { setTimeout(go, 3300); }).then(function () { return postShots(rest, true); }); }
          shotsDraft = rest;
          shotNote = (gone.length === 1 ? 'Inscription ' + names + ' is not in this wallet, so it was taken off.' : 'Inscriptions ' + names + ' are not in this wallet, so they were taken off.') + ' Nothing is saved yet: press Save again.';
          return false;
        }
        if (!quiet) shotNote = j.error === 'screens-could-not-check' ? 'The chain could not be read just now, so nothing was changed. Press Save again in a moment.'
          : j.error === 'screens-off' ? 'Inscriptions on screens are switched off at the moment. Nothing was changed.'
            : j.error === 'screens-too-fast' ? 'That was quick. Nothing was changed: press Save again in a few seconds.'
            : res.status === 401 ? 'Join the room first: your wallet is how the casino knows what you hold.'
              : 'That could not be saved just now. Nothing was changed.';
        return false;
      })
      .catch(function () { if (!quiet) shotNote = 'The casino could not be reached. Nothing was changed.'; return false; })
      .then(function (ok) { if (!quiet) saving = false; paint(); return ok; });
  }
  // About once a day while the player is here (on arrival, and for a page left open): ask again, so screens follow a sale or a transfer.
  function recheck() { if (signed && canShots && shots && Date.now() - checkedAt > RECHECK_MS) { checkedAt = Date.now() - RECHECK_MS + 10 * 60 * 1000; postShots(shots, true); } }      // at most every ten minutes if the chain cannot be read
  setInterval(recheck, 15 * 60 * 1000);
  /** The wallet's inscriptions, newest first (the first 200), then what each one is and where its picture is. */
  function loadHeld(force) {
    var P = PX(); if (!P || !ins || !ins.holder || held.state === 'loading') return;
    if (!force && held.state === 'ok' && held.who === ins.holder && Date.now() - held.at < 60000) return;
    var who = ins.holder, contract = ins.contract;
    held = { state: 'loading', list: [], who: who }; paintShots();
    fetch('/hiro/mainnet/extended/v1/tokens/nft/holdings?principal=' + encodeURIComponent(who) + '&asset_identifiers=' + encodeURIComponent(contract + '::' + (ins.asset || 'xtrata-inscription')) + '&limit=200&offset=0')
      .then(function (r) { if (!r.ok) throw new Error('holdings ' + r.status); return r.json(); })
      .then(function (j) {
        if (!j || !Array.isArray(j.results)) throw new Error('holdings shape');
        var ids = [];
        j.results.forEach(function (row) { var m = /^u(\d{1,10})$/.exec((row && row.value && row.value.repr) || ''); if (m && ids.indexOf(+m[1]) < 0) ids.push(+m[1]); });
        ids.sort(function (a, b) { return b - a; });
        held = { state: 'ok', who: who, at: Date.now(), total: Math.max(ids.length, +j.total || 0), list: ids.map(function (id) { return { id: id, url: null, kind: '' }; }) };
        paintShots();
        var real = ids.filter(function (n) { return n > 0; }); if (!real.length) return;
        return fetch('/index/page?primary=' + encodeURIComponent(contract) + '&ids=' + real.join(','))
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (k) {
            var rows = {}; ((k && k.tokens) || []).forEach(function (t) { if (t && typeof t.id === 'number') rows[t.id] = t; });
            held.list.forEach(function (it) { var t = rows[it.id]; if (!t) return; var src = P.pictureSource(contract, t, true, ''); it.url = src.url; it.kind = src.kind; });
            paintShots();
          }).catch(function () { /* the tiles keep their numbers */ });
      })
      .catch(function () { held = { state: 'fail', list: [], who: who }; paintShots(); });
  }
  function setSlot(face, id) {
    var P = PX(), map = P.parseScreens(shotsDraft) || {};
    if (id === null) delete map[face]; else map[face] = id;
    shotsDraft = P.encodeScreens(map); shotNote = ''; note = '';
    if (id !== null) { var next = FILL_ORDER.filter(function (f) { return map[f] === undefined; })[0]; if (next) slot = next; }
    paint();
  }
  /** The picker: six screens, and the wallet's inscriptions to put on them. One element, kept between paints so its pictures are not fetched again. */
  function paintShots() {
    var P = PX(); if (!shotBox || !P) return;
    var map = P.parseScreens(shotsDraft) || {}, parts = [], byId = {};
    held.list.forEach(function (it) { byId[it.id] = it; });
    parts.push(el('p', 'sub', 'Put inscriptions from your wallet on any of your six screens, and everyone in the room sees them. On the front, an inscription takes the place of your face (reactions still show there).'));
    if (!signed) { parts.push(el('p', 'say', 'Join the room to use this: your wallet is how the casino knows what you hold.')); shotBox.replaceChildren.apply(shotBox, parts); return; }
    if (!canShots) { parts.push(el('p', 'say', 'The room is not offering this just now.')); shotBox.replaceChildren.apply(shotBox, parts); return; }
    var tile = function (id) {
      var it = byId[id], t = el('span', 'pic');
      if (it && it.url) { var img = el('img'); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.src = it.url; img.onerror = function () { img.remove(); }; t.append(img); }
      t.append(el('i', null, '#' + id)); if (it && it.kind && !(it.url)) t.append(el('em', null, it.kind));
      return t;
    };
    var slots = el('div', 'slots');
    P.SCREEN_FACES.forEach(function (f) {
      var b = el('button'); b.type = 'button'; b.setAttribute('aria-pressed', String(slot === f));
      b.setAttribute('aria-label', FACE_NAMES[f] + (map[f] !== undefined ? ': inscription ' + map[f] : ': empty'));
      b.append(map[f] !== undefined ? tile(map[f]) : el('span', 'pic none' + (f === 'f' ? ' face' : ''), f === 'f' ? 'your face' : '+'), el('small', null, FACE_NAMES[f]));
      b.onclick = function () { slot = f; paintShots(); };
      slots.append(b);
    });
    parts.push(slots);
    var bar = el('div', 'row'), sayNow = el('span', 'say', FACE_NAMES[slot] + (map[slot] !== undefined ? ': inscription #' + map[slot] : slot === 'f' ? ': your face. Choose an inscription below to show it here instead' : ': choose an inscription below'));
    bar.append(sayNow);
    if (map[slot] !== undefined) { var off = el('button', 'ghost', 'Take it off'); off.type = 'button'; off.onclick = function () { setSlot(slot, null); }; bar.append(off); }
    if (shotsDraft) { var none = el('button', 'ghost', 'Clear all'); none.type = 'button'; none.onclick = function () { shotsDraft = ''; shotNote = ''; paint(); }; bar.append(none); }
    parts.push(bar);
    var short = function (a) { return a.length > 14 ? a.slice(0, 6) + '\u2026' + a.slice(-5) : a; };
    if (held.state === 'loading' || held.state === 'idle') parts.push(el('p', 'say', 'Looking in your wallet\u2026'));
    else if (held.state === 'fail') {
      var again = el('button', 'ghost', 'Try again'); again.type = 'button'; again.onclick = function () { loadHeld(true); };
      var failed = el('p', 'say', 'Your wallet could not be read just now. That is not the same as empty: try again, or type an inscription\u2019s number below. '); failed.append(again); parts.push(failed);
    } else if (!held.list.length) parts.push(el('p', 'say', 'No Xtrata inscriptions were found in ' + short(ins.holder) + ' (your wallet on mainnet). If one has only just arrived, type its number below.'));
    else {
      var grid = el('div', 'ins'); grid.setAttribute('role', 'list');
      held.list.forEach(function (it) {
        var b = el('button'); b.type = 'button'; b.setAttribute('role', 'listitem'); b.title = 'Inscription #' + it.id + (it.kind ? ' \u00b7 ' + it.kind.toLowerCase() : '');
        b.setAttribute('aria-label', 'Put inscription ' + it.id + ' on the ' + FACE_NAMES[slot].toLowerCase() + ' screen');
        var used = P.SCREEN_FACES.filter(function (f) { return map[f] === it.id; }); if (used.length) b.className = 'used';
        b.append(tile(it.id)); b.onclick = function () { setSlot(slot, it.id); };
        grid.append(b);
      });
      parts.push(grid);
      parts.push(el('p', 'fine', (held.total > held.list.length ? 'Showing the newest ' + held.list.length + ' of ' + held.total + '. ' : '') + 'From ' + short(ins.holder) + ', your wallet on mainnet. Sound, video and pages show as a numbered tile.'));
    }
    var add = el('div', 'row'), num = el('input'), put = el('button', 'ghost', 'Use this number'); put.type = 'button';
    num.type = 'text'; num.inputMode = 'numeric'; num.placeholder = 'Inscription number'; num.setAttribute('aria-label', 'Inscription number'); num.maxLength = 9; num.className = 'num';
    var use = function () { var v = num.value.trim(); if (/^(0|[1-9]\d{0,8})$/.test(v)) setSlot(slot, +v); else { num.focus(); } };
    put.onclick = use; num.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); use(); } });
    add.append(num, put); parts.push(add);
    parts.push(el('p', 'fine', 'Only inscriptions this wallet holds can be shown: the chain is checked when you save, and again each day you visit. Anyone can hide all inscriptions for themselves in Menu, View and sound.'));
    shotBox.replaceChildren.apply(shotBox, parts);
  }

  // The look kept in this browser is read at once; the page's presence code is told as soon as it exists.
  code = valid(store.get(KEY)) || DEFAULT; unsent = store.get(UNSENT) === '1';
  shots = okShots(store.get(SKEY) || '');
  var tellRoom = function () { toRoom(); shotsToRoom(); };
  if (window.PXRoomHost) tellRoom(); else window.addEventListener('px-room-host', tellRoom, { once: true });

  // ------------------------------------------------------------------ the room

  function onRoom(m) {
    if (!m) return;
    if (m.t === 'room') {
      var you = m.you || {}; signed = !!(you.a && !you.guest); address = signed ? you.a : null;
      canSend = Array.isArray(m.features) && m.features.indexOf('look') >= 0;
      ins = m.ins && typeof m.ins.contract === 'string' && m.ins.contract ? m.ins : null;
      canShots = signed && Array.isArray(m.features) && m.features.indexOf('screens') >= 0 && !!(ins && ins.holder);
      if (canShots) {
        // the room's copy of this player's screens wins; when the chain was last asked a while ago, it is asked again now
        var mine = okShots((m.scr && m.scr.v) || '');
        adoptShots(mine); if (!panel || panel.hidden) shotsDraft = shots;
        checkedAt = (m.scr && +m.scr.at) || 0; recheck();
      }
      if (signed && canSend) {
        var theirs = (m.looks && m.looks[address]) || null;
        if (unsent) send();                                   // a choice made before signing in (or while the room was away)
        else if ((theirs || DEFAULT) !== code && (theirs || code[0] !== 'p')) adopt(theirs || DEFAULT, true);   // the room's copy: another device changed it
      }
      paint();
    } else if (m.t === 'look' && address && m.a === address) {
      if ('sc' in m && okShots(m.sc || '') !== shots) { adoptShots(m.sc || ''); if (!panel || panel.hidden) shotsDraft = shots; }      // saved here or on another device
      if (m.mine) { unsent = false; store.set(UNSENT, null); note = 'Saved. Everyone in the room sees you this way.'; paint(); }
      else adopt(m.v || DEFAULT, true);                       // another tab or device of this player
    } else if (m.t === 'err' && typeof m.code === 'string' && m.code.indexOf('look') === 0) {
      note = m.code === 'look-too-fast' ? 'That was a lot of changes at once. It is saved here; press Save again in a moment to show the room.' : 'The room did not take that look. It is saved in this browser.';
      paint();
    }
  }
  function onSelf(info) { signed = !!(info && info.signed); address = signed ? info.address : null; if (!signed) { canSend = false; canShots = false; } tellRoom(); paint(); }

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
    '#pxCharacter .shots .sub{margin:0 0 10px}' +
    '#pxCharacter .shots .say{margin:8px 0;color:#c6d0dc;font-size:12px}' +
    '#pxCharacter .shots .fine{margin:8px 0 0;color:#7f8c9c;font-size:10.5px;line-height:1.5}' +
    '#pxCharacter .slots{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px}' +
    '#pxCharacter .pic.none.face{font-size:9px;letter-spacing:.04em;text-align:center;line-height:1.2;border-style:solid;color:#9eacc0}' +
    '@media (max-width:420px){#pxCharacter .slots{gap:4px}#pxCharacter .slots button{padding:4px 2px 5px}#pxCharacter .slots small{font-size:9px}}' +
    '#pxCharacter .slots button{padding:5px 4px 6px;background:#ffffff06;border:1px solid #d9b47733;border-radius:4px;display:grid;gap:4px;justify-items:center;min-width:0}' +
    '#pxCharacter .slots button[aria-pressed=true]{border-color:#e3b84a;background:#e3b84a1f;box-shadow:inset 0 0 0 1px #e3b84a}' +
    '#pxCharacter .slots small{font-size:10px;color:#9eacc0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}' +
    '#pxCharacter .pic{position:relative;display:grid;place-items:center;width:100%;aspect-ratio:1;max-width:76px;border-radius:5px;overflow:hidden;background:linear-gradient(135deg,#1c2c35,#0d1a20);color:#e9f7f3}' +
    '#pxCharacter .pic.none{color:#7f8c9c;font-size:20px;background:#ffffff08;border:1px dashed #ffffff26}' +
    '#pxCharacter .pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}' +
    '#pxCharacter .pic i{position:relative;font:700 11px Arial,sans-serif;font-style:normal}' +
    '#pxCharacter .pic img~i{position:absolute;left:3px;bottom:3px;padding:1px 4px;border-radius:3px;background:#000a;font-size:9px}' +
    '#pxCharacter .pic em{position:absolute;left:0;right:0;bottom:5px;text-align:center;font:700 7px Arial,sans-serif;font-style:normal;letter-spacing:.12em;color:#4ed5bd}' +
    '#pxCharacter .ins{display:grid;grid-template-columns:repeat(auto-fill,minmax(62px,1fr));gap:6px;max-height:212px;overflow:auto;overscroll-behavior:contain;padding:2px;margin-top:8px;border:1px solid #ffffff14;border-radius:4px}' +
    '#pxCharacter .ins button{padding:0;background:none;border:2px solid transparent;border-radius:6px;min-width:0}' +
    '#pxCharacter .ins button.used{border-color:#e3b84a}' +
    '#pxCharacter .ins .pic{max-width:none}' +
    '#pxCharacter .num{width:150px;min-height:36px;padding:0 10px;background:#060b12;color:#dfe6ee;border:1px solid #d9b47755;border-radius:4px;font:inherit}' +
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
  function setDraft(change) { if (!PX()) return; var l = look(); for (var k in change) l[k] = change[k]; draft = PX().encodeLook(l); note = ''; shotNote = ''; paint(); }

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
      if (P.parseScreens) {
        if (!shotBox) shotBox = el('div', 'shots');
        only.append(el('h3', null, 'Inscriptions on your screens'), shotBox); paintShots();
      }
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

    var foot = panel.querySelector('.foot'), lookChanged = draft !== code, shotsChanged = cube && canShots && shotsDraft !== shots, changed = lookChanged || shotsChanged;
    var status = [note, shotNote].filter(Boolean).join(' ') || (!signed ? 'Kept in this browser. Join the room and everyone there sees you this way.'
      : unsent && !changed ? 'Saved here. The room will be told as soon as it is reachable.'
        : changed ? 'Not saved yet.' : 'This is how everyone in the room sees you.');
    var save = el('button', 'save', saving ? 'Checking\u2026' : changed ? (signed ? 'Save and show the room' : 'Save') : 'Done'); save.type = 'button'; save.disabled = saving;
    save.onclick = function () {
      if (!changed) return close();
      if (lookChanged) {
        code = valid(draft) || DEFAULT; store.set(KEY, code); unsent = true; store.set(UNSENT, '1'); toRoom();
        note = send() ? 'Saving…' : (signed ? 'Saved here. The room will be told as soon as it is reachable.' : '');
      }
      if (shotsChanged) { shotNote = 'Checking that your wallet holds them\u2026'; postShots(shotsDraft, false); }
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
    if (preview.kit.inscriptions) preview.kit.inscriptions(ins ? { contract: ins.contract, base: '' } : null);
    if (!preview.who) { preview.who = preview.kit.make(draft, 'you'); preview.scene.add(preview.who.group); }
    else if (preview.code !== draft) preview.who.setLook(draft);
    preview.code = draft;
    if (preview.who.setScreens && preview.shots !== shotsDraft) { preview.shots = shotsDraft; preview.who.setScreens(shotsDraft); }
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
    build(); draft = code; note = ''; shotsDraft = shots; shotNote = ''; slot = 'b';
    if (signed && canShots) loadHeld(false);
    try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) { }
    panel.hidden = false; document.body.classList.add('px-character-open'); paint();
    var first = panel.querySelector('.bodies button[aria-pressed=true]') || panel.querySelector('.x'); if (first) try { first.focus({ preventScroll: true }); } catch (e) { }
  }
  function close() { if (!panel || panel.hidden) return; panel.hidden = true; document.body.classList.remove('px-character-open'); stopPreview(); }

  window.PXCharacter = { open: open, close: close, onRoom: onRoom, onSelf: onSelf, get code() { return code; }, get screens() { return shots; },
    /** For tests: save a set of screens without the panel (the server still checks the chain). */
    setScreens: function (text) { return postShots(okShots(text), false); }, get screensNote() { return shotNote; }, get unsent() { return unsent; }, get isOpen() { return !!panel && !panel.hidden; },
    /** For tests and the lab link: set the look without the panel. */
    set: function (next) { var c = valid(next); if (!c) return false; code = c; store.set(KEY, code); unsent = true; store.set(UNSENT, '1'); toRoom(); send(); return true; } };
})();
