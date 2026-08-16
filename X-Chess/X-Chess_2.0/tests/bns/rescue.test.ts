// The rules that keep the rescue from being the disaster it is preventing.
//
// This tool signs with keys derived from a seed the owner already suspects, and
// moves assets that cannot be moved back. Every guard it has is a line somebody
// could delete, so every one is asserted here rather than described in a
// comment.
//
// The one that matters most is the first: DRY BY DEFAULT.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import {
  ALLOWED_CONTRACT,
  ALLOWED_FUNCTION,
  DERIVATION_PATHS,
  FEE_USTX,
  KEY_SHAPED,
  MINIMUM_USTX,
  minimumFor,
  PHRASE_SHAPED,
  RescueError,
  assertRescueAllowed,
  deriveAccounts,
  deriveAllAccounts,
  BTC_PATH,
  btcAddress,
  parseSeedFile,
  looksLikeMainnetAddress,
  scrub
} from '../../harness/bns/rescue.mjs';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const SOURCE = readFileSync(resolve(ROOT, 'harness/bns/rescue.mjs'), 'utf8');

const MINE = 'SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7';
const SAFE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

/** A throwaway phrase with a valid checksum. Holds nothing, ever. */
const PHRASE =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

const fine = {
  live: true,
  contract: ALLOWED_CONTRACT,
  functionName: ALLOWED_FUNCTION,
  senderAddress: MINE,
  destination: SAFE,
  balanceUstx: 1_000_000n
};

describe('what stops the rescue losing what it is rescuing', () => {
  it('refuses without --live, which is the whole default', () => {
    expect(() => assertRescueAllowed({ ...fine, live: false })).toThrow(RescueError);
    expect(() => assertRescueAllowed({ ...fine, live: false })).toThrow(/dry run/i);
  });

  it('allows the ordinary case, or every test here passes for the wrong reason', () => {
    expect(assertRescueAllowed(fine)).toBe(true);
  });

  it('will only ever call BNS-V2, and only its transfer', () => {
    expect(() =>
      assertRescueAllowed({ ...fine, contract: 'SP000000000000000000002Q6VF78.drainer' })
    ).toThrow(/may only call/);
    // Notably not `list-in-ustx`: a tool that could list a name for sale while
    // rescuing it would be the exact opposite of the job.
    expect(() => assertRescueAllowed({ ...fine, functionName: 'list-in-ustx' })).toThrow(
      /may only call/
    );
  });

  it('refuses to send a name to the wallet it is rescuing', () => {
    // The worst available mistake: two fees spent, nothing moved off the
    // suspect seed, and a report that says it worked.
    expect(() => assertRescueAllowed({ ...fine, destination: MINE })).toThrow(
      /is the wallet being rescued/
    );
  });

  it('refuses a destination that is not a mainnet address', () => {
    for (const bad of ['ST1NOTMAINNET', '', 'not-an-address', SAFE.slice(0, 10)]) {
      expect(() => assertRescueAllowed({ ...fine, destination: bad })).toThrow(RescueError);
    }
  });

  it('lets a wallet holding STX and no name sweep on a single fee', () => {
    // These exist: a name was sold, or none was ever bought there. Charging the
    // two-fee minimum would skip them and leave their money on the suspect
    // seed - a rescue that reports success and abandons the cash.
    expect(minimumFor(0)).toBe(FEE_USTX);
    expect(minimumFor(1)).toBe(FEE_USTX * 2n);
    expect(
      assertRescueAllowed({ ...fine, namesToMove: 0, balanceUstx: FEE_USTX })
    ).toBe(true);
  });

  it('skips a wallet that cannot pay for both a transfer AND a sweep', () => {
    // One fee is not enough. A wallet with exactly one fee moves its name and
    // then cannot sweep, or sweeps and then cannot move its name - and the
    // second of those strands the name somewhere that also cannot renew it.
    expect(MINIMUM_USTX).toBe(FEE_USTX * 2n);
    expect(() => assertRescueAllowed({ ...fine, balanceUstx: FEE_USTX })).toThrow(/under the/);
    expect(assertRescueAllowed({ ...fine, balanceUstx: MINIMUM_USTX })).toBe(true);
  });
});

