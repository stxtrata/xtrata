// The wizards, and the rules that keep them disposable.
//
// Three mainnet wallets holding a few STX, signing real transactions with real
// money, run unattended. Every safety property they have is a line of code that
// could be deleted, so every one of them is asserted here rather than described
// in a comment.
//
// The one that matters most is the first: DRY BY DEFAULT. A tool that spends
// money unless told not to is a tool that eventually spends money nobody meant
// to spend.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  ALLOWED_CONTRACT,
  ALLOWED_FUNCTIONS,
  BALANCE_FLOOR_USTX,
  DEFAULT_SPEND_CAP_USTX,
  DIRECTOR,
  KEY_SHAPED,
  MAX_TRANSFER_USTX,
  TARGET_FLOAT_USTX,
  assertTransferAllowed,
  planFunding,
  PERSONAS,
  RESERVED_ADDRESSES,
  SCRIPTED_GAME,
  PLAN_NAMES,
  WizardSafetyError,
  addressEnvName,
  assertBroadcastAllowed,
  keyEnvName,
  planRun,
  readFleet,
  scrub
} from '../../harness/wizards/wizards-core.mjs';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const read = (path: string): string => readFileSync(resolve(ROOT, path), 'utf8');

const ADDRESS = 'SP11Z278A6XJH57GGRH98NRVV1VCAZE5TDRC6GDX9';

/** Everything a legal broadcast needs, so a test can spoil exactly one thing. */
const fine = {
  live: true,
  contract: ALLOWED_CONTRACT,
  functionName: 'submit',
  network: 'mainnet',
  senderAddress: ADDRESS,
  balanceUstx: 5_000_000n,
  plannedSpendUstx: 5_000n,
  spentSoFarUstx: 0n
};

describe('what stops a wizard spending money by accident', () => {
  it('refuses without --live, which is the whole default', () => {
    expect(() => assertBroadcastAllowed({ ...fine, live: false })).toThrow(WizardSafetyError);
    expect(() => assertBroadcastAllowed({ ...fine, live: false })).toThrow(/dry run/i);
  });

  it('allows the ordinary case, or every test above passes for the wrong reason', () => {
    const allowed = assertBroadcastAllowed(fine);
    expect(allowed.plannedSpendUstx).toBe(5_000n);
    expect(allowed.spentAfterUstx).toBe(5_000n);
  });

  it('will only ever call the one contract', () => {
    // An allow-list rather than a check on the argument, because the argument is
    // what is most likely to be wrong. A key with STX on it that can call ANY
    // contract can be talked into calling one that empties it.
    expect(() =>
      assertBroadcastAllowed({ ...fine, contract: 'SP000000000000000000002Q6VF78.something' })
    ).toThrow(/may only call/);
  });

  it('will only ever call the four functions it needs', () => {
    expect(() => assertBroadcastAllowed({ ...fine, functionName: 'set-open-fee' })).toThrow(
      /Allowed:/
    );
  });

  it('cannot settle a sponsorship, which is permanent and belongs to nobody', () => {
    // Any principal may settle an expired reserve, and doing so bars that player
    // from ever being sponsored on that game again. A robot must not be able to
    // do that at all, let alone by accident.
    expect(ALLOWED_FUNCTIONS).not.toContain('settle-sponsorship');
    expect(() => assertBroadcastAllowed({ ...fine, functionName: 'settle-sponsorship' })).toThrow(
      WizardSafetyError
    );
  });

  it('stops at the spend cap, counting what the run has already spent', () => {
    expect(() =>
      assertBroadcastAllowed({
        ...fine,
        plannedSpendUstx: 1_000_000n,
        spentSoFarUstx: DEFAULT_SPEND_CAP_USTX
      })
    ).toThrow(/over the cap/);
  });

  it('leaves enough to send the remainder somewhere', () => {
    // Not politeness. A wallet at zero cannot pay the fee to move its own float,
    // so the money is stranded and the wizard is dead.
    expect(() =>
      assertBroadcastAllowed({
        ...fine,
        balanceUstx: BALANCE_FLOOR_USTX + 1_000n,
        plannedSpendUstx: 5_000n
      })
    ).toThrow(/floor/);
  });

  it('refuses a testnet run, because these wallets are mainnet', () => {
    expect(() => assertBroadcastAllowed({ ...fine, network: 'testnet' })).toThrow(/mainnet only/);
  });

  it('refuses to sign as a project wallet', () => {
    // The deployer holds the contract and is not disposable. A wizard key that
    // turned out to be it would be the most expensive possible mistake here.
    for (const reserved of RESERVED_ADDRESSES) {
      expect(() => assertBroadcastAllowed({ ...fine, senderAddress: reserved })).toThrow(
        /project wallet/
      );
    }
  });

  it('refuses an address that is not one', () => {
    expect(() => assertBroadcastAllowed({ ...fine, senderAddress: 'ST1NOTMAINNET' })).toThrow(
      /not a mainnet address/
    );
    expect(() => assertBroadcastAllowed({ ...fine, senderAddress: '' })).toThrow(WizardSafetyError);
  });

  it('refuses a call that plans to spend nothing, which means it was not priced', () => {
    expect(() => assertBroadcastAllowed({ ...fine, plannedSpendUstx: 0n })).toThrow(/spend/);
  });
});

