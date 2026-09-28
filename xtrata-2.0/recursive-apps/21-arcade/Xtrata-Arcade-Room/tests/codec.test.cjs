// Verifies score-client's hand-rolled Clarity/c32/post-condition codec against
// @stacks/transactions v6. Run: NODE_PATH=<dir with @stacks/transactions> node tests/codec.test.cjs
const assert = require('assert');
const path = require('path');
const T = require('@stacks/transactions');
const crypto = require('crypto');
global.window = undefined;
globalThis.location = { search: '', protocol: 'file:', origin: 'null', hostname: '' };
globalThis.addEventListener = () => {};
globalThis.crypto = crypto.webcrypto;
require(path.join(__dirname, '../modules/score-client.js'));
const C = globalThis.XAScores._codec;
let n = 0;
const ok = (c, m) => { assert.ok(c, m); n++; };
const eq = (a, b, m) => { assert.deepStrictEqual(a, b, m); n++; };

// sha256
for (const s of ['', 'abc', 'x'.repeat(200)]) {
  eq(C.bytesToHex(C.sha256(Buffer.from(s))), crypto.createHash('sha256').update(s).digest('hex'), 'sha256 ' + s.length);
}
// uint / ascii
for (const v of [0, 1, 255, 123456789, 2 ** 53 - 1]) eq(C.cvUint(v), '0x' + T.cvToHex(T.uintCV(v)).replace(/^0x/, ''), 'uint ' + v);
for (const s of ['xa_neon_snake', 'JIM', 'a b-c.d_9']) eq(C.cvAscii(s), '0x' + T.cvToHex(T.stringAsciiCV(s)).replace(/^0x/, ''), 'ascii ' + s);

// addresses round-trip
const addrs = ['SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X', 'SP000000000000000000002Q6VF78', 'SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'];
for (const a of addrs) {
  const d = C.c32decodeAddress(a);
  eq(C.c32address(d.version, d.hash160), a, 'c32 roundtrip ' + a);
  const ref = T.createAddress(a);
  eq(d.version, ref.version, 'version ' + a);
  eq(C.bytesToHex(d.hash160), ref.hash160, 'hash160 ' + a);
}
ok(!C.isMainnetAddress('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743Y'), 'checksum rejects typo');

// decode a real-shaped get-top10 result
const entry = (name, player, score, h) => T.someCV(T.tupleCV({ name: T.stringAsciiCV(name), player: T.standardPrincipalCV(player), score: T.uintCV(score), 'updated-at': T.uintCV(h) }));
const list = T.responseOkCV(T.listCV([entry('JIM', addrs[0], 9001, 150000), entry('ZED', addrs[2], 42, 150010), T.noneCV(), T.noneCV(), T.noneCV(), T.noneCV(), T.noneCV(), T.noneCV(), T.noneCV(), T.noneCV()]));
const dec = C.decodeCV(T.cvToHex(list));
eq(dec.type, 'ok');
eq(dec.value.value.length, 10);
const first = dec.value.value[0].value.value;
eq(first.name.value, 'JIM'); eq(first.player.value, addrs[0]); eq(first.score.value, 9001n); eq(first['updated-at'].value, 150000n);
eq(dec.value.value[1].value.value.player.value, addrs[2]);
eq(dec.value.value[2].type, 'none');
// contract principal
eq(C.decodeCV(T.cvToHex(T.contractPrincipalCV(addrs[0], 'xtrata-arcade-scores-v1-3'))).value, addrs[0] + '.xtrata-arcade-scores-v1-3');

// post condition wire format
for (const [a, amt] of [[addrs[0], 30000], [addrs[2], 1000000]]) {
  const ref = T.makeStandardSTXPostCondition(a, T.FungibleConditionCode.LessEqual, amt);
  const refHex = Buffer.from(T.serializePostCondition(ref)).toString('hex');
  eq(C.stxPostConditionHex(a, amt), '0x' + refHex, 'post-condition ' + a);
}
console.log('codec tests passed:', n);
