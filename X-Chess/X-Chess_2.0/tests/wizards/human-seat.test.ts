// A person should be able to sit in a tournament the runner is playing.
//
// The harness refused any manifest containing an entrant it held no key for —
// "a tournament can only be played by whoever can sign for it" — and refused
// again a few lines earlier for having no character inscription to read. Both
// are right for a character and wrong for a person, so the one thing anybody
// actually wants (play a house player yourself) was the one thing it could not
// be pointed at.
//
// `kind: 'human'` has been in the manifest format since it was written and
// nothing read it. Now it does.

import { describe, expect, it } from 'vitest';
import { personSeat, seatForPerson, waitForPerson } from '../../harness/wizards/run-tournament.mjs';

const WHO = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

describe('the seat a person plays', () => {
  it('needs no character inscription', () => {
    // A person is not a character; there is nothing on chain to parse.
    const seat = personSeat({ name: 'Jim', address: WHO, kind: 'human' });
    expect(seat.entryId).toBeNull();
    expect(seat.prompt).toBeNull();
    expect(seat.human).toBe(true);
  });

  it('carries no key, whatever it is handed', () => {
    // THE SAFETY PROPERTY. `personSeat` takes the entrant alone and never the
    // fleet, so there is no argument that could put a signing key on this seat
    // — including an entrant that tries to smuggle one in.
    const seat = personSeat({
      name: 'Jim', address: WHO, kind: 'human',
      key: 'deadbeef', entry: 3000
    } as never);
    expect(seat.key).toBeNull();
    expect(seat.entryId).toBeNull();
    expect(personSeat.length, 'it must not accept a wallets argument').toBe(1);
  });

  it('is ready to be played, and is not ready without an address', () => {
    // Ready means the seat can be played, not that this runner plays it.
    expect(personSeat({ name: 'Jim', address: WHO, kind: 'human' }).ready).toBe(true);
    expect(personSeat({ name: 'Jim', address: '', kind: 'human' }).ready).toBe(false);
  });

  it('takes its id from the name, since there is no wallet to take one from', () => {
    expect(personSeat({ name: 'Jim', address: WHO, kind: 'human' }).id).toBe('jim');
  });
});

describe('waiting for a person to move', () => {
  const mover = { name: 'Jim', human: true };

  it('returns once the log grows', async () => {
    let calls = 0;
    const grew = await waitForPerson({
      gameId: 7, mover, since: 4,
      read: async () => {
        calls++;
        return calls >= 2 ? new Array(5) : new Array(4);
      },
      poll: 1, capMinutes: 1
    });
    expect(grew).toBe(true);
    expect(calls, 'it should stop asking once they have moved').toBe(2);
  });

  it('gives up when the cap runs out, rather than never returning', async () => {
    const gave = await waitForPerson({
      gameId: 7, mover, since: 4,
      read: async () => new Array(4),
      poll: 1, capMinutes: 0.002
    });
    expect(gave).toBe(false);
  });

  it('keeps waiting through a failed read', async () => {
    // A read that failed says nothing about whether they moved. Treating it as
    // "no move" would be right; treating it as an error would end the game.
    let calls = 0;
    const grew = await waitForPerson({
      gameId: 7, mover, since: 4,
      read: async () => {
        calls++;
        if (calls === 1) throw new Error('offline');
        return new Array(5);
      },
      poll: 1, capMinutes: 1
    });
    expect(grew).toBe(true);
    expect(calls).toBe(2);
  });

  it('does not treat a log that shrank as a move', async () => {
    // An indexer behind the chain returns a short log. That is not somebody
    // moving, and returning true here would send the runner to replay a
    // position the person has not reached.
    const gave = await waitForPerson({
      gameId: 7, mover, since: 4,
      read: async () => new Array(3),
      poll: 1, capMinutes: 0.002
    });
    expect(gave).toBe(false);
  });
});

describe('naming the person on the other side', () => {
  it('takes an address', () => {
    const seat = seatForPerson('black', WHO, 'Jim');
    expect(seat?.address).toBe(WHO);
    expect(seat?.name).toBe('Jim');
    expect(seat?.human).toBe(true);
  });

  it('refuses a .btc name rather than resolving it', () => {
    // The board resolves BNS; this must not. The seat is committed at the
    // moment the game opens and cannot be corrected, so a lookup that answered
    // with the wrong address would put a stranger in the game permanently.
    expect(() => seatForPerson('black', 'jim.btc')).toThrow(/Stacks address/);
  });

  it('refuses anything that is not an address', () => {
    for (const bad of ['', '0x1234', 'SP', 'not an address', 'BP3JNSEXAZP4BDSHV0DN3M8R3P0MY0']) {
      if (bad === '') expect(seatForPerson('white', bad), 'absent means no person').toBeNull();
      else expect(() => seatForPerson('white', bad), `accepted "${bad}"`).toThrow();
    }
  });

  it('is absent when the flag is not given, so the seat stays a character', () => {
    expect(seatForPerson('white', null)).toBeNull();
    expect(seatForPerson('white', undefined)).toBeNull();
  });

  it('falls back to a side name when none is given', () => {
    expect(seatForPerson('white', WHO)?.name).toBe('White');
    expect(seatForPerson('black', WHO)?.name).toBe('Black');
  });

  it('upper-cases the address, because identity is the address', () => {
    expect(seatForPerson('black', WHO.toLowerCase())?.address).toBe(WHO);
  });
});
