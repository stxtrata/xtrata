// An agent buying its own name, and the ways that costs money to get wrong.
//
// BNS-V2 burns the STX at PREORDER, before anything is registered. So a wrong
// hash, a wrong charset or a wrong price does not fail safely — it fails with
// 2 STX already gone and a name that can never be claimed with it. (Recoverable
// via `claim-preorder` after 144 Bitcoin blocks, which is a day of waiting and
// somebody remembering.)
//
// Every rule asserted here was read out of the deployed contract rather than out
// of how BNS is usually described, and these tests are what keep them read.

import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import {
  BNS_FUNCTIONS,
  BNS_V2,
  MAX_NAME_PRICE_USTX,
  NAMESPACE,
  NAMING_SYSTEM_PROMPT,
  assertNamingAllowed,
  buildNamingRequest,
  chooseName,
  hashedSaltedFqn,
  nameProblem,
  newSalt
} from '../../harness/wizards/naming.mjs';
import { PERSONALITIES } from '../../harness/wizards/personalities.mjs';
import { WizardSafetyError } from '../../harness/wizards/wizards-core.mjs';

const GAMBIT = PERSONALITIES[0];
const SALT = Buffer.alloc(20, 7);

const fine = {
  live: true,
  contract: BNS_V2,
  functionName: 'name-preorder',
  priceUstx: 2_000_000n,
  name: 'gambit'
};

describe('the hash the contract will recompute', () => {
  it('is hash160, which this platform can actually do', () => {
    // RIPEMD160 is absent from some OpenSSL 3 builds, and a naming step that
    // threw on the first agent would be found at the worst moment.
    const empty = createHash('ripemd160')
      .update(createHash('sha256').update(Buffer.alloc(0)).digest())
      .digest('hex');
    expect(empty, 'hash160 is wrong or unavailable').toBe(
      'b472a266d0bd89c13706a4132ccfb16f7c3b9fcb'
    );
  });

  it('concatenates name, dot, namespace, salt — in that order', () => {
    // Straight from BNS-V2:
    //   (hash160 (concat (concat (concat name 0x2e) namespace) salt))
    // Any other order preorders happily and can NEVER be registered, which is
    // the expensive failure this module is arranged around.
    const expected = createHash('ripemd160')
      .update(
        createHash('sha256')
          .update(
            Buffer.concat([
              Buffer.from('gambit', 'ascii'),
              Buffer.from([0x2e]),
              Buffer.from('btc', 'ascii'),
              SALT
            ])
          )
          .digest()
      )
      .digest();
    expect(hashedSaltedFqn('gambit', NAMESPACE, SALT).equals(expected)).toBe(true);
  });

  it('is 20 bytes, which is what the argument type is', () => {
    expect(hashedSaltedFqn('gambit', NAMESPACE, SALT)).toHaveLength(20);
  });

  it('changes with the salt, or the commitment commits to nothing', () => {
    const a = hashedSaltedFqn('gambit', NAMESPACE, Buffer.alloc(20, 1));
    const b = hashedSaltedFqn('gambit', NAMESPACE, Buffer.alloc(20, 2));
    expect(a.equals(b)).toBe(false);
  });

  it('never reuses a salt, because the contract rejects a hash it has seen', () => {
    const salts = new Set(Array.from({ length: 50 }, () => newSalt().toString('hex')));
    expect(salts.size, 'a salt repeated').toBe(50);
    expect(newSalt()).toHaveLength(20);
  });

  it('refuses to hash a name the contract would reject at register', () => {
    // has-invalid-chars rejects at REGISTER, which is after the burn. Catching
    // it here costs nothing; catching it there costs the preorder.
    expect(() => hashedSaltedFqn('Gambit', NAMESPACE, SALT)).toThrow(WizardSafetyError);
  });
});

describe('what the contract will accept as a name', () => {
  it('takes lowercase letters, digits, hyphen and underscore', () => {
    for (const name of ['gambit', 'the-mason', 'wager_2', 'plumb99']) {
      expect(nameProblem(name), `${name} was rejected`).toBe(null);
    }
  });

  it('refuses everything else, and says which', () => {
    expect(nameProblem('Gambit')).toMatch(/capitals/);
    expect(nameProblem('the mason')).toMatch(/outside a-z/);
    expect(nameProblem('gambit!')).toMatch(/outside a-z/);
    expect(nameProblem('gambit.btc')).toMatch(/outside a-z/);
    expect(nameProblem('ab')).toMatch(/shorter/);
    expect(nameProblem('a'.repeat(21))).toMatch(/longer/);
    expect(nameProblem('')).toMatch(/empty/);
    expect(nameProblem(null as unknown as string)).toMatch(/empty/);
  });
});

