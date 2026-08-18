// A player naming themselves.
//
// The format is the easy half. The half that matters is `attested`: inscribing
// costs a signed transaction, so an inscription made BY an address is that key
// speaking, and everything else here is a stranger writing your name down.

import { describe, expect, it } from 'vitest';
import {
  PLAYER_HEADER, PLAYER_LIMITS, attested, buildPlayer, displayName,
  nameSourceNote, parsePlayer
} from '../../packages/protocol/player.js';

const ME = 'SP4ERAJ8SN0J7V3DWZNKBWM7HGWCFV9A3HH62S2S';
const SOMEONE_ELSE = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';
const mine = `${PLAYER_HEADER}\naddress: ${ME}\nname: Jim`;

describe('reading a player manifest', () => {
  it('accepts one with an address and a name', () => {
    const parsed = parsePlayer(mine);
    expect(parsed.ok).toBe(true);
    expect(parsed.player?.name).toBe('Jim');
  });

  it('needs the exact header, so a sweep is a string compare', () => {
    expect(parsePlayer(`x-chess-player/1\naddress: ${ME}\nname: Jim`).ok).toBe(false);
    expect(parsePlayer('name: Jim').ok).toBe(false);
    expect(parsePlayer(null).ok).toBe(false);
  });

  it('requires both an address and a name', () => {
    expect(parsePlayer(`${PLAYER_HEADER}\nname: Jim`).ok, 'address is required').toBe(false);
    expect(parsePlayer(`${PLAYER_HEADER}\naddress: ${ME}`).ok, 'name is required').toBe(false);
  });

  it('refuses something that is not a Stacks address', () => {
    const parsed = parsePlayer(`${PLAYER_HEADER}\naddress: not-an-address\nname: Jim`);
    expect(parsed.ok).toBe(false);
    expect(parsed.problems[0].says).toContain('Stacks address');
  });

  it('bounds every field', () => {
    const long = parsePlayer(`${PLAYER_HEADER}\naddress: ${ME}\nname: ${'x'.repeat(PLAYER_LIMITS.name + 1)}`);
    expect(long.ok).toBe(false);
    expect(long.problems[0].says).toContain(String(PLAYER_LIMITS.name));
  });

  it('names an unknown field rather than ignoring it', () => {
    // An inscription cannot be edited, so somebody who believes a field did
    // something has been misled permanently.
    const parsed = parsePlayer(`${PLAYER_HEADER}\naddress: ${ME}\nname: Jim\nrating: 2400`);
    expect(parsed.ok).toBe(false);
    expect(parsed.problems[0].says).toContain('not a field');
  });

  it('round-trips what it builds', () => {
    const text = buildPlayer({ address: ME, name: 'Jim', about: 'plays the London' });
    expect(parsePlayer(text).ok).toBe(true);
    expect(parsePlayer(text).player?.about).toBe('plays the London');
  });

  it('refuses a field the format no longer has', () => {
    // `pronouns` was removed. An inscription cannot be edited, so a document
    // carrying it must fail rather than be quietly accepted with a field the
    // board will never show — the writer would never learn it did nothing.
    const parsed = parsePlayer(`${PLAYER_HEADER}\naddress: ${ME}\nname: Jim\npronouns: they/them`);
    expect(parsed.ok).toBe(false);
    expect(parsed.problems[0].says).toContain('not a field');
  });
});

describe('whether the claim is the address own claim', () => {
  const parsed = parsePlayer(mine);

  it('attests when the inscription creator is the address it names', () => {
    expect(attested(parsed.player, ME)).toBe(true);
  });

  it('REFUSES when somebody else inscribed it', () => {
    // The whole difference between a player manifest and a stranger writing
    // your name down. The six character sheets at 2994-3000 are exactly this
    // case: inscribed by the Director, not by the wallets they describe.
    expect(attested(parsed.player, SOMEONE_ELSE)).toBe(false);
  });

  it('refuses when the creator could not be read', () => {
    // "Could not ask" is not attestation. A reader that cannot check falls back
    // to the tournament name rather than assuming.
    expect(attested(parsed.player, null)).toBe(false);
  });

  it('does not mind the case an address was pasted in', () => {
    expect(attested(parsed.player, ME.toLowerCase())).toBe(true);
  });
});

describe('which name wins, and why', () => {
  const address = ME;

  it('prefers BNS to everything', () => {
    const shown = displayName({ address, bns: 'jim.btc', player: 'Jim', tournament: 'Plumb' });
    expect(shown).toEqual({ name: 'jim.btc', source: 'bns' });
  });

  it('prefers a self-inscribed name to an organiser name', () => {
    // A signature from the key being named beats a third party's word.
    const shown = displayName({ address, player: 'Jim', tournament: 'Plumb' });
    expect(shown).toEqual({ name: 'Jim', source: 'player' });
  });

  it('falls back to the tournament name, which is why Plumb appears at all', () => {
    expect(displayName({ address, tournament: 'Plumb' })).toEqual({ name: 'Plumb', source: 'tournament' });
  });

  it('falls back to the address, which is always true', () => {
    const shown = displayName({ address });
    expect(shown.source).toBe('address');
    expect(shown.name).toContain('…');
  });

  it('can say where a name came from', () => {
    // The difference between a label and a claim is whether you can ask why.
    expect(nameSourceNote('player')).toContain('by this address itself');
    expect(nameSourceNote('tournament')).toContain('organiser');
  });
});