describe('the seed, and where it is not', () => {
  it('never takes a phrase or a key from the command line', () => {
    // Shell history is a file, and it is not mode 600. A tool that accepted
    // `--seed "..."` would put the phrase in a backup nobody remembers making.
    expect(SOURCE).not.toMatch(/arg\(\s*['"](seed|phrase|mnemonic|key)['"]/);
  });

  it('refuses a seed file other users can read', () => {
    expect(SOURCE, 'the mode is not checked').toMatch(/statSync\(SEED_FILE\)\.mode/);
    expect(SOURCE, 'group and other bits are not rejected').toMatch(/mode & 0o077/);
  });

  it('keeps the seed file out of git', () => {
    const ignore = readFileSync(resolve(ROOT, '.gitignore'), 'utf8');
    expect(ignore, 'harness/bns/.seed is not gitignored').toMatch(/\.seed/);
  });

  it('redacts anything key-shaped or phrase-shaped on its way to output', () => {
    const key = 'a'.repeat(64);
    expect(scrub(`sending with ${key}`)).not.toContain(key);
    expect(scrub(`the phrase is ${PHRASE}`)).not.toContain('abandon abandon');
    // And the patterns are global, or only the first of several is redacted.
    expect(KEY_SHAPED.flags).toContain('g');
    expect(PHRASE_SHAPED.flags).toContain('g');
  });

  it('scrubs a key that arrives inside an error, which is how they escape', () => {
    const key = 'b'.repeat(64);
    const thrown = new Error(`broadcast failed for ${key}`);
    expect(scrub(thrown.stack ?? thrown.message)).not.toContain(key);
  });
});

describe('finding the wallets at all', () => {
  it('searches BOTH derivation conventions', () => {
    // This project has met both: Leather and Hiro put the account index last,
    // and this repo's mainnet deployer is at m/44'/5757'/3'/0/0. A tool that
    // searched one would report half a collection as unreachable, and be
    // believed.
    expect(DERIVATION_PATHS).toHaveLength(2);
    const rendered = DERIVATION_PATHS.map((c) => c.path(3));
    expect(rendered).toContain("m/44'/5757'/3'/0/0");
    expect(rendered).toContain("m/44'/5757'/0'/0/3");
  });

  it("puts LEATHER'S convention first, because that is what people read", () => {
    // Reported from a real wallet: account 1 matched and 2 through 5 did not,
    // because the report led with a hundred hardened addresses no wallet has
    // ever displayed and Leather's were further down. The list was correct and
    // read as broken, which invites distrust of a tool telling the truth.
    expect(DERIVATION_PATHS[0].name).toBe('leather');
    expect(DERIVATION_PATHS[0].path(1)).toBe("m/44'/5757'/0'/0/1");
  });

  it('labels accounts the way the wallet numbers them, from one', () => {
    // Matching a report against a wallet screen is the only way anybody checks
    // this, and Leather calls index 0 "Account 1".
    expect(DERIVATION_PATHS[0].accountLabel(0)).toBe('Account 1');
    expect(DERIVATION_PATHS[0].accountLabel(4)).toBe('Account 5');
    const accounts = [...deriveAccounts(PHRASE, 5).values()];
    expect(accounts[0].account).toBe('Account 1');
    expect(accounts[0].path).toBe("m/44'/5757'/0'/0/0");
    // Index 0 is the same address on both conventions. The first one wins, so
    // the shared address is reported as Account 1 rather than as a hardened 0.
    expect(accounts[0].convention).toBe('leather');
  });

  it('derives real, distinct mainnet addresses', () => {
    const found = deriveAccounts(PHRASE, 4);
    // Four indices on two conventions, minus the one address they share at n=0.
    expect(found.size).toBe(7);
    for (const account of found.values()) {
      expect(looksLikeMainnetAddress(account.address), account.address).toBe(true);
      expect(account.key).toMatch(/^[0-9a-f]{64}01$/);
    }
  });

  it('is deterministic, or a second run would find different wallets', () => {
    const a = [...deriveAccounts(PHRASE, 3).keys()].sort();
    const b = [...deriveAccounts(PHRASE, 3).keys()].sort();
    expect(a).toEqual(b);
  });

  it('refuses a phrase that fails its checksum rather than deriving nonsense', () => {
    // A mistyped word derives a perfectly valid set of addresses that hold
    // nothing, and the report would read "you own nothing here" - which is
    // indistinguishable from having the wrong seed and far more alarming.
    expect(() => deriveAccounts('abandon '.repeat(11) + 'abandon', 2)).toThrow(/checksum/);
  });
});

describe('the Bitcoin address paired with each Stacks one', () => {
  it('uses a DIFFERENT path shape from Stacks at the same account number', () => {
    // The whole trap. For the same "Account N" on the same screen Leather
    // derives Stacks at m/44'/5757'/0'/0/N - index last - and Bitcoin at
    // m/84'/0'/N'/0/0 - account hardened. Reusing the Stacks shape gives a
    // valid, completely wrong address from account 2 onwards, and account 1
    // matches under BOTH shapes, which is exactly enough to look verified.
    expect(BTC_PATH(0)).toBe("m/84'/0'/0'/0/0");
    expect(BTC_PATH(1)).toBe("m/84'/0'/1'/0/0");
    expect(BTC_PATH(1), 'Bitcoin is using the Stacks shape').not.toBe("m/84'/0'/0'/0/1");
  });

  it('produces a real P2WPKH address for a known key', () => {
    // A BIP84 test vector: the standard phrase at m/84'/0'/0'/0/0.
    const root = HDKey.fromMasterSeed(mnemonicToSeedSync(PHRASE));
    const node = root.derive(BTC_PATH(0));
    expect(btcAddress(node.publicKey!)).toBe('bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu');
  });

  it('pairs a Bitcoin address with every Leather account, and none with the others', () => {
    // The hardened-Stacks convention is a different wallet layout, so pairing it
    // with a BIP84 account number would be an invention rather than a fact.
    const accounts = [...deriveAccounts(PHRASE, 4).values()];
    for (const account of accounts) {
      if (account.convention === 'leather') {
        expect(account.btc, `${account.account} has no BTC address`).toMatch(/^bc1q[0-9a-z]{38}$/);
        expect(account.btcPath).toBe(BTC_PATH(Number(account.account.split(' ')[1]) - 1));
      } else {
        expect(account.btc, 'a hardened account invented a BTC pairing').toBeNull();
      }
    }
  });
});

describe('a file of seeds, and stepping through all of them', () => {
  const SECOND =
    'legal winner thank year wave sausage worth useful legal winner thank yellow';

  it('reads one phrase per line and labels what it can', () => {
    const seeds = parseSeedFile(`# a comment\n\nold-hiro: ${PHRASE}\n${SECOND}\n`);
    expect(seeds).toHaveLength(2);
    expect(seeds[0].label).toBe('old-hiro');
    expect(seeds[0].phrase).toBe(PHRASE);
    // Unlabelled phrases are counted by POSITION, never named by their words.
    expect(seeds[1].label).toBe('seed-2');
  });

  it('stops on a bad line by NUMBER, without echoing it', () => {
    // A mistyped word derives valid addresses holding nothing, so continuing
    // would report the names as unreachable when one word is wrong.
    let message = '';
    try {
      parseSeedFile(`${PHRASE}\nabandon abandon abandon\n`);
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toMatch(/line 2/);
    expect(message, 'the bad line was echoed back').not.toContain('abandon');
  });

  it('refuses a file with no phrases rather than reporting nothing found', () => {
    expect(() => parseSeedFile('# all comments\n\n')).toThrow(/no phrases/);
  });

  it('tags every account with the seed that reached it', () => {
    const all = deriveAllAccounts(
      [
        { label: 'first', phrase: PHRASE },
        { label: 'second', phrase: SECOND }
      ],
      3
    );
    const labels = new Set([...all.values()].map((a) => a.seed));
    expect(labels, 'a multi-seed report cannot say which seed to fetch').toEqual(
      new Set(['first', 'second'])
    );
  });

  it('deduplicates an address two seeds both reach', () => {
    // The same phrase twice, which is what a copy-paste mistake looks like. One
    // wallet must not be reported, funded or swept as two.
    const twice = deriveAllAccounts(
      [
        { label: 'a', phrase: PHRASE },
        { label: 'b', phrase: PHRASE }
      ],
      3
    );
    const once = deriveAllAccounts([{ label: 'a', phrase: PHRASE }], 3);
    expect(twice.size).toBe(once.size);
    for (const account of twice.values()) expect(account.seed).toBe('a');
  });
});

describe('the example file', () => {
  it('contains nothing that is actually a seed', () => {
    // Committed, unlike `.seed`. A real phrase pasted here would be published,
    // and this test is the reason that is a build failure rather than a
    // discovery. The placeholders fail the checksum on purpose.
    const example = readFileSync(resolve(ROOT, 'harness/bns/.seed.example'), 'utf8');
    for (const line of example.split('\n')) {
      const bare = line.trim();
      if (!bare || bare.startsWith('#')) continue;
      expect(() => parseSeedFile(bare), `the example file line "${bare}" validates`).toThrow();
    }
  });

  it('tells the reader to lock the file down and delete it afterwards', () => {
    const example = readFileSync(resolve(ROOT, 'harness/bns/.seed.example'), 'utf8');
    expect(example).toContain('chmod 600');
    expect(example, 'nothing says to delete it when done').toMatch(/rm harness\/bns\/\.seed/);
  });
});

describe('the inventory page, which must never be able to take a seed', () => {
  const PAGE = readFileSync(resolve(ROOT, 'harness/bns/inventory.html'), 'utf8');

  it('has no input a phrase could be typed into', () => {
    // The boundary this whole area is built around. A browser page is the worst
    // place a seed can be, and an inventory needs only addresses - so the page
    // is not merely discouraged from taking one, it has no field for it and no
    // code that could use one. Asserted rather than promised, because the promise
    // is written on the page itself and prose does not fail a build.
    const script = PAGE.slice(PAGE.indexOf('<script>'));
    for (const forbidden of ['mnemonic', 'privateKey', 'senderKey', 'makeSTXTokenTransfer']) {
      expect(script, `the page references ${forbidden}`).not.toContain(forbidden);
    }
    // The only password field is the API key, and it is named as such.
    const passwords = [...PAGE.matchAll(/<input[^>]*type="password"[^>]*>/g)].map((m) => m[0]);
    expect(passwords).toHaveLength(1);
    expect(passwords[0]).toContain('id="apikey"');
  });

  it('reads and never writes — no signing library reaches it', () => {
    // An inventory that could also broadcast would be a page that needs a key.
    expect(PAGE).not.toMatch(/broadcastTransaction|makeContractCall|signTransaction/);
    // POSTs go to call-read only, which cannot change anything.
    for (const post of [...PAGE.matchAll(/method:\s*'POST'/g)]) expect(post).toBeTruthy();
    expect(PAGE).toContain('/v2/contracts/call-read/');
    expect(PAGE).not.toContain('/v2/transactions');
  });

  it('carries no API key of its own — the generated copy gets one, this does not', () => {
    // `inventory.html` is committed. `inventory-loaded.html` is gitignored, mode
    // 600, and already holds a personal address list, so the key belongs there
    // and only there. A key committed to a repo is a key you cannot un-commit.
    expect(PAGE, 'the committed page has a key baked into it').not.toMatch(
      /value="[A-Za-z0-9_-]{16,}"/
    );
    // And the field is empty, so an unkeyed reader is asked rather than assumed.
    expect(PAGE).toMatch(/<input id="apikey"[^>]*placeholder=/);
  });

  it('is self-contained, so it cannot rot or phone home', () => {
    const external = PAGE.match(/https?:\/\/(?!api\.mainnet\.hiro\.so)[a-z0-9.-]+/gi) ?? [];
    expect(external, `the page fetches from ${external.join(', ')}`).toHaveLength(0);
  });

  it('retries what failed without re-reading what did not', () => {
    // A retry that started over would re-fetch four hundred wallets to reach
    // three, and on a shared rate limit that is how a retry becomes the reason
    // for the next failure. Rows are replaced in place, so the successes from
    // the first pass are neither re-fetched nor lost.
    expect(PAGE).toContain('rows[existing] = row');
    expect(PAGE).toMatch(/failed\.map\(\(r\) => r\.address\)/);
  });

  it('retries once automatically, then stops and asks', () => {
    // `Failed to fetch` is usually transient, so one unprompted retry saves the
    // common case. Retrying forever would turn a genuinely unreachable address
    // into an infinite loop that looks like progress.
    expect(PAGE).toContain('ONE AUTOMATIC SECOND PASS');
    expect(PAGE, 'no retry control is offered after the automatic pass').toContain(
      "id=\"retry\""
    );
  });

  it('takes decimals from the token contract, not the metadata index', () => {
    // `/metadata/v1/ft/...` answers 200 with a name, a symbol and a total supply
    // and NO decimals field for plenty of real tokens - so a run built on it
    // formats every balance as though the token had none, silently. SIP-010
    // defines get-decimals on the token itself, which is the authority.
    expect(PAGE).toContain('get-decimals');
    expect(PAGE, 'the metadata index is being read as a source').not.toMatch(
      /await get\(`\/metadata\/v1\/ft\//
    );
  });

  it('resumes from a snapshot without re-reading what it already has', () => {
    // Four hundred wallets is an eight hundred request run, and one that dies
    // near the end used to mean starting from zero. Re-fetching answers you
    // already hold spends exactly the budget that made it fail.
    expect(PAGE).toContain("id=\"resume\"");
    expect(PAGE).toContain('const todo = addresses.filter((a) => !done.has(a))');
    // Only SUCCESSFUL rows carry over. A row that failed is work still to do.
    expect(PAGE).toMatch(/baseline\.rows\.filter\(\(r\) => !r\.error\)/);
  });

  it('expands NFT holdings rather than hiding them in a hover', () => {
    // One wallet here holds 53 across 9 contracts. In a title attribute that is
    // a nine-line tooltip you cannot select, scroll, or read on a phone.
    expect(PAGE).toContain('<details class="nfts">');
    expect(PAGE, 'the expander needs script to work').not.toMatch(/addEventListener\('toggle'/);
  });

  it('matches headline tokens by CONTRACT, never by symbol', () => {
    // Not theoretical. Hiro's token index returns thirty-two results for the
    // symbol "sBTC", including several "Mock sBTC" and one called buttcoin that
    // simply claims it. A symbol is a string a contract asserts about itself, so
    // a column headed sBTC matching on it would eventually show a scam token as
    // a Bitcoin balance.
    expect(PAGE).toContain('SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token');
    expect(PAGE).toContain("f.id.split('::')[0] === token.contract");
    expect(PAGE, 'a headline token is being matched on its symbol').not.toMatch(
      /symbol\s*===\s*['"]sBTC/i
    );
  });

  it('takes a headline token out of the shared token list', () => {
    // Or it appears twice, and the column stops meaning "this is where sBTC is".
    expect(PAGE).toContain("HEADLINE_CONTRACTS.has(f.id.split('::')[0])");
  });

  it('never prints a field a carried-over row might not carry', () => {
    // Reported from a real run: the same token showed 40,000 on one wallet and
    // the string "undefined" on another, one row apart. Not a data problem - the
    // second row came from a snapshot written before amounts existed, and the
    // renderer printed a field that row never had. A snapshot is a file that
    // outlives the code that wrote it.
    expect(PAGE).toContain('f.amount ??');
    expect(PAGE, 'a raw amount is still printed unguarded').not.toMatch(
      /\$\{f\.amount\}/
    );
    expect(PAGE).toContain("return 'amount not recorded'");
  });

  it('stamps snapshots so a stale one is said, not inferred', () => {
    // Otherwise the only evidence is a column reading "undefined", which reads
    // as a bug in the chain data rather than an old file.
    expect(PAGE).toContain('const SNAPSHOT_FORMAT');
    expect(PAGE).toMatch(/baseline\.format \?\? 1\) < SNAPSHOT_FORMAT/);
  });

  it('never renders an unread wallet as an empty one', () => {
    // The failure this whole area keeps meeting. "You own nothing" and "nobody
    // answered" look identical in a table and mean opposite things.
    expect(PAGE).toContain("row.error ? 'unread'");
    expect(PAGE).toMatch(/NOT counted as empty/);
  });
});

describe('the order of operations, which only works one way', () => {
  it('sweeps AFTER transferring, and re-reads the balance first', () => {
    // The CALL SITES, not the imports. A first version of this test matched
    // `makeSTXTokenTransfer` in the import block at the top of the file and
    // reported the sweep as running before the transfer, which it does not.
    const transferAt = SOURCE.indexOf('await makeContractCall({');
    const sweepAt = SOURCE.indexOf('await makeSTXTokenTransfer({');
    expect(transferAt, 'the transfer is not in the file').toBeGreaterThan(-1);
    expect(sweepAt, 'the sweep is not in the file').toBeGreaterThan(-1);
    // Sweeping first strands the name: a wallet at zero cannot pay to move
    // anything, and cannot renew what it is then stuck holding.
    expect(sweepAt, 'the sweep runs before the transfer').toBeGreaterThan(transferAt);
    // And the amount comes from a fresh read, because the transfers above have
    // each spent a fee since the balance was last known.
    expect(SOURCE).toMatch(/const left = await balanceOf\(row\.address\)/);
    expect(SOURCE).toMatch(/const amount = \(left \?\? 0n\) - FEE_USTX/);
  });

  it('leaves the sweep its own fee rather than sending the whole balance', () => {
    expect(SOURCE, 'the sweep sends everything and cannot pay for itself').toMatch(
      /- FEE_USTX;/
    );
  });

  it('sets a fee instead of estimating one', () => {
    // The estimator is a network call on a shared rate limit. A run that dies
    // partway through 124 transactions because it was throttled has already
    // spent money, and the wizards learned this the expensive way.
    expect(SOURCE).toMatch(/fee: FEE_USTX/);
  });
});
