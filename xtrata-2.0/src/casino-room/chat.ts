/**
 * The casino's live chat: room chat and direct messages, shown as one plain column of text floating over the casino (no box).
 * Nothing fades. With the chat closed the newest few lines stay on screen; a "Chat" button opens a typing line and the whole of this
 * session's chat, which scrolls. The session's chat is kept in this tab only (sessionStorage, so a reload keeps it) and is cleared when
 * the player leaves the room, when their room session ends, or when the tab closes. Tapping a name (in the column or in "Here now")
 * offers Message, Block and Report. A direct message goes to one person and is tinted; it is not secret (it passes through the room
 * service like everything else, and the guide says so).
 *
 * It rides on the room connection that main.ts already owns (it neither opens a socket nor signs anyone in) and never touches money or
 * game state. Everything shown is put on the page as text, never as markup. The room enforces the real rules (signed in to speak, 280
 * characters, no links, one message every two seconds, two-way blocking); this file only makes them easy to live with.
 */
import {
  BLOCKS_KEY, ChatLog, MAX_BLOCKS, MAX_CHARS, REPORT_REASONS, Roster, SESSION_PREFIX, UI_KEY, checkSend, errorText, parseBlocks, parsePrefs,
  type Line, type ReportReason, type UiPrefs, type Who
} from './chat-core';

export interface ChatDeps {
  send(msg: unknown): boolean;
  /** The visitor's own address when signed in to the room, otherwise null (a guest). */
  me(): string | null;
  connected(): boolean;
  labelFor(address: string): string;
  /** A guest pressed Chat: bring up the Room panel so they can join. */
  joinPrompt(): void;
}

