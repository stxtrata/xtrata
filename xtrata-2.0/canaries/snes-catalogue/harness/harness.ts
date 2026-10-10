/**
 * SNES Arcade harness: the real emulator, the Arcade wrapper's loading logic (wrapper.ts, the same module the launch canary
 * runs against mainnet) and an in-page mock chain (mock-node.ts). Everything happens in this page: no wallet, no network, no
 * cost. Use it to see menu loads, local files, open-by-ID, refusals and catalogue updates before anything is deployed.
 */
import PACK from 'snes:pack';
import { createWrapper, romSha, WrapperError, type Card } from '../wrapper';
import { ACTORS, actorName, AD, b64, CAT, CORE, ME, MockChain, PUBLISHER, STRANGER, unb64, type Op } from './mock-node';

declare const __BUILD__: string;
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector(sel) as T;
type Child = Node | string | null | undefined | false | Child[];
const el = (tag: string, attrs: Record<string, any> = {}, ...children: Child[]) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) node.setAttribute(k, v === true ? '' : v);
  }
  const add = (c: Child) => { if (Array.isArray(c)) c.forEach(add); else if (c !== null && c !== undefined && c !== false) node.append(typeof c === 'string' ? document.createTextNode(c) : c); };
  children.forEach(add);
  return node;
};
const kb = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`);
const short = (s: string) => (s.length > 14 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s);
const errText = (e: unknown) => (e instanceof Error ? e.message : String(e));

// ---------- the mock chain, persisted as "launch state + the operations you did" ----------
const STORE = 'xtrata-snes-harness:v1';
type Saved = { empty: boolean; ops: Op[] };
const loadSaved = (): Saved => { try { const s = JSON.parse(localStorage.getItem(STORE) || 'null'); if (s && Array.isArray(s.ops)) return s; } catch { /* storage unavailable */ } return { empty: false, ops: [] }; };
let saved = loadSaved();
let chain!: MockChain;
const persist = () => { saved.ops = chain.ops; try { localStorage.setItem(STORE, JSON.stringify(saved)); } catch { note('warn', 'The browser would not store your changes (private window or full storage). They last until you reload.'); } };
const build = () => {
  chain = new MockChain();
  if (!saved.empty) chain.seedLaunch(PACK);
  chain.replay(saved.ops);
};

// ---------- wrapper ----------
let tamper = false;
const wrapper = createWrapper({
  read: (c, f, a) => chain.read(c, f, a), core: CORE, catalogue: CAT,
  mangle: (bytes) => { if (!tamper) return bytes; const o = bytes.slice(); o[Math.floor(o.length / 2)] ^= 0xff; return o; }
});

// ---------- activity ----------
type Tone = 'ok' | 'warn' | 'error' | 'info';
const note = (tone: Tone, text: string, flow?: string) => {
  const log = $('#wlog');
  log.prepend(el('div', { class: `log-line ${tone === 'info' ? '' : tone}` }, el('time', {}, new Date().toLocaleTimeString() + ' '), flow ? el('b', {}, `[${flow}] `) : null, text));
  const banner = $('#banner'); banner.textContent = text; banner.setAttribute('data-tone', tone);
};

// ---------- the emulator in a frame, driven over its postMessage bridge ----------
const NS = 'xtrata-snes';
let frame: HTMLIFrameElement;
let seq = 0;
const pending = new Map<number, { resolve: (m: any) => void; reject: (e: Error) => void; timer: ReturnType<typeof setTimeout> }>();
let ready = false;
let expecting: { sha: string } | null = null; // a ROM this page just sent; its identity report is not a "local file"
const request = (type: string, payload: Record<string, any> = {}, timeout = 30_000) => new Promise<any>((resolve, reject) => {
  const id = ++seq;
  const timer = setTimeout(() => { pending.delete(id); reject(new Error(`the emulator did not answer "${type}"`)); }, timeout);
  pending.set(id, { resolve, reject, timer });
  frame.contentWindow!.postMessage({ ns: NS, v: 1, id, type, ...payload }, '*');
});
const provenance = () => (frame.contentWindow as any)?.document?.getElementById('provenance')?.textContent?.trim() ?? '';
window.addEventListener('message', (e) => {
  if (!frame || e.source !== frame.contentWindow) return;
  const m = e.data;
  if (!m || typeof m !== 'object' || m.ns !== NS) return;
  if (m.id != null && pending.has(m.id)) {
    const p = pending.get(m.id)!; pending.delete(m.id); clearTimeout(p.timer);
    if (m.type === 'error') p.reject(new Error(String(m.message))); else p.resolve(m);
    return;
  }
  if (m.type === 'ready') { ready = true; void sendMenu(); }
  else if (m.type === 'want-rom') void onWantRom(m);
  else if (m.type === 'rom' && m.rom) void onRomIdentity(m.rom.canonicalSha256 as string);
});

// ---------- the menu (flow A) ----------
let tab: 'core' | 'community' = 'core';
let cards: Card[] = [];
const coverCache = new Map<string, string | null>();
const coverUrl = async (p: { core: string; id: string } | null): Promise<string | null> => {
  if (!p || p.core !== CORE) return null;
  if (coverCache.has(p.id)) return coverCache.get(p.id)!;
  let url: string | null = null;
  try {
    const meta = await wrapper.inscriptionMeta(p.id);
    if (meta && meta.sealed && meta.size < 200_000) { const bytes = await wrapper.readChunks(p.id, meta.chunks); url = `data:image/png;base64,${b64(bytes)}`; }
  } catch { url = null; }
  coverCache.set(p.id, url);
  return url;
};
const menuEntries = async () => {
  cards = await wrapper.readCatalogue();
  const shown = cards.filter((c) => c.version && !c.version.revoked && !c.game.hidden && (tab === 'core' ? c.game.set === '0' : c.game.set === '1'));
  const out = [];
  for (const c of shown) {
    const v = c.version!;
    out.push({ id: String(c.id), ver: String(c.game.latest), title: c.game.title, sha256: v.sha, size: v.size, note: v.note, publisher: short(c.game.owner),
      curated: c.game.set === '0', set: tab, cover: await coverUrl(c.game.cover) });
  }
  return out;
};
const sendMenu = async () => {
  if (!ready) return;
  try {
    const games = await menuEntries();
    await request('catalogue', { games });
    $('#tab-core').textContent = `Core (${cards.filter((c) => c.version && !c.game.hidden && c.game.set === '0').length})`;
    $('#tab-community').textContent = `Community (${cards.filter((c) => c.version && !c.game.hidden && c.game.set === '1').length})`;
    ($('#tab-core') as HTMLElement).setAttribute('aria-pressed', String(tab === 'core'));
    ($('#tab-community') as HTMLElement).setAttribute('aria-pressed', String(tab === 'community'));
    $('#menu-note').textContent = games.length ? `The emulator's Games menu now lists ${games.length} ${tab} game${games.length === 1 ? '' : 's'} from the catalogue (plus STAR PATROL's built-in copy).` : `No ${tab} games in the catalogue. The emulator shows only its built-in game.`;
  } catch (e) { note('error', `Could not refresh the menu: ${errText(e)}`); }
};
const onWantRom = async (m: any) => {
  const card = cards.find((c) => String(c.id) === String(m.id));
  const v = card?.version;
  if (!card || !v) { note('error', `The emulator asked for game ${m.id}, which is not in the catalogue any more. Refresh the menu.`, 'A'); return; }
  note('info', `${card.game.title}: reading inscription #${v.ins} from the core, checking size and SHA-256 against the catalogue…`, 'A');
  try {
    const bytes = await wrapper.fetchRom(v, card.game.title);
    expecting = { sha: v.sha };
    await request('load-rom', { bytes, name: `${card.game.slug}.sfc`, sha256: v.sha });
    note('ok', `${card.game.title}: loaded from inscription #${v.ins}. Emulator says: "${provenance()}".`, 'A');
  } catch (e) {
    expecting = null;
    note('error', `Refused. ${errText(e)}`, 'A');
  }
};

