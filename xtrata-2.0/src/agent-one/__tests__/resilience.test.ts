import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const core = readFileSync(new URL('../agent-core.ts', import.meta.url), 'utf8');
const suno = readFileSync(new URL('../../../xtrata-agent-one/wizard/suno.html', import.meta.url), 'utf8');
const wizard = readFileSync(new URL('../../../xtrata-agent-one/wizard/index.html', import.meta.url), 'utf8');

describe('storage durability', () => {
  it('asks the browser to keep the deposit key and file, and records the answer', () => {
    // Browser storage is disposable by default; both the key and the file live there.
    expect(core).toContain('export async function requestDurableStorage()');
    expect(core).toContain("return (await s.persist()) ? 'granted' : 'refused'");
    expect(core).toContain('const durability = await requestDurableStorage()');
    expect(core).toContain('storageDurability: durability');
  });

  it('makes a failed file save visible instead of a console line', () => {
    // It used to console.warn and carry on, so a job looked healthy while having
    // silently lost the ability to resume.
    expect(core).toContain('lastBytesPersistError = errMsg(e)');
    expect(core).toContain('could not save the file for resume');
    expect(suno).toContain('getBytesPersistError');
  });
});

describe('the tab-open warning', () => {
  it('is a persistent banner, not one of the rotating tips', () => {
    expect(suno).toContain('id="keepOpen"');
    expect(suno).toContain('function renderKeepOpen(');
    // Concrete progress: a bar that stops moving looks identical to a crash.
    expect(suno).toContain('chunks on-chain so far');
  });

  it('guards an accidental close on BOTH wizard surfaces', () => {
    for (const [name, html] of [['suno', suno], ['wizard', wizard]] as const) {
      expect(html, `${name} has no beforeunload guard`).toContain("addEventListener('beforeunload'");
    }
  });
});

describe('a paused job is not a stalled job', () => {
  it('credits back time when the agent was not running', () => {
    // The reaper expires on wall-clock "no progress"; the agent only runs while the
    // tab is open, so a closed tab could get a healthy job refunded on reopen.
    expect(core).toContain('const HEARTBEAT_KEY');
    expect(core).toContain('function creditClosedTime()');
    expect(core).toContain('creditClosedTime();');
    // fundedAt drives the parent-escrow window, which has the same problem.
    expect(core).toContain('if (j.fundedAt) j.fundedAt = shift(j.fundedAt)');
    expect(core).toContain('setInterval(noteAlive');
  });
});

describe('finish without me', () => {
  it('is hidden unless a handoff endpoint is configured', () => {
    expect(core).toContain('const HANDOFF_ENDPOINT');
    expect(core).toContain('handoffAvailable: () => !!HANDOFF_ENDPOINT');
    expect(suno).toContain('A.handoffAvailable&&A.handoffAvailable()');
  });

  it('refuses without explicit consent', () => {
    expect(core).toContain("if (consent !== HANDOFF_CONSENT) throw new Error('handoff requires explicit consent')");
    // The same token has to be passed by the UI, so consent cannot be implicit.
    expect(suno).toContain("const HANDOFF_CONSENT='i-agree-xtrata-may-finish-this-job'");
    expect(suno).toContain('handoffJob(JOB.jobId, HANDOFF_CONSENT)');
  });

  it('says plainly what changes before asking', () => {
    // The whole point is that custody changes; burying that would be the failure.
    expect(suno).toMatch(/only be spent by this browser tab/i);
    expect(suno).toMatch(/THIS ONE JOB/);
  });

  it('keeps the local copy so a failed handoff cannot strand the job', () => {
    expect(core).toContain('job.handedOffAt = new Date().toISOString()');
    expect(core).not.toContain('delete job.ephemeralMnemonic;\n  writeJob(job);\n  xaoLog(id, `handed');
    expect(core).toContain('the browser copy is kept so this tab can still resume or refund');
  });

  it('scopes the handoff to one job, never the user wallet', () => {
    const fn = core.slice(core.indexOf('async function handoffJob'), core.indexOf('Do not count time when nobody'));
    expect(fn).toContain('jobId: job.jobId');
    expect(fn).toContain('ephemeralMnemonic: job.ephemeralMnemonic');
    expect(fn).not.toMatch(/walletSession|userMnemonic|seedPhrase/);
  });
});

// The custody promise is the strongest thing we can say, so it has to stay TRUE.
// "Nothing leaves your computer" would be false — the file goes on-chain, and the
// key can leave if the user hands the job over. The claim is deliberately narrower
// and therefore checkable: the deposit wallet is browser-created and browser-only.
describe('self-custody is stated where the doubt actually is', () => {
  it('appears at the payment moment on both surfaces', () => {
    // Someone about to send real money to an address they have never seen.
    expect(wizard).toContain('This is your own wallet, not ours.');
    expect(wizard).toContain('holds the only key');
    expect(suno).toContain('Your browser created this wallet and holds the only key');
  });

  it('says it in the keep-open banner, where it explains the constraint too', () => {
    expect(suno).toMatch(/your browser created and only it can spend from/i);
    expect(suno).toMatch(/why nobody else can touch your funds/i);
  });

  it('sets the expectation in both heroes', () => {
    expect(suno).toContain('Self-custody, start to finish.');
    expect(wizard).toMatch(/one-shot wallet your own browser creates and controls/i);
  });

  it('does not overclaim that nothing leaves the machine', () => {
    // The file DOES leave — that is the product. Conflating the two would be a
    // promise we could not keep.
    for (const html of [suno, wizard]) {
      expect(html).not.toMatch(/nothing (ever )?leaves your (computer|machine)/i);
    }
    // The old line read as a custody claim but was about the preview; it is gone.
    expect(suno).not.toContain('Nothing leaves your browser until you pay.');
    expect(suno).toContain('Your song stays on your machine until you pay');
  });

  it('qualifies the promise only where the handoff is actually offered', () => {
    // An unexplained caveat is worse than none, and an unqualified promise beside a
    // button that breaks it is worse still.
    expect(suno).toContain('function handoffOffered()');
    expect(suno).toContain("(handoffOffered()?', unless you hand this job over below':'')");
    // The wizard has no handoff button, so it carries no caveat.
    expect(wizard).not.toContain('handoffOffered');
  });
});
