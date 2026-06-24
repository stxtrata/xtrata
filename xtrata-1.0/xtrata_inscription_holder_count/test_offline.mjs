import { run, decodeOwner } from './xtrata_holders.mjs';
import * as T from '@stacks/transactions';
import { readFileSync } from 'node:fs';

const ser = (cv) => { const s = T.serializeCV(cv); return (typeof s === 'string' ? s : Buffer.from(s).toString('hex')); };
const okSome = (p) => '0x' + ser(T.responseOkCV(T.someCV(p)));
const okNone = () => '0x' + ser(T.responseOkCV(T.noneCV()));
const stdP = (a) => T.standardPrincipalCV(a);
const conP = (a, n) => T.contractPrincipalCV(a, n);
const uhex = (n) => '0x' + (typeof T.serializeCV(T.uintCV(n)) === 'string' ? T.serializeCV(T.uintCV(n)) : Buffer.from(T.serializeCV(T.uintCV(n))).toString('hex'));

const W1 = 'SP3BK1NNSWN719Z6KDW05RBGVS940YCN6X84STYPR';
const W2 = 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173';
const W3 = 'SP176ZMV706NZGDDX8VSQRGMB7QN33BBDVZ6BMNHD';
const MKT = 'SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S.marketplace-v4';

const C1 = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v1-1-1';
const C2 = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v2-1-0';

// token table per contract: id -> {minter, owner(hex)}
const DATA = {
  [C1]: { asset: 'xtrata', tokens: {
    1: { minter: W1, owner: okSome(stdP(W1)) },
    2: { minter: W2, owner: okSome(stdP(W2)) },
    3: { minter: W1, owner: okNone() },              // burned
  }},
  [C2]: { asset: 'inscription', tokens: {
    1: { minter: W2, owner: okSome(stdP(W2)) },      // W2 holds in both contracts
    2: { minter: W3, owner: okSome(conP('SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S','marketplace-v4')) }, // listed
  }},
};

// map uint-hex -> id for owner lookups
const idByHex = {}; for (let i=1;i<=3;i++) idByHex[uhex(i)] = i;

global.fetch = async (url, opts={}) => {
  const u = new URL(url);
  const path = u.pathname;
  const json = (o) => ({ ok:true, status:200, headers:new Map(), json:async()=>o, text:async()=>JSON.stringify(o) });

  // interface
  let m = path.match(/\/v2\/contracts\/interface\/([^/]+)\/([^/]+)$/);
  if (m) {
    const cid = `${m[1]}.${m[2]}`;
    return json({ functions:[{name:'get-owner',access:'read_only',args:[{name:'id',type:'uint128'}]}],
                  non_fungible_tokens:[{name:DATA[cid].asset}], fungible_tokens:[] });
  }
  // mints
  if (path.endsWith('/extended/v1/tokens/nft/mints')) {
    const asset = u.searchParams.get('asset_identifier');           // cid::asset
    const cid = asset.split('::')[0];
    const toks = DATA[cid].tokens;
    const results = Object.keys(toks).map(id => ({ recipient: toks[id].minter, value:{ hex: uhex(+id), repr:`u${id}` } }));
    return json({ limit:200, offset:0, total:results.length, results });
  }
  // call-read get-owner
  m = path.match(/\/v2\/contracts\/call-read\/([^/]+)\/([^/]+)\/get-owner$/);
  if (m) {
    const cid = `${m[1]}.${m[2]}`;
    const body = JSON.parse(opts.body);
    const id = idByHex[body.arguments[0]];
    return json({ okay:true, result: DATA[cid].tokens[id].owner });
  }
  throw new Error('unmocked ' + path);
};

// quick decode unit checks
console.assert(decodeOwner(okSome(stdP(W1))).owner === W1, 'decode std');
console.assert(decodeOwner(okNone()).none === true, 'decode none');
console.assert(decodeOwner(okSome(conP('SPNWZ5V2TPWGQGVDR6T7B6RQ4XMGZ4PXTEE0VQ0S','marketplace-v4'))).owner === MKT, 'decode contract');

const r = await run({ contracts:[C1,C2], outDir:'/tmp/xt_test', concurrency:4 });

const cur = readFileSync('/tmp/xt_test/holders_current.csv','utf8').trim().split('\n');
const min = readFileSync('/tmp/xt_test/minters.csv','utf8').trim().split('\n');
const det = readFileSync('/tmp/xt_test/detailed.csv','utf8').trim().split('\n');

console.log('\n--- assertions ---');
const eq=(a,b,msg)=>console.log((JSON.stringify(a)===JSON.stringify(b)?'PASS':'FAIL')+' '+msg+'  got='+JSON.stringify(a));
eq(cur.sort(), [W1,W2].sort(), 'current wallets = W1,W2 (W2 in both, marketplace excluded, burned excluded)');
eq(min.sort(), [W1,W2,W3].sort(), 'minter wallets = W1,W2,W3');
eq(r.inAllThree.sort(), [W2].sort(), 'holds in ALL contracts = W2');
eq(r.contractsCurrent, [MKT], 'contract/escrow holder = marketplace');
console.log('detailed.csv:');
det.forEach(l=>console.log('   '+l));
