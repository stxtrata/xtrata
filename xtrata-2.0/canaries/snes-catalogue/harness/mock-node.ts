/**
 * A tiny in-page stand-in for the three contracts the Arcade wrapper talks to: the Xtrata core (v3.2.3 read/write subset),
 * the SNES catalogue and its adapter. The rules and error codes mirror `snes-game-catalogue-v1.clar` (tested in Clarinet,
 * 18/18) so what you see here is what the real contracts will say. Reads return real Clarity values, so the wrapper's
 * parsers are the same ones that read mainnet. Nothing here touches a network or a wallet.
 */
import { sha256 } from '@noble/hashes/sha256';
import {
  boolCV, bufferCV, ClarityType, cvToString, listCV, noneCV, principalCV, responseErrorCV, responseOkCV, someCV, stringAsciiCV, tupleCV, uintCV,
  type ClarityValue
} from '@stacks/transactions';

export const CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
export const ME = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
export const PUBLISHER = 'SP3FQ8TF4TJS2E82REGD3SGKMT4DG9B32J12P20R1';
export const STRANGER = 'SPZ783KNXRDSW0R2DM068NXKE64YZ0DAGKZD10ND';
export const CAT = `${ME}.snes-game-catalogue-v1`;
export const AD = `${ME}.snes-xtrata-adapter-v3-2-3`;
export const ACTORS: Record<string, string> = { you: ME, publisher: PUBLISHER, stranger: STRANGER };
export const actorName = (a: string) => (a === ME ? 'you (admin)' : a === PUBLISHER ? 'publisher' : a === STRANGER ? 'stranger' : a.slice(0, 8) + '…');
const CHUNK = 16384;

const concat = (a: Uint8Array, b: Uint8Array) => { const o = new Uint8Array(a.length + b.length); o.set(a, 0); o.set(b, a.length); return o; };
const hex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
const chunksOf = (bytes: Uint8Array) => { const out: Uint8Array[] = []; for (let i = 0; i < bytes.length; i += CHUNK) out.push(bytes.subarray(i, Math.min(i + CHUNK, bytes.length))); return out; };
/** The core's running hash: h0 = 32 zero bytes, h = sha256(h || chunk). */
const runHash = (chunks: Uint8Array[]) => chunks.reduce((h, c) => sha256(concat(h, c)), new Uint8Array(32));

const ERRORS: Record<number, string> = {
  100: 'not the admin', 101: 'not a publisher', 102: 'not the game owner', 103: 'not found', 104: 'that slug is taken', 105: 'that ROM hash is already registered',
  106: 'bad input', 107: 'that adapter is not allowed', 112: 'that version is revoked', 113: 'not the pending admin',
  200: 'adapter: that inscription does not exist', 201: 'adapter: that inscription is not sealed', 202: 'adapter: size does not match the inscription', 203: 'adapter: the inscription was not created by the game owner'
};
export type Result<T = unknown> = { ok: true; value: T } | { ok: false; code: number; text: string };
const ok = <T,>(value: T): Result<T> => ({ ok: true, value });
const fail = (code: number): Result<never> => ({ ok: false, code, text: `err u${code}: ${ERRORS[code] ?? 'refused'}` });

export type Ptr = { core: string; id: number } | null;
type Game = { slug: string; title: string; owner: string; set: number; hidden: boolean; latest: number; versions: number; payout: string; licence: string; cover: Ptr; icon: Ptr };
type Version = { sha: Uint8Array; size: number; core: string; ins: number; coreMin: number; profile: string; board: string | null; note: string; revoked: boolean };
type Meta = { creator: string; mime: string; size: number; n: number; hash: string; sealed: boolean };

export type Op =
  | { op: 'inscribe'; actor: string; mime: string; b64: string }
  | { op: 'unsealed'; actor: string; mime: string; size: number }
  | { op: 'call'; actor: string; fn: string; args: any[] };

