import { describe, expect, it } from 'vitest';
import { condenseName, playerIdAddress, shortAddress } from '../player-id';

const ROOT = 'SP3FZPXJQEWZB7YNFH472WJYXZ3F4Q4WSF5S5K0Q8';
const ALBUM = 'SPHRV6ESV321YCV6W990X4FKXB4S9D7F665FSCTV';

describe('the player address at the top of the radio', () => {
  it('is the passkey\'s own wallet, even while an album\'s wallet is open', () => {
    expect(playerIdAddress({ step: 'ready', root: ROOT, listening: ALBUM })).toBe(ROOT);
    expect(playerIdAddress({ step: 'locked', root: undefined, listening: ROOT })).toBe(ROOT);
  });
  it('is not shown where there is no player of this device to show', () => {
    for (const step of ['off', 'elsewhere', 'not-invited', 'unsupported'] as const) expect(playerIdAddress({ step, root: ROOT, listening: ROOT })).toBeUndefined();
    expect(playerIdAddress({ step: 'intro', root: undefined, listening: undefined })).toBeUndefined();
    expect(playerIdAddress({ step: 'ready', root: 'not-an-address', listening: undefined })).toBeUndefined();
  });
  it('shortens an address to both ends', () => {
    expect(shortAddress(ROOT)).toBe('SP3FZP…K0Q8');
  });
  it('shows a name whole when it fits, and keeps its ending when it does not', () => {
    expect(condenseName('jim.btc')).toBe('jim.btc');
    expect(condenseName('melophonic.btc')).toBe('melophonic.btc');
    const long = condenseName('averyveryverylongname.btc');
    expect([...long].length).toBe(16);
    expect(long.endsWith('ame.btc')).toBe(true);
    expect(long.startsWith('avery')).toBe(true);
  });
});
