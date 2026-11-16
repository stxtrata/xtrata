// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { boolCV, bufferCV, cvToJSON, noneCV, responseOkCV, someCV, standardPrincipalCV, tupleCV, uintCV, cvToHex, type ClarityValue } from '@stacks/transactions';
import { AWARDS_ID, AWARDS_NAME, CLASSES, CORE, DROP, FUND_MINIMUM, inspect, OWNER, planTemplate, STEP_ORDER, steps, TOTAL_AWARDS, type ClassKey, type LaunchInputs, type Reader } from '../awards-launch';
import { AWARD_CLASS } from '../../music-awards/record';
import { AWARDS_CONTRACT, AWARDS_DROP } from '../../listening-wallet/tx';
import rawSource from '../../../../contracts/live/xtrata-music-awards-v1.0.clar?raw';
import rawDiamond from '../../../../public/awards/diamond.html?raw';
import rawClassic from '../../../../public/awards/classic.html?raw';

const file = (k: string) => new Uint8Array(readFileSync(`public/awards/${k}.html`));
const SOURCE = readFileSync('contracts/live/xtrata-music-awards-v1.0.clar', 'utf8');
const templates = Object.fromEntries(CLASSES.map((c) => [c.key, file(c.key)])) as Record<ClassKey, Uint8Array>;
const SIGNER = 'ab'.repeat(20);
const input = (over: Partial<LaunchInputs> = {}): LaunchInputs => ({ templates, source: SOURCE, signerHash: SIGNER, ...over });

/** A pretend chain that answers with real Clarity values, so the shapes the code parses are the library's own. */
function world() {
  const w = {
    corePaused: false, ids: new Map<string, number>(), chunks: new Map<string, Uint8Array>(), deployed: null as null | { source: string; clarityVersion: number | null },
    owner: OWNER, paused: false, balance: 0n, signer: null as string | null, classes: new Map<number, { template: number; cap: number; minted: number }>(), down: false, calls: [] as string[]
  };
  const reader: Reader = {
    async read(c, fn, args) {
      if (w.down) throw new Error('chain down');
      w.calls.push(`${c.name}.${fn}`);
      const a = args.map((x) => cvToJSON(x));
      const j = (v: ClarityValue) => cvToJSON(v);
      if (c.name === CORE.name) {
        if (fn === 'is-paused') return j(responseOkCV(boolCV(w.corePaused)));
        if (fn === 'quote-single-tx-fee') return j(responseOkCV(tupleCV({ mode: uintCV(1), 'total-fee': uintCV(100_000 + 2_000 * Number(a[1].value)), 'single-tx-fee': uintCV(1) })));
        if (fn === 'get-id-by-hash') { const id = w.ids.get(String(a[0].value).replace(/^0x/, '')); return j(id === undefined ? noneCV() : someCV(uintCV(id))); }
        if (fn === 'get-chunk') { const b = w.chunks.get(`${a[0].value}:${a[1].value}`); return j(b ? someCV(bufferCV(b)) : noneCV()); }
      }
      if (c.name === AWARDS_NAME && w.deployed) {
        if (fn === 'get-contract-owner') return j(responseOkCV(standardPrincipalCV(w.owner)));
        if (fn === 'is-paused') return j(responseOkCV(boolCV(w.paused)));
        if (fn === 'get-balance') return j(responseOkCV(uintCV(w.balance)));
        if (fn === 'get-signer-hash') return j(responseOkCV(w.signer ? someCV(bufferCV(Buffer.from(w.signer, 'hex'))) : noneCV()));
        if (fn === 'get-class') { const k = w.classes.get(Number(a[1].value)); return j(k ? someCV(tupleCV({ template: uintCV(k.template), cap: uintCV(k.cap), minted: uintCV(k.minted) })) : noneCV()); }
      }
      throw new Error(`unexpected read ${c.name}.${fn}`);
    },
    async contract() { if (w.down) throw new Error('chain down'); return w.deployed; }
  };
  /** Put a template on the pretend chain exactly as the plan would inscribe it. */
  const inscribe = (key: ClassKey, id: number, bytes = templates[key]) => { const p = planTemplate(key, templates[key]); w.ids.set(p.hash, id); planTemplate(key, bytes).chunks.forEach((c, i) => w.chunks.set(`${id}:${i}`, c)); };
  const status = async (server: Parameters<typeof steps>[1] = { enabled: false }, over: Partial<LaunchInputs> = {}) => { const s = await inspect(reader, input(over)); return { s, list: steps(s, server), next: steps(s, server).find((x) => x.status === 'next')?.id ?? null, problems: steps(s, server).filter((x) => x.status === 'problem').map((x) => x.id) }; };
  return { w, reader, inscribe, status };
}
const allTemplates = (x: ReturnType<typeof world>) => CLASSES.forEach((c, i) => x.inscribe(c.key, 9000 + i));
const allClasses = (x: ReturnType<typeof world>) => CLASSES.forEach((c, i) => x.w.classes.set(c.id, { template: 9000 + i, cap: c.cap, minted: 0 }));

