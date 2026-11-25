/**
 * WebAuthn ceremonies for the listening wallet. The passkey is bound to the wallet
 * origin's hostname (rpId), so it works only on wallet.xtrata.xyz, whichever Xtrata page
 * embeds it. PRF ("hmac-secret") supplies the 32-byte secret the wallet is derived from.
 */
import { LISTENING_PRF_SALT } from '../../lib/listening-wallet/derive';
import type { PasskeyPort } from './engine';
import { webkitOnly } from '../../lib/listening-wallet/webkit';

const b64u = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = (s: string) => {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
};
const random = (n: number) => crypto.getRandomValues(new Uint8Array(n));

/** NotAllowedError covers cancel, timeout and missing iframe permission. All are retryable. */
export class PasskeyRetryable extends Error {
  readonly retryable = true;
  constructor(message: string) { super(message); this.name = 'PasskeyRetryable'; }
}

/**
 * What differs between the wallets built on these ceremonies. The radio's values are the defaults; the casino wallet
 * (src/casino-wallet/frame) passes its own salt and wording. Changing `salt` for an existing wallet moves it: never do that.
 */
export interface PasskeyOptions {
  /** PRF input. */
  salt: Uint8Array;
  /** Relying-party display name shown by the browser. */
  rpName: string;
  /** Passkey name when the caller gives none. */
  defaultName: string;
  messages: {
    /** InvalidStateError: the device already has one of these passkeys. */
    duplicate: string;
    /** The passkey was created but says PRF is unavailable. */
    noPrf: string;
    /** A sign-in returned no PRF result. */
    prfMissing: string;
  };
}

export const LISTENING_PASSKEY: PasskeyOptions = {
  salt: LISTENING_PRF_SALT,
  rpName: 'Xtrata listening wallet',
  defaultName: 'Xtrata listening wallet',
  messages: {
    duplicate: 'This device already has a listening-wallet passkey. Use Unlock instead.',
    noPrf: 'This passkey cannot support pay-per-play on this device, so no wallet was made. You can delete the "Xtrata listening wallet" passkey from your password manager. Listening stays free.',
    prfMissing: 'This passkey did not return what pay-per-play needs on this device. Nothing was funded or signed. Listening stays free.'
  }
};

function translate(error: unknown, o: PasskeyOptions): never {
  const name = (error as { name?: string })?.name;
  if (name === 'NotAllowedError' || name === 'AbortError')
    throw new PasskeyRetryable('The passkey request was cancelled or timed out. Try again when ready.');
  if (name === 'InvalidStateError')
    throw new PasskeyRetryable(o.messages.duplicate);
  if (name === 'SecurityError')
    throw new Error('Passkeys are blocked here. The page must embed the wallet with passkey permission.');
  throw error instanceof Error ? error : new Error('The passkey request failed.');
}

const prfFirst = (cred: PublicKeyCredential): Uint8Array | undefined => {
  const first = (cred.getClientExtensionResults() as any)?.prf?.results?.first;
  if (!first) return undefined;
  if (first instanceof ArrayBuffer) return new Uint8Array(first.slice(0));
  const view = first as ArrayBufferView;
  return new Uint8Array(view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength));
};

/** The page this frame sits in, by origin (never its address: a frame is not told that). Empty when it cannot be told. */
const parentOrigin = (): string => {
  try {
    const a = (location as unknown as { ancestorOrigins?: { length: number; [i: number]: string } }).ancestorOrigins;
    if (a && a.length) return String(a[0]);
    return document.referrer ? new URL(document.referrer).origin : '';
  } catch { return ''; }
};

/**
 * `returnOrigins`: the exact parent origins (the build's own list) that the create page may send the listener back to.
 * Given, the passkey is made in THIS tab and the listener is returned to the radio; without it, in a new tab as before.
 */
export function browserPasskey(o: PasskeyOptions = LISTENING_PASSKEY, returnOrigins: string[] = []): PasskeyPort {
  const returnTo = () => { const p = parentOrigin(); return p && returnOrigins.includes(p) ? p : ''; };
  return {
    available: () => typeof window.PublicKeyCredential === 'function' && !!navigator.credentials,

    async create(exclude: string[] = [], name = o.defaultName, userId?: string) {
      let cred: PublicKeyCredential | null;
      try {
        cred = (await navigator.credentials.create({
          publicKey: {
            rp: { name: o.rpName, id: location.hostname },
            user: { id: userId ? unb64u(userId) : random(16), name, displayName: name },
            challenge: random(32),
            pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
            authenticatorSelection: { residentKey: 'required', requireResidentKey: true, userVerification: 'required' },
            excludeCredentials: exclude.map((id) => ({ type: 'public-key' as const, id: unb64u(id) })),
            timeout: 120_000,
            extensions: { prf: { eval: { first: o.salt } } } as AuthenticationExtensionsClientInputs
          }
        })) as PublicKeyCredential | null;
      } catch (error) { translate(error, o); }
      if (!cred) throw new PasskeyRetryable('No passkey was created. Try again when ready.');
      const ext = cred.getClientExtensionResults() as any;
      if (ext?.prf?.enabled === false)
        throw new Error(o.messages.noPrf);
      return { credentialId: b64u(cred.rawId), prf: prfFirst(cred) };
    },

    async evaluate(credentialId?: string) {
      let cred: PublicKeyCredential | null;
      try {
        cred = (await navigator.credentials.get({
          publicKey: {
            challenge: random(32),
            rpId: location.hostname,
            userVerification: 'required',
            timeout: 120_000,
            allowCredentials: credentialId ? [{ type: 'public-key', id: unb64u(credentialId) }] : [],
            extensions: { prf: { eval: { first: o.salt } } } as AuthenticationExtensionsClientInputs
          }
        })) as PublicKeyCredential | null;
      } catch (error) { translate(error, o); }
      if (!cred) throw new PasskeyRetryable('No passkey was used. Try again when ready.');
      const prf = prfFirst(cred);
      if (!prf)
        throw new Error(o.messages.prfMissing);
      const handle = (cred.response as AuthenticatorAssertionResponse).userHandle;
      return { credentialId: b64u(cred.rawId), prf, userHandle: handle ? b64u(handle) : undefined };
    },

    createsInNewTab: () => window.top !== window && webkitOnly(navigator.userAgent),
    createsInSameTab: () => !!returnTo(),

    openCreator(exclude, name, userId) {
      const params = new URLSearchParams({ u: userId, n: name });
      if (exclude.length) params.set('x', exclude.join(','));
      // Same tab when the radio is a page we may return to: the whole tab goes to the create page (this runs inside
      // the listener's tap, which is what lets a frame move the tab), and that page sends them back when the passkey
      // is saved. Only the radio's origin travels (`r`), and the create page checks it against its own list.
      const back = returnTo();
      if (back) {
        params.set('r', back);
        try { window.top!.location.href = `${location.origin}/create#${params}`; return; } catch { params.delete('r'); /* not allowed here: a new tab, as before */ }
      }
      // A top-level page on this same origin; no opener link back to the frame or the radio page.
      window.open(`${location.origin}/create#${params}`, '_blank', 'noopener');
    }
  };
}

// Which browsers cannot create a passkey inside this frame: shared with the radio page (lib/listening-wallet/webkit.ts).
export { webkitOnly } from '../../lib/listening-wallet/webkit';
