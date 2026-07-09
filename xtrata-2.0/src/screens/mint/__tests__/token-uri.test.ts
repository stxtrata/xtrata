import { describe, expect, it } from 'vitest';
import { resolveMintTokenUri, TOKEN_URI_REQUIRED_ERROR } from '../token-uri';

const DEFAULT_URI = 'https://xtrata.example/default-metadata.json';

describe('resolveMintTokenUri', () => {
  it('uses the default only when the default choice is affirmatively selected', () => {
    expect(
      resolveMintTokenUri({
        choice: 'default',
        customValue: '',
        defaultTokenUri: DEFAULT_URI
      })
    ).toEqual({ ok: true, value: DEFAULT_URI });
  });

  it('never silently falls back to the default for a blank custom URI', () => {
    const result = resolveMintTokenUri({
      choice: 'custom',
      customValue: '   ',
      defaultTokenUri: DEFAULT_URI
    });
    expect(result).toEqual({ ok: false, error: TOKEN_URI_REQUIRED_ERROR });
    // Critically, the default URI must not leak through on error.
    if (!result.ok) {
      expect(result.error).not.toContain(DEFAULT_URI);
    }
  });

  it('returns the trimmed custom URI when provided', () => {
    expect(
      resolveMintTokenUri({
        choice: 'custom',
        customValue: '  https://me.example/meta.json  ',
        defaultTokenUri: DEFAULT_URI
      })
    ).toEqual({ ok: true, value: 'https://me.example/meta.json' });
  });

  it('honours a fixed (restriction-forced) token URI over any choice', () => {
    expect(
      resolveMintTokenUri({
        fixedTokenUri: 'https://forced.example/meta.json',
        choice: 'custom',
        customValue: 'https://ignored.example',
        defaultTokenUri: DEFAULT_URI
      })
    ).toEqual({ ok: true, value: 'https://forced.example/meta.json' });
  });
});