describe('the launch plan matches everything else in the repo', () => {
  it('classes, caps, contract and drop are the ones the server and the wallet box use', () => {
    expect(Object.fromEntries(CLASSES.map((c) => [c.key, c.id]))).toEqual(AWARD_CLASS);
    expect(CLASSES.map((c) => c.cap)).toEqual([5, 10, 20, 100, 865]);
    expect(TOTAL_AWARDS).toBe(1000);
    expect(AWARDS_ID).toBe(AWARDS_CONTRACT);
    expect(DROP).toBe(AWARDS_DROP);
  });
  it('the contract is written for Clarity 4, the version wallets publish at: no bare as-contract anywhere', () => {
    const code = SOURCE.split('\n').filter((l) => !l.trim().startsWith(';;')).join('\n');
    expect(code).not.toMatch(/\(as-contract\s/);
    expect(code).toMatch(/as-contract\? \(\(with-stx fee\)\)/);
    expect(code).toContain('current-contract');
  });
  it('a template plan is the whole file: its size, its chunks and the hash Xtrata will compute', () => {
    for (const c of CLASSES) {
      const bytes = file(c.key), p = planTemplate(c.key, bytes);
      expect(p.size).toBe(bytes.length);
      expect(Buffer.concat(p.chunks.map((x) => Buffer.from(x))).equals(Buffer.from(bytes))).toBe(true);
      expect(p.chunks.every((x) => x.length <= 16384)).toBe(true);
      let h = Buffer.alloc(32); for (const x of p.chunks) h = createHash('sha256').update(h).update(x).digest();
      expect(p.hash).toBe(h.toString('hex'));
      expect(p.sha256).toBe(createHash('sha256').update(bytes).digest('hex'));
    }
    expect(new Set(CLASSES.map((c) => planTemplate(c.key, file(c.key)).hash)).size).toBe(5); // five different files
  });
});

describe('what the page embeds is the files, byte for byte', () => {
  it('a ?raw import encoded as UTF-8 equals the file on disk (templates and contract)', () => {
    const same = (raw: string, path: string) => Buffer.from(new TextEncoder().encode(raw)).equals(readFileSync(path));
    expect(same(rawDiamond, 'public/awards/diamond.html')).toBe(true);
    expect(same(rawClassic, 'public/awards/classic.html')).toBe(true);
    expect(same(rawSource, 'contracts/live/xtrata-music-awards-v1.0.clar')).toBe(true);
    for (const c of CLASSES) { const b = readFileSync(`public/awards/${c.key}.html`); expect(b.includes(0x0d)).toBe(false); expect(b[0]).not.toBe(0xef); } // no CRLF, no BOM
    expect(SOURCE.includes('\r')).toBe(false);
  });
});

describe('what is next, read from the chain', () => {
  it('starts at the first template and walks the whole order, one step at a time', async () => {
    const x = world(); const seen: string[] = [];
    const go = async (server?: any) => { const r = await x.status(server); seen.push(r.next ?? 'finished'); expect(r.problems).toEqual([]); expect(r.list.filter((s) => s.status === 'next').length).toBeLessThanOrEqual(1); return r; };
    for (const [i, c] of CLASSES.entries()) { await go(); x.inscribe(c.key, 9000 + i); }
    await go(); x.w.deployed = { source: SOURCE, clarityVersion: 4 };
    for (const [i, c] of CLASSES.entries()) { await go(); x.w.classes.set(c.id, { template: 9000 + i, cap: c.cap, minted: 0 }); }
    await go(); x.w.signer = SIGNER;
    const beforeFund = await go(); x.w.balance = FUND_MINIMUM(beforeFund.s.recordFee);
    await go();
    await go({ enabled: true, contract: AWARDS_ID, drop: 1 }); x.w.classes.get(5)!.minted = 1;
    await go({ enabled: true, contract: AWARDS_ID, drop: 1 });
    expect(seen).toEqual([...STEP_ORDER, 'finished']);
  });

  it('a template counts only when every byte on chain is the file: a different file under that hash is a problem, and everything stops', async () => {
    const x = world();
    x.inscribe('diamond', 9000, file('gold'));
    const r = await x.status();
    expect(r.problems).toEqual(['template:diamond']);
    expect(r.next).toBeNull();
    expect(r.list.slice(1).every((s) => s.status === 'locked')).toBe(true);
  });

  it('a contract of that name with any other source is a hard stop, and nothing on it is read as ours', async () => {
    const x = world(); allTemplates(x);
    x.w.deployed = { source: SOURCE + '\n;; one more line', clarityVersion: 4 };
    const r = await x.status();
    expect(r.problems).toEqual(['deploy']);
    expect(r.next).toBeNull();
    expect(x.w.calls.filter((c) => c.startsWith(AWARDS_NAME))).toEqual([]);
  });

  it('a class pointing at the wrong template or with the wrong cap is a problem, not "done"', async () => {
    const x = world(); allTemplates(x); x.w.deployed = { source: SOURCE, clarityVersion: 4 }; allClasses(x);
    x.w.classes.set(2, { template: 9000, cap: 10, minted: 0 }); // gold pointing at the diamond template
    expect((await x.status()).problems).toEqual(['class:gold']);
    x.w.classes.set(2, { template: 9001, cap: 11, minted: 0 });
    expect((await x.status()).problems).toEqual(['class:gold']);
    x.w.classes.set(2, { template: 9001, cap: 10, minted: 0 });
    expect((await x.status()).next).toBe('signer');
  });

  it('the signer must be the hash that was entered; a different one on chain is a problem', async () => {
    const x = world(); allTemplates(x); x.w.deployed = { source: SOURCE, clarityVersion: 4 }; allClasses(x);
    expect((await x.status({ enabled: false }, { signerHash: null })).next).toBe('signer');
    x.w.signer = 'cd'.repeat(20);
    expect((await x.status()).problems).toEqual(['signer']);
    x.w.signer = SIGNER;
    expect((await x.status()).next).toBe('fund');
  });

  it('a server that is on but pointing somewhere else is a problem', async () => {
    const x = world(); allTemplates(x); x.w.deployed = { source: SOURCE, clarityVersion: 4 }; allClasses(x); x.w.signer = SIGNER; x.w.balance = 1_000_000n;
    expect((await x.status({ enabled: false })).next).toBe('server');
    expect((await x.status(null)).next).toBe('server');
    expect((await x.status({ enabled: true, contract: OWNER + '.something-else', drop: 1 })).problems).toEqual(['server']);
    expect((await x.status({ enabled: true, contract: AWARDS_ID, drop: 2 })).problems).toEqual(['server']);
    expect((await x.status({ enabled: true, contract: AWARDS_ID, drop: 1 })).next).toBe('claim');
  });

  it('a contract owned by anyone but xtrata.btc is a problem', async () => {
    const x = world(); allTemplates(x); x.w.deployed = { source: SOURCE, clarityVersion: 4 }; x.w.owner = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
    expect((await x.status()).problems).toEqual(['deploy']);
  });

  it('when the chain cannot be read there is no state at all: an error, never a guess', async () => {
    const x = world(); x.w.down = true;
    await expect(inspect(x.reader, input())).rejects.toThrow(/chain down/);
  });
});

describe('pasting the signer hash', () => {
  it('accepts it as the key script prints it, with 0x on the front', async () => {
    const { cleanSignerHash, isSignerHash } = await import('../awards-launch');
    const printed = '  0x77335A9EBDF3322F2461B00346268B6451A7D40D ';
    expect(isSignerHash(printed)).toBe(false);
    expect(cleanSignerHash(printed)).toBe('77335a9ebdf3322f2461b00346268b6451a7d40d');
    expect(isSignerHash(cleanSignerHash(printed))).toBe(true);
    expect(isSignerHash(cleanSignerHash('0x1234'))).toBe(false);
  });
});