describe('choosing a name it can actually have', () => {
  const asks = (...replies: string[]) => {
    let at = 0;
    return async () => replies[Math.min(at++, replies.length - 1)];
  };

  it('takes the first choice when it is free', async () => {
    const result = await chooseName({
      character: GAMBIT,
      ask: asks('gambit'),
      isAvailable: async () => true
    });
    expect(result).toMatchObject({ name: 'gambit', attempts: 1, fallback: false });
  });

  it('tidies a reply that came wrapped in punctuation', async () => {
    const result = await chooseName({
      character: GAMBIT,
      ask: asks('"Gambit."'),
      isAvailable: async () => true
    });
    expect(result.name).toBe('gambit');
  });

  it('strips a .btc the agent added itself', async () => {
    // Asking for "gambit.btc" is the obvious thing to reply and the dot is not
    // a legal character, so an unstripped one would burn an attempt on nothing.
    const result = await chooseName({
      character: GAMBIT,
      ask: asks('gambit.btc'),
      isAvailable: async () => true
    });
    expect(result.name).toBe('gambit');
  });

  it('asks again when the name is taken, and says which ones were', async () => {
    // The common case, not the exception: five of the six names picked by hand
    // for these characters were already registered.
    const seen: string[] = [];
    const result = await chooseName({
      character: GAMBIT,
      ask: async ({ user }: { user: string }) => {
        seen.push(user);
        return seen.length === 1 ? 'gambit' : 'firebrand';
      },
      isAvailable: async (name: string) => name !== 'gambit'
    });
    expect(result.name).toBe('firebrand');
    expect(result.rejected).toEqual(['gambit']);
    expect(seen[1], 'it was not told what was taken').toContain('gambit');
  });

  it('suffixes rather than stalling a tournament', async () => {
    const result = await chooseName({
      character: GAMBIT,
      ask: asks('gambit'),
      isAvailable: async (name: string) => name === 'gambit2'
    });
    expect(result).toMatchObject({ name: 'gambit2', fallback: true });
  });

  it('gives up when nothing it said was ever a usable name', async () => {
    await expect(
      chooseName({ character: GAMBIT, ask: asks('!!!'), isAvailable: async () => true })
    ).rejects.toThrow(/no usable name/);
  });

  it('shows the agent its own character and nothing of the harness', () => {
    const request = buildNamingRequest({ character: { ...GAMBIT, prompt: 'SENTINEL' } });
    expect(request).toMatch(/<character>\nSENTINEL\n<\/character>/);
    expect(NAMING_SYSTEM_PROMPT, 'the entry reached the system prompt').not.toContain('SENTINEL');
    expect(NAMING_SYSTEM_PROMPT, 'it was not told the charset').toMatch(/lowercase/);
  });
});

describe('the gate on a second contract', () => {
  it('allows the ordinary case, or every test below proves nothing', () => {
    expect(assertNamingAllowed(fine).priceUstx).toBe(2_000_000n);
  });

  it('is dry by default like everything else', () => {
    expect(() => assertNamingAllowed({ ...fine, live: false })).toThrow(/dry run/i);
  });

  it('will only ever call the registry', () => {
    // The fleet's gate names ONE contract on purpose. This is a second, and it
    // gets its own gate rather than a new entry in the old one.
    expect(() =>
      assertNamingAllowed({ ...fine, contract: 'SP000000000000000000002Q6VF78.something' })
    ).toThrow(/may only call/);
  });

  it('cannot transfer a name away, only preorder and register', () => {
    // A compromised agent that could call `transfer` could give away the name
    // its owner paid for. It is not on the list.
    expect(BNS_FUNCTIONS).not.toContain('transfer');
    expect(BNS_FUNCTIONS).not.toContain('name-renewal');
    expect(() => assertNamingAllowed({ ...fine, functionName: 'transfer' })).toThrow(
      /may only call/
    );
  });

  it('caps the price whatever the contract quoted', () => {
    // That contract's price function is owner-settable too. A harness that burnt
    // whatever it was told has no upper bound.
    expect(() =>
      assertNamingAllowed({ ...fine, priceUstx: MAX_NAME_PRICE_USTX + 1n })
    ).toThrow(/ceiling/);
  });

  it('refuses a price of zero, which means nobody read it', () => {
    expect(() => assertNamingAllowed({ ...fine, priceUstx: 0n })).toThrow(/never read/);
  });

  it('refuses a name the contract would reject after taking the money', () => {
    expect(() => assertNamingAllowed({ ...fine, name: 'Gambit' })).toThrow(/capitals/);
  });
});
