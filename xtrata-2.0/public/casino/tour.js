/* ParallaX Casino · THE FIRST MINUTE  (docs/plans/CASINO-OVERHAUL-PLAN.md, "A guided minute")
 *
 * A small card that walks a first-time visitor through the room in about a minute: look around, walk, sit down and play, where the
 * chips are, where everything else is. It starts by itself the first time somebody walks into the room, and never again after that.
 *
 *   - It never blocks anything. It is a card in a corner, not a dialog: the room goes on working under it, and nothing waits for it.
 *   - It can always be left: "Leave the tour" is on every step, and so is "Next". While walking, where the mouse may be held by
 *     the room, X and N do the same; at a table or a machine those keys belong to the game and only the buttons act.
 *   - The first three steps finish themselves when the visitor does the thing (looks about, walks a few steps, sits down).
 *   - It is offered again in Menu, Help, "Show me around".
 *
 * It reads the page only through window.__casinoView (where the player is, whether they are walking or seated) and two body classes;
 * it changes nothing in the page. What it remembers is one value in this browser: localStorage `parallax.tour.v1` ("done" or "left").
 *
 *   /casino/?tour=0   never starts it by itself        /casino/?tour=1   starts it now, whatever was remembered
 *
 * window.PXTour: start(force), leave(), next(), get active, get step
 */
