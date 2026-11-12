/* ParallaX Casino · ONE BAR, ONE MENU  (docs/plans/CASINO-OVERHAUL-PLAN.md, "Streamlined and organised")
 *
 * Before this file the casino had about twenty buttons in two bars (the top-right tools and the bottom-right quick links), which on a
 * phone ran into the logo, the balance and the jackpot. Now the top bar holds only what is needed all the time:
 *
 *     [ back to the floor ]  [ your LAYR balance ]  [ Room · who is here ]  [ Chat ]  [ Explore / Grand hall ]  [ Menu ]
 *
 * and everything else is one Menu, in four groups: Go to, You, View and sound, Help.
 *
 * NOTHING IS REMOVED AND NOTHING IS REWIRED. Every original button stays in the page with its id, its handler, its keyboard
 * shortcut and whatever the page writes on it; the ones that left the bar are kept in a hidden holder (#pxMenuStore), and each
 * menu entry simply presses its original. So the page's own code, the room client and the tests go on finding the same buttons.
 *
 *   /casino/?hud=classic   leaves the page exactly as it was (the two bars), should this ever need switching off in a hurry.
 *
 * The balance is now a button too: it opens the LAYR exchange, and says "Get chips" while the balance is empty.
 * M opens the menu from the keyboard (the way to it while the mouse is held for looking around); Escape and the arrow keys work in it.
 */