const b64 = (b: Uint8Array) => { let s = ''; for (let i = 0; i < b.length; i += 0x4000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x4000) as unknown as number[]); return btoa(s); };
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export class MockChain {
  meta = new Map<number, Meta>();
  chunks = new Map<number, Uint8Array[]>();
  byHashCore = new Map<string, number>();
  nextIns = 3200;
  admin = ME; pending: string | null = null; count = 0; gate: string | null = null;
  publishers = new Map<string, { active: boolean; label: string }>();
  readers = new Map<string, boolean>();
  games = new Map<number, Game>();
  versions = new Map<string, Version>();
  byHash = new Map<string, { id: number; ver: number }>();
  bySlug = new Map<string, number>();
  ops: Op[] = [];
  journal: { actor: string; what: string; result: string; good: boolean }[] = [];
  private seeded = false;

  constructor() { this.readers.set(AD, true); this.publishers.set(ME, { active: true, label: 'xtrata' }); }

  // ----- core -----
  private put(bytes: Uint8Array, mime: string, creator: string): { id: number; existed: boolean } {
    const ch = chunksOf(bytes), h = hex(runHash(ch));
    const hit = this.byHashCore.get(h);
    if (hit) return { id: hit, existed: true };
    const id = this.nextIns++;
    this.meta.set(id, { creator, mime, size: bytes.length, n: ch.length, hash: h, sealed: true });
    this.chunks.set(id, ch); this.byHashCore.set(h, id);
    return { id, existed: false };
  }
  inscribe(actor: string, bytes: Uint8Array, mime: string, record = true) {
    if (!bytes.length) return fail(106);
    if (bytes.length > 512 * 1024) return { ok: false as const, code: 102, text: 'one-transaction inscription is limited to 512 KB (32 chunks); the real canary stages bigger files' };
    const r = this.put(bytes, mime, actor);
    if (record) { this.ops.push({ op: 'inscribe', actor, mime, b64: b64(bytes) }); this.journal.push({ actor, what: `inscribe ${bytes.length.toLocaleString()} bytes (${mime})`, result: r.existed ? `already existed as #${r.id}` : `sealed as #${r.id}`, good: true }); }
    return ok(r);
  }
  /** Simulation only: an upload that was begun and never sealed, so its bytes could still change. */
  beginUnsealed(actor: string, size: number, mime: string, record = true) {
    const id = this.nextIns++;
    this.meta.set(id, { creator: actor, mime, size, n: Math.max(1, Math.ceil(size / CHUNK)), hash: hex(new Uint8Array(32)), sealed: false });
    this.chunks.set(id, []);
    if (record) { this.ops.push({ op: 'unsealed', actor, mime, size }); this.journal.push({ actor, what: `begin an upload of ${size.toLocaleString()} bytes and never seal it`, result: `#${id} (not sealed)`, good: true }); }
    return ok({ id });
  }

  // ----- adapter -----
  private check(adapter: string, ins: number, size: number, creator: string): number | null {
    if (adapter !== AD) return 999;
    const m = this.meta.get(ins);
    if (!m) return 200;
    if (!m.sealed) return 201;
    if (m.size !== size) return 202;
    if (m.creator !== creator) return 203;
    return null;
  }

  // ----- catalogue -----
  private active(who: string) { return !!this.publishers.get(who)?.active; }
  private canAct(g: Game, who: string) { return who === this.admin || (who === g.owner && this.active(who)); }
  call(actor: string, fn: string, a: any[], record = true): Result<any> {
    const r = this.exec(actor, fn, a);
    if (record) {
      this.ops.push({ op: 'call', actor, fn, args: a });
      this.journal.push({ actor, what: `${fn} ${a.map((x) => (typeof x === 'object' && x ? JSON.stringify(x) : String(x))).join(' ').slice(0, 80)}`, result: r.ok ? 'ok' + (r.value !== undefined && r.value !== true ? ` ${JSON.stringify(r.value)}` : '') : r.text, good: r.ok });
    }
    return r;
  }
  private exec(who: string, fn: string, a: any[]): Result<any> {
    const isAdmin = who === this.admin;
    switch (fn) {
      case 'set-publisher': if (!isAdmin) return fail(100); this.publishers.set(a[0], { active: !!a[1], label: a[2] ?? '' }); return ok(true);
      case 'set-gate': if (!isAdmin) return fail(100); this.gate = a[0] || null; return ok(true);
      case 'set-reader': if (!isAdmin) return fail(100); this.readers.set(a[0], !!a[1]); return ok(true);
      case 'set-set': { const g = this.games.get(a[0]); if (!g) return fail(103); if (!isAdmin) return fail(100); if (a[1] > 1) return fail(106); g.set = a[1]; return ok(true); }
      case 'revoke-version': {
        const v = this.versions.get(`${a[0]}:${a[1]}`);
        if (!v) return fail(103); if (!isAdmin) return fail(100);
        v.revoked = true; const h = hex(v.sha), b = this.byHash.get(h);
        if (b && b.id === a[0] && b.ver === a[1]) this.byHash.delete(h);
        return ok(true);
      }
      case 'propose-admin': if (!isAdmin) return fail(100); this.pending = a[0]; return ok(true);
      case 'accept-admin': if (!this.pending || this.pending !== who) return fail(113); this.admin = this.pending; this.pending = null; return ok(true);
      case 'add-game': {
        const [slug, title, cover, icon] = a;
        if (!this.active(who)) return fail(101);
        if (!slug || !title || slug.length > 32 || title.length > 48) return fail(106);
        if (this.bySlug.has(slug)) return fail(104);
        const id = this.count + 1;
        this.bySlug.set(slug, id);
        this.games.set(id, { slug, title, owner: who, set: isAdmin ? 0 : 1, hidden: false, latest: 0, versions: 0, payout: who, licence: 'free', cover: cover ?? null, icon: icon ?? null });
        this.count = id; return ok(id);
      }
      case 'add-version': {
        const [id, adapter, shaHex, size, ins, coreMin, profile, board, note, makeLatest] = a;
        const g = this.games.get(id);
        if (!g) return fail(103);
        const ver = g.versions + 1;
        if (!this.canAct(g, who)) return fail(102);
        if (!this.readers.get(adapter)) return fail(107);
        if (!(size > 0 && coreMin > 0)) return fail(106);
        const bad = this.check(adapter, ins, size, g.owner); if (bad) return fail(bad);
        if (this.byHash.has(shaHex)) return fail(105);
        this.byHash.set(shaHex, { id, ver });
        this.versions.set(`${id}:${ver}`, { sha: Uint8Array.from(shaHex.match(/../g)!.map((x: string) => parseInt(x, 16))), size, core: CORE, ins, coreMin, profile: profile ?? '', board: board ?? null, note: note ?? '', revoked: false });
        g.versions = ver; if (makeLatest || g.latest === 0) g.latest = ver;
        return ok(ver);
      }
      case 'set-latest': {
        const g = this.games.get(a[0]); const v = this.versions.get(`${a[0]}:${a[1]}`);
        if (!g || !v) return fail(103); if (!this.canAct(g, who)) return fail(102); if (v.revoked) return fail(112);
        g.latest = a[1]; return ok(true);
      }
      case 'set-hidden': { const g = this.games.get(a[0]); if (!g) return fail(103); if (!this.canAct(g, who)) return fail(102); g.hidden = !!a[1]; return ok(true); }
      case 'set-art': { const g = this.games.get(a[0]); if (!g) return fail(103); if (!this.canAct(g, who)) return fail(102); g.cover = a[1] ?? null; g.icon = a[2] ?? null; return ok(true); }
      case 'transfer-game': {
        const g = this.games.get(a[0]); if (!g) return fail(103); if (!this.canAct(g, who)) return fail(102);
        if (!this.active(a[1])) return fail(101); g.owner = a[1]; g.payout = a[1]; return ok(true);
      }
    }
    return fail(999);
  }

  // ----- reads, as Clarity values (the same shapes the live contracts return) -----
  private gameCV(g: Game) {
    const ptr = (p: Ptr) => (p ? someCV(tupleCV({ core: principalCV(p.core), id: uintCV(p.id) })) : noneCV());
    return tupleCV({ slug: stringAsciiCV(g.slug), title: stringAsciiCV(g.title), owner: principalCV(g.owner), set: uintCV(g.set), hidden: boolCV(g.hidden), latest: uintCV(g.latest), versions: uintCV(g.versions),
      payout: principalCV(g.payout), licence: stringAsciiCV(g.licence), cover: ptr(g.cover), icon: ptr(g.icon) });
  }
  private versionCV(v: Version) {
    return tupleCV({ 'rom-sha256': bufferCV(v.sha), size: uintCV(v.size), core: principalCV(v.core), ins: uintCV(v.ins), 'core-min': uintCV(v.coreMin), profile: stringAsciiCV(v.profile),
      board: v.board ? someCV(stringAsciiCV(v.board)) : noneCV(), note: stringAsciiCV(v.note), 'added-at': uintCV(1), revoked: boolCV(v.revoked) });
  }
  private card(id: number): ClarityValue {
    const g = this.games.get(id);
    if (!g) return noneCV();
    const v = this.versions.get(`${id}:${g.latest}`);
    return someCV(tupleCV({ id: uintCV(id), game: this.gameCV(g), version: v ? someCV(this.versionCV(v)) : noneCV() }));
  }
  /** Same signature as the wrapper's Reader. */
  read = async (contract: string, fn: string, args: ClarityValue[]): Promise<ClarityValue> => {
    const n = (cv: any) => Number(BigInt(cv.value));
    const bh = (cv: any) => hex(cv.buffer);
    if (contract === CORE) {
      switch (fn) {
        case 'is-paused': return responseOkCV(boolCV(false));
        case 'get-id-by-hash': { const id = this.byHashCore.get(bh(args[0])); return id ? someCV(uintCV(id)) : noneCV(); }
        case 'get-inscription-meta': {
          const m = this.meta.get(n(args[0]));
          return m ? someCV(tupleCV({ creator: principalCV(m.creator), 'mime-type': stringAsciiCV(m.mime), 'total-size': uintCV(m.size), 'total-chunks': uintCV(m.n), sealed: boolCV(m.sealed), 'final-hash': bufferCV(Uint8Array.from(m.hash.match(/../g)!.map((x) => parseInt(x, 16)))) })) : noneCV();
        }
        case 'get-chunk-batch': { const ch = this.chunks.get(n(args[0])) ?? []; return listCV((args[1] as any).list.map((i: any) => bufferCV(ch[n(i)] ?? new Uint8Array(0)))); }
      }
    } else if (contract === CAT) {
      switch (fn) {
        case 'get-count': return uintCV(this.count);
        case 'get-admin': return principalCV(this.admin);
        case 'get-pending-admin': return this.pending ? someCV(principalCV(this.pending)) : noneCV();
        case 'get-gate': return this.gate ? someCV(principalCV(this.gate)) : noneCV();
        case 'is-publisher': return boolCV(this.active(cvToString(args[0])));
        case 'is-reader': return boolCV(!!this.readers.get(cvToString(args[0])));
        case 'get-game': { const g = this.games.get(n(args[0])); return g ? someCV(this.gameCV(g)) : noneCV(); }
        case 'get-version': { const v = this.versions.get(`${n(args[0])}:${n(args[1])}`); return v ? someCV(this.versionCV(v)) : noneCV(); }
        case 'get-by-hash': { const b = this.byHash.get(bh(args[0])); return b ? someCV(tupleCV({ id: uintCV(b.id), ver: uintCV(b.ver) })) : noneCV(); }
        case 'get-by-slug': { const id = this.bySlug.get((args[0] as any).data); return id ? someCV(uintCV(id)) : noneCV(); }
        case 'get-card': return this.card(n(args[0]));
        case 'get-page': { const s = n(args[0]); return listCV(Array.from({ length: 10 }, (_, i) => this.card(s + i))); }
      }
    } else if (contract === AD) {
      if (fn === 'core') return responseOkCV(principalCV(CORE));
    }
    throw new Error(`mock read not implemented: ${contract} ${fn}`);
  };

  // ----- state: replayable operations on top of the launch state -----
  /** The state the launch canary leaves: games inscribed and registered by you, in the core set. */
  seedLaunch(pack: { romMime: string; games: Array<{ slug: string; title: string; note: string; profile: string; board: string | null; coreMin: number; size: number; romSha: string; rom: string; cover: string | null; icon: string | null }> }) {
    if (this.seeded) return;
    this.seeded = true;
    const unb = unb64;
    for (const g of pack.games) {
      const rom = this.put(unb(g.rom), pack.romMime, ME).id;
      const cover = g.cover ? this.put(unb(g.cover), 'image/png', ME).id : null;
      const icon = g.icon ? this.put(unb(g.icon), 'image/png', ME).id : null;
      const id = (this.exec(ME, 'add-game', [g.slug, g.title, cover ? { core: CORE, id: cover } : null, icon ? { core: CORE, id: icon } : null]) as any).value;
      this.exec(ME, 'add-version', [id, AD, g.romSha, g.size, rom, g.coreMin, g.profile, g.board, g.note, true]);
    }
  }
  replay(ops: Op[]) {
    for (const o of ops) {
      if (o.op === 'inscribe') this.inscribe(o.actor, unb64(o.b64), o.mime);
      else if (o.op === 'unsealed') this.beginUnsealed(o.actor, o.size, o.mime);
      else this.call(o.actor, o.fn, o.args);
    }
  }
}
export { b64, unb64 };
