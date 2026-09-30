import { describe, expect, it } from 'vitest';
import {
  boolCV,
  contractPrincipalCV,
  cvToString,
  listCV,
  noneCV,
  responseOkCV,
  someCV,
  standardPrincipalCV,
  tupleCV,
  uintCV
} from '@stacks/transactions';
import {
  artistPayeesFromClarity,
  artistSplitsFromClarity,
  artistSplitsToClarity,
  formatArtistSplits,
  formatShare,
  parseArtistSplits,
  platformSplitsFromClarity
} from '../artist-splits';

const JIM = 'SP3JB6BCKV14CG25NF017CR7KRVSM8RAGHB52DWHX';
const CO = 'SP1A5M0ZRSNQMF8BNPQPM8WWC5PJ6HJ4GEKFP8W4M';
const XTRATA = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

describe('parseArtistSplits', () => {
  it('reads wallet and holder lines as basis points of the artist pool', () => {
    const parsed = parseArtistSplits(`${JIM} 47.5\n${CO} 47.5%\n#3060 5`, { allowance: 3 });
    expect(parsed.errors).toEqual([]);
    expect(parsed.entries).toEqual([
      { recipient: JIM, holderOf: null, shareBps: 4750n },
      { recipient: CO, holderOf: null, shareBps: 4750n },
      { recipient: JIM, holderOf: 3060n, shareBps: 500n }
    ]);
  });

  it('requires exactly 100%', () => {
    expect(parseArtistSplits(`${JIM} 50\n${CO} 49.99`, { allowance: 2 }).errors[0]).toContain('99.99%');
    expect(parseArtistSplits(`${JIM} 60\n${CO} 50`, { allowance: 2 }).errors[0]).toContain('110%');
  });

  it('respects the slots Xtrata allows', () => {
    expect(parseArtistSplits(`${JIM} 50\n${CO} 50`, { allowance: 1 }).errors.join(' ')).toContain('1 artist slot');
  });

  it('keeps the primary artist a wallet and rejects bad lines', () => {
    expect(parseArtistSplits(`#3060 100`, { allowance: 1 }).errors[0]).toContain('primary artist');
    expect(parseArtistSplits(`${XTRATA}.xtrata-v3-2-3 100`, { allowance: 1 }).errors[0]).toContain('not a wallet');
    expect(parseArtistSplits(`${JIM} 0`, { allowance: 1 }).errors[0]).toContain('above 0');
    expect(parseArtistSplits(`${JIM} 12.345`, { allowance: 1 }).errors[0]).toContain('two decimals');
    expect(parseArtistSplits(`${JIM}`, { allowance: 1 }).errors[0]).toContain('then a percentage');
    expect(parseArtistSplits('', { allowance: 1 }).errors[0]).toContain('at least one line');
  });

  it('round-trips through formatArtistSplits', () => {
    const text = `${JIM} 47.5\n${CO} 47.5\n#3060 5`;
    expect(formatArtistSplits(parseArtistSplits(text, { allowance: 3 }).entries)).toBe(text);
    expect(formatShare(505n)).toBe('5.05%');
    expect(formatShare(510n)).toBe('5.1%');
    expect(formatShare(10000n)).toBe('100%');
  });

  it('encodes the list the contract expects', () => {
    const entries = parseArtistSplits(`${JIM} 95\n#3060 5`, { allowance: 2 }).entries;
    expect(cvToString(artistSplitsToClarity(entries))).toBe(cvToString(listCV([
      tupleCV({ recipient: standardPrincipalCV(JIM), 'holder-of': noneCV(), share: uintCV(9500) }),
      tupleCV({ recipient: standardPrincipalCV(JIM), 'holder-of': someCV(uintCV(3060)), share: uintCV(500) })
    ])));
  });
});

describe('reading the v1.9 splits', () => {
  it('parses get-artist-splits and get-artist-payees', () => {
    const splits = responseOkCV(tupleCV({
      allowance: uintCV(3),
      'max-slots': uintCV(8),
      splits: listCV([
        tupleCV({ recipient: standardPrincipalCV(JIM), 'holder-of': noneCV(), share: uintCV(9500) }),
        tupleCV({ recipient: standardPrincipalCV(JIM), 'holder-of': someCV(uintCV(3060)), share: uintCV(500) })
      ])
    }));
    expect(artistSplitsFromClarity(splits)).toEqual({
      allowance: 3,
      maxSlots: 8,
      entries: [
        { recipient: JIM, holderOf: null, shareBps: 9500n },
        { recipient: JIM, holderOf: 3060n, shareBps: 500n }
      ]
    });
    const payees = responseOkCV(listCV([
      tupleCV({ payee: standardPrincipalCV(CO), share: uintCV(500), 'holder-of': someCV(uintCV(3060)) })
    ]));
    expect(artistPayeesFromClarity(payees)).toEqual([{ payee: CO, shareBps: 500n, holderOf: 3060n }]);
  });

  it('parses get-platform-splits', () => {
    const slot = (bps: number) => tupleCV({ recipient: standardPrincipalCV(XTRATA), bps: uintCV(bps) });
    expect(platformSplitsFromClarity(responseOkCV(tupleCV({
      marketplace: slot(250), operator: slot(250), auxiliary: slot(0),
      'total-bps': uintCV(500), 'min-bps': uintCV(250), 'max-bps': uintCV(1500), launched: boolCV(false)
    })))).toEqual({
      marketplace: { recipient: XTRATA, bps: 250n },
      operator: { recipient: XTRATA, bps: 250n },
      auxiliary: { recipient: XTRATA, bps: 0n },
      totalBps: 500n, minBps: 250n, maxBps: 1500n, launched: false
    });
  });

  it('returns null for anything that is not the v1.9 shape (a failed read is not "no splits")', () => {
    expect(artistSplitsFromClarity(uintCV(1))).toBeNull();
    expect(platformSplitsFromClarity(tupleCV({ marketplace: contractPrincipalCV(XTRATA, 'x') }))).toBeNull();
    expect(artistPayeesFromClarity(noneCV())).toBeNull();
  });
});
