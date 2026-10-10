/**
 * The Arcade wrapper's chain-facing logic for the SNES emulator: what sits between the catalogue contract, the Xtrata core
 * and the emulator page. No DOM, no wallet, read-only. Shared by the harness (mock chain) and the launch canary (mainnet), so
 * both exercise exactly the code the Arcade will run.
 *
 * Flows (docs: claude/snes-loader-contract-plan.md §3):
 *   A. menu pick   readCatalogue -> fetchRom (verified against the catalogue hash) -> load-rom WITH sha256
 *   B. local file  the emulator hashes it; identify(sha) says whether the catalogue knows it
 *   D. by ID       openById: checks first, fetches, hashes, identify(sha); load-rom WITHOUT sha256 (never self-verify)
 */
import { sha256 } from '@noble/hashes/sha256';
import { bufferCV, ClarityType, cvToString, listCV, uintCV, type ClarityValue } from '@stacks/transactions';

export type Reader = (contract: string, fn: string, args: ClarityValue[]) => Promise<ClarityValue>;
export type Ptr = { core: string; id: string };
export type GameRow = { slug: string; title: string; owner: string; set: string; hidden: boolean; latest: number; versions: number; payout: string; licence: string; cover: Ptr | null; icon: Ptr | null };
export type VersionRow = { sha: string; size: number; core: string; ins: string; coreMin: number; profile: string; board: string | null; note: string; revoked: boolean };
export type Card = { id: number; game: GameRow; version: VersionRow | null };
export type Meta = { creator: string; mime: string; size: number; chunks: number; sealed: boolean; hash: string };
export type Match = { id: number; ver: number; game: GameRow; version: VersionRow; registeredIns: string };
export type OpenResult = { ins: string; meta: Meta; bytes: Uint8Array; sha: string; match: Match | null; sameInscription: boolean };

/** The biggest ROM the wrapper will fetch by ID: 4 MiB plus a copier header. */
export const MAX_ROM_BYTES = 4 * 1024 * 1024 + 512;
const READ_PER = 10;
const CHUNK_READ_BATCH = READ_PER; // chunks per read-only call (160 KB of response)

const toHex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
const hexBytes = (hex: string) => Uint8Array.from(hex.replace(/^0x/, '').match(/../g)!.map((h) => parseInt(h, 16)));
export const canonical = (rom: Uint8Array) => (rom.length % 1024 === 512 ? rom.subarray(512) : rom);
export const romSha = (rom: Uint8Array) => toHex(sha256(canonical(rom)));

/** A refusal with a plain sentence for the person, and a short code for tests. */
export class WrapperError extends Error {
  constructor(public code: string, message: string) { super(message); }
}

const inner = (cv: ClarityValue): any => {
  let v: any = cv;
  for (let i = 0; i < 6; i++) {
    if (v.type === ClarityType.ResponseErr) throw new Error(`contract returned ${cvToString(v)}`);
    if (v.type === ClarityType.ResponseOk || v.type === ClarityType.OptionalSome) { v = v.value; continue; }
    break;
  }
  return v;
};
const isNone = (cv: ClarityValue) => { let v: any = cv; while (v.type === ClarityType.ResponseOk) v = v.value; return v.type === ClarityType.OptionalNone; };
const num = (cv: any) => BigInt(inner(cv).value);
const field = (cv: ClarityValue, key: string) => inner(cv).data[key] as ClarityValue;
const ptr = (cv: any): Ptr | null => (cv.type === ClarityType.OptionalSome ? { core: cvToString(cv.value.data.core), id: BigInt(cv.value.data.id.value).toString() } : null);
export const parseGame = (t: any): GameRow => {
  const d = t.data;
  return { slug: d.slug.data, title: d.title.data, owner: cvToString(d.owner), set: BigInt(d.set.value).toString(), hidden: d.hidden.type === ClarityType.BoolTrue,
    latest: Number(d.latest.value), versions: Number(d.versions.value), payout: cvToString(d.payout), licence: d.licence.data, cover: ptr(d.cover), icon: ptr(d.icon) };
};
export const parseVersion = (t: any): VersionRow => {
  const d = t.data;
  return { sha: toHex(hexBytes(cvToString(d['rom-sha256']))), size: Number(d.size.value), core: cvToString(d.core), ins: BigInt(d.ins.value).toString(), coreMin: Number(d['core-min'].value),
    profile: d.profile.data, board: d.board.type === ClarityType.OptionalSome ? d.board.value.data : null, note: d.note.data, revoked: d.revoked.type === ClarityType.BoolTrue };
};

