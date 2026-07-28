// Sponsored-mint tests for the v3.2.4 candidate (payer != owner).
//
// Run from the Clarinet project root with the candidate registered as
// `xtrata-v3-2-4`. See MIGRATION-PLAN.md step P2 for the exact invocation.
//
// The invariant under test: the SIGNER pays the protocol fee, the RECIPIENT
// receives the inscription and is recorded as its creator. Everything that
// existed in v3.2.3 must keep charging and minting to the signer.
import { initSimnet } from '@stacks/clarinet-sdk';
import { Cl } from '@stacks/transactions';
import { createHash } from 'node:crypto';

const simnet = await initSimnet('./Clarinet.toml');
const a = simnet.getAccounts();
const payer = a.get('wallet_1');
const author = a.get('wallet_2');

const C = 'xtrata-v3-2-4';
const CHUNK = 16384;

// Cores deploy paused. Everything below returns ERR-PAUSED (u109) without this.
simnet.callPublicFn(C, 'set-paused', [Cl.bool(false)], a.get('deployer'));
const sha = (b) => createHash('sha256').update(b).digest();
const roll = (cs) => {
  let h = Buffer.alloc(32, 0);
  for (const c of cs) h = sha(Buffer.concat([h, c]));
  return h;
};

let pass = 0;
const fails = [];
const check = (name, cond, extra = '') => {
  if (cond) pass++;
  else fails.push(name + (extra ? `  >> ${extra}` : ''));
};
const pp = (r) => Cl.prettyPrint(r.result);
const stxOf = (who) => simnet.getAssetsMap().get('STX')?.get(who) ?? 0n;

const mintTo = (recipient, body, uri, sender) => {
  const chunks = [Buffer.from(body)];
  return simnet.callPublicFn(
    C,
    'mint-single-tx-to',
    [
      Cl.principal(recipient),
      Cl.buffer(roll(chunks)),
      Cl.stringAscii('text/plain'),
      Cl.uint(body.length),
      Cl.list(chunks.map((c) => Cl.buffer(c))),
      Cl.stringAscii(uri)
    ],
    sender
  );
};

// --- 1. The happy path: publisher pays, author owns ---------------------------
const payerBefore = stxOf(payer);
const authorBefore = stxOf(author);
const res = mintTo(author, 'sponsored article one', 'data:,one', payer);
check('sponsored mint returns ok', res.result.type === 'ok', pp(res));

const tokenId = 0;
const owner = pp(simnet.callReadOnlyFn(C, 'get-owner', [Cl.uint(tokenId)], payer));
check('recipient owns the inscription', owner.includes(author), owner);
check('payer does NOT own the inscription', !owner.includes(payer), owner);

const meta = pp(simnet.callReadOnlyFn(C, 'get-inscription-meta', [Cl.uint(tokenId)], payer));
check('recipient is recorded as creator', meta.includes(author), meta);

// --- 2. The money actually moved from the signer, not the recipient -----------
const payerSpent = payerBefore - stxOf(payer);
const authorSpent = authorBefore - stxOf(author);
check('payer was charged the protocol fee', payerSpent > 0n, `payer delta ${payerSpent}`);
check('recipient was charged nothing', authorSpent === 0n, `author delta ${authorSpent}`);

const quoted = simnet.callReadOnlyFn(
  C,
  'quote-single-tx-fee',
  [Cl.uint(CHUNK), Cl.uint(1)],
  payer
);
check('quote-single-tx-fee still answers', quoted.result.type === 'ok', pp(quoted));

// --- 3. An author with a zero balance can still be published to ---------------
// This is the whole point: the writer never needs a funded wallet.
const broke = a.get('wallet_3');
simnet.transferSTX(stxOf(broke), payer, broke); // drain wallet_3
const brokeRes = mintTo(broke, 'sponsored article two', 'data:,two', payer);
check('unfunded recipient can receive an inscription', brokeRes.result.type === 'ok', pp(brokeRes));

// --- 4. Regression: the un-suffixed functions are unchanged -------------------
const chunks = [Buffer.from('self funded')];
const plain = simnet.callPublicFn(
  C,
  'mint-single-tx',
  [
    Cl.buffer(roll(chunks)),
    Cl.stringAscii('text/plain'),
    Cl.uint(chunks[0].length),
    Cl.list(chunks.map((c) => Cl.buffer(c))),
    Cl.stringAscii('data:,self')
  ],
  author
);
check('plain mint-single-tx still ok', plain.result.type === 'ok', pp(plain));
const plainId = Number(/token-id:\s*u(\d+)/.exec(pp(plain))?.[1] ?? -1);
const plainOwner = pp(simnet.callReadOnlyFn(C, 'get-owner', [Cl.uint(plainId)], author));
check('plain mint still mints to the signer', plainOwner.includes(author), plainOwner);

// --- 5. Recipient may be a contract principal --------------------------------
const asContract = mintTo(
  `${simnet.deployer}.xtrata-v3-2-3`,
  'to a contract',
  'data:,contract',
  payer
);
check('contract principal is a valid recipient', asContract.result.type === 'ok', pp(asContract));

console.log(`\nxtrata-v3-2-4 sponsored mints: ${pass} passed, ${fails.length} failed`);
for (const f of fails) console.log('  FAIL ' + f);
if (fails.length) process.exit(1);
