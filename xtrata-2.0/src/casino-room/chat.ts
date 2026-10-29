/**
 * The casino's live chat (phase 1: the public room chat). A "Chat" button opens a typing line; what people say appears as a plain
 * column of text floating over the casino, with no box, and fades away by itself. Tapping a name offers Block and Report.
 *
 * It rides on the room connection that main.ts already owns (it neither opens a socket nor signs anyone in) and never touches money or
 * game state. Everything shown is put on the page as text, never as markup. The room enforces the real rules (signed in to speak, 280
 * characters, no links, one message every two seconds, two-way blocking); this file only makes them easy to live with.
 */
import {
  BLOCKS_KEY, ChatLog, MAX_BLOCKS, MAX_CHARS, REPORT_REASONS, UI_KEY, checkSend, errorText, parseBlocks, parsePrefs,
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
#pxchat{position:fixed;z-index:11;top:110px;width:min(330px,calc(100vw - 28px));display:flex;flex-direction:column;gap:6px;pointer-events:none;color:var(--ink,#f6ead0);font-size:13px;line-height:1.35}
#pxchat.left{left:14px;align-items:flex-start}
#pxchat.right{right:14px;align-items:flex-end;text-align:right}
#pxchat[hidden]{display:none}
#pxchat-lines{display:flex;flex-direction:column;gap:3px;max-width:100%}
#pxchat .ln{transition:opacity .6s linear;overflow-wrap:anywhere;text-shadow:0 1px 2px #000,0 0 7px rgba(0,0,0,.9),0 0 14px rgba(0,0,0,.6)}
#pxchat .ln .tx{color:#fff}
#pxchat .ln.mine .nm{color:#9fd7b0}
#pxchat .ln.note{font-style:italic;color:var(--dim,#c9b894)}
#pxchat .nm{all:unset;cursor:pointer;pointer-events:auto;color:var(--gold,#e3b84a);font-weight:700;margin-right:6px}
#pxchat .nm:hover,#pxchat .nm:focus-visible{text-decoration:underline}
#pxchat span.nm{cursor:default;pointer-events:none}
#pxchat .bar{display:flex;flex-wrap:wrap;gap:6px;pointer-events:auto;max-width:100%}
#pxchat .bar[hidden],#pxchat form[hidden],#pxchat .panel[hidden]{display:none}
#pxchat button.sm{font:inherit;font-size:12px;cursor:pointer;padding:5px 9px;border-radius:7px;background:rgba(12,9,14,.82);color:var(--ink,#f6ead0);border:1px solid rgba(227,184,74,.55)}
#pxchat button.sm:hover{background:rgba(227,184,74,.22)}
#pxchat button.sm.danger{border-color:#ff8a8a;color:#ffb3b3}
#pxchat form{display:flex;gap:6px;pointer-events:auto;width:100%}
#pxchat input{flex:1 1 auto;min-width:0;font:inherit;font-size:16px;padding:7px 10px;border-radius:8px;background:rgba(12,9,14,.88);color:#fff;border:1px solid var(--gold,#e3b84a);outline:none}
#pxchat input:focus{box-shadow:0 0 0 2px rgba(227,184,74,.35)}
#pxchat .panel{pointer-events:auto;padding:8px 10px;border-radius:10px;background:rgba(12,9,14,.92);border:1px solid rgba(227,184,74,.55);max-width:100%;text-align:left}
#pxchat .panel p{margin:0 0 6px;color:var(--dim,#c9b894);font-size:12px}
#pxchat .panel .row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}
#pxchat .panel .row:last-child{margin-bottom:0}
#pxchat-btn .dot{display:inline-block;min-width:16px;padding:0 4px;margin-left:6px;border-radius:9px;background:#e3b84a;color:#1a1208;font-size:11px;font-weight:700;text-align:center}
@media (max-width:700px){#pxchat{font-size:12px;width:min(300px,calc(100vw - 24px))}}
@media (prefers-reduced-motion:reduce){#pxchat .ln{transition:none}}
`;

const HOLD_MS = 14_000, FADE_MS = 4_000;
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, cls?: string) => {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;            // always text, never markup: a message must not be able to run anything
  if (cls) e.className = cls;
  return e;
};

export function createChat(deps: ChatDeps) {
  const log = new ChatLog();
  let prefs: UiPrefs = { hidden: false, side: 'left' };
  let blocks: string[] = [];
  try { prefs = parsePrefs(window.localStorage.getItem(UI_KEY)); blocks = parseBlocks(window.localStorage.getItem(BLOCKS_KEY)); } catch { /* private window: defaults */ }
  log.setBlocked(blocks);

  let typing = false;
  let menuFor: Who | null = null;          // the person whose Block / Report menu is open
  let reporting = false;
  let blockedOpen = false;
  let unread = 0;
  let lastSentAt = 0;
  let pending = '';                         // what was just sent, handed back to the box if the room refuses it
  let timer = 0;

  const savePrefs = () => { try { window.localStorage.setItem(UI_KEY, JSON.stringify(prefs)); } catch { /* not remembered */ } };
  const saveBlocks = () => { try { window.localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks)); } catch { /* lasts until the page closes */ } };

  // ---------------------------------------------------------------- the pieces
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.append(style);

  const root = el('div'); root.id = 'pxchat';
  const lines = el('div'); lines.id = 'pxchat-lines';
  lines.setAttribute('role', 'log'); lines.setAttribute('aria-live', 'polite'); lines.setAttribute('aria-label', 'Casino chat');
  const menu = el('div', undefined, 'panel'); menu.hidden = true;
  const blockedPanel = el('div', undefined, 'panel'); blockedPanel.hidden = true;
  const form = el('form'); form.hidden = true;
  const input = el('input'); input.type = 'text'; input.autocomplete = 'off'; input.enterKeyHint = 'send'; input.maxLength = MAX_CHARS * 2;
  input.setAttribute('aria-label', 'Say something to the room'); input.placeholder = 'Say something to the room';
  const sendBtn = el('button', 'Send', 'sm'); sendBtn.type = 'submit';
  form.append(input, sendBtn);
  const bar = el('div', undefined, 'bar'); bar.hidden = true;
  const hideBtn = el('button', 'Hide chat', 'sm'); hideBtn.type = 'button';
  const sideBtn = el('button', undefined, 'sm'); sideBtn.type = 'button';
  const blockedBtn = el('button', undefined, 'sm'); blockedBtn.type = 'button';
  bar.append(hideBtn, sideBtn, blockedBtn);
  root.append(lines, menu, blockedPanel, form, bar);

  const button = el('button'); button.id = 'pxchat-btn'; button.type = 'button';
  button.setAttribute('aria-controls', 'pxchat');

  // ---------------------------------------------------------------- painting
  const nameOf = (a: string, mine: boolean) => (mine ? 'You' : deps.labelFor(a));
  const nodes = new Map<number, HTMLElement>();
  const pinned = () => typing || !!menuFor || blockedOpen;
  const maxLines = () => (window.matchMedia?.('(max-width:700px)').matches ? 5 : 8);

  const makeLine = (line: Line) => {
    const row = el('div', undefined, line.who ? (line.mine ? 'ln mine' : 'ln') : 'ln note');
    if (line.who) {
      let name: HTMLElement;
      if (line.mine) name = el('span', 'You', 'nm');
      else {
        const b = el('button', nameOf(line.who.a, false), 'nm'); b.type = 'button';
        b.dataset.a = line.who.a;
        b.setAttribute('aria-label', `Options for ${nameOf(line.who.a, false)}`);
        b.onclick = () => openMenu(line.who!);
        name = b;
      }
      row.append(name, el('span', line.text, 'tx'));
    } else row.append(el('span', line.text, 'tx'));
    return row;
  };

  const renderLines = () => {
    const now = Date.now();
    const show = log.visible(now, { max: maxLines(), holdMs: HOLD_MS, fadeMs: FADE_MS, pinned: pinned() });
    const keep = new Set(show.map((v) => v.line.id));
    for (const [id, node] of nodes) if (!keep.has(id)) { node.remove(); nodes.delete(id); }
    let after: Element | null = null;
    for (const v of show) {
      let node = nodes.get(v.line.id);
      if (!node) { node = makeLine(v.line); nodes.set(v.line.id, node); }
      if (after ? after.nextElementSibling !== node : lines.firstElementChild !== node) lines.insertBefore(node, after ? after.nextElementSibling : lines.firstChild);
      node.style.opacity = String(v.opacity);
      after = node;
    }
  };

  const paintButton = () => {
    button.replaceChildren(document.createTextNode('Chat'));
    if (prefs.hidden && unread > 0) button.append(el('span', unread > 9 ? '9+' : String(unread), 'dot'));
    const open = typing && !prefs.hidden;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', prefs.hidden && unread ? `Chat: ${unread} new` : 'Casino chat: type a message');
  };

  const paintMenu = () => {
    menu.replaceChildren();
    menu.hidden = !menuFor;
    if (!menuFor) return;
    const who = menuFor;
    const name = nameOf(who.a, false);
    const isBlocked = blocks.includes(who.a);
    menu.append(el('p', name));
    const row = el('div', undefined, 'row');
    if (!reporting) {
      const blockB = el('button', isBlocked ? 'Unblock' : 'Block', 'sm'); blockB.type = 'button';
      blockB.onclick = () => { setBlocked(who, !isBlocked); closeMenu(); };
      const repB = el('button', 'Report…', 'sm danger'); repB.type = 'button';
      repB.onclick = () => { reporting = true; paintMenu(); };
      row.append(blockB, repB);
    } else {
      menu.append(el('p', 'Why? Your report goes to the casino team with what they last said.'));
      for (const r of REPORT_REASONS) {
        const b = el('button', r.label, 'sm'); b.type = 'button';
        b.onclick = () => { report(who, r.code); closeMenu(); };
        row.append(b);
      }
    }
    const cancel = el('button', 'Cancel', 'sm'); cancel.type = 'button';
    cancel.onclick = closeMenu;
    row.append(cancel);
    menu.append(row);
  };

  const paintBlocked = () => {
    blockedPanel.replaceChildren();
    blockedPanel.hidden = !blockedOpen;
    if (!blockedOpen) return;
    if (!blocks.length) { blockedPanel.append(el('p', 'You have not blocked anyone.')); return; }
    blockedPanel.append(el('p', 'Blocked people cannot reach you and you cannot reach them.'));
    for (const a of blocks) {
      const row = el('div', undefined, 'row');
      row.append(el('span', deps.labelFor(a)));
      const b = el('button', 'Unblock', 'sm'); b.type = 'button';
      b.onclick = () => { setBlocked({ a }, false); paintBlocked(); renderAll(); };
      row.append(b);
      blockedPanel.append(row);
    }
  };

  const renderAll = () => {
    root.hidden = prefs.hidden;
    root.className = prefs.side;
    form.hidden = !typing || prefs.hidden;
    bar.hidden = !typing || prefs.hidden;
    sideBtn.textContent = prefs.side === 'left' ? 'Move to right ▸' : '◂ Move to left';
    blockedBtn.textContent = blocks.length ? `Blocked (${blocks.length})` : 'Blocked';
    paintButton(); paintMenu(); paintBlocked(); renderLines(); place();
    schedule();
  };

  /** Sit just under the page's top button rows, wherever they are (on a phone they take two rows). */
  const place = () => {
    const tools = document.getElementById('tools');
    const bottom = tools ? tools.getBoundingClientRect().bottom : 70;
    root.style.top = `${Math.round(Math.max(70, bottom + 12))}px`;
  };

  /** Lines fade on their own: tick while there is something on screen, stop when there is not. */
  const schedule = () => {
    window.clearTimeout(timer);
    if (prefs.hidden || document.hidden) return;
    if (nodes.size || pinned()) timer = window.setTimeout(() => { renderLines(); schedule(); }, 500);
  };

  // ---------------------------------------------------------------- actions
  const note = (text: string) => { log.add(null, text, false, Date.now()); };

  const openTyping = () => {
    if (!deps.me()) {            // a guest: say so and bring up the Room panel, where they can join
      prefs.hidden = false; savePrefs(); typing = false;
      note('Join the room to chat. Anyone can watch; you need one free signature to speak.');
      renderAll(); deps.joinPrompt();
      return;
    }
    if (prefs.hidden) { prefs.hidden = false; savePrefs(); unread = 0; }
    typing = true;
    try { if (document.pointerLockElement) document.exitPointerLock(); } catch { /* the page frees the mouse when it needs to */ }
    renderAll();
    input.focus();
  };
  const closeTyping = () => { typing = false; menuFor = null; reporting = false; blockedOpen = false; input.blur(); renderAll(); };
  const closeMenu = () => { menuFor = null; reporting = false; renderAll(); };
  function openMenu(who: Who) { menuFor = who; reporting = false; blockedOpen = false; renderAll(); }

  const sendBlocks = () => { if (deps.me()) deps.send({ t: 'blocks', list: blocks }); };
  function setBlocked(who: Who, on: boolean) {
    const label = deps.labelFor(who.a);
    if (on) {
      if (blocks.length >= MAX_BLOCKS) { note(errorText('too-many-blocks')); return; }
      if (!blocks.includes(who.a)) blocks.push(who.a);
      log.dropFrom(who.a);
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
    deps.send({ t: 'report', who: who.a, why, lines: log.lastFrom(who.a) });
    note('Sending your report…');
  }

  // ---------------------------------------------------------------- wiring
  button.onclick = () => { if (typing && !prefs.hidden) closeTyping(); else openTyping(); };
  hideBtn.onclick = () => { prefs.hidden = true; savePrefs(); typing = false; menuFor = null; blockedOpen = false; unread = 0; input.blur(); renderAll(); };
  sideBtn.onclick = () => { prefs.side = prefs.side === 'left' ? 'right' : 'left'; savePrefs(); renderAll(); };
  blockedBtn.onclick = () => { blockedOpen = !blockedOpen; menuFor = null; reporting = false; renderAll(); };

  form.onsubmit = (event) => {
    event.preventDefault();
    const now = Date.now();
    const check = checkSend(input.value, { signed: !!deps.me(), connected: deps.connected(), now, lastSentAt });
    if (!check.ok) {
      note(check.code === 'offline' ? 'Not connected to the room yet. Your message is still in the box.' : errorText(check.code));
      renderAll();
      return;                                   // the text stays in the box
    }
    if (!deps.send({ t: 'say', text: check.text })) { note('Not connected to the room yet. Your message is still in the box.'); renderAll(); return; }
    lastSentAt = now; pending = check.text;
    input.value = '';
  };
  // Keys typed here belong to the chat, not the game (E, Q, B, the numbers and WASD would otherwise walk or sit the player).
  // keyup is left alone on purpose: if a movement key was already held when the box opened, the game must still see it let go.
  input.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); closeTyping(); }
  });
  input.addEventListener('keypress', (e) => e.stopPropagation());
  // A tap anywhere outside the chat closes the Block / Report menu (there is no Escape key on a phone).
  document.addEventListener('pointerdown', (e) => {
    if (!menuFor && !blockedOpen) return;
    const t = e.target as Node | null;
    if (t && (root.contains(t) || button.contains(t))) return;
    menuFor = null; reporting = false; blockedOpen = false; renderAll();
  });
  window.addEventListener('resize', place);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) renderAll(); });

  // ---------------------------------------------------------------- what main.ts tells us
  const api = {
    button,
    mount(parent: HTMLElement) { parent.append(root); renderAll(); },
    /** Someone spoke in the room (the room sends our own line back too, so our screen shows exactly what everyone got). */
    heard(m: { from: Who; text: string; at?: number }) {
      const me = deps.me();
      const mine = !!me && m.from.a === me;
      const line = log.add(m.from, String(m.text ?? '').slice(0, MAX_CHARS * 2), mine, Date.now());
      if (!line) return;
      if (mine) pending = '';
      else if (prefs.hidden) unread += 1;
      renderAll();
    },
    /** The room refused something. A refused message goes back into the box so nothing typed is lost. */
    failed(code: unknown) {
      if (pending && !input.value) input.value = pending;
      pending = '';
      note(errorText(code));
      renderAll();
    },
    reported() { note('Report sent. Thank you.'); renderAll(); },
    /** A fresh connection: the room has forgotten our block list, so hand it over again. */
    connectedAgain() { sendBlocks(); },
    /** Names learned from BNS arrive late; relabel what is already on screen. */
    refreshNames() {
      lines.querySelectorAll<HTMLElement>('button.nm[data-a]').forEach((b) => { b.textContent = deps.labelFor(b.dataset.a!); });
    },
    /** Leaving the room, or the session ending: nobody to talk as any more. */
    signedOut() { typing = false; menuFor = null; reporting = false; blockedOpen = false; input.value = ''; pending = ''; renderAll(); },
    isTyping: () => typing,
    debug: () => ({ typing, hidden: prefs.hidden, side: prefs.side, blocks: [...blocks], lines: log.size, shown: nodes.size })
  };
  paintButton();
  return api;
}

export type Chat = ReturnType<typeof createChat>;