export type WrapperConfig = {
  read: Reader;
  core: string;
  catalogue: string;
  /** Called once per read-only call to the core's chunk reader (tests count these). */
  onChunkRead?: () => void;
  /** Test hook: change bytes after they are fetched (the harness's "tamper" switch). */
  mangle?: (bytes: Uint8Array) => Uint8Array;
};

export const createWrapper = (cfg: WrapperConfig) => {
  const readCat = (fn: string, args: ClarityValue[] = []) => cfg.read(cfg.catalogue, fn, args);
  const readCore = (fn: string, args: ClarityValue[] = []) => cfg.read(cfg.core, fn, args);

  const inscriptionMeta = async (id: string): Promise<Meta | null> => {
    const cv = await readCore('get-inscription-meta', [uintCV(BigInt(id))]);
    if (isNone(cv)) return null;
    return {
      creator: cvToString(field(cv, 'creator')), mime: inner(field(cv, 'mime-type')).data, size: Number(num(field(cv, 'total-size'))),
      chunks: Number(num(field(cv, 'total-chunks'))), sealed: inner(field(cv, 'sealed')).type === ClarityType.BoolTrue,
      hash: toHex(inner(field(cv, 'final-hash')).buffer)
    };
  };

  /** Every chunk of an inscription, ten per read. */
  const readChunks = async (id: string, total: number, progress?: (done: number, total: number) => void): Promise<Uint8Array> => {
    const parts: Uint8Array[] = [];
    for (let i = 0; i < total; i += CHUNK_READ_BATCH) {
      const idxs = Array.from({ length: Math.min(CHUNK_READ_BATCH, total - i) }, (_, k) => uintCV(BigInt(i + k)));
      cfg.onChunkRead?.();
      const list = inner(await readCore('get-chunk-batch', [uintCV(BigInt(id)), listCV(idxs)])).list as any[];
      if (list.length !== idxs.length) throw new WrapperError('short-read', `The chain returned ${list.length} of ${idxs.length} chunks for #${id}. Try again.`);
      for (const it of list) parts.push(inner(it).buffer);
      progress?.(Math.min(i + CHUNK_READ_BATCH, total), total);
    }
    const out = new Uint8Array(parts.reduce((n, c) => n + c.length, 0));
    let o = 0; for (const c of parts) { out.set(c, o); o += c.length; }
    return cfg.mangle ? cfg.mangle(out) : out;
  };

  const getGame = async (id: number): Promise<GameRow | null> => { const cv = await readCat('get-game', [uintCV(id)]); return isNone(cv) ? null : parseGame(inner(cv)); };
  const getVersion = async (id: number, ver: number): Promise<VersionRow | null> => { const cv = await readCat('get-version', [uintCV(id), uintCV(ver)]); return isNone(cv) ? null : parseVersion(inner(cv)); };

  /** The menu, read the way the Arcade page reads it: ten cards per call. */
  const readCatalogue = async (): Promise<Card[]> => {
    const count = Number(num(await readCat('get-count')));
    const cards: Card[] = [];
    for (let start = 1; start <= count; start += 10) {
      const list = inner(await readCat('get-page', [uintCV(start)])).list as any[];
      for (const c of list) {
        if (c.type !== ClarityType.OptionalSome) continue;
        const t = c.value.data;
        cards.push({ id: Number(t.id.value), game: parseGame(t.game), version: t.version.type === ClarityType.OptionalSome ? parseVersion(t.version.value) : null });
      }
    }
    return cards;
  };

  /** Flow A: the registered ROM, fetched from the named core and checked against the catalogue's hash. */
  const fetchRom = async (v: VersionRow, label: string, progress?: (done: number, total: number) => void): Promise<Uint8Array> => {
    if (v.core !== cfg.core) throw new WrapperError('other-core', `${label}: the catalogue names core ${v.core}; this wrapper reads ${cfg.core} only.`);
    const meta = await inscriptionMeta(v.ins);
    if (!meta || !meta.sealed) throw new WrapperError('not-sealed', `${label}: inscription #${v.ins} is missing or not sealed.`);
    if (meta.size !== v.size) throw new WrapperError('size', `${label}: inscription #${v.ins} is ${meta.size} bytes, the catalogue says ${v.size}.`);
    const bytes = await readChunks(v.ins, meta.chunks, progress);
    if (bytes.length !== v.size) throw new WrapperError('size', `${label}: read ${bytes.length} bytes, expected ${v.size}.`);
    if (romSha(bytes) !== v.sha) throw new WrapperError('hash', `${label}: the bytes read from #${v.ins} do not hash to the catalogue's ${v.sha.slice(0, 12)}…. Refusing to load them.`);
    return bytes;
  };

  /** Does the catalogue know a ROM with this canonical hash (revoked versions are not listed)? */
  const identify = async (sha: string): Promise<Match | null> => {
    const cv = await readCat('get-by-hash', [bufferCV(hexBytes(sha))]);
    if (isNone(cv)) return null;
    const t = inner(cv);
    const id = Number(t.data.id.value), ver = Number(t.data.ver.value);
    const [game, version] = await Promise.all([getGame(id), getVersion(id, ver)]);
    if (!game || !version) return null;
    return { id, ver, game, version, registeredIns: version.ins };
  };

  const parseIdInput = (raw: string): string => {
    const text = raw.trim();
    if (!text) throw new WrapperError('empty', 'Type an inscription number.');
    if (/[.:]/.test(text) && !/^#?\d+$/.test(text)) throw new WrapperError('other-core', `Only inscriptions on ${cfg.core} can be opened. Type just the number.`);
    const m = /^#?(\d{1,9})$/.exec(text);
    if (!m) throw new WrapperError('bad-id', 'An inscription id is a whole number, for example 3200.');
    return String(Number(m[1]));
  };

  /**
   * Flow D. Checks everything it can from metadata BEFORE fetching a chunk. The result is bytes plus an honest description of
   * what they are: a catalogue match (same hash as a registered game) or an unlisted ROM (play only). The caller must hand the
   * bytes to the emulator WITHOUT a sha256 (the hash here comes from the same bytes, so it proves nothing to the emulator).
   */
  const openById = async (raw: string, opts: { maxBytes?: number; progress?: (done: number, total: number) => void } = {}): Promise<OpenResult> => {
    const ins = parseIdInput(raw);
    const meta = await inscriptionMeta(ins);
    if (!meta) throw new WrapperError('missing', `There is no inscription #${ins} on ${cfg.core}.`);
    if (!meta.sealed) throw new WrapperError('not-sealed', `Inscription #${ins} is not sealed yet, so its bytes could still change. Open it once its creator has sealed it.`);
    if (meta.size === 0) throw new WrapperError('empty-file', `Inscription #${ins} is empty.`);
    const cap = opts.maxBytes ?? MAX_ROM_BYTES;
    if (meta.size > cap) throw new WrapperError('too-big', `Inscription #${ins} is ${meta.size.toLocaleString()} bytes; the biggest SNES ROM this page opens is ${cap.toLocaleString()}. Nothing was downloaded.`);
    const bytes = await readChunks(ins, meta.chunks, opts.progress);
    if (bytes.length !== meta.size) throw new WrapperError('size', `Read ${bytes.length} bytes of inscription #${ins}, expected ${meta.size}.`);
    const sha = romSha(bytes);
    const match = await identify(sha);
    return { ins, meta, bytes, sha, match, sameInscription: !!match && match.registeredIns === ins };
  };

  /** The sentence the page shows next to a ROM opened by ID. */
  const describeOpen = (r: OpenResult) =>
    r.match
      ? `Matches catalogue game ${r.match.game.title} v${r.match.ver} (opened inscription #${r.ins}${r.sameInscription ? ', the registered one' : `; the catalogue lists #${r.match.registeredIns}`}). Same bytes, same scoreboard.`
      : `Inscription #${r.ins} is not in the catalogue: unverified, play only, no scores. Made by ${r.meta.creator}.`;

  return { readCat, readCore, inscriptionMeta, readChunks, getGame, getVersion, readCatalogue, fetchRom, identify, openById, parseIdInput, describeOpen };
};
export type Wrapper = ReturnType<typeof createWrapper>;
