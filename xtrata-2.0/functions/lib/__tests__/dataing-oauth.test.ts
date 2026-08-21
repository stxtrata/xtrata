import { describe, expect, it } from 'vitest';

import {
  REDIRECT_URI,
  codeChallengeS256,
  dataingConfig,
  readCookie,
  timingSafeEqual
} from '../dataing-oauth';

describe('dataing oauth helpers', () => {
  it('derives the S256 challenge that RFC 7636 appendix B specifies', async () => {
    // Pinning the spec's own vector, not our output: a challenge that merely
    // matches yesterday's build would still fail against Dataing's server.
    await expect(codeChallengeS256('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).resolves.toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM'
    );
  });

  it('produces url-safe challenges with no padding', async () => {
    const challenge = await codeChallengeS256('a'.repeat(43));
    expect(challenge).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it('treats partial configuration as no configuration', () => {
    expect(dataingConfig({})).toBeNull();
    expect(
      dataingConfig({ DATAING_CLIENT_ID: 'abc', DATAING_AUTHORIZE_URL: 'https://example/authorize' })
    ).toBeNull();
  });

  it('defaults scopes to the console’s required sign-in pair', () => {
    const config = dataingConfig({
      DATAING_CLIENT_ID: 'abc',
      DATAING_AUTHORIZE_URL: 'https://example/authorize',
      DATAING_TOKEN_URL: 'https://example/token'
    });
    expect(config?.scopes).toBe('openid profile');
  });

  it('compares state without leaking length or prefix through early exit', () => {
    expect(timingSafeEqual('abc123', 'abc123')).toBe(true);
    expect(timingSafeEqual('abc123', 'abc124')).toBe(false);
    expect(timingSafeEqual('abc123', 'abc12')).toBe(false);
    expect(timingSafeEqual('', '')).toBe(false);
  });

  it('reads one cookie without matching a name that merely ends the same way', () => {
    const request = new Request('https://xtrata.xyz/auth/dataing/callback', {
      headers: { cookie: 'other_xt_dataing_state=wrong; xt_dataing_state=right' }
    });
    expect(readCookie(request, 'xt_dataing_state')).toBe('right');
  });

  it('pins the redirect URI registered with Dataing', () => {
    // Dataing matches redirect URIs exactly. If this constant changes, the
    // partner console entry has to change in the same commit.
    expect(REDIRECT_URI).toBe('https://xtrata.xyz/auth/dataing/callback');
  });
});
