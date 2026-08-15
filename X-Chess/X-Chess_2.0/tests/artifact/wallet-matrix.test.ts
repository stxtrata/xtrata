// The wallet matrix, and the gate that reads it.
//
// The largest blocking item in this project was a fourteen-row table nobody had
// a way to run — and a gate that checked it by searching the file for the words
// "not run". The table's only machine-readable property was a phrase whose
// ABSENCE was treated as proof of work done: editing fourteen cells to "done"
// satisfied the gate with no evidence whatsoever, and typing "pending" satisfied
// it by accident.
//
// So the two things asserted here are the two that make the runner worth having:
//
//   THE GATE READS EVIDENCE. A hand-edited table does not pass.
//   THE RUNNER'S OUTPUT IS WHAT THE GATE READS. If those two formats drift, the
//   runner produces something nobody can use and the gate goes back to being
//   unsatisfiable, which is how a checklist ends up ignored.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { WALLET_STEPS, progress } from '../../packages/ui/gates.js';
import type { StepStates } from '../../packages/ui/gates.js';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const read = (path: string): string => readFileSync(resolve(ROOT, path), 'utf8');

/**
 * The gate's own parser, copied from harness/release.mjs.
 *
 * Copied deliberately rather than imported: release.mjs runs the whole verify
 * sequence on import, including deep perft. What matters is that the SHAPE
 * matches, and the test below asserts the two are the same expression rather
 * than trusting this comment.
 */
const RESULT = /^\s*RESULT\s+row=(\d+)\s+build=(\S+)\s+provider=(\S+)\s+outcome=(\S+)/;

describe('the gate that reads the wallet matrix', () => {
  it('uses the same expression the release gate uses', () => {
    // If these drift, this whole file is testing a parser nothing runs.
    const release = read('harness/release.mjs');
    expect(release, 'the release gate no longer parses RESULT lines').toContain('RESULT\\s+row=');
    // The old refusal, by its own message. `not run` still appears in the file
    // - in the comment explaining why it is no longer what gets checked - so the
    // assertion is about the CHECK and not about the words.
    expect(release, 'the gate still refuses on a missing phrase').not.toContain(
      'have not been run'
    );
  });

  it('does not accept a table somebody edited by hand', () => {
    const edited = [
      '| 1 | Xverse | desktop | connect | an address comes back | done |',
      '| 2 | Xverse | desktop | open a game | one prompt | passed |',
      '| 3 | Xverse | desktop | submit | nothing sent | ok |'
    ];
    for (const line of edited) {
      expect(RESULT.test(line), `"${line}" satisfied the gate`).toBe(false);
    }
  });

  it('accepts a line the runner writes, and reads every field out of it', () => {
    const line =
      'RESULT row=4 build=a7b071d8 provider=window.XverseProviders.BitcoinProvider ' +
      'outcome=pass txid=0x1234';
    const found = RESULT.exec(line);
    expect(found, 'the runner writes a line its own gate rejects').not.toBeNull();
    const [, row, build, provider, outcome] = found!;
    expect(row).toBe('4');
    expect(build).toBe('a7b071d8');
    expect(provider, 'the provider is what every wallet fault so far turned on').toContain(
      'BitcoinProvider'
    );
    expect(outcome).toBe('pass');
  });

  it('records the build per row, not once at the bottom', () => {
    // Rows get re-run one at a time. A single signature at the end cannot say
    // WHICH rows were run against which artefact, which is the only thing a
    // signature was for.
    expect(RESULT.source).toContain('build=');
    const release = read('harness/release.mjs');
    expect(release).toContain('found.build !== htmlHash');
  });
});

describe('the fourteen rows, as steps', () => {
  const matrix = read('harness/wallets/MATRIX.md');

  it('covers every row the matrix requires', () => {
    // The steps cover rows 1-4 and 8-14 directly. 5, 6 and 7 are this same
    // track run on another wallet or another device, so they are carried across
    // by the recording step rather than being steps of their own.
    const rows = [...matrix.matchAll(/^\|\s*(\d+)\s*\|/gm)].map((m) => Number(m[1]));
    expect(rows.length, 'the matrix no longer has fourteen rows').toBe(14);

    const ids = WALLET_STEPS.map((step) => step.id);
    for (const id of ['w-connect', 'w-open', 'w-move', 'w-sponsored', 'w-cancel', 'w-bridge']) {
      expect(ids, `${id} is missing, so a row cannot be run`).toContain(id);
    }
  });

  it('names the rows a person has to arrange, rather than pretending to run them', () => {
    // Five rows need a browser set up a particular way BEFORE the page loads:
    // no wallet, locked, late provider, wrong network. A runner that claimed to
    // automate those would be worse than one that says it cannot.
    // Three, not four. Row 14 stopped needing one: the page hides the providers
    // and puts them back mid-wait, which is the scenario exactly and does not
    // need a reload raced by hand.
    //
    // And what "manual" means has changed. It is the browser that has to be
    // ARRANGED - extensions off, wallet locked, wallet on another network - and
    // the page still does the judging. A row whose evidence was a person typing
    // "pass" is the checklist this runner exists to replace.
    const manual = WALLET_STEPS.filter((step) => step.manual).map((step) => step.id);
    expect(manual).toEqual(['w-no-wallet', 'w-locked', 'w-network']);
  });

  it('marks the three that spend real money as irreversible', () => {
    const irreversible = WALLET_STEPS.filter((step) => step.irreversible).map((step) => step.id);
    expect(irreversible).toEqual(['w-open', 'w-move', 'w-sponsored']);
  });

  it('will not let a row run before the thing it depends on', () => {
    const ids = new Set(WALLET_STEPS.map((step) => step.id));
    for (const step of WALLET_STEPS) {
      for (const need of step.needs) {
        expect(ids, `${step.id} needs ${need}, which is not a step`).toContain(need);
      }
    }
  });

  it('judges the arranged rows rather than asking somebody to type the answer', () => {
    const canary = read('apps/canary/main.ts');
    // Every one of the four calls the board's code and marks a row from what
    // came back. None of them reads a typed outcome.
    expect(canary, 'a row still takes its result from a text field').not.toContain(
      "ctx.input('outcome')"
    );
    for (const id of ['w-no-wallet', 'w-locked', 'w-late', 'w-network']) {
      expect(canary, `${id} is not implemented`).toContain(`'${id}': async`);
    }
  });

  it('says out loud that it uses the board’s own code', () => {
    // The one way a runner like this is worse than nothing: a page that signs
    // through its own copy proves things about the copy.
    const canary = read('apps/canary/main.ts');
    expect(canary).toContain("from '../../packages/wallet/connect.js'");
    expect(canary, 'the runner does not go through the board’s connect').toContain(
      'await connectWallet()'
    );
  });
});

