/**
 * WebAuthn ceremonies for the listening wallet. The passkey is bound to the wallet
 * origin's hostname (rpId), so it works only on wallet.xtrata.xyz, whichever Xtrata page
 * embeds it. PRF ("hmac-secret") supplies the 32-byte secret the wallet is derived from.
 */
import { LISTENING_PRF_SALT } from '../../lib/listening-wallet/derive';
import type { PasskeyPort } from './engine';

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

function translate(error: unknown): never {
  const name = (error as { name?: string })?.name;
  if (name === 'NotAllowedError' || name === 'AbortError')
    throw new PasskeyRetryable('The passkey request was cancelled or timed out. Try again when ready.');
  if (name === 'InvalidStateError')
    throw new PasskeyRetryable('This device already has a listening-wallet passkey. Use Unlock instead.');
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

export function browserPasskey(): PasskeyPort {
  return {
    available: () => typeof window.PublicKeyCredential === 'function' && !!navigator.credentials,

    async create(exclude: string[] = []) {
      let cred: PublicKeyCredential | null;
      try {
        cred = (await navigator.credentials.create({
          publicKey: {
            rp: { name: 'Xtrata listening wallet', id: location.hostname },
            user: { id: random(16), name: 'Xtrata listening wallet', displayName: 'Xtrata listening wallet' },
            challenge: random(32),
            pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
            authenticatorSelection: { residentKey: 'required', requireResidentKey: true, userVerification: 'required' },
            excludeCredentials: exclude.map((id) => ({ type: 'public-key' as const, id: unb64u(id) })),
            timeout: 120_000,
            extensions: { prf: { eval: { first: LISTENING_PRF_SALT } } } as AuthenticationExtensionsClientInputs
          }
        })) as PublicKeyCredential | null;
      } catch (error) { translate(error); }
      if (!cred) throw new PasskeyRetryable('No passkey was created. Try again when ready.');
      const ext = cred.getClientExtensionResults() as any;
      if (ext?.prf?.enabled === false)
        throw new Error('This passkey cannot support pay-per-play on this device, so no wallet was made. You can delete the "Xtrata listening wallet" passkey from your password manager. Listening stays free.');
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
            extensions: { prf: { eval: { first: LISTENING_PRF_SALT } } } as AuthenticationExtensionsClientInputs
          }
        })) as PublicKeyCredential | null;
      } catch (error) { translate(error); }
      if (!cred) throw new PasskeyRetryable('No passkey was used. Try again when ready.');
      const prf = prfFirst(cred);
      if (!prf)
        throw new Error('This passkey did not return what pay-per-play needs on this device. Nothing was funded or signed. Listening stays free.');
      return { credentialId: b64u(cred.rawId), prf };
    }
  };
}
