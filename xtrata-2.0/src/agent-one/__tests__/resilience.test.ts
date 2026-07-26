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
