import { initSimnet } from '@stacks/clarinet-sdk';
import { Cl } from '@stacks/transactions';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const simnet = await initSimnet('./Clarinet.toml');
const a = simnet.getAccounts();
const deployer = a.get('deployer');
const w1 = a.get('wallet_1');
const V324 = 'xtrata-v3-2-4';
const V323 = 'xtrata-v3-2-3';
const CHUNK = 16384;
const mime = 'text/plain';

let pass = 0, fail = 0; const fails = [];
const pp = (r) => Cl.prettyPrint(r.result);
const isOk = (r) => r.result.type === 'ok';
const isErr = (r, c) => !isOk(r) && pp(r).includes(`u${c}`);
const check = (n, c, e = '') => { if (c) pass++; else { fail++; fails.push(n + (e ? `  >> ${e}` : '')); } };
const hash32 = (b) => Buffer.alloc(32, b & 0xff);
const full = (v) => Buffer.alloc(CHUNK, v & 0xff);
const sha = (b) => createHash('sha256').update(b).digest();
const roll = (cs) => { let h = Buffer.alloc(32, 0); for (const c of cs) h = sha(Buffer.concat([h, c])); return h; };
const begin = (C, hb, size, n) => simnet.callPublicFn(C, 'begin-inscription', [Cl.buffer(hb), Cl.stringAscii(mime), Cl.uint(size), Cl.uint(n)], w1);
const mint1 = (C, cs, uri) => { const h = roll(cs); return simnet.callPublicFn(C, 'mint-single-tx', [Cl.buffer(h), Cl.stringAscii(mime), Cl.uint(cs.length * CHUNK), Cl.list(cs.map((c) => Cl.buffer(c))), Cl.stringAscii(uri)], w1); };
const tid = (r) => r.result.value.value['token-id'].value;

// 1) source / cap / trait / migration presence
const cl = readFileSync(new URL('../contracts/xtrata-v3.2.4.clar', import.meta.url), 'utf8');
const live = readFileSync(new URL('../../live/xtrata-v3.2.4.clar', import.meta.url), 'utf8');
check('cap u8192 in clarinet + live', cl.includes('(define-constant MAX-TOTAL-CHUNKS u8192)') && live.includes('(define-constant MAX-TOTAL-CHUNKS u8192)'));
check('migrate-from-v3-2-3 present in both', cl.includes('(define-public (migrate-from-v3-2-3') && live.includes('(define-public (migrate-from-v3-2-3'));
check('no size-gate min — handles all sizes', !cl.includes('MIN-TOTAL-CHUNKS'));
check('clarinet local trait / live mainnet trait', cl.includes('(impl-trait .sip009-nft-trait.nft-trait)') && live.includes("(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)"));

simnet.callPublicFn(V324, 'set-paused', [Cl.bool(false)], deployer);
simnet.callPublicFn(V323, 'set-paused', [Cl.bool(false)], deployer);

// 2) handles the full size range (no lower gate, 128 MiB upper)
check('v3.2.4 accepts 1 chunk (small)', isOk(begin(V324, hash32(0x01), CHUNK, 1)));
check('v3.2.4 accepts 2049 chunks (>32 MiB)', isOk(begin(V324, hash32(0x02), 2049 * CHUNK, 2049)));
check('v3.2.4 accepts 8192 chunks (128 MiB max)', isOk(begin(V324, hash32(0x03), 8192 * CHUNK, 8192)));
check('v3.2.4 rejects 8193 chunks (u102)', isErr(begin(V324, hash32(0x04), 8192 * CHUNK, 8193), 102));
const mSmall = mint1(V324, [full(0xaa)], 'data:,small');
check('v3.2.4 small single-tx mint ok', isOk(mSmall), pp(mSmall));

// 3) migrate-from-v3-2-3 preserves id, owner, deps AND parents
const base = mint1(V323, [full(0x11)], 'data:,base');
check('v3.2.3 base mint ok', isOk(base), pp(base));
const idA = tid(base);
const child = simnet.callPublicFn(V323, 'mint-single-tx-with-relationships',
  [Cl.buffer(roll([full(0x22)])), Cl.stringAscii(mime), Cl.uint(CHUNK), Cl.list([Cl.buffer(full(0x22))]), Cl.stringAscii('data:,child'), Cl.list([Cl.uint(idA)]), Cl.list([Cl.uint(idA)])], w1);
check('v3.2.3 child mint with parent+dep ok', isOk(child), pp(child));
const idB = tid(child);

const mig = simnet.callPublicFn(V324, 'migrate-from-v3-2-3', [Cl.uint(idB)], w1);
check('migrate-from-v3-2-3 ok', isOk(mig), pp(mig));
check('migrated id preserved + owned by migrator on v3.2.4', pp(simnet.callReadOnlyFn(V324, 'get-owner', [Cl.uint(idB)], deployer)).includes(w1));
check('migrated dependencies carried over', pp(simnet.callReadOnlyFn(V324, 'get-dependencies', [Cl.uint(idB)], deployer)).includes(`u${idA}`));
check('migrated parents carried over', pp(simnet.callReadOnlyFn(V324, 'get-parents', [Cl.uint(idB)], deployer)).includes(`u${idA}`));
check('migration-source records v3.2.3', pp(simnet.callReadOnlyFn(V324, 'get-migration-source', [Cl.uint(idB)], deployer)).includes('xtrata-v3-2-3'));
check('legacy token escrowed into v3.2.4 on v3.2.3', pp(simnet.callReadOnlyFn(V323, 'get-owner', [Cl.uint(idB)], deployer)).includes('xtrata-v3-2-4'));
check('re-migrating same id is rejected (duplicate u114)', isErr(simnet.callPublicFn(V324, 'migrate-from-v3-2-3', [Cl.uint(idB)], w1), 114));

console.log(`\nxtrata-v3-2-4: ${pass} passed, ${fail} failed`);
if (fail) { console.log('FAILURES:\n' + fails.join('\n')); process.exit(1); }
