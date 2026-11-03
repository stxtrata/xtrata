// @vitest-environment node
import {describe, it, expect} from 'vitest';
import {Cl, cvToHex} from '@stacks/transactions';
import {handleChampion, parseChampion} from '../../lib/arcade-champion';

const PLAYER = 'SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN';
const entry = Cl.some(Cl.tuple({
  player: Cl.standardPrincipal(PLAYER), name: Cl.stringAscii('JIMBO'), score: Cl.uint(123456),
  'stacks-height': Cl.uint(7000000), 'burn-height': Cl.uint(900000), 'engine-id': Cl.uint(1), 'replay-hash': Cl.bufferFromHex('00'.repeat(32))
}));
const reply = (result: string, status = 200) => async () => new Response(JSON.stringify({okay: true, result}), {status});

describe('arcade champion', () => {
  it('returns rank 1 as name and score', async () => {
    const res = await handleChampion({}, reply(cvToHex(entry)) as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({version: 1, name: 'JIMBO', score: 123456, player: PLAYER, stacksHeight: 7000000});
  });
  it('reports an empty board as empty, not as a failure', async () => {
    const res = await handleChampion({}, reply(cvToHex(Cl.none())) as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({version: 1, empty: true});
  });
  it('reports a failed read as unavailable and does not cache it', async () => {
    const res = await handleChampion({}, (async () => new Response('x', {status: 500})) as any);
    expect(res.status).toBe(503);
    expect(res.headers.get('cache-control')).toBe('no-store');
  });
  it('rejects malformed entries', () => {
    expect(parseChampion({value: {name: {value: '<b>x</b>'}, score: {value: '5'}, player: {value: PLAYER}}})).toBeNull();
    expect(parseChampion(null)).toBeNull();
  });
});