// ---------- local file or built-in copy (flow B) ----------
const onRomIdentity = async (sha: string) => {
  if (expecting && expecting.sha === sha) { expecting = null; return; }
  expecting = null;
  try {
    const hit = await wrapper.identify(sha);
    const label = provenance() || 'Local file';
    if (hit) note('ok', `Emulator says "${label}". The catalogue knows this ROM: ${hit.game.title} v${hit.ver} (game #${hit.id}, ${hit.game.set === '0' ? 'core' : 'community'}). Same hash means the same scoreboard as the inscribed copy.`, 'B');
    else note('warn', `Emulator says "${label}". This ROM (${sha.slice(0, 12)}…) is not in the catalogue: play only, no scores.`, 'B');
  } catch (e) { note('error', errText(e), 'B'); }
};

// ---------- open by inscription ID (flow D) ----------
const openById = async (raw: string) => {
  try {
    note('info', `Checking inscription ${raw.trim() || '(empty)'}…`, 'D');
    const r = await wrapper.openById(raw);
    note(r.match ? 'ok' : 'warn', wrapper.describeOpen(r), 'D');
    expecting = { sha: r.sha };
    try { await request('load-rom', { bytes: r.bytes, name: `inscription-${r.ins}.sfc` }); } // no sha256 on purpose
    catch (e) { expecting = null; note('error', `The emulator could not use inscription #${r.ins}: ${errText(e)}`, 'D'); return; }
    const prov = provenance();
    note(r.match ? 'ok' : 'warn', `${wrapper.describeOpen(r)} Emulator label: "${prov}" (the page never claims "Verified on-chain copy" for an ID).`, 'D');
  } catch (e) { note(e instanceof WrapperError ? 'warn' : 'error', errText(e), 'D'); }
};