const CSS = `
#pxchat{position:fixed;z-index:11;top:110px;left:14px;width:min(340px,calc(100vw - 28px));box-sizing:border-box;display:flex;flex-direction:column;gap:6px;pointer-events:none;color:var(--ink,#f6ead0);font-size:13px;line-height:1.35}
#pxchat.left{align-items:flex-start}
#pxchat.right{align-items:flex-end;text-align:right}
#pxchat[hidden]{display:none}
#pxchat.over{padding:8px;border-radius:10px;background:rgba(12,9,14,.94);border:1px solid rgba(227,184,74,.45);box-shadow:0 8px 24px rgba(0,0,0,.6)}
#pxchat-lines{display:flex;flex-direction:column;justify-content:flex-end;gap:3px;max-width:100%;min-height:0;flex:0 1 auto;overflow:hidden}
#pxchat.right #pxchat-lines{align-items:flex-end}
#pxchat-lines.scroll{pointer-events:auto;overflow-y:auto;justify-content:flex-start;max-height:min(46vh,440px);overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(227,184,74,.5) transparent;padding-right:6px;box-sizing:border-box;width:100%}
#pxchat-lines.scroll::-webkit-scrollbar{width:6px}
#pxchat-lines.scroll::-webkit-scrollbar-thumb{background:rgba(227,184,74,.5);border-radius:3px}
#pxchat .newer{all:unset;cursor:pointer;pointer-events:auto;align-self:center;font-size:12px;padding:4px 10px;border-radius:12px;background:rgba(227,184,74,.92);color:#1a1208;font-weight:700}
#pxchat .newer[hidden]{display:none}
#pxchat .ln{overflow-wrap:anywhere;text-shadow:0 1px 2px #000,0 0 7px rgba(0,0,0,.9),0 0 14px rgba(0,0,0,.6)}
#pxchat .ln .tx{color:#fff}
#pxchat .ln.mine .nm{color:#9fd7b0}
#pxchat .ln.dm .tx{color:#f1d2ff}
#pxchat .ln.dm .tag{color:#d9a8f5;font-size:11px;font-weight:700;letter-spacing:.04em;margin-right:2px}
#pxchat .ln.note{font-style:italic;color:var(--dim,#c9b894)}
#pxchat .nm{all:unset;cursor:pointer;pointer-events:auto;color:var(--gold,#e3b84a);font-weight:700;margin-right:2px}
#pxchat .nm:hover,#pxchat .nm:focus-visible{text-decoration:underline}
#pxchat span.nm{cursor:default;pointer-events:none}
#pxchat .bar{display:flex;flex-wrap:wrap;gap:6px;pointer-events:auto;max-width:100%}
#pxchat.right .bar{justify-content:flex-end}
#pxchat .bar[hidden],#pxchat form[hidden],#pxchat .panel[hidden],#pxchat .to[hidden]{display:none}
#pxchat button.sm{font:inherit;font-size:12px;cursor:pointer;padding:5px 9px;border-radius:7px;background:rgba(12,9,14,.82);color:var(--ink,#f6ead0);border:1px solid rgba(227,184,74,.55)}
#pxchat button.sm:hover:not(:disabled){background:rgba(227,184,74,.22)}
#pxchat button.sm:disabled{opacity:.5;cursor:default}
#pxchat button.sm.danger{border-color:#ff8a8a;color:#ffb3b3}
#pxchat button.sm.on{background:rgba(227,184,74,.28)}
#pxchat form{display:flex;flex-wrap:wrap;gap:6px;pointer-events:auto;width:100%}
#pxchat .to{all:unset;cursor:pointer;flex:0 0 auto;font-size:12px;padding:6px 9px;border-radius:8px;background:rgba(90,40,110,.9);color:#f1d2ff;border:1px solid #c58ee6}
#pxchat .to:hover{background:rgba(120,55,145,.95)}
#pxchat input{flex:1 1 150px;min-width:0;font:inherit;font-size:16px;padding:7px 10px;border-radius:8px;background:rgba(12,9,14,.88);color:#fff;border:1px solid var(--gold,#e3b84a);outline:none}
#pxchat input.dm{border-color:#c58ee6}
#pxchat input:focus{box-shadow:0 0 0 2px rgba(227,184,74,.35)}
#pxchat .panel{pointer-events:auto;padding:8px 10px;border-radius:10px;background:rgba(12,9,14,.92);border:1px solid rgba(227,184,74,.55);max-width:100%;box-sizing:border-box;text-align:left;max-height:38vh;overflow:auto}
#pxchat .panel p{margin:0 0 6px;color:var(--dim,#c9b894);font-size:12px}
#pxchat .panel p.who{color:var(--ink,#f6ead0);font-weight:700;font-size:13px}
#pxchat .panel .row{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:6px}
#pxchat .panel .row:last-child{margin-bottom:0}
#pxchat .panel .row > span{flex:1 1 auto;min-width:0;overflow-wrap:anywhere}
#pxchat-btn .dot{display:inline-block;min-width:16px;padding:0 4px;margin-left:6px;border-radius:9px;background:#e3b84a;color:#1a1208;font-size:11px;font-weight:700;text-align:center}
#pxchat-btn .dot.dm{background:#c58ee6}
@media (max-width:700px){#pxchat{font-size:12px}}
`;

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;            // always text, never markup: a message must not be able to run anything
  if (cls) e.className = cls;
  return e;
};
const smallButton = (text: string, onclick: () => void, cls = 'sm') => {
  const b = el('button', text, cls); b.type = 'button'; b.onclick = onclick; return b;
};

