/**
 * Wallet-origin side of the bridge.
 *
 * Runs INSIDE the wallet iframe, on the wallet's own origin. This is the only
 * code that ever touches an unsealed seed. It answers a fixed, small set of
 * methods and returns only signed artifacts and addresses.
 */

import {
  BRIDGE_PROTOCOL,
  type BridgeResponse,
  type WalletMethod,
  assertNoSecrets,
  isBridgeRequest
} from './protocol';

export type WalletHandler = (params: unknown, context: RequestContext) => Promise<unknown>;

export interface RequestContext {
  /** Validated origin of the embedding page. Handlers may scope state by it. */
  parentOrigin: string;
}

export interface WalletBridgeHostOptions {
  /**
   * Exact origins permitted to embed and drive this wallet.
   *
   * An allowlist, not a pattern. Wildcards are refused: `*.xtrata.xyz` would
   * admit any subdomain, and one forgotten staging or user-content subdomain is
   * enough to drive somebody's wallet.
   */
  allowedParentOrigins: readonly string[];
  handlers: Partial<Record<WalletMethod, WalletHandler>>;
  listenTarget?: Pick<Window, 'addEventListener' | 'removeEventListener'>;
}

export class WalletBridgeHost {
  private readonly allowed: ReadonlySet<string>;
  private readonly listenTarget: Pick<Window, 'addEventListener' | 'removeEventListener'>;

  constructor(private readonly options: WalletBridgeHostOptions) {
    for (const origin of options.allowedParentOrigins) {
      if (origin === '*' || origin.includes('*')) {
        throw new Error(
          `Refusing wildcard parent origin "${origin}". List exact origins — one stray subdomain is a stolen wallet.`
        );
      }
    }
    this.allowed = new Set(options.allowedParentOrigins);
    this.listenTarget = options.listenTarget ?? window;
    this.listenTarget.addEventListener('message', this.onMessage as EventListener);
  }

  private reply = (event: MessageEvent, response: BridgeResponse): void => {
    const source = event.source as Window | null;
    if (!source) return;
    // Reply only to the validated origin, never '*'.
    source.postMessage(response, event.origin);
  };

  private onMessage = (event: MessageEvent): void => {
    // Origin allowlist first: an unrecognised embedder gets no reply at all,
    // not even an error, so it learns nothing about what lives here.
    if (!this.allowed.has(event.origin)) return;
    if (!isBridgeRequest(event.data)) return;

    const { id, method, params } = event.data;
    const handler = this.options.handlers[method];

    if (!handler) {
      this.reply(event, {
        protocol: BRIDGE_PROTOCOL,
        kind: 'response',
        id,
        ok: false,
        error: { code: 'UNKNOWN_METHOD', message: `Wallet does not implement "${method}".` }
      });
      return;
    }

    void handler(params, { parentOrigin: event.origin })
      .then((result) => {
        // Backstop: refuse to emit anything shaped like key material even if a
        // handler tries to. Fails closed — the caller gets an error, not a seed.
        assertNoSecrets(result);
        this.reply(event, { protocol: BRIDGE_PROTOCOL, kind: 'response', id, ok: true, result });
      })
      .catch((err: unknown) => {
        const error = err as { name?: string; code?: string; message?: string };
        if (error?.name === 'BridgeSecretLeak') {
          // Never let the message echo the offending payload back out.
          this.reply(event, {
            protocol: BRIDGE_PROTOCOL,
            kind: 'response',
            id,
            ok: false,
            error: { code: 'SECRET_LEAK_BLOCKED', message: 'Response blocked: it contained key material.' }
          });
          return;
        }
        this.reply(event, {
          protocol: BRIDGE_PROTOCOL,
          kind: 'response',
          id,
          ok: false,
          error: {
            code: error?.code ?? 'WALLET_ERROR',
            message: error?.message ?? 'The wallet could not complete the request.'
          }
        });
      });
  };

  close(): void {
    this.listenTarget.removeEventListener('message', this.onMessage as EventListener);
  }
}
