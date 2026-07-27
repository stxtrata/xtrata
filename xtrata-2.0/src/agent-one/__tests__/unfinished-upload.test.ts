import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DEPOSIT, FakeChain, OTHER, PAYER, loadAgent, unloadAgent } from './support/fake-chain';

/**
 * Chunks already uploaded live on-chain under (contentHash, minterPrincipal). ONLY the
 * deposit wallet that started an upload can ever continue or seal it — a fresh wallet
 * begins again at chunk zero and pays for everything a second time.
 *
 * So destroying the deposit key while an upload is half-finished throws away work the
 * user has already paid for, permanently and silently. That is the same duty we already
 * owe an escrowed inscription, and these tests hold it.
 *
 * Giving up on those chunks is still allowed — but only as a deliberate, confirmed act,
 * and never while the wallet still holds anything worth recovering.
 */

let chain: FakeChain;
let agent: any;

beforeEach(async () => {
  chain = new FakeChain();
  agent = await loadAgent(chain);
});
afterEach(() => unloadAgent());

// discardCheck/discardJob are user-facing actions, so they live on the XtrataAgent API
// object rather than the module exports the harness returns.
const api = () => (globalThis as any).window.XtrataAgent;

const HASH = 'ab'.repeat(32);

const job = (over: any = {}) => ({
  jobId: 'job-partial',
  depositAddress: DEPOSIT,
  requiredUstx: '2000000',
  user: PAYER,
  status: 'INSCRIBING',
  uri: 'big-file.wav',
  uploadHash: HASH,
  uploadTotal: 459,
  ...over
});

describe('finding a half-finished upload', () => {
  it('reports one when the chain says chunks are already up', async () => {
    chain.uploads.set(`${HASH}:${DEPOSIT}`, 416);
    const r = await agent.unsealedUploadFor(job(), DEPOSIT);
    expect(r.ok).toBe(true);
    expect(r.partial).toEqual([{ uri: 'big-file.wav', uploaded: 416, total: 459 }]);
  });

  it('reports none when nothing has been uploaded yet', async () => {
    const r = await agent.unsealedUploadFor(job(), DEPOSIT);
    expect(r).toEqual({ partial: [], ok: true });
  });

  it('ignores an upload that already sealed into a token', async () => {
    chain.uploads.set(`${HASH}:${DEPOSIT}`, 459);
    const r = await agent.unsealedUploadFor(job({ tokenId: '2900' }), DEPOSIT);
    expect(r.partial).toEqual([]);
  });

  it('finds nothing under a DIFFERENT wallet — which is the whole problem', async () => {
    chain.uploads.set(`${HASH}:${DEPOSIT}`, 416);
    // A new deposit wallet is a different principal, so the contract has no upload for
    // it: those 416 chunks are unreachable to anyone but DEPOSIT, for ever.
    const r = await agent.unsealedUploadFor(job(), OTHER);
    expect(r.partial).toEqual([]);
  });

  it('says ok:false when it could not find out, rather than "nothing there"', async () => {
    chain.uploads.set(`${HASH}:${DEPOSIT}`, 416);
    chain.fail('/v2/contracts/call-read/', 503);
    const r = await agent.unsealedUploadFor(job(), DEPOSIT);
    expect(r.ok).toBe(false);
  });
});

describe('clearing a job is refused while anything is still recoverable', () => {
  const seed = (over: any = {}) => {
    const { mnemonic } = agent.newWallet();
    const dep = agent.deriveFrom(mnemonic);
    const j = job({ ephemeralMnemonic: mnemonic, depositAddress: dep.address, ...over });
    localStorage.setItem(`xao-job-${j.jobId}`, JSON.stringify(j));
    return dep;
  };

  it('refuses while STX is still in the deposit wallet', async () => {
    const dep = seed();
    chain.fund(dep.address, 900_000n);
    const chk = await api().discardCheck('job-partial');
    expect(chk.safe).toBe(false);
    expect(chk.reasons.join(' ')).toMatch(/still in the deposit wallet/);
    await expect(api().discardJob('job-partial', 'i-accept-losing-the-unfinished-upload'))
      .rejects.toThrow(/refusing to discard/);
  });

  it('refuses while an inscription is still in the deposit wallet', async () => {
    const dep = seed();
    chain.index.set(dep.address, ['2878']);
    chain.owners.set('2878', dep.address);
    const chk = await api().discardCheck('job-partial');
    expect(chk.safe).toBe(false);
    expect(chk.reasons.join(' ')).toMatch(/#2878/);
    await expect(api().discardJob('job-partial', 'i-accept-losing-the-unfinished-upload'))
      .rejects.toThrow(/still holds inscription/);
  });

  it('refuses when it cannot confirm the wallet is empty', async () => {
    seed();
    chain.fail('/balances/stx', 503);
    const chk = await api().discardCheck('job-partial');
    expect(chk.safe).toBe(false);
    expect(chk.unknown).toBe(true);
    // Destroying a key on an unanswered question is the one thing that must not happen.
    await expect(api().discardJob('job-partial', 'i-accept-losing-the-unfinished-upload')).rejects.toThrow();
  });

  it('refuses without the explicit consent token', async () => {
    seed();
    await expect(api().discardJob('job-partial', 'yes')).rejects.toThrow(/explicit confirmation/);
    expect(localStorage.getItem('xao-job-job-partial')).not.toBeNull();
  });
});

describe('clearing a job when everything is already home', () => {
  it('allows it, and says what is being given up', async () => {
    const { mnemonic } = agent.newWallet();
    const dep = agent.deriveFrom(mnemonic);
    const j = job({ ephemeralMnemonic: mnemonic, depositAddress: dep.address });
    localStorage.setItem(`xao-job-${j.jobId}`, JSON.stringify(j));
    chain.uploads.set(`${HASH}:${dep.address}`, 416);   // paid-for chunks, nothing else left

    const chk = await api().discardCheck('job-partial');
    expect(chk.safe).toBe(true);                        // a partial upload does NOT block
    expect(chk.reasons).toEqual([]);
    expect(chk.partial).toEqual([{ uri: 'big-file.wav', uploaded: 416, total: 459 }]);

    await api().discardJob('job-partial', 'i-accept-losing-the-unfinished-upload');
    expect(localStorage.getItem('xao-job-job-partial')).toBeNull();
  });

  it('is safe for a job that never had a key at all', async () => {
    const j = job({ status: 'CANCELLED', ephemeralMnemonic: undefined });
    localStorage.setItem(`xao-job-${j.jobId}`, JSON.stringify(j));
    expect((await api().discardCheck('job-partial')).safe).toBe(true);
    await api().discardJob('job-partial', 'i-accept-losing-the-unfinished-upload');
    expect(localStorage.getItem('xao-job-job-partial')).toBeNull();
  });
});