describe('keys, and where they are not', () => {
  it('writes a key only where it was told to, and nowhere else', () => {
    // Two write targets in the whole directory: the placeholder example, always,
    // and the real env file, only behind --write. Anything else appearing here
    // is a key going somewhere nobody asked for.
    for (const file of ['make-wizards.mjs', 'play.mjs', 'wizards-core.mjs']) {
      const source = read(`harness/wizards/${file}`);
      const writes = [...source.matchAll(/writeFileSync\(\s*([A-Za-z_]+)/g)].map((m) => m[1]);
      for (const target of writes) {
        expect(['EXAMPLE', 'ENV_FILE'], `${file} writes keys to ${target}`).toContain(target);
      }
    }
  });

  it('does not write the real file unless asked out loud', () => {
    const source = read('harness/wizards/make-wizards.mjs');
    expect(source, 'the env file is written unconditionally').toContain("includes('--write')");
    expect(source, 'writing is not gated on the flag').toMatch(/if \(WRITE\) writeEnvFile/);
  });

  it('refuses to overwrite a fleet that may be funded', () => {
    // The one guard that cannot be got wrong. A .env.wizards that exists belongs
    // to wallets whose keys are the ONLY thing that can move their money;
    // replacing it strands whatever they hold, permanently.
    const source = read('harness/wizards/make-wizards.mjs');
    expect(source, 'it would clobber an existing fleet').toContain('REFUSING to overwrite');
    expect(source).toMatch(/existsSync\(ENV_FILE\)/);
  });

  it('checks the file is ignored before writing it, rather than assuming', () => {
    // Being wrong about this publishes the keys, so it is read rather than
    // trusted.
    const source = read('harness/wizards/make-wizards.mjs');
    expect(source).toContain('.gitignore');
    expect(source, 'the written file is world-readable').toContain('0o600');
  });

  it('keeps the example file free of anything real', () => {
    // A committed file, so a real key pasted here would be published. The test
    // is the reason that is a build failure rather than a discovery.
    if (!existsSync(resolve(ROOT, 'harness/wizards/.env.wizards.example'))) return;
    const example = read('harness/wizards/.env.wizards.example');
    expect(KEY_SHAPED.test(example), 'the example file contains something key-shaped').toBe(false);
    expect(example, 'the example file contains a real address').not.toMatch(
      /^\s*[A-Z0-9_]+=S[PM][0-9A-HJKMNP-TV-Z]{20,}/m
    );
  });

  it('is not committing the real file', () => {
    const ignored = read('.gitignore');
    expect(ignored, 'real wizard keys are not gitignored').toContain(
      'harness/wizards/.env.wizards'
    );
  });

  it('scrubs anything key-shaped on its way to a log', () => {
    const leaky = `broadcast failed for ${'a1b2c3d4'.repeat(8)} on mainnet`;
    expect(scrub(leaky)).not.toMatch(KEY_SHAPED);
    expect(scrub(leaky)).toContain('<key redacted>');
    // And leaves an address alone: it is public, and hiding it would make every
    // failure unreadable.
    expect(scrub(`sender ${ADDRESS}`)).toContain(ADDRESS);
  });
});

describe('the fleet, and what it intends', () => {
  it('reports what is missing rather than refusing to start', () => {
    // A dry run is useful with no wallets at all. A tool that will not start
    // until it is fully provisioned is one only its author ever runs.
    const empty = readFleet({});
    expect(empty.ready).toBe(false);
    expect(empty.missing).toEqual([DIRECTOR.id, ...PERSONAS.map((p) => p.id)]);
    expect(empty.wizards.length).toBe(PERSONAS.length + 1);
  });

  it('reads a provisioned fleet', () => {
    const env: Record<string, string> = {};
    for (const persona of [DIRECTOR, ...PERSONAS]) {
      env[keyEnvName(persona.id)] = 'a'.repeat(64);
      env[addressEnvName(persona.id)] = ADDRESS;
    }
    const fleet = readFleet(env);
    expect(fleet.ready).toBe(true);
    expect(fleet.missing).toEqual([]);
  });

  it('refuses an address that is not a mainnet one, at load rather than at spend', () => {
    const env: Record<string, string> = {};
    for (const persona of [DIRECTOR, ...PERSONAS]) {
      env[keyEnvName(persona.id)] = 'a'.repeat(64);
      env[addressEnvName(persona.id)] = 'not-an-address';
    }
    expect(() => readFleet(env)).toThrow(WizardSafetyError);
  });

  it('plans a run that fits inside its own cap', () => {
    const env: Record<string, string> = {};
    for (const persona of [DIRECTOR, ...PERSONAS]) {
      env[keyEnvName(persona.id)] = 'a'.repeat(64);
      env[addressEnvName(persona.id)] = ADDRESS;
    }
    const plan = planRun({ fleet: readFleet(env), openFeeUstx: 1_000_000n });
    expect(plan.steps.length, 'the plan does not cover the game').toBe(1 + SCRIPTED_GAME.length);
    expect(
      plan.totalUstx,
      `a default run plans ${plan.totalUstx} uSTX against a cap of ${DEFAULT_SPEND_CAP_USTX}`
    ).toBeLessThan(DEFAULT_SPEND_CAP_USTX);
  });

  it('plays a game that actually finishes, by default', () => {
    // Fool's mate. Four moves to a real checkmate, derived by replay rather than
    // asserted, and the cheapest thing that ends in a real result - which is
    // what the run that answers "can this fleet still sign" wants.
    expect(SCRIPTED_GAME.map((m) => m.move)).toEqual(['f2f3', 'e7e5', 'g2g4', 'd8h4']);
    expect(SCRIPTED_GAME.filter((m) => m.by === 'wizard-1').length).toBe(2);
    expect(SCRIPTED_GAME.filter((m) => m.by === 'wizard-2').length).toBe(2);
  });

  it('will plan any of the other games too, and prices each one', () => {
    // The default is a floor, not the whole fleet. Every plan is replayed
    // against the board's own engine in `game-plans.test.ts`; this is only that
    // the runner can be pointed at one and gets the arithmetic right.
    const env: Record<string, string> = {};
    for (const persona of [DIRECTOR, ...PERSONAS]) {
      env[keyEnvName(persona.id)] = 'a'.repeat(64);
      env[addressEnvName(persona.id)] = ADDRESS;
    }
    const fleet = readFleet(env);

    for (const name of PLAN_NAMES) {
      const plan = planRun({ fleet, openFeeUstx: 1_000_000n, plan: name });
      expect(plan.plan, `${name} planned something else`).toBe(name);
      expect(plan.steps.length, `${name} is not fully covered`).toBe(1 + plan.moves.length);
      // Open fee plus a miner fee per move, and nothing else invented.
      const expected = 1_000_000n + 3_000n * BigInt(plan.moves.length + 1);
      expect(plan.totalUstx, `${name} is mispriced`).toBe(expected);
    }
  });

  it('refuses a plan name it does not have, before pricing anything', () => {
    // A run that fell back to the default would spend real money proving
    // something nobody asked about - and it would look like it had worked.
    const env: Record<string, string> = {};
    for (const persona of [DIRECTOR, ...PERSONAS]) {
      env[keyEnvName(persona.id)] = 'a'.repeat(64);
      env[addressEnvName(persona.id)] = ADDRESS;
    }
    expect(() => planRun({ fleet: readFleet(env), plan: 'kasparov-topalov' })).toThrow(
      /no game plan called/
    );
  });
});

describe('what the wizards are honest about', () => {
  it('says in its own source that it cannot stand in for the wallet matrix', () => {
    // The failure this whole fleet could cause is somebody concluding the
    // wallets are proven because a robot signed something. It signs through
    // @stacks/transactions; a player signs through an extension that parses,
    // re-shapes and forwards. Different paths.
    for (const file of ['wizards-core.mjs', 'play.mjs', 'README.md']) {
      const source = read(`harness/wizards/${file}`);
      expect(source, `${file} does not say what it cannot prove`).toMatch(/MATRIX|matrix/);
    }
  });

  it('points at the canary contract and not at anything live to a player', () => {
    expect(ALLOWED_CONTRACT).toContain('canary');
  });
});

// ---------------------------------------------------------------------------
// The commands the documents promise.
//
// `sweep` was described in the README and in play.mjs's own header before it
// existed. That is the worst kind of gap: the way to get the money back out of
// three disposable wallets, documented and absent, discovered on the day
// somebody needs it.
// ---------------------------------------------------------------------------

describe('every command the documents name', () => {
  const play = read('harness/wizards/play.mjs');
  const readme = read('harness/wizards/README.md');

  for (const command of ['balances', 'sweep']) {
    it(`implements ${command}, which both documents promise`, () => {
      expect(readme, `the README does not mention ${command}`).toContain(command);
      expect(play, `play.mjs does not handle ${command}`).toContain(`command === '${command}'`);
    });
  }

  it('guards the sweep separately, because a transfer is not a contract call', () => {
    // The function allow-list is about contract calls and does not apply. What
    // matters instead is that the destination is real and that --live is still
    // required.
    const body = play.slice(play.indexOf('async function sweep'));
    expect(body, 'sweep does not check where it is sending').toContain('looksLikeMainnetAddress');
    expect(body, 'sweep would broadcast without --live').toContain('if (!LIVE)');
  });

  it('does not claim a price it did not read', () => {
    // The dry run printed "(read from the contract)" over a constant when there
    // was no fleet to read for. A small untruth in the output makes every other
    // line in it suspect.
    expect(play).toContain('ASSUMED');
  });
});

// ---------------------------------------------------------------------------
// The Director.
//
// One address to fund, instead of three transfers by hand with one of them
// mistyped. It is also the riskiest wallet in the fleet — it holds the whole
// float rather than a third of one — and the rule that makes that acceptable is
// the only one worth testing hard:
//
//   A DIRECTOR MAY ONLY PAY ITS OWN WIZARDS.
//
// A hot wallet that can send anywhere is a hot wallet. One that can only top up
// a known list is a float with a spout.
// ---------------------------------------------------------------------------

describe('the Director', () => {
  const PLAYER = 'SP3DXAJVTKDE92CBPM1CPS7CMTB9EYBZ4Y86YY8B9';
  const STRANGER = 'SP359RJKXFNRAXH295E5JPD3N7RMD9GMAYTF2PRCE';
  const ok = {
    live: true,
    from: ADDRESS,
    to: PLAYER,
    amountUstx: 2_000_000n,
    balanceUstx: 8_000_000n,
    fleetAddresses: [ADDRESS, PLAYER]
  };

  it('pays a wizard it knows', () => {
    expect(assertTransferAllowed(ok).amountUstx).toBe(2_000_000n);
  });

  it('refuses to pay anybody else, which is the whole point of it', () => {
    expect(() => assertTransferAllowed({ ...ok, to: STRANGER })).toThrow(
      /may only pay its own wizards/
    );
  });

  it('refuses without --live, like everything else here', () => {
    expect(() => assertTransferAllowed({ ...ok, live: false })).toThrow(/dry run/i);
  });

  it('has a ceiling on a single transfer, whatever it was asked for', () => {
    expect(() =>
      assertTransferAllowed({ ...ok, amountUstx: MAX_TRANSFER_USTX + 1n, balanceUstx: 100_000_000n })
    ).toThrow(/ceiling/);
  });

  it('keeps enough to pay a fee, or it cannot fund anybody again', () => {
    expect(() =>
      assertTransferAllowed({ ...ok, balanceUstx: 2_100_000n, amountUstx: 2_000_000n })
    ).toThrow(/floor/);
  });

  it('will not send a wallet its own money', () => {
    expect(() => assertTransferAllowed({ ...ok, to: ADDRESS })).toThrow(/its own money/);
  });

  it('lets money LEAVE the fleet only through sweep, which says so', () => {
    // The single exception, and it takes a different door: an address typed on
    // the command line, and `sweeping` set explicitly.
    expect(() => assertTransferAllowed({ ...ok, to: STRANGER })).toThrow();
    expect(assertTransferAllowed({ ...ok, to: STRANGER, sweeping: true }).amountUstx).toBe(
      2_000_000n
    );
  });

  it('tops up to a float rather than sending a fixed amount', () => {
    // So running it twice costs nothing. For something meant to run unattended,
    // the safe response to being unsure must be to run it again.
    const env: Record<string, string> = {};
    for (const persona of [{ id: 'director' }, ...PERSONAS]) {
      env[keyEnvName(persona.id)] = 'a'.repeat(64);
      env[addressEnvName(persona.id)] = ADDRESS;
    }
    const fleet = readFleet(env);
    const full = planFunding({
      fleet,
      balances: Object.fromEntries(fleet.wizards.map((w) => [w.address, TARGET_FLOAT_USTX]))
    });
    expect(full.transfers, 'a fleet already at its float would be paid again').toEqual([]);

    const empty = planFunding({ fleet, balances: {} });
    expect(empty.transfers.length, 'an empty fleet is not topped up').toBeGreaterThan(0);
    for (const transfer of empty.transfers) {
      expect(transfer.amountUstx).toBe(TARGET_FLOAT_USTX);
    }
  });

  it('never plays a game itself', () => {
    // It holds the float. A wallet that both holds the money and signs the
    // experiments is one mistake away from being the only wallet.
    const plan = planRun({ fleet: readFleet({}) });
    expect(plan.steps.map((s) => s.who?.id)).not.toContain('director');
  });
});

// ---------------------------------------------------------------------------
// The read-only path that actually exists.
//
// `call-read`, NOT `call-read-only`. The second reads like the right name, is
// what you would guess, and 404s — returning "No such file", which arrives as a
// JSON parse error several frames from the mistake. The board has always used
// `call-read` (packages/chain/client.ts), so this was not a discovery so much as
// a reminder to look at what already works.
// ---------------------------------------------------------------------------

describe('talking to the chain', () => {
  it('uses the path the board uses', () => {
    // Read out of the FETCH, not out of the file: the comment above it names the
    // wrong path in order to warn about it, and a test that matched prose would
    // fail on its own explanation.
    const play = read('harness/wizards/play.mjs');
    const used = [...play.matchAll(/`\$\{API\}(\/v2\/contracts\/[a-z-]+)\//g)].map((m) => m[1]);
    expect(used.length, 'the wizards no longer read the contract at all').toBeGreaterThan(0);
    for (const path of used) {
      expect(path, 'the wizards read on a path that 404s').toBe('/v2/contracts/call-read');
    }
  });

  it('agrees with the board about it, rather than having its own idea', () => {
    const client = read('packages/chain/client.ts');
    const play = read('harness/wizards/play.mjs');
    const pathOf = (source: string) => /\/v2\/contracts\/call-read[a-z-]*\//.exec(source)?.[0];
    expect(pathOf(play), 'the wizards and the board disagree about the read path').toBe(
      pathOf(client)
    );
  });
});

// ---------------------------------------------------------------------------
// Three transfers in a row.
//
// The library fetches the nonce per transaction, and the API answers with the
// same number until the first one is MINED — so three transfers signed in a
// loop all carry the same nonce, one is accepted and the other two are silently
// replaced. Not a hypothetical: the first funded run sent three and exactly one
// arrived, with two txids that had never been anything.
//
// The gates page has warned about this in its own words since it was written.
// This loop was built without reading it.
// ---------------------------------------------------------------------------

describe('signing more than one thing at a time', () => {
  const play = read('harness/wizards/play.mjs');

  it('reads the nonce once and counts it up itself', () => {
    const fund = play.slice(play.indexOf('async function fund'), play.indexOf('async function main'));
    expect(fund, 'the funding loop does not manage a nonce at all').toContain('nextNonce(');
    expect(fund, 'it passes no nonce, so the library guesses each time').toMatch(/\bnonce\b/);
    expect(fund, 'the nonce never advances between transfers').toContain('nonce += 1n');
  });

  it('asks for the nonce outside the loop, not inside it', () => {
    // Inside, it would fetch the same number every time and change nothing.
    const fund = play.slice(play.indexOf('async function fund'), play.indexOf('async function main'));
    // The LAST of the two loops over the transfers: the first only prints them,
    // and reading the nonce after that one would prove nothing. A test that
    // takes the first match is testing the wrong loop.
    const asked = fund.indexOf('nextNonce(');
    const loop = fund.lastIndexOf('for (const transfer of plan.transfers)');
    expect(asked, 'the nonce is read inside the loop, which is the same bug').toBeLessThan(loop);
  });

  it('says which nonce each transfer used, so a silent replacement is visible', () => {
    expect(play, 'a dropped transfer would leave no trace to read').toContain('(nonce ${nonce})');
  });
});

// ---------------------------------------------------------------------------
// Resuming, and the fee.
//
// The first live game died two moves in, on a 429 from the library's OWN fetch —
// `/v2/fees/transaction`, a call this file never makes and cannot put a header
// on. Restarting would have cost another 1 STX to prove the same thing twice.
//
// And the fee exposed something worse than the rate limit: the plan said every
// move costs 3,000 uSTX and the spend cap was checked against that, while the
// library asked the network what to pay and used THAT instead. The cap was
// counting a number nobody was spending.
// ---------------------------------------------------------------------------

describe('paying for a transaction', () => {
  const play = read('harness/wizards/play.mjs');

  it('sets the fee rather than asking what it should be', () => {
    expect(play, 'the fee is still estimated, so the plan and the spend differ').toContain(
      'fee: MINER_FEE_USTX'
    );
  });

  it('keys the library’s own fetch, which our headers never touched', () => {
    expect(play).toContain('createApiKeyMiddleware');
    expect(play, 'a builder call still uses the default client').toMatch(/client: CLIENT/);
  });

  it('does not quote an open fee for a run that opens nothing', () => {
    const fleet = readFleet({});
    const fresh = planRun({ fleet, openFeeUstx: 1_000_000n });
    const resumed = planRun({ fleet, openFeeUstx: 1_000_000n, resuming: true });
    expect(fresh.steps.some((s) => s.act === 'open')).toBe(true);
    expect(resumed.steps.some((s) => s.act === 'open'), 'a resume plans an open it will not do').toBe(
      false
    );
    expect(resumed.totalUstx, 'a resume is priced as though it opened a game').toBeLessThan(
      fresh.totalUstx
    );
  });
});

// ---------------------------------------------------------------------------
// No game without rules.
//
// `open-game` takes an OPTIONAL rules hash, and none is a legal thing to send:
// it opens a board that commits to nothing, which any reader can replay and no
// reader can referee. That is a real mode and it is not this fleet's job.
//
// A wizard game exists to be checked by somebody else's board — the rules have
// to be recoverable, the sides named, the result eligible to count. All three
// start with a commitment, so a game opened without one is not a smaller test.
// It is a different one, silently.
// ---------------------------------------------------------------------------

describe('rules, without which there is no game', () => {
  const HASH = 'a'.repeat(64);
  const opening = { ...fine, functionName: 'open-game', plannedSpendUstx: 1_003_000n };

  it('refuses to open a game with nothing committed', () => {
    expect(() => assertBroadcastAllowed(opening)).toThrow(/no rules committed/);
    expect(() => assertBroadcastAllowed({ ...opening, rulesHash: null })).toThrow(
      /no rules committed/
    );
  });

  it('refuses a sponsored game with nothing committed either', () => {
    expect(() =>
      assertBroadcastAllowed({ ...opening, functionName: 'open-sponsored-game' })
    ).toThrow(/no rules committed/);
  });

  it('opens one when the rules are there', () => {
    expect(assertBroadcastAllowed({ ...opening, rulesHash: HASH }).plannedSpendUstx).toBe(
      1_003_000n
    );
  });

  it('refuses something that is not a hash at all', () => {
    // 32 bytes of hex, which is what the contract's (optional (buff 32)) holds.
    for (const wrong of ['', 'not-a-hash', 'ab', HASH + 'ff', '0x' + HASH]) {
      expect(() => assertBroadcastAllowed({ ...opening, rulesHash: wrong })).toThrow(
        /no rules committed/
      );
    }
  });

  it('leaves a move alone, which commits nothing and should not', () => {
    // Only the two functions that CREATE a game are gated. A submit carries no
    // rules and never could.
    expect(() => assertBroadcastAllowed({ ...fine, functionName: 'submit' })).not.toThrow();
  });

  it('uses the board’s own encoder rather than a second copy of it', () => {
    // A rules hash is a commitment: one byte different and the game is opened
    // against rules no board will ever recover, permanently. So play.mjs bundles
    // packages/protocol and imports the real thing.
    const play = read('harness/wizards/play.mjs');
    expect(play, 'the wizards reimplement the rules encoding').not.toMatch(/function canonicalRules/);
    expect(play, 'the wizards no longer load the real encoder').toContain('loadProtocol');
    expect(play).toContain("'packages', 'protocol', 'canonical.ts'");
  });

  it('names both sides and marks the game ranked', () => {
    const play = read('harness/wizards/play.mjs');
    expect(play, 'the wizards open a game nobody is named in').toMatch(
      /normaliseRules\(\{ \.\.\.DEFAULT_RULES, white, black, ranked: true \}\)/
    );
    expect(play, 'the open still sends none for its rules').not.toContain('Cl.none()');
  });
});