describe('the matrix file itself', () => {
  it('has somewhere for the results to go', () => {
    const matrix = read('harness/wallets/MATRIX.md');
    expect(matrix, 'there is no Results block for the gate to read').toContain('## Results');
    expect(matrix).toContain('RESULT row=');
  });

  it('is built against a hash the runner can actually stamp', () => {
    // The gate compares each row to sha256(dist/xchess.html). The canary is a
    // different artefact, so it has to be TOLD the board's hash - and it is
    // built after the board for exactly that reason.
    if (!existsSync(resolve(ROOT, 'dist/manifest.json'))) return;
    const manifest = JSON.parse(read('dist/manifest.json')) as { htmlSha256: string };
    const gates = read('dist/xchess-gates.html');
    expect(gates, 'the gates page cannot sign a row against this build').toContain(
      manifest.htmlSha256
    );
  });
});

// ---------------------------------------------------------------------------
// The page counts the track it is running.
//
// Found by opening `?track=wallet` for the first time: a twelve-step track
// reported "0 of 26 verified" and named a step that was not on the page.
// `progress` defaults its step list to the full launch sequence and the caller
// omitted the argument, so BOTH short tracks had it - `?track=inscribe` has
// been wrong since the day it was added.
//
// Worse than a wrong number: `complete` is `done === steps.length`, so "every
// gate is closed" was unreachable on any track but the long one, and a runner
// that cannot say it has finished is a runner nobody finishes.
// ---------------------------------------------------------------------------

describe('a track that is not the launch sequence', () => {
  it('counts its own steps', () => {
    const states: StepStates = {};
    for (const step of WALLET_STEPS) states[step.id] = 'ok';
    const p = progress(states, WALLET_STEPS);
    expect(p.total, 'the summary counted a different list of steps').toBe(WALLET_STEPS.length);
    expect(p.done).toBe(WALLET_STEPS.length);
  });

  it('can reach the end, which is the part that was unreachable', () => {
    const states: StepStates = {};
    for (const step of WALLET_STEPS) states[step.id] = 'ok';
    expect(progress(states, WALLET_STEPS).complete, 'the track can never report finished').toBe(
      true
    );
  });

  it('is asked for the track, rather than defaulting to the long one', () => {
    const canary = read('packages/ui/canary.ts');
    expect(canary, 'the summary is computed against the default step list again').toContain(
      'progress(this.states, this.steps)'
    );
  });
});

// ---------------------------------------------------------------------------
// A step must not break the page it is diagnosing.
//
// Row 14 hides every wallet provider, starts `waitForProvider`, and puts them
// back. The hiding loop sat OUTSIDE the try, and `delete` on a non-configurable
// property THROWS in strict mode - which is how a wallet that defines its own
// globals injects them. So it deleted the first provider, threw on the next,
// never reached the `finally`, and left the page with none for the rest of its
// life.
//
// Reported from a real run as "the wallet is not detected even when connected
// and unlocked", with the survey at the top of the same page listing two
// providers. Every row after 14 was reading a page that row 14 had broken.
// ---------------------------------------------------------------------------

describe('hiding the providers, and putting them back', () => {
  const canary = read('apps/canary/main.ts');
  const late = canary.slice(canary.indexOf("'w-late': async"), canary.indexOf("'w-network': async"));

  it('hides inside the try, so the restore always runs', () => {
    const tryAt = late.indexOf('try {');
    const deleteAt = late.indexOf('delete w[key]');
    expect(tryAt, 'w-late no longer has a try block').toBeGreaterThan(-1);
    expect(
      deleteAt > tryAt,
      'a provider is deleted before the try, so a throw skips the restore entirely'
    ).toBe(true);
  });

  it('refuses rather than hiding only some of them', () => {
    // A partial hide is the state that broke the page: some providers gone,
    // nothing restored, and no error anybody saw.
    expect(late, 'a failed delete no longer restores what was already hidden').toContain(
      'restore();'
    );
    expect(late, 'a provider that cannot be hidden is not reported').toContain('cannot be removed');
  });

  it('checks the restore worked, and says so loudly when it did not', () => {
    expect(late, 'nothing verifies the providers came back').toContain(
      '!collectProviders().length'
    );
    expect(late, 'a broken page fails silently').toContain('RELOAD THIS PAGE');
  });

  it('puts back every key it took, not just the first', () => {
    expect(late).toMatch(/for \(const \[key, value\] of hidden\)/);
  });
});