// ---------- rendering the chain ----------
const actorSel = () => ($('#actor') as HTMLSelectElement).value;
const romInfo = async (ins: number) => {
  const meta = await wrapper.inscriptionMeta(String(ins));
  if (!meta) throw new Error(`No inscription #${ins}.`);
  if (!meta.sealed) throw new Error(`#${ins} is not sealed.`);
  const bytes = await wrapper.readChunks(String(ins), meta.chunks);
  return { meta, sha: romSha(bytes), size: bytes.length };
};
const refreshAll = async () => {
  persist();
  $('#ins-rows').replaceChildren(...[...chain.meta.entries()].sort((a, b) => b[0] - a[0]).map(([id, m]) => el('tr', {},
    el('td', {}, `#${id}`), el('td', {}, kb(m.size)), el('td', {}, m.mime), el('td', {}, actorName(m.creator)), el('td', {}, m.sealed ? 'sealed' : 'NOT SEALED'),
    el('td', {}, el('button', { class: 'button ghost small', type: 'button', onclick: () => { ($('#open-id') as HTMLInputElement).value = String(id); void openById(String(id)); } }, 'Open by ID')))));
  const rows: Node[] = [];
  for (const [id, g] of [...chain.games.entries()]) {
    rows.push(el('tr', {},
      el('td', {}, `#${id}`), el('td', {}, el('b', {}, g.title), el('br'), el('span', { class: 'dim' }, g.slug)),
      el('td', {}, g.set === 0 ? 'core' : 'community'), el('td', {}, g.hidden ? 'hidden' : 'shown'), el('td', {}, actorName(g.owner)), el('td', {}, `v${g.latest} of ${g.versions}`),
      el('td', {}, ...Array.from({ length: g.versions }, (_, i) => {
        const v = chain.versions.get(`${id}:${i + 1}`)!;
        return el('span', { class: 'chip' }, `v${i + 1} #${v.ins}${v.revoked ? ' revoked' : ''}`);
      }))));
  }
  $('#game-rows').replaceChildren(...rows);
  $('#journal').replaceChildren(...chain.journal.slice().reverse().map((j) => el('div', { class: `log-line ${j.good ? '' : 'error'}` }, el('b', {}, actorName(j.actor)), ` ${j.what} → ${j.result}`)));
  await sendMenu();
};
const report = (what: string, r: { ok: boolean; text?: string; value?: any }, flow = 'chain') => {
  note(r.ok ? 'ok' : 'error', r.ok ? `${actorName(actorSel())}: ${what} — ok${r.value && typeof r.value !== 'boolean' ? ` (${JSON.stringify(r.value)})` : ''}` : `${actorName(actorSel())}: ${what} — refused by the contract (${r.text})`, flow);
};
const num = (id: string) => Number(($(`#${id}`) as HTMLInputElement).value);
const txt = (id: string) => ($(`#${id}`) as HTMLInputElement).value.trim();
const gameBySlugOrId = (v: string) => (/^\d+$/.test(v) ? Number(v) : chain.bySlug.get(v) ?? 0);

