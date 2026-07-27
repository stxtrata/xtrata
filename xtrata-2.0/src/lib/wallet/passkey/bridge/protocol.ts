/**
 * Wallet bridge protocol.
 *
 * The passkey wallet runs on its OWN ORIGIN inside an iframe. The seed is
 * unsealed, used and wiped entirely inside that origin; the embedding page
 * never receives it. The two sides talk only through the messages defined here.
 *
 * Why the separate origin matters: an in-page key means any XSS anywhere on
 * Xtrata becomes seed theft. Browsers isolate by ORIGIN, so a wallet on its own
 * hostname is unreachable from script running on the main site — the blast
 * radius of an injection on the main site stops at the iframe wall.
 *
 * A same-origin iframe gives NONE of this. `/wallet/` on the main host is not
 * isolation, it is decoration. The wallet needs a genuinely different hostname.
 *
 * Design rule: the protocol has no field capable of carrying a secret. There is
 * no "return me the seed" method and no "return me the private key" result. The
 * 24-word phrase is rendered INSIDE the iframe and never crosses the boundary —
 * `wallet.revealPhrase` returns only an acknowledgement. `assertNoSecrets` below
 * enforces this at runtime, because a protocol that merely omits a dangerous
 * field can grow one by accident.
 */

/** Marker so unrelated postMessage traffic is ignored rather than parsed. */
export const BRIDGE_PROTOCOL = 'xtrata.wallet.bridge.v1';

export type WalletMethod =
  /** Does a wallet exist on this device, and what is its address? */
  | 'wallet.status'
  /** Create a wallet. PRF is proven BEFORE any seed is sealed (PASSKEY-WALLET.md §3.1). */
  | 'wallet.create'
  /** Sign a prepared transaction. Returns signed bytes, never the key. */
  | 'wallet.sign'
  /** Pre-sign a session-wallet return for the server to hold. */
  | 'wallet.preSignReturn'
  /** Display the recovery phrase inside the iframe. Returns acknowledgement only. */
  | 'wallet.revealPhrase';

export const WALLET_METHODS: readonly WalletMethod[] = [
  'wallet.status',
  'wallet.create',
  'wallet.sign',
  'wallet.preSignReturn',
  'wallet.revealPhrase'
];

export interface BridgeRequest {
  protocol: typeof BRIDGE_PROTOCOL;
  kind: 'request';
  id: string;
  method: WalletMethod;
  params?: unknown;
}

export interface BridgeError {
  code: string;
  message: string;
}

export interface BridgeResponse {
  protocol: typeof BRIDGE_PROTOCOL;
  kind: 'response';
  id: string;
  ok: boolean;
  result?: unknown;
  error?: BridgeError;
}

/**
 * Key names that must never appear in a bridge payload.
 *
 * Matched case-insensitively as substrings, so `senderKey`, `SEED_BYTES` and
 * `recoveryPhrase` are all caught. Deliberately blunt: a false positive is a
 * loud developer error, a false negative is a leaked wallet.
 */
const FORBIDDEN_KEY_FRAGMENTS = [
  'seed',
  'mnemonic',
  'phrase',
  'entropy',
  'privatekey',
  'private_key',
  'senderkey',
  'sender_key',
  'secret',
  'prf'
];

export class BridgeSecretLeak extends Error {
  constructor(readonly path: string) {
    super(
      `Bridge payload contains "${path}", which looks like key material. ` +
        'Secrets must never cross the wallet origin boundary. See protocol.ts.'
    );
    this.name = 'BridgeSecretLeak';
  }
}

/**
 * Throw if a payload contains anything shaped like key material.
 *
 * Runs on every outgoing response from the wallet origin. This is a backstop
 * against a future handler casually returning more than it should — the kind of
 * change that reviews miss and that costs users their funds.
 */
export const assertNoSecrets = (value: unknown, path = 'result'): void => {
  if (value === null || typeof value !== 'object') return;

  if (Array.isArray(value)) {
    value.forEach((item, i) => assertNoSecrets(item, `${path}[${i}]`));
    return;
  }

  // Raw bytes are how a seed would most plausibly escape.
  if (value instanceof Uint8Array || value instanceof ArrayBuffer) {
    throw new BridgeSecretLeak(`${path} (raw bytes)`);
  }

  for (const [key, child] of Object.entries(value)) {
    const lowered = key.toLowerCase();
    if (FORBIDDEN_KEY_FRAGMENTS.some((fragment) => lowered.includes(fragment))) {
      throw new BridgeSecretLeak(`${path}.${key}`);
    }
    assertNoSecrets(child, `${path}.${key}`);
  }
};

const isEnvelope = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  (value as Record<string, unknown>).protocol === BRIDGE_PROTOCOL;

export const isBridgeRequest = (value: unknown): value is BridgeRequest =>
  isEnvelope(value) &&
  value.kind === 'request' &&
  typeof value.id === 'string' &&
  value.id.length > 0 &&
  typeof value.method === 'string' &&
  WALLET_METHODS.includes(value.method as WalletMethod);

export const isBridgeResponse = (value: unknown): value is BridgeResponse =>
  isEnvelope(value) &&
  value.kind === 'response' &&
  typeof value.id === 'string' &&
  value.id.length > 0 &&
  typeof value.ok === 'boolean';

/** Correlation id. Unguessable so a hostile frame cannot forge a plausible reply. */
export const newRequestId = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
};
