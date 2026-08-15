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
    // This project has met both: the inscription scripts use the account index
    // last, and the mainnet deployer for this repo is at m/44'/5757'/3'/0/0. A
    // tool that searched one would report half a collection as unreachable, and
    // be believed.
    expect(DERIVATION_PATHS).toHaveLength(2);
    const rendered = DERIVATION_PATHS.map((path) => path(3));
    expect(rendered).toContain("m/44'/5757'/3'/0/0");
    expect(rendered).toContain("m/44'/5757'/0'/0/3");
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