const act = {
  inscribeFile: async (file: File) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const r = chain.inscribe(actorSel(), bytes, file.name.match(/\.(png)$/i) ? 'image/png' : 'application/x-snes-rom');
    report(`inscribe ${file.name} (${kb(bytes.length)})`, r as any);
    if (r.ok) { ($('#reg-ins') as HTMLInputElement).value = String((r.value as any).id); ($('#ver-ins') as HTMLInputElement).value = String((r.value as any).id); ($('#open-id') as HTMLInputElement).value = String((r.value as any).id); }
    await refreshAll();
  },
  register: async () => {
    try {
      const ins = num('reg-ins'), slug = txt('reg-slug'), title = txt('reg-title'), note_ = txt('reg-note');
      const info = await romInfo(ins);
      const cover = txt('reg-cover') ? { core: CORE, id: num('reg-cover') } : null;
      const g = chain.call(actorSel(), 'add-game', [slug, title, cover, null]);
      report(`add-game ${slug}`, g);
      if (!g.ok) { await refreshAll(); return; }
      const v = chain.call(actorSel(), 'add-version', [g.value, AD, info.sha, info.size, ins, 10000, '', null, note_, true]);
      report(`add-version (inscription #${ins}, ${kb(info.size)}, hash ${info.sha.slice(0, 12)}…)`, v);
    } catch (e) { note('error', errText(e), 'chain'); }
    await refreshAll();
  },
  addVersion: async () => {
    try {
      const id = gameBySlugOrId(txt('ver-game')), ins = num('ver-ins');
      const info = await romInfo(ins);
      const v = chain.call(actorSel(), 'add-version', [id, AD, info.sha, info.size, ins, 10000, '', null, txt('ver-note'), ($('#ver-latest') as HTMLInputElement).checked]);
      report(`add-version to game #${id} (inscription #${ins}, hash ${info.sha.slice(0, 12)}…)`, v);
    } catch (e) { note('error', errText(e), 'chain'); }
    await refreshAll();
  },
  gameCall: async (fn: string, args: any[], what: string) => { report(what, chain.call(actorSel(), fn, args)); await refreshAll(); },
  unsealed: async () => { const r = chain.beginUnsealed(actorSel(), 200_000, 'application/x-snes-rom') as { ok: true; value: { id: number } }; note('info', `Created #${(r.value as any).id}: an upload that was begun and never sealed. Try opening it by ID.`, 'chain'); ($('#open-id') as HTMLInputElement).value = String((r.value as any).id); await refreshAll(); },
  reset: async (empty: boolean) => { saved = { empty, ops: [] }; coverCache.clear(); build(); note('info', empty ? 'Chain reset to empty: nothing deployed, no games. Enrol yourself as publisher (you are admin) and register one.' : 'Chain reset to the launch state: five games registered by you.', 'chain'); await refreshAll(); }
};