(function () {
  'use strict';
  try { if (new URLSearchParams(location.search).get('hud') === 'classic') return; } catch (e) { }
  var $ = function (id) { return document.getElementById(id); };
  if (!$('tools') || !$('quickNav')) return;

  // What goes in the menu: [original button id, name, a line about it, 'go' closes the menu / 'set' keeps it open]
  var GROUPS = [
    ['Go to', [
      ['viewHall', 'Grand hall', 'The whole room, from the entrance', 'go'],
      ['viewLounge', 'The lounge', 'Sofas, chess tables and the house screen', 'go'],
      ['viewSalon', 'Private salon', 'Player against player · needs a BNS name', 'go'],
      ['barButton', 'The Afterglow bar', 'Cocktails and bites · key B', 'go'],
      ['machinesButton', 'Fruit machines', 'Choose a machine to play', 'go'],
      ['layrDispenserButton', 'Get LAYR', 'The exchange: chips for testnet STX', 'go'],
      ['scbtn', 'Strata Club tables', 'Hold’em and Liar’s Dice with testnet rules', 'go']
    ]],
    ['You', [
      ['@character', 'Your character', 'Human figure or cube, and how it looks', 'go'],
      ['chipsButton', 'LAYR house chips', 'What the chips are worth', 'go']
    ]],
    ['View and sound', [
      ['viewbtn', 'Camera', 'Behind you or through your eyes · key V', 'set'],
      ['music', 'Music', 'The lounge band', 'set'],
      ['mute', 'Sound', 'Everything you hear', 'set'],
      ['ambienceButton', 'Room ambience', 'Lighting, reflections and mood', 'go']
    ]],
    ['Help', [
      ['casinoGuideButton', 'Welcome guide', 'What there is to do, and where', 'go'],
      ['helpButton', 'Controls and help', 'Walking, sitting, chat, chips', 'go']
    ]]
  ];

  var CSS =
    // the bars that are now in the menu
    'body.pxhud #quickNav,body.pxhud #venueInfo,body.pxhud #casinoBuild,#pxMenuStore{display:none!important}' +
    // the top bar: fewer, calmer pieces
    'body.pxhud #tools{gap:8px;align-items:stretch}' +
    'body.pxhud #tools .rt{gap:6px;align-items:stretch}' +
    'body.pxhud #tools .rt button,body.pxhud #tools #back{min-height:44px;padding:0 14px;display:inline-flex;align-items:center;white-space:nowrap;font-size:12px;letter-spacing:.02em}' +
    'body.pxhud #tools .rt button[hidden],body.pxhud #tools #back[hidden]{display:none}' +
    'body.pxhud #tools #pxroom{align-items:stretch;gap:6px}' +
    '#pxMenuBtn{gap:7px}' +
    // "back to the floor" only means something at a table or a machine
    'body.pxhud:not(.playing) #tools #back{display:none}' +
    'body.pxhud #bankpill{min-width:0;min-height:44px;padding:5px 14px 5px 15px;display:flex;flex-direction:column;justify-content:center;cursor:pointer;position:relative;text-align:left;box-sizing:border-box}' +
    'body.pxhud #bankpill span{margin:0 0 1px;font-size:8px;letter-spacing:.2em;white-space:nowrap}' +
    'body.pxhud #bankpill b{font-size:15px;white-space:nowrap}' +
    'body.pxhud #bankpill em{display:none}' +
    // tonight's running total takes the label's place while there is one to show
    'body.pxhud #bankpill em.up,body.pxhud #bankpill em.down{display:block;order:-1;font-size:9px;line-height:1.2;margin:0 0 1px;letter-spacing:.04em;white-space:nowrap}' +
    'body.pxhud #bankpill:has(em.up) span,body.pxhud #bankpill:has(em.down) span{display:none}' +
    'body.pxhud #bankpill:hover,body.pxhud #bankpill:focus-visible{border-color:#e3b84a;outline:none}' +
    'body.pxhud #bankpill:focus-visible{box-shadow:0 0 0 2px #9fe3d5}' +
    'body.pxhud #bankpill[data-empty="1"]{border-color:#e3b84a;animation:pxhudPulse 2.4s ease-in-out infinite}' +
    'body.pxhud #bankpill[data-empty="1"] b::after{content:"  \\00b7  Get chips";color:#ffe08a;font-size:12px;font-weight:700;letter-spacing:.02em}' +
    '@keyframes pxhudPulse{50%{box-shadow:0 0 0 4px rgba(227,184,74,.22)}}' +
    '#pxMenuBtn .ic{font-size:15px;line-height:1}' +
    'body.pxhud:not(.machine-connected) #pxEvents{top:max(78px,calc(env(safe-area-inset-top) + 68px))}' +
    // the menu
    '#pxMenu{position:fixed;inset:0;z-index:45;font:13px/1.45 Arial,Helvetica,sans-serif;color:#dfe6ee}' +
    '#pxMenu[hidden]{display:none}' +
    '#pxMenu .veil{position:absolute;inset:0;background:rgba(3,7,12,.28)}' +
    '#pxMenu .sheet{position:absolute;top:max(76px,calc(env(safe-area-inset-top) + 66px));right:30px;width:344px;max-height:calc(100dvh - 100px);overflow:auto;overscroll-behavior:contain;padding:8px 10px 12px;background:linear-gradient(135deg,rgba(12,22,34,.985),rgba(7,13,21,.985));border:1px solid rgba(227,184,74,.4);border-radius:6px;box-shadow:0 18px 70px #000a}' +
    '#pxMenu h3{margin:12px 8px 5px;font:700 9px Arial,sans-serif;letter-spacing:.2em;color:#e3b84a;text-transform:uppercase}' +
    '#pxMenu .it{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;column-gap:10px;width:100%;min-height:46px;padding:7px 10px;margin:0;background:none;border:0;border-radius:4px;color:inherit;font:inherit;text-align:left;cursor:pointer}' +
    '#pxMenu .it:hover{background:rgba(227,184,74,.1)}' +
    '#pxMenu .it:focus-visible{outline:2px solid #9fe3d5;outline-offset:-2px}' +
    '#pxMenu .it b{display:block;font-weight:600;font-size:13px;color:#f3e7d1}' +
    '#pxMenu .it small{display:block;font-size:11px;color:#8997a9;line-height:1.3}' +
    '#pxMenu .it .st{font-size:11px;color:#e6d3ac;border:1px solid rgba(227,184,74,.38);border-radius:12px;padding:3px 9px;white-space:nowrap}' +
    '#pxMenu .it .go{color:#7f8c9c;font-size:15px}' +
    '#pxMenu .it[hidden]{display:none}' +
    '#pxMenu .ft{margin:12px 8px 0;padding-top:10px;border-top:1px solid #ffffff14;font-size:10.5px;line-height:1.55;color:#7f8c9c}' +
    '#pxMenu .ft b{color:#e3b84a;font-weight:700;letter-spacing:.08em}' +
    // medium screens
    '@media (max-width:1100px){body.pxhud #tools .rt button,body.pxhud #tools #back{padding:0 11px}#pxMenu .sheet{right:18px}}' +
    // phones: the bar sits under the logo; the menu comes up from the bottom, where a thumb is
    '@media (max-width:620px){' +
    'body.pxhud #tools{top:max(52px,calc(env(safe-area-inset-top) + 44px));left:10px;right:10px;gap:6px;justify-content:flex-start}' +
    'body.pxhud #tools #bankpill{order:0;flex:0 0 auto;padding:4px 10px}' +
    // on a phone the back button is its arrow alone
    'body.pxhud #tools #back{order:1;width:44px;padding:0;font-size:0;justify-content:center}' +
    'body.pxhud #tools #back::before{content:"\\2190";font-size:17px}' +
    'body.pxhud #tools .rt{order:2;margin-left:auto;gap:5px}' +
    'body.pxhud #tools #pxroom{gap:5px}' +
    'body.pxhud #tools .rt button{width:auto;min-width:44px;padding:0 9px;font-size:11px;justify-content:center;overflow:visible}' +
    'body.pxhud #bankpill span{display:none}body.pxhud #bankpill b{font-size:13px}' +
    'body.pxhud #bankpill[data-empty="1"] b::after{font-size:11px}' +
    '#pxMenuBtn .tx{display:none}' +
    'body.pxhud:not(.machine-connected) #pxEvents{top:max(104px,calc(env(safe-area-inset-top) + 96px))}' +
    'body.pxhud #intro{max-height:calc(100dvh - 152px)}' +
    'body.pxhud #pxroom-btn .n{margin-left:3px}' +
    '#pxMenu .veil{background:rgba(3,7,12,.5)}' +
    '#pxMenu .sheet{top:auto;right:0;left:0;bottom:0;width:auto;max-height:min(78dvh,calc(100dvh - 70px));border-radius:12px 12px 0 0;border-width:1px 0 0;padding:6px 8px calc(12px + env(safe-area-inset-bottom))}' +
    '#pxMenu .sheet::before{content:"";display:block;width:38px;height:4px;border-radius:2px;background:#ffffff33;margin:4px auto 2px}' +
    '}' +
    // at a table or a machine the page hides its own chrome; the menu follows
    'body.machine-connected #pxMenu,body.layr-cashier-open #pxMenu{display:none!important}' +
    '@media (prefers-reduced-motion:reduce){body.pxhud #bankpill[data-empty="1"]{animation:none}}';

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  var style = el('style'); style.id = 'pxHudStyle'; style.textContent = CSS; document.head.appendChild(style);
  document.body.classList.add('pxhud');

  // the originals that leave the bars: kept, hidden, still the real controls
  var store = el('div'); store.id = 'pxMenuStore'; store.setAttribute('aria-hidden', 'true'); document.body.appendChild(store);
  var menu = el('div'); menu.id = 'pxMenu'; menu.hidden = true;
  var veil = el('div', 'veil'), sheet = el('div', 'sheet'); sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'Casino menu');
  menu.append(veil, sheet); document.body.appendChild(menu);
  var items = [];
  GROUPS.forEach(function (g) {
    var made = [];
    g[1].forEach(function (d) {
      var orig = d[0][0] === '@' ? null : $(d[0]);
      if (d[0][0] !== '@' && !orig) return;
      if (orig) store.appendChild(orig);
      var b = el('button', 'it'); b.type = 'button'; b.dataset.pxm = d[0];
      var t = el('span'); t.append(el('b', null, d[1]), el('small', null, d[2]));
      var side = d[3] === 'set' ? el('span', 'st') : el('span', 'go', '›');
      b.append(t, side);
      b.onclick = function () {
        if (d[0] === '@character') { close(); if (window.PXCharacter) window.PXCharacter.open(); return; }
        if (d[3] === 'go') close();
        orig.click();
        setTimeout(refresh, 0);
      };
      items.push({ d: d, orig: orig, b: b, side: side }); made.push(b);
    });
    if (made.length) { sheet.append(el('h3', null, g[0])); made.forEach(function (b) { sheet.append(b); }); }
  });
  var foot = el('div', 'ft'), info = $('venueInfo'), build = $('casinoBuild');
  foot.append(el('b', null, 'TESTNET · PLAY MONEY'), document.createTextNode(' — nothing here costs or pays real money. One LAYR balance for every table and machine' +
    (info && /saved in this browser/.test(info.textContent) ? ', saved in this browser' : '') + '.'));
  var buildLine = el('div'); foot.append(buildLine);
  sheet.append(foot);

  // what each setting shows beside its name: the page writes the state on the original button
  var STATE = {
    music: function (o) { return parseFloat(o.style.opacity || '1') < 0.9 ? 'Off' : 'On'; },
    mute: function (o) { return /🔇/.test(o.textContent) ? 'Off' : 'On'; },
    viewbtn: function (o) { var t = (o.getAttribute('aria-label') || o.title || '').toLowerCase(), v = window.__casinoView && window.__casinoView.mode; return v === 'behind' ? 'Behind you' : v === 'first' ? 'Your eyes' : /first/.test(t) && !/behind/.test(t) ? 'Your eyes' : 'Switch'; }
  };
  function refresh() {
    buildLine.textContent = build && build.textContent.trim() ? 'Build ' + build.textContent.trim() : '';
    items.forEach(function (it) {
      if (it.orig) it.b.hidden = !!it.orig.hidden || it.orig.style.display === 'none';
      if (it.d[0] === '@character') it.b.hidden = !window.PXCharacter;
      if (STATE[it.d[0]]) { try { it.side.textContent = STATE[it.d[0]](it.orig); } catch (e) { it.side.textContent = ''; } }
    });
  }

  // the Menu button, last in the bar (the room client puts Room and Chat first)
  var rt = document.querySelector('#tools .rt');
  var mb = el('button'); mb.id = 'pxMenuBtn'; mb.type = 'button'; mb.setAttribute('aria-haspopup', 'dialog'); mb.setAttribute('aria-expanded', 'false'); mb.setAttribute('aria-label', 'Menu');
  mb.append(el('span', 'ic', '☰'), el('span', 'tx', 'Menu')); mb.title = 'Menu (M)';
  var hint = $('hint'); if (hint && !/M menu/.test(hint.textContent)) hint.textContent += ' · M menu';
  rt.appendChild(mb);
  var lastFocus = null;
  function open() {
    if (!menu.hidden) return;
    try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) { }
    refresh(); menu.hidden = false; mb.setAttribute('aria-expanded', 'true'); lastFocus = document.activeElement;
    var first = sheet.querySelector('.it:not([hidden])'); if (first) try { first.focus({ preventScroll: true }); } catch (e) { }
  }
  function close() {
    if (menu.hidden) return;
    menu.hidden = true; mb.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) try { lastFocus.focus({ preventScroll: true }); } catch (e) { }
  }
  mb.onclick = function (e) { e.stopPropagation(); if (menu.hidden) open(); else close(); };
  veil.addEventListener('pointerdown', close);
  // Escape closes the menu before the page's own Escape (stand up, leave a table) sees it; the casino's keys do nothing behind an open menu
  window.addEventListener('keydown', function (e) {
    if (menu.hidden) {
      // M opens the menu: the one way to it while the mouse is held for looking around (it lets the mouse go, too)
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '') || (e.target && e.target.isContentEditable);
      if (e.code === 'KeyM' && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey && !typing && !document.body.classList.contains('px-character-open') && !document.body.classList.contains('machine-connected')) { e.stopImmediatePropagation(); e.preventDefault(); open(); }
      return;
    }
    if (e.key === 'Escape') { e.stopImmediatePropagation(); e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      var list = [].slice.call(sheet.querySelectorAll('.it:not([hidden])')), i = list.indexOf(document.activeElement);
      var next = list[(i + (e.key === 'ArrowDown' ? 1 : list.length - 1)) % list.length]; if (next) next.focus();
      e.stopImmediatePropagation(); e.preventDefault(); return;
    }
    if (e.key !== 'Tab' && e.key !== 'Enter' && e.key !== ' ') e.stopImmediatePropagation();
  }, true);

  // the balance is a button: it opens the exchange, and asks to be pressed while it is empty
  var pill = $('bankpill'), bank = $('bank'), get = $('layrDispenserButton');
  if (pill && bank && get) {
    pill.setAttribute('role', 'button'); pill.tabIndex = 0; pill.title = 'Your LAYR chips (testnet play money). Press for the exchange.';
    var go = function () { close(); get.click(); };
    pill.addEventListener('click', go);
    pill.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    var mark = function () {
      var empty = /^\s*0(\.0+)?\s*LAYR/i.test(bank.textContent) ? '1' : '0';
      if (pill.dataset.empty !== empty) pill.dataset.empty = empty;
      pill.setAttribute('aria-label', 'LAYR balance: ' + bank.textContent.trim() + (empty === '1' ? '. Get chips at the exchange.' : '. Open the exchange.'));
    };
    mark(); try { new MutationObserver(mark).observe(bank, { childList: true, characterData: true, subtree: true }); } catch (e) { }
  }

  window.PXHud = { open: open, close: close, refresh: refresh, get isOpen() { return !menu.hidden; } };
})();
