#!/usr/bin/env node
/** Actual Clarity simulation, not mocked contract responses. Never loads wallet secrets. */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareNumberedJpegs } from './prepare-numbered-jpegs.mjs';
import { killSwitchEngaged } from './inscribe.mjs';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(join(project, 'contracts/clarinet/package.json'));
const { initSimnet } = require('@stacks/clarinet-sdk');
const { Cl } = require('@stacks/transactions');
const sha = b => createHash('sha256').update(b).digest('hex');
const rolling = chunks => chunks.reduce((h,c) => createHash('sha256').update(h).update(c).digest(), Buffer.alloc(32));
export async function runCollectionV15({ output = resolve(project, '../media/wizard-numbered-jpegs') } = {}) {
  const report = { mode: 'local Clarity simulation', mainnetTransactions: 0, killSwitch: killSwitchEngaged(), checks: [], items: [], status: 'running' };
  await mkdir(output, { recursive: true });
  const check = (name, actual, expected) => { assert.deepEqual(actual, expected, name); report.checks.push(name); };
  try {
    const source = await readFile(join(project,'contracts/live/xtrata-collection-mint-v1.5.clar'));
    report.sourceSha256 = sha(source);
    check('pinned helper source', report.sourceSha256, '0f2dcba375a863a8c3c4ef8516d81fbd305a3c208961a85612f3ee9eb38ede57');
    const simulationSource = await readFile(join(project, 'contracts/clarinet/contracts/xtrata-collection-mint-v1.5.clar'), 'utf8');
    check('simulation matches pinned helper except local core principal', simulationSource, source.toString().replaceAll("'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3", '.xtrata-v3-2-3'));
    const manifest = await prepareNumberedJpegs(output);
    const simnet = await initSimnet(join(project, 'contracts/clarinet/Clarinet.toml'));
    const accounts = simnet.getAccounts();
    const admin = accounts.get('deployer'), buyer = accounts.get('wallet_1'), other = accounts.get('wallet_2');
    const helper = 'xtrata-collection-mint-v1-5', core = 'xtrata-v3-2-3';
    const target = Cl.contractPrincipal(admin, core);
    const pub = (fn,args=[],who=buyer) => simnet.callPublicFn(helper,fn,args,who);
    const read = (fn,args=[]) => simnet.callReadOnlyFn(helper,fn,args,buyer).result;
    const coreRead = (fn,args=[]) => simnet.callReadOnlyFn(core,fn,args,buyer).result;
    const ok = (name, receipt) => { check(name, receipt.result.type, Cl.ok(Cl.bool(true)).type); return receipt.result.value; };
    ok('enable simulated core', simnet.callPublicFn(core,'set-paused',[Cl.bool(false)],admin));
    check('locked core',read('get-locked-core-contract'),Cl.ok(target));
    ok('set simulated supply',pub('set-max-supply',[Cl.uint(10)],admin));
    const assets = [];
    for (const item of manifest.items) {
      const bytes = await readFile(join(output,item.filename));
      const chunks = []; for(let i=0;i<bytes.length;i+=16384) chunks.push(bytes.subarray(i,i+16384));
      const hash = rolling(chunks), uri = `https://example.invalid/numbered/${item.filename}`;
      check(`JPEG ${item.number} manifest hash`,hash.toString('hex'),item.rollingHash);
      ok(`register JPEG ${item.number}`,pub('set-registered-token-uri',[Cl.buffer(hash),Cl.stringAscii(uri)],admin));
      assets.push({ ...item, bytes, chunks, hash, uri });
    }
    ok('unpause simulated helper',pub('set-paused',[Cl.bool(false)],admin));
    const declaration = a => [target,Cl.buffer(a.hash),Cl.stringAscii('image/jpeg'),Cl.uint(a.bytes.length)];
    const begin = (a,who=buyer) => pub('mint-begin',[...declaration(a),Cl.uint(a.chunks.length)],who);
    const upload = a => pub('mint-add-chunk-batch',[target,Cl.buffer(a.hash),Cl.list(a.chunks.map(Cl.buffer))]);
    const small = a => pub('mint-small-single-tx',[...declaration(a),Cl.list(a.chunks.map(Cl.buffer)),Cl.stringAscii(a.uri)]);
    const first = assets[0];
    ok('buyer A reserves',begin(first));
    check('buyer B cannot steal reservation',begin(first,other).result,Cl.error(Cl.uint(124)));
    ok('buyer A cancels',pub('cancel-reservation',[Cl.buffer(first.hash)]));
    check('cancellation clears counter',read('get-reserved-count'),Cl.ok(Cl.uint(0)));
    ok('buyer B can reserve after cancellation',begin(first,other));
    ok('buyer B cancels',pub('cancel-reservation',[Cl.buffer(first.hash)],other));
    for (const a of assets.slice(0,4)) { ok(`begin ${a.number}`,begin(a)); ok(`upload ${a.number}`,upload(a)); ok(`seal ${a.number}`,pub('mint-seal',[target,Cl.buffer(a.hash),Cl.stringAscii(a.uri)])); }
    for (const a of assets.slice(4,8)) ok(`atomic ${a.number}`,small(a));
    for (const a of assets.slice(8)) { ok(`batch begin ${a.number}`,begin(a)); ok(`batch upload ${a.number}`,upload(a)); }
    ok('seal two-item batch',pub('mint-seal-batch',[target,Cl.list(assets.slice(8).map(a=>Cl.tuple({hash:Cl.buffer(a.hash),'token-uri':Cl.stringAscii(a.uri)})))]));
    for (const [index,a] of assets.entries()) {
      const mapping = coreRead('get-id-by-hash',[Cl.buffer(a.hash)]);
      check(`hash ${a.number} resolves`,mapping.type,Cl.some(Cl.uint(0)).type);
      const id = mapping.value;
      check(`owner ${a.number}`,coreRead('get-owner',[id]),Cl.ok(Cl.some(Cl.principal(buyer))));
      for (const [i,chunk] of a.chunks.entries()) check(`reconstruct ${a.number}/${i}`,coreRead('get-chunk',[id,Cl.uint(i)]),Cl.some(Cl.buffer(chunk)));
      check(`reservation ${a.number} cleared`,read('get-reservation',[Cl.principal(buyer),Cl.buffer(a.hash)]),Cl.none());
      check(`hash lock ${a.number} cleared`,read('get-hash-reservation',[Cl.buffer(a.hash)]),Cl.none());
      const context = read('get-token-mint-context',[id]);
      check(`receipt ${a.number} exists`,context.type,Cl.some(Cl.uint(0)).type);
      check(`receipt ${a.number} owner`,context.value.value.owner,Cl.principal(buyer));
      check(`receipt ${a.number} phase`,context.value.value['phase-id'],Cl.uint(0));
      check(`index ${a.number}`,read('get-minted-id',[Cl.uint(index)]),Cl.some(Cl.tuple({'token-id':id})));
      check(`duplicate ${a.number} rejected`,small(a).result,Cl.error(Cl.uint(122)));
      report.items.push({ number:a.number, tokenId:Cl.prettyPrint(id), rollingHash:a.rollingHash, path:index<4?'staged':index<8?'atomic':'batch', receipt:Cl.prettyPrint(context) });
    }
    check('minted count',read('get-minted-count'),Cl.ok(Cl.uint(10)));
    check('minted index count',read('get-minted-index-count'),Cl.ok(Cl.uint(10)));
    check('reserved count',read('get-reserved-count'),Cl.ok(Cl.uint(0)));
    report.status = 'passed';
    return report;
  } catch(error) { report.status = 'failed'; report.error = error.message; throw error; }
  finally { await writeFile(join(output,'v15-test-report.json'),JSON.stringify(report,null,2)+'\n'); }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some(a => a !== '--dry')) throw new Error('Only --dry is supported. This runner cannot sign or broadcast mainnet transactions.');
  const report = await runCollectionV15();
  console.log(JSON.stringify({ status:report.status,mode:report.mode,checks:report.checks.length,items:report.items.length,mainnetTransactions:0 },null,2));
}
