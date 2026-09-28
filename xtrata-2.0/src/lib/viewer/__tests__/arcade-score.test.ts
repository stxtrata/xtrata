import { describe, it, expect, vi } from 'vitest';
import {
  cvToString,
  responseOkCV,
  uintCV,
  stringAsciiCV,
  FungibleConditionCode,
  addressToString
} from '@stacks/transactions';
import {
  runArcadeScore,
  parseArcadeScore,
  parseArcadeFee,
  ARCADE_SCORE_CONTRACT
} from '../arcade-score';

const address = 'SP1MDNJ5G13C9S3GN4V5AZPN7H68H4ZG9VKG251KM';
const session = { isConnected: true, address, network: 'mainnet' as const };
const txid = '0x' + 'b'.repeat(64);
const args = {
  contract: ARCADE_SCORE_CONTRACT,
  network: 'mainnet',
  address,
  gameId: 'xa_neon_snake',
  mode: 'score',
  score: '4210',
  name: 'JIM'
};
function setup() {
  return {
    session,
    label: 'Inscription #9001',
    guard: vi.fn(),
    readFee: vi.fn(async () => 30000n),
    review: vi.fn(async () => true),
    submit: vi.fn(async (_options: any) => ({ txId: txid }))
  };
}

describe('arcade high-score submission', () => {
  it('builds only the pinned submit-score call with a Deny-mode fee cap', async () => {
    const p = setup();
    const r = await runArcadeScore('xtrata_submitArcadeScore', args, p);
    expect(r).toMatchObject({ status: 'submitted', txid, contract: ARCADE_SCORE_CONTRACT, score: '4210' });
    const call = p.submit.mock.calls[0][0];
    expect(`${call.contractAddress}.${call.contractName}`).toBe(ARCADE_SCORE_CONTRACT);
    expect(call.functionName).toBe('submit-score');
    expect(call.functionArgs.map(cvToString)).toEqual([
      cvToString(stringAsciiCV('xa_neon_snake')),
      'u0',
      'u4210',
      cvToString(stringAsciiCV('JIM'))
    ]);
    expect(call.postConditions).toHaveLength(1);
    expect(call).not.toHaveProperty('sender');
    expect(call).not.toHaveProperty('postConditionMode'); // the host forces Deny itself
    const pc = call.postConditions[0];
    expect(pc.amount).toBe(30000n);
    expect(pc.conditionCode).toBe(FungibleConditionCode.LessEqual);
    expect(addressToString(pc.principal.address)).toBe(address);
    expect(p.review.mock.calls[0][0]).toMatchObject({ kind: 'arcade', fee: '30000', name: 'JIM', gameId: 'xa_neon_snake' });
  });

  it('encodes time mode as u1', async () => {
    const p = setup();
    await runArcadeScore('xtrata_submitArcadeScore', { ...args, mode: 'time', score: 812 }, p);
    expect(cvToString(p.submit.mock.calls[0][0].functionArgs[1])).toBe('u1');
  });

  it('ignores any caller-supplied call shape and refuses other contracts or methods', async () => {
    const p = setup();
    await expect(runArcadeScore('stx_callContract', args, p)).rejects.toMatchObject({ code: -32601 });
    await expect(
      runArcadeScore('xtrata_submitArcadeScore', { ...args, contract: 'SP000000000000000000002Q6VF78.evil' }, p)
    ).rejects.toThrow(/arcade score contract/);
    await runArcadeScore(
      'xtrata_submitArcadeScore',
      { ...args, functionName: 'transfer', postConditionMode: 'allow', postConditions: [], fee: '1' },
      p
    );
    const call = p.submit.mock.calls[0][0];
    expect(call.functionName).toBe('submit-score');
    expect(call.postConditions[0].amount).toBe(30000n);
  });

  it('validates game id, score and name before touching the network', () => {
    const bad = [
      { gameId: 'XA-Bad' },
      { gameId: 'ab' },
      { score: '0' },
      { score: '-5' },
      { score: '1.5' },
      { score: 1e300 },
      { score: '340282366920938463463374607431768211456' },
      { name: 'ab' },
      { name: 'thirteenchars' },
      { name: 'Jïm' },
      { mode: 'lap' },
      { network: 'testnet' },
      { address: 'SP000000000000000000002Q6VF78' }
    ];
    for (const b of bad) expect(() => parseArcadeScore({ ...args, ...b }, session)).toThrow();
    expect(parseArcadeScore({ gameId: 'xa_pong', score: 7, name: ' Ann ' }, session)).toEqual({
      gameId: 'xa_pong',
      mode: 'score',
      score: 7n,
      name: 'Ann'
    });
  });

  it('requires a connected mainnet wallet', async () => {
    const p = setup();
    await expect(
      runArcadeScore('xtrata_submitArcadeScore', args, { ...p, session: { ...session, network: 'testnet' as any } })
    ).rejects.toMatchObject({ code: 4100 });
    await expect(
      runArcadeScore('xtrata_submitArcadeScore', args, { ...p, session: { ...session, isConnected: false } })
    ).rejects.toMatchObject({ code: 4100 });
  });

  it('reports a failed fee read as a failure, never as a zero fee', async () => {
    const p = setup();
    p.readFee.mockRejectedValueOnce(new Error('429 Too Many Requests'));
    await expect(runArcadeScore('xtrata_submitArcadeScore', args, p)).rejects.toThrow(/Could not read the arcade fee/);
    expect(p.review).not.toHaveBeenCalled();
    expect(p.submit).not.toHaveBeenCalled();
  });

  it('refuses fees outside the contract bounds', async () => {
    const p = setup();
    p.readFee.mockResolvedValueOnce(5_000_000n);
    await expect(runArcadeScore('xtrata_submitArcadeScore', args, p)).rejects.toThrow(/Unexpected arcade fee/);
    expect(p.submit).not.toHaveBeenCalled();
  });

  it('stops on cancel and when the fee changes during review', async () => {
    const p = setup();
    p.review.mockResolvedValueOnce(false);
    await expect(runArcadeScore('xtrata_submitArcadeScore', args, p)).rejects.toMatchObject({ code: 4001 });
    p.readFee.mockResolvedValueOnce(30000n).mockResolvedValueOnce(60000n);
    await expect(runArcadeScore('xtrata_submitArcadeScore', args, p)).rejects.toThrow(/fee changed/);
    expect(p.submit).not.toHaveBeenCalled();
  });

  it('rechecks the account after review and before signing', async () => {
    const p = setup();
    p.guard.mockImplementationOnce(() => {}).mockImplementationOnce(() => {}).mockImplementation(() => {
      throw new Error('Wallet account or network changed.');
    });
    await expect(runArcadeScore('xtrata_submitArcadeScore', args, p)).rejects.toThrow(/changed/);
    expect(p.submit).not.toHaveBeenCalled();
  });

  it('reports an unknown wallet outcome instead of claiming success', async () => {
    const p = setup();
    p.submit.mockResolvedValueOnce({} as any);
    await expect(runArcadeScore('xtrata_submitArcadeScore', args, p)).rejects.toMatchObject({ code: -32002 });
  });

  it('parses the get-fee-unit response strictly', () => {
    expect(parseArcadeFee(responseOkCV(uintCV(30000)))).toBe(30000n);
    expect(() => parseArcadeFee(uintCV(30000))).toThrow();
  });
});