const bind = () => {
  $('#tab-core').addEventListener('click', () => { tab = 'core'; void sendMenu(); });
  $('#tab-community').addEventListener('click', () => { tab = 'community'; void sendMenu(); });
  $('#refresh').addEventListener('click', () => void refreshAll());
  $('#open-go').addEventListener('click', () => void openById(txt('open-id')));
  $('#open-id').addEventListener('keydown', (e) => { if ((e as KeyboardEvent).key === 'Enter') void openById(txt('open-id')); });
  $('#tamper').addEventListener('change', (e) => { tamper = (e.target as HTMLInputElement).checked; note('info', tamper ? 'Tamper is ON: the next ROM the wrapper reads from the chain has one byte changed after it is fetched. Pick a game from the menu to watch the refusal.' : 'Tamper is off.', 'fault'); });
  $('#file-ins').addEventListener('change', (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) void act.inscribeFile(f); (e.target as HTMLInputElement).value = ''; });
  $('#reg-go').addEventListener('click', () => void act.register());
  $('#ver-go').addEventListener('click', () => void act.addVersion());
  $('#g-hide').addEventListener('click', () => void act.gameCall('set-hidden', [gameBySlugOrId(txt('g-game')), true], `hide game ${txt('g-game')}`));
  $('#g-show').addEventListener('click', () => void act.gameCall('set-hidden', [gameBySlugOrId(txt('g-game')), false], `show game ${txt('g-game')}`));
  $('#g-core').addEventListener('click', () => void act.gameCall('set-set', [gameBySlugOrId(txt('g-game')), 0], `move game ${txt('g-game')} to the core tab`));
  $('#g-community').addEventListener('click', () => void act.gameCall('set-set', [gameBySlugOrId(txt('g-game')), 1], `move game ${txt('g-game')} to the community tab`));
  $('#g-revoke').addEventListener('click', () => void act.gameCall('revoke-version', [gameBySlugOrId(txt('g-game')), num('g-ver') || 1], `revoke version ${num('g-ver') || 1} of game ${txt('g-game')}`));
  $('#g-latest').addEventListener('click', () => void act.gameCall('set-latest', [gameBySlugOrId(txt('g-game')), num('g-ver') || 1], `make version ${num('g-ver') || 1} of game ${txt('g-game')} the latest`));
  $('#g-transfer').addEventListener('click', () => void act.gameCall('transfer-game', [gameBySlugOrId(txt('g-game')), ($('#g-to') as HTMLSelectElement).value], `transfer game ${txt('g-game')} to ${actorName(($('#g-to') as HTMLSelectElement).value)}`));
  $('#p-on').addEventListener('click', () => void act.gameCall('set-publisher', [($('#p-who') as HTMLSelectElement).value, true, 'harness'], `enrol ${actorName(($('#p-who') as HTMLSelectElement).value)} as publisher`));
  $('#p-off').addEventListener('click', () => void act.gameCall('set-publisher', [($('#p-who') as HTMLSelectElement).value, false, ''], `remove ${actorName(($('#p-who') as HTMLSelectElement).value)} as publisher`));
  $('#unsealed').addEventListener('click', () => void act.unsealed());
  $('#reset-launch').addEventListener('click', () => void act.reset(false));
  $('#reset-empty').addEventListener('click', () => void act.reset(true));
};

const boot = async () => {
  $('#build').textContent = `${__BUILD__} · emulator v1.0 sha256 ${PACK.emulator.sha256.slice(0, 16)}… · catalogue ${short(CAT)} · core ${short(CORE)} · mock chain, nothing leaves this page`;
  for (const [sel, who] of [['#actor', ''], ['#g-to', ''], ['#p-who', '']] as const) {
    void who;
    $(sel).replaceChildren(...Object.entries(ACTORS).map(([k, a]) => el('option', { value: a }, `${k === 'you' ? 'you (admin)' : k} · ${short(a)}`)));
  }
  ($('#g-to') as HTMLSelectElement).value = PUBLISHER; ($('#p-who') as HTMLSelectElement).value = PUBLISHER;
  build(); bind();
  frame = el('iframe', { title: 'SNES emulator', class: 'emu-frame', allow: 'autoplay; gamepad; fullscreen' }) as HTMLIFrameElement;
  frame.srcdoc = PACK.emulator.html;
  $('#emu-stage').replaceChildren(frame);
  await refreshAll();
  note('info', saved.ops.length || saved.empty ? `Restored your earlier session (${saved.ops.length} operations).` : 'Launch state loaded: five games registered by you, in the core set. Pick one from the emulator\'s Games menu.');
  (window as any).__harness = { chain, wrapper, request, openById, act, refreshAll, setTab: (t: 'core' | 'community') => { tab = t; return sendMenu(); }, provenance, setTamper: (v: boolean) => { tamper = v; }, ready: () => ready, ME, STRANGER, PUBLISHER };
};
void boot();