export function createChat(deps: ChatDeps) {
  const log = new ChatLog();
  const roster = new Roster();
  let prefs: UiPrefs = { hidden: false, side: 'left' };
  let blocks: string[] = [];
  try { prefs = parsePrefs(window.localStorage.getItem(UI_KEY)); blocks = parseBlocks(window.localStorage.getItem(BLOCKS_KEY)); } catch { /* private window: defaults */ }
  log.setBlocked(blocks);

  let typing = false;
  let target: Who | null = null;            // who the typing line is talking to; null is the whole room
  let menuFor: Who | null = null;           // the person whose Message / Block / Report menu is open
  let reporting = false;
  let panel: '' | 'people' | 'blocked' = '';
  let unread = 0, unreadDm = 0;
  let lastSentAt = 0;
  let pending: { text: string; to: Who | null } | null = null;    // what was just sent, handed back if the room refuses it
  let awaitingAt = 0;                      // when chat last sent the room something it could refuse (say, dm, report, blocks)
  let stick = true;                         // the open chat follows new lines unless the player has scrolled up to read
  let sessionOf: string | null = null;      // whose session's chat this tab is keeping

  const savePrefs = () => { try { window.localStorage.setItem(UI_KEY, JSON.stringify(prefs)); } catch { /* not remembered */ } };
  const saveBlocks = () => { try { window.localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks)); } catch { /* lasts until the page closes */ } };
  const nameOf = (a: string) => deps.labelFor(a);
  const saveSession = () => { if (!sessionOf) return; try { window.sessionStorage.setItem(SESSION_PREFIX + sessionOf, log.dump()); } catch { /* full or blocked: the chat still works, it just will not survive a reload */ } };
  const dropSession = (address: string | null) => { if (!address) return; try { window.sessionStorage.removeItem(SESSION_PREFIX + address); } catch { /* nothing kept */ } };
  /** Start (or pick back up) the chat for this signed-in player; a different player, or nobody, starts from nothing. */
  const useSession = (address: string | null) => {
    if (address === sessionOf) return;
    dropSession(sessionOf);
    log.clear(); nodes.forEach((n) => n.remove()); nodes.clear();
    sessionOf = address;
    if (address) { try { log.load(window.sessionStorage.getItem(SESSION_PREFIX + address)); } catch { /* nothing kept */ } }
    stick = true;
  };
  const isBlocked = (a: string) => blocks.includes(a);

  // ---------------------------------------------------------------- the pieces
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.append(style);

  const root = el('div'); root.id = 'pxchat';
  const lines = el('div'); lines.id = 'pxchat-lines';
  const newer = el('button', 'New messages ↓', 'newer'); newer.type = 'button'; newer.hidden = true;
  lines.setAttribute('role', 'log'); lines.setAttribute('aria-live', 'polite'); lines.setAttribute('aria-label', 'Casino chat');
  const menu = el('div', undefined, 'panel'); menu.id = 'pxchat-menu'; menu.hidden = true;
  const side = el('div', undefined, 'panel'); side.id = 'pxchat-panel'; side.hidden = true;
  const form = el('form'); form.hidden = true;
  const toChip = el('button', undefined, 'to'); toChip.type = 'button'; toChip.hidden = true;
  const input = el('input'); input.type = 'text'; input.autocomplete = 'off'; input.enterKeyHint = 'send'; input.maxLength = MAX_CHARS * 2;
  const sendBtn = el('button', 'Send', 'sm'); sendBtn.type = 'submit';
  form.append(toChip, input, sendBtn);
  const bar = el('div', undefined, 'bar'); bar.hidden = true;
  const peopleBtn = smallButton('Here now', () => togglePanel('people'));
  const hideBtn = smallButton('Hide chat', () => hide());
  const sideBtn = smallButton('', () => { prefs.side = prefs.side === 'left' ? 'right' : 'left'; savePrefs(); renderAll(); });
  const blockedBtn = smallButton('Blocked', () => togglePanel('blocked'));
  peopleBtn.id = 'pxchat-people'; hideBtn.id = 'pxchat-hide'; sideBtn.id = 'pxchat-side'; blockedBtn.id = 'pxchat-blocked';
  bar.append(peopleBtn, hideBtn, sideBtn, blockedBtn);
  root.append(lines, newer, menu, side, form, bar);

  const button = el('button'); button.id = 'pxchat-btn'; button.type = 'button';
  button.setAttribute('aria-controls', 'pxchat');

  // ---------------------------------------------------------------- painting
  const nodes = new Map<number, HTMLElement>();
  const open = () => typing || !!menuFor || !!panel;      // open: the whole session, scrollable; closed: the newest few
  const maxLines = () => (window.matchMedia?.('(max-width:700px)').matches ? 5 : 8);

  const nameButton = (who: Who) => {
    const b = el('button', nameOf(who.a), 'nm'); b.type = 'button';
    b.dataset.a = who.a;
    b.setAttribute('aria-label', `Options for ${nameOf(who.a)}`);
    b.onclick = () => openMenu(who);
    return b;
  };

  const makeLine = (line: Line) => {
    const cls = !line.who ? 'ln note' : `ln${line.mine ? ' mine' : ''}${line.to ? ' dm' : ''}`;
    const row = el('div', undefined, cls);
    if (!line.who) { row.append(el('span', line.text, 'tx')); return row; }
    // Real spaces between the parts, so the line reads (and copies, and is spoken) as "Alice → you hello", not "Alice→ youhello".
    const parts: Node[] = [];
    if (line.to) {
      // "You → Bob text" when you sent it; "Alice → you text" when it came to you
      if (line.mine) parts.push(el('span', 'You', 'nm'), el('span', '→', 'tag'), nameButton(line.to));
      else parts.push(nameButton(line.who), el('span', '→ you', 'tag'));
    } else {
      parts.push(line.mine ? el('span', 'You', 'nm') : nameButton(line.who));
    }
    parts.push(el('span', line.text, 'tx'));
    parts.forEach((n, i) => { if (i) row.append(document.createTextNode(' ')); row.append(n); });
    return row;
  };

  const atBottom = () => lines.scrollTop + lines.clientHeight >= lines.scrollHeight - 8;
  const toBottom = () => { lines.scrollTop = lines.scrollHeight; stick = true; newer.hidden = true; };

  const renderLines = () => {
    const isOpen = open();
    const show = isOpen ? log.all() : log.tail(maxLines());
    const wasScroll = lines.classList.contains('scroll');
    lines.classList.toggle('scroll', isOpen);
    const keep = new Set(show.map((l) => l.id));
    let added = false;
    for (const [id, node] of nodes) if (!keep.has(id)) { node.remove(); nodes.delete(id); }
    let after: Element | null = null;
    for (const line of show) {
      let node = nodes.get(line.id);
      if (!node) { node = makeLine(line); nodes.set(line.id, node); added = true; }
      const want: Element | null = after ? after.nextElementSibling : lines.firstElementChild;
      if (want !== node) lines.insertBefore(node, want);
      after = node;
    }
    if (!isOpen) { newer.hidden = true; stick = true; return; }
    if (!wasScroll || stick) toBottom();              // opening, or following along: show the newest
    else if (added) newer.hidden = false;             // reading back: say there is more below instead of jumping
  };

  const paintButton = () => {
    button.replaceChildren(el('span', '💬', 'ic'), el('span', 'Chat', 'lbl'));   // the icon shows on a phone, where the page's top buttons are icons
    if (prefs.hidden && unread > 0) button.append(el('span', unread > 9 ? '9+' : String(unread), unreadDm ? 'dot dm' : 'dot'));
    button.setAttribute('aria-expanded', String(typing && !prefs.hidden));
    button.setAttribute('aria-label', prefs.hidden && unread
      ? `Chat: ${unread} new${unreadDm ? `, ${unreadDm} sent to you` : ''}`
      : 'Casino chat: type a message');
  };

  const paintForm = () => {
    form.hidden = !typing || prefs.hidden;
    toChip.hidden = !target;
    if (target) {
      toChip.textContent = `To ${nameOf(target.a)} ×`;
      toChip.setAttribute('aria-label', `Writing to ${nameOf(target.a)}. Press to write to the whole room instead.`);
    }
    input.classList.toggle('dm', !!target);
    const ph = target ? `Message ${nameOf(target.a)}` : 'Say something to the room';
    input.placeholder = ph; input.setAttribute('aria-label', ph);
  };

  const paintMenu = () => {
    menu.replaceChildren();
    menu.hidden = !menuFor;
    if (!menuFor) return;
    const who = menuFor;
    const blocked = isBlocked(who.a);
    menu.append(el('p', nameOf(who.a), 'who'));
    const row = el('div', undefined, 'row');
    if (!reporting) {
      const msg = smallButton('Message', () => { closeMenu(); startDm(who); });
      msg.disabled = blocked || !roster.has(who.a);
      if (blocked) menu.append(el('p', 'You have blocked this person. Unblock them to message them.'));
      else if (roster.known && !roster.has(who.a)) menu.append(el('p', 'They have left the room.'));
      row.append(
        msg,
        smallButton(blocked ? 'Unblock' : 'Block', () => { setBlocked(who, !blocked); closeMenu(); }),
        smallButton('Report…', () => { reporting = true; renderAll(); }, 'sm danger')
      );
    } else {
      menu.append(el('p', 'Why? Your report goes to the casino team with the last few things they said to you or the room.'));
      for (const r of REPORT_REASONS) row.append(smallButton(r.label, () => { report(who, r.code); closeMenu(); }));
    }
    row.append(smallButton('Cancel', closeMenu));
    menu.append(row);
  };

  const paintPanel = () => {
    side.replaceChildren();
    side.hidden = !panel;
    if (panel === 'people') {
      const people = roster.others(deps.me());
      if (!roster.known) side.append(el('p', deps.connected() ? 'Asking the room who is here…' : 'Not connected to the room.'));
      else if (!people.length) side.append(el('p', 'Nobody else is signed in right now.'));
      else {
        side.append(el('p', `Signed in now (${people.length}). Tap a name to message, block or report.`));
        for (const p of people) {
          const row = el('div', undefined, 'row');
          const name = el('span'); name.append(nameButton(p));
          if (isBlocked(p.a)) name.append(document.createTextNode(' (blocked)'));
          row.append(name);
          side.append(row);
        }
      }
    } else if (panel === 'blocked') {
      if (!blocks.length) { side.append(el('p', 'You have not blocked anyone.')); return; }
      side.append(el('p', 'Blocked people cannot reach you and you cannot reach them.'));
      for (const a of blocks) {
        const row = el('div', undefined, 'row');
        row.append(el('span', nameOf(a)), smallButton('Unblock', () => { setBlocked({ a }, false); renderAll(); }));
        side.append(row);
      }
    }
  };

  const renderAll = () => {
    root.hidden = prefs.hidden;
    root.classList.remove('left', 'right'); root.classList.add(prefs.side);
    bar.hidden = !typing || prefs.hidden;
    const others = roster.others(deps.me()).length;
    peopleBtn.textContent = roster.known ? `Here now (${others})` : 'Here now';
    peopleBtn.classList.toggle('on', panel === 'people');
    sideBtn.textContent = prefs.side === 'left' ? 'Move right ▸' : '◂ Move left';
    blockedBtn.textContent = blocks.length ? `Blocked (${blocks.length})` : 'Blocked';
    blockedBtn.classList.toggle('on', panel === 'blocked');
    paintButton(); paintForm(); paintMenu(); paintPanel(); renderLines(); place();
  };

  /**
   * Sit just under the page's top button rows, wherever they are (on a phone they take two rows), and keep clear of the welcome
   * panel while it is open: beside it when there is room (a laptop), otherwise squeezed into the space above it (a phone), where
   * the newest lines stay and the oldest are cut off at the top.
   */
  const place = () => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const tools = document.getElementById('tools');
    const top = Math.round(Math.max(70, (tools ? tools.getBoundingClientRect().bottom : 58) + 12));
    let left: number | null = prefs.side === 'left' ? 14 : null;
    let width = Math.min(340, vw - 28);
    let room = vh - top - 12;
    let squeezed = false;
    const intro = document.getElementById('intro');
    const r = intro && intro.getClientRects().length ? intro.getBoundingClientRect() : null;
    if (r && r.width > 0 && r.height > 0 && r.bottom > top) {
      const near = prefs.side === 'left' ? r.left < 14 + width : r.right > vw - 14 - width;
      if (near) {
        if (prefs.side === 'left' && vw - r.right - 30 >= 260) { left = Math.round(r.right + 16); width = Math.min(340, vw - left - 14); }
        else { squeezed = true; room = Math.max(170, Math.round(r.top - top - 8)); }
      }
    }
    root.style.top = `${top}px`;
    root.style.left = left === null ? 'auto' : `${left}px`;
    root.style.right = left === null ? '14px' : '';
    root.style.width = `${width}px`;
    root.style.maxHeight = `${room}px`;
    // Only when it has to sit over the welcome panel (a small phone) does it get a backing, so its text is not lost in the panel's.
    root.classList.toggle('over', squeezed && !root.hidden && (typing || nodes.size > 0));
  };


  // ---------------------------------------------------------------- actions
  const note = (text: string) => { log.add(null, text, false, Date.now()); };

  const freeMouse = () => { try { if (document.pointerLockElement) document.exitPointerLock(); } catch { /* the page frees it when it must */ } };

  const openTyping = () => {
    if (!deps.me()) {            // a guest: say so and bring up the Room panel, where they can join
      if (prefs.hidden) { prefs.hidden = false; savePrefs(); }
      typing = false;
      note('Join the room to chat. Anyone can watch; you need one free signature to speak.');
      renderAll(); deps.joinPrompt();
      return;
    }
    if (prefs.hidden) { prefs.hidden = false; savePrefs(); }
    unread = 0; unreadDm = 0;
    typing = true;
    freeMouse();
    renderAll();
    input.focus();
  };
  const closeTyping = () => { typing = false; menuFor = null; reporting = false; panel = ''; input.blur(); renderAll(); };
  const hide = () => { prefs.hidden = true; savePrefs(); typing = false; menuFor = null; reporting = false; panel = ''; unread = 0; unreadDm = 0; input.blur(); renderAll(); };
  const closeMenu = () => { menuFor = null; reporting = false; renderAll(); };
  function openMenu(who: Who) { menuFor = who; reporting = false; freeMouse(); renderAll(); }
  function togglePanel(which: 'people' | 'blocked') { panel = panel === which ? '' : which; menuFor = null; reporting = false; renderAll(); }
  function startDm(who: Who) {
    if (isBlocked(who.a)) { note(errorText('blocked')); renderAll(); return; }
    target = { a: who.a };
    panel = '';
    openTyping();
  }
  const toRoom = () => { target = null; renderAll(); input.focus(); };

  const sendBlocks = () => { if (deps.me() && deps.send({ t: 'blocks', list: blocks })) awaitingAt = Date.now(); };
  function setBlocked(who: Who, on: boolean) {
    const label = nameOf(who.a);
    if (on) {
      if (blocks.length >= MAX_BLOCKS) { note(errorText('too-many-blocks')); return; }
      if (!blocks.includes(who.a)) blocks.push(who.a);
      log.dropFrom(who.a); saveSession();
      if (target?.a === who.a) target = null;
      note(`You blocked ${label}. Neither of you will see the other's messages.`);
    } else {
      blocks = blocks.filter((a) => a !== who.a);
      note(`You unblocked ${label}.`);
    }
    log.setBlocked(blocks);
    nodes.forEach((n) => n.remove()); nodes.clear();      // the lines on screen are rebuilt without the blocked person
    saveBlocks();
    sendBlocks();
  }
  function report(who: Who, why: ReportReason) {
    if (!deps.me() || !deps.connected()) { note('Not connected to the room, so the report was not sent.'); return; }
    if (deps.send({ t: 'report', who: who.a, why, lines: log.lastFrom(who.a) })) awaitingAt = Date.now();
    note('Sending your report…');
  }

  // ---------------------------------------------------------------- wiring
  button.onclick = () => { if (typing && !prefs.hidden) closeTyping(); else openTyping(); };
  toChip.onclick = toRoom;
  newer.onclick = () => toBottom();
  lines.addEventListener('scroll', () => { stick = atBottom(); if (stick) newer.hidden = true; }, { passive: true });
  // Scrolling the chat must not also zoom or turn the casino behind it.
  lines.addEventListener('wheel', (e) => { if (lines.classList.contains('scroll')) e.stopPropagation(); }, { passive: true });
  lines.addEventListener('touchmove', (e) => { if (lines.classList.contains('scroll')) e.stopPropagation(); }, { passive: true });

  form.onsubmit = (event) => {
    event.preventDefault();
    const now = Date.now();
    const check = checkSend(input.value, { signed: !!deps.me(), connected: deps.connected(), now, lastSentAt });
    const offline = 'Not connected to the room yet. Your message is still in the box.';
    if (!check.ok) { note(check.code === 'offline' ? offline : errorText(check.code)); renderAll(); return; }     // the text stays in the box
    if (target && roster.known && !roster.has(target.a)) { note(errorText('not-here')); renderAll(); return; }
    const msg = target ? { t: 'dm', to: target.a, text: check.text } : { t: 'say', text: check.text };
    if (!deps.send(msg)) { note(offline); renderAll(); return; }
    lastSentAt = now; awaitingAt = now; pending = { text: check.text, to: target };
    input.value = '';
  };
  // Keys typed here belong to the chat, not the game (E, Q, B, the numbers and WASD would otherwise walk or sit the player).
  // keyup is left alone on purpose: if a movement key was already held when the box opened, the game must still see it let go.
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); if (target && !input.value) toRoom(); else closeTyping(); }
  });
  input.addEventListener('keypress', (e) => e.stopPropagation());
  // A tap anywhere outside the chat closes an open menu or list (there is no Escape key on a phone).
  document.addEventListener('pointerdown', (e) => {
    if (!menuFor && !panel) return;
    const t = e.target as Node | null;
    if (t && (root.contains(t) || button.contains(t))) return;
    menuFor = null; reporting = false; panel = ''; renderAll();
  });
  window.addEventListener('resize', place);
  // The welcome panel opens and closes without a resize: move when it does.
  const intro = document.getElementById('intro');
  if (intro && 'MutationObserver' in window) new MutationObserver(() => place()).observe(intro, { attributes: true, attributeFilter: ['class', 'style', 'hidden'] });

  // ---------------------------------------------------------------- what main.ts tells us
  const api = {
    button,
    mount(parent: HTMLElement) { parent.append(root); renderAll(); },
    /**
     * Someone spoke: `say` to the room or `dm` to one person. The room sends our own lines back too (to every tab of ours), so our
     * screen shows exactly what was delivered.
     */
    heard(m: { t?: string; from?: Who; to?: Who; text?: string }) {
      if (!m?.from || typeof m.from.a !== 'string') return;
      const me = deps.me();
      const mine = !!me && m.from.a === me;
      const dm = m.t === 'dm' && m.to && typeof m.to.a === 'string' ? { a: m.to.a } : undefined;
      const line = log.add({ a: m.from.a }, String(m.text ?? '').slice(0, MAX_CHARS * 2), mine, Date.now(), dm);
      if (!line) return;
      saveSession();
      if (mine) { pending = null; stick = true; }
      else if (prefs.hidden) { unread += 1; if (dm) unreadDm += 1; }
      renderAll();
    },
    /**
     * The room refused something. Only a refusal of something chat just sent is chat's business: the room also says "slow down" to
     * the page's own seat updates, and those must not show up as chat notes. Returns whether chat took it.
     * A refused message goes back into the box so nothing typed is lost.
     */
    failed(code: unknown): boolean {
      if (!pending && Date.now() - awaitingAt > 4000) return false;
      if (pending && !input.value) { input.value = pending.text; if (pending.to && code !== 'not-here' && code !== 'no-such-player') target = pending.to; }
      if (code === 'not-here' || code === 'no-such-player') target = null;
      pending = null;
      note(errorText(code));
      renderAll();
      return true;
    },
    reported() { note('Report sent. Thank you.'); renderAll(); },
    /** A fresh connection: the room has forgotten our block list, so hand it over again, and take its list of who is here. */
    room(players: unknown, signedIn: boolean) {
      roster.set(players);
      useSession(signedIn ? deps.me() : null);      // signed out (or the 4 hour session ran out): this session's chat is cleared
      if (signedIn) sendBlocks();
      else { typing = false; target = null; menuFor = null; reporting = false; panel = ''; input.value = ''; pending = null; }
      if (target && !roster.has(target.a)) target = null;
      renderAll();
    },
    joined(who: unknown) { roster.join(who); if (panel === 'people' || menuFor) renderAll(); else peopleBtn.textContent = `Here now (${roster.others(deps.me()).length})`; },
    left(address: unknown) {
      roster.leave(address);
      if (typeof address === 'string' && target?.a === address) { note(`${nameOf(address)} left the room.`); target = null; }
      renderAll();
    },
    /** The player pressed Leave the room: their session's chat is cleared from this tab now. */
    endSession() { useSession(null); typing = false; target = null; menuFor = null; reporting = false; panel = ''; input.value = ''; pending = null; renderAll(); },
    /** The connection dropped: until the room speaks again we do not know who is here. Their chat stays: a reconnect is the same session. */
    disconnected() { roster.forget(); renderAll(); },
    /** Names learned from BNS arrive late; relabel what is already on screen. */
    refreshNames() {
      root.querySelectorAll<HTMLElement>('button.nm[data-a]').forEach((b) => { b.textContent = nameOf(b.dataset.a!); });
      if (target) paintForm();
    },
    isTyping: () => typing,
    debug: () => ({ typing, hidden: prefs.hidden, side: prefs.side, target: target?.a ?? null, blocks: [...blocks], lines: log.size, shown: nodes.size, session: sessionOf, stick, people: roster.others(deps.me()).map((p) => p.a) })
  };
  paintButton();
  return api;
}

export type Chat = ReturnType<typeof createChat>;