(function () {
  'use strict';
  var KEY = 'parallax.tour.v1';
  var view = function () { return window.__casinoView || null; };
  var store = { get: function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } }, set: function (v) { try { localStorage.setItem(KEY, v); } catch (e) { } } };
  var touch = !!(window.matchMedia && window.matchMedia('(pointer:coarse)').matches) || 'ontouchstart' in window;
  var param = null; try { param = new URLSearchParams(location.search).get('tour'); } catch (e) { }

  var seated = function () { return document.body.classList.contains('playing') || document.body.classList.contains('machine-connected'); };
  // Each step: a title, what to do (keyboard and mouse / touch), and `done(s)` for the ones that finish themselves.
  // `s` is what has happened since the step began: metres walked, radians turned, whether the visitor sat down.
  var STEPS = [
    { id: 'look', title: 'Look around',
      text: touch ? 'Drag a finger across the right side of the screen to look around.' : 'Click the room, then move the mouse to look around. Esc lets the mouse go again.',
      done: function (s) { return s.turned > 0.9; } },
    { id: 'walk', title: 'Walk',
      text: touch ? 'Put a thumb on the left side of the screen and push: a stick appears under it. Push further to go faster.' : 'Walk with W A S D or the arrow keys. Hold Shift to run.',
      done: function (s) { return s.walked > 3; } },
    { id: 'sit', title: 'Sit down and play',
      text: touch ? 'Walk up to any table or fruit machine. When its name appears at the bottom, tap it to sit down.' : 'Walk up to any table or fruit machine. When its name appears, press E to sit down.',
      done: function (s) { return s.sat; } },
    { id: 'chips', title: 'Your chips',
      text: 'Your LAYR balance is at the top. It is play money on testnet: nothing here costs or pays real money. Press the balance for more chips.' },
    { id: 'menu', title: 'Everything else',
      text: (touch ? 'Menu, top right, has the rest' : 'Menu, top right (or key M), has the rest') + ': places to go, your character, sound and help. Room shows who is here, and Chat talks to them. Have fun.' }
  ];

  var CSS = '#pxTour{position:fixed;left:24px;bottom:24px;z-index:44;width:min(330px,calc(100vw - 20px));box-sizing:border-box;padding:13px 15px 11px;background:linear-gradient(135deg,rgba(12,22,34,.97),rgba(7,13,21,.97));border:1px solid rgba(227,184,74,.5);border-radius:6px;box-shadow:0 14px 50px #000a;font:13px/1.5 Arial,Helvetica,sans-serif;color:#dfe6ee}' +
    '#pxTour[hidden]{display:none}' +
    '#pxTour .k{display:flex;align-items:center;gap:8px;margin:0 0 5px;font:700 9px Arial,sans-serif;letter-spacing:.2em;color:#e3b84a;text-transform:uppercase}' +
    '#pxTour .dots{display:flex;gap:4px;margin-left:auto}' +
    '#pxTour .dots i{width:14px;height:3px;border-radius:2px;background:#ffffff26}' +
    '#pxTour .dots i.on{background:#e3b84a}' +
    '#pxTour h4{margin:0 0 3px;font:400 19px/1.2 Georgia,serif;color:#f3e7d1}' +
    '#pxTour h4 .ok{color:#4ed5bd;font:700 14px Arial,sans-serif;margin-left:6px}' +
    '#pxTour p{margin:0;color:#c6d0dc}' +
    '#pxTour .row{display:flex;align-items:center;gap:8px;margin-top:10px}' +
    '#pxTour button{font:inherit;cursor:pointer;min-height:36px;padding:0 12px;border-radius:4px}' +
    '#pxTour .leave{background:none;border:1px solid #ffffff2e;color:#aab4c2;font-size:12px}' +
    '#pxTour .next{margin-left:auto;background:rgba(227,184,74,.2);border:1px solid #e3b84a;color:#f6ead0;font-weight:700}' +
    '#pxTour .keys{margin:7px 0 0;font-size:10px;letter-spacing:.04em;color:#7f8c9c}' +
    '#pxTour button:focus-visible{outline:2px solid #9fe3d5;outline-offset:2px}' +
    // at a table or a machine the bottom of the screen belongs to the game: the card moves to the top left, under the logo
    'body.playing #pxTour,body.machine-connected #pxTour{bottom:auto;top:max(78px,calc(env(safe-area-inset-top) + 68px))}' +
    'body.playing #pxTour .keys,body.machine-connected #pxTour .keys{display:none}' +
    'body.layr-cashier-open #pxTour,body.px-character-open #pxTour{display:none}' +
    // phones: under the top bar, clear of the walking stick and the "sit" button at the bottom
    '@media (max-width:620px){#pxTour{left:10px;right:10px;bottom:auto;top:max(104px,calc(env(safe-area-inset-top) + 96px));width:auto;padding:10px 12px 9px;font-size:12.5px}#pxTour h4{font-size:17px}#pxTour .keys{display:none}' +
    'body.playing #pxTour,body.machine-connected #pxTour{top:max(104px,calc(env(safe-area-inset-top) + 96px))}' +
    // the card sits where the tournament and jackpot pills are: they step aside for the minute it is there
    'body.px-tour #pxEvents{display:none}}';

  var card = null, at = -1, since = null, timer = 0, flash = 0, ending = 0;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function build() {
    if (card) return;
    var st = el('style'); st.id = 'pxTourStyle'; st.textContent = CSS; document.head.appendChild(st);
    card = el('aside'); card.id = 'pxTour'; card.hidden = true; card.setAttribute('aria-label', 'A short tour of the casino'); card.setAttribute('aria-live', 'polite');
    document.body.appendChild(card);
  }
  function paint(done) {
    if (!card || at < 0) return;
    var s = STEPS[at], k = el('div', 'k'), dots = el('span', 'dots'), h = el('h4', null, s.title), row = el('div', 'row');
    k.append(document.createTextNode('Tour · ' + (at + 1) + ' of ' + STEPS.length));
    STEPS.forEach(function (_, i) { dots.append(el('i', i <= at ? 'on' : '')); }); k.append(dots);
    if (done) h.append(el('span', 'ok', '✓ Done'));
    var leaveBtn = el('button', 'leave', 'Leave the tour'), nextBtn = el('button', 'next', at === STEPS.length - 1 ? 'Finish' : s.done ? 'Skip this step' : 'Next');
    leaveBtn.type = nextBtn.type = 'button'; leaveBtn.onclick = function () { leave(); }; nextBtn.onclick = function () { next(); };
    if (at < STEPS.length - 1) row.append(leaveBtn);
    row.append(nextBtn);
    var parts = [k, h, el('p', null, s.text), row];
    if (!touch) parts.push(el('p', 'keys', at === STEPS.length - 1 ? 'N finish' : 'N next · X leave the tour'));
    card.replaceChildren.apply(card, parts);
  }
  function show(i) {
    clearTimeout(flash); at = i; var v = view(), p = v && v.player;
    since = { walked: 0, turned: 0, sat: false, x: p ? p.x : 0, z: p ? p.z : 0, yaw: p ? p.yaw : 0, wasSeated: seated() };
    card.hidden = false; document.body.classList.add('px-tour'); paint(false);
  }
  function tick() {
    if (at < 0 || !since) return;
    var v = view(), p = v && v.player, s = STEPS[at]; if (!p) return;
    var d = Math.hypot(p.x - since.x, p.z - since.z); if (d < 3) since.walked += d;      // a jump (taken to a table, or stood somewhere) is not walking
    since.turned += Math.abs(Math.atan2(Math.sin(p.yaw - since.yaw), Math.cos(p.yaw - since.yaw)));
    since.x = p.x; since.z = p.z; since.yaw = p.yaw;
    var now = seated(); if (now && !since.wasSeated) since.sat = true; since.wasSeated = now;
    if (s.done && !flash && s.done(since)) { paint(true); flash = setTimeout(function () { flash = 0; advance(); }, 1100); }
  }
  function advance() { if (at < 0) return; if (at >= STEPS.length - 1) return finish('done'); show(at + 1); }
  function finish(how) {
    clearInterval(timer); clearTimeout(flash); timer = flash = 0; at = -1; since = null; store.set(how);
    if (!card) return;
    // one last line, so leaving does not feel like losing it
    var k = el('div', 'k', how === 'done' ? 'Tour · finished' : 'Tour · left');
    card.replaceChildren(k, el('p', null, how === 'done' ? 'That is the room. Menu, Help has this tour again if you want it.' : 'No problem. It is in Menu, Help, “Show me around” if you want it later.'));
    clearTimeout(ending); ending = setTimeout(function () { if (at < 0 && card) { card.hidden = true; document.body.classList.remove('px-tour'); } }, how === 'done' ? 3200 : 2600);
  }
  function start(force) {
    if (at >= 0) return true;
    if (!force && (store.get() || param === '0')) return false;
    build(); clearTimeout(ending);
    var v = view();
    // Somebody who starts it from the menu while seated has plainly found their way about: begin where it is still news.
    show(force && seated() ? 3 : 0);
    clearInterval(timer); timer = setInterval(tick, 200);
    return !!v;
  }
  function next() { if (at < 0) return; clearTimeout(flash); flash = 0; advance(); }
  function leave() { if (at < 0) return; finish('left'); }

  // N and X, for a visitor whose mouse is held by the room (nothing can be clicked then). Never while typing, in a dialog or in a game.
  window.addEventListener('keydown', function (e) {
    if (at < 0 || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target, typing = t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || '') || t.isContentEditable);
    var cl = document.body.classList;
    // at a table or a machine N and X belong to the game (and the mouse is free there, so the card's buttons can be pressed)
    if (typing || cl.contains('playing') || cl.contains('px-character-open') || cl.contains('machine-connected') || cl.contains('layr-cashier-open')) return;
    if (window.PXHud && window.PXHud.isOpen) return;
    if (e.code === 'KeyN') { e.preventDefault(); next(); } else if (e.code === 'KeyX') { e.preventDefault(); leave(); }
  });

  // The first visit: wait until the visitor is actually walking in the room (the welcome card gone, no invite waiting), then begin.
  if (param === '1' || (!store.get() && param !== '0')) {
    var tries = 0, wait = setInterval(function () {
      var v = view(), intro = document.getElementById('intro');
      if (++tries > 3600 || at >= 0 || (param !== '1' && store.get())) { clearInterval(wait); return; }       // half an hour on the welcome card: leave it
      if (!v || !v.walking || (intro && intro.classList.contains('on')) || document.getElementById('pxInvite') || document.body.classList.contains('px-character-open')) return;
      clearInterval(wait); setTimeout(function () { start(param === '1'); }, 900);
    }, 500);
  }

  window.PXTour = { start: start, leave: leave, next: next, get active() { return at >= 0; }, get step() { return at >= 0 ? STEPS[at].id : null; }, steps: STEPS.map(function (s) { return s.id; }) };
})();
